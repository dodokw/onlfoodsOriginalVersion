import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import LoginNavigation from './Navigation/LoginNavigation/LoginNavigation';
import MainNavigation from './Navigation/MainNavigation/MainNavigation';

const Route = () => {
	const {user} = useSelector(store => store.loginReducer);

	return (
		<SafeAreaView style={{flex: 1}} edges={['top', 'left', 'right']}>
			<StatusBar backgroundColor="white" barStyle="dark-content" />
			{user.mt_info.mt_idx === '' ? <LoginNavigation /> : <MainNavigation />}
		</SafeAreaView>
	);
};
export default Route;
