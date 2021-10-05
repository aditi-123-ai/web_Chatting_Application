import { LOGOUT_USER, SET_USER } from "./userAction";

const initialState = {
    user: null
}

const userReducer = (state = initialState, action) => {
    switch(action.type){
        case SET_USER:
            return{
                user: action.payload
            }
        case LOGOUT_USER:
            return{
                user: null
            }
        default:
            return state;
    }
}

export default userReducer;