import { ObjectId } from "mongodb";

const validateMethods = {
  verifyId(id) {
    if (!id) throw new Error("Please provide an Id for the search");
    if (typeof id !== "string") throw new Error("Id provided must be a string");
    if (id.trim().length === 0)
      throw new Error("Id cannot be empty or just spaces");
    id = id.trim();
    if (!ObjectId.isValid(id)) throw new Error("invalid object ID");

    return id;
  },
  verifyUpdateString(str, minimumLength, maximumLength) {
    if (!str)
      throw new Error(`The value ${str || "passed in"} is not a valid string`);
    if (typeof str !== "string")
      throw new Error(`The value ${str || "passed in"} is not a valid string`);
    str = str.trim();
    if (str === 0) throw new Error("The input cannot be empty or just spaces");

    if (Number.isInteger(minimumLength)) {
      if (str < minimumLength)
        throw new Error(
          `The new value must have at least ${minimumLength} characters`
        );
    }
    if (Number.isInteger(maximumLength)) {
      if (str > maximumLength)
        throw new Error(
          `The new value must have at most ${minimumLength} characters`
        );
    }
    return str;
  },
  verifyPrice(price) {
    if (!price)
      throw new Error(
        "Please enter the price of admission, if free please enter 0"
      );
    if (typeof price !== "number")
      throw new Error("Please enter a number for price of admission");
    price = Number(price.toFixed(2));
    return price;
  },
  verifyEmail(email) {
    if (!email) throw new Error("Please provide an email address");
    if (typeof email !== "string")
      throw new Error("email must be entered as a string");
    if (email.trim().length === 0)
      throw new Error(
        "email cannot be empty or just contain spaces, Please provide an email address"
      );
    email = email.trim();
    let emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailFormat.test(email))
      throw new Error(
        `The email address provided (${email}) is not a valid email address`
      );

    return email;
  },
  verifyLocation(location) {
    if (!location) throw new Error("please provide location information");
    if (typeof location !== "object")
      throw new Error("location must be an object with location details");
    let stateCheck = /^[a-zA-Z][a-zA-Z]$/;
    let zipCheck = /^[0-9][0-9][0-9][0-9][0-9]$/;

    //object deconstruction: setting variables for object
    let { streetAddress, city, state, zip } = location;

    if (!streetAddress) throw new Error("Please provide the address");
    streetAddress = streetAddress.trim();
    if (typeof streetAddress != "string")
      throw new Error("Address must be a string");
    if (streetAddress.trim().length === 0)
      throw new Error(
        "Please provide an address it cannot be empty or just spaces"
      );
    if (streetAddress.trim().length < 3)
      throw new Error("Address cannot be less than 3 characters");

    if (!city) throw new Error("Please provide the city");
    city = city.trim();
    if (typeof city != "string") throw new Error("City must be a string");
    if (city.trim().length === 0)
      throw new Error(
        "Please provide a city it cannot be empty or just spaces"
      );
    if (city.trim().length < 3)
      throw new Error("City cannot be less than 3 characters");

    if (!state) throw new Error("Please provide the state");
    state = state.trim();
    if (typeof state != "string") throw new Error("State must be a string");
    if (state.trim().length === 0)
      throw new Error(
        "Please provide a state it cannot be empty or just spaces"
      );
    if (!stateCheck.test(state))
      throw new Error("Please provide state in appreviated form");
    state = state.toUpperCase();

    if (!zip) throw new Error("Please provide the zip code");
    zip = zip.trim();
    if (typeof zip != "string")
      throw new Error("The zip code must be a string");
    if (zip.trim().length === 0)
      throw new Error(
        "Please provide the the zip code, it cannot be empty or just spaces"
      );
    if (!zipCheck.test(zip))
      throw new Error(
        "Invalid zip code, must provide a 5-digit zip code as a string"
      );

    location = {
      streetAddress: streetAddress,
      city: city,
      state: state,
      zip: zip,
    };

    return location;
  },
  // USER SECTION
  verifyUserType(userType) {
    if (!userType) throw new Error("Please provide an userType address");
    if (typeof userType !== "string")
      throw new Error("userType must be entered as a string");
    userType = userType.trim();
    if (userType.length === 0)
      throw new Error(
        "userType cannot be empty or just contain spaces, Please provide an userType"
      );
    let acceptedTypes = ["admin", "realtor", "general", "guest"];
    if (!acceptedTypes.includes(userType))
      throw new Error(
        `userType ${userType} is not an accepted type. ${acceptedTypes.toString()}`
      );

    return userType;
  },
  verifyListingHistory(listingHistory) {
    if (!(listingHistory instanceof Object && listingHistory instanceof Array))
      throw new Error(`listingHistory must be an array`);
    for (let index in listingHistory) {
      listingHistory[index] = this.verifyId(listingHistory[index]);
    }
    return listingHistory;
  },
  verifyFavoritedListing(favoritedListing) {
    if (
      !(favoritedListing instanceof Object && favoritedListing instanceof Array)
    )
      throw new Error(`favoritedListing must be an array`);
    for (let index in favoritedListing) {
      favoritedListing[index] = this.verifyId(favoritedListing[index]);
    }
    return favoritedListing;
  },
  verifyDocumentation(documentation) {
    if (!(documentation instanceof Object && documentation instanceof Array))
      throw new Error(`documentation must be an array`);
    for (let index in documentation) {
      documentation[index] = this.verifyUpdateString(documentation[index]);
    }
    return documentation;
  },
};

export default validateMethods;
