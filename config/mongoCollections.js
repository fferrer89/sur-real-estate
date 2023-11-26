/**
 * Configuration file used to retrieve/create collections from a database connection established in the mongoConnections.js
 * configuration file. Collections will be automatically created when a document is first inserted into a new collection.
 */
import {dbConnection} from "./mongoConnection.js";

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }
    return _col;
  };
};

// TODO: Add additional collections below if needed
/**
 *
 * @type {{LISTINGS: string, USERS: string}}
 */
export const COLLECTION_NAMES = {
  LISTINGS: 'listings',
  USERS: 'users',
}
export const users = getCollectionFn(COLLECTION_NAMES.USERS);
// export const messages = getCollectionFn('messages');
export const listings = getCollectionFn(COLLECTION_NAMES.LISTINGS);
