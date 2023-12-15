/**
 * This data file should export all functions using the ES6 standard as shown in the lecture code
 */
import validation from "../helpers/input-validations.js";
import {COLLECTION_NAMES} from "../config/mongoCollections.js";
import {DatabaseError, DocumentNotFoundError} from "./custom-error-classes.js";
import {messages} from "../config/mongoCollections.js";
import {ObjectId} from "mongodb";
import {userData} from "./index.js";


const messageData = {
    async newMessage(
        senderId=validation.isRequired('senderId'),
        receiverId=validation.isRequired('receiverId'),
        message=validation.isRequired('message'),
        listingId,
    ) {
        // 0: Retrieve request information to be added/queried/updated to/from the database
        // 1: Validate that data is in the correct format and follow the schema
        senderId = validation.bsonObjectId(senderId, 'senderId');
        receiverId = validation.bsonObjectId(receiverId, 'receiverId');
        message = validation.string('message', message);

        const senderUsername =  await userData.getUser(senderId);
        let newMessage = {
            senderId,
            senderUsername: senderUsername.username,
            receiverId,
            message,
            timestamp: new Date(),
        };
        if (listingId) {
            newMessage.listingId = validation.bsonObjectId(listingId, 'listingId');
        }


        // 2: Retrieve the collection
        // 3: Perform the database operation
        let messageInfo;
        try {
            const messageCollection = await messages();
            messageInfo = await messageCollection.insertOne(newMessage);
        } catch (e) {
            throw new DatabaseError(`Document insertion failure`, COLLECTION_NAMES.MESSAGES, {cause: e });
        }

        // 4: Validate output the database operation
        if (!messageInfo.acknowledged || !messageInfo.insertedId) {
            throw new DatabaseError(`Document insertion failure`, COLLECTION_NAMES.MESSAGES);
        }
        const messageId = messageInfo.insertedId;
        // 5: Return requested data
        return messageId.toString();
    },
    async respondMessage(messageId= validation.isRequired('messageId'),
                         senderId=validation.isRequired('senderId'),
                         message=validation.isRequired('message')) {
        // 0: Retrieve request information to be added/queried/updated to/from the database
        // 1: Validate that data is in the correct format and follow the schema
        messageId = validation.bsonObjectId(messageId, 'messageId');
        senderId = validation.bsonObjectId(senderId, 'senderId');
        message = validation.string('replyMessage', message);

        const senderUsername =  await userData.getUser(senderId);
        let reply = {
            senderId,
            senderUsername: senderUsername.username,
            message,
            timestamp: new Date()
        };
        // 2: Retrieve the collection
        // 3: Perform the database operation
        let parentMessage;
        try {
            const messagesCollection = await messages();
            parentMessage = await messagesCollection.findOneAndUpdate(
                {_id: new ObjectId(messageId)},
                {$push: {replies: reply}},
                {returnDocument: 'after'}
            )
        } catch (e) {
            throw new DatabaseError(`Document find failure`, COLLECTION_NAMES.MESSAGES, {cause: e });
        }
        // 4: Validate output the database operation
        if (!parentMessage) {
            throw new DocumentNotFoundError(`Message not found`, COLLECTION_NAMES.MESSAGES, messageId);
        } else {
            // 5: Return requested data
            return parentMessage.replies[parentMessage.replies.length - 1]; // Return the newly added reply
        }
    },


    async getSentMessages(senderId=validation.isRequired('senderId')) {
        // 0: Retrieve data to be added/queried/updated to/from the database
        // 1: Validate that data is in the correct format and follow the schema
        senderId = validation.bsonObjectId(senderId, 'senderId');


        // 2: Retrieve the collection
        // 3: Perform the database operation
        let sentMessages;
        try {
            const messagesCollection = await messages();
            sentMessages = await messagesCollection.find({senderId: senderId});
        } catch (e) {
            throw new DatabaseError(`Document find failure`, COLLECTION_NAMES.MESSAGES, {cause: e });
        }

        // 5: Return requested data
        return sentMessages;
    },
    async getSentMessagesOfListing(senderId=validation.isRequired('senderId'),
                                   listingId=validation.isRequired('listingId')) {
        // 0: Retrieve data to be added/queried/updated to/from the database
        // 1: Validate that data is in the correct format and follow the schema
        senderId = validation.bsonObjectId(senderId, 'senderId');
        listingId = validation.bsonObjectId(listingId, 'listingId');

        // 2: Retrieve the collection
        // 3: Perform the database operation
        let sentMessages;
        try {
            const messagesCollection = await messages();
            sentMessages = await messagesCollection.find({$and: [{senderId: senderId}, {listingId: listingId}]}).toArray();
        } catch (e) {
            throw new DatabaseError(`Document find failure`, COLLECTION_NAMES.MESSAGES, {cause: e });
        }

        // 5: Return requested data
        return sentMessages;
    },
    async getListingMessages(listingId=validation.isRequired('listingId')) {
        listingId = validation.bsonObjectId(listingId, 'listingId');

        // 2: Retrieve the collection
        // 3: Perform the database operation
        let listingMessages;
        try {
            const messagesCollection = await messages();
            listingMessages = await messagesCollection.find({listingId: listingId}).toArray();
        } catch (e) {
            throw new DatabaseError(`Document find failure`, COLLECTION_NAMES.MESSAGES, {cause: e });
        }

        // 5: Return requested data
        return listingMessages;
    },
    async getMessage(messageId=validation.isRequired('messageId'),) {
        // 0: Retrieve data to be added/queried/updated to/from the database
        // 1: Validate that data is in the correct format and follow the schema
        messageId = validation.bsonObjectId(messageId, 'messageId');

        // 2: Retrieve the collection
        // 3: Perform the database operation
        let message;
        try {
            const messagesCollection = await messages();
            message = await messagesCollection.findOne({
                _id: new ObjectId(messageId),
            })
        } catch (e) {
            throw new DatabaseError(`Document find failure`, COLLECTION_NAMES.MESSAGES, {cause: e });
        }

        // 4: Validate output from database operation
        if (message === null) {
            throw new DocumentNotFoundError(`Message not found`, COLLECTION_NAMES.LISTINGS, messageId);
        }

        // 5: Return requested data
        return messageId;
    },

};
export default messageData;

