// FIXME: This file is an example of how we are going to do our testing

import {describe, it, beforeEach, before, afterEach, after} from 'node:test';
import assert from 'node:assert/strict'
import {eventsDataFun} from '../../data/index.js';
import {closeConnection, dbConnection} from "../../config/mongoConnection.js";
import eventsSetting from 'events';
import {ObjectId} from 'mongodb';
// it() -> To create a new test
// describe() -> To create a new test suite

eventsSetting.EventEmitter.defaultMaxListeners = 100; //

// Test Cases for async event()
describe('eventsTestSuit', {skip: true}, (t) => {
    let eventName, eventDescription, eventLocation, contactEmail, maxCapacity, priceOfAdmission, eventDate, startTime,
        endTime, publicEvent, attendees, totalNumberOfAttendees;
    // beforeEach() is run before each test in a describe()
    beforeEach(async () => {
        const db = await dbConnection();
        await db.dropDatabase(); // clearing the database
    });
    // after() is run once after all the tests in a describe()
    after(async () => {
        await closeConnection();
    });

    // Test Cases for async create()
    describe('event.create()',   {skip: false}, (t) => {
        // beforeEach() is run before each test in a describe()
        beforeEach(async (t) => {
            eventName = 'Patrick\'s Big End of Summer BBQ';
            eventDescription = 'come join us for our yearly end of summer bbq!';
            eventLocation = {streetAddress: "abc", city: "abc", state: "NJ", zip: "07030"};
            contactEmail = 'phill@stevens.edu';
            maxCapacity = 30;
            priceOfAdmission = 0;
            eventDate = '08/25/2050';
            startTime = '2:00 PM';
            endTime = '2:30 PM';
            publicEvent = false;
            attendees = [];
            totalNumberOfAttendees = 0;
        });
        it('createEvent() -> ValidInputValuesWithSpacesSuccess',  async (t) => {
            eventName = '\t\t\n'.concat(eventName, '\n\t ');
            eventDescription = '  '.concat(eventDescription, '      ');
            Object.keys(eventLocation).forEach(key => eventLocation[key] = '\t'.concat(eventLocation[key], '   '));
            contactEmail = '\t\t\n'.concat(contactEmail, '\n\t ');
            eventDate = '\t\t\n'.concat(eventDate, '\n\t ');
            startTime = '\t\t\n'.concat(startTime, '\n\t ');
            endTime = '\t\t\n'.concat(endTime, '\n\t ');
            const patrickBBQ = await eventsDataFun.create(eventName, eventDescription, eventLocation, contactEmail, maxCapacity,
                priceOfAdmission, eventDate, startTime, endTime, publicEvent);
            // Assertions:
            assert.ok(patrickBBQ instanceof Object && !(patrickBBQ instanceof Array),
                'createEvent() element returned is not an object');
            assert.deepStrictEqual(Object.keys(patrickBBQ).length, 13, 'The number of attributes returned is not 13');
            assert.ok(ObjectId.isValid(patrickBBQ._id), 'The event _id created is not valid');
            assert.deepStrictEqual(patrickBBQ.eventName, eventName.trim(),
                'The eventName expected and actual are not the same');
            assert.deepStrictEqual(patrickBBQ.description, eventDescription.trim(),
                'The eventDescription expected and actual are not the same');
            assert.ok(patrickBBQ.eventLocation instanceof Object && !(patrickBBQ.eventLocation instanceof Array),
                'createEvent() element returned is not an object');
            assert.deepStrictEqual(Object.keys(patrickBBQ.eventLocation).length, 4, 'The number of eventLocation attributes returned is not 4');
            assert.deepStrictEqual(patrickBBQ.eventLocation.streetAddress, eventLocation.streetAddress.trim(),
                'The eventLocation.streetAddress expected and actual are not the same');
            assert.deepStrictEqual(patrickBBQ.eventLocation.city, eventLocation.city.trim(),
                'The eventLocation.city expected and actual are not the same');
            assert.deepStrictEqual(patrickBBQ.eventLocation.state, eventLocation.state.trim(),
                'The eventLocation.state expected and actual are not the same');
            assert.deepStrictEqual(patrickBBQ.eventLocation.zip, eventLocation.zip.trim(),
                'The eventLocation.zip expected and actual are not the same');
            assert.deepStrictEqual(patrickBBQ.contactEmail, contactEmail.trim(),
                'The contactEmail expected and actual are not the same');
            assert.deepStrictEqual(patrickBBQ.maxCapacity, maxCapacity,
                'The maxCapacity expected and actual are not the same');
            assert.deepStrictEqual(patrickBBQ.priceOfAdmission, priceOfAdmission,
                'The priceOfAdmission expected and actual are not the same');
            assert.deepStrictEqual(patrickBBQ.eventDate, eventDate.trim(),
                'The eventDate expected and actual are not the same');
            assert.deepStrictEqual(patrickBBQ.startTime, startTime.trim(),
                'The startTime expected and actual are not the same');
            assert.deepStrictEqual(patrickBBQ.endTime, endTime.trim(),
                'The endTime expected and actual are not the same');
            assert.deepStrictEqual(patrickBBQ.attendees, attendees,
                'The attendees expected and actual are not the same');
            assert.deepStrictEqual(patrickBBQ.totalNumberOfAttendees, totalNumberOfAttendees,
                'The totalNumberOfAttendees expected and actual are not the same');
        });
        it('createEvent() -> ValidInputValuesWithDatesDiffSuccess',  async (t) => {
            eventName  = 'hello World';
            eventDescription = 'barbaquie at kiko in the afternoon';
            eventLocation.state = 'MA';
            eventLocation.zip = '99999'
            contactEmail = 'hello@google.com';
            maxCapacity = 1;
            priceOfAdmission = 200000.3;
            eventDate = '01/01/2035';
            startTime = '1:01 AM';
            endTime = '1:01 PM';
            publicEvent = true;
            const mike = await eventsDataFun.create(eventName, eventDescription, eventLocation, contactEmail, maxCapacity,
                priceOfAdmission, eventDate, startTime, endTime, publicEvent);
            // Assertions:
            assert.ok(mike instanceof Object && !(mike instanceof Array),
                'createEvent() element returned is not an object');
            assert.deepStrictEqual(Object.keys(mike).length, 13, 'The number of attributes returned is not 13');
            assert.ok(ObjectId.isValid(mike._id), 'The event _id created is not valid');
            assert.deepStrictEqual(mike.eventName, eventName.trim(),
                'The eventName expected and actual are not the same');
            assert.deepStrictEqual(mike.description, eventDescription.trim(),
                'The eventDescription expected and actual are not the same');
            assert.ok(mike.eventLocation instanceof Object && !(mike.eventLocation instanceof Array),
                'createEvent() element returned is not an object');
            assert.deepStrictEqual(Object.keys(mike.eventLocation).length, 4, 'The number of eventLocation attributes returned is not 4');
            assert.deepStrictEqual(mike.eventLocation.streetAddress, eventLocation.streetAddress.trim(),
                'The eventLocation.streetAddress expected and actual are not the same');
            assert.deepStrictEqual(mike.eventLocation.city, eventLocation.city.trim(),
                'The eventLocation.city expected and actual are not the same');
            assert.deepStrictEqual(mike.eventLocation.state, eventLocation.state.trim(),
                'The eventLocation.state expected and actual are not the same');
            assert.deepStrictEqual(mike.eventLocation.zip, eventLocation.zip.trim(),
                'The eventLocation.zip expected and actual are not the same');
            assert.deepStrictEqual(mike.contactEmail, contactEmail.trim(),
                'The contactEmail expected and actual are not the same');
            assert.deepStrictEqual(mike.maxCapacity, maxCapacity,
                'The maxCapacity expected and actual are not the same');
            assert.deepStrictEqual(mike.priceOfAdmission, priceOfAdmission,
                'The priceOfAdmission expected and actual are not the same');
            assert.deepStrictEqual(mike.eventDate, eventDate.trim(),
                'The eventDate expected and actual are not the same');
            assert.deepStrictEqual(mike.startTime, startTime.trim(),
                'The startTime expected and actual are not the same');
            assert.deepStrictEqual(mike.endTime, endTime.trim(),
                'The endTime expected and actual are not the same');
            assert.deepStrictEqual(mike.publicEvent, publicEvent,
                'The publicEvent expected and actual are not the same');
            assert.deepStrictEqual(mike.attendees, attendees,
                'The attendees expected and actual are not the same');
            assert.deepStrictEqual(mike.totalNumberOfAttendees, totalNumberOfAttendees,
                'The totalNumberOfAttendees expected and actual are not the same');
        });
        it('createEvent() -> NoParamsPassedFail',  async (t) => {
            eventName = 55;
            await assert.rejects(eventsDataFun.create(),
                {
                    name: 'TypeError',
                    message: /missing one or more required parameters/
                }, 'Exception/Error should have been thrown');
        });
        it('createEvent() -> eventNameMissingFail',  async (t) => {
            eventName = 55;
            await assert.rejects(eventsDataFun.create(eventDescription, eventLocation, contactEmail, maxCapacity,
                    priceOfAdmission, eventDate, startTime, endTime, publicEvent),
                {
                    name: 'TypeError',
                    message: /missing one or more required parameters/
                }, 'Exception/Error should have been thrown');
        });
        it('createEvent() -> eventNameInvalidTypeFail',  async (t) => {
            eventName = 55;
            await assert.rejects(eventsDataFun.create(eventName, eventDescription, eventLocation, contactEmail, maxCapacity,
                    priceOfAdmission, eventDate, startTime, endTime, publicEvent),
                {
                    name: 'TypeError',
                    message: /eventName must be a string/
                }, 'Exception/Error should have been thrown');
        });
        it('createEvent() -> eventDescriptionInvalidTypeFail',  async (t) => {
            eventDescription = true;
            await assert.rejects(eventsDataFun.create(eventName, eventDescription, eventLocation, contactEmail, maxCapacity,
                    priceOfAdmission, eventDate, startTime, endTime, publicEvent),
                {
                    name: 'TypeError',
                    message: /eventDescription must be a string/
                }, 'Exception/Error should have been thrown');
        });
        it('createEvent() -> contactEmailInvalidTypeFail',  async (t) => {
            contactEmail = [];
            await assert.rejects(eventsDataFun.create(eventName, eventDescription, eventLocation, contactEmail, maxCapacity,
                    priceOfAdmission, eventDate, startTime, endTime, publicEvent),
                {
                    name: 'TypeError',
                    message: /contactEmail must be a string/
                }, 'Exception/Error should have been thrown');
        });
        it('createEvent() -> eventDateInvalidTypeFail',  async (t) => {
            eventDate = new Date();
            await assert.rejects(eventsDataFun.create(eventName, eventDescription, eventLocation, contactEmail, maxCapacity,
                    priceOfAdmission, eventDate, startTime, endTime, publicEvent),
                {
                    name: 'TypeError',
                    message: /eventDate must be a string/
                }, 'Exception/Error should have been thrown');
        });
        it('createEvent() -> startTimeInvalidTypeFail',  async (t) => {
            startTime = 44.0;
            await assert.rejects(eventsDataFun.create(eventName, eventDescription, eventLocation, contactEmail, maxCapacity,
                    priceOfAdmission, eventDate, startTime, endTime, publicEvent),
                {
                    name: 'TypeError',
                    message: /startTime must be a string/
                }, 'Exception/Error should have been thrown');
        });
        it('createEvent() -> endTimeInvalidTypeFail',  async (t) => {
            endTime = null;
            await assert.rejects(eventsDataFun.create(eventName, eventDescription, eventLocation, contactEmail, maxCapacity,
                    priceOfAdmission, eventDate, startTime, endTime, publicEvent),
                {
                    name: 'TypeError',
                    message: /endTime must be a string/
                }, 'Exception/Error should have been thrown');
        });
        it('createEvent() -> eventNameLessThan5CharactersFail',  async (t) => {
            eventName = ' bcda';
            await assert.rejects(eventsDataFun.create(eventName, eventDescription, eventLocation, contactEmail, maxCapacity,
                    priceOfAdmission, eventDate, startTime, endTime, publicEvent),
                {
                    name: 'TypeError',
                    message: 'eventName must be more than 4 character long'
                }, 'Exception/Error should have been thrown');
        });
        it('createEvent() -> eventDescriptionLessThan25CharactersFail',  async (t) => {
            eventDescription = '  This event has less than  '; // 24 chars after trimming()
            await assert.rejects(eventsDataFun.create(eventName, eventDescription, eventLocation, contactEmail, maxCapacity,
                    priceOfAdmission, eventDate, startTime, endTime, publicEvent),
                {
                    name: 'TypeError',
                    message: 'eventDescription must be more than 24 character long'
                }, 'Exception/Error should have been thrown');
        });
        it('createEvent() -> contactEmailNotValidFail',  async (t) => {
            contactEmail = 'myemail.email@kiko';
            await assert.rejects(eventsDataFun.create(eventName, eventDescription, eventLocation, contactEmail, maxCapacity,
                    priceOfAdmission, eventDate, startTime, endTime, publicEvent),
                {
                    name: 'Error',
                    message: `The email address provided (${contactEmail}) is not a valid email address`
                }, 'Exception/Error should have been thrown');
        });
        it('createEvent() -> eventDateNotValidDayFail',  async (t) => {
            eventDate = '09/31/2024';
            await assert.rejects(eventsDataFun.create(eventName, eventDescription, eventLocation, contactEmail, maxCapacity,
                    priceOfAdmission, eventDate, startTime, endTime, publicEvent),
                {
                    name: 'RangeError',
                    message: `${eventDate} is not a valid date since there are not 31 days in Sept`
                }, 'Exception/Error should have been thrown');
        });
        it('createEvent() -> eventDateNotValidFormatFail',  async (t) => {
            eventDate = '09-31/2024';
            await assert.rejects(eventsDataFun.create(eventName, eventDescription, eventLocation, contactEmail, maxCapacity,
                    priceOfAdmission, eventDate, startTime, endTime, publicEvent),
                {
                    name: 'Error',
                    message: `${eventDate} is not in correct format. The date must be in MM/DD/YYYY format, such as "08/25/2024"`
                }, 'Exception/Error should have been thrown');
        });
        it('createEvent() -> eventDateNotValidMonthFormatFail',  async (t) => {
            eventDate = '9/31/2024'; // 24 chars after trimming()
            await assert.rejects(eventsDataFun.create(eventName, eventDescription, eventLocation, contactEmail, maxCapacity,
                    priceOfAdmission, eventDate, startTime, endTime, publicEvent),
                {
                    name: 'Error',
                    message: `${eventDate} is not in correct format. The date must be in MM/DD/YYYY format, such as "08/25/2024"`
                }, 'Exception/Error should have been thrown');
        });
        it('createEvent() -> eventDateNotValidDayFormatFail',  async (t) => {
            eventDate = '09/1/2024'; // 24 chars after trimming()
            await assert.rejects(eventsDataFun.create(eventName, eventDescription, eventLocation, contactEmail, maxCapacity,
                    priceOfAdmission, eventDate, startTime, endTime, publicEvent),
                {
                    name: 'Error',
                    message: `${eventDate} is not in correct format. The date must be in MM/DD/YYYY format, such as "08/25/2024"`
                }, 'Exception/Error should have been thrown');
        });
        it('createEvent() -> startTimeNotValidFormatFail',  async (t) => {
            startTime = '11:45PM';
            await assert.rejects(eventsDataFun.create(eventName, eventDescription, eventLocation, contactEmail, maxCapacity,
                    priceOfAdmission, eventDate, startTime, endTime, publicEvent),
                {
                    name: 'Error',
                    message: `${startTime} is not in correct format. Valid time must be in 12-hour AM/PM format, such as 11:30 PM`
                }, 'Exception/Error should have been thrown');
        });
        it('createEvent() -> startTimeNotValidFormat2Fail',  async (t) => {
            startTime = '11:45 pm';
            await assert.rejects(eventsDataFun.create(eventName, eventDescription, eventLocation, contactEmail, maxCapacity,
                    priceOfAdmission, eventDate, startTime, endTime, publicEvent),
                {
                    name: 'Error',
                    message: /not in correct format/
                }, 'Exception/Error should have been thrown');
        });
        it('createEvent() -> startTimeNotValidTimeFail',  async (t) => {
            startTime = '13:45 PM';
            await assert.rejects(eventsDataFun.create(eventName, eventDescription, eventLocation, contactEmail, maxCapacity,
                    priceOfAdmission, eventDate, startTime, endTime, publicEvent),
                {
                    name: 'Error',
                    message: /not in correct format/
                }, 'Exception/Error should have been thrown');
        });
        it('createEvent() -> endTimeNotValidFormat2Fail',  async (t) => {
            endTime = '11:45 am ';
            await assert.rejects(eventsDataFun.create(eventName, eventDescription, eventLocation, contactEmail, maxCapacity,
                    priceOfAdmission, eventDate, startTime, endTime, publicEvent),
                {
                    name: 'Error',
                    message: /not in correct format/
                }, 'Exception/Error should have been thrown');
        });
        it('createEvent() -> endTimeNotValidTimeFail',  async (t) => {
            endTime = '13:45 AM';
            await assert.rejects(eventsDataFun.create(eventName, eventDescription, eventLocation, contactEmail, maxCapacity,
                    priceOfAdmission, eventDate, startTime, endTime, publicEvent),
                {
                    name: 'Error',
                    message: /not in correct format/
                }, 'Exception/Error should have been thrown');
        });
        it('createEvent() -> endTimeEarlierThanStartTimeFail',  async (t) => {
            startTime = '9:01 PM';
            endTime = '9:00 PM';
            await assert.rejects(eventsDataFun.create(eventName, eventDescription, eventLocation, contactEmail, maxCapacity,
                    priceOfAdmission, eventDate, startTime, endTime, publicEvent),
                {
                    name: 'RangeError',
                    message: 'Events cannot start after they have ended'
                }, 'Exception/Error should have been thrown');
        });
        it('createEvent() -> eventLessThan30MinutesFail2',  async (t) => {
            // endTime should be at least 30 minutes later than the startTime
            startTime = '8:59 PM';
            endTime = '9:28 PM';
            await assert.rejects(eventsDataFun.create(eventName, eventDescription, eventLocation, contactEmail, maxCapacity,
                    priceOfAdmission, eventDate, startTime, endTime, publicEvent),
                {
                    name: 'RangeError',
                    message: 'The endTime should be at least 30 minutes later than the startTime'
                }, 'Exception/Error should have been thrown');
        });
        it('createEvent() -> eventLessThan30MinutesFail',  async (t) => {
            // endTime should be at least 30 minutes later than the startTime
            startTime = '11:55 AM';
            endTime = '12:00 PM';
            await assert.rejects(eventsDataFun.create(eventName, eventDescription, eventLocation, contactEmail, maxCapacity,
                    priceOfAdmission, eventDate, startTime, endTime, publicEvent),
                {
                    name: 'RangeError',
                    message: 'The endTime should be at least 30 minutes later than the startTime'
                }, 'Exception/Error should have been thrown');
        });
        it('createEvent() -> publicEventNotValidTypeFail',  async (t) => {
            // endTime should be at least 30 minutes later than the startTime
            publicEvent = 'true';
            await assert.rejects(eventsDataFun.create(eventName, eventDescription, eventLocation, contactEmail, maxCapacity,
                    priceOfAdmission, eventDate, startTime, endTime, publicEvent),
                {
                    name: 'TypeError',
                    message: `publicEvent must be a boolean`
                }, 'Exception/Error should have been thrown');
        });
        it('createEvent() -> maxCapacityNotValidTypeFail',  async (t) => {
            // endTime should be at least 30 minutes later than the startTime
            maxCapacity = '30';
            await assert.rejects(eventsDataFun.create(eventName, eventDescription, eventLocation, contactEmail, maxCapacity,
                    priceOfAdmission, eventDate, startTime, endTime, publicEvent),
                {
                    name: 'TypeError',
                    message: `maxCapacity must be a number`
                }, 'Exception/Error should have been thrown');
        });
        it('createEvent() -> maxCapacityNotWholeNumberFail',  async (t) => {
            // endTime should be at least 30 minutes later than the startTime
            maxCapacity = '3.3';
            await assert.rejects(eventsDataFun.create(eventName, eventDescription, eventLocation, contactEmail, maxCapacity,
                    priceOfAdmission, eventDate, startTime, endTime, publicEvent),
                {
                    name: 'TypeError',
                }, 'Exception/Error should have been thrown');
        });
        it('createEvent() -> priceOfAdmissionNotValidTypeFail',  async (t) => {
            // endTime should be at least 30 minutes later than the startTime
            priceOfAdmission = true;
            await assert.rejects(eventsDataFun.create(eventName, eventDescription, eventLocation, contactEmail, maxCapacity,
                    priceOfAdmission, eventDate, startTime, endTime, publicEvent),
                {
                    name: 'TypeError',
                    message: `priceOfAdmission must be a number`
                }, 'Exception/Error should have been thrown');
        });
        it('createEvent() -> maxCapacityZeroFail',  async (t) => {
            // endTime should be at least 30 minutes later than the startTime
            maxCapacity = 0;
            await assert.rejects(eventsDataFun.create(eventName, eventDescription, eventLocation, contactEmail, maxCapacity,
                    priceOfAdmission, eventDate, startTime, endTime, publicEvent),
                {
                    name: 'RangeError',
                    message: `maxCapacity must be a whole number greater than zero`
                }, 'Exception/Error should have been thrown');
        });
        it('createEvent() -> priceOfAdmissionThreeDecimalNumsFail',  async (t) => {
            // endTime should be at least 30 minutes later than the startTime
            priceOfAdmission = 3.009;
            await assert.rejects(eventsDataFun.create(eventName, eventDescription, eventLocation, contactEmail, maxCapacity,
                    priceOfAdmission, eventDate, startTime, endTime, publicEvent),
                {
                    name: 'RangeError',
                    message: /must have less than 2 decimal places/
                }, 'Exception/Error should have been thrown');
        });
        it('createEvent() -> eventLocationNotValidTypeFail',  async (t) => {
            // endTime should be at least 30 minutes later than the startTime
            eventLocation = [];
            await assert.rejects(eventsDataFun.create(eventName, eventDescription, eventLocation, contactEmail, maxCapacity,
                    priceOfAdmission, eventDate, startTime, endTime, publicEvent),
                {
                    name: 'TypeError',
                    message: 'eventLocation must be an object'
                }, 'Exception/Error should have been thrown');
        });
        it('createEvent() -> eventLocationCityNotSuppliedFail',  async (t) => {
            // endTime should be at least 30 minutes later than the startTime
            delete eventLocation.city;
            await assert.rejects(eventsDataFun.create(eventName, eventDescription, eventLocation, contactEmail, maxCapacity,
                    priceOfAdmission, eventDate, startTime, endTime, publicEvent),
                {
                    name: 'TypeError',
                    message: /must include the city property/
                }, 'Exception/Error should have been thrown');
        });
        it('createEvent() -> eventLocationZipNotValidTypeFail',  async (t) => {
            // endTime should be at least 30 minutes later than the startTime
            eventLocation.zip = 12454;
            await assert.rejects(eventsDataFun.create(eventName, eventDescription, eventLocation, contactEmail, maxCapacity,
                    priceOfAdmission, eventDate, startTime, endTime, publicEvent),
                {
                    name: 'TypeError',
                    message: 'zip must be a string'
                }, 'Exception/Error should have been thrown');
        });
        it('createEvent() -> eventLocationStreetAddressTooLongFail',  async (t) => {
            // endTime should be at least 30 minutes later than the startTime
            eventLocation.streetAddress = 'ab';
            await assert.rejects(eventsDataFun.create(eventName, eventDescription, eventLocation, contactEmail, maxCapacity,
                    priceOfAdmission, eventDate, startTime, endTime, publicEvent),
                {
                    name: 'TypeError',
                    message: 'streetAddress must be more than 2 character long'
                }, 'Exception/Error should have been thrown');
        });
        it('createEvent() -> eventLocationCityTooLongFail',  async (t) => {
            // endTime should be at least 30 minutes later than the startTime
            eventLocation.city = 'ab ';
            await assert.rejects(eventsDataFun.create(eventName, eventDescription, eventLocation, contactEmail, maxCapacity,
                    priceOfAdmission, eventDate, startTime, endTime, publicEvent),
                {
                    name: 'TypeError',
                    message: 'city must be more than 2 character long'
                }, 'Exception/Error should have been thrown');
        });
        it('createEvent() -> eventLocationStateNotValidFail',  async (t) => {
            // endTime should be at least 30 minutes later than the startTime
            eventLocation.state = 'ny ';
            await assert.rejects(eventsDataFun.create(eventName, eventDescription, eventLocation, contactEmail, maxCapacity,
                    priceOfAdmission, eventDate, startTime, endTime, publicEvent),
                {
                    name: 'RangeError',
                    message: `The eventLocation state (${eventLocation.state}) is not a valid two character state abbreviation "NY", "NJ" etc.`
                }, 'Exception/Error should have been thrown');
        });
        it('createEvent() -> eventLocationZipNotValidTypeFail',  async (t) => {
            // endTime should be at least 30 minutes later than the startTime
            eventLocation.zip = 11111;
            await assert.rejects(eventsDataFun.create(eventName, eventDescription, eventLocation, contactEmail, maxCapacity,
                    priceOfAdmission, eventDate, startTime, endTime, publicEvent),
                {
                    name: 'TypeError',
                    message: `zip must be a string`
                }, 'Exception/Error should have been thrown');
        });
        it('createEvent() -> eventLocationZipNotValidFail',  async (t) => {
            // endTime should be at least 30 minutes later than the startTime
            eventLocation.zip = '0000';
            await assert.rejects(eventsDataFun.create(eventName, eventDescription, eventLocation, contactEmail, maxCapacity,
                    priceOfAdmission, eventDate, startTime, endTime, publicEvent),
                {
                    name: 'Error',
                    message: `The eventLocation zip (${eventLocation.zip}) is not in the correct format. Zip codes must have 5-digits`
                }, 'Exception/Error should have been thrown');
        });
    });

    // Test Cases for async getAll()
    describe('event.getAll()', {skip: false},   (t) => {
        let createdEventId;
        beforeEach(async (t) => {
            eventName = '  12356  ';
            eventDescription = '   barbaquie at kiko in the afternoon  ';
            eventLocation = {streetAddress: "  abcd ", city: " abcd ", state: " NJ  ", zip: "  00000\t"};
            contactEmail = 'x@hotmail.com';
            maxCapacity = 1;
            priceOfAdmission = 1;
            eventDate = '08/25/2050   ';
            startTime = '   2:00 PM';
            endTime = '   2:31 PM';
            publicEvent = false;
            attendees = [];
            totalNumberOfAttendees = 0;
            let {_id} = await eventsDataFun.create(eventName, eventDescription, eventLocation, contactEmail, maxCapacity,
                priceOfAdmission, eventDate, startTime, endTime, publicEvent);
            createdEventId = _id;
        });
        it('getAll() -> getAllEventsOneEventValidSuccess',  async (t) => {
            const allEvents = await eventsDataFun.getAll();
            // Assertions:
            assert.ok(Array.isArray(allEvents), 'getAll() does not return an array');
            assert.deepStrictEqual(allEvents.length, 1, 'getAll() does not return exactly 1 event');
            const firstEventPatrickBBQ = allEvents[0];
            assert.deepStrictEqual(Object.keys(firstEventPatrickBBQ).length, 2, 'The number of attributes returned is not 2');
            assert.ok(firstEventPatrickBBQ instanceof Object && !(firstEventPatrickBBQ instanceof Array),
                'getAll() first element is not an object');
            assert.deepStrictEqual(firstEventPatrickBBQ._id, createdEventId,
                'The _id expected and actual are not the same');
            assert.deepStrictEqual(firstEventPatrickBBQ.eventName, eventName.trim(),
                'The eventName expected and actual are not the same');
            assert.deepStrictEqual(firstEventPatrickBBQ.description, undefined,
                'The eventDescription expected and actual are not the same');
            assert.deepStrictEqual(firstEventPatrickBBQ.eventLocation, undefined,
                'The firstEvent eventLocation expected and actual are not the same');
            assert.deepStrictEqual(firstEventPatrickBBQ.contactEmail, undefined,
                'The contactEmail expected and actual are not the same');
            assert.deepStrictEqual(firstEventPatrickBBQ.maxCapacity, undefined,
                'The maxCapacity expected and actual are not the same');
            assert.deepStrictEqual(firstEventPatrickBBQ.priceOfAdmission, undefined,
                'The priceOfAdmission expected and actual are not the same');
            assert.deepStrictEqual(firstEventPatrickBBQ.eventDate, undefined,
                'The eventDate expected and actual are not the same');
            assert.deepStrictEqual(firstEventPatrickBBQ.startTime, undefined,
                'The startTime expected and actual are not the same');
            assert.deepStrictEqual(firstEventPatrickBBQ.endTime, undefined,
                'The endTime expected and actual are not the same');
            assert.deepStrictEqual(firstEventPatrickBBQ.publicEvent, undefined,
                'The publicEvent expected and actual are not the same');
            assert.deepStrictEqual(firstEventPatrickBBQ.attendees, undefined,
                'The attendees expected and actual are not the same');
            assert.deepStrictEqual(firstEventPatrickBBQ.totalNumberOfAttendees, undefined,
                'The totalNumberOfAttendees expected and actual are not the same');
        });
        it('getAll() -> getAllEventsTwoEventValidSuccess',  async (t) => {
            let event2Name = '  12356sfas  ';
            let event2Description = '   barbaquie at kiko in the afternoon  ';
            let event2Location = {streetAddress: "  abcd ", city: " abcd ", state: " NJ  ", zip: "  00000\t"};
            let contact2Email = 'x@hotmail.es';
            let max2Capacity = 1;
            let price2OfAdmission = 1;
            let event2Date = '08/25/2050   ';
            let start2Time = '   2:00 PM';
            let end2Time = '   4:31 PM';
            let public2Event = false;
            attendees = [];
            totalNumberOfAttendees = 0;
            let {_id} = await eventsDataFun.create(event2Name, event2Description, event2Location, contact2Email, max2Capacity,
                price2OfAdmission, event2Date, start2Time, end2Time, public2Event);
            const createdEvent2Id = _id;
            const allEvents = await eventsDataFun.getAll();

            const firstEvent = allEvents[0];
            // Assertions:
            assert.ok(Array.isArray(allEvents), 'getAll() does not return an array');
            assert.deepStrictEqual(allEvents.length, 2, 'getAll() does not return exactly 2 events');
            // Assertions first element (firstEvent)
            assert.ok(firstEvent instanceof Object && !(firstEvent instanceof Array),
                'getAll() first element is not an object');
            assert.deepStrictEqual(Object.keys(firstEvent).length, 2, 'The number of attributes returned is not 2');
            assert.deepStrictEqual(firstEvent._id, createdEventId,
                'The firstEvent _id expected and actual are not the same');
            assert.deepStrictEqual(firstEvent.eventName, eventName.trim(),
                'The firstEvent eventName expected and actual are not the same');
            assert.deepStrictEqual(firstEvent.description, undefined,
                'The firstEvent eventDescription expected and actual are not the same');
            assert.deepStrictEqual(firstEvent.eventLocation, undefined,
                'The firstEvent eventLocation expected and actual are not the same');
            assert.deepStrictEqual(firstEvent.contactEmail, undefined,
                'The firstEvent contactEmail expected and actual are not the same');
            assert.deepStrictEqual(firstEvent.maxCapacity, undefined,
                'The firstEvent maxCapacity expected and actual are not the same');
            assert.deepStrictEqual(firstEvent.priceOfAdmission, undefined,
                'The firstEvent priceOfAdmission expected and actual are not the same');
            assert.deepStrictEqual(firstEvent.eventDate, undefined,
                'The firstEvent eventDate expected and actual are not the same');
            assert.deepStrictEqual(firstEvent.startTime, undefined,
                'The firstEvent startTime expected and actual are not the same');
            assert.deepStrictEqual(firstEvent.endTime, undefined,
                'The firstEvent endTime expected and actual are not the same');
            assert.deepStrictEqual(firstEvent.publicEvent, undefined,
                'The firstEvent publicEvent expected and actual are not the same');
            assert.deepStrictEqual(firstEvent.attendees, undefined,
                'The firstEvent attendees expected and actual are not the same');
            assert.deepStrictEqual(firstEvent.totalNumberOfAttendees, undefined,
                'The firstEvent totalNumberOfAttendees expected and actual are not the same');

            // Assertions first element (secondEvent)
            const secondEvent = allEvents[1];
            assert.ok(secondEvent instanceof Object && !(secondEvent instanceof Array),
                'getAll() first element is not an object');
            assert.deepStrictEqual(Object.keys(secondEvent).length, 2, 'The number of attributes returned is not 2');
            assert.deepStrictEqual(secondEvent._id, createdEvent2Id,
                'The secondEvent _id expected and actual are not the same');
            assert.deepStrictEqual(secondEvent.eventName, event2Name.trim(),
                'The secondEvent eventName expected and actual are not the same');
            assert.deepStrictEqual(secondEvent.description, undefined,
                'The secondEvent eventDescription expected and actual are not the same');
            assert.deepStrictEqual(secondEvent.eventLocation, undefined,
                'The secondEvent eventLocation expected and actual are not the same');
            assert.deepStrictEqual(secondEvent.contactEmail, undefined,
                'The secondEvent contactEmail expected and actual are not the same');
            assert.deepStrictEqual(secondEvent.maxCapacity, undefined,
                'The secondEvent maxCapacity expected and actual are not the same');
            assert.deepStrictEqual(secondEvent.priceOfAdmission, undefined,
                'The secondEvent priceOfAdmission expected and actual are not the same');
            assert.deepStrictEqual(secondEvent.eventDate, undefined,
                'The secondEvent eventDate expected and actual are not the same');
            assert.deepStrictEqual(secondEvent.startTime, undefined,
                'The secondEvent startTime expected and actual are not the same');
            assert.deepStrictEqual(secondEvent.endTime, undefined,
                'The secondEvent endTime expected and actual are not the same');
            assert.deepStrictEqual(secondEvent.publicEvent, undefined,
                'The secondEvent publicEvent expected and actual are not the same');
            assert.deepStrictEqual(secondEvent.attendees, undefined,
                'The secondEvent attendees expected and actual are not the same');
            assert.deepStrictEqual(secondEvent.totalNumberOfAttendees, undefined,
                'The secondEvent totalNumberOfAttendees expected and actual are not the same');
        });
    });

    // Test Cases for async get()
    describe('event.get()', {skip: false},    (t) => {
        let createdEventId;
        beforeEach(async (t) => {
            eventName = '  12356  ';
            eventDescription = '   barbaquie at kiko in the afternoon  ';
            eventLocation = {streetAddress: "  abcd ", city: " abcd ", state: " NJ  ", zip: "  00000\t"};
            contactEmail = 'x@hotmail.com';
            maxCapacity = 1;
            priceOfAdmission = 1;
            eventDate = '08/25/2050   ';
            startTime = '   2:00 PM';
            endTime = '   2:31 PM';
            publicEvent = false;
            attendees = [];
            totalNumberOfAttendees = 0;
            let {_id} = await eventsDataFun.create(eventName, eventDescription, eventLocation, contactEmail, maxCapacity,
                priceOfAdmission, eventDate, startTime, endTime, publicEvent);
            createdEventId = _id;
        });
        it('get() -> getEventValidSuccess',  async (t) => {
            const patrickBBQ = await eventsDataFun.get('   '.concat(createdEventId.toString(), '   '));
            // Assertions:
            assert.ok(patrickBBQ instanceof Object && !(eventLocation instanceof Array),
                'get() element returned is not an object');
            assert.deepStrictEqual(Object.keys(patrickBBQ).length, 13, 'The number of attributes returned is not 13');
            assert.deepStrictEqual(patrickBBQ._id, createdEventId,
                'The _id expected and actual are not the same');
            assert.deepStrictEqual(patrickBBQ.eventName, eventName.trim(),
                'The eventName expected and actual are not the same');
            assert.deepStrictEqual(patrickBBQ.description, eventDescription.trim(),
                'The eventDescription expected and actual are not the same');
            assert.ok(patrickBBQ.eventLocation instanceof Object && !(patrickBBQ.eventLocation instanceof Array),
                'eventLocation attribute returned is not an object');
            assert.deepStrictEqual(Object.keys(patrickBBQ.eventLocation).length, 4, 'The number of eventLocation attributes returned is not 4');
            assert.deepStrictEqual(patrickBBQ.eventLocation.streetAddress, eventLocation.streetAddress.trim(),
                'The eventLocation.streetAddress expected and actual are not the same');
            assert.deepStrictEqual(patrickBBQ.eventLocation.city, eventLocation.city.trim(),
                'The eventLocation.city expected and actual are not the same');
            assert.deepStrictEqual(patrickBBQ.eventLocation.state, eventLocation.state.trim(),
                'The eventLocation.state expected and actual are not the same');
            assert.deepStrictEqual(patrickBBQ.eventLocation.zip, eventLocation.zip.trim(),
                'The eventLocation.zip expected and actual are not the same');
            assert.deepStrictEqual(patrickBBQ.contactEmail, contactEmail.trim(),
                'The contactEmail expected and actual are not the same');
            assert.deepStrictEqual(patrickBBQ.maxCapacity, maxCapacity,
                'The maxCapacity expected and actual are not the same');
            assert.deepStrictEqual(patrickBBQ.priceOfAdmission, priceOfAdmission,
                'The priceOfAdmission expected and actual are not the same');
            assert.deepStrictEqual(patrickBBQ.eventDate, eventDate.trim(),
                'The eventDate expected and actual are not the same');
            assert.deepStrictEqual(patrickBBQ.startTime, startTime.trim(),
                'The startTime expected and actual are not the same');
            assert.deepStrictEqual(patrickBBQ.endTime, endTime.trim(),
                'The endTime expected and actual are not the same');
            assert.deepStrictEqual(patrickBBQ.publicEvent, publicEvent,
                'The publicEvent expected and actual are not the same');
            assert.deepStrictEqual(patrickBBQ.attendees, attendees,
                'The attendees expected and actual are not the same');
            assert.deepStrictEqual(patrickBBQ.totalNumberOfAttendees, totalNumberOfAttendees,
                'The totalNumberOfAttendees expected and actual are not the same');
        });
    });

    // Test Cases for async update()
    describe('event.update()', {skip: false},   (t) => {
        let createdEventId, newEventName, newEventDescription, newEventLocation, newContactEmail, newMaxCapacity,
            newPriceOfAdmission, newEventDate, newStartTime, newEndTime, newPublicEvent;
         beforeEach(async (t) => {
            eventName = '  12356  ';
            eventDescription = '   barbaquie at kiko in the afternoon  ';
            eventLocation = {streetAddress: "  abcd ", city: " abcd ", state: " NJ  ", zip: "  00000\t"};
            contactEmail = 'x@hotmail.com';
            maxCapacity = 1;
            priceOfAdmission = 1;
            eventDate = '08/25/2050   ';
            startTime = '   2:00 PM';
            endTime = '   2:31 PM';
            publicEvent = false;
            attendees = [];
            totalNumberOfAttendees = 0;
            let {_id} = await eventsDataFun.create(eventName, eventDescription, eventLocation, contactEmail, maxCapacity,
                priceOfAdmission, eventDate, startTime, endTime, publicEvent);
            createdEventId = _id;
        });
         it('update() -> updateEventValidSuccess',  async (t) => {
            newEventName = '  ABCDE  ';
            // newEventDescription = '   barbaquie at kiko in the afternoon  ';
            newEventLocation = {streetAddress: "  abcd ", city: " Chicago ", state: " NJ  ", zip: "  00111\t"};
            newContactEmail = 'x@hotmail.com';
            newMaxCapacity = 30;
            // newPriceOfAdmission = 1;
            newEventDate = '09/25/2050   ';
            // newStartTime = '   2:00 PM';
            newEndTime = '   2:35 PM';
            newPublicEvent = true;
            const patrickBBQ = await eventsDataFun.update('   '.concat(createdEventId.toString(), '   '),
                newEventName, eventDescription, newEventLocation, newContactEmail, newMaxCapacity,
                priceOfAdmission, newEventDate, startTime, newEndTime, newPublicEvent);
            // Assertions:
            assert.ok(patrickBBQ instanceof Object && !(eventLocation instanceof Array),
                'get() element returned is not an object');
            assert.deepStrictEqual(Object.keys(patrickBBQ).length, 13, 'The number of attributes returned is not 13');
            assert.deepStrictEqual(patrickBBQ._id, createdEventId,
                'The _id expected and actual are not the same');
            assert.deepStrictEqual(patrickBBQ.eventName, newEventName.trim(),
                'The eventName expected and actual are not the same');
            assert.deepStrictEqual(patrickBBQ.description, eventDescription.trim(),
                'The eventDescription expected and actual are not the same');
            assert.ok(patrickBBQ.eventLocation instanceof Object && !(patrickBBQ.eventLocation instanceof Array),
                'eventLocation attribute returned is not an object');
            assert.deepStrictEqual(Object.keys(patrickBBQ.eventLocation).length, 4, 'The number of eventLocation attributes returned is not 4');
            assert.deepStrictEqual(patrickBBQ.eventLocation.streetAddress, newEventLocation.streetAddress.trim(),
                'The eventLocation.streetAddress expected and actual are not the same');
            assert.deepStrictEqual(patrickBBQ.eventLocation.city, newEventLocation.city.trim(),
                'The eventLocation.city expected and actual are not the same');
            assert.deepStrictEqual(patrickBBQ.eventLocation.state, newEventLocation.state.trim(),
                'The eventLocation.state expected and actual are not the same');
            assert.deepStrictEqual(patrickBBQ.eventLocation.zip, newEventLocation.zip.trim(),
                'The eventLocation.zip expected and actual are not the same');
            assert.deepStrictEqual(patrickBBQ.contactEmail, newContactEmail.trim(),
                'The contactEmail expected and actual are not the same');
            assert.deepStrictEqual(patrickBBQ.maxCapacity, newMaxCapacity,
                'The maxCapacity expected and actual are not the same');
            assert.deepStrictEqual(patrickBBQ.priceOfAdmission, priceOfAdmission,
                'The priceOfAdmission expected and actual are not the same');
            assert.deepStrictEqual(patrickBBQ.eventDate, newEventDate.trim(),
                'The eventDate expected and actual are not the same');
            assert.deepStrictEqual(patrickBBQ.startTime, startTime.trim(),
                'The startTime expected and actual are not the same');
            assert.deepStrictEqual(patrickBBQ.endTime, newEndTime.trim(),
                'The endTime expected and actual are not the same');
            assert.deepStrictEqual(patrickBBQ.publicEvent, newPublicEvent,
                'The publicEvent expected and actual are not the same');
            assert.deepStrictEqual(patrickBBQ.attendees, attendees,
                'The attendees expected and actual are not the same');
            assert.deepStrictEqual(patrickBBQ.totalNumberOfAttendees, totalNumberOfAttendees,
                'The totalNumberOfAttendees expected and actual are not the same');
        });
         it('update() -> updateEventNotFoundFail',  async (t) => {
            newEventName = '  ABCDE  ';
            // newEventDescription = '   barbaquie at kiko in the afternoon  ';
            newEventLocation = {streetAddress: "  abcd ", city: " Chicago ", state: " NJ  ", zip: "  00111\t"};
            newContactEmail = 'x@hotmail.com';
            newMaxCapacity = 30;
            // newPriceOfAdmission = 1;
            newEventDate = '09/25/2050   ';
            // newStartTime = '   2:00 PM';
            newEndTime = '   2:35 PM';
            newPublicEvent = true;
            await assert.rejects(eventsDataFun.update('6538e94ca6060155dff55ccf',
                    newEventName, eventDescription, newEventLocation, newContactEmail, newMaxCapacity,
                    priceOfAdmission, newEventDate, startTime, newEndTime, newPublicEvent),
                {
                    name: 'Error',
                    message: `Event with id '6538e94ca6060155dff55ccf' can not be updated (does not exist) from the events database collection`
                }, 'Exception/Error should have been thrown');
        });
    });
})
