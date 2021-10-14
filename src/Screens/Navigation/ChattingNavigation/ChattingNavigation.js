import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ChattingList from '~/Screens/Main/ChattingList/ChattingList';
import ChattingPage from '~/Screens/Main/ChattingList/ChattingPage/ChattingPage';
import SNSSignUp from '~/Screens/Login/SNSSignUp/SNSSignUp';
import TodayInDetail from '~/Screens/Main/TodayIn/TodayInDetail/TodayInDetail';
import DeliverPickupDetail from '~/Screens/Main/DeliverPickup/DeliverPickupDetail/DeliverPickupDetail';
import TodayEventDetail from '~/Screens/Main/TodayEvent/TodayEventDetail/TodayEventDetail';
import CustomService from '~/Screens/Main/Mypage/CustomService/CustomService';
import EnrollQuestion from '~/Screens/Main/Mypage/CustomService/EnrollQuestion.js/EnrollQuestion';
import QuestionDetail from '~/Screens/Main/Mypage/CustomService/QuestionDetail';
import OrderHistory from '~/Screens/Main/Mypage/OrderHistory/OrderHistory';
import InventoryManagement from '~/Screens/Main/Mypage/InventoryManagement/InventoryManagement';

const Stack = createStackNavigator();

const ChattingNavigation = () => {
	return (
		<Stack.Navigator initialRouteName="ChattingList">
			<Stack.Screen
				name="ChattingList"
				component={ChattingList}
				options={{headerShown: false}}
			/>
			<Stack.Screen
				name="ChattingPage"
				component={ChattingPage}
				options={{headerShown: false}}
			/>
			<Stack.Screen
				name="SNSSignUp"
				component={SNSSignUp}
				options={{headerShown: false}}
			/>
			<Stack.Screen
				name="TodayInDetail"
				component={TodayInDetail}
				options={{headerShown: false}}
			/>
			<Stack.Screen
				name="DeliverPickupDetail"
				component={DeliverPickupDetail}
				options={{headerShown: false}}
			/>
			<Stack.Screen
				name="TodayEventDetail"
				component={TodayEventDetail}
				options={{headerShown: false}}
			/>
			<Stack.Screen
				name="CustomService"
				component={CustomService}
				options={{headerShown: false}}
			/>
			<Stack.Screen
				name="EnrollQuestion"
				component={EnrollQuestion}
				options={{headerShown: false}}
			/>
			<Stack.Screen
				name="QuestionDetail"
				component={QuestionDetail}
				options={{headerShown: false}}
			/>
			<Stack.Screen
				name="OrderHistory"
				component={OrderHistory}
				options={{headerShown: false}}
			/>
			<Stack.Screen
				name="InventoryManagement"
				component={InventoryManagement}
				options={{headerShown: false}}
			/>
		</Stack.Navigator>
	);
};

export default ChattingNavigation;
