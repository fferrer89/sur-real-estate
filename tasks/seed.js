import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import {listingData, messageData, userData} from '../data/index.js'
import validation from "../helpers/input-validations.js";

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

console.log('Done seeding database');
await closeConnection();