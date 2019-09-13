const admin = require('firebase-admin');
const functions = require('firebase-functions');

const db = admin.firestore();

const config = functions.config();

exports.userSignUp = functions
    .region('europe-west2')
    .auth.user()
    .onCreate(user => {
        const userObject = {
            displayName: user.displayName,
            email: user.email,
            total_points: 0,
            remaining_transfers: 0,
            remaining_budget: 100
        };
        // If Facebook provider, assume the email is verified
        db.doc(`users/${user.uid}`).set(userObject)
            .then(() => {
                if (user.providerData.length && user.providerData[0].providerId === 'facebook.com') {
                    admin.auth().updateUser(user.uid, {
                        emailVerified: true
                    });
                }
            })
            .then(() => {
                db.collection('active-teams').add({
                    user_id: user.uid,
                    player_ids: []
                });
            });
        if (user.email === config.admin.email) {
            return admin.auth().setCustomUserClaims(user.uid, {
                admin: true
            });
        }
        return false;
    });
