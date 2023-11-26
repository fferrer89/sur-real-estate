import {ObjectId} from "mongodb";
import {STATES, DATA_TYPES} from './constants.js';
import {dbSchemas} from "./object-schemas.js";

const validation = {
  // Number type validations
  number(varName=validation.isRequired('varVal'),
         varVal=validation.isRequired('varVal'),
         canBeNegative=true) {
    if (varVal === undefined) {
      throw new TypeError(`${varName} must be provided`);
    }
    if (typeof varVal !== DATA_TYPES.NUMBER || isNaN(varVal) || !isFinite(varVal)) {
      throw new TypeError(`${varName} must be a number`);
    }
    if (varVal < 0 && (!canBeNegative)) {
      throw new RangeError(`${varName} cannot be a negative number`);
    }
    return varVal;
  },
  listingPriceRange(minPriceVal=validation.isRequired('minPriceVal'),
                    maxPriceVal=validation.isRequired('maxPriceVal')) {
      let minPrice = this.number('minPrice', minPriceVal, false);
      let maxPrice = this.number('maxPrice', maxPriceVal, false);
      if (minPrice > maxPrice) {
        throw new RangeError(`minPrice must be smaller or equal to maxPrice`);
      }
      return {minPrice, maxPrice};
  },
  listingSqftRange(minSqftVal=validation.isRequired('minSqftVal'),
                   maxSqftVal=validation.isRequired('maxSqftVal')) {
    let minSqft = this.number('minSqft', minSqftVal, false);
    let maxSqft = this.number('maxSqft', maxSqftVal, false);
    if (minSqft > maxSqft) {
      throw new RangeError(`minSqft must be smaller or equal to maxSqft`);
    }
    return {minSqft, maxSqft};
  },

  // Boolean type validations
  boolean(varName=validation.isRequired('varName'),
          varVal=validation.isRequired('varVal')) {
    if (varVal === undefined) {
      throw new TypeError(`${varName} must be provided`);
    }
    if (typeof varVal !== DATA_TYPES.BOOLEAN) {
      throw new TypeError(`${varName} must be a boolean (true or false)`);
    }
    return varVal;
  },
  booleanString(varName=validation.isRequired('varName'),
                varVal=validation.isRequired('varVal')) {
    if (varVal === undefined) {
      throw new TypeError(`${varName} must be provided`);
    }
    if (typeof varVal !== DATA_TYPES.STRING) {
      throw new TypeError(`${varName} must be a string`);
    }
    varVal = varVal.trim();
    if (!(varVal === 'true' || varVal === 'false')) {
      throw new TypeError(`Value of ${varName} must be either true or false)`);
    }
    return varVal === 'true';
  },

  // String type validations
  string(varName=validation.isRequired('varName'),
         varVal=validation.isRequired('varVal')) {
    if (varVal === undefined) {
      throw new TypeError(`${varName} must be provided`);
    }
    if (typeof varVal !== DATA_TYPES.STRING) {
      throw new TypeError(`${varName} must be a string`);
    }
    if (varVal.trim() === '') {
      throw new RangeError(`${varName} can not be an empty string`);
    }
    return varVal.trim();
  },

  // Object type validations
  /**
   * Takes {@link objVal} and validates that it is a valid object and that is properties are valid, according to the
   * object schema specified in {@link objProperties}. Available data types are boolean, number, string, array, object,
   * and bsonObjectId.
   *
   * Correct example of {@link objVal}:
   *  {
   *     listPrice: 44444999.7,
   *     location: {
   *     address: 'Broadway Street',
   *     number: 1502,
   *     zip: '60617',
   *     state: 'IL',
   *     city: 'Chicago'
   *     },
   *   numBeds: 3,
   *   hasGarage: true,
   *   hasTerrace: false,
   *   listingVisitors: ['103e1902898012', '0aswd780aac09', '0a98cf0as9fs0'],
   *   photos: ['103e1902898012/terrace', '103e1902898012/room1', '0a98cf0as9fs0/mainRoom']
   *  };
   *
   * Correct example of {@link objProperties}:
   *  {
   *     listPrice: {type: 'number', isRequired: true},
   *     location: {
   *       type: 'object',
   *       isRequired:true,
   *       properties: {
   *         address: {type: 'string', isRequired: true},
   *         number: {type: 'number', isRequired: false},
   *         zip: {type: 'string', isRequired: true},
   *         state: {type: 'string', isRequired: true},
   *         city: {type: 'string', isRequired: true}}
   *     },
   *     numBeds: {type: 'number', isRequired: true},
   *     hasGarage: {type: 'boolean', isRequired: false},
   *     hasTerrace: {type: 'boolean', isRequired: true},
   *     listingVisitors: {
   *       type: 'array',
   *       isRequired: true,
   *       elementsType: 'string'
   *     },
   *     photos: {
   *       type: 'array',
   *       isRequired: false,
   *       elementsType: 'string'
   *     },
   *  };
   *
   * @param {string} objName the object variable name
   * @param {Object} objVal the object to be validated, which can be an empty object
   * @param {Object} objProperties the schema that {@link objVal} must follow
   * @return {{}} the original object whose elements have been trimmed and checked for validity
   */
  object(objName=validation.isRequired('objName'),
         objVal=validation.isRequired('objVal'),
         objProperties=validation.isRequired('objProperties')) {
    if (objVal === undefined) {
      throw new TypeError(`${objName} must be provided`);
    }
    if (!(objVal instanceof Object) || objVal instanceof Array) {
      throw new TypeError(`${objName} must be an object`);
    }
    Object.entries(objProperties).forEach(([key, value]) => {
      if (value.isRequired) {
        if (objVal[key] === undefined) {
          throw new TypeError(`${key} must be provided`);
        }
      }
    })
    let object = {}; // Copy of the original object with its properties trimmed and checked for validity
    Object.entries(objVal).forEach(([key, value]) => {
      let propertyInfo = objProperties[key];
      if (propertyInfo === undefined) {
        throw new TypeError(`${key} is not a valid property for ${objName}`);
      }
      if (propertyInfo.type === DATA_TYPES.BOOLEAN) {
        object[key] = this.boolean(key, value);
      } else if (propertyInfo.type === DATA_TYPES.NUMBER) {
        object[key] = this.number(key, value);
      } else if (propertyInfo.type === DATA_TYPES.STRING) {
        object[key] = this.string(key, value);
      } else if (propertyInfo.type === DATA_TYPES.ARRAY) {
        object[key] = this.array(key, value, propertyInfo.elementsType);
      } else if (propertyInfo.type === DATA_TYPES.OBJECT) {
        object[key] = this.object(key, value, propertyInfo.properties);
      } else if (propertyInfo.type === DATA_TYPES.BSON_OBJECT_ID) {
        object[key] = this.bsonObjectId(value);
      } else {
        throw new Error(`${propertyInfo.type} is an unrecognized data type. Available data types are ${DATA_TYPES.BOOLEAN}, ${DATA_TYPES.NUMBER}, ${DATA_TYPES.STRING}, ${DATA_TYPES.ARRAY}, ${DATA_TYPES.OBJECT}, and ${DATA_TYPES.BSON_OBJECT_ID}`);
      }
    })
    return object;
  },

  address(varName=validation.isRequired('varName'),
          varVal=validation.isRequired('varVal')) {
    const properties =  dbSchemas.listing.location.properties;
    varVal = this.object(varName, varVal, properties);
    if(!STATES.includes(varVal.state)) {
      throw new RangeError(`${varName}.state must be a two-letter state abbreviation in capital letters, such as "NY" or "NJ"`);
    }
    return varVal;
  },

  // Array type validations
  /**
   * Takes {@link arrayVal} and validates that it is a valid array and that all its elements have the correct data type.
   *
   * This validation function can only take an array whose elements are of the same primitive data type (boolean, number,
   * string, bsonObjectId).The original array can contain one or more elements whose data type is an Array, but the
   * inner array data type elements must be the same data type as the outer array elements.
   *
   * Correct examples of {@link arrayVal}:
   * - ['John', 'Mary', 'Lui', ['Frank', 'Jonas']];
   * - [true, false, false]
   * - [11.1, [9, 99.1, 3], 7]
   * - []
   *
   * @param {string} arrayName the array variable name
   * @param {*[]} arrayVal the array to be validated whose elements have the same data type
   * @param {string} elementsType  the data type of the array elements, which must be unique for all the elements
   * @return {*[]} the original array whose elements have been trimmed and checked for validity
   */
  array(arrayName=validation.isRequired('arrayName'),
        arrayVal=validation.isRequired('arrayVal'),
        elementsType=validation.isRequired('elementsType')) {
    if (arrayVal === undefined) {
      throw new TypeError(`${arrayName} must be provided`);
    }
    if (!(arrayVal instanceof Array)) {
      throw new TypeError(`${arrayName} must be an array`);
    }
    let array = []; // Copy of the original array with its elements trimmed and checked for validity
    const ERROR_MESSAGE_TYPE = `All elements in ${arrayName}`
    arrayVal.forEach((element) => {

      if (element instanceof Array) {
        array.push(this.array(arrayName.concat('-inner'), element, elementsType));
      } else if (elementsType === DATA_TYPES.BOOLEAN) {
        array.push(this.boolean(ERROR_MESSAGE_TYPE, element));
      } else if (elementsType === DATA_TYPES.NUMBER) {
        array.push(this.number(ERROR_MESSAGE_TYPE, element));
      } else if (elementsType === DATA_TYPES.STRING) {
        array.push(this.string(ERROR_MESSAGE_TYPE, element));
      } else if (elementsType === DATA_TYPES.BSON_OBJECT_ID) {
        array.push(this.bsonObjectId(element, ERROR_MESSAGE_TYPE));
      } else {
        throw new Error(`${elementsType} is an unrecognized data type. Available data types are boolean, number, string, array, and object`);
      }
    })
    return array;

  },

  // Other validations
  bsonObjectId(id=validation.isRequired('id'),
               varName='_id') {
    if (id === undefined) {
      throw new TypeError(`${varName} must be provided`);
    }
    if (!ObjectId.isValid(id)) {
      throw new TypeError(`${varName} must be a valid bson ObjectId`);
    }
    return id
  },
  /**
   *
   * @param varName
   * @return {*}
   */
  isRequired: (varName) => {
    throw new TypeError(`${varName} is required`)
  },
};
export default validation;