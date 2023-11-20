/**
 * This data file should export all functions using the ES6 standard as shown in the lecture code
 */
import { ObjectId } from "mongodb";
import {listings} from "../config/mongoCollections.js";
import validate from "../validate.js";

const listingData = {
  async createListing(
    listingPrice,
    location,
    numBeds,
    numBaths,
    sqft,
    hasGarage = false,
    hasTerrace = false,
    photo
  ) {
    listingPrice = validate.verifyPrice(listingPrice);
    location = validate.verifyLocation(location);

    let newListing = {
      listingPrice,
      location,
      numBeds,
      numBaths,
      sqft,
      hasGarage,
      hasTerrace,
      photo,
      listingVisitor: [],
      comments: [],
      deposit: [],
      pastListings: [],
    };

    const listingCollection = await listings();
    const listingInfo = await listingCollection.insertOne(newListing);
    if (!listingInfo.acknowledged || !listingInfo.insertedId) {
      throw new Error('Could not add listing');
    }
    const listingId = listingInfo.insertedId;

    return listingId.toString();
  },

  async getListingById(listingId) {
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
