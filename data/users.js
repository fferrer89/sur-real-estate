/**
 * General Steps to handle database request to a particular collection:
 *  0: Retrieve data to be added/queried/updated to/from the database
 *  1: Validate that data is in the correct format and follow the schema
 *  2: Retrieve the collection
 *  3: Perform the database operation
 *  4: Validate output the database operation
 *  5: Return requested data
 */

import bcrypt from 'bcrypt';
import validation from "../helpers/input-validations.js";
import {dbSchemas} from "../helpers/object-schemas.js";
import {DatabaseError, DocumentNotFoundError} from "./custom-error-classes.js";
import {COLLECTION_NAMES, listings, users} from "../config/mongoCollections.js";
import {ObjectId} from "mongodb";

/**
 * saltRounds adds random characters to the password before it hashes it. Used to deter bruteforce hacking. The higher
 * the saltRounds, the longer (more time) it takes to encrypt/decrypt passwords in our Server but the more secure it gets.
 * @type {number}
 */
const SALT_ROUNDS = 10;

const userData = {
    async signup(role = validation.isRequired('role'),
                 email = validation.isRequired('email'),
                 username = validation.isRequired('username'),
                 password = validation.isRequired('password')) {
        // 0: Retrieve data to be added/queried/updated to/from the database
        let user = {
            role,
            email,
            username,
            password,
        };
        // 1: Validate that data is in the correct format and follow the schema
        user = validation.object('user', user, dbSchemas.signupUser);

        // Validate that the email address is unique
        if (!await this.uniqueEmail(user.email)) {
            // Email address is not unique, so throw an error
            throw new DatabaseError(`Users collection does not allow duplicate emails`, COLLECTION_NAMES.USERS);
        }

        // TODO: The below line must be deleted. Just added for debugging purposes
        user.passwordToDelete = user.password;

        // Encrypt the passport
        user.password = await bcrypt.hash(password, SALT_ROUNDS);

        // 2: Retrieve the collection
        // 3: Perform the database operation
        let newUserInfo;
        try {
            const userCollection = await users();
            newUserInfo = await userCollection.insertOne(user);
        } catch (e) {
            throw new DatabaseError(`Document insertion failure`, COLLECTION_NAMES.USERS, {cause: e});
        }

        if (!newUserInfo.acknowledged || !newUserInfo.insertedId) {
            throw new DatabaseError(`Document insertion failure`, COLLECTION_NAMES.USERS);
        }
        // 4: Return requested data
        const userId = newUserInfo.insertedId;
        return userId.toString();
    },
    async login(email = validation.isRequired('email'),
                password = validation.isRequired('password')) {
        // 0: Retrieve data to be added/queried/updated to/from the database
        // 1: Validate that data is in the correct format and follow the schema
        email = validation.email('email', email);
        password = validation.password('password', password);

        // 2: Retrieve the collection
        // 3: Perform the database operation
        let userFound
        try {
            const userCollection = await users();
            userFound = await userCollection.findOne({email: email});
        } catch (e) {
            throw new DatabaseError(`Document find failure`, COLLECTION_NAMES.USERS, {cause: e});
        }

        if (!userFound) {
            // Query the db for the emailAddress supplied, if it is not found, throw an error stating "Either the email address or password is invalid".
            throw new RangeError(`Either the email address or password is invalid`);
        }
        // Compare passwords. Use bcrypt to compare the hashed password in the database with the password input parameter.
        if (!await bcrypt.compare(password, userFound.password)) {
            throw new RangeError(`Either the email address or password is invalid`);
        }
        // 5: Return requested data
        // If the passwords match your function will return the following fields of the user: firstName, lastName, emailAddress, role
        delete userFound.password;
        return userFound;
    },
    async getUser(userId= validation.isRequired('userId')) {
        // 0: Retrieve data to be added/queried/updated to/from the database
        // 1: Validate that data is in the correct format and follow the schema
        userId = validation.bsonObjectId(userId, 'userId');

        // 2: Retrieve the collection
        // 3: Perform the database operation
        let user;
        try {
            const userCollection = await users();
            user = await userCollection.findOne({
                _id: new ObjectId(userId),
            })
        } catch (e) {
            throw new DatabaseError(`Document find failure`, COLLECTION_NAMES.LISTINGS, {cause: e });
        }

        // 4: Validate output from database operation
        if (user === null) {
            throw new DocumentNotFoundError(`User not found`, COLLECTION_NAMES.LISTINGS, userId);
        }

        // 5: Return requested data
        return user;
    },
    async uniqueEmail(email = validation.isRequired('email')) {
        email = validation.email('email', email);
        const userCollection = await users();
        let foundEmail = await userCollection.findOne({email: email},
            {projection: {_id: 0, emailAddress: 1}});
        return !foundEmail;
    }
}
export default userData;
