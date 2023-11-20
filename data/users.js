/**
 * This data file should export all functions using the ES6 standard as shown in the lecture code
 */
import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections.js";
import validate from "../validate.js";

const usersCollection = await users();

const userData = {
  async createUser(
    firstName,
    lastName,
    email,
    username,
    hashedPassword,
    userType,
    listingHistory,
    favoritedListing,
    documentation
  ) {
    // TODO: Database function to create a new user
    if (
      firstName === undefined ||
      lastName === undefined ||
      email === undefined ||
      username === undefined ||
      hashedPassword === undefined ||
      userType === undefined ||
      listingHistory === undefined ||
      favoritedListing === undefined ||
      documentation === undefined
    ) {
      throw new Error("Missing one or more required parameters");
    }
    firstName = validate.verifyUpdateString(firstName);
    lastName = validate.verifyUpdateString(lastName);
    email = validate.verifyEmail(email);
    username = validate.verifyUpdateString(username);
    hashedPassword = validate.verifyUpdateString(hashedPassword);
    userType = validate.verifyUserType(userType);
    listingHistory = validate.verifyListingHistory(listingHistory);
    favoritedListing = validate.verifyFavoritedListing(favoritedListing);
    documentation = validate.verifyDocumentation(documentation);

    let newUser = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      username: username,
      hashedPassword: hashedPassword,
      userType: userType,
      listingHistory: listingHistory,
      favoritedListing: favoritedListing,
      documentation: documentation,
    };

    const newInsertInformation = await usersCollection.insertOne(newUser);
    const newId = newInsertInformation.insertedId;
    const returnedUser = await this.getUser(newId.toString());
    returnedUser._id = returnedUser._id.toString();
    return returnedUser;
  },

  async getUser(userId) {
    // TODO: Database function to retrieve an existing user
    userId = validate.verifyId(userId);
    const user = await usersCollection.findOne({
      _id: new ObjectId(userId),
    });
    if (user === null)
      throw new Error(`User could not be found with provided id ${userId}`);
    return user;
  },

  async getAllUsers() {
    // TODO: Database function to retrieve all users
    let userArr = await usersCollection.find({}).toArray();
    if (!userArr) {
      throw new Error("Failed to get all users");
    }

    userArr = userArr.map((element) => {
      let resultObj = {
        _id: element._id.toString(),
        username: element.username,
      };
      return resultObj;
    });

    return userArr;
  },

  async removeUser(userId) {
    // TODO: Database function to remove a single user
    userId = validate.verifyId(userId);

    const deletionInfo = await usersCollection.findOneAndDelete({
      _id: new ObjectId(userId),
    });

    if (!deletionInfo) {
      throw new Error(`Unable to delete event ${userId} from collection.`);
    }
    let result = {};
    result.username = deletionInfo.username;
    result.deleted = true;
    return result;
  },
  async updateUser(
    userId,
    firstName,
    lastName,
    email,
    username,
    hashedPassword,
    userType,
    listingHistory,
    favoritedListing,
    documentation
  ) {
    // TODO: Database function to update a new user
    if (
      userId === undefined ||
      firstName === undefined ||
      lastName === undefined ||
      email === undefined ||
      username === undefined ||
      hashedPassword === undefined ||
      userType === undefined ||
      listingHistory === undefined ||
      favoritedListing === undefined ||
      documentation === undefined
    ) {
      throw new Error("Missing one or more required parameters");
    }
    userId = validate.verifyId(userId);
    firstName = validate.verifyUpdateString(firstName);
    lastName = validate.verifyUpdateString(lastName);
    email = validate.verifyEmail(email);
    username = validate.verifyUpdateString(username);
    hashedPassword = validate.verifyUpdateString(hashedPassword);
    userType = validate.verifyUserType(userType);
    listingHistory = validate.verifyListingHistory(listingHistory);
    favoritedListing = validate.verifyFavoritedListing(favoritedListing);
    documentation = validate.verifyDocumentation(documentation);

    let userObj = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      username: username,
      hashedPassword: hashedPassword,
      userType: userType,
      listingHistory: listingHistory,
      favoritedListing: favoritedListing,
      documentation: documentation,
    };

    const updatedUser = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: userObj },
      { returnDocument: "after" }
    );
    if (!updatedUser) {
      throw new Error(
        `Could not update the user ${userId} of the Users Collection`
      );
    }
    updatedUser._id = updatedUser._id.toString();
    return updatedUser;
  },
};
export default userData;
