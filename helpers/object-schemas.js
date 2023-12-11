import {TYPES} from './constants.js';

export const dbSchemas = {
    listing: {
        _id: {type: TYPES.BSON_OBJECT_ID, isRequired: false},
        realtorId: {type: TYPES.BSON_OBJECT_ID, isRequired: true},
        listingPrice: {type: TYPES.NUMBER, isRequired: true},
        location: {
            type: TYPES.OBJECT,
            isRequired: true,
            properties: {
                address: {type: TYPES.STRING, isRequired: true},
                number: {type: TYPES.NUMBER, isRequired: false},
                zip: {type: TYPES.ZIP, isRequired: true},
                state: {type: TYPES.STATE, isRequired: true},
                city: {type: TYPES.STRING, isRequired: true},
                longitude: {type: TYPES.NUMBER, canBeNegative: true, isRequired: false},
                latitude: {type: TYPES.NUMBER, canBeNegative: true, isRequired: false},
            }
        },
        numBeds: {type: TYPES.NUMBER, isRequired: true},
        numBaths: {type: TYPES.NUMBER, isRequired: true},
        numWindows: {type: TYPES.NUMBER, isRequired: false},
        sqft: {type: TYPES.NUMBER, isRequired: true},
        photo: {type: TYPES.STRING, isRequired: true},
        description: {type: TYPES.STRING, isRequired: false},
        hasGarage: {type: TYPES.BOOLEAN, isRequired: false},
        hasTerrace: {type: TYPES.BOOLEAN, isRequired: false},
        listingVisitors: {type: TYPES.ARRAY, isRequired: false, elementsType:TYPES.BSON_OBJECT_ID},
        comments: {
            type: TYPES.OBJECT,
            isRequired: false,
            properties: {
                userId: {type: TYPES.BSON_OBJECT_ID, isRequired: true},
                username: {type: TYPES.STRING, isRequired: true},
                comment: {type: TYPES.STRING, isRequired: true}
            },
        }
        // TODO: Include deposit object and pastListingPrices array
    },
    signupUser: {
        role: {type: TYPES.ROLE, isRequired: true},
        email: {type: TYPES.EMAIL, isRequired: true},
        username: {type: TYPES.USERNAME, isRequired: true},
        password: {type: TYPES.PASSWORD, isRequired: true}
        // TODO: Add check for "file" field
    }
}
export const serverSchemas = {
    queryListingGet: {
        minPrice: {type: TYPES.STRING, isRequired: true},
        maxPrice: {type: TYPES.STRING, isRequired: true},
        minSqft: {type: TYPES.STRING, isRequired: true},
        maxSqft: {type: TYPES.STRING, isRequired: true},
        minNumBeds: {type: TYPES.STRING, isRequired: true},
        minNumBaths: {type: TYPES.STRING, isRequired: true},
        hasGarage: {type: TYPES.STRING, isRequired: false},
        hasTerrace: {type: TYPES.STRING, isRequired: false},
    },
    createListingPostForm: {
        listingPrice: {type: TYPES.STRING, isRequired: true},
        address: {type: TYPES.STRING, isRequired: true},
        zip: {type: TYPES.STRING, isRequired: true},
        city: {type: TYPES.STRING, isRequired: true},
        state: {type: TYPES.STRING, isRequired: true},
        numBeds: {type: TYPES.STRING, isRequired: true},
        numBaths: {type: TYPES.STRING, isRequired: true},
        sqft: {type: TYPES.STRING, isRequired: true},
        photo: {type: TYPES.STRING, isRequired: true},
        hasGarage: {type: TYPES.STRING, isRequired: false},
        hasTerrace: {type: TYPES.STRING, isRequired: false},
    },
    signupPostForm: {
        role: {type: TYPES.ROLE, isRequired: true},
        email: {type: TYPES.EMAIL, isRequired: true},
        username: {type: TYPES.USERNAME, isRequired: true},
        password: {type: TYPES.PASSWORD, isRequired: true},
        confirmPassword: {type: TYPES.PASSWORD, isRequired: true},
        file: {type: TYPES.STRING, isRequired: false},
        // TODO: Add check for "file" field
    },
    loginPostForm: {
        email: {type: TYPES.EMAIL, isRequired: true},
        password: {type: TYPES.PASSWORD, isRequired: true}
    },
}

