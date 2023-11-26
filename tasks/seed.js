import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import {listingData} from '../data/index.js'

const db = await dbConnection();
await db.dropDatabase();

console.log('Seeding database ....');

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
const broadwayListingId = await listingData.createListing(444, broadwayListingLocation, 4, 3,
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
const mainStListingId = await listingData.createListing(5555, mainStListingLocation, 2, 1,
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
const centralAvnListingId = await listingData.createListing(5557, centralAvnListingLocation, 3, 1,
    55, photoMainStListing, true, true);
console.log(await listingData.getListing((centralAvnListingId)));

console.log('\nGetting all listings......');
console.log(await listingData.getAllListings());

console.log('\nGetting specific listings.....');
console.log(await listingData.getListings(444, 5555, 133, 444,
    0, 0, true, false));


console.log('Done seeding database');
await closeConnection();