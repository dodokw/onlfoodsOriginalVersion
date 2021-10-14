import React, {useState} from 'react';
import Splash from './Screens/Splash';
import {useEffect} from 'react';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import Route from './Screens/Route';
import RootReducer from './Modules/Reducers';
import {LogBox, Text, TextInput} from 'react-native';
import {composeWithDevTools} from 'redux-devtools-extension';
import {BackHandler} from 'react-native';
import {ToastAndroid} from 'react-native';
import Toast, {BaseToast} from 'react-native-toast-message';
import {ColorRed} from '~/Assets/Style/Colors';

const store = createStore(RootReducer, composeWithDevTools(applyMiddleware()));

// 시스템 폰트 사이즈 조절 방지
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;
LogBox.ignoreLogs(['Warning: ...']);

const toastConfig = {
	success: ({text1, text2, ...rest}) => (
		<BaseToast
			{...rest}
			style={{borderLeftColor: ColorRed}}
			contentContainerStyle={{paddingHorizontal: 15}}
			text1Style={{
				fontSize: 15,
				fontWeight: 'bold',
			}}
			text1={text1}
			text2={text2}
		/>
	),
};

const App = () => {
	const [isLoading, setLoading] = useState(false);
	const [exitApp, setExitApp] = useState(false);

	useEffect(() => {
		const backAction = () => {
			let timeOut;
			if (exitApp) {
				clearTimeout(timeOut);
				BackHandler.exitApp();
			} else {
				setExitApp(true);
				ToastAndroid.show('한번 더 누르시면 종료됩니다.', ToastAndroid.SHORT);
				timeOut = setTimeout(() => {
					setExitApp(false);
				}, 2000);
			}
			return true;
		};

		const backHandler = BackHandler.addEventListener(
			'hardwareBackPress',
			backAction,
		);

		return () => backHandler.remove();
	}, [exitApp]);

	return (
		<Provider store={store}>
			{isLoading ? (
				<Route />
			) : (
				<Splash isLoading={isLoading} setLoading={setLoading} />
			)}
			<Toast config={toastConfig} ref={ref => Toast.setRef(ref)} />
		</Provider>
	);
};

export default App;
