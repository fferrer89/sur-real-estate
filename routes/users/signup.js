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
import validation from "../../helpers/input-validations.js";
import {serverSchemas} from "../../helpers/object-schemas.js";
import {userData} from '../../data/index.js'
import multer from "multer";

const signupRouter = Router(); // Creates a signupRouter object

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
        cb(null, 'static/uploads');
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
signupRouter.route('/')
    /**
     * Route that receives get requests from http://localhost:3000/signup, which renders to the user/browser a
     * web page containing a Form to be filled by the user to create a new account.
     * This route will render a view with a sign-up form, which is used to submit the POST request to the /signup route
     * on the server.
     *
     * An authenticated user should not ever see the sign-up screen.
     *
     * GET request to http://localhost:3000/signup
     */
    .get(async (req, res) => {
        try {
            return res.render('users/signup');
        } catch (e) {
            return res.status(500).json({error: e.message});
        }
    })
    /**
     * Route that receives posts requests from http://localhost:3000/signup, which receives the Form data filled
     * and sent by the user/browser to create a new account. The body of the post request contains the Form data.
     * This route will read the form data sent by the 'signup' page and create a new user in the database.
     *
     * HTML Form Request: <form action="/signup" method="post">
     *
     * POST request to http://localhost:3000/signup
     */
    .post(imageUpload.single('file'), async (req, res) => {
        // 0: Retrieve client/browser request information
        // 1: Validate request payload (Request Body)
        let signupForm = req.body;

        // FIXME: Delete line below and enable sending files capabilities
        signupForm.file = req.file.filename;

        try {
            signupForm = validation.object('Sign Up form', signupForm, serverSchemas.signupPostForm);
        } catch (e) {
            return res.status(400).json({errors: e.message});
        }
        // 2: Validate request payload individual variables (Request Body Properties)
        // Confirm that passwordInput and confirmPasswordInput are equal
        try {
            validation.comparePasswords('Password', signupForm.password,
                'Confirm Password', signupForm.confirmPassword);
        } catch (e) {
            return res.status(400).render('users/signup', {
                errorMessage: e.message
            });
        }
        // Confirm that the supplied email is unique
        if (! await userData.uniqueEmail(signupForm.email)) {
            // Email address is not unique, so throw an error
            return res.status(400).render('users/signup', {
                errorMessage: `There is already another user with the ${signupForm.email} email address. Please choose another email address`
            });
        }
        // 3: Make database request
        // 4: Respond to the client/browser request
        try {
            await userData.signup(signupForm.role, signupForm.email, signupForm.username, signupForm.password);
            return res.redirect(303, '/login'); // Redirection "See Other" from POST /register to GET /login
        } catch (e) {
            return res.status(500).render('error', {errorMessage: 'Internal Server Error'});
        }
    });


export default signupRouter;