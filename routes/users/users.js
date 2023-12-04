import {Router} from "express";


const userRouter = Router(); // Creates a userRouter object

userRouter
  .route('/:userId')
  .get(async (req, res) => {
    // TODO: Implement get request for user
  })
  .post(async (req, res) => {
    // TODO: Implement post request for user
  })
  .delete(async (req, res) => {
    // TODO: Implement delete request for user
});

export default userRouter;
