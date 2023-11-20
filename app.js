import express from 'express';
const app = express();
import configRoutes from './routes/index.js';
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import exphbs from 'express-handlebars';

/*
Get the Absolute file path of this module
import.meta.url -> Returns the full URL to this module/file
fileURLToPath -> Removes the prefix "file:///" from import.meta.url
 */
const __filename = fileURLToPath(import.meta.url);

/*
Get the Absolute directory path of this module, whose absolute file path is in the "__filename" variable
 */
const __dirname = dirname(__filename);

/* Middleware that enables this express application to serve static files such as images, CSS files, and JavaScript
files, specifying the directory where we are storing PUBLIC assets (/public).
The first argument (root), specifies the Absolute directory path from which to serve static assets
 */
const publicDir = express.static(__dirname + '/public');

/* Set up this express.js application to map the '/public' to the directory where we have all the public files.
Set up the '/public' route to the file in staticDir variable. This express.js app will use the directory in staticDir
when the URL path is '/public'.

The Browser will make GET requests to assets in our /public directory to build the HTML files, so we need to mount the
/public directory in this application.
Eg: <link rel="stylesheet" href="../public/stylesheets/main.css">
 */
app.use('/public', publicDir); // When a request is made to /public, express.js will serve all the files inside of the
// /public directory

/*
Middleware function that parses incoming requests with JSON payloads. Sets up this app to read the request.body sent in
 JSON format.
 */
app.use(express.json());

/*
Middleware function that parses incoming requests with urlencoded payloads. Sets up this app to read the request.body
sent in x-www-form-urlencoded format (application/x-www-form-urlencoded), used when submitting HTML FORMS.
 */
app.use(express.urlencoded({
      extended: true} // This option allows choosing between parsing the URL-encoded data with the querystring
    // library (when false) or the qs library (when true)
));

/*
A template engine enables you to use static/public template files in your application. At runtime, the template engine replaces
variables in a template file with actual values, and transforms the template into an HTML file sent to the client. This
approach makes it easier to design an HTML page.

Register this express.js application to use handlebars as its template engine. Registering a template engine enables this
express application to pass data into HTML files to be able to generate HTML files dynamically depending on the passed data.
app.engine(ext, callback) -> Registers the given template engine callback as ext.
 */
app.engine('handlebars',
    exphbs.engine({
      defaultLayout: 'main' /* The main template of this express.js application. The wrapper for anything that you want
       displayed on ALL HTML PAGES in your website. It looks in the 'views/' directory for a file named "main".
       defaultLayout is a Handlebars template with a \{{{body}}} placeholder. Usually it will be an HTML page
       wrapper into which views will be rendered.*/
    })
);

/*
Configure the behavior of the server, setting "handlebars" as the server's "view engine"
app.set(name, value)
 */
app.set('view engine', 'handlebars'); // Set the view engine (template engine) to be handlebars

configRoutes(app);


const port = process.env.PORT || 3000; // Setting the port number to whatever is in the environment
// variable PORT, or 3000 if process.env.PORT is null.
app.listen(port, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
