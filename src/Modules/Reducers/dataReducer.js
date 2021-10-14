import {types} from '../Action';

const defaultState = {
	location: null,
	token: null,
	distance: 20,
	chat: false,
	screen: 'TodayInNav',
	count: 0,
	alram: 0,
};

const dataReducer = (state = defaultState, action) => {
	switch (action.type) {
		case types.SETLOCATION:
			return {...state, location: action.data};
		case types.SETTOKEN:
			return {...state, token: action.data};
		case types.SETDISTANCE:
			return {...state, distance: action.data};
		case types.SETSCREEN:
			return {...state, screen: action.data};
		case types.CHECKCHAT:
			return {...state, chat: action.data};
		case types.CHATCOUNT:
			return {...state, count: action.data};
		case types.ALRAMCOUNT:
			return {...state, alram: action.data};
		case types.RESET:
			return {
				...state,
				location: null,
				distance: 20,
				chat: false,
				screen: 'TodayInNav',
				count: 0,
				alram: 0,
			};
		default:
			return state;
	}
};

export default dataReducer;
