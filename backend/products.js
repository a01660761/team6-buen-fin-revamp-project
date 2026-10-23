/*
* ChatGPT-6.1 Sol was used to review, validate and improve the code.
* This module handles the product-related routes and operations in the 
* backend. It includes functions for validating product data, creating 
* and updating products, and handling queries for retrieving product 
* information.
* 
*/

const express = require("express");
const { ObjectId } = require("mongodb");
const { HttpError } = require("./auth.js");

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
}

function text(value, field, maximum) {
    if (typeof value !== "string") {
        throw invalid(field, "Must be a string.");
    }

    const result = value.trim();

    if (!result || result.length > maximum) {
        throw invalid(field, `Must contain 1–${maximum} characters.`);
    }

    return result;
}

function parseId(value, field) {
    if (typeof value !== "string" ||
        !/^[a-fA-F0-9]{24}$/.test(value)) {
        throw invalid(field, "Must be a valid identifier.");
    }

    return new ObjectId(value);
}

function validateProductCreation(body, user) {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
        throw invalid("body", "Must be a JSON object.");
    }

    const allowed = [
        "companyId",
        "name",
        "description",
        "category",
        "priceCents",
        "currency",
        "imageUrl",
        "isActive",
    ]; // fields that can be set by the user

    if (user.role === "admin") {
        allowed.push("isHidden");
    } // admins can also set the isHidden field

    for (const field of Object.keys(body)) {
        if (!allowed.includes(field)) {
            throw invalid(field, "Field is not accepted.");
        }
    }

    const product = {
        companyId: parseId(body.companyId, "companyId"),
        name: text(body.name, "name", 200),
        description: text(body.description, "description", 5000),
        category: body.category,
        priceCents: body.priceCents,
        currency: Object.hasOwn(body, "currency")
            ? body.currency
            : "MXN", // default to MXN if other currency is not provided
        isActive: false,
        isHidden: false,
    }; // the default values for isActive and isHidden

    if (!CATEGORIES.includes(product.category)) {
        throw invalid("category", "Unsupported category.");
    }

    // 2500 represents $25.00 MXN, since it is in entire cents
    if (!Number.isSafeInteger(product.priceCents) ||
        product.priceCents < 0) {
        throw invalid(
            "priceCents",
            "Must be a non-negative safe integer."
        );
    } // for the sake of simplicity, we only support MXN currency for now

    if (product.currency !== "MXN") {
        throw invalid("currency", "Only MXN is supported!");
    }

    for (const field of ["isActive", "isHidden"]) {
        if (Object.hasOwn(body, field)) {
            if (typeof body[field] !== "boolean") {
                throw invalid(field, "Must be a boolean.");
            }

            product[field] = body[field];
        }
    } // business users may set it as isActive, only admins may set it as isHidden

    if (Object.hasOwn(body, "imageUrl")) {
        const value = text(body.imageUrl, "imageUrl", 2048);
        let url;

        try {
            url = new URL(value);
        } 
        
        catch {
            throw invalid("imageUrl", "Invalid image URL.");
        }

        if (!["http:", "https:"].includes(url.protocol) || !url.hostname || 
        url.username || url.password) {
            throw invalid("imageUrl", "Invalid image URL.");
        } // the URL must use http or https, have a hostname, and not contain username or password

        product.imageUrl = url.href; // store the normalized URL
    }

    return product; // return the validated product object
}

function productResponse(product, management = false) {
    const result = {
        id: product._id.toHexString(),
        companyId: product.companyId.toHexString(),
        name: product.name,
        description: product.description,
        category: product.category,
        priceCents: product.priceCents,
        currency: product.currency,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
    }; // the basic fields that are always included in the response

    if (product.imageUrl !== undefined) {
        result.imageUrl = product.imageUrl;
    }

    if (management) {
        result.isActive = product.isActive;
        result.isHidden = product.isHidden;
    } // if the user is an admin or the owner of the company, include the isActive and isHidden fields

    return result;
}

async function requireManagedCompany(db, companyId, user) {
    const filter = { _id: companyId }; // we can only get a product if the user is an admin or the owner of the company

    if (user.role !== "admin") {
        filter.ownerUserId = user._id;
    } // if the user is not an admin, only allow them to access companies they own

    const company = await db.collection("companies").findOne(filter);

    if (!company) {
        throw new HttpError(
            404,
            "not_found",
            "Company not found."
        );
    } // if no company is found with the given filter, throw a 404 error

    return company;
}

function invalidQuery(message) {
    return new HttpError(400, "invalid_query", message);
}

