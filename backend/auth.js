/*

ChatGPT-6.1 Sol was used to review, validate and improve the code.
It serves as a utility module for the backend, providing error
handling and email normalization functions.

*/

const { ObjectId } = require("mongodb"); // MongoDB ObjectId is imported to handle unique identifiers for documents in the database
const argon2 = require("argon2"); // to handle password hashing and verification using the Argon2 algorithm
const jwt = require("jsonwebtoken"); // to handle JSON Web Token creation and verification for authentication purposes
const { randomBytes } = require("node:crypto"); // to generate secure random bytes for cryptographic purposes, such as creating salts or tokens

const TOKEN_SECONDS = 900; // token expiration time in seconds (15 minutes) for JWTs

const HASH_OPTIONS = {
    type: argon2.argon2id,
    memoryCost: 64 * 1024,
    timeCost: 3,
    parallelism: 1,
}; // Configuration options for the Argon2 hashing algorithm, specifying the type, memory cost, time cost, and parallelism level

class HttpError extends Error {
    constructor(status, code, message, errors) {
        super(message); // Call the parent constructor with the message

        this.status = status;
        this.code = code;
        this.errors = errors;
    }
}

function normalizeEmail(value) {
    if (typeof value !== "string") {
        throw new HttpError(
            400,
            "validation_error",
            "A valid email is required."
        ); // Throw an error if the input is not a string
    }

    const email = value.trim().toLowerCase();

    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new HttpError(
            400,
            "validation_error",
            "A valid email of at most 254 characters is required."
        );
    } // Throw an error if the email is too long or doesn't match the classically defined regex pattern

    return email;
}

function invalid(errors) {
    return new HttpError(
        400,
        "validation_error",
        "Invalid request.",
        errors
    );
} // Creates a new HttpError instance for validation errors with a 400 status code

function objectBody(body, allowed, required) {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
        throw invalid({ body: "A JSON object is required." });
    } // Throw an error if the body is not a valid JSON object

    const errors = Object.create(null);

    for (const key of Object.keys(body)) {
        if (!allowed.includes(key)) {
            errors[key] = "Field is not accepted.";
        }
    } // Basically checks if the keys (meaning fields) in the body are allowed, and if not, adds an error message for that key

    for (const key of required) {
        if (!Object.hasOwn(body, key)) {
            errors[key] = "Field is required.";
        }
    } // Checks if all required fields are present in the body, and if not, adds an error message for that key

    if (Object.keys(errors).length > 0) {
        throw invalid(errors);
    } // If there are any errors collected, throw an invalid error with the errors object
}

function validatePassword(value) {
    if (typeof value !== "string") {
        throw invalid({ password: "Use 12 to 128 characters." });
    } // Throw an error if the password is not a string and provide a message indicating the required length

    const length = Array.from(value).length;

    if (length < 12 || length > 128) {
        throw invalid({ password: "Use 12 to 128 characters." });
    }

    return value;
}

function requiredName(value, field) {
    if (typeof value !== "string") {
        throw invalid({ [field]: "A name is required." });
    }

    const name = value.trim();

    if (name.length === 0 || Array.from(name).length > 100) {
        throw invalid({ [field]: "Use 1 to 100 characters." });
    } // Throw an error if the name is empty or exceeds 100 characters, providing a message indicating the required length

    return name;
}

function validateRegistration(body) {
    objectBody(
        body,
        ["email", "password", "firstName", "lastName", "phone"], // Allowed fields
        ["email", "password", "firstName", "lastName"] // Required fields
    ); // Validate the body object to ensure it contains only allowed fields and includes all required fields

    const input = {
        email: normalizeEmail(body.email),
        password: validatePassword(body.password),
        firstName: requiredName(body.firstName, "firstName"),
        lastName: requiredName(body.lastName, "lastName"),
    }; // An input object is created with validated and normalized values for email, password, first name, and last name

    if (Object.hasOwn(body, "phone")) {
        if (typeof body.phone !== "string" || Array.from(body.phone.trim()).length > 30) {
            throw invalid({
                phone: "Use a string of at most 30 characters.",
            });
        } // Throw an error if the phone number is not a string or exceeds 30 characters, providing a message indicating the required length

        input.phone = body.phone.trim();
    }

    return input;
}

