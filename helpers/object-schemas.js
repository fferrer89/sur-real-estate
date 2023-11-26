import {DATA_TYPES} from './constants.js';

export const dbSchemas = {
    listing: {
        _id: {type: DATA_TYPES.BSON_OBJECT_ID, isRequired: false},
        listingPrice: {type: DATA_TYPES.NUMBER, isRequired: true},
        location: {
            type: DATA_TYPES.OBJECT,
            isRequired: true,
            properties: {
                address: {type: DATA_TYPES.STRING, isRequired: true},
                number: {type: DATA_TYPES.NUMBER, isRequired: false},
                zip: {type: DATA_TYPES.STRING, isRequired: true},
                state: {type: DATA_TYPES.STRING, isRequired: true},
                city: {type: DATA_TYPES.STRING, isRequired: true},
                longitude: {type: DATA_TYPES.STRING, isRequired: false},
                latitude: {type: DATA_TYPES.STRING, isRequired: false},
            }
        },
        numBeds: {type: DATA_TYPES.NUMBER, isRequired: true},
        numBaths: {type: DATA_TYPES.NUMBER, isRequired: true},
        sqft: {type: DATA_TYPES.NUMBER, isRequired: true},
        photo: {type: DATA_TYPES.STRING, isRequired: true},
        description: {type: DATA_TYPES.STRING, isRequired: false},
        hasGarage: {type: DATA_TYPES.BOOLEAN, isRequired: false},
        hasTerrace: {type: DATA_TYPES.BOOLEAN, isRequired: false},
        listingVisitors: {type: DATA_TYPES.ARRAY, isRequired: false, elementsType:DATA_TYPES.BSON_OBJECT_ID},
        comments: {
            type: DATA_TYPES.OBJECT,
            isRequired: false,
            properties: {
                userId: {type: DATA_TYPES.BSON_OBJECT_ID, isRequired: true},
                listingId: {type: DATA_TYPES.BSON_OBJECT_ID, isRequired: true},
                comment: {type: DATA_TYPES.STRING, isRequired: true}
            },
        }
        // TODO: Include deposit object and pastListingPrices array
    }
}
export const serverSchemas = {
    queryListingGet: {
        minPrice: {type: DATA_TYPES.STRING, isRequired: true},
        maxPrice: {type: DATA_TYPES.STRING, isRequired: true},
        minSqft: {type: DATA_TYPES.STRING, isRequired: true},
        maxSqft: {type: DATA_TYPES.STRING, isRequired: true},
        minNumBeds: {type: DATA_TYPES.STRING, isRequired: true},
        minNumBaths: {type: DATA_TYPES.STRING, isRequired: true},
        hasGarage: {type: DATA_TYPES.STRING, isRequired: false},
        hasTerrace: {type: DATA_TYPES.STRING, isRequired: false},
    },
    createListingPost: {
        listingPrice: {type: DATA_TYPES.STRING, isRequired: true},
        address: {type: DATA_TYPES.STRING, isRequired: true},
        zip: {type: DATA_TYPES.STRING, isRequired: true},
        city: {type: DATA_TYPES.STRING, isRequired: true},
        state: {type: DATA_TYPES.STRING, isRequired: true},
        numBeds: {type: DATA_TYPES.STRING, isRequired: true},
        numBaths: {type: DATA_TYPES.STRING, isRequired: true},
        sqft: {type: DATA_TYPES.STRING, isRequired: true},
        photo: {type: DATA_TYPES.STRING, isRequired: true},
        hasGarage: {type: DATA_TYPES.STRING, isRequired: false},
        hasTerrace: {type: DATA_TYPES.STRING, isRequired: false},
    }
}

let listingProperties =
    {
        _id: {type: 'bsonObjectId', isRequired: true},
        listPrice: {type: 'number', isRequired: true},
        location: {
            type: 'object',
            isRequired:true,
            properties: {
                address: {type: 'string', isRequired: true},
                number: {type: 'number', isRequired: false},
                zip: {type: 'string', isRequired: true},
                state: {type: 'string', isRequired: true},
                city: {type: 'string', isRequired: true}}
        },
        numBeds: {type: 'number', isRequired: true},
        hasGarage: {type: 'boolean', isRequired: false},
        hasTerrace: {type: 'boolean', isRequired: true},
        listingVisitors: {
            type: 'array',
            isRequired: true,
            elementsType: 'string'
        },
        photos: {
            type: 'array',
            isRequired: false,
            elementsType: 'string'
        },
    }
