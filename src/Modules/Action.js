import {exp} from 'react-native-reanimated';

export const types = {
	LOGIN: 'LOGIN',
	LOGOUT: 'LOGOUT',
	SELLERON: 'SELLERON',
	SELLEROFF: 'SELLEROFF',
	FLOATINGSHOW: 'FLOATINGSHOW',
	FLOATINGHIDE: 'FLOATINGHIDE',
	SETLOCATION: 'SETLOCATION',
	SETNAVIGATION: 'SETNAVIGATION',
	CHANGEIMG: 'CHANGEIMG',
	CHANGESELLERIMG: 'CHANGESELLERIMG',
	SETTOKEN: 'SETTOKEN',
	SETDISTANCE: 'SETDISTANCE',
	SETSCREEN: 'SETSCREEN',
	CHECKCHAT: 'CHECKCHAT',
	CHATCOUNT: 'CHATCOUNT',
	ALRAMCOUNT: 'ALRAMCOUNT',
	RESET: 'RESET',
};

export function login(token) {
	return {
		type: types.LOGIN,
		token,
	};
}

export function logout() {
	return {
		type: types.LOGOUT,
	};
}
export function saleron() {
	return {
		type: types.SELLERON,
	};
}
export function saleroff() {
	return {
		type: types.SELLEROFF,
	};
}

export function floatingShow() {
	return {
		type: types.FLOATINGSHOW,
	};
}

export function floatingHide() {
	return {
		type: types.FLOATINGHIDE,
	};
}

export function setNavigation(data) {
	return {
		type: types.SETNAVIGATION,
		data,
	};
}

export function settingLocation(data) {
	return {
		type: types.SETLOCATION,
		data,
	};
}

export function setToken(data) {
	return {
		type: types.SETTOKEN,
		data,
	};
}

export function setDistance(data) {
	return {
		type: types.SETDISTANCE,
		data,
	};
}

export function changeImg(data) {
	return {
		type: types.CHANGEIMG,
		data,
	};
}

export function changeSellerImg(data) {
	return {
		type: types.CHANGESELLERIMG,
		data,
	};
}

export function checkChat(data) {
	return {
		type: types.CHECKCHAT,
		data,
	};
}

export function chatCount(data) {
	return {
		type: types.CHATCOUNT,
		data,
	};
}

export function alramCount(data) {
	return {
		type: types.ALRAMCOUNT,
		data,
	};
}

export function setScreen(data) {
	return {
		type: types.SETSCREEN,
		data,
	};
}
export function reset() {
	return {
		type: types.RESET,
	};
}
