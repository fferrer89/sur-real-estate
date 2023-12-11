/**
 * This data file should export all functions using the ES6 standard as shown in the lecture code
 */
import {ObjectId} from "mongodb";
import {COLLECTION_NAMES, listings} from "../config/mongoCollections.js";
import validation from "../helpers/input-validations.js";
import {DatabaseError, DocumentNotFoundError, OnsiteVisitError} from "./custom-error-classes.js";
import {listingData} from "./index.js";

const listingsCollection = await listings();

const listingVisitorData = {
    async getListingVisits(listingId = validation.isRequired('listingId')) {
        // 0: Retrieve data to be added/queried/updated to/from the database
        // 1: Validate that data is in the correct format and follow the schema
        listingId = validation.bsonObjectId(listingId, 'listingId');

        // 2: Retrieve the collection
        // 3: Perform the database operation
        let listingVisits;
        try {
            const listingCollection = await listings();
            listingVisits = await listingCollection.findOne(
                {_id: new ObjectId(listingId)},
                {projection: {_id: 0, visits: 1}},
                {});
        } catch (e) {
            throw new DatabaseError(`Document find failure`, COLLECTION_NAMES.LISTINGS, {cause: e});
        }

        // 4: Validate output from database operation
        if (listingVisits === null) {
            throw new DocumentNotFoundError(`Listing not found`, COLLECTION_NAMES.LISTINGS, listingId);
        }

        // 5: Return requested data
        if (listingVisits.length)
            return listingVisits.visits;
    },
    /**
     *
     * @param {string} startTime
     * @param visitLengthMinutes
     * @return {Promise<FlatArray<*[], 1>[]>}
     */
    async getConflictingVisits(startTime = validation.isRequired('startTime'),
                               visitLengthMinutes = 30) {
        // 0: Retrieve data to be added/queried/updated to/from the database
        // 1: Validate that data is in the correct format and follow the schema
        const visitStartTimestamp = validation.dateTimeString('startTime', startTime);
        const visitEndTimestamp = visitStartTimestamp + (visitLengthMinutes * (60 * 1000));
        // 2: Retrieve the collection
        // 3: Perform the database operation
        let listingsFiltered;
        try {
            const listingCollection = await listings();
            listingsFiltered = await listingCollection.aggregate([{
                $project: {
                    'visits': {
                        $filter: {
                            'input': '$visits',
                            'as': 'visit',
                            'cond': {
                                $or: [
                                    {$and: [{$lte: ['$$visit.startTimestamp', new Date(visitStartTimestamp)]}, {$gte: ['$$visit.endTimestamp', new Date(visitStartTimestamp)]}]},
                                    {$and: [{$lte: ['$$visit.startTimestamp', new Date(visitEndTimestamp)]}, {$gte: ['$$visit.endTimestamp', new Date(visitEndTimestamp)]}]}
                                ]
                            }
                        }
                    }
                }
            }]).toArray();
        } catch (e) {
            throw new DatabaseError(`Document find failure`, COLLECTION_NAMES.LISTINGS, {cause: e});
        }

        // 4: Prepare data to return
        let listingVisits = [];
        listingsFiltered.forEach((listing) => {
            if (listing.visits && listing.visits.length > 0) {
                listingVisits.push(listing.visits);
            }
        })
        // 5: Return requested data
        return listingVisits.flat(); // returns empty array if there is not conflict. Otherwise, returns and array of conflicting visits
    },
    async addListingVisitor(listingId = validation.isRequired('listingId'),
                            visitorId = validation.isRequired('visitorId'),
                            startTime = validation.isRequired('startTime'),
                            visitLengthMinutes = 30) {
        // 0: Retrieve data to be added/queried/updated to/from the database
        // 1: Validate that data is in the correct format and follow the schema
        listingId = validation.bsonObjectId(listingId, 'listingId');
        visitorId = validation.bsonObjectId(visitorId, 'visitorId');
        const startTimestamp = validation.dateTimeString('startTime', startTime);
        const endTimestamp = startTimestamp + (visitLengthMinutes * (60 * 1000));

        // Validate that the listing does not have a deposit
        const currentListing = listingData.getListing(listingId);
        if (currentListing.deposit) {
            // If the listing has a deposit, don't allow booking onsite visits.
            throw new OnsiteVisitError(`An onsite visit cannot be scheduled in a listing with a deposit`, COLLECTION_NAMES.LISTINGS);
        }
        // Validate that there is not another listing in the time frame of 30 minutes from visitTime. Prevent conflicting visits!
        const conflictingListings = await this.getConflictingVisits(startTime);
        if (conflictingListings.length > 0) {
            throw new OnsiteVisitError(`At least one onsite visit is scheduled at the same time`, COLLECTION_NAMES.LISTINGS);
        }
        let visit = {
            listingId,
            visitorId,
            startTimestamp: new Date(startTimestamp),
            endTimestamp: new Date(endTimestamp),
        };

        // Make sure that the comment.userId is valid and exists in the database. Returns an error if user is not found
        // 2: Retrieve the collection
        // 3: Perform the database operation
        let listing;
        try {
            const listingCollection = await listings();
            listing = await listingCollection.findOneAndUpdate(
                {_id: new ObjectId(listingId)},
                {$push: {visits: visit}},
                {returnDocument: 'after'}
            )
        } catch (e) {
            throw new DatabaseError(`Document find failure`, COLLECTION_NAMES.LISTINGS, {cause: e});
        }
        // 4: Validate output the database operation
        if (!listing) {
            throw new DocumentNotFoundError(`Listing not found`, COLLECTION_NAMES.LISTINGS, listingId);
        } else {
            // 5: Return requested data
            return listing.visits[listing.visits.length - 1]; // Return the newly added visit
        }
    }

};

export default listingVisitorData;
