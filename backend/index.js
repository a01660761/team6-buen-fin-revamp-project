/*

ChatGPT-6.1 Sol was used to review, validate and improve the code.
The following changes were made:
- Added comments to explain the purpose of the code and its functionality.
- Improved error handling for database connection and JWT verification.
- Refactored some functions for better readability and maintainability.

*/

const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
// const argon2 = require("argon2"); --since we are now using the auth.js module for authentication
// const jwt = require("jsonwebtoken"); -- also handled in auth.js
// importing necessary modules for HTTP and HTTPS servers, as well as file system operations.
const http = require("node:http");
const https = require("node:https");
const fs = require("node:fs");

const { HttpError, createAccount, createAuth, publicUser } = require("./auth.js"); // import custom authentication utilities
const { createCompanyRouter, ensureCompanyIndexes } = require("./companies.js"); // import the company router for handling company related routes
const { createProductRouter, ensureProductIndexes } = require("./products.js"); // import the product router for handling product related routes
const { createOfferRouter, ensureOfferIndexes } = require("./offers.js"); // import the offer router for handling offer related routes
const { createVacancyRouter, ensureVacancyIndexes } = require("./vacancies.js"); // import the vacancy router for handling vacancy related routes
const { createAdminUserRouter } = require("./admin-users.js"); // import the admin user router for handling admin user related routes

const app = express();

const PORT = Number(process.env.PORT || "3000");
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const CORS_ORIGIN =
    process.env.CORS_ORIGIN || "http://localhost:5173";
const HTTPS_ENABLED = process.env.HTTPS_ENABLED || "false";

if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
    throw new Error(
        "PORT must be an integer between 1 and 65535."
    );
} // Validate the port number

if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is required.");
} // Validate the MongoDB URI

if (!JWT_SECRET || JWT_SECRET === "replace_with_local_secret" || JWT_SECRET.length < 32) {
    throw new Error(
        "JWT_SECRET must contain at least 32 characters " +
        "and must not use the example value."
    );
} // Validate the JWT secret

if (!["true", "false"].includes(HTTPS_ENABLED)) {
    throw new Error("HTTPS_ENABLED must be true or false.");
}

if (HTTPS_ENABLED === "true" &&
    (!process.env.TLS_KEY_PATH || !process.env.TLS_CERT_PATH)) {
    throw new Error(
        "HTTPS requires TLS_KEY_PATH and TLS_CERT_PATH."
    );
}

let db;
let client;
let auth;

// two middleware functions are defined to enforce authentication
// and role-based access control on specific routes
const requireAuthentication = (req, res, next) =>
    auth.requireAuth(req, res, next);

const requireAdministrator = (req, res, next) =>
    auth.requireRole("admin")(req, res, next);

app.use(cors({
    origin: CORS_ORIGIN,
    exposedHeaders: ["X-Total-Count"],
}));
// enable CORS for the specified origin and expose the X-Total-Count header

app.use(express.json());

app.use(createCompanyRouter({
    getDb: () => db,
    requireAuthentication,
})); // use the company router for handling company related routes, passing in the database and authentication middleware

app.use(createProductRouter({
    getDb: () => db,
    requireAuthentication,
})); // use the product router for handling product related routes, passing in the database and authentication middleware

app.use(createOfferRouter({
    getDb: () => db,
    requireAuthentication,
})); // use the offer router for handling offer related routes, passing in the database and authentication middleware

app.use(createVacancyRouter({
    getDb: () => db,
    requireAuthentication,
})); // use the vacancy router for handling vacancy related routes, passing in the database and authentication middleware

async function connectToDB() {
    client = new MongoClient(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
    });

    await client.connect();
    db = client.db();

    await db.command({ ping: 1 });

    console.log("Connected to MongoDB.");
}

async function getList(collection, req, res){
	let sortBy=req.query._sort;
	let sortOrder=req.query._order=="ASC"?1:-1;
	let inicio=Number(req.query._start);
	let fin=Number(req.query._end);
	let sorter={}
	sorter[sortBy]=sortOrder;
	let data=await db.collection(collection).find({}).sort(sorter).project({_id:0}).toArray();
	res.set("Access-Control-Expose-Headers", "X-Total-Count");
	res.set("X-Total-Count", data.length);
	data=await data.slice(inicio, fin);
	res.json(data);
}

async function getMany(collection, req, res){
	let data=[]
	for(let index=0;index<req.query.id.length; index++){
		let dataParcial=await db.collection(collection).find({id:Number(req.query.id[index])}).project({_id:0}).toArray();
		data=await data.concat(dataParcial);
	}
	res.json(data);
}

async function getManyReference(collection, req, res){
	let data=await db.collection("productos").find(req.query).project({_id:0}).toArray();
	res.set("Access-Control-Expose-Headers", "X-Total-Count");
	res.set("X-Total-Count", data.length);
	res.json(data);
}

async function getOne(collection, id, req,res){
	let data=await db.collection(collection).find({"id":id}).project({"_id":0}).toArray();
	res.json(data[0]);
}

async function updateData(collection, req, res){
	let valores=req.body;
	valores["id"]=Number(valores["id"]);
	let data=await db.collection(collection).updateOne({"id":valores["id"]},{"$set":valores});
	data=await db.collection(collection).find({"id":valores["id"]}).project({"_id":0}).toArray();
	res.json(data[0]);
}

