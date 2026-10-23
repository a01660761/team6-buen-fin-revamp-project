/*
* ChatGPT-6.1 Sol was used to review, validate and improve the code.
* Here we have the module that handles the company-related routes and 
* operations in the backend. It includes functions for validating company 
* data, creating and updating companies, and handling queries for 
* retrieving company information.
*/

const express = require("express");
const { ObjectId } = require("mongodb");
const { HttpError, normalizeEmail } = require("./auth.js");

const CATEGORIES = [
    "Alimentos",
    "Moda",
    "Electrónica",
    "Hogar",
    "Servicios",
    "Salud",
];

function invalid(field, message) {
    return new HttpError(
        400,
        "validation_error",
        "Invalid request.",
        { [field]: message }
    );
} // validation error for invalid field input

function text(value, field, maximum) {
    if (typeof value !== "string") {
        throw invalid(field, "Must be a string.");
    } // in case the value is not a string (e.g., number, object), throw an error

    const result = value.trim(); // remove leading and trailing whitespace

    if (result.length === 0 || result.length > maximum) {
        throw invalid(field, `Must contain 1–${maximum} characters.`);
    }

    return result;
}

function parseId(value, field) {
    if (typeof value !== "string" || !/^[a-fA-F0-9]{24}$/.test(value)) {
        throw invalid(field, "Must be a valid identifier.");
    } // whenver the value is not a string or does not match the pattern of a valid ObjectId

    return new ObjectId(value); // convert the string to an ObjectId instance
}

function validateCreation(body, user) {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
        throw invalid("body", "Must be a JSON object.");
    }

    const allowed = [
        "name", "rfc", "category", "physicalStore",
        "description", "address", "contactEmail",
        "contactPhone", "websiteUrl", "isActive",
    ]; // all allowed fields for creating a company

    if (user.role === "admin") {
        allowed.push("ownerUserId", "isHidden");
    } // accept additional fields only if the user is an admin

    for (const field of Object.keys(body)) {
        if (!allowed.includes(field)) {
            throw invalid(field, "Field is not accepted.");
        } // for invalid fields
    } // for each field in the request body, check if it is allowed

    const company = {
        name: text(body.name, "name", 200),
        rfc: text(body.rfc, "rfc", 13).toUpperCase(),
        category: body.category,
        physicalStore: body.physicalStore,
        isActive: false,
        isHidden: false,
    }; // will be sent to the database, with default values for isActive and isHidden

    if (!/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/.test(company.rfc)) {
        throw invalid("rfc", "Invalid RFC format.");
    } // check if the RFC only contains valid characters and has the correct length

    if (!CATEGORIES.includes(company.category)) {
        throw invalid("category", "Unsupported category.");
    }

    if (typeof company.physicalStore !== "boolean") {
        throw invalid("physicalStore", "Must be a boolean.");
    }

    for (const field of ["isActive", "isHidden"]) {
        if (Object.hasOwn(body, field)) {
            if (typeof body[field] !== "boolean") {
                throw invalid(field, "Must be a boolean.");
            }

            company[field] = body[field];
        }
    } // business users may set isActive, only admins may set isHidden, and both must be boolean values

    const optionalText = {
        description: 5000,
        address: 500,
        contactPhone: 30,
    };

    for (const [field, maximum] of Object.entries(optionalText)) {
        if (Object.hasOwn(body, field)) {
            company[field] = text(body[field], field, maximum);
        }
    } // optional fields that can be set by the user

    if (company.physicalStore && !company.address) {
        throw invalid("address", "Required for a physical store.");
    }

    if (Object.hasOwn(body, "contactEmail")) {
        company.contactEmail = normalizeEmail(body.contactEmail);
    }

    if (Object.hasOwn(body, "websiteUrl")) {
        const value = text(body.websiteUrl, "websiteUrl", 2048);
        let url;

        try {
            url = new URL(value);
        } 
        
        catch {
            throw invalid("websiteUrl", "Invalid website URL.");
        }

        if (!["http:", "https:"].includes(url.protocol) ||
            !url.hostname || url.username || url.password) {
            throw invalid("websiteUrl", "Invalid website URL.");
        } // only support http and https protocols, and the URL must have a hostname and no username or password

        company.websiteUrl = url.href; // store the full URL, including the protocol and hostname
    }

    company.ownerUserId = user.role === "admin"
        ? parseId(body.ownerUserId, "ownerUserId")
        : user._id; // if the user is an admin, they can set the ownerUserId field, otherwise it will be set to the current user's ID

    return company;
}

