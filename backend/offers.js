/*
* ChatGPT-6.1 Sol was used to review and edit this code.
* 
*/

const express = require("express");
const { ObjectId } = require("mongodb");
const { HttpError } = require("./auth.js");

const {
    invalid,
    text,
    parseId,
    requireManagedCompany,
} = require("./products.js"); // import utility functions for validation and authentication

function timestamp(value, field) {
    if (typeof value !== "string") {
        throw invalid(field, "Must be a timestamp with timezone.");
    }

    // this regex matches ISO 8601 timestamps with timezone information, e.g., "2023-03-15T12:34:56Z" or "2023-03-15T12:34:56+02:00"
    const match = /^(\d{4})-(\d{2})-(\d{2})T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d{1,3})?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/.exec(value);

    if (!match) {
        throw invalid(field, "Must be an ISO timestamp with timezone.");
    }

    // extract year, month, and day from the matched groups
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);

    // check if the year is a leap year to determine the number of days in February
    const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

    const days = [
        31, leapYear ? 29 : 28, 31, 30, 31, 30,
        31, 31, 30, 31, 30, 31,
    ]; // array representing the number of days in each month

    const date = new Date(value);

    if (month < 1 || month > 12 ||
        day < 1 || day > days[month - 1] ||
        !Number.isFinite(date.getTime())) {
        throw invalid(field, "Invalid calendar date.");
    }

    return date;
}

function validateOfferCreation(body, user) {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
        throw invalid("body", "Must be a JSON object.");
    }

    const allowed = [
        "companyId",
        "productId",
        "title",
        "description",
        "priceCents",
        "currency",
        "startsAt",
        "endsAt",
        "terms",
        "sellerUrl",
        "isActive",
    ]; // fields that are allowed in the request body

    if (user.role === "admin") {
        allowed.push("isHidden");
    } // admins are allowed to set the isHidden field

    for (const field of Object.keys(body)) {
        if (!allowed.includes(field)) {
            throw invalid(field, "Field is not accepted.");
        }
    }

    const offer = {
        companyId: parseId(body.companyId, "companyId"),
        productId: parseId(body.productId, "productId"),
        title: text(body.title, "title", 200),
        description: text(body.description, "description", 5000),
        priceCents: body.priceCents,
        currency: Object.hasOwn(body, "currency")
            ? body.currency
            : "MXN",
        startsAt: timestamp(body.startsAt, "startsAt"),
        endsAt: timestamp(body.endsAt, "endsAt"),
        terms: text(body.terms, "terms", 5000),
        sellerUrl: text(body.sellerUrl, "sellerUrl", 2048),
        isActive: false,
        isHidden: false,
    }; // initialize the offer object with validated and sanitized values

    if (!Number.isSafeInteger(offer.priceCents) ||
        offer.priceCents < 0) {
        throw invalid(
            "priceCents",
            "Must be a non-negative safe integer."
        );
    }

    if (offer.currency !== "MXN") {
        throw invalid("currency", "Only MXN is supported.");
    }

    if (offer.endsAt <= offer.startsAt) {
        throw invalid("endsAt", "Must be later than startsAt.");
    }

    for (const field of ["isActive", "isHidden"]) {
        if (Object.hasOwn(body, field)) {
            if (typeof body[field] !== "boolean") {
                throw invalid(field, "Must be a boolean.");
            }

            offer[field] = body[field];
        } // business users may set it as isActive, only admins may set it as isHidden
    }

    let url;

    try {
        url = new URL(offer.sellerUrl);
    } 
    
    catch {
        throw invalid("sellerUrl", "Invalid seller URL.");
    }

    if (!["http:", "https:"].includes(url.protocol) || !url.hostname || 
    url.username || url.password) {
        throw invalid("sellerUrl", "Invalid seller URL.");
    } // ensure the URL uses http or https, has a hostname, and does not include username or password

    offer.sellerUrl = url.href; // store the validated and normalized URL

    return offer;
} // price offer is independent of the product price, and can be lower or higher than the product price

