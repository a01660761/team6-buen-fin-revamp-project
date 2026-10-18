Idealized and prepared with the assistance of *ChatGPT-6.1 Sol* - **We're also still responsible for reviewing, approving, implementing, and validating its proposal**. For this document, we wanted to define how the information would travel through the front- and backend, considering that the back's HTTP response is different from the result that React Admin obtains from the 'dataProvider'. Just like [data-model.md](./data-model.md), this document's main purpose is explicitly to keep a registry on the decisions we took in regards to the backend data structure and its foundation using MongoDB.

# Minimum API Contract

Status: Proposed contract for implementation.

This document defines target behavior.
It does not claim that the starter backend already implements these routes.

See [data-model.md](./data-model.md) for fields, references, visibility,
validation rules, and public/private projections.

## 1. Transport and resource conventions

- Request and response bodies use JSON, except successful logout.
- Resource names use lowercase English plurals.
- IDs and references are strings in API responses.
- No /api version prefix is required for this minimum contract.
- Deployment transport and origin configuration are documented under TECH-03.
- API errors contain a JSON message rather than an HTML error page.

Public query routes begin with /public.
Management routes require authentication.

## 2. Authentication

Protected requests use:

```http
Authorization: Bearer <token>
```

Authentication middleware must:

1. Verify the JWT signature and expiration.
2. Resolve the user identified by the sub claim.
3. Reject missing or inactive users.
4. Compare the JWT tokenVersion with the user's current tokenVersion.
5. Obtain the authoritative role from the current user record.
6. Enforce operation and ownership permissions.

JWT payload:

- sub: actual user ID.
- tokenVersion: current user tokenVersion.
- Standard issued-at and expiration claims.

JWT lifetime: 900 seconds.
No refresh-token mechanism is required for the MLP.

A submitted role or frontend permission flag is not trusted.

The starter's Authentication header is replaced by Authorization when
US-04.1 and US-04.2 implement this contract together.

### POST /registrarse

Public endpoint.

Request:

```json
{
  "email": "representante@example.com",
  "password": "example-password-123",
  "firstName": "Ana",
  "lastName": "Perez",
  "phone": "5555555555"
}
```

phone is optional.

The server creates a business account.
role, isActive, tokenVersion, and passwordHash are not accepted inputs.

Success: 201 Created with the sanitized user record.

Registration does not automatically log the user in.

Duplicate normalized email: 409 Conflict.

### POST /login

Public endpoint.

Request:

```json
{
  "email": "representante@example.com",
  "password": "example-password-123"
}
```

Success: 200 OK.

```json
{
  "token": "<signed-jwt>",
  "id": "507f1f77bcf86cd799439011",
  "role": "business",
  "expiresIn": 900
}
```

Invalid credentials or an inactive account return the same generic 401
response. Do not reveal whether a particular email exists.

This replaces the starter's username request field.
The frontend's existing username form value may be mapped to email by its
authProvider; the API receives email.

### POST /logout

Requires authentication.

The server atomically increments the user's tokenVersion.
All previously issued tokens for that user become invalid.

Success: 204 No Content.

The frontend clears its authentication state after the logout attempt,
including when the token is already expired or rejected.

This minimum design logs the user out of all sessions.
It does not provide independent per-device sessions.

### GET /users/me

Returns the authenticated user's sanitized record.

Register /users/me before the parameterized /users/:id route.

### Administrative user reads

- GET /users
- GET /users/:id

Administrator-only, sanitized responses.

The minimum contract does not expose generic user creation, deletion,
ownership transfer, or role-change CRUD.

The tutorial's existing users resource must not be assumed to match this
production account model.

## 3. Route matrix

### Public reads

| Resource | List/getMany | Detail |
| --- | --- | --- |
| Companies | GET /public/companies | GET /public/companies/:id |
| Products | GET /public/products | GET /public/products/:id |
| Offers | GET /public/offers | GET /public/offers/:id |
| Vacancies | GET /public/vacancies | GET /public/vacancies/:id |

No login is required.

Only public fields and currently visible records are returned.
Authentication does not expand a /public response into a private response.

### Protected management

For each resource below, support:

- GET /resource
- GET /resource/:id
- POST /resource
- PUT /resource/:id
- DELETE /resource/:id

Resources:

- companies
- products
- offers
- vacancies

Business users may manage only resources belonging to their companies.

