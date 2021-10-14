import {types} from '../Action';

const componentReducer = (
	state = {bottomtab: true, floating: true, navigation: null},
	action,
) => {
	switch (action.type) {
		case types.BOTTOMTABSHOW:
			return {...state, bottomtab: true};
		case types.BOTTOMTABHIDE:
			return {...state, bottomtab: false};
		case types.FLOATINGSHOW:
			return {...state, floating: true};
		case types.FLOATINGHIDE:
			return {...state, floating: false};
		case types.SETNAVIGATION:
			return {...state, navigation: action.data};
		default:
			return state;
	}
};

export default componentReducer;