function publicUser(user) {
    const result = {
        id: user._id.toHexString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    }; // Create a new object with public user information, excluding sensitive data, like the password

    if (user.phone !== undefined) {
        result.phone = user.phone;
    } // Include the phone number in the result if it exists

    return result;
}

async function ensureUserIndex(db) {
    await db.collection("users").createIndex(
        {email: 1},
        {unique: true}
    );
} // ensures that the "users" collection in the database has a unique index on the "email" field, preventing duplicate email addresses from being stored

async function createAccount(db, body, role = "business") {
    if (!["business", "admin"].includes(role)) {
        throw new Error("Invalid server role.");
    } // prevents the creation of accounts with roles other than "business" or "admin" by throwing an error if an invalid role is provided

    const input = validateRegistration(body);

    const passwordHash = await argon2.hash(
        input.password,
        HASH_OPTIONS
    ); // forwards the validated password to the Argon2 hashing function, using the specified hashing options, and stores the resulting hash in the passwordHash variable

    const now = new Date();

    const user = {
        _id: new ObjectId(),
        email: input.email,
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        role,
        isActive: true, // can be tampered with later to disable the account if needed
        tokenVersion: 0,
        createdAt: now,
        updatedAt: now,
    };

    if (input.phone !== undefined) {
        user.phone = input.phone;
    } // only adds the phone number to the user object if it was provided in the input

    try {
        await db.collection("users").insertOne(user); // waits for the insertion of the new user document into the "users" collection in the database, and if successful, the user is created
    }

    catch (error) {
        if (error.code === 11000) {
            throw new HttpError(
                409,
                "conflict",
                "There's already an account with this email."
            );
        } // checks if the error code is 11000, which indicates a duplicate key error in MongoDB

        throw error; // rethrows any other errors that may occur during the insertion process
    }

    return publicUser(user);
}

