/*
* ChatGPT-6.1 Sol was used to review, validate and improve the code.
* Also used 
* by providing all the sample data that allows us to test the backend and 
* frontend of the application.
* 
*/

const base = `http://127.0.0.1:${process.env.PORT ?? 3000}`; // base URL for the local server, using the PORT environment variable or defaulting to 3000
const marker = "[T6_DEMO_V1]"; // marker to identify demo data in the database
let adminToken;

async function request(path, {
    method = "GET",
    body,
    token = adminToken,
    allowConflict = false, // allowConflict is a flag to ignore 409 Conflict responses
} = {}) {
    const response = await fetch(`${base}${path}`, {
        method,
        headers: {
            ...(body ? { "Content-Type": "application/json" } : {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        }, // set headers for JSON content and authorization if provided
        ...(body ? { body: JSON.stringify(body) } : {}),
        signal: AbortSignal.timeout(10000), // set a timeout of 10 seconds for the request
    });

    const data = await response.json();

    if (!response.ok && !(allowConflict && response.status === 409)) {
        throw new Error(
            `${method} ${path}: HTTP ${response.status}; ` +
            `${data.message ?? "Request failed."}`
        );
    } // throw an error if the response is not OK and not a 409 Conflict when allowConflict is true

    return { data, response };
} // overall function to make HTTP requests to the backend, handling JSON responses and errors

async function list(resource, filter = {}) {
    const records = [];

    for (let start = 0; ; start += 100) {
        const query = new URLSearchParams({
            ...filter,
            _start: String(start),
            _end: String(start + 100),
            _sort: "id",
            _order: "ASC",
        }); // we construct the query parameters for pagination and sorting

        const { data, response } = await request(
            `/${resource}?${query}`
        ); // make the request to the resource endpoint with the constructed query parameters

        const header = response.headers.get("X-Total-Count");
        const total = Number(header); // parse the total count of records from the response header

        if (header === null || !Number.isSafeInteger(total) || total < 0 ||
            !Array.isArray(data)) {
            throw new Error(
                `Invalid list response for ${resource}.`
            );
        }

        records.push(...data); // accumulate the fetched records into the records array

        if (start + data.length >= total) {
            return records;
        } // if we've fetched all records, return the accumulated list

        if (data.length === 0) {
            throw new Error(
                `Incomplete page for ${resource}.`
            );
        } // deny empty pages to avoid infinite loops in case of unexpected API behavior
    }
}

async function save(resource, body, matches, filter = {}) {
    const records = (await list(resource, filter))
        .filter(matches); // filter the existing records to find those that match the provided criteria

    if (records.length > 1) {
        throw new Error(
            `Multiple demo records found in ${resource}.`
        );
    }

    const current = records[0];

    if (current && (!current.description?.startsWith(marker) ||
        (body.ownerUserId && current.ownerUserId !== body.ownerUserId))) {
        throw new Error(
            `The existing ${resource} record is not owned by this demo.`
        );
    } // ensure that if a record exists, it is marked as demo data and owned by the correct user

    const { data } = await request(
        `/${resource}${current ? `/${current.id}` : ""}`,
        {
            method: current ? "PUT" : "POST",
            body,
        }
    ); // make a PUT request to update the existing record or a POST request to create a new one, depending on whether a matching record was found

    console.log(
        `${resource}: ${current ? "updated" : "created"}; ` +
        `id=${data.id}`
    ); // log the action taken (created or updated) along with the record ID

    return data;
}

async function main() {
    for (const name of [
        "ADMIN_EMAIL",
        "ADMIN_PASSWORD",
        "DEMO_PASSWORD",
    ]) {
        if (!process.env[name]) {
            throw new Error(`${name} is required.`);
        }
    } // ensure that the necessary environment variables for admin and demo credentials are set before proceeding

    if (process.env.DEMO_PASSWORD.length < 12 || process.env.DEMO_PASSWORD.length > 128) {
        throw new Error(
            "DEMO_PASSWORD must contain 12–128 characters."
        );
    } // password length margins

    const { data: admin } = await request("/login", {
        method: "POST",
        token: null,
        body: {
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
        },
    }); // log in as the administrator using the provided credentials to obtain an authentication token for subsequent requests

    if (admin.role !== "admin" || typeof admin.token !== "string") {
        throw new Error(
            "An administrator session is required."
        );
    } // restrict access to ensure that the logged-in user has administrative privileges and a valid token

    adminToken = admin.token;

    const email = "demo.representante@example.com"; // HARDCODED DEMO EMAIL

    await request("/registrarse", {
        method: "POST",
        token: null,
        allowConflict: true,
        body: {
            email,
            password: process.env.DEMO_PASSWORD,
            firstName: "Demo",
            lastName: "Equipo Seis",
        },
    }); // create a demo user account with the specified email and password, allowing for conflict if the account already exists

    const { data: owner } = await request("/login", {
        method: "POST",
        token: null,
        body: {
            email,
            password: process.env.DEMO_PASSWORD,
        },
    }); // log in as the demo user to obtain an authentication token for subsequent requests

    if (owner.role !== "business" || typeof owner.id !== "string") {
        throw new Error(
            "The demo account must be an active business account."
        );
    }

    const company = await save("companies", {
        ownerUserId: owner.id,
        name: "Panadería Equipo Seis — DEMO",
        rfc: "DEM260101AB1",
        category: "Alimentos",
        physicalStore: true,
        address: "Calle Nadie 123, Ciudad de México",
        description:
            `${marker} Empresa ficticia con fines demostrativos.`,
        isActive: true,
        isHidden: false,
    }, (record) => record.rfc === "DEM260101AB1"); // save the demo company record with sample data, 
    // ensuring that it is uniquely identified by its RFC and marked as demo data

    const companyFilter = { companyId: company.id };

    const isDemo = (record) =>
        record.description?.startsWith(marker); // helper function to check if a record is marked as demo data based on its description

    const product = await save("products", {
        companyId: company.id,
        name: "Caja de pan artesanal — DEMO",
        description:
            `${marker} Caja ficticia con seis piezas de pan.`,
        category: "Alimentos",
        priceCents: 15000,
        isActive: true,
        isHidden: false,
    }, isDemo, companyFilter); // save the demo product record with sample data

    const now = Date.now();

    const offer = await save("offers", {
        companyId: company.id,
        productId: product.id,
        title: "Oferta en caja de pan — DEMO",
        description:
            `${marker} Oferta ficticia de seis piezas de pan.`,
        priceCents: 12000,
        startsAt: new Date(now - 60000).toISOString(),
        endsAt: new Date(
            now + 7 * 86400000
        ).toISOString(), // set the offer to start one minute ago and end in seven days from whenver its created
        terms:
            "Demostración académica; no constituye una oferta comercial real.",
        sellerUrl: "https://example.com/",
        isActive: true,
        isHidden: false,
    }, isDemo, companyFilter); // save the demo offer record with sample data

    const vacancy = await save("vacancies", {
        companyId: company.id,
        position: "Auxiliar de panadería — DEMO",
        type: "temporary",
        description:
            `${marker} Vacante ficticia para probar el portal.`,
        location: "Santa Fe, Ciudad de México",
        applicationUrl: "https://example.com/",
        isActive: true,
    }, isDemo, companyFilter); // save the demo vacancy record with sample data

    for (const [resource, record] of [
        ["companies", company],
        ["products", product],
        ["offers", offer],
        ["vacancies", vacancy],
    ]) {
        await request(
            `/public/${resource}/${record.id}`,
            { token: null }
        );
    } // make the demo records publicly accessible by sending requests to the public endpoints for each resource

    console.log(
        `Demo ready. Business login: ${email}`
    ); // log the demo readiness message along with the demo business login email

    console.log(
        `Offer valid until: ${offer.endsAt}`
    ); // also add a log statement to indicate the validity period of the demo offer
}

main().catch((error) => {
    console.error(
        `Demo preparation failed: ${error.message}`
    ); // default error handling to log any issues that occur during the demo preparation process

    process.exitCode = 1;
});    