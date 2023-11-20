// FIXME: This file is an example of how we are going to do our testing

import { describe, it, beforeEach, before, afterEach, after } from "node:test";
import assert from "node:assert/strict";
import { userData } from "../../data/index.js";
import { closeConnection, dbConnection } from "../../config/mongoConnection.js";
import eventsSetting from "events";
import { ObjectId } from "mongodb";
// it() -> To create a new test
// describe() -> To create a new test suite

eventsSetting.EventEmitter.defaultMaxListeners = 100; //

// Test Cases for async event()
describe("usersTestSuite", { skip: false }, (t) => {
  let originalUser,
    userId,
    firstName,
    lastName,
    email,
    username,
    hashedPassword,
    userType,
    listingHistory,
    favoritedListing,
    documentation;
  // beforeEach() is run before each test in a describe()
  beforeEach(async () => {
    const db = await dbConnection();
    await db.dropDatabase(); // clearing the database
  });
  // after() is run once after all the tests in a describe()
  after(async () => {
    await closeConnection();
    process.exit();
  });

  // Test Cases for async create()
  describe("userData.createUser()", { skip: false }, (t) => {
    // beforeEach() is run before each test in a describe()
    beforeEach(async (t) => {
      firstName = "John";
      lastName = "Smith";
      email = "John@school.edu";
      username = "JohnS";
      hashedPassword = "jsocdjsycowjjoP";
      userType = "admin";
      listingHistory = [
        new ObjectId().toString(),
        new ObjectId().toString(),
        new ObjectId().toString(),
      ];
      favoritedListing = [new ObjectId().toString(), new ObjectId().toString()];
      documentation = [
        "103e1902898012/drivers-license",
        "103e1902898012/passport",
      ];
    });
    it("createUser() -> ValidInputValuesWithSpacesSuccess", async (t) => {
      firstName = `\t  \n ${firstName} \t\t\n   `;
      lastName = `\t  \n ${lastName} \t\t\n   `;
      email = `\t  \n ${email} \t\t\n   `;
      username = `\t  \n ${username} \t\t\n   `;
      hashedPassword = `\t  \n ${hashedPassword} \t\t\n   `;
      userType = `\t  \n ${userType} \t\t\n   `;
      listingHistory = listingHistory.map((element) => {
        return `\t  \n ${element} \t\t\n   `;
      });
      favoritedListing = favoritedListing.map((element) => {
        return `\t  \n ${element} \t\t\n   `;
      });
      documentation = documentation.map((element) => {
        return `\t  \n ${element} \t\t\n   `;
      });
      const tempUser = await userData.createUser(
        firstName,
        lastName,
        email,
        username,
        hashedPassword,
        userType,
        listingHistory,
        favoritedListing,
        documentation
      );
      // Assertions:
      assert.ok(
        tempUser instanceof Object && !(tempUser instanceof Array),
        "createEvent() element returned is not an object"
      );
      assert.deepStrictEqual(
        Object.keys(tempUser).length,
        10,
        "The number of attributes returned is not 10"
      );
      assert.ok(
        ObjectId.isValid(tempUser._id),
        "The user _id created is not valid"
      );
      assert.deepStrictEqual(
        tempUser.firstName,
        firstName.trim(),
        "The firstName expected and actual are not the same"
      );
      assert.deepStrictEqual(
        tempUser.lastName,
        lastName.trim(),
        "The lastName expected and actual are not the same"
      );
      assert.deepStrictEqual(
        tempUser.email,
        email.trim(),
        "The email expected and actual are not the same"
      );
      assert.deepStrictEqual(
        tempUser.username,
        username.trim(),
        "The username expected and actual are not the same"
      );
      assert.deepStrictEqual(
        tempUser.hashedPassword,
        hashedPassword.trim(),
        "The hashedPassword expected and actual are not the same"
      );
      assert.deepStrictEqual(
        tempUser.userType,
        userType.trim(),
        "The userType expected and actual are not the same"
      );
      assert.ok(
        tempUser.listingHistory instanceof Object &&
          tempUser.listingHistory instanceof Array,
        "createEvent() element listingHistory returned is not an array"
      );
      assert.deepStrictEqual(
        tempUser.listingHistory,
        listingHistory,
        "The listingHistory expected and actual are not the same"
      );
      assert.ok(
        tempUser.favoritedListing instanceof Object &&
          tempUser.favoritedListing instanceof Array,
        "createEvent() element favoritedListing returned is not an array"
      );
      assert.deepStrictEqual(
        tempUser.favoritedListing,
        favoritedListing,
        "The favoritedListing expected and actual are not the same"
      );
      assert.ok(
        tempUser.documentation instanceof Object &&
          tempUser.documentation instanceof Array,
        "createEvent() element documentation returned is not an array"
      );
      assert.deepStrictEqual(
        tempUser.documentation,
        documentation,
        "The documentation expected and actual are not the same"
      );
    });
    it("createUser() -> NoParamsPassedFail", async (t) => {
      await assert.rejects(
        userData.createUser(),
        { message: "Missing one or more required parameters" },
        "Exception/Error should have been thrown"
      );
    });
    it("createUser() -> firstNameMissingFail", async (t) => {
      await assert.rejects(
        userData.createUser(
          lastName,
          email,
          username,
          hashedPassword,
          userType,
          listingHistory,
          favoritedListing,
          documentation
        ),
        { message: "Missing one or more required parameters" },
        "Exception/Error should have been thrown"
      );
    });
    it("createUser() -> firstNameInvalidTypeFail", async (t) => {
      firstName = 55;
      await assert.rejects(
        userData.createUser(
          firstName,
          lastName,
          email,
          username,
          hashedPassword,
          userType,
          listingHistory,
          favoritedListing,
          documentation
        ),
        {
          message: `The value ${
            firstName || "passed in"
          } is not a valid string`,
        },
        "Exception/Error should have been thrown"
      );
    });
    it("createUser() -> lastNameInvalidTypeFail", async (t) => {
      lastName = 55;
      await assert.rejects(
        userData.createUser(
          firstName,
          lastName,
          email,
          username,
          hashedPassword,
          userType,
          listingHistory,
          favoritedListing,
          documentation
        ),
        {
          message: `The value ${lastName || "passed in"} is not a valid string`,
        },
        "Exception/Error should have been thrown"
      );
    });
    it("createUser() -> emailNotValidFail", async (t) => {
      email = "myemail.email@kiko";
      await assert.rejects(
        userData.createUser(
          firstName,
          lastName,
          email,
          username,
          hashedPassword,
          userType,
          listingHistory,
          favoritedListing,
          documentation
        ),
        {
          message: `The email address provided (${email}) is not a valid email address`,
        },
        "Exception/Error should have been thrown"
      );
    });
    it("createUser() -> usernameInvalidTypeFail", async (t) => {
      username = 55;
      await assert.rejects(
        userData.createUser(
          firstName,
          lastName,
          email,
          username,
          hashedPassword,
          userType,
          listingHistory,
          favoritedListing,
          documentation
        ),
        {
          message: `The value ${username || "passed in"} is not a valid string`,
        },
        "Exception/Error should have been thrown"
      );
    });
    it("createUser() -> hashedPasswordInvalidTypeFail", async (t) => {
      hashedPassword = 55;
      await assert.rejects(
        userData.createUser(
          firstName,
          lastName,
          email,
          username,
          hashedPassword,
          userType,
          listingHistory,
          favoritedListing,
          documentation
        ),
        {
          message: `The value ${
            hashedPassword || "passed in"
          } is not a valid string`,
        },
        "Exception/Error should have been thrown"
      );
    });
    it("createUser() -> userTypeInvalidTypeFail", async (t) => {
      userType = "John";
      let acceptedTypes = ["admin", "realtor", "general", "guest"];
      await assert.rejects(
        userData.createUser(
          firstName,
          lastName,
          email,
          username,
          hashedPassword,
          userType,
          listingHistory,
          favoritedListing,
          documentation
        ),
        {
          message: `userType ${userType} is not an accepted type. ${acceptedTypes.toString()}`,
        },
        "Exception/Error should have been thrown"
      );
    });
    it("createUser() -> listingHistoryInvalidTypeFail", async (t) => {
      let badObjId = 55;
      listingHistory = [
        new ObjectId().toString(),
        badObjId,
        new ObjectId().toString(),
      ];
      await assert.rejects(
        userData.createUser(
          firstName,
          lastName,
          email,
          username,
          hashedPassword,
          userType,
          listingHistory,
          favoritedListing,
          documentation
        ),
        {
          message: `Id provided must be a string`,
        },
        "Exception/Error should have been thrown"
      );
    });
    it("createUser() -> favoritedListingInvalidTypeFail", async (t) => {
      let badObjId = 55;
      favoritedListing = [new ObjectId().toString(), badObjId];
      await assert.rejects(
        userData.createUser(
          firstName,
          lastName,
          email,
          username,
          hashedPassword,
          userType,
          listingHistory,
          favoritedListing,
          documentation
        ),
        {
          message: `Id provided must be a string`,
        },
        "Exception/Error should have been thrown"
      );
    });
    it("createUser() -> documentationInvalidTypeFail", async (t) => {
      let badObjId = 55;
      documentation = ["103e1902898012/drivers-license", badObjId];
      await assert.rejects(
        userData.createUser(
          firstName,
          lastName,
          email,
          username,
          hashedPassword,
          userType,
          listingHistory,
          favoritedListing,
          documentation
        ),
        {
          message: `The value ${badObjId || "passed in"} is not a valid string`,
        },
        "Exception/Error should have been thrown"
      );
    });
  });

  // Test Cases for async getAllUsers()
  describe("userData.getAllUsers(userID)", { skip: false }, (t) => {
    let createdUserId;
    beforeEach(async (t) => {
      firstName = "John";
      lastName = "Smith";
      email = "John@school.edu";
      username = "JohnS";
      hashedPassword = "jsocdjsycowjjoP";
      userType = "admin";
      listingHistory = [
        new ObjectId().toString(),
        new ObjectId().toString(),
        new ObjectId().toString(),
      ];
      favoritedListing = [new ObjectId().toString(), new ObjectId().toString()];
      documentation = [
        "103e1902898012/drivers-license",
        "103e1902898012/passport",
      ];
      let { _id } = await userData.createUser(
        firstName,
        lastName,
        email,
        username,
        hashedPassword,
        userType,
        listingHistory,
        favoritedListing,
        documentation
      );
      createdUserId = _id;
    });
    it("getAllUsers() -> getAllUsersOneEventValidSuccess", async (t) => {
      const allUsers = await userData.getAllUsers();
      // Assertions:
      assert.ok(
        Array.isArray(allUsers),
        "getAllUsers() does not return an array"
      );
      assert.deepStrictEqual(
        allUsers.length,
        1,
        "getAllUsers() does not return exactly 1 event"
      );
      const firstUser = allUsers[0];
      assert.deepStrictEqual(
        Object.keys(firstUser).length,
        2,
        "The number of attributes returned is not 2"
      );
      assert.ok(
        firstUser instanceof Object && !(firstUser instanceof Array),
        "getAllUsers() first element is not an object"
      );
      assert.deepStrictEqual(
        firstUser._id,
        createdUserId,
        "The _id expected and actual are not the same"
      );
      assert.deepStrictEqual(
        firstUser.firstName,
        undefined,
        "The firstName expected and actual are not the same"
      );
      assert.deepStrictEqual(
        firstUser.lastName,
        undefined,
        "The lastName expected and actual are not the same"
      );
      assert.deepStrictEqual(
        firstUser.email,
        undefined,
        "The email expected and actual are not the same"
      );
      assert.deepStrictEqual(
        firstUser.username,
        username.trim(),
        "The username expected and actual are not the same"
      );
      assert.deepStrictEqual(
        firstUser.hashedPassword,
        undefined,
        "The hashedPassword expected and actual are not the same"
      );
      assert.deepStrictEqual(
        firstUser.userType,
        undefined,
        "The userType expected and actual are not the same"
      );
      assert.deepStrictEqual(
        firstUser.listingHistory,
        undefined,
        "The listingHistory expected and actual are not the same"
      );
      assert.deepStrictEqual(
        firstUser.favoritedListing,
        undefined,
        "The favoritedListing expected and actual are not the same"
      );
      assert.deepStrictEqual(
        firstUser.documentation,
        undefined,
        "The documentation expected and actual are not the same"
      );
    });
    it("getAllUsers() -> getAllEventsTwoEventValidSuccess", async (t) => {
      let firstName_2 = "Rick";
      let lastName_2 = "Carter";
      let email_2 = "Rick@school.edu";
      let username_2 = "RickC";
      let hashedPassword_2 = "qawdfqaWFQafQASW";
      let userType_2 = "general";
      let listingHistory_2 = [
        new ObjectId().toString(),
        new ObjectId().toString(),
        new ObjectId().toString(),
      ];
      let favoritedListing_2 = [
        new ObjectId().toString(),
        new ObjectId().toString(),
      ];
      let documentation_2 = [
        "103e11230498012/drivers-license",
        "103e11230498012/passport",
      ];
      let { _id } = await userData.createUser(
        firstName_2,
        lastName_2,
        email_2,
        username_2,
        hashedPassword_2,
        userType_2,
        listingHistory_2,
        favoritedListing_2,
        documentation_2
      );
      const createdUserId_2 = _id;
      const allUsers = await userData.getAllUsers();

      // Assertions:
      assert.ok(
        Array.isArray(allUsers),
        "getAllUsers() does not return an array"
      );
      assert.deepStrictEqual(
        allUsers.length,
        2,
        "getAllUsers() does not return exactly 1 event"
      );
      const firstUser = allUsers[0];
      assert.deepStrictEqual(
        Object.keys(firstUser).length,
        2,
        "The number of attributes returned is not 2"
      );
      assert.ok(
        firstUser instanceof Object && !(firstUser instanceof Array),
        "getAllUsers() first element is not an object"
      );
      assert.deepStrictEqual(
        firstUser._id,
        createdUserId,
        "The _id expected and actual are not the same"
      );
      assert.deepStrictEqual(
        firstUser.firstName,
        undefined,
        "The firstName expected and actual are not the same"
      );
      assert.deepStrictEqual(
        firstUser.lastName,
        undefined,
        "The lastName expected and actual are not the same"
      );
      assert.deepStrictEqual(
        firstUser.email,
        undefined,
        "The email expected and actual are not the same"
      );
      assert.deepStrictEqual(
        firstUser.username,
        username.trim(),
        "The username expected and actual are not the same"
      );
      assert.deepStrictEqual(
        firstUser.hashedPassword,
        undefined,
        "The hashedPassword expected and actual are not the same"
      );
      assert.deepStrictEqual(
        firstUser.userType,
        undefined,
        "The userType expected and actual are not the same"
      );
      assert.deepStrictEqual(
        firstUser.listingHistory,
        undefined,
        "The listingHistory expected and actual are not the same"
      );
      assert.deepStrictEqual(
        firstUser.favoritedListing,
        undefined,
        "The favoritedListing expected and actual are not the same"
      );
      assert.deepStrictEqual(
        firstUser.documentation,
        undefined,
        "The documentation expected and actual are not the same"
      );

      // Assertions second element (secondUser)
      const secondUser = allUsers[1];

      assert.deepStrictEqual(
        Object.keys(secondUser).length,
        2,
        "The number of attributes returned is not 2"
      );
      assert.ok(
        secondUser instanceof Object && !(secondUser instanceof Array),
        "getAllUsers() first element is not an object"
      );
      assert.deepStrictEqual(
        secondUser._id,
        createdUserId_2,
        "The _id expected and actual are not the same"
      );
      assert.deepStrictEqual(
        secondUser.firstName,
        undefined,
        "The firstName expected and actual are not the same"
      );
      assert.deepStrictEqual(
        secondUser.lastName,
        undefined,
        "The lastName expected and actual are not the same"
      );
      assert.deepStrictEqual(
        secondUser.email,
        undefined,
        "The email expected and actual are not the same"
      );
      assert.deepStrictEqual(
        secondUser.username,
        username_2.trim(),
        "The username expected and actual are not the same"
      );
      assert.deepStrictEqual(
        secondUser.hashedPassword,
        undefined,
        "The hashedPassword expected and actual are not the same"
      );
      assert.deepStrictEqual(
        secondUser.userType,
        undefined,
        "The userType expected and actual are not the same"
      );
      assert.deepStrictEqual(
        secondUser.listingHistory,
        undefined,
        "The listingHistory expected and actual are not the same"
      );
      assert.deepStrictEqual(
        secondUser.favoritedListing,
        undefined,
        "The favoritedListing expected and actual are not the same"
      );
      assert.deepStrictEqual(
        secondUser.documentation,
        undefined,
        "The documentation expected and actual are not the same"
      );
    });
  });

  // Test Cases for async getUser()
  describe("userData.getUser()", { skip: false }, (t) => {
    let createdUserId;
    beforeEach(async (t) => {
      firstName = "John";
      lastName = "Smith";
      email = "John@school.edu";
      username = "JohnS";
      hashedPassword = "jsocdjsycowjjoP";
      userType = "admin";
      listingHistory = [
        new ObjectId().toString(),
        new ObjectId().toString(),
        new ObjectId().toString(),
      ];
      favoritedListing = [new ObjectId().toString(), new ObjectId().toString()];
      documentation = [
        "103e1902898012/drivers-license",
        "103e1902898012/passport",
      ];
      let { _id } = await userData.createUser(
        firstName,
        lastName,
        email,
        username,
        hashedPassword,
        userType,
        listingHistory,
        favoritedListing,
        documentation
      );
      createdUserId = _id;
    });
    it("getUser() -> getEventValidSuccess", async (t) => {
      const tempUser = await userData.getUser(`   ${createdUserId}   `);
      // Assertions:
      assert.ok(
        tempUser instanceof Object && !(tempUser instanceof Array),
        "createEvent() element returned is not an object"
      );
      assert.deepStrictEqual(
        Object.keys(tempUser).length,
        10,
        "The number of attributes returned is not 10"
      );
      assert.ok(
        ObjectId.isValid(tempUser._id),
        "The user _id created is not valid"
      );
      assert.deepStrictEqual(
        tempUser.firstName,
        firstName.trim(),
        "The firstName expected and actual are not the same"
      );
      assert.deepStrictEqual(
        tempUser.lastName,
        lastName.trim(),
        "The lastName expected and actual are not the same"
      );
      assert.deepStrictEqual(
        tempUser.email,
        email.trim(),
        "The email expected and actual are not the same"
      );
      assert.deepStrictEqual(
        tempUser.username,
        username.trim(),
        "The username expected and actual are not the same"
      );
      assert.deepStrictEqual(
        tempUser.hashedPassword,
        hashedPassword.trim(),
        "The hashedPassword expected and actual are not the same"
      );
      assert.deepStrictEqual(
        tempUser.userType,
        userType.trim(),
        "The userType expected and actual are not the same"
      );
      assert.ok(
        tempUser.listingHistory instanceof Object &&
          tempUser.listingHistory instanceof Array,
        "createEvent() element listingHistory returned is not an array"
      );
      assert.deepStrictEqual(
        tempUser.listingHistory,
        listingHistory,
        "The listingHistory expected and actual are not the same"
      );
      assert.ok(
        tempUser.favoritedListing instanceof Object &&
          tempUser.favoritedListing instanceof Array,
        "createEvent() element favoritedListing returned is not an array"
      );
      assert.deepStrictEqual(
        tempUser.favoritedListing,
        favoritedListing,
        "The favoritedListing expected and actual are not the same"
      );
      assert.ok(
        tempUser.documentation instanceof Object &&
          tempUser.documentation instanceof Array,
        "createEvent() element documentation returned is not an array"
      );
      assert.deepStrictEqual(
        tempUser.documentation,
        documentation,
        "The documentation expected and actual are not the same"
      );
    });
  });

  // Test Cases for async removeUser()
  describe("userData.removeUser(userID)", { skip: false }, (t) => {
    let createdUserId;
    beforeEach(async (t) => {
      firstName = "John";
      lastName = "Smith";
      email = "John@school.edu";
      username = "JohnS";
      hashedPassword = "jsocdjsycowjjoP";
      userType = "admin";
      listingHistory = [
        new ObjectId().toString(),
        new ObjectId().toString(),
        new ObjectId().toString(),
      ];
      favoritedListing = [new ObjectId().toString(), new ObjectId().toString()];
      documentation = [
        "103e1902898012/drivers-license",
        "103e1902898012/passport",
      ];
      let { _id } = await userData.createUser(
        firstName,
        lastName,
        email,
        username,
        hashedPassword,
        userType,
        listingHistory,
        favoritedListing,
        documentation
      );
      createdUserId = _id;
    });
    it("removeUser() -> removeUserEventValidSuccess", async (t) => {
      let removedUser = await userData.removeUser(createdUserId);
      // Assertions:
      assert.deepStrictEqual(
        Object.keys(removedUser).length,
        2,
        "The number of attributes returned is not 2"
      );
      assert.ok(
        removedUser instanceof Object && !(removedUser instanceof Array),
        "getAllUsers() first element is not an object"
      );
      assert.deepStrictEqual(
        removedUser._id,
        undefined,
        "The _id expected and actual are not the same"
      );
      assert.deepStrictEqual(
        removedUser.firstName,
        undefined,
        "The firstName expected and actual are not the same"
      );
      assert.deepStrictEqual(
        removedUser.lastName,
        undefined,
        "The lastName expected and actual are not the same"
      );
      assert.deepStrictEqual(
        removedUser.email,
        undefined,
        "The email expected and actual are not the same"
      );
      assert.deepStrictEqual(
        removedUser.username,
        username.trim(),
        "The username expected and actual are not the same"
      );
      assert.deepStrictEqual(
        removedUser.hashedPassword,
        undefined,
        "The hashedPassword expected and actual are not the same"
      );
      assert.deepStrictEqual(
        removedUser.userType,
        undefined,
        "The userType expected and actual are not the same"
      );
      assert.deepStrictEqual(
        removedUser.listingHistory,
        undefined,
        "The listingHistory expected and actual are not the same"
      );
      assert.deepStrictEqual(
        removedUser.favoritedListing,
        undefined,
        "The favoritedListing expected and actual are not the same"
      );
      assert.deepStrictEqual(
        removedUser.documentation,
        undefined,
        "The documentation expected and actual are not the same"
      );
    });
    it("removeUser() -> removeUserEventNotFoundFail", async (t) => {
      let wrongObjectId = new ObjectId();
      await assert.rejects(
        userData.removeUser(wrongObjectId.toString()),
        {
          message: `Unable to delete event ${wrongObjectId} from collection.`,
        },
        "Exception/Error should have been thrown"
      );
    });
    it("removeUser() -> removeUserInvalidObkectId", async (t) => {
      let invalidObjectId = "invalidId";
      await assert.rejects(
        userData.removeUser(invalidObjectId),
        {
          message: "invalid object ID",
        },
        "Exception/Error should have been thrown"
      );
    });
  });
  describe("userData.updateUser()", { skip: false }, (t) => {
    // beforeEach() is run before each test in a describe()
    beforeEach(async (t) => {
      userId = "";
      firstName = "John";
      lastName = "Smith";
      email = "John@school.edu";
      username = "JohnS";
      hashedPassword = "jsocdjsycowjjoP";
      userType = "admin";
      listingHistory = [
        new ObjectId().toString(),
        new ObjectId().toString(),
        new ObjectId().toString(),
      ];
      favoritedListing = [new ObjectId().toString(), new ObjectId().toString()];
      documentation = [
        "103e1902898012/drivers-license",
        "103e1902898012/passport",
      ];
      originalUser = await userData.createUser(
        firstName,
        lastName,
        email,
        username,
        hashedPassword,
        userType,
        listingHistory,
        favoritedListing,
        documentation
      );
    });
    it("updateUser() -> ValidInputValuesWithSpacesSuccess", async (t) => {
      userId = `\t  \n ${originalUser._id} \t\t\n   `;
      firstName = `\t  \n ${firstName} \t\t\n   `;
      lastName = `\t  \n ${lastName} \t\t\n   `;
      email = `\t  \n ${email} \t\t\n   `;
      username = `\t  \n ${username} \t\t\n   `;
      hashedPassword = `\t  \n ${hashedPassword} \t\t\n   `;
      userType = `\t  \n ${userType} \t\t\n   `;
      listingHistory = listingHistory.map((element) => {
        return `\t  \n ${element} \t\t\n   `;
      });
      favoritedListing = favoritedListing.map((element) => {
        return `\t  \n ${element} \t\t\n   `;
      });
      documentation = documentation.map((element) => {
        return `\t  \n ${element} \t\t\n   `;
      });
      const updatedUser = await userData.updateUser(
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
      );
      // Assertions:
      assert.ok(
        updatedUser instanceof Object && !(updatedUser instanceof Array),
        "updateEvent() element returned is not an object"
      );
      assert.deepStrictEqual(
        Object.keys(updatedUser).length,
        10,
        "The number of attributes returned is not 10"
      );
      assert.ok(
        ObjectId.isValid(updatedUser._id),
        "The user _id created is not valid"
      );
      assert.deepStrictEqual(
        updatedUser.firstName,
        firstName.trim(),
        "The firstName expected and actual are not the same"
      );
      assert.deepStrictEqual(
        updatedUser.lastName,
        lastName.trim(),
        "The lastName expected and actual are not the same"
      );
      assert.deepStrictEqual(
        updatedUser.email,
        email.trim(),
        "The email expected and actual are not the same"
      );
      assert.deepStrictEqual(
        updatedUser.username,
        username.trim(),
        "The username expected and actual are not the same"
      );
      assert.deepStrictEqual(
        updatedUser.hashedPassword,
        hashedPassword.trim(),
        "The hashedPassword expected and actual are not the same"
      );
      assert.deepStrictEqual(
        updatedUser.userType,
        userType.trim(),
        "The userType expected and actual are not the same"
      );
      assert.ok(
        updatedUser.listingHistory instanceof Object &&
          updatedUser.listingHistory instanceof Array,
        "updateEvent() element listingHistory returned is not an array"
      );
      assert.deepStrictEqual(
        updatedUser.listingHistory,
        listingHistory,
        "The listingHistory expected and actual are not the same"
      );
      assert.ok(
        updatedUser.favoritedListing instanceof Object &&
          updatedUser.favoritedListing instanceof Array,
        "updateEvent() element favoritedListing returned is not an array"
      );
      assert.deepStrictEqual(
        updatedUser.favoritedListing,
        favoritedListing,
        "The favoritedListing expected and actual are not the same"
      );
      assert.ok(
        updatedUser.documentation instanceof Object &&
          updatedUser.documentation instanceof Array,
        "updateEvent() element documentation returned is not an array"
      );
      assert.deepStrictEqual(
        updatedUser.documentation,
        documentation,
        "The documentation expected and actual are not the same"
      );
    });
    it("updateUser() -> NoParamsPassedFail", async (t) => {
      await assert.rejects(
        userData.updateUser(),
        { message: "Missing one or more required parameters" },
        "Exception/Error should have been thrown"
      );
    });
    it("updateUser() -> firstNameMissingFail", async (t) => {
      await assert.rejects(
        userData.updateUser(
          originalUser._id,
          lastName,
          email,
          username,
          hashedPassword,
          userType,
          listingHistory,
          favoritedListing,
          documentation
        ),
        { message: "Missing one or more required parameters" },
        "Exception/Error should have been thrown"
      );
    });
    it("updateUser() -> objectIdInvalidTypeFail", async (t) => {
      let badObjId = "invalid obj id";
      await assert.rejects(
        userData.updateUser(
          badObjId,
          firstName,
          lastName,
          email,
          username,
          hashedPassword,
          userType,
          listingHistory,
          favoritedListing,
          documentation
        ),
        {
          message: "invalid object ID",
        },
        "Exception/Error should have been thrown"
      );
    });
    it("updateUser() -> wrongObjectIdTypeFail", async (t) => {
      let wrongObjectId = new ObjectId();
      await assert.rejects(
        userData.updateUser(
          wrongObjectId.toString(),
          firstName,
          lastName,
          email,
          username,
          hashedPassword,
          userType,
          listingHistory,
          favoritedListing,
          documentation
        ),
        {
          message: `Could not update the user ${wrongObjectId} of the Users Collection`,
        },
        "Exception/Error should have been thrown"
      );
    });
    it("updateUser() -> firstNameInvalidTypeFail", async (t) => {
      firstName = 55;
      await assert.rejects(
        userData.updateUser(
          originalUser._id,
          firstName,
          lastName,
          email,
          username,
          hashedPassword,
          userType,
          listingHistory,
          favoritedListing,
          documentation
        ),
        {
          message: `The value ${
            firstName || "passed in"
          } is not a valid string`,
        },
        "Exception/Error should have been thrown"
      );
    });
    it("updateUser() -> lastNameInvalidTypeFail", async (t) => {
      lastName = 55;
      await assert.rejects(
        userData.updateUser(
          originalUser._id,
          firstName,
          lastName,
          email,
          username,
          hashedPassword,
          userType,
          listingHistory,
          favoritedListing,
          documentation
        ),
        {
          message: `The value ${lastName || "passed in"} is not a valid string`,
        },
        "Exception/Error should have been thrown"
      );
    });
    it("updateUser() -> emailNotValidFail", async (t) => {
      email = "myemail.email@kiko";
      await assert.rejects(
        userData.updateUser(
          originalUser._id,
          firstName,
          lastName,
          email,
          username,
          hashedPassword,
          userType,
          listingHistory,
          favoritedListing,
          documentation
        ),
        {
          message: `The email address provided (${email}) is not a valid email address`,
        },
        "Exception/Error should have been thrown"
      );
    });
    it("updateUser() -> usernameInvalidTypeFail", async (t) => {
      username = 55;
      await assert.rejects(
        userData.updateUser(
          originalUser._id,
          firstName,
          lastName,
          email,
          username,
          hashedPassword,
          userType,
          listingHistory,
          favoritedListing,
          documentation
        ),
        {
          message: `The value ${username || "passed in"} is not a valid string`,
        },
        "Exception/Error should have been thrown"
      );
    });
    it("updateUser() -> hashedPasswordInvalidTypeFail", async (t) => {
      hashedPassword = 55;
      await assert.rejects(
        userData.updateUser(
          originalUser._id,
          firstName,
          lastName,
          email,
          username,
          hashedPassword,
          userType,
          listingHistory,
          favoritedListing,
          documentation
        ),
        {
          message: `The value ${
            hashedPassword || "passed in"
          } is not a valid string`,
        },
        "Exception/Error should have been thrown"
      );
    });
    it("updateUser() -> userTypeInvalidTypeFail", async (t) => {
      userType = "John";
      let acceptedTypes = ["admin", "realtor", "general", "guest"];
      await assert.rejects(
        userData.updateUser(
          originalUser._id,
          firstName,
          lastName,
          email,
          username,
          hashedPassword,
          userType,
          listingHistory,
          favoritedListing,
          documentation
        ),
        {
          message: `userType ${userType} is not an accepted type. ${acceptedTypes.toString()}`,
        },
        "Exception/Error should have been thrown"
      );
    });
    it("updateUser() -> listingHistoryInvalidTypeFail", async (t) => {
      let badObjId = 55;
      listingHistory = [
        new ObjectId().toString(),
        badObjId,
        new ObjectId().toString(),
      ];
      await assert.rejects(
        userData.updateUser(
          originalUser._id,
          firstName,
          lastName,
          email,
          username,
          hashedPassword,
          userType,
          listingHistory,
          favoritedListing,
          documentation
        ),
        {
          message: `Id provided must be a string`,
        },
        "Exception/Error should have been thrown"
      );
    });
    it("updateUser() -> favoritedListingInvalidTypeFail", async (t) => {
      let badObjId = 55;
      favoritedListing = [new ObjectId().toString(), badObjId];
      await assert.rejects(
        userData.updateUser(
          originalUser._id,
          firstName,
          lastName,
          email,
          username,
          hashedPassword,
          userType,
          listingHistory,
          favoritedListing,
          documentation
        ),
        {
          message: `Id provided must be a string`,
        },
        "Exception/Error should have been thrown"
      );
    });
    it("updateUser() -> documentationInvalidTypeFail", async (t) => {
      let badObjId = 55;
      documentation = ["103e1902898012/drivers-license", badObjId];
      await assert.rejects(
        userData.updateUser(
          originalUser._id,
          firstName,
          lastName,
          email,
          username,
          hashedPassword,
          userType,
          listingHistory,
          favoritedListing,
          documentation
        ),
        {
          message: `The value ${badObjId || "passed in"} is not a valid string`,
        },
        "Exception/Error should have been thrown"
      );
    });
  });
});
