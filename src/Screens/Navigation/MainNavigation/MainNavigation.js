import React, {useLayoutEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import TodayInNavigation from '../TodayInNavigation/TodayInNavigation';
import TodayEventNavigation from '../TodayEventNavigation.js/TodayEventNavigation';
import DeliverPickupNavigation from '../DeliverPickupNavigation/DeliverPickupNavigation';
import ChattingNavigation from '../ChattingNavigation/ChattingNavigation';
import MypageNavigation from '../MypageNavigation/MypageNavigation';
import {useSelector} from 'react-redux';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ColorLineGrey, ColorLowRed, ColorRed} from '~/Assets/Style/Colors';
import menu1_off from '~/Assets/Images/Menubar/nav_menu01_off.svg';
import menu1_on from '~/Assets/Images/Menubar/nav_menu01_on.svg';
import menu2_off from '~/Assets/Images/Menubar/nav_menu2_off.svg';
import menu2_on from '~/Assets/Images/Menubar/nav_menu2_on.svg';
import menu3_off from '~/Assets/Images/Menubar/nav_menu3_off.svg';
import menu3_on from '~/Assets/Images/Menubar/nav_menu3_on.svg';
import menu4_off from '~/Assets/Images/Menubar/nav_menu4_off.svg';
import menu4_on from '~/Assets/Images/Menubar/nav_menu4_on.svg';
import menu5_off from '~/Assets/Images/Menubar/nav_menu5_off.svg';
import menu5_on from '~/Assets/Images/Menubar/nav_menu5_on.svg';
import {SvgXml} from 'react-native-svg';
import Fab from '~/Components/Fab';
import {View} from 'react-native';
import {Text} from 'react-native';
import {FONTNanumGothicBold} from '~/Assets/Style/Fonts';
import PartnerNavigation from '../PartnerNavigation/PartnerNavigation';

const BottomTab = createBottomTabNavigator();

const MainNavigation = () => {
	const {floating} = useSelector(state => state.componentReducer);
	const user = useSelector(state => state.loginReducer.user);
	const count = useSelector(state => state.dataReducer.count);
	const [isOpen, setIsOpen] = useState(false);

	return (
		<NavigationContainer>
			<BottomTab.Navigator
				tabBarOptions={{
					style: {
						position: 'absolute',
						borderTopRightRadius: 20,
						borderTopLeftRadius: 20,
						borderColor: ColorLineGrey,
						borderWidth: 1,
						elevation: 1,
						zIndex: 1,
					},
					showLabel: false,
				}}
				initialRouteName="TodayInNav">
				<BottomTab.Screen
					name="PartnerNav"
					component={PartnerNavigation}
					options={{
						tabBarIcon: ({focused}) =>
							focused ? <SvgXml xml={menu1_on} /> : <SvgXml xml={menu1_off} />,
					}}
				/>
				<BottomTab.Screen
					name="ChattingNav"
					component={ChattingNavigation}
					options={{
						tabBarIcon: ({focused}) =>
							focused ? (
								<View>
									<SvgXml xml={menu2_on} />
									{count > 0 && (
										<View
											style={{
												position: 'absolute',
												top: -3,
												right: -14,
												width: 26,
												backgroundColor: ColorRed,
												borderRadius: 50,
												padding: 3,
												borderWidth: 0.5,
												borderColor: '#ffffff',
												alignItems: 'center',
											}}>
											<Text
												style={{
													color: '#ffffff',
													fontSize: 10,
													fontFamily: FONTNanumGothicBold,
												}}>
												{count > 99 ? '99+' : count}
											</Text>
										</View>
									)}
								</View>
							) : (
								<View>
									<SvgXml xml={menu2_off} />
									{count > 0 && (
										<View
											style={{
												position: 'absolute',
												top: -3,
												right: -14,
												width: 26,
												backgroundColor: ColorRed,
												borderRadius: 50,
												padding: 3,
												borderWidth: 0.5,
												borderColor: '#ffffff',
												alignItems: 'center',
											}}>
											<Text
												style={{
													color: '#ffffff',
													fontSize: 10,
													fontFamily: FONTNanumGothicBold,
												}}>
												{count > 99 ? '99+' : count}
											</Text>
										</View>
									)}
								</View>
							),
					}}
				/>
				<BottomTab.Screen
					name="TodayInNav"
					component={TodayInNavigation}
					options={{
						tabBarIcon: ({focused}) =>
							focused ? <SvgXml xml={menu3_on} /> : <SvgXml xml={menu3_off} />,
					}}
				/>
				<BottomTab.Screen
					name="DeliverPickupNav"
					component={DeliverPickupNavigation}
					options={{
						tabBarIcon: ({focused}) =>
							focused ? <SvgXml xml={menu4_on} /> : <SvgXml xml={menu4_off} />,
					}}
				/>
				
				<BottomTab.Screen
					name="MyPageNav"
					component={MypageNavigation}
					options={{
						tabBarIcon: ({focused}) =>
							focused ? <SvgXml xml={menu5_on} /> : <SvgXml xml={menu5_off} />,
					}}
				/>
			</BottomTab.Navigator>
			{floating && user.slt_info !== null && (
				<Fab
					isOpen={isOpen}
					setIsOpen={setIsOpen}
					onPress={() => setIsOpen(!isOpen)}
				/>
			)}
		</NavigationContainer>
	);
};

export default MainNavigation;
