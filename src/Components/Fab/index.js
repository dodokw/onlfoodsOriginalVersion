import React, {useEffect, useRef} from 'react';
import {Alert} from 'react-native';
import {Animated, Easing, Platform} from 'react-native';
import Svg, {G, Line, SvgXml} from 'react-native-svg';
import {useSelector} from 'react-redux';
import styled from 'styled-components/native';
import ic_box from '~/Assets/Images/ic_box.svg';
import ic_eventtime from '~/Assets/Images/ic_eventtime.svg';
import {FONTNanumGothicExtraBold} from '~/Assets/Style/Fonts';

const MainButton = styled.TouchableOpacity``;
const Overlay = styled.View`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: 'rgba(0,0,0,0.5)';
`;

const MiniBox1 = styled.View`
	position: absolute;
	bottom: ${Platform.OS === 'android' ? '120px' : '180px'};
	right: 27px;
	justify-content: center;
	align-items: center;
	flex-direction: row;
`;

const MiniBox2 = styled.View`
	position: absolute;
	bottom: ${Platform.OS === 'android' ? '170px' : '230px'};
	right: 27px;
	justify-content: center;
	align-items: center;
	flex-direction: row;
`;

const MiniLabel = styled.Text`
	color: #ffffff;
	font-family: ${FONTNanumGothicExtraBold};
	font-size: 18px;
	margin-right: 10px;
`;

const MiniButton = styled.TouchableOpacity`
	justify-content: center;
	align-items: center;
	background-color: #f06f77;
	width: 35px;
	height: 35px;
	border-radius: 50px;
`;

const Fab = ({isOpen, setIsOpen, onPress}) => {
	const navigation = useSelector(state => state.componentReducer.navigation);
	const user = useSelector(state => state.loginReducer.user.mt_info);
	const spinValue = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		Animated.timing(spinValue, {
			toValue: isOpen ? 1 : 0,
			duration: 300,
			easing: Easing.linear,
			useNativeDriver: true,
		}).start();
	});

	const spin = spinValue.interpolate({
		inputRange: [0, 1],
		outputRange: ['0deg', '45deg'],
	});

	return (
		<>
			{isOpen && <Overlay />}
			{isOpen && (
				<>
					<MiniBox1>
						<MiniLabel>품목관리</MiniLabel>
						<MiniButton
							onPress={() => {
								setIsOpen(false);
								navigation.navigate('MyPageNav', {
									screen: 'InventoryManagement',
									initial: false,
								});
							}}>
							<SvgXml xml={ic_box} />
						</MiniButton>
					</MiniBox1>
					<MiniBox2>
						<MiniLabel>공지관리</MiniLabel>
						<MiniButton
							onPress={() => {
								setIsOpen(false);
								{
									if (user.mt_level == 4)
										Alert.alert('알림', '유료판매자만 사용 가능합니다.', [
											{text: '확인'},
										]);
									else
										navigation.navigate('MyPageNav', {
											screen: 'EventManagement',
											initial: false,
										});
								}
							}}>
							<SvgXml xml={ic_eventtime} />
						</MiniButton>
					</MiniBox2>
				</>
			)}
			<Animated.View
				style={{
					position: 'absolute',
					bottom: Platform.OS === 'ios' ? 100 : 60,
					right: 20,
					width: 50,
					height: 50,
					borderRadius: 50,
					justifyContent: 'center',
					alignItems: 'center',
					backgroundColor: isOpen ? '#ffffff' : '#f06f77',
					transform: [{rotate: spin}],
				}}>
				<MainButton onPress={onPress}>
					<Svg
						xmlns="http://www.w3.org/2000/svg"
						width="27.799"
						height="27.799"
						viewBox="0 0 27.799 27.799">
						<G
							id="그룹_75"
							data-name="그룹 75"
							transform="translate(-690.025 -169.595) rotate(-45)">
							<Line
								id="선_33"
								data-name="선 33"
								x2="14"
								y2="14"
								transform="translate(361 620.5)"
								fill="none"
								stroke={isOpen ? '#f06f77' : '#fff'}
								strokeLinecap="round"
								strokeWidth="4"
							/>
							<Line
								id="선_34"
								data-name="선 34"
								x1="14"
								y2="14"
								transform="translate(361 620.5)"
								fill="none"
								stroke={isOpen ? '#f06f77' : '#fff'}
								strokeLinecap="round"
								strokeWidth="4"
							/>
						</G>
					</Svg>
				</MainButton>
			</Animated.View>
		</>
	);
};

export default Fab;
