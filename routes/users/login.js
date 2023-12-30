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

const loginRouter = Router(); // Creates a loginRouter object

// TODO: Add a middleware specific to this route?

loginRouter.route('/')
    /**
     * Route that receives get requests from http://localhost:3000/login, which renders to the user/browser a
     * web page containing a Form to be filled by the user to log in to his/her account.
     *
     * This route will render a view with a login form, which contains two inputs, one for the email address and one for
     * the password. The form will be used to submit a POST request to the /login route on the server.
     *
     * An authenticated user should not ever see the login screen.
     *
     * GET request to http://localhost:3000/login
     */
    .get(async (req, res) => {
        try {
            return res.render('users/login');
        } catch (e) {
            return res.status(500).json({error: e.message});
        }
    })
    /**
     * Route that receives posts requests from http://localhost:3000/login, which receives the Form data filled
     * and sent by the user/browser to log in to his/her account. The body of the post request contains the Form data.
     * This route will read the form data sent by the 'login' page and attempt to log a user in with the credentials
     * they provide in the login form.
     *
     * HTML Form Request: <form action="/login" method="post">
     *
     * POST request to http://localhost:3000/login
     */
    .post(async (req, res) => {
        // 0: Retrieve client/browser request information
        let loginForm = req.body;

        // 1: Validate request payload (Request Body)
        // 2: Validate request payload individual variables (Request Body Properties)
        try {
            loginForm = validation.object('Log In form', loginForm, serverSchemas.loginPostForm);
        } catch (e) {
            return res.status(400).render('users/login', {errorMessage: e.message});
        }

        // 3: Make database request
        // Making a POST to this route, You will call your 'loginUser' db function passing in the 'emailAddressInput'
        // and 'passwordInput' from the request.body.
        let userLogged;
        try {
            userLogged = await userData.login(loginForm.email, loginForm.password);
        } catch (e) {
            if (e.message === 'Either the email address or password is invalid') {
                // If the user does not provide a valid login, you will render the login screen once again, and this time show
                // an error message (along with an HTTP 400 status code) to the user explaining that they did not provide a
                // valid username and/or password.
                return res.status(400).render('users/login', {errorMessage: e.message});
            }
            // If your DB function does not return this but also did not throw an error (perhaps the DB server was down when
            // you tried to insert), you will respond with a status code of 500 and error message saying "Internal Server Error"
            return res.status(500).render('error', {
                errorMessage: 'Internal Server Error'
            });
        }

        // 4: Create a cookie to store the logged-in user info
        req.session.user = userLogged;

        // 4: Respond to the client/browser request
        // Redirect the logged-in visitor to the home page
        return res.redirect(303, '/'); // redirecting from POST /login to GET /protected

    });

export default loginRouter;