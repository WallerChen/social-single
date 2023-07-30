import cloudContainer from '../utils/cloudContainer';

export const getClassmateList = params => cloudContainer('/api/v1/classmate/list', 'GET', params);
export const getUserInfo = params => cloudContainer('/api/v1/user/info', 'GET', params);
export const getUserRegister = params => cloudContainer('/api/v1/user/register', 'GET', params);
export const postUserRegister = params => cloudContainer('/api/v1/user/register', 'POST', params);
export const deleteUserInfoDraft = params => cloudContainer('/api/v1/user/info-draft', 'DELETE', params);
export const postUserInfoDraft = params => cloudContainer('/api/v1/user/info-draft', 'POST', params);
export const publishUserInfo = params => cloudContainer('/api/v1/user/info', 'POST', params);
