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
import {listingData, messageData, listingVisitorData} from '../data/index.js'
import validation from "../helpers/input-validations.js";
import {dbSchemas, serverSchemas} from "../helpers/object-schemas.js";
import {ROLES} from '../helpers/constants.js';
import {OnsiteVisitError} from "../data/custom-error-classes.js";
/**
 *  Module to set up the Multer middleware.
 *
 *  Multer is a middleware for handling multipart/form-data requests, specifically designed for file uploads in
 *  Node.js. By setting up Multer middleware in this way, you configure the storage destination and filename for
 *  uploaded files, allowing Multer to handle file uploads seamlessly in your application.
 */
import multer from "multer";

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

/*
// Example of router using middleware functions. This approach re-uses the single /users/:user_id path and adds handlers for various HTTP methods.
const router = express.Router()

router.param('user_id', function (req, res, next, id) {
  // sample user, would actually fetch from DB, etc...
  req.user = {id: id, name: 'TJ'};
  next();
})

router.route('/users/:user_id')
  .all(function (req, res, next) {
    // middleware that runs for all HTTP verbs first. Think of it as route specific middleware!
    next();
  })
  .get(function (req, res, next) {
    // middleware that runs for get() requests to the '/users/:userId' path
    next();
  })
  .get(async (req, res) => {
    res.json(req.user);
  })
  .put(async (req, res) => {
    // just an example of maybe updating the user
    req.user.name = req.params.name;
    // save user ... etc
    res.json(req.user);
  })
  .post(function (req, res, next) {
   // middleware
    next(new Error('not implemented'));
  })
  .delete(function (req, res, next) {
  // middleware
    next(new Error('not implemented'));
  })
 */
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

// Route-level middleware mounted to the '/listings/new' mount path. The newListingMiddleware is called, then it passes
// execution to the callback (async (req, res) => {...}) if everything is correct using "next()" or it finished execution
// if not.
// import listingMiddleware from "middleware/listings.js";
// listingRouter.route('/new').get(listingMiddleware.newListing, async (req, res) => {...});
// listingRouter.get('/new', listingMiddleware.newListing); // Middleware called before
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
 * Only requests to /listings/:listingId/messages/* will be sent to the listingRouter "router". This will only be invoked if the path starts
 * with /listings/:listingId/messages from the mount point (http://localhost:3000/listings/:listingId/messages)
 *
 */

/**
 * Only requests to /listings/:listingId/comments/* will be sent to the listingRouter "router". This will only be invoked if the path starts
 * with /listings/:listingId/comments from the mount point (http://localhost:3000/listings/:listingId/comments)
 *
 * Route accessibility: Authentication needed. Route protected to authenticated visitors
 *
 */

listingRouter.param('listingId', async (req, res, next, id) => {
    // try to get the user details from the User model and attach it to the request object
    // TODO: Add error handling to getListing(id) call. Not sure how to add error handling to a middleware function!
    // try {
    //     id = validation.bsonObjectId(id, 'listingId');
    //     // Validate that the a listing with id 'listingId' exists in the database, and throw and error if if does not
    // } catch (e) {
    //     return res.status(400).json({error: e.message});
    // }
    req.listing = await listingData.getListing(id);
    // Retrieve the listing visit
    if (req.listing.visits &&  req.session.user) {
        req.listingVisit = req.listing.visits.find((visit) => {
            return (visit.listingId === id && visit.visitorId === req.session.user._id);
        })
        req.listingVisit = {
            startTimestamp: req.listingVisit.startTimestamp.toLocaleString('en-US',
                {dateStyle: "medium",timeStyle: "short"}),
            endTimestamp: req.listingVisit.endTimestamp.toLocaleString('en-US',
                {dateStyle: "medium",timeStyle: "short"})
        }
    }
    // todo: Check how/if this is called when making request to: /:listingId/messages/:messageId
    next();
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

        // 3: Make database request (listingData)
        let listing;
        try {
            listing = await listingData.getListing(listingId);
        } catch (e) {
            return res.status(500).json({error: e.message});
        }
        // Make database request (messages).
        let messages;
        let depositMessage;
        if (listing.deposit) {
            depositMessage = "Listing Sold";
        }
        // If visitor is authenticated, retrieve messages
        if (req.session.user) {
            if (req.session.user.role === ROLES.GENERAL) {
                if (listing.deposit && listing.deposit.depositorId === req.session.user._id) {
                    depositMessage = `You have deposited $${listing.deposit.depositAmount} towards the purchase of this house`;
                }
                // If user is 'general' role, query messages by senderId
                try {
                    messages = await messageData.getSentMessagesOfListing(req.session.user._id, listingId);
                } catch (e) {
                    return res.status(500).json({error: e.message});
                }
            } else if (req.session.user.role === ROLES.RELATOR) {
                if (listing.deposit && listing.deposit.depositorId) {
                    depositMessage = `${req.session.user.username} has deposited $${listing.deposit.depositAmount} towards the purchase of this house`;
                }
                // If user is 'realtor' role, query messages by listingId
                try {
                    messages = await messageData.getListingMessages(listingId);
                } catch (e) {
                    return res.status(500).json({error: e.message});
                }
            }
        }

        // 4: Respond to the client/browser request
        try {
            return res.render('listings/single',
                {listing, messages, listingVisit: req.listingVisit, depositMessage, scriptFiles: ['single-listing']});
        } catch (e) {
            return res.status(500).json({error: e.message});
        }
    });
