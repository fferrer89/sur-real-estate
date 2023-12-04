import {Router} from "express";

const listingCommentRouter = Router();
// /listings/:listingId/comments


/**
 * Maps the given param placeholder name(s) to the given callback(s).
 * Parameter mapping is used to provide pre-conditions to routes which use normalized placeholders. For example,
 * a :listingId parameter could automatically load a listing's information from the database without any additional code.
 * The callback uses the same signature as middleware, the only difference being that the value of the placeholder is
 * passed, in this case the id of the listing. Once the next() function is invoked, just like middleware, it will
 * continue on to execute the route, or subsequent parameter functions.
 *
 * Route accessibility: Authentication needed. Route protected to authenticated visitors
 *
 * A param callback will be called only once in a request-response cycle, even if the parameter is matched in multiple
 * routes, as shown in the following examples. The first argument of param() is the name of the parameter.
 * req - The request object
 * res - The response object
 * next - the next middleware function
 * id - The value of the listingId parameter
 */
listingCommentRouter.param('listingId', async (req, res, next, id) =>  {
    // Fetch the listing with the id from the database and add it to the request object.
    let listingFetched = {id}; // make db request to get the listing with id (id)
    req.listing = listingFetched;
    // Then move to the next route
    next();
})

/**
 * Route accessibility: Authentication needed. Route protected to authenticated visitors
 */
listingCommentRouter.route('/')
    /**
     * Retrieves all the comments posted by all users on the listing with id (listingId)
     *
     * Route accessibility: Authentication needed. Route protected to authenticated visitors
     *
     * GET request to http://localhost:3000/listings/:listingId/comments
     */
    .get(async (req, res) => {
        // FIXME: Route not needed for now.
    })
    /**
    * Handles the data received from the form to post/create a new comment
    *
    * Route accessibility: Authentication needed. Route protected to authenticated visitors
     *
     * POST request to http://localhost:3000/listings/:listingId/comments
    */
    .post(async (req, res) => {

    });

/**
 * Route accessibility: Authentication needed. Route protected to authenticated visitors
 */
listingCommentRouter.route('/new')
    /**
     * Retrieves a form to add a new comment
     *
     * Route accessibility: Authentication needed. Route protected to authenticated visitors
     *
     * GET request to http://localhost:3000/listings/:listingId/comments/new
     */
    .get(async (req, res) => {
        // FIXME: Route not needed for now.
    })

export default listingCommentRouter;