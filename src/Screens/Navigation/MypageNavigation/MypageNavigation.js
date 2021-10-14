import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Mypage from '~/Screens/Main/Mypage/Mypage';
import MyProfileEdit from '~/Screens/Main/Mypage/MyProfileEdit/MyProfileEdit';
import RegularCompany from '~/Screens/Main/Mypage/RegularCompany/RegularCompany';
import OrderHistory from '~/Screens/Main/Mypage/OrderHistory/OrderHistory';
import SellerProfileEdit from '~/Screens/Main/Mypage/SellerProfileEdit/SellerProfileEdit';
import InventoryManagement from '~/Screens/Main/Mypage/InventoryManagement/InventoryManagement';
import EventManagement from '~/Screens/Main/Mypage/EventManagement/EventManagement';
import EnrollEvent from '~/Screens/Main/Mypage/EventManagement/EnrollEvent/EnrollEvent';
import RegularCustomer from '~/Screens/Main/Mypage/RegularCustomer/RegularCustomer';
import NoticeList from '~/Screens/Main/Mypage/NoticeList/NoticeList';
import FAQ from '~/Screens/Main/Mypage/FAQ/FAQ';
import PushSetting from '~/Screens/Main/Mypage/PushSetting/PushSetting';
import CustomService from '~/Screens/Main/Mypage/CustomService/CustomService';
import EnrollQuestion from '~/Screens/Main/Mypage/CustomService/EnrollQuestion.js/EnrollQuestion';
import SellerService from '~/Screens/Main/Mypage/SellerService/SellerService';
import EnrollTodayIn from '~/Screens/Main/Mypage/InventoryManagement/HistoryTodayIn/EnrollTodayIn/EnrollTodayIn';
import ExitService from '~/Screens/Main/Mypage/ExitService/ExitService';
import NoticeDetail from '~/Screens/Main/Mypage/NoticeList/NoticeDetail/NoticeDetail';
import TodayEventDetail from '~/Screens/Main/TodayEvent/TodayEventDetail/TodayEventDetail';
import TodayInDetail from '~/Screens/Main/TodayIn/TodayInDetail/TodayInDetail';
import DeliverPickupDetail from '~/Screens/Main/DeliverPickup/DeliverPickupDetail/DeliverPickupDetail';
import SNSSignUp from '~/Screens/Login/SNSSignUp/SNSSignUp';
import ChattingPage from '~/Screens/Main/ChattingList/ChattingPage/ChattingPage';
import QuestionDetail from '~/Screens/Main/Mypage/CustomService/QuestionDetail';
import SellerRegister from '~/Screens/Main/Mypage/SellerRegister/SellerRegister';
import Terms from '~/Screens/Login/Terms/Terms';
import UpdatePW from '~/Screens/Main/Mypage/MyProfileEdit/UpdatePW/UpdataPW';
import EnrollInventory from '~/Screens/Main/Mypage/InventoryManagement/InventoryState/EnrollInventory/EnrollInventory';

const Stack = createStackNavigator();

const MypageNavigation = () => {
	return (
		<Stack.Navigator initialRouteName="Mypage">
			<Stack.Screen
				name="Mypage"
				component={Mypage}
				options={{headerShown: false}}
			/>
			<Stack.Screen
				name="MyProfileEdit"
				component={MyProfileEdit}
				options={{headerShown: false}}
			/>
			<Stack.Screen
				name="UpdatePW"
				component={UpdatePW}
				options={{headerShown: false}}
			/>
			<Stack.Screen
				name="SellerProfileEdit"
				component={SellerProfileEdit}
				options={{headerShown: false}}
			/>
			<Stack.Screen
				name="SellerRegister"
				component={SellerRegister}
				options={{headerShown: false}}
			/>
			<Stack.Screen
				name="RegularCompany"
				component={RegularCompany}
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
			<Stack.Screen
				name="EnrollTodayIn"
				component={EnrollTodayIn}
				options={{headerShown: false}}
			/>
			<Stack.Screen
				name="EnrollInventory"
				component={EnrollInventory}
				options={{headerShown: false}}
			/>
			<Stack.Screen
				name="EventManagement"
				component={EventManagement}
				options={{headerShown: false}}
			/>
			<Stack.Screen
				name="TodayInDetail"
				component={TodayInDetail}
				options={{headerShown: false}}
			/>
			<Stack.Screen
				name="TodayEventDetail"
				component={TodayEventDetail}
				options={{headerShown: false}}
			/>
			<Stack.Screen
				name="DeliverPickupDetail"
				component={DeliverPickupDetail}
				options={{headerShown: false}}
			/>
			<Stack.Screen
				name="EnrollEvent"
				component={EnrollEvent}
				options={{headerShown: false}}
			/>
			<Stack.Screen
				name="RegularCustomer"
				component={RegularCustomer}
				options={{headerShown: false}}
			/>
			<Stack.Screen
				name="PushSetting"
				component={PushSetting}
				options={{headerShown: false}}
			/>
			<Stack.Screen
				name="NoticeList"
				component={NoticeList}
				options={{headerShown: false}}
			/>
			<Stack.Screen
				name="NoticeDetail"
				component={NoticeDetail}
				options={{headerShown: false}}
			/>
			<Stack.Screen name="FAQ" component={FAQ} options={{headerShown: false}} />
			<Stack.Screen
				name="Terms"
				component={Terms}
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
				name="SellerService"
				component={SellerService}
				options={{headerShown: false}}
			/>
			<Stack.Screen
				name="ExitService"
				component={ExitService}
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
		</Stack.Navigator>
	);
};

export default MypageNavigation;