function offerResponse(offer, management = false) {
    const result = {
        id: offer._id.toHexString(),
        companyId: offer.companyId.toHexString(),
        productId: offer.productId.toHexString(),
        title: offer.title,
        description: offer.description,
        priceCents: offer.priceCents,
        currency: offer.currency,
        startsAt: offer.startsAt,
        endsAt: offer.endsAt,
        terms: offer.terms,
        sellerUrl: offer.sellerUrl,
        createdAt: offer.createdAt,
        updatedAt: offer.updatedAt,
    }; // prepare the response object with the offer details

    if (management) {
        result.isActive = offer.isActive;
        result.isHidden = offer.isHidden;
    } // include the isActive and isHidden fields if the user is an admin or the owner of the company

    return result;
}

async function requireOfferReferences(db, offer, user) {
    await requireManagedCompany(db, offer.companyId, user);

    const product = await db.collection("products").findOne({
        _id: offer.productId,
    }); // retrieve the product associated with the offer from the database

    if (!product) {
        throw new HttpError(
            404,
            "not_found",
            "Product not found."
        );
    }

    await requireManagedCompany(db, product.companyId, user);

    if (!product.companyId.equals(offer.companyId)) {
        throw new HttpError(
            400,
            "invalid_reference",
            "The product must belong to the offer's company."
        );
    }
}

function invalidQuery(message) {
    return new HttpError(400, "invalid_query", message);
}

function readOfferQuery(req, management) {
    const params = new URL(
        req.originalUrl,
        "http://localhost"
    ).searchParams; // parse the query parameters from the request URL

    if (params.has("id")) {
        const ids = params.getAll("id");

        if ([...params.keys()].some((key) => key !== "id")) {
            throw invalidQuery(
                "ID queries cannot be combined with other parameters."
            );
        } // if the query contains an "id" parameter, it cannot be combined with other parameters

        if (ids.length > 100 || ids.some((id) => !/^[a-fA-F0-9]{24}$/.test(id))) {
            throw invalidQuery(
                "Provide between 1 and 100 valid identifiers."
            );
        } // set a limit of 100 IDs and ensure that all IDs are valid 24-character hexadecimal strings

        return {
            ids: ids.map((id) => new ObjectId(id)),
        };
    }

    const allowed = new Set([
        "q",
        "companyId",
        "productId",
        "_start",
        "_end",
        "_sort",
        "_order",
    ]); // all allowed query parameters for searching products

    if (management) {
        allowed.add("isActive");
        allowed.add("isHidden");
    }

    for (const key of params.keys()) {
        if (!allowed.has(key)) {
            throw invalidQuery(`Unsupported query parameter: ${key}.`);
        }

        if (params.getAll(key).length !== 1) {
            throw invalidQuery(`Parameter ${key} cannot be repeated.`);
        }
    } // ensure that all query parameters are allowed and not repeated

    const filter = {};

    if (params.has("q")) {
        const query = params.get("q").trim(); // get the search query and trim whitespace

        if (query.length > 200) {
            throw invalidQuery("Search must not exceed 200 characters.");
        }

        if (query) {
            const escaped = query.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );

            filter.$or = [
                { title: { $regex: escaped, $options: "i" } },
                { description: { $regex: escaped, $options: "i" } },
            ];
        } // if the query is not empty, create a case-insensitive regex to search in the name and description fields
    }

    for (const field of ["companyId", "productId"]) {
        if (params.has(field)) {
            const value = params.get(field);

            if (!/^[a-fA-F0-9]{24}$/.test(value)) {
                throw invalidQuery(
                    `${field} must be a valid identifier.`
                );
            }

            filter[field] = new ObjectId(value);
        }
    } // filter products by the specified company ID and product ID, ensuring that both are valid 24-character hexadecimal strings

    for (const field of ["isActive", "isHidden"]) {
        if (params.has(field)) {
            const value = params.get(field);

            if (!["true", "false"].includes(value)) {
                throw invalidQuery(`${field} must be true or false.`);
            }

            filter[field] = value === "true";
        }
    }

    const hasStart = params.has("_start");
    const hasEnd = params.has("_end");

    // all pagination parameters
    if (hasStart !== hasEnd) {
        throw invalidQuery("_start and _end must be supplied together.");
    }

    let start = 0;
    let end = 10;

    if (hasStart) {
        const startText = params.get("_start");
        const endText = params.get("_end");

        if (!/^\d+$/.test(startText) || !/^\d+$/.test(endText)) {
            throw invalidQuery(
                "Pagination values must be non-negative integers."
            );
        }

        start = Number(startText);
        end = Number(endText);

        if (!Number.isSafeInteger(start) ||
            !Number.isSafeInteger(end) ||
            end <= start ||
            end - start > 100) {
            throw invalidQuery(
                "The page size must be between 1 and 100 records."
            );
        }
    }

    // sorting parameters
    const sortField = params.get("_sort") ?? "id";
    const order = params.get("_order") ?? "ASC";

    if (![
        "id",
        "title",
        "priceCents",
        "startsAt",
        "endsAt",
        "createdAt",
        "updatedAt",
    ].includes(sortField)) {
        throw invalidQuery("Unsupported sort field.");
    } // only allow sorting by specific fields

    if (!["ASC", "DESC"].includes(order)) {
        throw invalidQuery("_order must be ASC or DESC.");
    }

    const direction = order === "ASC" ? 1 : -1;
    const databaseField = sortField === "id" ? "_id" : sortField;
    const sort = { [databaseField]: direction };

    if (databaseField !== "_id") {
        sort._id = direction;
    } // if sorting by a field other than _id, add _id as a secondary sort to ensure consistent ordering

    return { filter, sort, start, limit: end - start };
}