function companyResponse(company, management = false) {
    const result = {
        id: company._id.toHexString(),
        name: company.name,
        category: company.category,
        physicalStore: company.physicalStore,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt,
    }; // always include these fields in the response

    for (const field of [
        "description", "address", "contactEmail",
        "contactPhone", "websiteUrl",
    ]) {
        if (company[field] !== undefined) {
            result[field] = company[field];
        } // only include optional fields if they are defined
    }

    if (management) {
        result.ownerUserId = company.ownerUserId.toHexString();
        result.rfc = company.rfc;
        result.isActive = company.isActive;
        result.isHidden = company.isHidden;
    } // include management fields if requested

    return result;
} // convert a company document to a response object, optionally including management fields


function invalidQuery(message) {
    return new HttpError(400, "invalid_query", message);
}

function readCompanyQuery(req, management) {
    const params = new URL(
        req.originalUrl,
        "http://localhost"
    ).searchParams; // create a URL object to parse the query parameters from the request URL

    // React Admin could ask for multiple IDs
    if (params.has("id")) {
        const ids = params.getAll("id");

        if ([...params.keys()].some((key) => key !== "id")) {
            throw invalidQuery(
                "ID queries cannot be combined with other parameters."
            );
        } // so if the query contains an "id" parameter, it cannot be combined with any other parameters

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
        "category",
        "physicalStore",
        "_start",
        "_end",
        "_sort",
        "_order",
    ]); // allowed query parameters for searching companies

    if (management) {
        allowed.add("isActive");
        allowed.add("isHidden");
    } // add management-specific query parameters if needed

    for (const key of params.keys()) {
        if (!allowed.has(key)) {
            throw invalidQuery(`Unsupported query parameter: ${key}.`);
        }

        if (params.getAll(key).length !== 1) {
            throw invalidQuery(`Parameter ${key} cannot be repeated.`);
        }
    } // check if any query parameters are not allowed or repeated

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
            );

            filter.name = { $regex: escaped, $options: "i" };
        } // if the query is not empty, create a case-insensitive regex to search for the name field in the database
    } // if the query is empty, do not filter by name

    if (params.has("category")) {
        const category = params.get("category");

        if (!CATEGORIES.includes(category)) {
            throw invalidQuery("Unsupported category.");
        }

        filter.category = category;
    }

    for (const field of ["physicalStore", "isActive", "isHidden"]) {
        if (params.has(field)) {
            const value = params.get(field);

            if (!["true", "false"].includes(value)) {
                throw invalidQuery(`${field} must be true or false.`);
            }

            filter[field] = value === "true";
        }
    } // validate if a store has a physical store, is active, or is hidden, and add the corresponding filter to the query

    // pagination and sorting
    const hasStart = params.has("_start");
    const hasEnd = params.has("_end");

    if (hasStart !== hasEnd) {
        throw invalidQuery("_start and _end must be supplied together.");
    }

    let start = 0;
    let end = 10;

    // we're only allowing a maximum of 100 records per page, 
    // and the end index must be greater than the start index
    if (hasStart) {
        const startText = params.get("_start");
        const endText = params.get("_end");

        if (!/^\d+$/.test(startText) || !/^\d+$/.test(endText)) {
            throw invalidQuery("Pagination values must be non-negative integers.");
        }

        start = Number(startText);
        end = Number(endText);

        if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) ||
            end <= start || end - start > 100) {
            throw invalidQuery(
                "The page size must be between 1 and 100 records."
            );
        }
    }

    const sortField = params.get("_sort") ?? "id";
    const order = params.get("_order") ?? "ASC";

    if (!["id", "name", "category", "createdAt", "updatedAt"]
        .includes(sortField)) {
        throw invalidQuery("Unsupported sort field.");
    } // only allow sorting by certain fields

    if (!["ASC", "DESC"].includes(order)) {
        throw invalidQuery("_order must be ASC or DESC.");
    }

    // determine the sort direction based on the order parameter
    const direction = order === "ASC" ? 1 : -1;
    const databaseField = sortField === "id" ? "_id" : sortField;
    const sort = { [databaseField]: direction };

    if (databaseField !== "_id") {
        sort._id = direction;
    }

    return { filter, sort, start, limit: end - start };
}

