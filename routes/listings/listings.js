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
import {listingData} from '../../data/index.js'
import validation from "../../helpers/input-validations.js";
import {dbSchemas, serverSchemas} from "../../helpers/object-schemas.js";

/**
 *  Module to set up the Multer middleware.
 *
 *  Multer is a middleware for handling multipart/form-data requests, specifically designed for file uploads in
 *  Node.js. By setting up Multer middleware in this way, you configure the storage destination and filename for
 *  uploaded files, allowing Multer to handle file uploads seamlessly in your application.
 */
import multer from "multer";
import listingMessageRouter from "./listings-messages.js";
import listingCommentRouter from "./listings-comments.js";

// TODO: Move imageStorage and imageUpload to router helper module to make them reusable across the app. Documentation
//  for sighUp must be store in a PRIVATE folder for uploads
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

listingRouter.route('/')
    /**
     * Route that receives posts requests from http://localhost:3000/listings, which receives the Form data filled
     * and sent by the user/browser to create new listings. The body of the post request contains the Form data.
     *
     * Method accessibility: Authentication & Authorization needed. Method protected to authenticated visitors with a role of "realtor"
     *
     * HTML Form Request: <form action="/listings" method="post" enctype="multipart/form-data">
     *
     * POST request to http://localhost:3000/listings
     */
    .post(imageUpload.single('photo'), async (req, res) => {
        // upload.single() -> Returns a middleware function that expects to be called with the arguments (req, res, callback).
        // 0: Retrieve client/browser request information
        let listingReqBody = req.body;
        listingReqBody = {
            listingPrice: listingReqBody.listingPrice,
            address: listingReqBody.address,
            zip: listingReqBody.zip,
            city: listingReqBody.city,
            state: listingReqBody.state,
            numBeds: listingReqBody.numBeds,
            numBaths: listingReqBody.numBaths,
            sqft: listingReqBody.sqft,
            photo: req.file.filename,
            hasGarage: listingReqBody.hasGarage ? 'true' : 'false',
            hasTerrace: listingReqBody.hasTerrace ? 'true' : 'false'
        }
        // 1: Validate request payload (Body - Form fields)
        try {
            listingReqBody = validation.object('New Property form', listingReqBody, serverSchemas.createListingPostForm);
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

        // Retrieve loggedIn user info
        const realtorId = req.session.user._id;
        let listingReqBodyParsed = {
            realtorId,
            listingPrice: parseInt(listingReqBody.listingPrice),
            location,
            numBeds: parseInt(listingReqBody.numBeds),
            numBaths: parseInt(listingReqBody.numBaths),
            sqft: parseInt(listingReqBody.sqft),
            photo: listingReqBody.photo,
            hasGarage: listingReqBody.hasGarage === 'true',
            hasTerrace: listingReqBody.hasTerrace === 'true'
        }
        try {
            listingReqBodyParsed = validation.object('New Property form', listingReqBodyParsed, dbSchemas.listing);
        } catch (e) {
            return res.status(400).json({errors: e.message});
        }


        // 3: Make database request
        let newListing;
        try {
            newListing = await listingData.createListing(realtorId, listingReqBodyParsed.listingPrice,
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
 * Route that handles HTTP requests (now only GET) to the http://localhost:3000/listings/new endpoint URL.
 *
 * Route accessibility: Authentication & Authorization needed. Route protected to authenticated visitors with a role of "realtor"
 */
listingRouter.route('/new')
    /**
     * Route that receives get requests from http://localhost:3000/listings/new, which renders to the user/browser a
     * web page containing a Form to be filled by the user create a new listing ("Create Property").
     *
     * Method accessibility: Authentication & Authorization needed. Method protected to authenticated visitors with a role of "realtor"
     *
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
 * Route that handles HTTP requests (now only GET) to the http://localhost:3000/listings/:listingId endpoint URL.
 *
 * Route accessibility: Open to all visitors
 */
listingRouter.route('/:listingId')
    .all((req, res, next) => {
        // Runs for all HTTP verbs first. Think of this as a route-specific middleware
        next();
    })
    /**
     * Route that receives get requests from http://localhost:3000/:listingId endpoint URL, which renders to the
     * user/browser a web page containing all the information (list price, square feet, picture, ...) of a listing with
     * id of (listingId).
     *
     * Method accessibility: Open to all visitors
     *
     * This router gets executed when there is an exact match with the path. Hence, the below examples will not make this
     * function to be executed:
     * - Invalid: http://localhost:3000/listings/655a937811d7a8e1b10c49c3/4533
     * - Invalid: http://localhost:3000/listings/655a937811d7a8e1b10c49c3/abc/424
     * - Invalid:http://localhost:3000/listings/new/655a937811d7a8e1b10c49c3
     *
     * - Valid: GET request to http://localhost:3000/listings/655a937811d7a8e1b10c49c3
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
            return res.render('listings/single',
                {listing: listing, scriptFiles: ['single-listing']});
        } catch (e) {
            return res.status(500).json({error: e.message});
        }
    });

/**
 * Only requests to /listings/:listingId/messages/* will be sent to the listingRouter "router". This will only be invoked if the path starts
 * with /listings/:listingId/messages from the mount point (http://localhost:3000/listings/:listingId/messages)
 *
 */
// listingRouter.route('/:listingId/messages', listingMessageRouter);
/**
 * Only requests to /listings/:listingId/comments/* will be sent to the listingRouter "router". This will only be invoked if the path starts
 * with /listings/:listingId/comments from the mount point (http://localhost:3000/listings/:listingId/comments)
 *
 * Route accessibility: Authentication needed. Route protected to authenticated visitors
 *
 */
listingRouter.route('/:listingId/comments')
    /**
     * Handles the data received from the form to post/create a new comment
     *
     * Route accessibility: Authentication needed. Route protected to authenticated visitors
     *
     * POST request to http://localhost:3000/listings/:listingId/comments
     */
    .post(async (req, res) => {
        // 0: Retrieve client/browser request information
        // 1: Validate request payload (URL Path Variables)
        // 2: Validate request payload individual variables (URL Path Variables)
        let listingId = req;
        console.log('req:  ' + req.params);
        try {
            validation.bsonObjectId(listingId);
        } catch (e) {
            return res.status(400).json({errors: e.message});
        }
        let request = req.body;
        return res.render('listings/single');
    });


export default listingRouter;
