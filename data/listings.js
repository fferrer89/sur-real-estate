/**
 * General Steps to handle database request to a particular collection:
 *  0: Retrieve data to be added/queried/updated to/from the database
 *  1: Validate that data is in the correct format and follow the schema
 *  2: Retrieve the collection
 *  3: Perform the database operation
 *  4: Validate output the database operation
 *  5: Return requested data
 */

import { ObjectId } from "mongodb";
import {listings} from "../config/mongoCollections.js";
import validation from "../helpers/input-validations.js";
import {dbSchemas} from "../helpers/object-schemas.js";
import {DatabaseError} from "./custom-error-classes.js";
import {COLLECTION_NAMES} from "../config/mongoCollections.js"

const listingData = {
  /**
   *
   * @param {number} listingPrice
   * @param {Object} location
   * @param {number} numBeds
   * @param {number} numBaths
   * @param {number} sqft
   * @param {string} photo
   * @param {boolean} hasGarage
   * @param {boolean} hasTerrace
   * @return {Promise<string>} the listing id that has been creaed
   */
  async createListing(
      listingPrice=validation.isRequired('listingPrice'),
      location=validation.isRequired('location'),
      numBeds=validation.isRequired('numBeds'),
      numBaths=validation.isRequired('numBaths'),
      sqft=validation.isRequired('sqft'),
      photo=validation.isRequired('photo'),
      hasGarage = false,
      hasTerrace = false

  ) {
    // 0: Retrieve request information to be added/queried/updated to/from the database
    let newListing = {
      listingPrice,
      location,
      numBeds,
      numBaths,
      sqft,
      photo,
      hasGarage,
      hasTerrace
    };
    // 1: Validate that data is in the correct format and follow the schema
    newListing = validation.object('listing', newListing, dbSchemas.listing);
    validation.address('location', location);

    // 2: Retrieve the collection
    // 3: Perform the database operation
    let listingInfo;
    try {
      const listingCollection = await listings();
      listingInfo = await listingCollection.insertOne(newListing);
    } catch (e) {
      throw new DatabaseError(`Document insertion failure`, COLLECTION_NAMES.LISTINGS, {cause: e });
    }

    // 4: Validate output the database operation
    if (!listingInfo.acknowledged || !listingInfo.insertedId) {
      throw new DatabaseError(`Document insertion failure`, COLLECTION_NAMES.LISTINGS);
    }
    const listingId = listingInfo.insertedId;
    // 5: Return requested data
    return listingId.toString();
  },

  async getListing(listingId) {
    // 0: Retrieve data to be added/queried/updated to/from the database
    // 1: Validate that data is in the correct format and follow the schema
    listingId = validation.bsonObjectId(listingId, 'listingId');

    // 2: Retrieve the collection
    // 3: Perform the database operation
    let listing;
    try {
      const listingCollection = await listings();
      listing = await listingCollection.findOne({
        _id: new ObjectId(listingId),
      })
    } catch (e) {
      throw new DatabaseError(`Document find failure`, COLLECTION_NAMES.LISTINGS, {cause: e });
    }

    // 4: Validate output from database operation
    if (listing === null) {
      throw new DatabaseError(`Document find failure`, COLLECTION_NAMES.LISTINGS);
    }

    // 5: Return requested data
    return listing;
  },

  async getAllListings() {
    // 2: Retrieve the collection
    // 3: Perform the database operation
    let listingsArr;
    try {
      const listingCollection = await listings();
      listingsArr = await listingCollection.find({}).toArray();
    } catch (e) {
      throw new DatabaseError(`Documents find failure`, COLLECTION_NAMES.LISTINGS, {cause: e });
    }

    // 4: Validate output from database operation
    // 5: Return requested data
    return listingsArr;
  },

  async getListings(
      minPrice = validation.isRequired('minPrice'),
      maxPrice = validation.isRequired('maxPrice'),
      minSqft = validation.isRequired('minSqft'),
      maxSqft = validation.isRequired('maxSqft'),
      minNumBeds = validation.isRequired('minNumBeds'),
      minNumBaths = validation.isRequired('minNumBaths'),
      hasGarage = false,
      hasTerrace = false
  ) {
    // 0: Retrieve data to be added/queried/updated to/from the database
    // 1: Validate that data is in the correct format and follow the schema
    ({minPrice, maxPrice} = validation.listingPriceRange(minPrice, maxPrice));
    ({minSqft, maxSqft} = validation.listingSqftRange(minSqft, maxSqft));
    minNumBeds = validation.number('minNumBeds', minNumBeds, false);
    minNumBaths = validation.number('minNumBaths', minNumBaths, false);
    // Garage and Terrace are optional parameters with a default value of 'false'
    hasGarage = validation.boolean('hasGarage', hasGarage);
    hasTerrace = validation.boolean('hasTerrace', hasTerrace);

    // 2: Retrieve the collection
    // 3: Perform the database operation
    let listingsCol;
    try {
      const listingCollection = await listings();
      listingsCol = await listingCollection.find(
          {
            $and: [
              {listingPrice: {$gte: minPrice}},
              {listingPrice: {$lte: maxPrice}},
              {sqft: {$gte: minSqft}},
              {sqft: {$lte: maxSqft}},
              {numBeds: {$gte: minNumBeds}},
              {numBaths: {$gte: minNumBaths}},
              {hasGarage: hasGarage},
              {hasTerrace: hasTerrace}
            ]
          }).toArray();
    } catch (e) {
      throw new DatabaseError(`Documents find failure`, COLLECTION_NAMES.LISTINGS, {cause: e });
    }

    // 4: Validate output the database operation
    // 5: Return requested data
    return listingsCol;
  }
};
export default listingData;
