/*
* ChatGPT-6.1 Sol was used to review, validate and improve the code.
* Now this module provides a router for managing job vacancies, 
* including routes for creating, retrieving, and listing vacancies. 
* It also includes validation functions for vacancy creation and 
* query parameters, as well as a function to ensure necessary database 
* indexes are created for efficient querying.
*/

const express = require("express");
const { ObjectId } = require("mongodb");
const { HttpError } = require("./auth.js");

const {
    invalid,
    text,
    parseId,
    requireManagedCompany,
} = require("./products.js");

function validateVacancyCreation(body) {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
        throw invalid("body", "Must be a JSON object.");
    }

    const allowed = [
        "companyId",
        "position",
        "type",
        "description",
        "location",
        "applicationUrl",
        "isActive",
    ]; // list of allowed fields for vacancy creation

    for (const field of Object.keys(body)) {
        if (!allowed.includes(field)) {
            throw invalid(field, "Field is not accepted.");
        }
    }

    const vacancy = {
        companyId: parseId(body.companyId, "companyId"),
        position: text(body.position, "position", 200),
        type: body.type,
        description: text(body.description, "description", 5000),
        location: text(body.location, "location", 500),
        applicationUrl: text(
            body.applicationUrl,
            "applicationUrl",
            2048
        ),
        isActive: false,
    }; // initialize the vacancy object with validated and sanitized values

    if (!["temporary", "permanent"].includes(vacancy.type)) {
        throw invalid("type", "Must be temporary or permanent.");
    }

    if (Object.hasOwn(body, "isActive")) {
        if (typeof body.isActive !== "boolean") {
            throw invalid("isActive", "Must be a boolean.");
        }

        vacancy.isActive = body.isActive;
    }

    let url;

    try {
        url = new URL(vacancy.applicationUrl);
    } 
    
    catch {
        throw invalid("applicationUrl", "Invalid application URL.");
    }

    if (!["http:", "https:"].includes(url.protocol) || !url.hostname || 
    url.username || url.password) {
        throw invalid("applicationUrl", "Invalid application URL.");
    }

    vacancy.applicationUrl = url.href; // normalize the application URL to ensure it is valid and well-formed

    return vacancy;
}

function vacancyResponse(vacancy, management = false) {
    const result = {
        id: vacancy._id.toHexString(),
        companyId: vacancy.companyId.toHexString(),
        position: vacancy.position,
        type: vacancy.type,
        description: vacancy.description,
        location: vacancy.location,
        applicationUrl: vacancy.applicationUrl,
        createdAt: vacancy.createdAt,
        updatedAt: vacancy.updatedAt,
    }; // create a response object with the vacancy details, excluding sensitive information

    if (management) {
        result.isActive = vacancy.isActive;
    } // if the management flag is true, include the isActive field in the response

    return result;
}

function invalidQuery(message) {
    return new HttpError(400, "invalid_query", message);
}

function readVacancyQuery(req, management) {
    const params = new URL(
        req.originalUrl,
        "http://localhost"
    ).searchParams;

    if (params.has("id")) {
        const ids = params.getAll("id");

        if ([...params.keys()].some((key) => key !== "id")) {
            throw invalidQuery(
                "ID queries cannot be combined with other parameters."
            );
        }

        if (ids.length > 100 ||
            ids.some((id) => !/^[a-fA-F0-9]{24}$/.test(id))) {
            throw invalidQuery(
                "Provide between 1 and 100 valid identifiers."
            );
        }

        return {
            ids: ids.map((id) => new ObjectId(id)),
        };
    }

    const allowed = new Set([
        "q",
        "type",
        "companyId",
        "_start",
        "_end",
        "_sort",
        "_order",
    ]); // set of allowed query parameters for vacancy queries

    if (management) {
        allowed.add("isActive");
    }

    for (const key of params.keys()) {
        if (!allowed.has(key)) {
            throw invalidQuery(`Unsupported query parameter: ${key}.`);
        }

        if (params.getAll(key).length !== 1) {
            throw invalidQuery(`Parameter ${key} cannot be repeated.`);
        }
    } // validate that all query parameters are allowed and not repeated

    const filter = {};

    if (params.has("q")) {
        const query = params.get("q").trim();

        if (query.length > 200) {
            throw invalidQuery("Search must not exceed 200 characters.");
        }

        if (query) {
            const escaped = query.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            ); // escape special characters in the search query to prevent regex injection

            filter.$or = [
                { position: { $regex: escaped, $options: "i" } },
                { description: { $regex: escaped, $options: "i" } },
            ]; // create a case-insensitive regex filter to search for the query in the position and description fields of the vacancies
        }
    }

    if (params.has("type")) {
        const type = params.get("type");

        if (!["temporary", "permanent"].includes(type)) {
            throw invalidQuery("type must be temporary or permanent.");
        }

        filter.type = type;
    }

    if (params.has("companyId")) {
        const companyId = params.get("companyId");

        if (!/^[a-fA-F0-9]{24}$/.test(companyId)) {
            throw invalidQuery("companyId must be a valid identifier.");
        } // validate that the companyId is a valid 24-character hexadecimal string

        filter.companyId = new ObjectId(companyId);
    }

    if (params.has("isActive")) {
        const value = params.get("isActive");

        if (!["true", "false"].includes(value)) {
            throw invalidQuery("isActive must be true or false.");
        }

        filter.isActive = value === "true";
    }

    const hasStart = params.has("_start");
    const hasEnd = params.has("_end");

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
        } // validate that the pagination values are non-negative integers

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

    const sortField = params.get("_sort") ?? "id";
    const order = params.get("_order") ?? "ASC";

    if (![
        "id", "position", "type", "createdAt", "updatedAt",
    ].includes(sortField)) {
        throw invalidQuery("Unsupported sort field.");
    }

    if (!["ASC", "DESC"].includes(order)) {
        throw invalidQuery("_order must be ASC or DESC.");
    }

    const direction = order === "ASC" ? 1 : -1;
    const databaseField = sortField === "id" ? "_id" : sortField;
    const sort = { [databaseField]: direction };

    if (databaseField !== "_id") {
        sort._id = direction;
    }

    return { filter, sort, start, limit: end - start };
}

