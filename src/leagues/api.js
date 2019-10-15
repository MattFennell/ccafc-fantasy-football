import { functionToCall } from '../api/api';

export const getLeaguesIAmIn = () => functionToCall('league-getLeaguesIAmIn')()
    .then(data => data.data.map(league => ({
        id: league.id,
        leagueId: league.data.league_id,
        name: league.data.name,
        startWeek: league.data.start_week,
        userPoints: league.data.user_points,
        position: league.data.position
    })));


export const getUsersInLeague = request => functionToCall('league-orderedUsers')(request)
    .then(data => data.data.map(league => ({
        id: league.id,
        name: league.data.name,
        username: league.data.username,
        userPoints: league.data.user_points,
        position: league.data.position,
        userId: league.data.user_id
    })));


export const createLeague = request => functionToCall('league-createLeague')(request);

export const joinLeague = request => functionToCall('league-joinLeague')(request);

export const leaveLeague = request => functionToCall('league-leaveLeague')(request);
