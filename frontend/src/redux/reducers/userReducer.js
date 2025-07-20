import { SET_USER_NAME, CLEAR_USER_NAME } from "../actions/userActions";

const initialState = {
  name: "",
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_NAME:
      return { ...state, name: action.payload };
    case CLEAR_USER_NAME:
      return { ...state, name: "" };
    default:
      return state;
  }
};

export default userReducer;