Administrators may manage records across companies.
Only administrators may set isHidden on companies, products, and offers.

Business creation of companies derives ownerUserId from the authenticated
user. Administrative creation requires a valid explicit ownerUserId.

DELETE performs soft deactivation and returns the deactivated record.

Private lists include authorized inactive and hidden records unless an
explicit supported filter narrows the result.

No public mutation routes are provided.

## 4. Request validation and update rules

Validate all request bodies against a resource-specific allowlist.

### Create

- Reject client-supplied id, _id, createdAt, and updatedAt.
- Reject unknown fields.
- Require the fields defined in data-model.md.
- Apply server-owned defaults.
- Verify referenced records and permissions.
- Reject business attempts to set isHidden.
- Ignore no privileged input silently.

### Update

PUT applies the provided writable fields to the existing record.
Omitted fields remain unchanged.

After applying the proposed changes, validate the complete resulting record.

The URL ID identifies the record to update.

React-Admin may send the complete previously retrieved record.
Therefore:

- An unchanged id may be accepted and removed from the update payload.
- An id that differs from the URL produces 400.
- Unchanged immutable references and timestamps may be accepted and removed.
- Attempts to alter immutable references or timestamps produce 400.
- _id and unknown fields produce 400.
- Business users may echo an unchanged isHidden from a management response,
  but cannot change it.
- Business attempts to change isHidden produce 403.
- ownerUserId and companyId cannot be reassigned through an update.
- Offer productId cannot be reassigned through an update.

Only validated writable fields are included in MongoDB's $set/$unset.

Never pass req.body directly to a MongoDB update.

A reference to a record outside the caller's authorized scope returns 404.
An authorized offer referencing a product from a different company returns
400 invalid_reference.

### Deactivation

DELETE sets isActive to false.

Success: 200 with the sanitized management record, including id.

Repeating DELETE on an existing authorized inactive record also returns 200.
A missing or inaccessible record returns 404.

No child records are physically deleted.
Public visibility still checks parent state.

## 5. List query conventions

The API supports the conventions used by ra-data-json-server 5.15.0.

Example:

```http
GET /public/companies?q=pan&category=Alimentos&physicalStore=true&_sort=name&_order=ASC&_start=0&_end=8
```

### Pagination

- _start: zero-based inclusive offset.
- _end: exclusive end offset.
- Both must be non-negative integers.
- When supplied, both must be present.
- _end must be greater than _start.
- Maximum page size: 100.
- Default when neither is supplied: _start=0 and _end=10.
- An offset beyond the result set returns an empty array.

### Sorting

- _order accepts ASC or DESC.
- Default order: ASC.
- Default sort field: id.
- id maps internally to MongoDB _id.
- Add _id as a stable tie-breaker for another non-unique sort field.
- Reject unsupported sort fields and directions.

Allowed sort fields:

| Resource | Sort fields |
| --- | --- |
| users | id, email, createdAt, updatedAt |
| companies | id, name, category, createdAt, updatedAt |
| products | id, name, category, priceCents, createdAt, updatedAt |
| offers | id, title, priceCents, startsAt, endsAt, createdAt, updatedAt |
| vacancies | id, position, type, createdAt, updatedAt |

User list access remains administrator-only.

### Total count

List responses include:

```http
X-Total-Count: 23
Access-Control-Expose-Headers: X-Total-Count
```

The count is calculated after:

1. Authorization or public visibility.
2. Supported filters.

It is calculated before pagination.

The body remains an array.

### Filters

| Resource | Supported filters |
| --- | --- |
| users | q matches email or name; role; isActive. |
| companies | q matches name; category; physicalStore. |
| products | q matches name or description; category; companyId. |
| offers | q matches title or description; companyId; productId. |
| vacancies | q matches position or description; type; companyId. |

Protected company/product/offer lists additionally support isActive
and isHidden.

Protected vacancy lists additionally support isActive.

q is a trimmed, case-insensitive literal substring search.
Maximum q length: 200 characters.
An empty q applies no text restriction.

Text supplied in q must not become an unescaped regular expression.

Multiple different filters combine with AND.
Enum and reference filters use exact matching.

Boolean query values accept only the strings true and false.

The absence of physicalStore means no store-type filter.
The frontend value all is not sent to the API.

Unsupported filters, geographic filters, malformed IDs, and invalid values
return 400.

Do not pass req.query directly into a MongoDB find expression.

