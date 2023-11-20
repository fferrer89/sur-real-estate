// FIXME: This file is an example of how we are going to do our testing

import {describe, it, beforeEach, after} from 'node:test';
import assert from 'node:assert/strict'
import {eventsDataFun, attendeesDataFun} from '../../data/index.js';
import {closeConnection, dbConnection} from "../../config/mongoConnection.js";
import {ObjectId} from 'mongodb';
import eventsSetting from 'events';
eventsSetting.EventEmitter.defaultMaxListeners = 100;

// it() -> To create a new test
// describe() -> To create a new test suite

describe('attendeesTestSuit', {skip: true}, (t) => {
    // beforeEach() is run before each test in a describe()
    beforeEach(async () => {
        const db = await dbConnection();
        await db.dropDatabase(); // clearing the database
    });
    // after() is run once after all the tests in a describe()
    after(async () => {
        await closeConnection();
    });

    // Test Cases for async createAttendee()
    describe('event.createAttendee()', {skip: false},  (t) => {
        let eventName, eventDescription, eventLocation, contactEmail, maxCapacity, priceOfAdmission, eventDate, startTime,
            endTime, publicEvent, attendees, totalNumberOfAttendees;
        let createdEventId, firstName, lastName, emailAddress;
        // beforeEach() is run before each test in a describe()
        beforeEach(async (t) => {
            eventName = '  12356  ';
            eventDescription = '   barbaquie at kiko in the afternoon  ';
            eventLocation = {streetAddress: "  abcd ", city: " abcd ", state: " NJ  ", zip: "  00000\t"};
            contactEmail = 'x@hotmail.com';
            maxCapacity = 2;
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
        it('createAttendee() -> createAttendeeInEventValidSuccess',  async (t) => {
            firstName = 'John';
            lastName = 'Doe';
            emailAddress = 'john.doe@hotmail.com';
            const eventWithJohn = await attendeesDataFun.createAttendee('   '.concat(createdEventId.toString(), '   '), firstName,
                lastName, emailAddress);
            // Assertions:
            assert.ok(eventWithJohn instanceof Object && !(eventWithJohn instanceof Array),
                'get() element returned is not an object');
            assert.deepStrictEqual(Object.keys(eventWithJohn).length, 13, 'The number of attributes returned is not 13');
            assert.deepStrictEqual(eventWithJohn._id, createdEventId,
                'The _id expected and actual are not the same');
            assert.deepStrictEqual(eventWithJohn.eventName, eventName.trim(),
                'The eventName expected and actual are not the same');
            assert.deepStrictEqual(eventWithJohn.description, eventDescription.trim(),
                'The eventDescription expected and actual are not the same');
            assert.ok(eventWithJohn.eventLocation instanceof Object && !(eventWithJohn.eventLocation instanceof Array),
                'eventLocation attribute returned is not an object');
            assert.deepStrictEqual(Object.keys(eventWithJohn.eventLocation).length, 4, 'The number of eventLocation attributes returned is not 4');
            assert.deepStrictEqual(eventWithJohn.eventLocation.streetAddress, eventLocation.streetAddress.trim(),
                'The eventLocation.streetAddress expected and actual are not the same');
            assert.deepStrictEqual(eventWithJohn.eventLocation.city, eventLocation.city.trim(),
                'The eventLocation.city expected and actual are not the same');
            assert.deepStrictEqual(eventWithJohn.eventLocation.state, eventLocation.state.trim(),
                'The eventLocation.state expected and actual are not the same');
            assert.deepStrictEqual(eventWithJohn.eventLocation.zip, eventLocation.zip.trim(),
                'The eventLocation.zip expected and actual are not the same');
            assert.deepStrictEqual(eventWithJohn.contactEmail, contactEmail.trim(),
                'The contactEmail expected and actual are not the same');
            assert.deepStrictEqual(eventWithJohn.maxCapacity, maxCapacity,
                'The maxCapacity expected and actual are not the same');
            assert.deepStrictEqual(eventWithJohn.priceOfAdmission, priceOfAdmission,
                'The priceOfAdmission expected and actual are not the same');
            assert.deepStrictEqual(eventWithJohn.eventDate, eventDate.trim(),
                'The eventDate expected and actual are not the same');
            assert.deepStrictEqual(eventWithJohn.startTime, startTime.trim(),
                'The startTime expected and actual are not the same');
            assert.deepStrictEqual(eventWithJohn.endTime, endTime.trim(),
                'The endTime expected and actual are not the same');
            assert.deepStrictEqual(eventWithJohn.publicEvent, publicEvent,
                'The publicEvent expected and actual are not the same');
            assert.deepStrictEqual(eventWithJohn.totalNumberOfAttendees, totalNumberOfAttendees + 1,
                'The totalNumberOfAttendees expected and actual are not the same');
            // Assert attendees
            assert.ok(eventWithJohn.attendees instanceof Array, 'The attendees is not returned as an array');
            assert.deepStrictEqual(eventWithJohn.attendees.length, 1, 'The number of attendees is not exactly one');
            assert.ok(eventWithJohn.attendees[0] instanceof Object && !(eventWithJohn.attendees[0] instanceof Array),
                'The first attendee (attendees[0]) returned is not an object');
            assert.ok(ObjectId.isValid(eventWithJohn.attendees[0]._id), 'The attendee id is not a valid MongoDB object ID');
            assert.deepStrictEqual(eventWithJohn.attendees[0].firstName, firstName, 'The attendee firstName expected and actual are not the same');
            assert.deepStrictEqual(eventWithJohn.attendees[0].lastName, lastName, 'The attendee lastName expected and actual are not the same');
            assert.deepStrictEqual(eventWithJohn.attendees[0].emailAddress, emailAddress, 'The attendee emailAddress expected and actual are not the same');
        });
        it('createAttendee() -> createAttendeeInEventDuplicateFail',  async (t) => {
            firstName = '    John    ';
            lastName = '  Doe ';
            emailAddress = '   john.doe@hotmail.com    ';
            await attendeesDataFun.createAttendee('   '.concat(createdEventId.toString(), '   '), firstName,
                lastName, emailAddress);
            await assert.rejects(attendeesDataFun.createAttendee(createdEventId.toString(), 'Jonny', 'Donna', emailAddress),
                {
                    name: 'RangeError',
                    message: `An attendee with the ${emailAddress.trim()} email address already exists. Duplicate attendees are not allowed`
                }, 'Exception/Error should have been thrown');
        });
        it('createAttendee() -> createAttendeeInEventFullEventFail',  async (t) => {
            firstName = 'John   ';
            lastName = '   Doe';
            emailAddress = 'john.doe@hotmail.com   ';
            await attendeesDataFun.createAttendee('   '.concat(createdEventId.toString(), '   '), firstName,
                lastName, emailAddress);
            await attendeesDataFun.createAttendee(createdEventId.toString(), 'Mary',
                'Smith', 'may_smith@gmail.com');
            await assert.rejects(attendeesDataFun.createAttendee(createdEventId.toString(), 'Rachel', 'Buffer', 'rachel@stevens.com'),
                {
                    name: 'RangeError',
                    message: `This event is already full. Event max capacity is ${maxCapacity} and current number of attendees is ${2}`
                }, 'Exception/Error should have been thrown');
        });
        it('createAttendee() -> NoParamsPassedFail',  async (t) => {
            await assert.rejects(attendeesDataFun.createAttendee(createdEventId.toString()),
                {
                    name: 'TypeError',
                    message: `Function call missing one or more required parameters. Function signature is: event.createAttendee(eventId, firstName, lastName, emailAddress)`
                }, 'Exception/Error should have been thrown');
        });
        it('createAttendee() -> lastNameNoStringFail',  async (t) => {
            await assert.rejects(attendeesDataFun.createAttendee(createdEventId.toString(), 'Rachel', 444, 'rachel@stevens.com'),
                {
                    name: 'TypeError',
                    message: `lastName must be a string`
                }, 'Exception/Error should have been thrown');
        });
        it('createAttendee() -> emailAddressEmptyStringFail',  async (t) => {
            await assert.rejects(attendeesDataFun.createAttendee(createdEventId.toString(), 'Rachel', 'Miro', '  '),
                {
                    name: 'TypeError',
                    message: `'emailAddress' can not be an empty string`
                }, 'Exception/Error should have been thrown');
        });
    });

    // Test Cases for async getAllAttendees()
    describe('event.getAttendees()', {skip: false},  (t) => {
        let eventName, eventDescription, eventLocation, contactEmail, maxCapacity, priceOfAdmission, eventDate, startTime,
            endTime, publicEvent, attendees, totalNumberOfAttendees;
        let createdEventId, firstName, lastName, emailAddress;
        // beforeEach() is run before each test in a describe()
        beforeEach(async (t) => {
            eventName = '  12356  ';
            eventDescription = '   barbaquie at kiko in the afternoon  ';
            eventLocation = {streetAddress: "  abcd ", city: " abcd ", state: " NJ  ", zip: "  00000\t"};
            contactEmail = 'x@hotmail.com';
            maxCapacity = 2;
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
            // Create John attendee
        });
        it('getAllAttendees() -> getAllAttendeesInEventValidSuccess',  async (t) => {
            firstName = 'John';
            lastName = 'Doe';
            emailAddress = 'john.doe@hotmail.com';
            const eventWithJohn = await attendeesDataFun.createAttendee('   '.concat(createdEventId.toString(), '   '), firstName,
                lastName, emailAddress);
            const attendees = await attendeesDataFun.getAllAttendees(createdEventId.toString());
            // Assertions:
            assert.ok(attendees instanceof Array, 'The attendees returned is not an array as an array');
            assert.deepStrictEqual(attendees.length, 1, 'The number of attendees is not exactly one');
            // Assert attendees
            assert.ok(attendees[0] instanceof Object && !(attendees[0] instanceof Array),
                'The first attendee (attendees[0]) returned is not an object');
            assert.ok(ObjectId.isValid(attendees[0]._id), 'The attendee id is not a valid MongoDB object ID');
            assert.deepStrictEqual(Object.keys(attendees[0]).length, 4, 'The attendee does not have exactly 4 properties')
            assert.deepStrictEqual(attendees[0]._id, eventWithJohn.attendees[0]._id, 'The attendee Id expected and actual are not the same')
            assert.deepStrictEqual(attendees[0].firstName, firstName, 'The attendee firstName expected and actual are not the same')
            assert.deepStrictEqual(attendees[0].lastName, lastName, 'The attendee lastName expected and actual are not the same')
            assert.deepStrictEqual(attendees[0].emailAddress, emailAddress, 'The attendee emailAddress expected and actual are not the same')
        });
        it('getAllAttendees() -> getAllAttendeesInEventMultipleAttendeesValidSuccess',  async (t) => {
            const eventWithJohn = await attendeesDataFun.createAttendee('   '.concat(createdEventId.toString(), '   '), '    John',
                'Doe    ', 'john.doe@hotmail.com    ');
            const eventWithMary = await attendeesDataFun.createAttendee(createdEventId.toString(), 'Mary',
                'Smith', 'mary_smith@gmail.com');
            const attendees = await attendeesDataFun.getAllAttendees(createdEventId.toString());
            // Assertions:
            assert.ok(attendees instanceof Array, 'The attendees returned is not an array as an array');
            assert.deepStrictEqual(attendees.length, 2, 'The number of attendees is not exactly two');
            // Assert John attendee
            assert.ok(attendees[0] instanceof Object && !(attendees[0] instanceof Array),
                'The first attendee (attendees[0]) returned is not an object');
            assert.ok(ObjectId.isValid(attendees[0]._id), 'The attendee id is not a valid MongoDB object ID');
            assert.deepStrictEqual(Object.keys(attendees[0]).length, 4, 'The attendee does not have exactly 4 properties')
            assert.deepStrictEqual(attendees[0]._id, eventWithJohn.attendees[0]._id, 'The attendee Id expected and actual are not the same')
            assert.deepStrictEqual(attendees[0].firstName, 'John', 'The attendee firstName expected and actual are not the same')
            assert.deepStrictEqual(attendees[0].lastName, 'Doe', 'The attendee lastName expected and actual are not the same')
            assert.deepStrictEqual(attendees[0].emailAddress, 'john.doe@hotmail.com', 'The attendee emailAddress expected and actual are not the same')
            // Assert John attendee
            assert.ok(attendees[1] instanceof Object && !(attendees[1] instanceof Array),
                'The first attendee (attendees[1]) returned is not an object');
            assert.ok(ObjectId.isValid(attendees[1]._id), 'The attendee id is not a valid MongoDB object ID');
            assert.deepStrictEqual(Object.keys(attendees[1]).length, 4, 'The attendee does not have exactly 4 properties')
            assert.deepStrictEqual(attendees[1]._id, eventWithMary.attendees[1]._id, 'The attendee Id expected and actual are not the same')
            assert.deepStrictEqual(attendees[1].firstName, 'Mary', 'The attendee firstName expected and actual are not the same')
            assert.deepStrictEqual(attendees[1].lastName, 'Smith', 'The attendee lastName expected and actual are not the same')
            assert.deepStrictEqual(attendees[1].emailAddress, 'mary_smith@gmail.com', 'The attendee emailAddress expected and actual are not the same')
        });
        it('getAllAttendees() -> getAllAttendeesInEventZeroAttendeesValidSuccess',  async (t) => {
            const attendees = await attendeesDataFun.getAllAttendees(createdEventId.toString());
            assert.ok(attendees instanceof Array, 'The attendees returned is not an array as an array');
            assert.deepStrictEqual(attendees.length, 0, 'The number of attendees is not exactly zero');
        });
    });

    // Test Cases for async getAttendee()
    describe('event.getAttendee()', {skip: false},  (t) => {
        let eventName, eventDescription, eventLocation, contactEmail, maxCapacity, priceOfAdmission, eventDate, startTime,
            endTime, publicEvent, attendees, totalNumberOfAttendees;
        let createdEventId, firstName, lastName, emailAddress;
        beforeEach(async (t) => {
            eventName = '  12356  ';
            eventDescription = '   barbaquie at kiko in the afternoon  ';
            eventLocation = {streetAddress: "  abcd ", city: " abcd ", state: " NJ  ", zip: "  00000\t"};
            contactEmail = 'x@hotmail.com';
            maxCapacity = 50;
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
            // Create John attendee
        });
        it('getAttendee() -> getAttendeeInEventValidSuccess',  async (t) => {
            firstName = '  John  ';
            lastName = ' Doe \t';
            emailAddress = '   john.doe@hotmail.com';
            const eventWithJohn = await attendeesDataFun.createAttendee('   '.concat(createdEventId.toString(), '   '), firstName,
                lastName, emailAddress);
            const johnAttendee = await attendeesDataFun.getAttendee(eventWithJohn.attendees[0]._id.toString());
            // Assertions:
            assert.ok(johnAttendee instanceof Object && !(johnAttendee instanceof Array),
                'The attendee returned is not an object');
            assert.deepStrictEqual(Object.keys(johnAttendee).length, 4, 'The attendee does not have exactly 4 properties')
            assert.deepStrictEqual(johnAttendee._id, eventWithJohn.attendees[0]._id, 'The attendee Id expected and actual are not the same')
            assert.deepStrictEqual(johnAttendee.firstName, firstName.trim(), 'The attendee firstName expected and actual are not the same')
            assert.deepStrictEqual(johnAttendee.lastName, lastName.trim(), 'The attendee lastName expected and actual are not the same')
            assert.deepStrictEqual(johnAttendee.emailAddress, emailAddress.trim(), 'The attendee emailAddress expected and actual are not the same')
        });
        it('getAttendee() -> getAttendeeInEventManyAttendeesSuccess',  async (t) => {
            firstName = '  John  ';
            lastName = ' Doe \t';
            emailAddress = '   john.doe@hotmail.com';
            const eventWithJohn = await attendeesDataFun.createAttendee('   '.concat(createdEventId.toString(), '   '), firstName,
                lastName, emailAddress);
            const eventWithMary = await attendeesDataFun.createAttendee(createdEventId.toString(), 'mary',
                'Doe', 'mary.doe@hotmail.com');
            const eventWithDario = await attendeesDataFun.createAttendee(createdEventId.toString(), 'Dario',
                'Doe', 'dario.doe@hotmail.com');
            const maryAttendee = await attendeesDataFun.getAttendee(eventWithMary.attendees[1]._id.toString());
            // Assertions:
            assert.ok(maryAttendee instanceof Object && !(maryAttendee instanceof Array),
                'The attendee returned is not an object');
            assert.deepStrictEqual(Object.keys(maryAttendee).length, 4, 'The attendee does not have exactly 4 properties')
            assert.deepStrictEqual(maryAttendee._id, eventWithMary.attendees[1]._id, 'The attendee Id expected and actual are not the same')
            assert.deepStrictEqual(maryAttendee.firstName, 'mary', 'The attendee firstName expected and actual are not the same')
            assert.deepStrictEqual(maryAttendee.lastName, 'Doe', 'The attendee lastName expected and actual are not the same')
            assert.deepStrictEqual(maryAttendee.emailAddress, 'mary.doe@hotmail.com', 'The attendee emailAddress expected and actual are not the same')
        });
        it('getAttendee() -> getAttendeeInEventAttendeeNotFoundFail',  async (t) => {
            firstName = '  John  ';
            lastName = ' Doe \t';
            emailAddress = '   john.doe@hotmail.com';
            const eventWithJohn = await attendeesDataFun.createAttendee('   '.concat(createdEventId.toString(), '   '), firstName,
                lastName, emailAddress);
            const eventWithMary = await attendeesDataFun.createAttendee(createdEventId.toString(), 'mary',
                'Doe', 'mary.doe@hotmail.com');
            const eventWithDario = await attendeesDataFun.createAttendee(createdEventId.toString(), 'Dario',
                'Doe', 'dario.doe@hotmail.com');
            // Assertions:
            await assert.rejects(attendeesDataFun.getAttendee('653853753a93f9ce35ff9b99'),
                {
                    name: 'Error',
                    message: `Attendee with id '653853753a93f9ce35ff9b99' can not be found in the events database collection`
                }, 'Exception/Error should have been thrown');
        });
    });

    // Test Cases for async removeAttendee()
    describe('event.removeAttendee()', {skip: false},  (t) => {
        let eventName, eventDescription, eventLocation, contactEmail, maxCapacity, priceOfAdmission, eventDate, startTime,
            endTime, publicEvent, attendees, totalNumberOfAttendees;
        let createdEventId, firstName, lastName, emailAddress;
        beforeEach(async (t) => {
            eventName = '  12356  ';
            eventDescription = '   barbaquie at kiko in the afternoon  ';
            eventLocation = {streetAddress: "  abcd ", city: " abcd ", state: " NJ  ", zip: "  00000\t"};
            contactEmail = 'x@hotmail.com';
            maxCapacity = 3;
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
            // Create John attendee
        });
        it('removeAttendee() -> removeAttendeeInEventValidSuccess',  async (t) => {
            firstName = '  John   ';
            lastName = '  Doe  ';
            emailAddress = '  john.doe@hotmail.com  ';
            const eventWithJohn = await attendeesDataFun.createAttendee('   '.concat(createdEventId.toString(), '   '), firstName,
                lastName, emailAddress);
            const eventWithMary = await attendeesDataFun.createAttendee(createdEventId.toString(), 'mary',
                'Doe', 'mary.doe@hotmail.com');
            const eventWithMJonas = await attendeesDataFun.createAttendee(createdEventId.toString(), 'Jonas',
                'rus', 'joasrus@me.es');

            const removeJohnEvent = await attendeesDataFun.removeAttendee(eventWithJohn.attendees[0]._id.toString());
            // Assertions:
            assert.ok(removeJohnEvent instanceof Object && !(removeJohnEvent instanceof Array),
                'get() element returned is not an object');
            assert.deepStrictEqual(Object.keys(removeJohnEvent).length, 13, 'The number of attributes returned is not 13');
            assert.deepStrictEqual(removeJohnEvent._id, createdEventId,
                'The _id expected and actual are not the same');
            assert.deepStrictEqual(removeJohnEvent.eventName, eventName.trim(),
                'The eventName expected and actual are not the same');
            assert.deepStrictEqual(removeJohnEvent.description, eventDescription.trim(),
                'The eventDescription expected and actual are not the same');
            assert.ok(removeJohnEvent.eventLocation instanceof Object && !(removeJohnEvent.eventLocation instanceof Array),
                'eventLocation attribute returned is not an object');
            assert.deepStrictEqual(Object.keys(removeJohnEvent.eventLocation).length, 4, 'The number of eventLocation attributes returned is not 4');
            assert.deepStrictEqual(removeJohnEvent.eventLocation.streetAddress, eventLocation.streetAddress.trim(),
                'The eventLocation.streetAddress expected and actual are not the same');
            assert.deepStrictEqual(removeJohnEvent.eventLocation.city, eventLocation.city.trim(),
                'The eventLocation.city expected and actual are not the same');
            assert.deepStrictEqual(removeJohnEvent.eventLocation.state, eventLocation.state.trim(),
                'The eventLocation.state expected and actual are not the same');
            assert.deepStrictEqual(removeJohnEvent.eventLocation.zip, eventLocation.zip.trim(),
                'The eventLocation.zip expected and actual are not the same');
            assert.deepStrictEqual(removeJohnEvent.contactEmail, contactEmail.trim(),
                'The contactEmail expected and actual are not the same');
            assert.deepStrictEqual(removeJohnEvent.maxCapacity, maxCapacity,
                'The maxCapacity expected and actual are not the same');
            assert.deepStrictEqual(removeJohnEvent.priceOfAdmission, priceOfAdmission,
                'The priceOfAdmission expected and actual are not the same');
            assert.deepStrictEqual(removeJohnEvent.eventDate, eventDate.trim(),
                'The eventDate expected and actual are not the same');
            assert.deepStrictEqual(removeJohnEvent.startTime, startTime.trim(),
                'The startTime expected and actual are not the same');
            assert.deepStrictEqual(removeJohnEvent.endTime, endTime.trim(),
                'The endTime expected and actual are not the same');
            assert.deepStrictEqual(removeJohnEvent.publicEvent, publicEvent,
                'The publicEvent expected and actual are not the same');
            assert.deepStrictEqual(removeJohnEvent.totalNumberOfAttendees, 2,
                'The totalNumberOfAttendees expected and actual are not the same');
            // Assert attendees
            assert.ok(removeJohnEvent.attendees instanceof Array, 'The attendees is not returned as an array');
            assert.deepStrictEqual(removeJohnEvent.attendees.length, 2, 'The number of attendees is not exactly two');
            // Assert Mary Attendee
            assert.ok(removeJohnEvent.attendees[0] instanceof Object && !(removeJohnEvent.attendees[0] instanceof Array),
                'The first attendee (attendees[0]) returned is not an object');
            assert.ok(ObjectId.isValid(removeJohnEvent.attendees[0]._id), 'The attendee id is not a valid MongoDB object ID');
            assert.deepStrictEqual(removeJohnEvent.attendees[0].firstName, 'mary', 'The attendee firstName expected and actual are not the same');
            assert.deepStrictEqual(removeJohnEvent.attendees[0].lastName, 'Doe', 'The attendee lastName expected and actual are not the same');
            assert.deepStrictEqual(removeJohnEvent.attendees[0].emailAddress, 'mary.doe@hotmail.com', 'The attendee emailAddress expected and actual are not the same');
            // Assert Jonas Attendee
            assert.ok(removeJohnEvent.attendees[1] instanceof Object && !(removeJohnEvent.attendees[1] instanceof Array),
                'The first attendee (attendees[0]) returned is not an object');
            assert.ok(ObjectId.isValid(removeJohnEvent.attendees[1]._id), 'The attendee id is not a valid MongoDB object ID');
            assert.deepStrictEqual(removeJohnEvent.attendees[1].firstName, 'Jonas', 'The attendee firstName expected and actual are not the same');
            assert.deepStrictEqual(removeJohnEvent.attendees[1].lastName, 'rus', 'The attendee lastName expected and actual are not the same');
            assert.deepStrictEqual(removeJohnEvent.attendees[1].emailAddress, 'joasrus@me.es', 'The attendee emailAddress expected and actual are not the same');
        });
        it('removeAttendee() -> removeAttendeeInEventSingleAttendeeValidSuccess',  async (t) => {
            firstName = '  John   ';
            lastName = '  Doe  ';
            emailAddress = '  john.doe@hotmail.com  ';
            const eventWithJohn = await attendeesDataFun.createAttendee('   '.concat(createdEventId.toString(), '   '), firstName,
                lastName, emailAddress);
            const removeJohnEvent = await attendeesDataFun.removeAttendee(eventWithJohn.attendees[0]._id.toString());
            // Assertions:
            assert.ok(removeJohnEvent instanceof Object && !(removeJohnEvent instanceof Array),
                'get() element returned is not an object');
            assert.deepStrictEqual(Object.keys(removeJohnEvent).length, 13, 'The number of attributes returned is not 13');
            assert.deepStrictEqual(removeJohnEvent._id, createdEventId,
                'The _id expected and actual are not the same');
            assert.deepStrictEqual(removeJohnEvent.eventName, eventName.trim(),
                'The eventName expected and actual are not the same');
            assert.deepStrictEqual(removeJohnEvent.description, eventDescription.trim(),
                'The eventDescription expected and actual are not the same');
            assert.ok(removeJohnEvent.eventLocation instanceof Object && !(removeJohnEvent.eventLocation instanceof Array),
                'eventLocation attribute returned is not an object');
            assert.deepStrictEqual(Object.keys(removeJohnEvent.eventLocation).length, 4, 'The number of eventLocation attributes returned is not 4');
            assert.deepStrictEqual(removeJohnEvent.eventLocation.streetAddress, eventLocation.streetAddress.trim(),
                'The eventLocation.streetAddress expected and actual are not the same');
            assert.deepStrictEqual(removeJohnEvent.eventLocation.city, eventLocation.city.trim(),
                'The eventLocation.city expected and actual are not the same');
            assert.deepStrictEqual(removeJohnEvent.eventLocation.state, eventLocation.state.trim(),
                'The eventLocation.state expected and actual are not the same');
            assert.deepStrictEqual(removeJohnEvent.eventLocation.zip, eventLocation.zip.trim(),
                'The eventLocation.zip expected and actual are not the same');
            assert.deepStrictEqual(removeJohnEvent.contactEmail, contactEmail.trim(),
                'The contactEmail expected and actual are not the same');
            assert.deepStrictEqual(removeJohnEvent.maxCapacity, maxCapacity,
                'The maxCapacity expected and actual are not the same');
            assert.deepStrictEqual(removeJohnEvent.priceOfAdmission, priceOfAdmission,
                'The priceOfAdmission expected and actual are not the same');
            assert.deepStrictEqual(removeJohnEvent.eventDate, eventDate.trim(),
                'The eventDate expected and actual are not the same');
            assert.deepStrictEqual(removeJohnEvent.startTime, startTime.trim(),
                'The startTime expected and actual are not the same');
            assert.deepStrictEqual(removeJohnEvent.endTime, endTime.trim(),
                'The endTime expected and actual are not the same');
            assert.deepStrictEqual(removeJohnEvent.publicEvent, publicEvent,
                'The publicEvent expected and actual are not the same');
            assert.deepStrictEqual(removeJohnEvent.totalNumberOfAttendees, 0,
                'The totalNumberOfAttendees expected and actual are not the same');
            // Assert attendees
            assert.ok(removeJohnEvent.attendees instanceof Array, 'The attendees is not returned as an array');
            assert.deepStrictEqual(removeJohnEvent.attendees.length, 0, 'The number of attendees is not exactly zero');
        });
        it('removeAttendee() -> removeAttendeeInEventAttendeeNotFoundFail',  async (t) => {
            firstName = '  John  ';
            lastName = ' Doe \t';
            emailAddress = '   john.doe@hotmail.com';
            const eventWithJohn = await attendeesDataFun.createAttendee('   '.concat(createdEventId.toString(), '   '), firstName,
                lastName, emailAddress);
            const eventWithMary = await attendeesDataFun.createAttendee(createdEventId.toString(), 'mary',
                'Doe', 'mary.doe@hotmail.com');
            const eventWithDario = await attendeesDataFun.createAttendee(createdEventId.toString(), 'Dario',
                'Doe', 'dario.doe@hotmail.com');
            // Assertions:
            await assert.rejects(attendeesDataFun.removeAttendee('653853753a93f9ce35ff9b99'),
                {
                    name: 'Error',
                    message: `Attendee with id '653853753a93f9ce35ff9b99' can not be found in the events database collection`
                }, 'Exception/Error should have been thrown');
        });
    });
})
