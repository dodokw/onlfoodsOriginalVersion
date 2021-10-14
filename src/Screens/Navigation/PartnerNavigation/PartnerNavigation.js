import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import PartnerList from '~/Screens/Main/PartnerList/PartnerList';
import PartnerProfile from '~/Screens/Main/PartnerList/PartnerProfile';
import ChattingPage from '~/Screens/Main/ChattingList/ChattingPage/ChattingPage';
import ChattingList from '~/Screens/Main/ChattingList/ChattingList';
import DeliverPickupDetail from '~/Screens/Main/DeliverPickup/DeliverPickupDetail/DeliverPickupDetail';
import MyProfileEdit from '~/Screens/Main/Mypage/MyProfileEdit/MyProfileEdit';
import SellerRegister from '~/Screens/Main/Mypage/SellerRegister/SellerRegister';
import SellerService from '~/Screens/Main/Mypage/SellerService/SellerService';

const Stack = createStackNavigator();

const PartnerNavigation = () => {
    return (
        <Stack.Navigator initialRouteName="DeliverPickup">
        <Stack.Screen
            name="PartnerList"
            component={PartnerList}
            options={{headerShown: false}}
        />
        <Stack.Screen
            name="PartnerProfile"
            component={PartnerProfile}
            options={{headerShown: false}}
        />
        <Stack.Screen
			name="ChattingPage"
			component={ChattingPage}
			options={{headerShown: false}}
		/>
        <Stack.Screen
            name="DeliverPickupDetail"
            component={DeliverPickupDetail}
            options={{headerShown: false}}
        />
        <Stack.Screen
            name="ChattingList"
            component={ChattingList}
            options={{headerShown: false}}
        />
        <Stack.Screen
            name="MyProfileEdit"
            component={MyProfileEdit}
            options={{headerShown: false}}
        />
        <Stack.Screen
            name="SellerRegister"
            component={SellerRegister}
            options={{headerShown: false}}
        />
        <Stack.Screen
            name="SellerService"
            component={SellerService}
            options={{headerShown: false}}
        />
        </Stack.Navigator>
    );
};
export default PartnerNavigation;
