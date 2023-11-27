/**
 * General Steps to handle client/browser request to a particular route:
 *  0: Retrieve client/browser request information
 *  1: Validate request payload (URL Query Parameters, URL Path Variables, or Request Body)
 *  2: Validate request payload individual variables (URL Query Parameters, URL Path Variables,
 *  Request Body Properties, ...)
 *  3: Make database request
 *  4: Respond to the client/browser request
 */

import {Router} from "express";
import {listingData} from '../data/index.js'
import validation from "../helpers/input-validations.js";
import {dbSchemas, serverSchemas} from "../helpers/object-schemas.js";

/**
 *  Module to set up the Multer middleware.
 *
 *  Multer is a middleware for handling multipart/form-data requests, specifically designed for file uploads in
 *  Node.js. By setting up Multer middleware in this way, you configure the storage destination and filename for
 *  uploaded files, allowing Multer to handle file uploads seamlessly in your application.
 */
import multer from "multer";

/**
 * Set up storage for uploaded files:
 *
 * Define the storage configuration for uploaded files using multer.diskStorage(). This configuration determines where
 * the uploaded files will be stored on the server. It takes an object with two functions: destination and filename.
 */
const imageStorage = multer.diskStorage({
    /**
     * The folder to which the file has been saved:
     *
     * The destination function specifies the directory where the uploaded files will be saved. In this example, we set
     * it to 'uploads/', which means the files will be stored in a folder named "uploads" in the root directory of your
     * project. You can customize the destination path based on your requirements.
     *
     * You are responsible for creating the directory when providing destination as a function.
     * @param req
     * @param photo
     * @param cb
     */
    destination: (req, photo, cb) => {
        cb(null, 'public/uploads');
    },

    /**
     * The name of the file within the destination:
     *
     * The filename function determines the name of the uploaded file. In this example, we use Date.now() to generate a
     * unique timestamp for each uploaded file, which helps prevent filename clashes.
     *
     * We append the original name of the file using photo.originalname to maintain some context about the uploaded file.
     * You can modify this function to generate filenames based on your specific needs.
     * @param req
     * @param photo
     * @param cb
     */
    filename: (req, photo, cb) => {
        cb(null, Date.now() + '-' + photo.originalname);
    }
});

/**
 * Create the multer instance:
 *
 * After setting up the storage configuration, you create an instance of Multer by calling multer({storage}), passing
 * in the storage configuration object. This creates the Multer middleware that you can use in your Express application
 * to handle file uploads.
 *
 */
const imageUpload = multer({
    storage: imageStorage,
    limits: {
        fileSize: 20000000 // 20 MB (1000000 Bytes = 1 MB)
    }
});

const listingRouter = Router(); // Creates a listingRouter object

/**
 * Route that handles HTTP requests (now only GET) to the http://localhost:3000/listings endpoint URL.
 */
listingRouter.route('/')
    /**
     * Route that receives get requests from http://localhost:3000/listings endpoint URL, which renders to the
     * user/browser the Home Page with all the listings. This routes also handle request (Form requests) with Query
     * Parameters to search properties with specific characteristics
     *
     * HTML Form Request: "<form action="/listings" method="get" id="get-listing-form">
     *
     * GET request to http://localhost:3000/listings
     * GET requests to http://localhost:3000/listings?minPrice=5555&maxPrice=100000&minSqft=22&maxSqft=5534&minNumBeds=2&minNumBaths=0&hasGarage=true
     */
    .get(async (req, res) => {
        // 0: Retrieve client/browser request information
        let queryParams = req.query;
        let listings; // An array of all the listing returned or the listings that satisfy the query parameters
        if (Object.keys(queryParams).length === 0) {
            try {
                listings = await listingData.getAllListings();
            } catch (e) {
                return res.status(500).json({error: e.message});
            }
        } else {
            // 1: Validate request payload (URL query params)
            try {
                queryParams = validation.object('the URL query params', queryParams, serverSchemas.queryListingGet);
            } catch (e) {
                return res.status(400).json({errors: e.message});
            }

            // Retrieve each query parameters value
            let listingPriceParams, listingSqftParams;

            // 2: Validate request payload individual variables (URL query params)
            try {
                listingPriceParams = validation.listingPriceRange(parseInt(queryParams.minPrice),
                    parseInt(queryParams.maxPrice));
                listingSqftParams = validation.listingSqftRange(parseInt(queryParams.minSqft),
                    parseInt(queryParams.maxSqft));
                queryParams.minNumBeds = validation.number('minNumBeds', parseInt(queryParams.minNumBeds), false);
                queryParams.minNumBaths = validation.number('minNumBaths', parseInt(queryParams.minNumBaths), false);
                // Garage and Terrace are optional parameters
                if (queryParams.hasGarage) {
                    queryParams.hasGarage = validation.booleanString('hasGarage', queryParams.hasGarage);
                }
                if (queryParams.hasTerrace) {
                    queryParams.hasTerrace = validation.booleanString('hasTerrace', queryParams.hasTerrace);
                }
            } catch (e) {
                return res.status(400).json({error: e.message});
            }

            // 3: Make database request
            try {
                listings = await listingData.getListings(listingPriceParams.minPrice,
                    listingPriceParams.maxPrice, listingSqftParams.minSqft, listingSqftParams.maxSqft,
                    queryParams.minNumBeds, queryParams.minNumBaths,
                    queryParams.hasGarage, queryParams.hasTerrace);
            } catch (e) {
                return res.status(500).json({error: e.message});
            }
        }
        // 4: Respond to the client/browser request
        try {
            // Render the web page with the listings retrieved
            return res.render('listings/index', {
                listings: listings,
                scriptFiles: ['get-listings-form']
            });
        } catch (e) {
            return res.status(500).json({error: e.message});
        }
    });