async function deleteData(collection, id, req, res){
	let data=await db.collection(collection).deleteOne({"id":id});
	res.json(data);
}

async function createData(collection, req, res){
	let valores=req.body;
	valores["id"]=Number(valores["id"]);
	let data = await db.collection(collection).insertOne(valores); // insert the new document into the specified collection
	res.json(data);

}

app.get(
    "/users/me",
    requireAuthentication,
    (req, res) => {
        res.json(publicUser(req.auth.user));
    }
); // route to get the authenticated user's public information, using the requireAuthentication middleware to ensure the user is logged in

app.use(
    "/users", 
    createAdminUserRouter({
    getDb: () => db,
    requireAuthentication,
    requireAdministrator
})); // use the admin user router for handling admin user related routes, passing in the database and authentication middleware

app.use(
    "/Productos",
    requireAuthentication,
    requireAdministrator
); // middleware to ensure that only authenticated users with the 'admin' role can access the '/Productos' routes

app.get("/Productos", async (req, res) => {
    if ("_sort" in req.query) {
        await getList("productos", req, res);
    }

    else if ("id" in req.query) {
        await getMany("productos", req, res);
    }

    else {
        await getManyReference("productos", req, res);
    }
}); // route to get products, with different behaviors based on query parameters: sorting, filtering by IDs, or getting references

app.get("/Productos/:id", async(req, res)=>{
	await getOne("productos", Number(req.params.id), req, res);
});

app.put("/Productos/:id", async(req, res)=>{
	await updateData("productos", req, res);
});

app.delete("/Productos/:id", async(req, res)=>{
	await deleteData("productos", Number(req.params.id), req, res);
});

app.post("/Productos/", async(req, res)=>{
	await createData("productos",  req, res);
});


app.post("/registrarse", async (req, res) => {
    const user = await createAccount(
        db,
        req.body,
        "business"
    ); // now it uses the createAccount function from auth.js to handle user registration, which includes validation and password hashing

    res.status(201).json(user); // respond with the created user object, which includes public information but excludes sensitive data like the password hash
});

// instead of handling login directly in the route, we now delegate it
// to the auth.login function, which encapsulates the logic for verifying
// credentials and generating JWTs
app.post("/login", async (req, res) => {
    const session = await auth.login(req.body);

    res.json(session); // respond with the session object, which includes the JWT and any other relevant session information
});

app.post("/logout", requireAuthentication, async (req, res) => {
    await auth.logout(req.auth);

    res.status(204).end(); // respond with a 204 No Content status to indicate successful logout without returning any content

}); // route to handle user logout, which requires the user to be authenticated and calls the auth.logout function to invalidate the session or token

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    } // check if the response headers have already been sent; if so, pass the error to the next middleware

    if (error instanceof HttpError) {
        const body = {
            message: error.message,
            code: error.code,
        };

        if (error.errors !== undefined) {
            body.errors = error.errors;
        } // include any additional error details if they exist

        return res.status(error.status).json(body);
    }

    if (error.type === "entity.parse.failed") {
        return res.status(400).json({
            message: "Invalid JSON body.",
            code: "validation_error",
        });
    }

    if (error.type === "entity.too.large") {
        return res.status(413).json({
            message: "Request body is too large.",
            code: "payload_too_large",
        });
    }

    console.error("An unexpected request error occurred.");

    return res.status(500).json({
        message: "An unexpected server error occurred.",
        code: "internal_error",
    });
});


async function start() {
    const server = HTTPS_ENABLED === "true"
        ? https.createServer({
            key: fs.readFileSync(process.env.TLS_KEY_PATH),
            cert: fs.readFileSync(process.env.TLS_CERT_PATH),
        }, app)
        : http.createServer(app); // Refactored to use HTTPS if enabled, otherwise use HTTP

    await connectToDB();
    await ensureCompanyIndexes(db); // ensure that the necessary indexes for the companies collection are created in the database
    await ensureProductIndexes(db); // ensure that the necessary indexes for the products collection are created in the database
    await ensureOfferIndexes(db); // ensure that the necessary indexes for the offers collection are created in the database
    await ensureVacancyIndexes(db); // ensure that the necessary indexes for the vacancies collection are created in the database
    
	auth = await createAuth({
        db,
        jwtSecret: JWT_SECRET,
    }); // we now create an auth object using the createAuth function from auth.js, which encapsulates authentication logic and JWT handling

    await new Promise((resolve, reject) => {
        server.once("error", reject);
        server.listen(PORT, "127.0.0.1", resolve);
    });

    const protocol = HTTPS_ENABLED === "true"
        ? "https"
        : "http";

    console.log(
        `Backend ready at ${protocol}://localhost:${PORT}`
    );
}

start().catch(async (error) => {
    console.error(
        "Backend startup failed. Check the environment, " +
        "MongoDB and TLS files."
    );

	console.error("Failure type:", error.name);

	console.error(
		"Failure code:",
		error.code ?? error.cause?.code ?? "not_available"
	);

    if (client) {
        await client.close().catch(() => {});
    } // Ensure the MongoDB client is closed on failure.

    process.exitCode = 1;
});