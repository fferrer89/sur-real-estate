import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import {listingData, messageData, userData, listingVisitorData} from '../data/index.js'
import validation from "../helpers/input-validations.js";
import {ObjectId} from "mongodb";

const db = await dbConnection();
await db.dropDatabase();

console.log('Seeding database ....');

const realtorUser = {
    role: 'realtor',
    email: 'realtor@gmail.com',
    username: 'realtor',
    password: 'Test123$'
}
const realtorId = await userData.signup(realtorUser.role, realtorUser.email, realtorUser.username, realtorUser.password);
console.log('Realtor Id: ' + realtorId);

const generalUser = {
    role: 'general',
    email: 'general@gmail.com',
    username: 'general',
    password: 'Test123$'
}
const generalUserId = await userData.signup(generalUser.role, generalUser.email, generalUser.username, generalUser.password);
console.log('Realtor Id: ' + generalUserId);


const broadwayListingLocation= {
    address: 'Broadway Ave',
    number: 1502,
    zip: '60617',
    state: 'IL',
    city: 'Chicago',
    longitude: '1028ey190e0',
    latitude: '102y9e129yde'
};
let photoBroadwayListing = 'broadway-apt-test.jpg';
const broadwayListingId = await listingData.createListing(realtorId, 444, broadwayListingLocation, 4, 3,
    444, photoBroadwayListing, true, false);
console.log(await listingData.getListing((broadwayListingId)));


const mainStListingLocation= {
    address: 'Main St',
    number: 332,
    zip: '55430',
    state: 'IL',
    city: 'Chicago',
    longitude: '1028ey190e0',
    latitude: '102y9e129yde'
};
let photoMainStListing = 'main-st-house-test.jpg';
const mainStListingId = await listingData.createListing(realtorId, 5555, mainStListingLocation, 2, 1,
    133, photoMainStListing, true, false);
console.log(await listingData.getListing((mainStListingId)));

const centralAvnListingLocation= {
    address: 'Central Avn',
    number: 44,
    zip: '66656',
    state: 'IL',
    city: 'Chicago',
    longitude: '1028ey190e0',
    latitude: '102y9e129yde'
};
const centralAvnListingId = await listingData.createListing(realtorId, 5557, centralAvnListingLocation, 3, 1,
    55, photoMainStListing, true, true);
console.log(await listingData.getListing((centralAvnListingId)));
const nonExisitingListingId = '657095cdb4f7ac4b2ba52088';
try {
    await listingData.getListing(nonExisitingListingId);
} catch (e) {
    console.log(`Listing with ID ${nonExisitingListingId} does not exist`);
}

console.log('\nGetting all listings......');
console.log(await listingData.getAllListings());

console.log('\nGetting specific listings.....');
console.log(await listingData.getListings(444, 5555, 133, 444,
    0, 0, true, false));

// Edit listings
// Add comment to listing
let comment = {
    userId:generalUserId,
    username:realtorUser.username,
    comment:'This property in Central Avenue is Awesome!'
};
await listingData.addListingComment(centralAvnListingId, comment);
comment.comment = 'This is a second comment to this awesome property'
await listingData.addListingComment(centralAvnListingId, comment);

// Create Message
const messageId = await messageData.newMessage(realtorId, generalUserId, 'hello general user. I am the realtor and this is my first message on Central Av listing!', centralAvnListingId)
console.log('messageId: ' + messageId);
// Reply message
const reply = await messageData.respondMessage(messageId, generalUserId, 'Thank you! I am the general!');
console.log(reply);
const message2Id = await messageData.newMessage(generalUserId, realtorId, 'hello Realtor. I am the general and this is my first message on Main St listing!', mainStListingId)
console.log('messageId: ' + message2Id);
const message3Id = await messageData.newMessage(generalUserId, realtorId, 'hello Realtor. I am the general and this is my message on Central Av listing!!', centralAvnListingId)
console.log('messageId: ' + message2Id);
console.log('------------');
const messagesSent = await messageData.getSentMessages(realtorId);
console.log(messagesSent);

