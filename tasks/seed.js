import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import {listingData} from '../data/index.js'

const db = await dbConnection();
await db.dropDatabase();

console.log('Seeding database ....');

const broadwayListingLocation= {
    streetAddress: 'Broadway Ave',
    number: 1502,
    zip: '60617',
    state: 'IL',
    city: 'Chicago',
    longitude: '1028ey190e0',
    latitude: '102y9e129yde'
};
let photoBroadwayListing = 'broadway-apt-test.jpg';
const broadwayListingId = await listingData.createListing(444, broadwayListingLocation, 4, 3,
    444, true, true, photoBroadwayListing);
console.log(await listingData.getListing((broadwayListingId)));


const mainStListingLocation= {
    streetAddress: 'Main St',
    number: 332,
    zip: '55430',
    state: 'IL',
    city: 'Chicago',
    longitude: '1028ey190e0',
    latitude: '102y9e129yde'
};
let photoMainStListing = 'main-st-house-test.jpg';
const mainStListingId = await listingData.createListing(5555, mainStListingLocation, 2, 1,
    133, false, false, photoMainStListing);
console.log(await listingData.getListing((mainStListingId)));

console.log(await listingData.getAllListings());

console.log('Done seeding database');
await closeConnection();