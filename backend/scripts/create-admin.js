/*

ChatGPT-6.1 Sol was used to review, validate and improve the code.
This is the module that's responsible for creating an administrator
account in the MongoDB database. It connects to the database,
ensures that the necessary indexes are in place, and creates an
admin user with the provided credentials.
*/

const { MongoClient } = require("mongodb");
const { createAccount, ensureUserIndex } = require("../auth");

async function main() {
    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is required.");
    } // validate the MongoDB URI

    const body = {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        firstName: process.env.ADMIN_FIRST_NAME,
        lastName: process.env.ADMIN_LAST_NAME,
    }; // all the necessary information for creating an admin account

    const client = new MongoClient(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
    }); // create a new MongoDB client with a 5-second timeout

    try {
        await client.connect();

        const db = client.db();

        await ensureUserIndex(db); // ensure that the necessary indexes are in place for the users collection

        const user = await createAccount(db, body, "admin");

        console.log("Administrator created. ID: " + user.id);
    }

    finally {
        await client.close();
    } // we go to 'finally' in place of 'catch' to ensure that the client
    // is closed, even if an error occurs during the account creation
    // process
}


// instead, we dedicate the error handling to the main function's catch block,
// which will handle any errors that occur during the execution of the main
// function and provide appropriate feedback to the user.
main().catch(error => {
    if (error.code === "validation_error") {
        console.error(error.message);

        if (error.errors) {
            console.error(error.errors);
        }
    }

    else if (error.code === "conflict") {
        console.error(
            "This email already exists. No existing role was changed."
        );
    }

    else {
        console.error(
            "Administrator-creation failed. Check configuration and MongoDB."
        );
    }

    process.exitCode = 1;
});