async function sendCompanyList(db, req, res, management) {
    const query = readCompanyQuery(req, management);

    const scope = management ? (req.auth.user.role === "admin" ? {} : { ownerUserId: req.auth.user._id })
        : { isActive: true, isHidden: false }; // if the user is an admin, they can see all companies, otherwise they can only see their own companies; if the user is not authenticated, they can only see active and visible companies

    const companies = db.collection("companies");

    if (query.ids) {
        const records = await companies.find({
            ...scope,
            _id: { $in: query.ids },
        }).toArray(); // find all companies that match the provided IDs and the scope (if the user is an admin, they can see all companies, otherwise they can only see their own companies)

        return res.json(
            records.map((record) => companyResponse(record, management))
        );
    }

    const filter = {
        ...query.filter,
        ...scope,
    }; // combine the query filter with the scope

    const [total, records] = await Promise.all([
        companies.countDocuments(filter),
        companies.find(filter)
            .sort(query.sort)
            .skip(query.start)
            .limit(query.limit)
            .toArray(),
    ]); // show the total number of records that match the filter

    res.set("X-Total-Count", String(total)); // set the total number of records in the response header

    return res.json(
        records.map((record) => companyResponse(record, management))
    );
}

function companyManagementFilter(id, user) {
    const filter = {
        _id: parseId(id, "id"),
    };

    if (user.role !== "admin") {
        filter.ownerUserId = user._id;
    } // if the user is not an admin, only allow them to access their own companies

    return filter;
}

function prepareCompanyUpdate(body, current, user) {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
        throw invalid("body", "Must be a JSON object.");
    }

    const writable = [
        "name",
        "rfc",
        "category",
        "physicalStore",
        "description",
        "address",
        "contactEmail",
        "contactPhone",
        "websiteUrl",
        "isActive",
    ]; // fields that can be updated by the user

    const immutable = {
        id: current._id.toHexString(),
        ownerUserId: current.ownerUserId.toHexString(),
        createdAt: current.createdAt.toISOString(),
        updatedAt: current.updatedAt.toISOString(),
    }; // unmodifiable fields that cannot be changed by the user

    const allowed = new Set([
        ...writable,
        ...Object.keys(immutable),
        "isHidden",
    ]); // now the fields that can be updated by the user, plus the unmodifiable fields and the isHidden field (which can only be updated by an admin)

    for (const field of Object.keys(body)) {
        if (!allowed.has(field)) {
            throw invalid(field, "Field is not accepted.");
        }
    }

    for (const [field, expected] of Object.entries(immutable)) {
        if (Object.hasOwn(body, field) && body[field] !== expected) {
            throw invalid(field, "Field cannot be changed.");
        }
    } // check if the user is trying to change any of the unmodifiable fields, and throw an error if they are

    if (user.role !== "admin" && Object.hasOwn(body, "isHidden") && 
    body.isHidden !== current.isHidden) {
        throw new HttpError(
            403,
            "forbidden",
            "Only administrators may change isHidden."
        );
    }

    const optional = new Set([
        "description",
        "address",
        "contactEmail",
        "contactPhone",
        "websiteUrl",
    ]);

    const candidate = {}; // create a new object to hold the updated company data

    for (const field of writable) {
        if (current[field] !== undefined) {
            candidate[field] = current[field];
        } // set the current value of the field in the candidate object if it exists

        if (Object.hasOwn(body, field)) {
            if (body[field] === null && optional.has(field)) {
                delete candidate[field];
            } 
            
            else {
                candidate[field] = body[field];
            }
        } // if the user has provided a new value for the field, update the candidate object with the new value; 
        // if the new value is null and the field is optional, remove it from the candidate object
    }

    if (user.role === "admin") {
        candidate.ownerUserId = current.ownerUserId.toHexString();
        candidate.isHidden = Object.hasOwn(body, "isHidden") ? body.isHidden : current.isHidden;
    } // preserve the existing ownerUserId, only allow admins to change the isHidden field if they have provided a new value for it

    // validate the candidate object to ensure that it meets the requirements for creating a company, and return the validated object
    const validated = validateCreation(candidate, user);

    const set = {};
    const unset = {};

    for (const field of writable) {
        if (!Object.hasOwn(body, field)) {
            continue;
        } // if the user has not provided a new value for the field, skip it

        if (body[field] === null && optional.has(field)) {
            unset[field] = "";
        } // if the new value is null and the field is optional, add it to the unset object to remove it from the database
        
        else {
            set[field] = validated[field];
        } // otherwise, add the new value to the set object to update it in the database
    }

    if (user.role === "admin" && Object.hasOwn(body, "isHidden")) {
        set.isHidden = validated.isHidden;
    } // if the user is an admin and has provided a new value for the isHidden field, add it to the set object to update it in the database

    return { set, unset };
}


