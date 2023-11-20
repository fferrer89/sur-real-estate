import {describe, it, beforeEach, before, afterEach, after} from 'node:test';
import assert from 'node:assert/strict'
import {listingData} from '../../data/index.js';
import {closeConnection, dbConnection} from "../../config/mongoConnection.js";
import eventsSetting from 'events';
import {ObjectId} from 'mongodb';