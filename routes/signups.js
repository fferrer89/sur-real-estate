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



const signupRouter = Router(); // Creates a signupRouter object
signupRouter.route('/')
    /**
     * Route that receives get requests from http://localhost:3000/signup, which renders to the user/browser a
     * web page containing a Form to be filled by the user to create a new account.
     * GET request to http://localhost:3000/signup
     */
    .get(async (req, res) => {
        try {
            return res.render('signups/index');
        } catch (e) {
            return res.status(500).json({error: e.message});
        }
    })
    /**
     * Route that receives posts requests from http://localhost:3000/signup, which receives the Form data filled
     * and sent by the user/browser to create a new account. The body of the post request contains the Form data.
     *
     * HTML Form Request: <form action="/signup" method="post">
     *
     * POST request to http://localhost:3000/signup
     */
    .post(async (req, res) => {

    });


export default signupRouter;