Do not accept MongoDB operators or arbitrary field paths from the client.

No _embed or _expand behavior is required by the MLP.

## 6. getMany and getManyReference

### getMany

Accept one or multiple id parameters:

```http
GET /products?id=507f1f77bcf86cd799439011
```

```http
GET /products?id=507f1f77bcf86cd799439011&id=507f191e810c19729de860ea
```

Rules:

- Normalize a single ID and repeated IDs into one validated ID list.
- Maximum 100 IDs.
- Do not apply default list pagination to getMany.
- Return an array of matching accessible records.
- Missing or inaccessible records are omitted.
- Malformed IDs return 400.
- Do not combine getMany with pagination or other filter parameters.
- Public getMany enforces the same visibility rules as public lists/details.
- The client must not depend on result order.

### getManyReference

Reference lookups use the normal list endpoint:

```http
GET /products?companyId=507f1f77bcf86cd799439011&_sort=name&_order=ASC&_start=0&_end=10
```

They retain authorization, filtering, pagination, and X-Total-Count behavior.

Supported relationship targets:

- products.companyId
- offers.companyId
- offers.productId
- vacancies.companyId

Public variants use the corresponding /public route and public projections.

An empty authorized/public reference result is an empty list, not a detail
404.

## 7. HTTP responses and React-Admin results

The HTTP API does not wrap successful records in a data property.

The dataProvider performs that conversion.

| Operation | HTTP response | Result returned by dataProvider |
| --- | --- | --- |
| getList | Array and X-Total-Count | { data: records, total: count } |
| getOne | Record object | { data: record } |
| getMany | Array | { data: records } |
| getManyReference | Array and X-Total-Count | { data: records, total: count } |
| create | Created record object | { data: record } |
| update | Updated record object | { data: record } |
| delete | Deactivated record object | { data: record } |

Creation returns 201.
Other successful record operations return 200.

Every record includes id.
List and detail routes use consistent field names and types within the
same public or management representation.

### Example public list

```http
HTTP/1.1 200 OK
Content-Type: application/json
X-Total-Count: 1
Access-Control-Expose-Headers: X-Total-Count
```

```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "name": "Panaderia Demo",
    "category": "Alimentos",
    "physicalStore": true,
    "address": "Direccion de demostracion",
    "createdAt": "2026-10-16T18:00:00.000Z",
    "updatedAt": "2026-10-16T18:00:00.000Z"
  }
]
```

### Example product creation

```http
POST /products
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "companyId": "507f1f77bcf86cd799439011",
  "name": "Producto Demo",
  "description": "Producto de demostracion",
  "category": "Alimentos",
  "priceCents": 2500
}
```

```http
HTTP/1.1 201 Created
Content-Type: application/json
```

```json
{
  "id": "507f191e810c19729de860ea",
  "companyId": "507f1f77bcf86cd799439011",
  "name": "Producto Demo",
  "description": "Producto de demostracion",
  "category": "Alimentos",
  "priceCents": 2500,
  "currency": "MXN",
  "isActive": false,
  "isHidden": false,
  "createdAt": "2026-10-16T18:00:00.000Z",
  "updatedAt": "2026-10-16T18:00:00.000Z"
}
```

### Example update

```http
PUT /products/507f191e810c19729de860ea
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "priceCents": 2300,
  "isActive": true
}
```

Success returns the complete updated management record with priceCents=2300,
isActive=true, and a server-generated updatedAt.

### Example deactivation

```http
DELETE /products/507f191e810c19729de860ea
Authorization: Bearer <token>
```

Success returns the complete management record with isActive=false.
It does not return MongoDB's delete/update result.

### Bulk behavior

ra-data-json-server implements updateMany and deleteMany by issuing
individual PUT or DELETE requests.

No dedicated bulk-write endpoint is required.

Each request is authorized and validated independently.
These operations are not atomic across multiple records.

## 8. Error contract

Error example:

```json
{
  "message": "Invalid request.",
  "code": "validation_error",
  "errors": {
    "priceCents": "Must be a non-negative integer."
  }
}
```

errors is optional and maps field names to readable messages.
It does not automatically enable React-Admin field-level errors; the
frontend may adapt it separately.

