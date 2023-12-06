import {Router} from "express";

const logoutRouter = Router(); // Creates a listingRouter object
/**
 * This route will expire/delete the AuthState and inform the user that they have been logged out. It will provide a
 * URL hyperlink to the / route.
 *
 */
logoutRouter.route('/').get(async (req, res) => {
    req.session.destroy(); // Destroys the session and unsets the req.session property
    return res.render('users/login');
});

export default logoutRouter;