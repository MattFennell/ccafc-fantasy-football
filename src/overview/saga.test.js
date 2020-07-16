import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import * as sagas from './saga';
import * as actions from './actions';
import * as selectors from './selectors';
import { setErrorMessage } from '../errorHandling/actions';

// https://github.com/jfairbank/redux-saga-test-plan - Docs

const api = {
    getUserStats: () => 'stats',
    getMaxGameWeek: () => 5,
    getUserInfoForWeek: () => 'userInfo'
};

describe('Overview saga', () => {
    const alreadyFetchedUserStatsOrInfo = fetched => ({ selector }, next) => {
        if (selector === selectors.alreadyFetchedUserStats) {
            return fetched;
        }
        if (selector === selectors.alreadyFetchedUserInfo) {
            return fetched;
        }
        return next();
    };

    it('getting user stats', () => {
        const action = actions.fetchUserStatsRequest('userId', 3);
        return expectSaga(sagas.getUserStats, api, action)
            .provide([
                {
                    select: alreadyFetchedUserStatsOrInfo(false)
                }
            ])
            .put(actions.fetchUserStatsSuccess('userId', 'stats'))
            .run();
    });

    it('getting user stats error', () => {
        const error = new Error('error');
        const action = actions.fetchUserStatsRequest('userId', 3);
        return expectSaga(sagas.getUserStats, api, action)
            .provide([
                [matchers.call.fn(api.getUserStats), throwError(error)],
                { select: alreadyFetchedUserStatsOrInfo(false) }
            ])
            .put(setErrorMessage('Error Fetching User Stats', error))
            .run();
    });

    it('get max gameweek', () => {
        const action = actions.fetchMaxGameWeekRequest();
        return expectSaga(sagas.getMaxGameWeek, api, action)
            .put(actions.fetchMaxGameWeekSuccess(5))
            .run();
    });

    it('get max gameweek error', () => {
        const error = new Error('error');
        const action = actions.fetchMaxGameWeekRequest();
        return expectSaga(sagas.getMaxGameWeek, api, action)
            .provide([
                [matchers.call.fn(api.getMaxGameWeek), throwError(error)]
            ])
            .put(setErrorMessage('Error Fetching Gameweek', error))
            .run();
    });

    it('getting user info', () => {
        const action = actions.fetchUserInfoForWeekRequest('userId', 3);
        return expectSaga(sagas.getUserInfoForWeek, api, action)
            .provide([
                {
                    select: alreadyFetchedUserStatsOrInfo(false)
                }
            ])
            .put(actions.fetchUserInfoForWeekSuccess('userId', 3, 'userInfo'))
            .run();
    });

    it('getting user info error', () => {
        const error = new Error('error');
        const action = actions.fetchUserInfoForWeekRequest('userId', 3);
        return expectSaga(sagas.getUserInfoForWeek, api, action)
            .provide([
                [matchers.call.fn(api.getUserInfoForWeek), throwError(error)],
                { select: alreadyFetchedUserStatsOrInfo(false) }
            ])
            .put(setErrorMessage('Error Fetching User Info for Week', error))
            .put(actions.cancelFetchingUserInfoForWeek('userId', 3))
            .run();
    });
});