async function sendVacancyList(db, req, res, management) {
    const query = readVacancyQuery(req, management);

    const filter = query.ids
        ? { _id: { $in: query.ids } }
        : { ...query.filter }; // if specific IDs are provided in the query, filter by those IDs; otherwise, use the constructed filter from the query parameters

    if (!management) {
        filter.isActive = true;
    }

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
    ]; // construct an aggregation pipeline to match the vacancies based on the filter, perform a lookup to join with the companies collection, and unwind the resulting array to get individual company documents

    if (management) {
        if (req.auth.user.role !== "admin") {
            pipeline.push({
                $match: {
                    "_company.ownerUserId": req.auth.user._id,
                },
            });
        }
    }  // if the user is in management mode and is not an admin, further filter the vacancies to only include those associated with companies owned by the authenticated user
    
    else {
        pipeline.push({
            $match: {
                "_company.isActive": true,
                "_company.isHidden": false,
            },
        });
    } // if the user is not in management mode, further filter the vacancies to only include those associated with companies that are active and not hidden

    const vacancies = db.collection("vacancies");

    if (query.ids) {
        const records = await vacancies.aggregate(pipeline).toArray();

        return res.json(
            records.map(
                (record) => vacancyResponse(record, management)
            )
        ); // if specific IDs are provided in the query, execute the aggregation pipeline and return the resulting records as a JSON response, mapping each record to the vacancyResponse format
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
    }); // if no specific IDs are provided, add a facet stage to the aggregation pipeline to count the total 
    // number of matching records and retrieve a paginated subset of records based on the specified sort order, 
    // start index, and limit

    const [result] = await vacancies.aggregate(pipeline).toArray();
    const total = result.total[0]?.value ?? 0;

    res.set("X-Total-Count", String(total));

    res.json(
        result.records.map(
            (record) => vacancyResponse(record, management)
        )
    ); // return the total count of matching records in the response headers and return the paginated subset of records as a JSON response, mapping each record to the vacancyResponse format
}

function prepareVacancyUpdate(body, current) {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
        throw invalid("body", "Must be a JSON object.");
    }

    const writable = [
        "position",
        "type",
        "description",
        "location",
        "applicationUrl",
        "isActive",
    ]; // list of fields that can be updated in a vacancy

    const immutable = {
        id: current._id.toHexString(),
        companyId: current.companyId.toHexString(),
        createdAt: current.createdAt.toISOString(),
        updatedAt: current.updatedAt.toISOString(),
    }; // list of fields that cannot be changed in a vacancy, with their current values

    const allowed = new Set([
        ...writable,
        ...Object.keys(immutable),
    ]); // create a set of allowed fields for vacancy updates, including both writable and immutable fields

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

    const candidate = {
        companyId: current.companyId.toHexString(),
    }; // initialize a candidate object with the current companyId to prepare for updating the vacancy

    for (const field of writable) {
        candidate[field] = Object.hasOwn(body, field) ? body[field] : current[field];
    } // populate the candidate object with the new values from the request body for writable fields, or retain the current values if not provided

    const validated = validateVacancyCreation(candidate); // validate the candidate object to ensure that all fields meet the required criteria for vacancy creation
    const set = {}; // initialize an empty object to hold the validated fields to be updated in the vacancy

    for (const field of writable) {
        if (Object.hasOwn(body, field)) {
            set[field] = validated[field];
        } // if the request body contains a new value for a writable field, add it to the set object to be updated in the vacancy
    }

    return set;
}

