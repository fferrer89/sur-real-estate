/**
 * This data file should export all functions using the ES6 standard as shown in the lecture code
 */
import { ObjectId } from "mongodb";
import { listings } from "../config/mongoCollections.js";
import validate from "../validate.js";

const listingsCollection = await listings();

const listingVisitorData = {
  async createListing(userId, listingId, startTime, endTime) {
    userId = validate.verifyId(userId);
    listingId = validate.verifyId(userId);

    let newListingVisitor = {
      userId: userId,
      listingId: listingId,
      startTime: startTime,
      endTime: endTime,
    };

    await listingsCollection.findOneAndUpdate(
      { _id: new ObjectId(listingId) },
      { $push: { listingVisitor: newListingVisitor } }
    );
    const find = await listingsCollection.findOne({
      _id: new ObjectId(listingId),
    });

    return find;
  },

  async getAllListingVisitors(listingId) {
    listingId = validate.verifyId(userId);
    const allListings = await listingsCollection.findOne({
        _id: new ObjectId(listingId),
      });
    if (!allListings) throw "Could not get all listings";
    const listingVisitors = allListings.listingVisitor;
    return listingVisitors;
  }

};

export default listingVisitorData;
