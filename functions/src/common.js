const functions = require('firebase-functions');

module.exports.isAuthenticated = context => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'You must be authenticated to call this function');
    }
};

// https://firebase.google.com/docs/reference/functions/functions.https.HttpsError