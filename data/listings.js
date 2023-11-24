/**
 * This data file should export all functions using the ES6 standard as shown in the lecture code
 */
import { ObjectId } from "mongodb";
import {listings} from "../config/mongoCollections.js";
import validations from "../validate.js";

const listingData = {
  async createListing(
    listingPrice,
    location,
    numBeds,
    numBaths,
    sqft,
    photo,
    hasGarage, // optional
    hasTerrace, // optional

  ) {
    listingPrice = validate.verifyPrice(listingPrice);
    location = validate.verifyLocation(location);

    let newListing = {
      listingPrice,
      location,
      numBeds,
      numBaths,
      sqft,
      photo,
      listingVisitor: [],
      comments: [],
      deposit: [],
      pastListings: [],
    };
    if (hasGarage !== undefined) {
      newListing.hasGarage = hasGarage;
    }
    if (hasTerrace !== undefined) {
      newListing.hasTerrace = hasTerrace;
    }

    const listingCollection = await listings();
    const listingInfo = await listingCollection.insertOne(newListing);
    if (!listingInfo.acknowledged || !listingInfo.insertedId) {
      throw new Error('Could not add listing');
    }
    const listingId = listingInfo.insertedId;

    return listingId.toString();
  },

  async getListing(listingId) {
    // listingId = validate.verifyId(listingId);
    const listingCollection = await listings();
    const listing = await listingCollection.findOne({
      _id: new ObjectId(listingId),
    });
    if (listing === null) throw new Error('Listing could not be found with provided id');
    return listing;
  },

  async getAllListings() {
    const listingCollection = await listings();
    let listingsArr = await listingCollection.find({}).toArray();
    if (!listingsArr) throw new Error('Could not get all listings');
    return listingsArr;
  },

  async getListings(
      minPrice = validations.isRequired('minPrice'),
      maxPrice = validations.isRequired('maxPrice'),
      minSqft = validations.isRequired('minSqft'),
      maxSqft = validations.isRequired('maxSqft'),
      minNumBeds = validations.isRequired('minNumBeds'),
      minNumBaths = validations.isRequired('minNumBaths'),
      hasGarage = false,
      hasTerrace = false
  ) {
    // Validations
    validations.numOfArgumentsCheck('getListings()', arguments.length, 8, 8); // Check whether this function
    ({minPrice, maxPrice} = validations.listingPriceRange(minPrice, maxPrice));
    ({minSqft, maxSqft} = validations.listingSqftRange(minSqft, maxSqft));
    minNumBeds = validations.numberCheck('minNumBeds', minNumBeds, false);
    minNumBaths = validations.numberCheck('minNumBaths', minNumBaths, false);
    // Garage and Terrace are optional parameters with a default value of 'false'
    hasGarage = validations.booleanCheck('hasGarage', hasGarage);
    hasTerrace = validations.booleanCheck('hasTerrace', hasTerrace);
    const listingCollection = await listings();
    const listingsCol = await listingCollection.find(
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
    return listingsCol;
  }

  // async removeListing(listingId) {
  //   listingId = validate.verifyId(listingId);
  //   let deletedStatus = false;
  //   const listingCollection = await listings();
  //   let removed = await listingCollection.findOneAndDelete({
  //     _id: new ObjectId(listingId),
  //   });
  //   if (!removed)
  //     throw "Listing requested for removal does not exist in the database";
  //   if (removed) {
  //     deletedStatus = true;
  //   }
  //   let status = {
  //     location: removed.location.streetAddress,
  //     deletedStatus: deletedStatus,
  //   };
  //
  //   return status;
  // },
};
export default listingData;
