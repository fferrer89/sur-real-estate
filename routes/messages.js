import {Router} from "express";


const messageRouter = Router(); // Creates a messageRouter object

messageRouter
  .route('/:messageId')
  .get(async (req, res) => {
    // TODO: Implement get request for message
  })
  .post(async (req, res) => {
    // TODO: Implement post request for message
  })
  .delete(async (req, res) => {
    // TODO: Implement delete request for message
});

export default messageRouter;
