import validation from "../helpers/input-validations.js";
import {mongoConfig} from '../config/settings.js';

export class DatabaseError extends Error {
    #databaseName;
    #databaseServer;
    #collection;

    /**
     * Examples of creating a new instance of this class:
     *  new DatabaseError('Unknown database error', 'listings', {cause: new Error("Original Error") });
     *  new DatabaseError('Unknown database error', 'listings', {cause: err }); // err is the error caught in the catch-block
     *
     * @param {string} message the error message
     * @param {string} collection the collection against which this operation was directed to
     * @param {{cause: Error}} options indicates the specific original cause of the error. Used when catching and
     * re-throwing an error with a more-specific or useful error message to still have access to the original error.
     */
    constructor(message = validation.isRequired('message'),
                collection = validation.isRequired('collection'),
                options) {
        if (options) {
            super(message, options);
        } else {
            super(message);
        }
        this.name = 'DatabaseError';
        this.#databaseName = mongoConfig.database; // the name of the database
        this.#databaseServer = mongoConfig.serverUrl; // the server where the database is hosted
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, DatabaseError);
        }
    }
    get databaseName() {
        return this.#databaseName;
    }
    get databaseServer() {
        return this.#databaseServer;
    }
    get collection() {
        return this.#collection;
    }
}
export class DocumentNotFoundError extends DatabaseError {
    #documentId;
    /**
     *
     * @param {string} message the error message
     * @param {string} collection the collection against which this operation was directed to
     * @param {string} documentId the id of the document that could not be found
     * @param {{cause: Error}} options indicates the specific original cause of the error. Used when catching and
     * re-throwing an error with a more-specific or useful error message to still have access to the original error.
     */
    constructor(message = validation.isRequired('message'),
                collection = validation.isRequired('collection'),
                documentId = validation.isRequired('documentId'),
                options) {
        if (options) {
            super(message, collection, options);
        } else {
            super(message, collection);
        }
        this.name = 'DocumentNotFoundError';
        this.#documentId = documentId; // operation used for the database retrieval
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, DatabaseError);
        }
    }
    get documentId() {
        return this.#documentId;
    }
}
export class OnsiteVisitError extends Error {
    #databaseName;
    #databaseServer;
    #collection;

    /**
     * Examples of creating a new instance of this class:
     *  new DatabaseError('Unknown database error', 'listings', {cause: new Error("Original Error") });
     *  new DatabaseError('Unknown database error', 'listings', {cause: err }); // err is the error caught in the catch-block
     *
     * @param {string} message the error message
     * @param {string} collection the collection against which this operation was directed to
     * @param {{cause: Error}} options indicates the specific original cause of the error. Used when catching and
     * re-throwing an error with a more-specific or useful error message to still have access to the original error.
     */
    constructor(message = validation.isRequired('message'),
                collection = validation.isRequired('collection'),
                options) {
        if (options) {
            super(message, options);
        } else {
            super(message);
        }
        this.name = 'OnsiteVisitError';
        this.#databaseName = mongoConfig.database; // the name of the database
        this.#databaseServer = mongoConfig.serverUrl; // the server where the database is hosted
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, DatabaseError);
        }
    }
    get databaseName() {
        return this.#databaseName;
    }
    get databaseServer() {
        return this.#databaseServer;
    }
    get collection() {
        return this.#collection;
    }
}