async function createAuth({ db, jwtSecret }) {
    await ensureUserIndex(db); // wait for the ensureUserIndex function to complete, which ensures that the "users" collection has a unique index on the "email" field

    const users = db.collection("users");

    const dummyHash = await argon2.hash(
        randomBytes(32),
        HASH_OPTIONS
    ); // generates a dummy password hash using Argon2 and random bytes

    async function login(body) {
        objectBody(
            body,
            ["email", "password"],
            ["email", "password"]
        ); // validate the body object to ensure it contains only allowed fields (1st row) and includes all required fields (2nd row) for login

        const email = normalizeEmail(body.email);
        const password = validatePassword(body.password);

        const user = await users.findOne({ email }); // retrieves the user document from the "users" collection in the database based on the provided email address

        const validPassword = await argon2.verify(
            user ? user.passwordHash : dummyHash,
            password
        ); // verifies the provided password against the user's stored password hash or the dummy hash if no user is found

        if (!user || !validPassword || user.isActive !== true ||
            !["admin", "business"].includes(user.role) ||
            !Number.isSafeInteger(user.tokenVersion) || user.tokenVersion < 0) {
            throw new HttpError(
                401,
                "unauthorized",
                "Invalid email or password. Please check your credentials and try again."
            );
        } // cover all likely cases where the login should fail, including invalid email or password, inactive user, invalid role, or invalid token version

        const id = user._id.toHexString(); // convert the user's ObjectId to a hexadecimal string representation for use in the JWT payload

        const token = jwt.sign(
            { tokenVersion: user.tokenVersion },
            jwtSecret,
            {
                algorithm: "HS256",
                subject: id,
                expiresIn: TOKEN_SECONDS,
            }
        ); // base function to create a JWT token for the authenticated user

        return {
            token,
            id,
            role: user.role,
            expiresIn: TOKEN_SECONDS,
        };
    }

    function unauthorized() {
        return new HttpError(
            401,
            "unauthorized",
            "Invalid or missing authentication."
        );
    } // the dedicated function to create a new HttpError instance for unauthorized access

    async function requireAuth(req, res, next) {
        const header = req.get("Authorization"); // retrieves the value of the "Authorization" header from the incoming request, which is expected to contain the JWT token for authentication

        const match = typeof header === "string"
            ? /^Bearer ([^\s]+)$/i.exec(header)
            : null; // uses a regular expression to check if the "Authorization" header is in the expected format of "Bearer <token>"

        if (!match) {
            throw unauthorized();
        }

        let payload;

        try {
            payload = jwt.verify(match[1], jwtSecret, {
                algorithms: ["HS256"],
                maxAge: TOKEN_SECONDS,
            }); // verifies the JWT token using the provided secret and options, and if successful, extracts the payload from the token for further validation
        }

        catch {
            throw unauthorized();
        }

        // this particular consult is purposefully outside of the try/catch block
        // to ensure that any unexpected errors during the payload validation process
        // are not silently caught and ignored, allowing them to propagate and
        // be handled appropriately by the error handling middleware
        if (
            !payload || typeof payload !== "object" ||
            typeof payload.sub !== "string" ||
            !/^[a-f0-9]{24}$/i.test(payload.sub) ||
            !Number.isSafeInteger(payload.tokenVersion) ||
            payload.tokenVersion < 0 ||
            !Number.isInteger(payload.iat) ||
            !Number.isInteger(payload.exp) ||
            payload.exp <= payload.iat ||
            payload.exp - payload.iat > TOKEN_SECONDS
        ) {
            throw unauthorized();
        } // performs additional validation on the payload extracted from the JWT token, checking for the presence and validity of all required fields

        const user = await users.findOne(
            { _id: new ObjectId(payload.sub) },
            { projection: { passwordHash: 0 } }
        ); // retrieves the user document from the "users" collection in the database based on the user ID extracted from the JWT payload, excluding the password hash from the result

        if (
            !user || user.isActive !== true ||
            !["admin", "business"].includes(user.role) ||
            user.tokenVersion !== payload.tokenVersion
        ) {
            throw unauthorized();
        } // in case the user is not found, inactive, has an invalid role, or the token version doesn't match

        req.auth = {
            user,
            tokenVersion: payload.tokenVersion,
        }; // attaches the authenticated user and their token version to the request object for use in subsequent middleware or route handlers

        next(); // calls the next middleware function in the stack, allowing the request to proceed to the next handler after successful authentication
    }

    function requireRole(...roles) {
        return (req, res, next) => {
            if (!req.auth) {
                throw unauthorized();
            }

            if (!roles.includes(req.auth.user.role)) {
                throw new HttpError(
                    403,
                    "forbidden",
                    "Operation is not permitted."
                );
            } // for instances where the authenticated user does not have the required role(s) to access a specific route or perform a certain action

            next();
        };
    }

    async function logout(authentication) {
        const result = await users.updateOne(
            {
                _id: authentication.user._id,
                isActive: true,
                tokenVersion: authentication.tokenVersion,
            },
            {
                $inc: { tokenVersion: 1 },
                $set: { updatedAt: new Date() },
            }
        ); // increments the tokenVersion field of the authenticated user in the database,
        // effectively invalidating any existing JWT tokens for that user,
        // and updates the updatedAt field to reflect the time of the logout
        // operation

        if (result.matchedCount !== 1) {
            throw unauthorized();
        } // for when the user is not found, inactive, or the token version doesn't match
    }

    return { login, requireAuth, requireRole, logout }; // returns the object of authentication functions

}

// all of the functions and classes defined in this module are exported as properties of an object, making them accessible to other parts of the application that require authentication-related functionality
module.exports = { HttpError, normalizeEmail, validateRegistration, publicUser, ensureUserIndex,
    createAccount, createAuth };