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
import {serverSchemas} from "../helpers/object-schemas.js";

/**
 *  Module to set up the Multer middleware.
 *
 *  Multer is a middleware for handling multipart/form-data requests, specifically designed for file uploads in
 *  Node.js. By setting up Multer middleware in this way, you configure the storage destination and filename for
 *  uploaded files, allowing Multer to handle file uploads seamlessly in your application.
 */


const homeRouter = Router(); // Creates a listingRouter object

/**
 * Route that handles HTTP requests (now only GET) to the http://localhost:3000/ endpoint URL.
 *
 * Route accessibility: Open to all visitors
 *
 */
homeRouter.route('/')
    /**
     * Route that receives get requests from http://localhost:3000/listings endpoint URL, which renders to the
     * user/browser the Home Page with all the listings. This routes also handle request (Form requests) with Query
     * Parameters to search properties with specific characteristics.
     *
     * Query strings are NOT considered when performing the route matches, so this route will match "GET /listings" as
     * well as "GET /listings?minPrice=5555&maxPrice=100000"
     *
     * Method accessibility: Open to all visitors
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

export default homeRouter;
