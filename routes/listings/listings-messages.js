import {Router} from "express";

/**
 * router.METHOD(path, [callback, ...] callback);
 * You can provide multiple callback functions that behave like middleware to handle a request. The only exception is
 * that these callbacks might invoke next('route') to bypass the remaining route callbacks. You can use this mechanism
 * to impose pre-conditions on a route, then pass control to subsequent routes if there’s no reason to proceed with the
 * current route.
 *
 * To sum up what next('route') actually means is that if you call it, it simply skips the rest of the handlers in the
 * currently executing route, rather than actually jumping to the next thing in Express that is a route. You can think
 * of it as actually exit_route().
 *
 * If the current middleware function does not end the request-response cycle, it must call next() to pass control to
 * the next middleware function. Otherwise, the request will be left hanging.
 *
 * e.g.:
 * app.get('/forum/:fid', middleware1, middleware2, function(){
 *   // ...
 * });
 * The function middleware1() has a chance to call next() to pass control to middleware2, or next('route') to pass
 * control to the next matching route altogether.
 *
 * e.g:
 * app.get('/user/:id', (req, res, next) => {
 *     // if the user ID is 0, skip to the next route
 *     if (req.params.id === '0') {
 *         next('route'); // skips to: res.send('special');
 *     } else {
 *         // otherwise pass the control to the next middleware function in this stack
 *         next(); // goes to: res.send('regular')
 *     }
 *     }, (req, res, next) => {
 *     // send a regular response
 *     res.send('regular')
 * })
 *
 * // handler for the /user/:id path, which sends a special response
 * app.get('/user/:id', (req, res, next) => {
 *     res.send('special');
 * })
 *
 */

const listingMessageRouter = Router();
// '/listings/:listingId/messages'

/**
 * Maps the given param placeholder name(s) to the given callback(s).
 * Parameter mapping is used to provide pre-conditions to routes which use normalized placeholders. For example,
 * a :listingId parameter could automatically load a listing's information from the database without any additional code.
 * The callback uses the same signature as middleware, the only difference being that the value of the placeholder is
 * passed, in this case the id of the listing. Once the next() function is invoked, just like middleware, it will
 * continue on to execute the route, or subsequent parameter functions.
 *
 * app.param(name, fn) should defer all the param routes implies that if next("route") is called from a param handler,
 * it would skip all following routes that refer to that param handler's own parameter name. In that test case, it skips
 * all routes referring to the id parameter.
 * app.param(name, fn) should call when values differ when using "next" suggests that the previous rule has yet another
 * exception: don't skip if the value of the parameter changes between routes.
 *
 *
 * A param callback will be called only once in a request-response cycle, even if the parameter is matched in multiple
 * routes, as shown in the following examples. The first argument of param() is the name of the parameter.
 * req - The request object
 * res - The response object
 * next - the next middleware function
 * id - The value of the listingId parameter
 */
listingMessageRouter.param('listingId', async (req, res, next, id) =>  {
    // Fetch the listing with the id from the database and add it to the request object.
    let listingFetched = {id}; // make db request to get the listing with id (id)
    req.listing = listingFetched;
    // Then move to the next route
    next();
})

/**
 * Route accessibility: Authentication needed. Route protected to authenticated visitors. Users can only see the
 * messages they have sent, not all the messages
 */
listingMessageRouter.route('/')
    /**
     * Retrieves all the messages posted by the authenticated user on the listing with id (listingId)
     *
     * Route accessibility: Authentication needed. Route protected to authenticated visitors. Users can only see the
     * messages they have sent
     *
     * GET request to http://localhost:3000/listings/:listingId/messages
     */
    .get(async (req, res) => {
        // FIXME: Route not needed for now.
    })
    /**
     * Handles the data received from the form to post/create a new message
     *
     * Route accessibility: Authentication needed. Route protected to authenticated visitors.
     *
     * POST request to http://localhost:3000/listings/:listingId/messages
    */
    .post(async (req, res) => {

    });

/**
 * Route accessibility: Authentication needed. Route protected to authenticated visitors.
 */
listingMessageRouter.route('/new')
    /**
     * Retrieves a form to add a new message
     *
     * Route accessibility: Authentication needed. Route protected to authenticated visitors.
     *
     * GET request to http://localhost:3000/listings/:listingId/messages/new
     */
    .get(async (req, res) => {
        // FIXME: Route not needed for now.
    })

export default listingMessageRouter;