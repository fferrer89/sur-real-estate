import {Router} from "express";

const imageRouter = Router(); // Creates a imageRouter object


imageRouter.route('/')
    /**
     * POST request to http://localhost:3000/images
     */
    .post(async (req, res) => {
        // Stores/uploads an image on the database
        // FIXME: Route Not needed! Delete!
    });

imageRouter.route('/:imageId')
    /**
     * GET request to http://localhost:3000/images/655a937811d7a8e1b10c49c3
     */
    .get(async (req, res) => {
        // Retrieves a specific image
    });

export default imageRouter;
