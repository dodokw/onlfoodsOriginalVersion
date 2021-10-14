import {combineReducers} from 'redux';
import loginReducer from './loginReducer';
import componentReducer from './componentReducer';
import dataReducer from './dataReducer';

const RootReducer = combineReducers({
	loginReducer,
	componentReducer,
	dataReducer,
});

export default RootReducer;
