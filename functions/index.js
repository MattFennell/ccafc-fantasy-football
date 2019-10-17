const admin = require('firebase-admin');
const functions = require('firebase-functions');
const fp = require('lodash/fp');
const lodash = require('lodash');
const constants = require('./src/constants');
const common = require('./src/common');

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

exports.auth = require('./src/auth');
exports.league = require('./src/leagues');
exports.team = require('./src/teams');
exports.player = require('./src/players');
exports.activeTeam = require('./src/activeTeam');
exports.weeklyTeam = require('./src/weeklyTeams');
exports.points = require('./src/points');
exports.users = require('./src/users');
exports.listeners = require('./src/listeners');

const operations = admin.firestore.FieldValue;

exports.makeCaptain = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        return db.collection('active-teams').where('user_id', '==', context.auth.uid).get().then(
            result => {
                if (result.size > 1) {
                    throw new functions.https.HttpsError('invalid-argument', 'Server Error. You have multiple active teams');
                }
                if (result.size === 0) {
                    throw new functions.https.HttpsError('invalid-argument', 'Server Error. You don\'t have an active team');
                }
                return result.docs[0].ref.update({
                    captain: data.playerId
                });
            }
        );
    });


exports.fetchActiveTeam = functions
    .region(constants.region)
    .https.onCall((data, context) => {
        common.isAuthenticated(context);
        const activeTeamRef = db.collection('active-teams').where('user_id', '==', data.userId);
        return activeTeamRef.get()
            .then(activeDocs => activeDocs.docs
                .map(doc => (doc.id)))
            .then(documentIds => {
                if (documentIds.length !== 1) {
                    throw new functions.https.HttpsError('not-found', 'Something has gone wrong with your active team');
                }
                return db.collection('active-teams').doc(documentIds[0]).collection('players').get()
                    .then(playerDocs => playerDocs.docs
                        .map(player => ({ ...player.data() })))
                    .then(
                        result => db.collection('active-teams').doc(documentIds[0]).get().then(
                            doc => ({
                                captain: doc.data().captain,
                                players: result
                            })
                        )
                    );
            });
    });

exports.addExtraCaptainPoints = functions.region(constants.region).firestore
    .document('player-points/{id}')
    .onWrite(change => {
        const difference = common.calculateDifference(change.before.data(), change.after.data());
        const points = common.calculatePointDifference(difference,
            change.after.data().position);
        return db.collection('weekly-teams').where('captain', '==', change.after.data().player_id)
            .where('week', '==', change.after.data().week).get()
            .then(result => result.docs.map(weeklyTeam => weeklyTeam.data().user_id))
            .then(
                userIds => {
                    userIds.forEach(uid => {
                        // Add score to user
                        db.collection('users').doc(uid).update({
                            total_points: operations.increment(points)
                        });

                        // Add score to their weekly team
                        db.collection('weekly-teams').where('user_id', '==', uid).where('week', '==', change.after.data().week).get()
                            .then(weeklyTeamDoc => {
                                if (weeklyTeamDoc.size === 0) {
                                    throw new functions.https.HttpsError('not-found', 'User has no weekly team in that week');
                                }
                                if (weeklyTeamDoc.size > 1) {
                                    throw new functions.https.HttpsError('invalid-argument', 'User has too many weekly teams');
                                }
                                weeklyTeamDoc.docs[0].ref.update({
                                    points: operations.increment(points)
                                });
                            });

                        // Add score to their weekly player
                        db.collection('weekly-players').where('user_id', '==', uid).where('player_id', '==', change.after.data().player_id)
                            .where('week', '==', change.after.data().week)
                            .get()
                            .then(weeklyPlayerDoc => {
                                if (weeklyPlayerDoc.size === 0) {
                                    throw new functions.https.HttpsError('not-found', 'Captain was not found for week');
                                }
                                if (weeklyPlayerDoc.size > 1) {
                                    throw new functions.https.HttpsError('invalid-argument', 'Too many captains');
                                }
                                weeklyPlayerDoc.docs[0].ref.update({
                                    points: operations.increment(points)
                                });
                            });

                        db.collection('leagues-points').where('user_id', '==', uid).where('start_week', '<=', change.after.data().week).get()
                            .then(leagueDoc => leagueDoc.docs.forEach(doc => doc.ref.update({
                                user_points: operations.increment(points)
                            })));
                    });
                }
            );
    });
