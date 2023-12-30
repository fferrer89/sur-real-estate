import {Router} from "express";

const logoutRouter = Router(); // Creates a listingRouter object
/**
 * This route will expire/delete the AuthState and inform the user that they have been logged out. It will provide a
 * URL hyperlink to the / route.
 *
 */
logoutRouter.route('/').get(async (req, res) => {
    if (req.session) {
        req.session.destroy(); // Destroys the session and unsets the req.session property

        // Setting res locals, which are variables that are accessible in the view html templates rendered by the
        // handlebars view engine using the res.render() method.
        delete res.locals.isRealtor;
        delete res.locals.isGeneral;
        delete res.locals.loggedUserInfo;

        return res.redirect('/'); // Redirects to home page using a 302 "Found" status code
    }
});

export default logoutRouter;