| HTTP status | Typical code | Meaning |
| --- | --- | --- |
| 400 | validation_error | Invalid body, ID, date, or field value. |
| 400 | invalid_query | Unsupported or malformed query parameters. |
| 400 | invalid_reference | Accessible references are inconsistent. |
| 401 | unauthorized | Missing, expired, revoked, or invalid authentication. |
| 403 | forbidden | Authenticated user lacks an operation-level permission. |
| 404 | not_found | Record does not exist, is outside ownership scope, or is not publicly visible. |
| 409 | conflict | Duplicate normalized email/RFC or another uniqueness conflict. |
| 500 | internal_error | Unexpected server/database failure. |

Do not return 200 with an empty body for a missing record.

Do not report database failures as invalid credentials or 401.

Do not expose stack traces, password hashes, tokens, or database connection
strings in responses.

## 9. Existing frontend compatibility (17.10.2026)

The directory branch currently registers:

```tsx
<Resource name="businesses" list={BusinessList} />
```

The canonical backend entity is companies.

A future frontend adapter maps public read operations:

```text
businesses -> /public/companies
```

This is a frontend resource alias, not a second MongoDB collection or a
duplicate backend entity.

The adapter covers getList, getOne, and getMany.
Public writes through the alias are not supported.

Management companies operations continue to use /companies.

The directory already expects:

- id
- name
- category
- physicalStore
- q, category, and physicalStore filters
- Eight records per page

Those requirements are preserved.

The initial six category values remain aligned with the existing frontend.
A dynamic category endpoint is not required for the MLP.

The public alias and management resources must retain distinct frontend
resource/cache identities so private and public representations are not
mixed.

The frontend currently uses VITE_JSON_SERVER_URL.
TECH-03 must document the final environment configuration and any deliberate rename. This contract does not change environment variables.

## 10. Frontend integration dependencies

- US-03.2 #19: real directory data, public detail, and resource mapping.
- US-04.1 #22: authentication, role checks, and logout invalidation.
- US-04.2 #23: authProvider, JWT transport, login/logout, and protected UI.
- US-05.2 #26: company fields and private/public separation.
- US-06.2 #28: product forms and money conversion.
- US-07.2 #30: offer fields, timestamps, and publication.
- US-08.2 #34: public product/offer catalog.
- US-10.2 #41: vacancy forms.
- US-11.1 #43: public vacancy listing/detail.

Registration UI must not grant administrator privileges or create consumer
accounts.

Prices entered as pesos must be converted to integer cents before sending.
Date inputs must be converted to timezone-explicit timestamps.

The backend repeats all essential validation.

Combining the landing-page and directory branches also requires reconciling
their App.tsx changes. That routing work is outside TECH-02.

## 11. Contract verification checklist

These scenarios guide later implementation testing.
They are not results already obtained.

- [ ] Registration cannot choose an administrator role.
- [ ] Duplicate normalized email returns 409.
- [ ] Invalid login returns a generic 401.
- [ ] Logout invalidates previously issued JWTs.
- [ ] Protected routes reject missing or invalid authentication.
- [ ] Business users cannot manage another company's records.
- [ ] Business users cannot undo administrative hiding.
- [ ] List and detail IDs are stable strings.
- [ ] Create/update/delete return records containing id.
- [ ] PUT cannot redirect an update through a conflicting body ID.
- [ ] Filters combine correctly and physicalStore=false remains false.
- [ ] X-Total-Count counts filtered results before pagination.
- [ ] getMany works with both one and multiple IDs.
- [ ] Public lists/details exclude hidden and inactive parents.
- [ ] Offers outside their validity interval are excluded publicly.
- [ ] Deactivation preserves references and removes public availability.
- [ ] A missing public record returns 404.
- [ ] Public projections do not expose account/private company fields.
- [ ] Vacancy type filtering and external application URLs work.
- [ ] Invalid external URL schemes are rejected.

## 12. TECH-02 (and only TECH-02) acceptance mapping

| Issue #56 criterion | Definition |
| --- | --- |
| users is defined | data-model.md, section 3. |
| companies is defined | data-model.md, section 4. |
| products is defined | data-model.md, section 5. |
| offers is defined | data-model.md, section 6. |
| vacancies is defined | data-model.md, section 7. |
| Ownership/relationships documented | data-model.md, sections 2 and 8; API sections 3–4. |
| Visibility documented | data-model.md, sections 9–10. |
| CRUD/public operations documented | API sections 2–6. |
| React-Admin-compatible responses | API sections 5–9. |