// Listing Messages
console.log('Listing Messages-------------------');
const messagesOfListing = await messageData.getListingMessages(centralAvnListingId);
console.log(messagesOfListing);

// Listing Deposits
console.log('Listing Deposits-------------------');
const deposit = await listingData.addListingDeposit(centralAvnListingId, generalUserId, 555);
console.log(deposit);

// Listing Visitors
console.log('Listing Visitors-------------------');
const visitStartTime = '2026-12-06T23:34'; // Dec 6th at 11:34 PM - Dec 7th at 00:04 AM
const visitor = await listingVisitorData.addListingVisitor(broadwayListingId, generalUserId, visitStartTime);
console.log(visitor);
const visit1StartTime = '2026-01-01T23:34'; // Jan 1th at 11:34 PM - Dec 7th at 00:04 AM
const visitor1 = await listingVisitorData.addListingVisitor(broadwayListingId, generalUserId, visit1StartTime);
console.log(visitor1);
const visit2StartTime = '2026-01-02T07:08'; // Jan 2nd at 07:08 AM - Jan 2nd at 07:38 AM
const visitor2 = await listingVisitorData.addListingVisitor(broadwayListingId, realtorId, visit2StartTime);
console.log(visitor2);
const visit3StartTime = '2026-01-02T09:10'; // Jan 2nd at 09:10 AM - Jan 2nd at 09:40 AM
const visitor3 = await listingVisitorData.addListingVisitor(mainStListingId, realtorId, visit3StartTime);
console.log(visitor3);
const visit4StartTime = '2026-01-03T09:10'; // Jan 3nd at 09:15 AM - Jan 2nd at 09:45 AM
const visitor4 = await listingVisitorData.addListingVisitor(mainStListingId, realtorId, visit4StartTime);
console.log(visitor4);

// Listing Visits
console.log('Listing Visits-------------------');
const listingVisitsBroadwayListing = await listingVisitorData.getListingVisits(broadwayListingId);
console.log(listingVisitsBroadwayListing);
try {
    let listingNonExisitingListing = await listingVisitorData.getListingVisits(nonExisitingListingId);
} catch (e) {
    console.log(`Listing with ID ${nonExisitingListingId} does not exist`);
}
const listingVisitsMainStListing = await listingVisitorData.getListingVisits(centralAvnListingId);
console.log(listingVisitsMainStListing);

// Visit Conflicts
console.log('Visit Conflicts-------------------');
const nonConflictingVisitStartTime = '2026-01-02T06:43';
const nonConflictingVisits = await listingVisitorData.getConflictingVisits(nonConflictingVisitStartTime)
console.log(nonConflictingVisits);
const nonConflictingVisitStartTime1 = '2026-01-02T07:49';
const nonConflictingVisits1 = await listingVisitorData.getConflictingVisits(nonConflictingVisitStartTime1)
console.log(nonConflictingVisits1);

const conflictingVisitStartT = '2026-12-06T23:33'; // '2026-01-02T06:44';
const conflictingV = await listingVisitorData.getConflictingVisits(conflictingVisitStartT)
console.log(conflictingV);

const conflictingVisitStartTime = '2026-01-02T06:44'; // '2026-01-02T06:44';
const conflictingVisits = await listingVisitorData.getConflictingVisits(conflictingVisitStartTime)
console.log(conflictingVisits);
const conflictingVisitStartTime1 = '2026-01-02T09:39';
const conflictingVisits1 = await listingVisitorData.getConflictingVisits(conflictingVisitStartTime1)
console.log(conflictingVisits1);
const conflictingVisitStartTime2 = '2026-01-03T08:00';
const conflictingVisits2 = await listingVisitorData.getConflictingVisits(conflictingVisitStartTime2)
console.log(conflictingVisits2);



console.log('Done seeding database');
await closeConnection();