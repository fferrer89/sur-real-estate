import express from 'express';
const app = express();
import configRoutes from './routes/index.js';
import {fileURLToPath} from 'node:url'; // The node:url module provides utilities for URL resolution and parsing.
import {dirname} from 'node:path'; // The node:path module provides utilities for working with file and directory paths
import handlebars from 'express-handlebars';
import session from "express-session";
import {ROLES} from "./helpers/constants.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = express.static(__dirname + '/public');

app.use('/public', publicDir);

app.use(express.json());

app.use(express.urlencoded({
      extended: true}
));

/**
 * Create a middleware function
 * If the user posts to the server with a property called _method, rewrite the request's method. To be that method; so
 * if they post _method=PUT you can now allow browsers to POST to a route that gets rewritten in this middleware to a
 * PUT route.
 *
 * This middleware function is applied to the ENTIRE APPLICATION (all routes).
 *
 * HTML <form> only knows GET and POST, but we can change it with a middleware function such as this one.
 *
 * <form action="/posts" method="POST"">
 *  <input type="hidden" name='_method' value="PUT" />
 */
const changeMethodHtmlForm = (req, res, next) => {
    // Check if the request has body and if the request body has a property named '_method'
    if (req.body && req.body._method) { //  name='_method' AND value="PUT" -> {_method: 'PUT'}
        // The request has body and has a property named '_method', so change the request method to the value of
        // req.body._method. Then delete the '_method' property and value from the request body (req.body._method)
        req.method = req.body._method; // modify the request method
        delete req.body._method;
    }
    next(); // Calls the next middleware function, which is app.use('/public', publicDir) if the request URL is '/public'
    // or app.use(express.json()) if the request URL is not '/public'.
};
/**
 * Mount/Register the middleware function rewriteUnsupportedBrowserMethods()
 *
 * This middleware is mounted without a path, so it will be executed for every request to the app
 */
app.use(changeMethodHtmlForm);

const NUM_OF_HOURS_SESSION_EXPIRES = 5;
const ONE_HOUR = 3600000; // In milliseconds

/**
 * app.use(session({ ...}))) -> Registers the session({ ...}) middleware function to this application. The session
 * middleware handles all things for us, i.e., creating the session, setting the session cookie and creating the session
 * object in req object.
 *
 * When a client sends a request, the server will set a session ID and set the cookie equal to that session ID. The cookie is then stored in the set cookie HTTP header in the browser. Every time the browser (client) refreshes, the stored cookie will be a part of that request.
 *
 * Once the client browser saves this cookie, it will send that cookie along with each subsequent request to the server. The server will validate the cookie against the session ID. If the validation is successful, the user is granted access to the requested resources on the server.
 *
 * It’s not a security concern if a third party can read the cookie. The client won’t be able to modify the contents of the cookie, and even if they try to, it’s going to break the signature of that cookie. This way, the server will be able to detect the modification. A cookie doesn’t carry any meaningful data inside of them. It just contains the session ID token. The cookie is encrypted. It still has to maintain a one-to-one relationship with the user session. The cookie will be valid until set maxAge expires or the user decides to log out.
 *
 * This middleware function is applied to the ENTIRE APPLICATION (aka called or hit for every request made by the client to
 * any of the routes).
 */
app.use(
    // session(options) -> Creates a session middleware
    // Session data is stored in the server-side. The only data stored in the client/browser is the session ID.
    session({
        name: 'AuthState', // The name of the session ID cookie to set in the response (and read from in the request). The default value is 'connect.sid'.
        secret: "This is a secret..", // The secret used to sign the session ID cookie. A random unique string key used to authenticate
        // a session. It is stored in an environment variable and can’t be exposed to the public. The key is usually long and randomly generated in a production environment.
        saveUninitialized: false, // Save un-initialized sessions to the store. When true, it allows any uninitialized session to be sent to the store. When a session is created but not modified, it is referred to as uninitialized.
        resave: false, // Re-save unmodified sessions back to the store
        cookie: {maxAge: ONE_HOUR * NUM_OF_HOURS_SESSION_EXPIRES} // Settings object for the session ID cookie. The Session expires after 5 hours. The browser will delete the cookie after the set duration elapses. The cookie will not be attached to any of the requests in the future.
        // maxAge -> Specifies the number (in milliseconds) to use when calculating the Expires Set-Cookie attribute.
    })
);

app.use((req, res, next) => {
    // Since it uses the method app.use(...), this application-level middleware gets executed for any type of HTTP request
    // to the root path '/'
    const authState = (req.session.user) ? 'Authenticated User' : 'Non-Authenticated User';
    // Log the request information
    console.log(`[${new Date().toLocaleString('en-US')}]: ${req.method} ${req.path} (${authState})`);
    if (req.session.user) {
        // Setting res locals, which are variables that are accessible in the view html templates rendered by the
        // handlebars view engine using the res.render() method.
        res.locals.isRealtor = (req.session.user.role === ROLES.RELATOR);
        res.locals.isGeneral = (req.session.user.role === ROLES.GENERAL)
        res.locals.loggedUserInfo = req.session.user;
        console.log(`\t- Role->${req.session.user.role} Email->${req.session.user.email} Username->${req.session.user.username}`);
    }
    next();
});

app.engine('handlebars',
    handlebars.engine({
      defaultLayout: 'main'
    })
);
app.set('view engine', 'handlebars'); // Register the view engine (template engine) to be handlebars

configRoutes(app);

const port = process.env.PORT || 3000;

/**
 * app.listen(port, host, backlog, [callbackFn]) -> Starts a UNIX socket and listens for connections on the specified
 * host and port.
 */
app.listen(port, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
