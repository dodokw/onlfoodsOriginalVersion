import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '~/Screens/Login/Login';
import Register from '~/Screens/Login/Register/Register';
import FindId from '~/Screens/Login/FindId/FindId';
import FindPw from '~/Screens/Login/FindPw/FindPw';
import Terms from '~/Screens/Login/Terms/Terms';
import Register2 from '~/Screens/Login/Register/Register2';

const Stack = createStackNavigator();

const LoginNavigation = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="Login">
				<Stack.Screen
					name="Login"
					component={Login}
					options={{headerShown: false}}
				/>
				<Stack.Screen
					name="Register"
					component={Register}
					options={{headerShown: false}}
				/>
				<Stack.Screen
					name="Register2"
					component={Register2}
					options={{headerShown: false}}
				/>
				<Stack.Screen
					name="Terms"
					component={Terms}
					options={{headerShown: false}}
				/>

				<Stack.Screen
					name="FindId"
					component={FindId}
					options={{headerShown: false}}
				/>
				<Stack.Screen
					name="FindPw"
					component={FindPw}
					options={{headerShown: false}}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default LoginNavigation;