function createCompanyRouter({ getDb, requireAuthentication }) {
    const router = express.Router();

    router.get(
        "/companies",
        requireAuthentication,
        async (req, res) => {
            await sendCompanyList(getDb(), req, res, true);
        }
    ); // owners see their own companies; admins see all. both receive management fields

    router.get("/public/companies", async (req, res) => {
        await sendCompanyList(getDb(), req, res, false);
    }); // public endpoint for accessing the list of companies, and they will not see management fields

    router.post("/companies", requireAuthentication, async (req, res) => {
        const db = getDb();
        const company = validateCreation(req.body, req.auth.user); // validate the request body and create a company object

        const owner = await db.collection("users").findOne({
            _id: company.ownerUserId,
            role: "business",
        }); // check if the owner exists and if it's a business account

        if (!owner) {
            throw new HttpError(
                400,
                "invalid_reference",
                "The owner must have an existing business account."
            );
        }

        const now = new Date();
        company._id = new ObjectId(); // generate a new ObjectId for the company
        company.createdAt = now;
        company.updatedAt = now;

        try {
            await db.collection("companies").insertOne(company); // insert the company into the database
        } 
        
        catch (error) {
            if (error.code === 11000) {
                throw new HttpError(
                    409,
                    "conflict",
                    "A company with this RFC already exists."
                );
            } // handle duplicate key error for RFC

            throw error; // rethrow any other errors
        }

        res.status(201).json(companyResponse(company, true)); // return the created company with management fields
    });

    router.get("/companies/:id", requireAuthentication, async (req, res) => {
        const filter = {
            _id: parseId(req.params.id, "id"),
        }; // filter to find the company by its ObjectId

        if (req.auth.user.role !== "admin") {
            filter.ownerUserId = req.auth.user._id;
        } // if the user is not an admin, only allow them to access their own companies

        const company = await getDb()
            .collection("companies")
            .findOne(filter);

        if (!company) {
            throw new HttpError(404, "not_found", "Company not found.");
        }

        res.json(companyResponse(company, true)); // return the company with management fields
    });

    router.get("/public/companies/:id", async (req, res) => {
        const company = await getDb().collection("companies").findOne({
            _id: parseId(req.params.id, "id"),
            isActive: true,
            isHidden: false,
        }); // only allow access to active and visible companies

        if (!company) {
            throw new HttpError(404, "not_found", "Company not found.");
        }

        res.json(companyResponse(company));
    });

    router.put(
        "/companies/:id",
        requireAuthentication,
        async (req, res) => {
            const companies = getDb().collection("companies");
            const filter = companyManagementFilter(
                req.params.id,
                req.auth.user
            ); // filter to find the company by its ObjectId and ownerUserId if the user is not an admin

            const current = await companies.findOne(filter);

            if (!current) {
                throw new HttpError(
                    404,
                    "not_found",
                    "Company not found."
                );
            }

            const { set, unset } = prepareCompanyUpdate(
                req.body,
                current,
                req.auth.user
            );

            const update = {
                $set: {
                    ...set,
                    updatedAt: new Date(),
                },
            }; // always update the updatedAt field to the current date and time

            if (Object.keys(unset).length > 0) {
                update.$unset = unset;
            } // if there are any fields to unset, add them to the update object

            let updated;

            try {
                updated = await companies.findOneAndUpdate(
                    filter,
                    update,
                    { returnDocument: "after" }
                );
            }  // findOneAndUpdate returns the document after the update, or null if no document was found
            
            catch (error) {
                if (error.code === 11000) {
                    throw new HttpError(
                        409,
                        "conflict",
                        "A company with this RFC already exists."
                    );
                }

                throw error;
            }

            if (!updated) {
                throw new HttpError(
                    404,
                    "not_found",
                    "Company not found."
                );
            }

            res.json(companyResponse(updated, true));
        }
    );

    router.delete(
        "/companies/:id",
        requireAuthentication,
        async (req, res) => {
            const filter = companyManagementFilter(
                req.params.id,
                req.auth.user
            );

            const company = await getDb()
                .collection("companies")
                .findOneAndUpdate(
                    filter,
                    {
                        $set: {
                            isActive: false,
                            updatedAt: new Date(),
                        },
                    },
                    { returnDocument: "after" }
                ); // findOneAndUpdate returns the document after the update, or null if no document was found

            if (!company) {
                throw new HttpError(
                    404,
                    "not_found",
                    "Company not found."
                );
            }

            res.json(companyResponse(company, true));
        }
    );

    return router;
}

async function ensureCompanyIndexes(db) {
    const companies = db.collection("companies"); // get the companies collection

    // the indexes ensure that the RFC is unique, and allow for efficient queries on ownerUserId, 
    // category, and physicalStore
    await companies.createIndex({ rfc: 1 }, { unique: true });
    await companies.createIndex({ ownerUserId: 1 });
    await companies.createIndex({ category: 1, physicalStore: 1 });
}

module.exports = { createCompanyRouter, ensureCompanyIndexes };