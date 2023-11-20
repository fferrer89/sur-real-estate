/**
 * This file will import both route files and export the constructor method as shown in the lecture code.
 */
import userRouter from './users.js';
import listingRouter from './listings.js';
import messageRouter from './messages.js';
import imageRouter from './images.js';

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

    /**
     * Only requests to /users/* will be sent to the userRouter "router". This will only be invoked if the path starts
     * with /users from the mount point (http://localhost:3000/users)
     */
    app.use('/users', userRouter); // '/events' -> The resource URL

    /**
     * Only requests to /listings/* will be sent to the listingRouter "router". This will only be invoked if the path starts
     * with /listings from the mount point (http://localhost:3000/listings)
     */
    app.use('/listings', listingRouter); // '/attendees' -> The resource URL

    /**
     * Only requests to /messages/* will be sent to the messageRouter "router". This will only be invoked if the path starts
     * with /messages from the mount point (http://localhost:3000/messages)
     */
    app.use('/messages', messageRouter); // '/attendees' -> The resource URL

    /**
     * Only requests to /images/* will be sent to the messageRouter "router". This will only be invoked if the path starts
     * with /images from the mount point (http://localhost:3000/images)
     */
    app.use('/images', imageRouter); // '/attendees' -> The resource URL


    app.use('/', (req, res) => {
        res.redirect('/listings');
    })
    
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