listingRouter.route('/:listingId/comments')
    /**
     * Handles the data received from the form to post/create a new comment
     *
     * Route accessibility: Authentication needed. Route protected to authenticated visitors
     *
     * TODO: Change this method to PUT or PATCH by adding a middleware  (as we are updating a listing object, by adding a comment to it)
     *
     * POST request to http://localhost:3000/listings/:listingId/comments
     */
    .post(async (req, res) => {
        // 0: Retrieve client/browser request information
        // 1: Validate request payload (URL Path Variables and Request Body)
        // 2: Validate request payload individual variables (URL Path Variables and Request Body)
        let listingId = req.params.listingId;
        try {
            listingId = validation.bsonObjectId(listingId, 'listingId');
            req.body.comment = validation.string('comment', req.body.comment)
        } catch (e) {
            return res.status(400).json({errors: e.message});
        }
        const comment = {
            userId:req.session.user._id,
            username:req.session.user.username,
            comment:req.body.comment
        };
        // 3: Make database request
        try {
            await listingData.addListingComment(listingId, comment);
        } catch (e) {
            return res.status(500).json({error: e.message});
        }
        // 4: Respond to the client/browser request
        return res.redirect(303, 'back'); // Redirect back to the previous page. This refreshes the page
    });
// GET /listings/:listingId/comments/new

/**
 * Only requests to /listings/:listingId/messages/* will be sent to the listingRouter "router". This will only be invoked if the path starts
 * with /listings/:listingId/messages from the mount point (http://localhost:3000/listings/:listingId/messages)
 *
 * Route accessibility: Authentication needed. Route protected to authenticated visitors. Users can only see the
 * messages they have sent, not all the messages
 *
 */
listingRouter.route('/:listingId/messages')
    /**
     * Handles the data received from the form to post/create a new message
     *
     * Route accessibility: Authentication needed. Route protected to authenticated visitors
     *
     * POST request to http://localhost:3000/listings/:listingId/messages
     */
    .post(async (req, res) => {
        // 0: Retrieve client/browser request information
        // 1: Validate request payload (URL Path Variables and Request Body)
        // 2: Validate request payload individual variables (URL Path Variables and Request Body)
        let listingId = req.params.listingId;
        try {
            req.session.user._id = validation.bsonObjectId(req.session.user._id, 'senderId');
            req.params.listingId = validation.bsonObjectId(listingId, 'listingId');
            req.body.message = validation.string('message', req.body.message);
        } catch (e) {
            return res.status(400).json({errors: e.message});
        }
        // 3: Make database request
        try {
            await messageData.newMessage(req.session.user._id, req.listing.realtorId, req.body.message, listingId);
        } catch (e) {
            return res.status(500).json({error: e.message});
        }
        // 4: Respond to the client/browser request
        return res.redirect(303, 'back'); // Redirect back to the previous page. This refreshes the page
    });