async function sendOfferList(db, req, res, management) {
    const query = readOfferQuery(req, management);

    const filter = query.ids
        ? { _id: { $in: query.ids } }
        : { ...query.filter }; // if specific IDs are provided, filter by those IDs; otherwise, use the constructed filter from the query parameters

    if (!management) {
        const now = new Date();

        filter.isActive = true;
        filter.isHidden = false;
        filter.startsAt = { $lte: now };
        filter.endsAt = { $gt: now };
    } // if not in management mode, filter offers to only include those that are active, not hidden, and within the valid time range

    const pipeline = [
        { $match: filter },
        {
            $lookup: {
                from: "companies",
                localField: "companyId",
                foreignField: "_id",
                as: "_company",
            },
        },
        { $unwind: "$_company" },
    ]; // construct an aggregation pipeline to match offers based on the filter, and perform a lookup to join with the companies collection to retrieve company details

    if (management) {
        if (req.auth.user.role !== "admin") {
            pipeline.push({
                $match: {
                    "_company.ownerUserId": req.auth.user._id,
                },
            });
        }
    } // if in management mode and the user is not an admin, filter offers to only include those that belong to companies owned by the authenticated user
    
    else {
        pipeline.push({
            $match: {
                "_company.isActive": true,
                "_company.isHidden": false,
            },
        });
    } // if not in management mode, filter offers to only include those that belong to companies that are active and not hidden

    pipeline.push(
        {
            $lookup: {
                from: "products",
                localField: "productId",
                foreignField: "_id",
                as: "_product",
            },
        },
        { $unwind: "$_product" },
        {
            $match: {
                $expr: {
                    $eq: ["$_product.companyId", "$companyId"],
                },
            },
        }
    ); // perform a lookup to join with the products collection to retrieve product details, and filter offers to only include those where the product's companyId matches the offer's companyId

    if (!management) {
        pipeline.push({
            $match: {
                "_product.isActive": true,
                "_product.isHidden": false,
            },
        });
    } // only include offers where the associated product is active and not hidden if not in management mode

    const offers = db.collection("offers");

    if (query.ids) {
        const records = await offers.aggregate(pipeline).toArray();

        return res.json(
            records.map((record) => offerResponse(record, management))
        ); // if specific IDs are provided, execute the aggregation pipeline and return the matching offers as a JSON response
    }

    pipeline.push({
        $facet: {
            total: [
                { $count: "value" },
            ],
            records: [
                { $sort: query.sort },
                { $skip: query.start },
                { $limit: query.limit },
            ],
        },
    }); // use the $facet stage to count the total number of matching offers and retrieve a paginated subset of records based on the specified sort order, start index, and limit

    const [result] = await offers.aggregate(pipeline).toArray();
    const total = result.total[0]?.value ?? 0;

    res.set("X-Total-Count", String(total));

    res.json(
        result.records.map(
            (record) => offerResponse(record, management)
        )
    );
}

