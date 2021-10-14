import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components/native';
import BackButton from '~/Components/BackButton';
import Header from '~/Components/Header';
import {useDispatch, useSelector} from 'react-redux';
import {checkChat, floatingHide} from '~/Modules/Action';
import ChattingComposer from '~/Components/ChattingComponent/ChattingComposer';
import {Platform, RefreshControl, ScrollView} from 'react-native';
import ChattingBox from '~/Components/ChattingComponent/ChattingBox';
import TimeLine from '~/Components/ChattingComponent/TimeLine';
import ChattingOrderList from '~/Components/ChattingComponent/ChattingOrderList';
import {
	APICallChattingDetail,
	APIChatOut,
	APISendComplete,
	APISendConfirm,
	APISendContract,
	APISendImg,
	APISendMessage,
} from '~/API/ChattingAPI/ChattingAPI';
import jwtDecode from 'jwt-decode';
import ChattingImage from '~/Components/ChattingComponent/ChattingImage/ChattingImage';
import {
	FlatList,
	View,
	Dimensions,
	Modal,
	TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import {Alert} from 'react-native';
import ReportModal from '~/Components/Modal/ReportModal';
import LoadingModal from '~/Components/LoadingModal';
import {ColorLowRed, ColorRed} from '~/Assets/Style/Colors';
import {launchImageLibrary} from 'react-native-image-picker';
import {APICallLikeCompany} from '~/API/MainAPI/MainAPI';
import ImageViewModal from '~/Components/Modal/ImageViewModal/ImageViewModal';
import {TouchableOpacity} from 'react-native';

const WIDTH = Dimensions.get('screen').width;
const HEIGHT = Dimensions.get('screen').height;

const Container = styled.SafeAreaView`
	flex: 1;
	background-color: #ffffff;
`;

const ChatArea = styled.KeyboardAvoidingView`
	flex: 1;
`;

const ImageBox = styled.View`
	width: ${WIDTH}px;
	height: ${HEIGHT}px;
	justify-content: center;
	align-items: center;
	background-color: rgba(0, 0, 0, 0.8);
`;
const BigImage = styled.Image`
	width: ${WIDTH}px;
	height: 100%;
`;

const CloseButton = styled.TouchableOpacity`
	position: absolute;
	top: 50px;
	right: 10px;
`;

const ButtonWrap = styled.View`
	position: absolute;
	bottom: ${Platform.OS === 'ios' ? '90px' : '60px'};
	left: 5px;
`;

const FloatingButton = styled.TouchableOpacity`
	/* position: absolute; */
	padding: 10px;
	border-radius: 50px;
	margin-top: 5px;
	margin-bottom: 5px;
	/* top: ${props => props.top}px;
	left: ${props => props.left}px; */
	background-color: ${props => (props.color ? props.color : ColorRed)};
`;

const MenuBackground = styled.View`
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0);
`;

const OutButton = styled.TouchableOpacity``;

const ChattingComponenets = ({
	item,
	user,
	prevUser,
	otherName,
	otherImg,
	setShowModal,
	sendOrderList,
	sendConfirm,
	sendComplete,
	sendCancel,
}) => {
	switch (item.type) {
		case 'timeline':
			return (
				<TimeLine key={`timeline-${item.cdt_date}`} date={item.cdt_date} />
			);

		case 'message':
			return (
				<ChattingBox
					key={`message-${item.cdt_date}`}
					me={item.cdt_sender === user.mt_idx}
					prevUser={prevUser}
					data={item}
					otherImg={otherImg}
					otherName={otherName}
				/>
			);

		case 'image':
			return (
				<ChattingImage
					key={`image-${item.cdt_date}`}
					me={item.cdt_sender === user.mt_idx}
					prevUser={prevUser}
					data={item}
					setShowModal={setShowModal}
					otherImg={otherImg}
					otherName={otherName}
				/>
			);

		case 'orderlist':
			return (
				<ChattingOrderList
					key={`orderList-${item.od_idx}`}
					data={item.cdt_message}
					state={item.state}
					od_idx={item.od_idx}
					showAddress={item.address}
					time={item.cdt_date.split(' ')[1]}
					me={item.cdt_sender === user.mt_idx}
					deliver_type={item.deliver_type}
					sendOrderList={sendOrderList}
					sendConfirm={sendConfirm}
					sendComplete={sendComplete}
					sendCancel={sendCancel}
					exit={otherName === '탈퇴회원'}
				/>
			);
		default:
			return <View style={{flex: 1}}></View>;
	}
};

function ChattingPage({navigation, route}) {
	const user = useSelector(state => state.loginReducer.user.mt_info);
	const chat = useSelector(state => state.dataReducer.chat);
	const isFocus = useIsFocused();
	const chatID = route.params.chatID;
	const [otherImg, setOhterImg] = useState('');
	const [otherName, setOtherName] = useState('');
	const [seller_idx, setSeller_idx] = useState('');
	const [user_idx, setUser_idx] = useState('');
	const dispatch = useDispatch();
	const [chattingData, setChattingData] = useState([]);
	const [texting, setTexting] = useState('');
	const [showModal, setShowModal] = useState('');
	const [showReport, setShowReport] = useState(false);
	const [isLoading, setLoading] = useState(false);
	const [showMenu, setShowMenu] = useState(false);
	const [zzim, setZzim] = useState(false);
	const [delay, setDelay] = useState(false);
	const scrollRef = useRef();
	const [refreshing, setRefreshing] = useState(false);

	let timer;

	const onReport = () => {
		setShowMenu(false);
		setShowReport(true);
	};

	const onZzim = async () => {
		setDelay(true);
		console.log(seller_idx, user_idx);
		try {
			const res = await APICallLikeCompany(seller_idx, user.mt_idx);
			if (res.result === 'true') {
				setZzim(res.data.wst_status === 'Y' ? true : false);
				if (res.data.wst_status === 'Y') {
					Alert.alert('알림', '관심 업체로 등록되었습니다.', [{text: '확인'}]);
				} else {
					Alert.alert('알림', '관심 업체를 해제하였습니다.', [{text: '확인'}]);
				}
			}
		} catch (err) {
			console.log(err);
		}
		setDelay(false);
	};

	const getChattingData = async date => {
		try {
			if (isFocus) {
				const res = await APICallChattingDetail(
					user.mt_idx,
					chatID,
					date ? date : '',
				);
				if (res.result === 'true') {
					const decode = jwtDecode(res.jwt);
					console.log('채팅데이터', decode.data);
					setOhterImg(decode.data.image);
					setOtherName(decode.data.mt_name);
					setSeller_idx(decode.data.mt_idx);
					setUser_idx(user.mt_idx);
					if (decode.data.zzim === 'on') {
						setZzim(true);
					}
					if (date) {
						setChattingData([
							...chattingData,
							...decode.data.chatting.reverse(),
						]);
					} else {
						console.log('불러옴');
						setChattingData(decode.data.chatting.reverse());
					}
				}
			}
		} catch (err) {
			console.error(err);
		}
		setLoading(false);
	};

	const sendMessage = async text => {
		try {
			setChattingData([
				{
					cdt_sender: user.mt_idx,
					type: 'message',
					cdt_message: text,
					cdt_date: 'Loading',
				},
				...chattingData,
			]);
			const res = await APISendMessage(chatID, user.mt_idx, text);
			if (res.result === 'true') {
				setTimeout(() => {
					getChattingData();
				}, 1000);
			} else {
				console.log(res);
				Alert.alert('알림', '메세지를 전달하지 못했습니다.', [{text: '확인'}]);
			}
		} catch (err) {
			console.log();
		}
	};

	const sendImg = async img => {
		try {
			const res = await APISendImg(chatID, user.mt_idx, img);
			if (res.result === 'true') {
				setTimeout(() => {
					getChattingData();
				}, 1000);
			}
		} catch (err) {
			console.error(err);
		}
	};

	const pickImg = () => {
		launchImageLibrary(
			{mediaType: 'photo', quality: 0.5, maxHeight: 1000, maxWidth: 1000},
			response => {
				if (response.didCancel) {
					setShowMenu(false);
					return console.log('취소함');
				} else if (response.error) {
					return console.log(response.error);
				}
				try {
					console.log('Response = ', response.assets);
					const imgs = response.assets[0];
					const imgData = {
						name: imgs.fileName,
						type: imgs.type,
						uri: imgs.uri,
					};
					// You can also display the image using data:
					// const source = { uri: 'data:image/jpeg;base64,' + response.data };
					sendImg(imgData);
					setShowMenu(false);
				} catch (err) {
					console.log(err);
				}
			},
		);
	};

	const sendOrderList = async (od_idx, items) => {
		try {
			const res = await APISendContract(chatID, od_idx, items);
			if (res.result === 'true') {
				setTimeout(() => {
					getChattingData();
				}, 1000);
			} else {
				console.log(res);
			}
		} catch (err) {
			console.error(err.message);
		}
	};

	const sendConfirm = async (od_idx, address, sangse) => {
		try {
			console.log(chatID, od_idx);
			const res = await APISendConfirm(chatID, od_idx, address, sangse);
			if (res.result === 'true') {
				Alert.alert('알림', '주문이 완료 되었습니다.', [{text: '확인'}]);
				setTimeout(() => {
					getChattingData();
				}, 1000);
			} else {
				Alert.alert('알림', res.message, [{text: '확인'}]);
			}
		} catch (err) {
			console.error(err.message);
		}
	};

	const sendComplete = async od_idx => {
		try {
			const res = await APISendComplete('complete', user.mt_idx, od_idx);
			if (res.result === 'true') {
				setTimeout(() => {
					getChattingData();
				}, 1000);
			} else {
				Alert.alert('알림', res.message, [{text: '확인'}]);
			}
		} catch (err) {
			console.error(err.message);
		}
	};

	const sendCancel = async (od_idx, cancel_reason) => {
		try {
			const res = await APISendComplete(
				'cancel',
				user.mt_idx,
				od_idx,
				cancel_reason,
			);
			if (res.result === 'true') {
				setTimeout(() => {
					getChattingData();
				}, 1000);
			} else {
				Alert.alert('알림', res.message, [{text: '확인'}]);
			}
		} catch (err) {
			console.error(err.message);
		}
	};

	const prevUserCheck = (item, index) => {
		if (index === chattingData.length - 1) return true;
		if (chattingData[index + 1].type === 'timeline') return true;
		if (chattingData[index + 1].type === 'orderlist') return true;
		if (item.cdt_sender === chattingData[index + 1].cdt_sender) {
			return false;
		} else {
			return true;
		}
	};

	const ChatOut = async () => {
		try {
			const res = await APIChatOut(user.mt_idx, chatID);
			console.log(res);
			if (res.result === 'true') {
				navigation.goBack();
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		const parent = navigation.dangerouslyGetParent();
		parent?.setOptions({tabBarVisible: false});
		dispatch(floatingHide());
		dispatch(checkChat(true));
		setLoading(true);
		setTimeout(() => {
			getChattingData();
		}, 1000);
		return () => {
			dispatch(checkChat(false));
		};
	}, []);

	useEffect(() => {
		const message = messaging().onMessage(remoteMessage => {
			setTimeout(() => {
				getChattingData();
			}, 1000);
		});
		return message;
	});

	return (
		<Container>
			<Header
				title="채팅"
				headerLeft={<BackButton onPress={() => navigation.goBack(null)} />}
				headerRight={
					<OutButton
						onPress={() =>
							Alert.alert('알림', '채팅방에서 나가시겠습니까?', [
								{text: '나가기', onPress: () => ChatOut()},
								{text: '취소'},
							])
						}>
						<Icon name="log-out" size={20} />
					</OutButton>
				}
				border={true}
			/>
			<ChatArea
				behavior={Platform.OS === 'ios' ? 'padding' : null}
				keyboardVerticalOffset={44}>
				<FlatList
					style={{flex: 1}}
					data={chattingData}
					contentContainerStyle={{paddingTop: 10}}
					keyExtractor={(item, index) => `chat-${index}`}
					renderItem={({item, index}) => (
						<ChattingComponenets
							item={item}
							user={user}
							prevUser={prevUserCheck(item, index)}
							otherImg={otherImg}
							otherName={otherName}
							setShowModal={setShowModal}
							sendOrderList={sendOrderList}
							sendConfirm={sendConfirm}
							sendComplete={sendComplete}
							sendCancel={sendCancel}
						/>
					)}
					ref={scrollRef}
					inverted={true}
					onScroll={event => {
						if (
							event.nativeEvent.contentOffset.y + 1 >
							event.nativeEvent.contentSize.height -
								event.nativeEvent.layoutMeasurement.height
						) {
							const date = chattingData[chattingData.length - 1].cdt_date;
							if (!timer) {
								timer = setTimeout(function () {
									console.log('동작함');
									getChattingData(date);
								}, 500);
							}
						}
					}}
					scrollEventThrottle={16}
					refreshing={true}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={getChattingData}
							tintColor={ColorRed}
						/>
					}
				/>

				<ChattingComposer
					texting={texting}
					setTexting={setTexting}
					onSend={sendMessage}
					onImg={sendImg}
					setShowReport={setShowReport}
					user={user}
					seller_idx={seller_idx}
					zzim={zzim}
					setZzim={setZzim}
					showMenu={showMenu}
					setShowMenu={setShowMenu}
					otherName={otherName === '탈퇴회원'}
				/>
			</ChatArea>

			<ImageViewModal isShow={showModal} setShow={setShowModal} />
			<ReportModal
				visible={showReport}
				setVisible={setShowReport}
				type={user.mt_idx === user_idx ? 'user' : 'seller'}
				slt_idx={user.mt_idx === user_idx ? seller_idx : user_idx}
				mt_idx={user.mt_idx}
			/>
			<LoadingModal visible={isLoading} />
			<Modal
				visible={showMenu}
				transparent={true}
				onRequestClose={() => setShowMenu(false)}>
				<TouchableWithoutFeedback
					onPress={() => setShowMenu(false)}
					style={{flex: 1}}>
					<MenuBackground>
						<ButtonWrap>
							{user && user.mt_idx !== seller_idx && (
								<TouchableOpacity
									style={{
										padding: 10,
										borderRadius: 50,
										marginVertical: 5,
										backgroundColor: ColorRed,
									}}
									disabled={delay}
									onPress={onZzim}>
									<Icon
										name={zzim ? 'user-check' : 'user-plus'}
										size={20}
										color="#ffffff"
									/>
								</TouchableOpacity>
							)}
							<TouchableOpacity
								style={{
									padding: 10,
									borderRadius: 50,
									marginVertical: 5,
									backgroundColor: ColorRed,
								}}
								onPress={pickImg}>
								<Icon name="image" size={20} color="#ffffff" />
							</TouchableOpacity>
							<TouchableOpacity
								style={{
									padding: 10,
									borderRadius: 50,
									marginVertical: 5,
									backgroundColor: ColorRed,
								}}
								onPress={onReport}>
								<Icon name="alert-octagon" size={20} color="#ffffff" />
							</TouchableOpacity>
						</ButtonWrap>
					</MenuBackground>
				</TouchableWithoutFeedback>
			</Modal>
		</Container>
	);
}
export default ChattingPage;
