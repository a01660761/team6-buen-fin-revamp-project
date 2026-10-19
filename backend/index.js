/*

ChatGPT-6.1 Sol was used to review and edit this code.
The following changes were made:
- Added comments to explain the purpose of the code and its functionality.
- Improved error handling for database connection and JWT verification.
- Refactored some functions for better readability and maintainability.

*/

const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
// Importing necessary modules for HTTP and HTTPS servers, as well as file system operations.
const http = require("node:http");
const https = require("node:https");
const fs = require("node:fs");

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

app.use(cors({
    origin: CORS_ORIGIN,
    exposedHeaders: ["X-Total-Count"],
}));
// Enable CORS for the specified origin and expose the X-Total-Count header.

app.use(express.json());

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
	let data=db.collection(collection).insertOne(valores);
	res.json(data);

}

app.get("/Productos", async (req,res)=>{
	try{
		let token=req.get("Authentication");
		jwt.verify(token, JWT_SECRET); // Verify the JWT token for authentication; previously, this was done with a hardcoded secret, now it uses the environment variable.

		if("_sort" in req.query){
			await getList("productos", req, res);
		}

		else if("id" in req.query){
			await getMany("productos", req, res);
		}

		else{
			await getManyReference("productos", req, res);
		}
	}

	catch {
		res.sendStatus(401);
	}
});

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


app.post("/registrarse", async(req, res)=>{
	let user=req.body.username;
	let pass=req.body.password;

	let data=await db.collection("usuarios").findOne({"usuario":user});

	if (data==null){
		const hash=await argon2.hash(pass, {type: argon2.argon2id, memoryCost: 64*1024, timeCost:3, parallelism:1, saltLength:128});
		let usuarioAgregar={"usuario": user, "password": hash}
		data=await db.collection("usuarios").insertOne(usuarioAgregar);
		res.sendStatus(201);
	}

	else{
		res.sendStatus(403);
	}
});

app.post("/login", async (req, res)=>{
	let user=req.body.username;
	let pass=req.body.password;
	let data=await db.collection("usuarios").findOne({"usuario":user});
	if(data==null){
		res.sendStatus(401);
	}

	else if(await argon2.verify(data.password, pass)){
		let token=jwt.sign({usuario: data.usuario}, JWT_SECRET, {expiresIn:900});
		res.json({"token": token, "id":data.usuario});
	}

	else{
		res.sendStatus(401);
	}
})


async function start() {
    const server = HTTPS_ENABLED === "true"
        ? https.createServer({
            key: fs.readFileSync(process.env.TLS_KEY_PATH),
            cert: fs.readFileSync(process.env.TLS_CERT_PATH),
        }, app)
        : http.createServer(app); // Refactored to use HTTPS if enabled, otherwise use HTTP.

    await connectToDB();

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

start().catch(async () => {
    console.error(
        "Backend startup failed. Check the environment, " +
        "MongoDB and TLS files."
    );

    if (client) {
        await client.close().catch(() => {});
    } // Ensure the MongoDB client is closed on failure.

    process.exitCode = 1;
});