function prepareOfferUpdate(body, current, user) {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
        throw invalid("body", "Must be a JSON object.");
    }

    const writable = [
        "title",
        "description",
        "priceCents",
        "currency",
        "startsAt",
        "endsAt",
        "terms",
        "sellerUrl",
        "isActive",
    ]; // fields that can be updated in the offer

    const immutable = {
        id: current._id.toHexString(),
        companyId: current.companyId.toHexString(),
        productId: current.productId.toHexString(),
        createdAt: current.createdAt.toISOString(),
        updatedAt: current.updatedAt.toISOString(),
    };

    const allowed = new Set([
        ...writable,
        ...Object.keys(immutable),
        "isHidden",
    ]);

    for (const field of Object.keys(body)) {
        if (!allowed.has(field)) {
            throw invalid(field, "Field is not accepted.");
        }
    }

    for (const [field, expected] of Object.entries(immutable)) {
        if (Object.hasOwn(body, field) && body[field] !== expected) {
            throw invalid(field, "Field cannot be changed.");
        }
    }

    if (user.role !== "admin" && Object.hasOwn(body, "isHidden") &&
        body.isHidden !== current.isHidden) {
        throw new HttpError(
            403,
            "forbidden",
            "Only administrators may change isHidden."
        );
    }

    const candidate = {
        companyId: current.companyId.toHexString(),
        productId: current.productId.toHexString(),
    }; // initialize the candidate object with the current companyId and productId

    for (const field of writable) {
        candidate[field] = ["startsAt", "endsAt"].includes(field) ? current[field].toISOString()
            : current[field];

        if (Object.hasOwn(body, field)) {
            candidate[field] = body[field];
        } // if the field is present in the request body, update the candidate object with the new value; otherwise, keep the current value
    }

    if (user.role === "admin") {
        candidate.isHidden = Object.hasOwn(body, "isHidden") ? body.isHidden : current.isHidden;
    } // if the user is an admin, update the candidate object with the new isHidden value if present in the request body; otherwise, keep the current value

    const validated = validateOfferCreation(candidate, user);
    const set = {};

    for (const field of writable) {
        if (Object.hasOwn(body, field)) {
            set[field] = validated[field];
        }
    } // for each writable field, if it is present in the request body, add it to the set object with the validated value

    if (user.role === "admin" && Object.hasOwn(body, "isHidden")) {
        set.isHidden = validated.isHidden;
    } // if the user is an admin and the isHidden field is present in the request body, update the set object with the new isHidden value

    return set;
}