function readProductQuery(req, management) {
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
        "category",
        "companyId",
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
                { name: { $regex: escaped, $options: "i" } },
                { description: { $regex: escaped, $options: "i" } },
            ];
        } // if the query is not empty, create a case-insensitive regex to search in the name and description fields
    }

    if (params.has("category")) {
        const category = params.get("category");

        if (!CATEGORIES.includes(category)) {
            throw invalidQuery("Unsupported category.");
        }

        filter.category = category;
    }

    if (params.has("companyId")) {
        const companyId = params.get("companyId");

        if (!/^[a-fA-F0-9]{24}$/.test(companyId)) {
            throw invalidQuery("companyId must be a valid identifier.");
        }

        filter.companyId = new ObjectId(companyId); // filter products by the specified company ID
    }

    for (const field of ["isActive", "isHidden"]) {
        if (params.has(field)) {
            const value = params.get(field);

            if (!["true", "false"].includes(value)) {
                throw invalidQuery(`${field} must be true or false.`);
            }

            filter[field] = value === "true";
        }
    } // if the user is an admin or the owner of the company, they can filter by isActive and isHidden fields

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
        "id", "name", "category", "priceCents",
        "createdAt", "updatedAt",
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
    } // if sorting by a field other than _id, add _id as a secondary sort to ensure consistent ordering

    return { filter, sort, start, limit: end - start };
}

async function sendProductList(db, req, res, management) {
    const query = readProductQuery(req, management);

    const filter = query.ids
        ? { _id: { $in: query.ids } }
        : { ...query.filter }; // if the query contains specific IDs, filter by those IDs; otherwise, use the constructed filter from the query parameters

    if (!management) {
        filter.isActive = true;
        filter.isHidden = false;
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
        { $unwind: "$_company" }, // we're flattening the result of the lookup to get a single company document for each product
    ]; // perform a lookup to join the products with their corresponding companies and unwind the result to get a flat structure

    if (management) {
        if (req.auth.user.role !== "admin") {
            pipeline.push({
                $match: {
                    "_company.ownerUserId": req.auth.user._id,
                },
            });
        } // if the user is not an admin, only return products from companies they own
    } 
    
    else {
        pipeline.push({
            $match: {
                "_company.isActive": true,
                "_company.isHidden": false,
            },
        });
    } // only return products from active and non-hidden companies

    const products = db.collection("products");

    if (query.ids) {
        const records = await products.aggregate(pipeline).toArray();

        return res.json(
            records.map((record) => productResponse(record, management))
        ); // if the query contains specific IDs, return the matching products without pagination or sorting
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
    }); // use the $facet stage to get both the total count of matching products and the paginated records in a single query

    const [result] = await products.aggregate(pipeline).toArray();
    const total = result.total[0]?.value ?? 0;

    res.set("X-Total-Count", String(total));

    return res.json(
        result.records.map(
            (record) => productResponse(record, management)
        )
    ); // return the paginated products along with the total count in the response headers
}

function prepareProductUpdate(body, current, user) {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
        throw invalid("body", "Must be a JSON object.");
    }

    const writable = [
        "name",
        "description",
        "category",
        "priceCents",
        "currency",
        "imageUrl",
        "isActive",
    ]; // fields that can be updated by the user

    const immutable = {
        id: current._id.toHexString(),
        companyId: current.companyId.toHexString(),
        createdAt: current.createdAt.toISOString(),
        updatedAt: current.updatedAt.toISOString(),
    };

    const allowed = new Set([
        ...writable,
        ...Object.keys(immutable),
        "isHidden",
    ]); // create a set of all allowed fields, including writable fields, immutable fields, and isHidden (if the user is an admin)

    for (const field of Object.keys(body)) {
        if (!allowed.has(field)) {
            throw invalid(field, "Field is not accepted.");
        }
    }

    for (const [field, expected] of Object.entries(immutable)) {
        if (Object.hasOwn(body, field) && body[field] !== expected) {
            throw invalid(field, "Field cannot be changed.");
        } // if the request body contains an immutable field with a value different from the current value, throw an error indicating that the field cannot be changed
    }

    if (user.role !== "admin" && Object.hasOwn(body, "isHidden") &&
        body.isHidden !== current.isHidden) {
        throw new HttpError(
            403,
            "forbidden",
            "Only administrators may change isHidden."
        );
    } // if the user is not an admin and attempts to change the isHidden field, throw a 403 error indicating that only administrators can change this field

    const candidate = {
        companyId: current.companyId.toHexString(),
    };

    for (const field of writable) {
        if (current[field] !== undefined) {
            candidate[field] = current[field];
        } // initialize the candidate object with the current values of the writable fields, if they exist

        if (Object.hasOwn(body, field)) {
            if (field === "imageUrl" && body[field] === null) {
                delete candidate.imageUrl;
            } 
            
            else {
                candidate[field] = body[field];
            }
        } // if the request body contains a writable field, update the candidate object with the new value; if the imageUrl is set to null, remove it from the candidate object
    }

    if (user.role === "admin") {
        candidate.isHidden = Object.hasOwn(body, "isHidden")
            ? body.isHidden
            : current.isHidden;
    } // if the user is an admin, set the isHidden field in the candidate object to the value from the request body (if provided) or keep the current value

    const validated = validateProductCreation(candidate, user);

    const set = {};
    const unset = {};

    for (const field of writable) {
        if (!Object.hasOwn(body, field)) {
            continue;
        }

        if (field === "imageUrl" && body[field] === null) {
            unset.imageUrl = "";
        } 
        
        else {
            set[field] = validated[field];
        }
    } // for each writable field, if it is present in the request body, add it to the set object (if it has a value) or to the unset object (if it is null for imageUrl)

    if (user.role === "admin" && Object.hasOwn(body, "isHidden")) {
        set.isHidden = validated.isHidden;
    }

    return { set, unset }; // return the set and unset objects to be used in the database update operation
}

