export const SET_USER_NAME = "SET_USER_NAME";
export const CLEAR_USER_NAME = "CLEAR_USER_NAME";

export const setUserName = (name) => ({
  type: SET_USER_NAME,
  payload: name,
});

export const clearUserName = () => ({
  type: CLEAR_USER_NAME,
});
