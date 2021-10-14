import {types} from '../Action';

const defaultState = {
	//mt_info : user , slt_info : seller
	user: {
		mt_info: {
			mt_hp: '',
			mt_id: '',
			mt_idx: '',
			mt_image1: null,
			mt_level: 0,
			mt_name: '',
		},
		slt_info: null,
	},
	state: false,
};

const loginReducer = (state = defaultState, action) => {
	switch (action.type) {
		case types.LOGIN:
			return {...state, user: {...state.user, ...action.token}};
		case types.LOGOUT:
			return {...state, user: defaultState.user};
		case types.SELLERON:
			return {...state, state: true};
		case types.SELLEROFF:
			return {...state, state: false};
		case types.CHANGEIMG:
			return {
				...state,
				user: {
					...state.user,
					mt_info: {...state.user.mt_info, mt_image1: action.data},
				},
			};
		case types.CHANGESELLERIMG:
			return {
				...state,
				user: {
					...state.user,
					slt_info: {...state.user.slt_info, slt_image: action.data},
				},
			};
		default:
			return state;
	}
};

export default loginReducer;
