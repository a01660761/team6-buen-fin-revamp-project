/*
* ChatGPT-6.1 Sol was used to review and edit this code.
*/

const express = require("express");
const { ObjectId } = require("mongodb");
const { HttpError, publicUser } = require("./auth.js");
const { parseId } = require("./products.js");

function invalidQuery(message) {
    return new HttpError(400, "invalid_query", message);
}

function readUserQuery(req) {
    const params = new URL(
        req.originalUrl,
        "http://localhost"
    ).searchParams; // we only care about the query parameters, so the base URL is irrelevant

    if (params.has("id")) {
        const ids = params.getAll("id");

        if ([...params.keys()].some((key) => key !== "id")) {
            throw invalidQuery(
                "ID queries cannot be combined with other parameters."
            );
        } // if id is present, it must be the only parameter

        if (ids.length > 100 ||
            ids.some((id) => !/^[a-fA-F0-9]{24}$/.test(id))) {
            throw invalidQuery(
                "Provide between 1 and 100 valid identifiers."
            );
        } // validate that each id is a 24-character hex string

        return {
            ids: ids.map((id) => new ObjectId(id)), // convert to ObjectId for MongoDB queries
        };
    }

    const allowed = new Set([
        "q",
        "role",
        "isActive",
        "_start",
        "_end",
        "_sort",
        "_order",
    ]); // define allowed query parameters

    for (const key of params.keys()) {
        if (!allowed.has(key)) {
            throw invalidQuery(`Unsupported query parameter: ${key}.`);
        }

        if (params.getAll(key).length !== 1) {
            throw invalidQuery(`Parameter ${key} cannot be repeated.`);
        }
    } // ensure each parameter appears only once

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
            ); // escape special regex characters to prevent injection

            filter.$or = [
                { email: { $regex: escaped, $options: "i" } },
                { firstName: { $regex: escaped, $options: "i" } },
                { lastName: { $regex: escaped, $options: "i" } },
            ]; // search across email, firstName, and lastName fields, case-insensitive
        }
    }

    if (params.has("role")) {
        const role = params.get("role");

        if (!["business", "admin"].includes(role)) {
            throw invalidQuery("Unsupported role.");
        }

        filter.role = role;
    } // filter by role if provided

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
        }

        start = Number(startText);
        end = Number(endText);

        if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) ||
            end <= start || end - start > 100) {
            throw invalidQuery(
                "The page size must be between 1 and 100 records."
            );
        } // validate that start and end are safe integers, end is greater than start, and the page size does not exceed 100
    }

    const sortField = params.get("_sort") ?? "id";
    const order = params.get("_order") ?? "ASC";

    if (!["id", "email", "createdAt", "updatedAt",].includes(sortField)) {
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
    } // ensure a consistent secondary sort by _id to maintain a stable sorting

    return { filter, sort, start, limit: end - start };
}

function createAdminUserRouter({
    getDb,
    requireAuthentication,
    requireAdministrator,
}) { // with dependency injection for database access and authentication middleware
    const router = express.Router();

    router.use(requireAuthentication, requireAdministrator); // we pass down that dependency injection 

    const projection = {
        passwordHash: 0,
        tokenVersion: 0,
    }; // exclude sensitive fields from the response

    router.get("/", async (req, res) => { // note: we're actually reusing publicUser to filter out sensitive fields, but we also exclude them at the database query level for efficiency
        const users = getDb().collection("users");
        const query = readUserQuery(req); // parse and validate the query parameters

        if (query.ids) {
            const records = await users.find(
                { _id: { $in: query.ids } },
                { projection }
            ).toArray(); // if specific IDs are provided, fetch those users directly

            return res.json(records.map(publicUser));
        } // if no specific IDs, perform a filtered query with pagination and sorting

        const [total, records] = await Promise.all([
            users.countDocuments(query.filter),
            users.find(query.filter, { projection })
                .sort(query.sort)
                .skip(query.start)
                .limit(query.limit)
                .toArray(),
        ]); // perform both the count and the paginated query in parallel for efficiency

        res.set("X-Total-Count", String(total)); // set the total count header for pagination purposes

        res.json(records.map(publicUser));
    });

    router.get("/:id", async (req, res) => {
        const user = await getDb().collection("users").findOne(
            { _id: parseId(req.params.id, "id") },
            { projection }
        ); // fetch a single user by ID, using the parseId utility to validate and convert the ID

        if (!user) {
            throw new HttpError(
                404,
                "not_found",
                "User not found."
            );
        }

        res.json(publicUser(user));
    });

    return router;
}

module.exports = { createAdminUserRouter };