function createProductRouter({ getDb, requireAuthentication }) {
    const router = express.Router(); // create a new router for handling product related routes
    
    router.get(
        "/products",
        requireAuthentication,
        async (req, res) => {
            await sendProductList(getDb(), req, res, true);
        } // handle GET requests to retrieve a list of products, requiring authentication and returning management view of the products
    );

    router.get("/public/products", async (req, res) => {
        await sendProductList(getDb(), req, res, false);
    }); // handle GET requests to retrieve the list of public products
    
    router.post("/products", requireAuthentication, async (req, res) => {
        const db = getDb();
        const product = validateProductCreation(
            req.body,
            req.auth.user
        );

        await requireManagedCompany(
            db,
            product.companyId,
            req.auth.user
        );

        const now = new Date();

        product._id = new ObjectId();
        product.createdAt = now;
        product.updatedAt = now;

        await db.collection("products").insertOne(product);

        res.status(201).json(productResponse(product, true));
    }); // handle POST requests to create a new product, validate the request body, check if the user manages the company, and insert the product into the database

    router.get("/products/:id", requireAuthentication, async (req, res) => {
        const db = getDb(); // get the database connection

        const product = await db.collection("products").findOne({
            _id: parseId(req.params.id, "id"),
        });

        if (!product) {
            throw new HttpError(404, "not_found", "Product not found.");
        }

        await requireManagedCompany(
            db,
            product.companyId,
            req.auth.user
        ); // check if the user manages the company that owns the product

        res.json(productResponse(product, true));
    }); // handle GET requests to retrieve a product by its ID, check if the user manages the company, and return the product details

    router.get("/public/products/:id", async (req, res) => {
        const db = getDb();

        const product = await db.collection("products").findOne({
            _id: parseId(req.params.id, "id"),
            isActive: true,
            isHidden: false,
        }); // find a public, active product by its ID

        const company = product
            ? await db.collection("companies").findOne({
                _id: product.companyId,
                isActive: true,
                isHidden: false,
            })
            : null; // if the product is found, check if the company that owns it is also public, active, and not hidden

        if (!product || !company) {
            throw new HttpError(404, "not_found", "Product not found.");
        }

        res.json(productResponse(product));
    });

    router.put(
        "/products/:id",
        requireAuthentication,
        async (req, res) => {
            const db = getDb();
            const products = db.collection("products"); // get the products collection from the database

            const current = await products.findOne({
                _id: parseId(req.params.id, "id"),
            });

            if (!current) {
                throw new HttpError(
                    404,
                    "not_found",
                    "Product not found."
                );
            }

            await requireManagedCompany(
                db,
                current.companyId,
                req.auth.user
            ); // check if the user manages the company that owns the product

            const { set, unset } = prepareProductUpdate(
                req.body,
                current,
                req.auth.user
            ); // prepare the update operation by validating the request body and determining which fields to set and unset

            const update = {
                $set: {
                    ...set,
                    updatedAt: new Date(),
                },
            }; // always update the updatedAt field to the current date and time

            if (Object.keys(unset).length > 0) {
                update.$unset = unset;
            } // if there are any fields to unset, add them to the update object

            const updated = await products.findOneAndUpdate(
                {
                    _id: current._id,
                    companyId: current.companyId,
                },
                update,
                { returnDocument: "after" }
            ); // findOneAndUpdate returns the document after the update, or null if no document was found

            if (!updated) {
                throw new HttpError(
                    404,
                    "not_found",
                    "Product not found."
                );
            }

            res.json(productResponse(updated, true));
        }
    );

    router.delete(
        "/products/:id",
        requireAuthentication,
        async (req, res) => {
            const db = getDb();
            const products = db.collection("products");

            const current = await products.findOne({
                _id: parseId(req.params.id, "id"),
            }); // get the current product from the database by its ID

            if (!current) {
                throw new HttpError(
                    404,
                    "not_found",
                    "Product not found."
                );
            }

            await requireManagedCompany(
                db,
                current.companyId,
                req.auth.user
            );

            const updated = await products.findOneAndUpdate(
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
            ); // findOneAndUpdate returns the document after the update, or null if no document was found

            if (!updated) {
                throw new HttpError(
                    404,
                    "not_found",
                    "Product not found."
                );
            }

            res.json(productResponse(updated, true));
        }
    ); // we keep the document in the database but mark it as inactive, so that it can be restored later if needed

    return router; // return the configured router for handling product-related routes
}

async function ensureProductIndexes(db) {
    const products = db.collection("products");

    await products.createIndex({ companyId: 1 });
    await products.createIndex({ category: 1 });
} // create indexes on the companyId and category fields to improve query performance

module.exports = { createProductRouter, ensureProductIndexes, invalid, text, 
    parseId, requireManagedCompany };