function createOfferRouter({ getDb, requireAuthentication }) {
    const router = express.Router();

    router.get(
        "/offers",
        requireAuthentication,
        async (req, res) => {
            await sendOfferList(getDb(), req, res, true);
        }
    ); // retrieve a list of offers for management purposes, requiring authentication and returning the offers in a JSON response

    router.get("/public/offers", async (req, res) => {
        await sendOfferList(getDb(), req, res, false); // retrieve a list of public offers, without requiring authentication, and returning the offers in a JSON response
    });

    router.post("/offers", requireAuthentication, async (req, res) => {
        const db = getDb();
        const offer = validateOfferCreation(req.body, req.auth.user);

        await requireOfferReferences(db, offer, req.auth.user); // ensure the offer's company and product references are valid and accessible by the user

        const now = new Date();

        offer._id = new ObjectId();
        offer.createdAt = now;
        offer.updatedAt = now;

        await db.collection("offers").insertOne(offer);

        res.status(201).json(offerResponse(offer, true));
    });

    router.get("/offers/:id", requireAuthentication, async (req, res) => {
        const db = getDb();

        const offer = await db.collection("offers").findOne({
            _id: parseId(req.params.id, "id"),
        }); // retrieve the offer from the database by its ID

        if (!offer) {
            throw new HttpError(404, "not_found", "Offer not found.");
        }

        await requireManagedCompany(
            db,
            offer.companyId,
            req.auth.user
        ); // ensure the user has permission to access the offer's company

        res.json(offerResponse(offer, true));
    });

    router.get("/public/offers/:id", async (req, res) => {
        const db = getDb();
        const now = new Date();

        const offer = await db.collection("offers").findOne({
            _id: parseId(req.params.id, "id"),
            isActive: true,
            isHidden: false,
            startsAt: { $lte: now },
            endsAt: { $gt: now },
        }); // retrieve the offer from the database by its ID, ensuring it is active, not hidden, and within the valid time range

        const product = offer
            ? await db.collection("products").findOne({
                _id: offer.productId,
                companyId: offer.companyId,
                isActive: true,
                isHidden: false,
            })
            : null; // retrieve the product associated with the offer, ensuring it is active and not hidden

        const company = product
            ? await db.collection("companies").findOne({
                _id: offer.companyId,
                isActive: true,
                isHidden: false,
            })
            : null; // retrieve the company associated with the offer, ensuring it is active and not hidden

        if (!offer || !product || !company) {
            throw new HttpError(404, "not_found", "Offer not found.");
        }

        res.json(offerResponse(offer));
    });

    router.put(
        "/offers/:id",
        requireAuthentication,
        async (req, res) => {
            const db = getDb();
            const offers = db.collection("offers");

            const current = await offers.findOne({
                _id: parseId(req.params.id, "id"),
            }); // retrieve the current offer from the database by its ID

            if (!current) {
                throw new HttpError(
                    404,
                    "not_found",
                    "Offer not found."
                );
            }

            await requireOfferReferences(
                db,
                current,
                req.auth.user
            );

            const set = prepareOfferUpdate(
                req.body,
                current,
                req.auth.user
            );

            const updated = await offers.findOneAndUpdate(
                {
                    _id: current._id,
                    companyId: current.companyId,
                    productId: current.productId,
                },
                {
                    $set: {
                        ...set,
                        updatedAt: new Date(),
                    },
                },
                { returnDocument: "after" }
            ); // update the offer in the database with the new values, ensuring that the companyId and productId remain unchanged, and return the updated document

            if (!updated) {
                throw new HttpError(
                    404,
                    "not_found",
                    "Offer not found."
                );
            }

            res.json(offerResponse(updated, true));
        }
    );

    router.delete(
        "/offers/:id",
        requireAuthentication,
        async (req, res) => {
            const db = getDb();
            const offers = db.collection("offers");

            const current = await offers.findOne({
                _id: parseId(req.params.id, "id"),
            });

            if (!current) {
                throw new HttpError(
                    404,
                    "not_found",
                    "Offer not found."
                );
            }

            await requireOfferReferences(
                db,
                current,
                req.auth.user
            );

            const updated = await offers.findOneAndUpdate(
                {
                    _id: current._id,
                    companyId: current.companyId,
                    productId: current.productId,
                },
                {
                    $set: {
                        isActive: false,
                        updatedAt: new Date(),
                    },
                },
                { returnDocument: "after" }
            ); // mark the offer as inactive in the database, ensuring that the companyId and productId remain unchanged, and return the updated document

            if (!updated) {
                throw new HttpError(
                    404,
                    "not_found",
                    "Offer not found."
                );
            }

            res.json(offerResponse(updated, true));
        }
    );

    return router;
}

async function ensureOfferIndexes(db) {
    const offers = db.collection("offers");

    // create indexes on the companyId, productId, and a compound index on isActive, isHidden, startsAt, and endsAt fields to improve query performance
    await offers.createIndex({ companyId: 1 });
    await offers.createIndex({ productId: 1 });
    await offers.createIndex({
        isActive: 1,
        isHidden: 1,
        startsAt: 1,
        endsAt: 1,
    });
}

module.exports = { createOfferRouter, ensureOfferIndexes };