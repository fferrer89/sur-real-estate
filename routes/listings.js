import {Router} from "express";
import {listingData} from '../data/index.js'

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
     * @param file
     * @param cb
     */
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },

    /**
     * The name of the file within the destination:
     *
     * The filename function determines the name of the uploaded file. In this example, we use Date.now() to generate a
     * unique timestamp for each uploaded file, which helps prevent filename clashes.
     *
     * We append the original name of the file using file.originalname to maintain some context about the uploaded file.
     * You can modify this function to generate filenames based on your specific needs.
     * @param req
     * @param file
     * @param cb
     */
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
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

listingRouter.route('/new').get(async (req, res) => {
    res.render('listings/new');
});
listingRouter.route('/')
    /**
     * GET request to http://localhost:3000/listings/
     */
    .get(async (req, res) => {
        const listings = await listingData.getAllListings();
        // Retrieve all the listings
        res.render('listings/index', {listings: listings});
    })

    /**
     * POST request to http://localhost:3000/listings/
     */
    .post(imageUpload.single('file'), async (req, res) => {
        // upload.single() -> Returns a middleware function that expects to be called with the arguments (req, res, callback).
        const listingReqBody = req.body;
        let location = {
            streetAddress: listingReqBody.streetAddress,
            city: listingReqBody.city,
            state: listingReqBody.state,
            zip: listingReqBody.zip
        };

        const {
            listingPrice,
            numBeds,
            numBaths,
            sqft,
            hasGarage,
            hasTerrace,
        } = listingReqBody;

        // FIXME: Fix createListing()
        const newListing = await listingData.createListing(parseInt(listingPrice), location, parseInt(numBeds),
            parseInt(numBaths), parseInt(sqft), hasGarage === 'true',
            hasTerrace === 'true', req.file.filename);

        res.redirect(`/listings/${newListing}`);
    });


listingRouter.route('/:listingId')
    /**
     * GET request to http://localhost:3000/listings/655a937811d7a8e1b10c49c3
     */
    .get(async (req, res) => {
        let listingId = req.params.listingId
        const listing = await listingData.getListingById(listingId);
        // Retrieve all the listings
        res.render('listings/single', {listing: listing});
    });


export default listingRouter;