/**
 * Route that handles HTTP requests (now only GET and POST) to the http://localhost:3000/listings/new endpoint URL.
 */
listingRouter.route('/new')
    /**
     * Route that receives get requests from http://localhost:3000/listings/new, which renders to the user/browser a
     * web page containing a Form to be filled by the user create a new listing ("Create Property").
     * GET request to http://localhost:3000/listings/new
     */
    .get(async (req, res) => {
        try {
            return res.render('listings/new');
        } catch (e) {
            return res.status(500).json({error: e.message});
        }
    })

    /**
     * Route that receives posts requests from http://localhost:3000/listings/new, which receives the Form data filled
     * and sent by the user/browser to create new listings. The body of the post request contains the Form data.
     *
     * HTML Form Request: <form action="/listings/new" method="post" enctype="multipart/form-data">
     *
     * POST request to http://localhost:3000/listings/new
     */
    .post(imageUpload.single('photo'), async (req, res) => {
        // upload.single() -> Returns a middleware function that expects to be called with the arguments (req, res, callback).
        // 0: Retrieve client/browser request information
        let listingReqBody = req.body;
        listingReqBody = {
            listingPrice: listingReqBody.listingPrice,
            address: listingReqBody.address,
            zip:listingReqBody.zip,
            city:listingReqBody.city,
            state:listingReqBody.state,
            numBeds:listingReqBody.numBeds,
            numBaths:listingReqBody.numBaths,
            sqft: listingReqBody.sqft,
            photo: req.file.filename,
            hasGarage: listingReqBody.hasGarage ? 'true' : 'false',
            hasTerrace: listingReqBody.hasTerrace ? 'true' : 'false'
        }
        // 1: Validate request payload (Body - Form fields)
        try {
            listingReqBody = validation.object('Request body', listingReqBody, serverSchemas.createListingPost);
        } catch (e) {
            return res.status(400).json({errors: e.message});
        }

        // 2: Validate request payload individual variables (Body variables or Request Body Properties)
        let location = {
            address: listingReqBody.address,
            zip: listingReqBody.zip,
            city: listingReqBody.city,
            state: listingReqBody.state
        };
        location = validation.address('Full Address', location);
        let listingReqBodyParsed = {
            listingPrice: parseInt(listingReqBody.listingPrice),
            location: location,
            numBeds: parseInt(listingReqBody.numBeds),
            numBaths: parseInt(listingReqBody.numBaths),
            sqft: parseInt(listingReqBody.sqft),
            photo: listingReqBody.photo,
            hasGarage: listingReqBody.hasGarage === 'true',
            hasTerrace: listingReqBody.hasTerrace === 'true'
        }
        try {
            listingReqBodyParsed = validation.object('Request body', listingReqBodyParsed, dbSchemas.listing);
        } catch (e) {
            return res.status(400).json({errors: e.message});
        }

        // 3: Make database request
        let newListing;
        try {
            newListing = await listingData.createListing(listingReqBodyParsed.listingPrice,
                listingReqBodyParsed.location, listingReqBodyParsed.numBeds, listingReqBodyParsed.numBaths,
                listingReqBodyParsed.sqft, listingReqBodyParsed.photo, listingReqBodyParsed.hasGarage,
                listingReqBodyParsed.hasTerrace);
        } catch (e) {
            return res.status(500).json({errors: e.message});
        }

        // 4: Respond to the client/browser request
        try {
            return res.redirect(`/listings/${newListing}`);
        } catch (e) {
            return res.status(500).json({errors: e.message});
        }
    });


/**
 * Route that handles HTTP requests (now only GET) to the http://localhost:3000/listings/:listingId endpoint URL.
 */
listingRouter.route('/:listingId')
    /**
     * Route that receives get requests from http://localhost:3000/:listingId endpoint URL, which renders to the
     * user/browser a web page containing all the information (list price, square feet, picture, ...) of a listing with
     * id of (listingId).
     * GET request to http://localhost:3000/listings/655a937811d7a8e1b10c49c3
     */
    .get(async (req, res) => {
        // 0: Retrieve client/browser request information
        let listingId = req.params.listingId;

        // 1: Validate request URL Path Variable/s
        try {
            listingId = validation.bsonObjectId(listingId, 'listingId');
        } catch (e) {
            return res.status(400).json({error: e.message});
        }

        // 3: Make database request
        let listing;
        try {
            listing = await listingData.getListing(listingId);
        } catch (e) {
            return res.status(500).json({error: e.message});
        }
        // 4: Respond to the client/browser request
        try {
            return  res.render('listings/single', {listing: listing});
        } catch (e) {
            return res.status(500).json({error: e.message});
        }
    });
listingRouter.route('/:listingId/messages/new')
    .get(async (req, res) => {
        // Retrieves all the messages of the specific listing
    })
    .post(async (req, res) => {
        // Posts/creates a message of the specific listing
    });

export default listingRouter;