function createVacancyRouter({ getDb, requireAuthentication }) {
    const router = express.Router();

    router.get(
        "/vacancies",
        requireAuthentication,
        async (req, res) => {
            await sendVacancyList(getDb(), req, res, true);
        }
    ); // define a route for retrieving a list of vacancies, requiring authentication and management rights

    router.get("/public/vacancies", async (req, res) => {
        await sendVacancyList(getDb(), req, res, false);
    }); // define a public route for retrieving a list of vacancies

    router.post("/vacancies", requireAuthentication, async (req, res) => {
        const db = getDb();
        const vacancy = validateVacancyCreation(req.body);

        await requireManagedCompany(
            db,
            vacancy.companyId,
            req.auth.user
        ); // ensure that the authenticated user has management rights for the specified company

        const now = new Date();

        vacancy._id = new ObjectId();
        vacancy.createdAt = now;
        vacancy.updatedAt = now;

        await db.collection("vacancies").insertOne(vacancy);

        res.status(201).json(vacancyResponse(vacancy, true));
    });

    router.get("/vacancies/:id", requireAuthentication, async (req, res) => {
        const db = getDb();

        const vacancy = await db.collection("vacancies").findOne({
            _id: parseId(req.params.id, "id"),
        });

        if (!vacancy) {
            throw new HttpError(
                404,
                "not_found",
                "Vacancy not found."
            );
        }

        await requireManagedCompany(
            db,
            vacancy.companyId,
            req.auth.user
        );

        res.json(vacancyResponse(vacancy, true));
    });

    router.get("/public/vacancies/:id", async (req, res) => {
        const db = getDb();

        const vacancy = await db.collection("vacancies").findOne({
            _id: parseId(req.params.id, "id"),
            isActive: true,
        }); // find the vacancy by its ID and ensure it is active

        const company = vacancy
            ? await db.collection("companies").findOne({
                _id: vacancy.companyId,
                isActive: true,
                isHidden: false,
            })
            : null; // if the vacancy is found, check if the associated company is active and not hidden

        if (!vacancy || !company) {
            throw new HttpError(
                404,
                "not_found",
                "Vacancy not found."
            );
        }

        res.json(vacancyResponse(vacancy));
    });

    router.put(
        "/vacancies/:id",
        requireAuthentication,
        async (req, res) => {
            const db = getDb();
            const vacancies = db.collection("vacancies"); // get the vacancies collection from the database

            const current = await vacancies.findOne({
                _id: parseId(req.params.id, "id"),
            }); // find the current vacancy by its ID

            if (!current) {
                throw new HttpError(
                    404,
                    "not_found",
                    "Vacancy not found."
                );
            }

            await requireManagedCompany(
                db,
                current.companyId,
                req.auth.user
            );

            // prepare the update set by validating the request body and comparing it with the current vacancy data
            const set = prepareVacancyUpdate(req.body, current);

            const updated = await vacancies.findOneAndUpdate(
                {
                    _id: current._id,
                    companyId: current.companyId,
                },
                {
                    $set: {
                        ...set,
                        updatedAt: new Date(),
                    },
                },
                { returnDocument: "after" }
            ); // update the vacancy in the database with the validated fields and set the updatedAt timestamp to the current date, returning the updated document

            if (!updated) {
                throw new HttpError(
                    404,
                    "not_found",
                    "Vacancy not found."
                );
            }

            res.json(vacancyResponse(updated, true));
        }
    );

    router.delete(
        "/vacancies/:id",
        requireAuthentication,
        async (req, res) => {
            const db = getDb();
            const vacancies = db.collection("vacancies");

            const current = await vacancies.findOne({
                _id: parseId(req.params.id, "id"),
            });

            if (!current) {
                throw new HttpError(
                    404,
                    "not_found",
                    "Vacancy not found."
                );
            }

            await requireManagedCompany(
                db,
                current.companyId,
                req.auth.user
            );

            const updated = await vacancies.findOneAndUpdate(
                {
                    _id: current._id,
                    companyId: current.companyId,
                },
                {
                    $set: {
                        isActive: false,
                        updatedAt: new Date(),
                    },
                },
                { returnDocument: "after" }
            ); // mark the vacancy as inactive in the database, ensuring that the companyId remains unchanged, and return the updated document

            if (!updated) {
                throw new HttpError(
                    404,
                    "not_found",
                    "Vacancy not found."
                );
            }

            res.json(vacancyResponse(updated, true));
        }
    );

    return router;
}

async function ensureVacancyIndexes(db) {
    const vacancies = db.collection("vacancies");

    await vacancies.createIndex({ companyId: 1 });
    await vacancies.createIndex({ type: 1, isActive: 1 });
} // ensure that the necessary indexes are created on the vacancies collection for efficient querying

module.exports = { createVacancyRouter, ensureVacancyIndexes };