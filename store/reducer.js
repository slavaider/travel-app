import {combineReducers} from 'redux';

const initialState = {
    countries: []
}

export const countryReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_DATA': {
            return {
                ...state,
                countries: action.value
            }
        }
        default:
            return {...state}
    }
};

const rootReducer = combineReducers({
    countries: countryReducer
});

export default rootReducer;
