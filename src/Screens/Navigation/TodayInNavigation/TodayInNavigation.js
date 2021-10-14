import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import TodayIn from '~/Screens/Main/TodayIn/TodayIn';
import TodayInDetail from '~/Screens/Main/TodayIn/TodayInDetail/TodayInDetail';
import TodayInBannerList from '~/Screens/Main/TodayIn/TodayInBannerList/TodayInBannerList';
import Search from '~/Screens/Main/TodayIn/Search/Search';
import Alram from '~/Screens/Main/TodayIn/Alram/Alram';
import DeliverPickupDetail from '~/Screens/Main/DeliverPickup/DeliverPickupDetail/DeliverPickupDetail';
import SNSSignUp from '~/Screens/Login/SNSSignUp/SNSSignUp';
import ChattingPage from '~/Screens/Main/ChattingList/ChattingPage/ChattingPage';
import TodayEventDetail from '~/Screens/Main/TodayEvent/TodayEventDetail/TodayEventDetail';
import BannerDetail from '~/Screens/Main/TodayIn/TodayInBannerList/BannerDetail';
import CustomService from '~/Screens/Main/Mypage/CustomService/CustomService';
import EnrollQuestion from '~/Screens/Main/Mypage/CustomService/EnrollQuestion.js/EnrollQuestion';
import QuestionDetail from '~/Screens/Main/Mypage/CustomService/QuestionDetail';
import OrderHistory from '~/Screens/Main/Mypage/OrderHistory/OrderHistory';
import LocationSetting from '~/Screens/Main/TodayIn/LocationSetting/LocationSetting';
import {useSelector} from 'react-redux';
import InventoryManagement from '~/Screens/Main/Mypage/InventoryManagement/InventoryManagement';

const Stack = createStackNavigator();

const TodayInNavigation = () => {
	const location = useSelector(state => state.dataReducer.location);
	return (
		<Stack.Navigator initialRouteName="TodayIn">
			<Stack.Screen
				name="TodayIn"
				component={TodayIn}
				options={{headerShown: false}}
			/>
			<Stack.Screen
				name="TodayInDetail"
				component={TodayInDetail}
				options={{headerShown: false}}
			/>
			<Stack.Screen
				name="Alram"
				component={Alram}
				options={{headerShown: false}}
			/>
			<Stack.Screen
				name="LocationSetting"
				component={LocationSetting}
				options={{headerShown: false, gestureEnabled: location ? true : false}}
			/>
			<Stack.Screen
				name="Search"
				component={Search}
				options={{headerShown: false}}
			/>
			<Stack.Screen
				name="BannerList"
				component={TodayInBannerList}
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
				name="SNSSignUp"
				component={SNSSignUp}
				options={{headerShown: false}}
			/>
			<Stack.Screen
				name="ChattingPage"
				component={ChattingPage}
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

export default TodayInNavigation;
