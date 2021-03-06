const admin = require('firebase-admin');
const functions = require('firebase-functions');
const fp = require('lodash/fp');
const lodash = require('lodash');
const firestore = require('@google-cloud/firestore');
const moment = require('moment');
const constants = require('./src/constants');
const common = require('./src/common');

// Need to set config for admin email to be my gmail
const config = functions.config();

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

exports.activeTeam = require('./src/activeTeam');
exports.auth = require('./src/auth');
exports.clubSubs = require('./src/clubSubs');
exports.comments = require('./src/comments');
exports.cup = require('./src/cup');
exports.features = require('./src/features');
exports.firestoreExports = require('./src/firestoreExports');
exports.fixtures = require('./src/fixtures');
exports.highlights = require('./src/highlights');
exports.league = require('./src/league');
exports.listeners = require('./src/listeners');
exports.management = require('./src/management');
exports.notification = require('./src/notification');
exports.onDelete = require('./src/onDelete');
exports.onSignUp = require('./src/onSignUp');
exports.player = require('./src/player');
exports.points = require('./src/points');
exports.profile = require('./src/profile');
exports.team = require('./src/team');
exports.users = require('./src/users');
exports.weeklyTeam = require('./src/weeklyTeam');

// firebase functions:config:set admin.email="pampoomiofennell@gmail.com"
// firebase functions:config:set league.name="ENTER_OVERALL_LEAGUE_NAME"
// firebase functions:config:set bucket.name="ENTER_STORAGE_BUCKET_PREFIX_FOR_BACKUPS"
// setup Facebook login

const operations = admin.firestore.FieldValue;

// https://firebase.google.com/docs/reference/js/firebase.functions.html#functionserrorcod
// https://console.cloud.google.com/functions/list?project=ccafc-fantasy-football&folder=&organizationId=

// config that needs setting
// admin.email
// bucket.name
// league.name

// Collingwood
// Grey
// Hatfield
// John Snow
// Josephine Butler
// Staff
// Stephenson Rangers
// St. Aidan's
// St. Chad's
// St. Cuthbert's
// St. Hild & St. Bede
// St. John's
// St. Mary's
// Trevelyan
// Van Mildert
// University
// Ustinov
