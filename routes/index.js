/**
 * This file will import both route files and export the constructor method as shown in the lecture code.
 */
import userRouter from './users/users.js';
import listingRouter from './listings.js';
import signupRouter from './users/signup.js';
import loginRouter from './users/login.js';
import logoutRouter from './users/logout.js';
import homeRouter from "./home.js";

/**
 * Constructor that adds the userRouter, listingRouter, and messageRouter Routers, which contain our route-handling code,
 * to the request handling chain (middleware chain)
 *
 * @param app the express application that we want to configure and add all the routes (URL paths)
 * @constructor that adds the userRouter, listingRouter, and messageRouter Routers to the request handling chain
 */
const routesConstructor = (app) => {
    // Request handling chain functions are called in the order they are declared they determine how the application
    // responds to a client request to a particular endpoint.
    // Middleware functions are executed sequentially, so the order of them is crucial.

    /**
     * Only requests to /signup/* will be sent to the signupRouter "router". This will only be invoked if the path starts
     * with /signup from the mount point (http://localhost:3000/signup)
     */
    app.use('/signup', signupRouter);

    /**
     * Only requests to /login/* will be sent to the loginRouter "router". This will only be invoked if the path starts
     * with /login from the mount point (http://localhost:3000/login)
     */
    app.use('/login', loginRouter);

    /**
     * Only requests to /logout/* will be sent to the loginRouter "router". This will only be invoked if the path starts
     * with /logout from the mount point (http://localhost:3000/logout)
     */
    app.use('/logout', logoutRouter);

    /**
     * Only requests to /users/* will be sent to the userRouter "router". This will only be invoked if the path starts
     * with /users from the mount point (http://localhost:3000/users)
     * This will match requests to any path that follows the '/users' path immediately after '/'. For example, these
     * '/users', '/users/images', 'users/images/news/879797897', ...
     */
    app.use('/users', userRouter);

    /**
     * Only requests to /listings/* will be sent to the listingRouter "router". This will only be invoked if the path starts
     * with /listings from the mount point (http://localhost:3000/listings)
     */
    app.use('/listings', listingRouter);

    /**
     * The Home page of this application
     */
    app.use('/', homeRouter);

    
    /**
     * "Catch-all" requests: Request sent to http://localhost:3000/ that are not directed (caught) to /users or /users
     * will be handled by the below callback.
     */
    app.use('*', (req, res) => { // http://localhost:3000/*
        // Issue a response with 404 status code and send the 'No found' response message in JSON format
        res.status(404).json({error: 'Not found'});
    });
};

export default routesConstructor;
