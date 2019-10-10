import fp from 'lodash/fp';

export const getUserInfo = state => state.overview.userInfo;

export const getFetchedUserInfo = state => state.overview.fetchedUserInfo;
export const getFetchingUserInfo = state => state.overview.fetchingUserInfo;

export const getCurrentGameWeek = state => state.overview.currentGameWeek;

export const getUserInfoForWeek = state => fp.getOr({},
    state.overview.currentGameWeek)(state.overview.userInfo);

export const getTotalPoints = state => state.overview.totalPoints;
export const getRemainingBudget = state => state.overview.remainingBudget;
export const getRemainingTransfers = state => state.overview.remainingTransfers;