listingRouter.route('/:listingId/deposits')
    /**
     * Handles the data received from the form to post a new deposit
     *
     * Route accessibility: Authentication needed. Route protected to authenticated visitors. Once a listing has a deposit,
     * prevent all users from making more deposits.
     *
     * TODO: Change this method to PUT or PATCH by adding a middleware  (as we are updating a listing object, by adding a deposit to it)
     *
     * POST request to http://localhost:3000/listings/:listingId/deposits
     */
    .post(async (req, res) => {
        // 0: Retrieve client/browser request information
        // 1: Validate request payload (URL Path Variables and Request Body)
        // 2: Validate request payload individual variables (URL Path Variables and Request Body)
        let listingId = req.params.listingId;
        try {
            req.params.listingId = validation.bsonObjectId(listingId, 'listingId');
            req.body.depositAmount = validation.string('depositAmount', req.body.depositAmount);
            req.body.depositAmount = validation.number('depositAmount', parseInt(req.body.depositAmount));
        } catch (e) {
            return res.status(400).json({errors: e.message});
        }
        // 3: Make database request
        try {
            await listingData.addListingDeposit(req.params.listingId, req.session.user._id, req.body.depositAmount);
        } catch (e) {
            return res.status(500).json({error: e.message});
        }
        // 4: Respond to the client/browser request
        return res.redirect(303, 'back'); // Redirect back to the previous page. This refreshes the page
    });

listingRouter.route('/:listingId/visits')
    /**
     * Handles the data received from the form to post a new deposit
     *
     * Route accessibility: Authentication needed. Route protected to authenticated visitors.
     * TODO: Once a listing has an, onsite visit, prevent other users to scheduling onsite visits in the same time frame
     *
     * TODO: Visits are 30 minutes long
     * TODO: If the listing has a deposit, dont allow booking onsite visits.
     *
     * TODO: Change this method to PUT or PATCH by adding a middleware  (as we are updating a listing object, by adding a deposit to it)
     *
     * POST request to http://localhost:3000/listings/:listingId/visits
     */
    .post(async (req, res) => {
        // 0: Retrieve client/browser request information
        // 1: Validate request payload (URL Path Variables and Request Body)
        // 2: Validate request payload individual variables (URL Path Variables and Request Body)
        let listingId = req.params.listingId;
        try {
            req.params.listingId = validation.bsonObjectId(listingId, 'listingId');
            /*
             Convert visitTime, the selected user's local datetime, to dateTime timestamp. Throws an error if date is
             in the past.
             "2023-01-02T07:08 -> Jan 2nd at 07:08 AM
             "2023-12-06T23:34 -> Dec 6th at 11:34 PM
             */
            validation.dateTimeString('visitTime', req.body.visitTime);
        } catch (e) {
            return res.status(400).json({errors: e.message});
        }
        // Validate that the listing does not have a deposit (here and in database). If the listing has a deposit, dont allow booking onsite visits.
        // Validate that there is not another listing in the time frame of 30 minutes from visitTime. Prevent conflicting visits!
        // 3: Make database request
        try {
            await listingVisitorData.addListingVisitor(req.params.listingId, req.session.user._id, req.body.visitTime);
        } catch (e) {
            if (e instanceof OnsiteVisitError) {
                return res.status(400).json({error: e.message});
            } else {
                return res.status(500).json({error: e.message});
            }
        }
        // 4: Respond to the client/browser request
        return res.redirect(303, 'back'); // Redirect back to the previous page. This refreshes the page
    });
listingRouter.route('/:listingId/messages/:messageId')
    /**
     * Handles the data received from the form to reply to an existing message a new message
     *
     * Route accessibility: Authentication needed. Route protected to authenticated visitors
     *
     * TODO: Change this method to PUT or PATCH by adding a middleware (as we are updating a message object)
     *
     * PATCH request to http://localhost:3000/listings/:listingId/messages/:messageId
     */
    .post(async (req, res) => {
        // 0: Retrieve client/browser request information
        // 1: Validate request payload (URL Path Variables and Request Body)
        // 2: Validate request payload individual variables (URL Path Variables and Request Body)
        let messageId = req.params.messageId;
        try {
            messageId = validation.bsonObjectId(messageId, 'messageId');
            req.session.user._id = validation.bsonObjectId(req.session.user._id, 'senderId');
            req.body.messageReply = validation.string('message', req.body.messageReply)
            validation.bsonObjectId(req.params.listingId, 'listingId');
        } catch (e) {
            return res.status(400).json({errors: e.message});
        }
        // 3: Make database request
        try {
            await messageData.respondMessage(messageId, req.session.user._id, req.body.messageReply);
        } catch (e) {
            return res.status(500).json({error: e.message});
        }
        // 4: Respond to the client/browser request
        return res.redirect(303, 'back'); // Redirect back to the previous page. This refreshes the page
    });
export default listingRouter;
