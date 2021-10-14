import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import TodayEvent from '~/Screens/Main/TodayEvent/TodayEvent';
import TodayEventDetail from '~/Screens/Main/TodayEvent/TodayEventDetail/TodayEventDetail';
import SmallBannerList from '~/Screens/Main/TodayEvent/SmallBannerList/SmallBannerList';
import DeliverPickupDetail from '~/Screens/Main/DeliverPickup/DeliverPickupDetail/DeliverPickupDetail';
import ChattingPage from '~/Screens/Main/ChattingList/ChattingPage/ChattingPage';
import TodayInDetail from '~/Screens/Main/TodayIn/TodayInDetail/TodayInDetail';
import BannerDetail from '~/Screens/Main/TodayIn/TodayInBannerList/BannerDetail';
import CustomService from '~/Screens/Main/Mypage/CustomService/CustomService';
import EnrollQuestion from '~/Screens/Main/Mypage/CustomService/EnrollQuestion.js/EnrollQuestion';
import QuestionDetail from '~/Screens/Main/Mypage/CustomService/QuestionDetail';
import OrderHistory from '~/Screens/Main/Mypage/OrderHistory/OrderHistory';
import InventoryManagement from '~/Screens/Main/Mypage/InventoryManagement/InventoryManagement';

const Stack = createStackNavigator();

const TodayEventNavigation = () => {
	return (
		<Stack.Navigator initialRouteName="TodayEvent">
			<Stack.Screen
				name="TodayEvent"
				component={TodayEvent}
				options={{headerShown: false}}
			/>
			<Stack.Screen
				name="TodayEventDetail"
				component={TodayEventDetail}
				options={{headerShown: false}}
			/>
			<Stack.Screen
				name="BannerList"
				component={SmallBannerList}
				options={{headerShown: false}}
			/>
			<Stack.Screen
				name="BannerDetail"
				component={BannerDetail}
				options={{headerShown: false}}
			/>
			<Stack.Screen
				name="DeliverPickupDetail"
				component={DeliverPickupDetail}
				options={{headerShown: false}}
			/>
			<Stack.Screen
				name="ChattingPage"
				component={ChattingPage}
				options={{headerShown: false}}
			/>
			<Stack.Screen
				name="TodayInDetail"
				component={TodayInDetail}
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

export default TodayEventNavigation;
