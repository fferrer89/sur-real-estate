import express from 'express';
const app = express();
import configRoutes from './routes/index.js';
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import handlebars from 'express-handlebars';
import session from "express-session";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = express.static(__dirname + '/public');

app.use('/public', publicDir);

app.use(express.json());

app.use(express.urlencoded({
      extended: true}
));

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

// TODO: Delete middleware from below. Only added for debugging purposes
app.use((req, res, next) => {
    // Since it uses the method app.use(...), this application-level middleware gets executed for any type of HTTP request
    // to the root path '/'
    const authState = (req.session.user) ? 'Authenticated User' : 'Non-Authenticated User';
    // Log the request information
    console.log(`[${new Date().toLocaleString('en-US')}]: ${req.method} ${req.path} (${authState})`);
    if (req.session.user) {
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
