import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
   Text,
   View,
   Alert,
   Button,
   TouchableOpacity,
   Image,
   LogBox,
   Share,
} from 'react-native';
import Contacts from 'react-native-contacts';
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import {APICallOrderStart} from '~/API/MainAPI/MainAPI';
import Header from '~/Components/Header';
import styled from 'styled-components/native';
import PartnerCard from '~/Components/PartnerCard/PartnerCard';
import {FlatList} from 'react-native-gesture-handler';
import {ScrollView} from 'react-native';
import {APICallFriendList} from '~/API/MainAPI/MainAPI';
import {originURL, secretKey, testURL} from '~/API/default';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PartnerProfile from './PartnerProfile';
import Icon from 'react-native-vector-icons/Feather';
import {ColorLineGrey, ColorRed} from '~/Assets/Style/Colors';
import {floatingHide, floatingShow, setScreen} from '~/Modules/Action';
import {useIsFocused} from '@react-navigation/core';
import {FONTNanumGothicRegular} from '~/Assets/Style/Fonts';
import ServiceInfo from '~/Screens/Main/Mypage/SellerRegister/ServiceInfo';
import Sharing from '~/Tools/Share';
import { phoneReg, phoneReg2 } from '~/Tools/Reg';
import jwtDecode from 'jwt-decode';
import { APICallMemberInfo } from '~/API/MyPageAPI/MyPageAPI';
import LoadingSpinner from '~/Components/LoadingSpinner';

const SubscribeButton =styled.TouchableOpacity`
border-width: 1px;
border-color: #eee;
padding: 5px 10px;
justify-content: center;
align-items: center;
margin-left: 5px;
`;

const SubscribeLabel = styled.Text`
   font-size: 13px;
   color: #7b7b7b;
`;

const Container = styled.View`
   flex: 1;
   background-color: #ffffff;
`;

const HeaderRightWrap = styled.View`
   flex-direction: row;
   align-items: center;
`;
const ShareButton = styled.TouchableOpacity`
   margin-right: 10px;
`;

const RefreshButton = styled.TouchableOpacity`
   margin-right: 5px;
`;

const SearchButton = styled.TouchableOpacity``;

const MyProfileWrap = styled.TouchableOpacity`
   flex-direction: row;
   align-items: center;
   justify-content: space-between;
   margin: 10px 10px;
`;

const MyProfile = styled.View`
   flex-direction: row;
   align-items: center;
`;

const MyInfoWrap = styled.View`
   margin: 0 10px;
`;
const MyImageBox = styled.View`
   position: relative;
   width: 40px;
   height: 40px;
   align-items: center;
   justify-content: center;
   border-radius: 30px;
   border-width: 1px;
   border-color: #dfdfdf;
`;
const MyTitleLabel = styled.Text``;

const MyGradeWrap = styled.View`
   flex-direction: row;
   align-items: center;
`;
const MyGradeLabel = styled.Text`
   font-family: ${FONTNanumGothicRegular};
   font-size: 13px;
   color: #7b7b7b;
`;

const RedLabel = styled.Text`
   color: #ec636b;
   font-size: 12px;
   font-weight: bold;
`;

const PartnerTypeWrap = styled.View`
   border-top-width: 1px;
   border-color: #dfdfdf;
`;
const TypeTitle = styled.View`
   flex-direction: row;
   justify-content: space-between;
   padding: 10px 10px;
   border-top-left-radius: 20px;
`;
const PartnerTypeLabel = styled.Text``;

const PartnerList = ({navigation}) => {
	const [companyDetail, setCompanyDetail] = useState([]);
	const [partnerDetail, setPartnerDetail] = useState([]);
	const [memberType, setMemberType] = useState();

	const [showSub, setShowSub] = useState(false);
	const [showProfile, setShowProfile] = useState(false);

	const [friendNum, setFriendNum] = useState([]);
	const [datas, setDatas] = useState([]);
	const [contactLoading, setContackLoading] = useState(false);
	const [loading, setLoading] = useState(false);
	const [item, setItem] = useState([
		// { idx: '', hp: '', id: '', name: '', img: ''},
	]);
	const timeout = 3000;
	const [loadingData, setLoadingData] = useState(false);
	const user = useSelector(state => state.loginReducer.user.mt_info);
	const [userSellerInfo, setUserSellerInfo] = useState();
	const [userProfileInfo, setUserProfileInfo] = useState([]);
	const [userProfileInfoMap, setUserProfileInfoMap] = useState([]);
	const [bizFriend, setBizFriend] = useState([]);
	const [bizFriendData, setBizFriendData] = useState([]);

	const [companyListData, setCompanyListData] = useState([]);
	const [apiAlarm, setApiAlarm] = useState(false);
	const [companyN, setCompanyN] = useState('??? ??????');
	const [companyBizNum, setCompanyBizNum] = useState('');
	const [companyBizHp, setCompanyBizHp] = useState('');
	const [companyOpen, setCompanyOpen] = useState(true);
	const [partnerOpen, setPartnerOpen] = useState(true);

	const dispatch = useDispatch();
	const isFocused = useIsFocused();
	console.log(datas);
	console.log(user.mt_idx + '????????? ????????? ??????????????? ??????????????????.');

	const checkSubscribe = async () => {
		try {
			const res = await APICallMemberInfo(user.mt_idx);
			const decode = jwtDecode(res.jwt);
			console.log(decode.data);
			if (
				decode.data.slt_file1 === '' ||
				decode.data.slt_file2 === '' 
				// decode.data.slt_file3 === ''
			) {
				Alert.alert(
					'??????',
					'????????? ?????? ????????? ????????????. ?????? ?????? ??? ?????? ????????? ????????????.',
					[
						{text: '??????', onPress: () => navigation.navigate('MyProfileEdit')},
						{text: '??????'},
					],
				);
			} else {
				const address = {
					zip: decode.data.slt_zip,
					address: decode.data.slt_addr,
					sangse: decode.data.slt_addr2,
					lat: decode.data.slt_lat,
					lng: decode.data.slt_lng,
					dong: decode.data.slt_dong,
				};
				navigation.navigate('SellerRegister', {address: address});
			}
		} catch (error) {
			console.error(error);
		}
	};

	const myFunc = item => {
		setShowProfile(true);
		setPartnerDetail(item);
		//setUserProfileInfo(userProfileInfo => [...userProfileInfo ,res.data[0]]);
		setMemberType(0);
	};
	const companyFunc = item => {
		setShowProfile(true);
		setPartnerDetail(item);
		setMemberType(1);
	};
	const partnerFunc = item => {
		setShowProfile(true);
		setPartnerDetail(item);
		setMemberType(2);
	};

	useEffect(() => {
		console.log('----------------------??????-------------------------------');
		console.log(friendNum);
		console.log('----------------------?????????-------------------------------');
	}, [friendNum])
/*
[{"company": "", "department": "", "displayName": "aaa", "emailAddresses": [], "familyName": "", "givenName": "aaa", "hasThumbnail": false, "imAddresses": [], "jobTitle": "", "middleName": "", "note": "", "phoneNumbers": [[Object]], "postalAddresses": [], "prefix": null, "rawContactId": "248", "recordID": "248", "suffix": null, "thumbnailPath": "", "urlAddresses": []}, {"company": "", "department": "", "displayName": "bbb", "emailAddresses": [], "familyName": "", "givenName": "bbb", "hasThumbnail": false, "imAddresses": [], "jobTitle": "", "middleName": "", "note": "", "phoneNumbers": [[Object]], "postalAddresses": [], "prefix": null, "rawContactId": "249", "recordID": "249", "suffix": null, "thumbnailPath": "", "urlAddresses": []}, {"company": "", "department": "", "displayName": "Nji", "emailAddresses": [], "familyName": "", "givenName": "Nji", "hasThumbnail": false, "imAddresses": [], "jobTitle": "", "middleName": "", "note": "", "phoneNumbers": [[Object]], "postalAddresses": [], "prefix": null, "rawContactId": "250", "recordID": "250", "suffix": null, "thumbnailPath": "", "urlAddresses": []}, {"company": "", "department": "", "displayName": "Seller", "emailAddresses": [], "familyName": "", "givenName": "Seller", "hasThumbnail": false, "imAddresses": [], "jobTitle": "", "middleName": "", "note": "", "phoneNumbers": [[Object]], "postalAddresses": [], "prefix": null, "rawContactId": "251", "recordID": "251", "suffix": null, "thumbnailPath": "", "urlAddresses": []}, {"company": "", "department": "", "displayName": "Zzzz", "emailAddresses": [], "familyName": "", "givenName": "Zzzz", "hasThumbnail": false, "imAddresses": [], "jobTitle": "", "middleName": "", "note": "", 
"phoneNumbers": [[Object]], "postalAddresses": [], "prefix": null, "rawContactId": "252", "recordID": "252", "suffix": null, "thumbnailPath": "", "urlAddresses": []}]
*/
	const getContacts = () => {
		setContackLoading(true);
		try {
			Contacts.getAll().then((contacts) => {
				// console.log(contacts.phoneNumbers[0].number);
				setFriendNum(
					contacts.map((item) =>
						item?.phoneNumbers[0]?.number.replace(
							/(\d{3})(\d{4})(\d)/,
							'$1-$2-$3',	
						),
					),
				);
			});
		} catch {
			err => {
				console.error(err);
				throw err;
			};
		}
		setContackLoading(false);
	};
	// useEffect(() => {
	// 	console.log(friendNum);
	// 	const text = "01077777777";
	// 	console.log("010-1234-5678".replace(/(\d{3})(\d{4})(\d)/, "$1-$2-$3"));
	// }, [friendNum])
	const getUserSellerInfo = async () => {
		const idx = user.mt_idx;
		const form = new FormData();
		form.append('secretKey', secretKey);
		form.append('idx', idx);

		const res = await axios.post(originURL+'bizNumSame_friend_search.php', form);
		if (res.data.result === 'true') {
            const decode = jwtDecode(res.data.jwt);
			console.log('----------------------------------??????---------------------------------');
			console.log(decode);
			console.log(decode[0]);
			console.log(decode.data.slt_company_num);
			console.log(decode.data);
			console.log('-----------------------------------??????-------------------------------');
		setUserSellerInfo(decode.data.slt_company_num);
		setUserProfileInfo([decode.data]);
		}
	}
		


			const datacheck = () => {
				// try{
				// 	setItem(
				// 	   datas.map(({ mt_idx, slt_store_name, slt_company_num, slt_company_boss,mt_id, mt_name, mt_hp, slt_image, mt_addr, mt_addr2 }) => ({
				// 		 idx: mt_idx,
				// 		 name: slt_store_name,
				// 		 company_num: slt_company_num,
				// 		 company_position: slt_company_boss, //????????????
				// 		 id: mt_id,
				// 	   //   user: mt_id,
				// 		 //?????? ?????????...
				// 		 p_name: mt_name,
				// 		 img: slt_image,
				// 		 hp: mt_hp,
				// 		 addr: mt_addr,
				// 		 addr2: mt_addr2,
				// 	   }))
				// 	  );
				// 	  // console.log(item);
				// }catch(err){
				// 	console.log(err);
				// }

		try {
			setCompanyListData(
				datas.map(
					({
						mt_idx,
						slt_store_name,
						slt_company_num,
						slt_company_boss,
						slt_company_type,
						slt_company_status,
						mt_id,
						mt_name,
						mt_hp,
						mt_image1,
						mt_addr,
						mt_addr2,
					}) => ({
						idx: mt_idx,
						name: slt_store_name,
						company_num: slt_company_num,
						company_position: slt_company_boss,
						company_type: slt_company_type,
						company_status: slt_company_status,
						id: mt_id,
						//   user: mt_id,
						//?????? ?????????...
						p_name: mt_name,
						img: mt_image1,
						hp: mt_hp,
						addr: mt_addr,
						addr2: mt_addr2,
					}),
				),
			);
		} catch (err) {
			console.log(err);
		}

		try {
			setUserProfileInfoMap(
				userProfileInfo.map(
					({
						mt_idx,
						slt_store_name,
						slt_company_num,
						mt_name,
						mt_hp,
						mt_image1,
						mt_addr,
						mt_addr2,
					}) => ({
						idx: mt_idx,
						name: mt_name,
						company_num: slt_company_num,
						//   user: mt_id,
						//?????? ?????????...
						// p_name: mt_name,
						img: mt_image1,
						hp: mt_hp,
						addr: mt_addr,
						addr2: mt_addr2,
					}),
				),
			);
		} catch (err) {
			console.log(err);
		}
	};

	const datacheck2 = () => {
		try {
			setBizFriendData(
				bizFriend.map(
					({
						mt_idx,
						slt_store_name,
						mt_name,
						slt_company_boss,
						slt_company_num,
						slt_company_type,
						slt_company_status,
						mt_id,
						mt_hp,
						mt_image1,
						slt_addr,
						slt_addr2,
					}) => ({
						idx: mt_idx,
						companyName: slt_store_name,
						name: mt_name,
						//company_num: slt_company_num, //????????? ????????? ????????? ????????? ??????
						company_position: slt_company_boss, //??????
						company_type: slt_company_type,
						company_status: slt_company_status,
						id: mt_id,
						//   user: mt_id,
						//?????? ?????????...
						img: mt_image1,
						hp: mt_hp,
						addr: slt_addr,
						addr2: slt_addr2,
					}),
				),
			);
		} catch (err) {
			console.log(err);
		}
		console.log('????????????');
	};
	// const testApi = async () => {
	// 	setLoading(true);
	// 	const form = new FormData();
	// 	form.append(secretKey, 'secretKey');
	// 	const res = axios.post('https://onlfoods.com/api/', form);
	// 	console.log(res.data);
	// 	friendNum.map(item => {
	// 		const phone = item
	// 	res.data.map(items => {
	// 		if(item === items.mt_hp){
	// 			setDatas(items);
	// 		}
	// 	})
	// 	})
	// }



	const sendPhoneNumAPI = async () => {
		setLoading(true);
		for(var i = 0; i < friendNum.length; i++){
		  try{
		  const form = new FormData();
		  form.append('secretKey', secretKey);
		  form.append('phoneNum', friendNum[i]);
		//   form.append('userBizNum', userSellerInfo);
		  const res = await axios.post(originURL+'friend_search.php', form);
		  const decode = jwtDecode(res.data.jwt);
		  if(decode.data !== null && decode.data.mt_idx !== user.mt_idx && decode.data.slt_company_num !== userSellerInfo){
			  setDatas(datas => [...datas, decode.data]);
		  }
		  }catch(err){
			  console.log('????????? ????????????!!');
		  }
		}
		setApiAlarm(true);
		setLoading(false);
		// Alert.alert(
		// 	"????????????????????? ??????????????????! ?????? ?????? ????????? ?????? ?????? ????????? ???????????????.",
		// 	"**********",
		// 	[
		// 	  {
		// 		text: "??????",
		// 		onPress: () => setApiAlarm(true),
		// 		// onPress: () => sendCompanyNumAPI(),
		// 		// style: "cancel"
		// 	  },
		// 	]
		//   );
	};

	const sendCompanyNumAPI = async () => {
		setLoading(true);
		const form = new FormData();
		console.log(userSellerInfo);
		const slt_company_num = userSellerInfo;
		console.log(slt_company_num);
		form.append('slt_company_num', slt_company_num);
		form.append('userMt_idx', user.mt_idx);
		const res = await axios.post(
			originURL+'onBizNumSame.php',
			form,
		);
		console.log(res.data);
		if (res.data !== null) {
			for (var i = 0; i < res.data.length; i++) {
				try {
					let temp = res.data[i].mt_hp;
					//??????????????? ????????? ???????????? ??????????????? ????????? ????????????
					if (friendNum.map(x => temp.includes(x)).includes(true) === true) {
						setBizFriend(bizFriend => [...bizFriend, res.data[i]]);
					}
				} catch (err) {
					console.log(err);
				}
			}

			// setBizFriend(res.data);
			console.log(bizFriend);
		} else {
			console.log('????????????????????????....');
		}
		setLoading(false);
	};

	const _storeData = async () => {
		try {
			await AsyncStorage.setItem('key', JSON.stringify(datas), () => {
				console.log('????????? ??????');
			});
		} catch (error) {
			console.log(error);
		}
	};

	const _storeData2 = async () => {
		try {
			await AsyncStorage.setItem('biz', JSON.stringify(bizFriend), () => {
				console.log('????????? ??????');
			});
		} catch (error) {
			console.log(error);
		}
	};

	const _storeData3 = async () => {
		try {
			await AsyncStorage.setItem('me', JSON.stringify(userProfileInfo), () => {
				console.log('????????? ??????');
			});
		} catch (error) {
			console.log(error);
		}
	};

	const clearStroage = async () => {
		try {
			await AsyncStorage.removeItem('key');
			await AsyncStorage.removeItem('biz');
			await AsyncStorage.removeItem('me');
			setCompanyListData('');
			setDatas('');
			setBizFriendData('');
			setBizFriend('');
			setCompanyN('');
			setCompanyBizNum('');
			setApiAlarm(false);
			getContacts();
		} catch (err) {
			console.log(err);
		}
	};

	const refreshAlert = () => {
		Alert.alert('[??????]', '?????????/????????? ?????? ????????? ???????????? ???????????????????', [
			{
				text: '??????',
				onPress: () => console.log('?????????????????????.'),
				style: 'cancel',
			},
			{text: 'OK', onPress: () => clearStroage()},
		]);
	};

	useEffect(async () => {
		if (isFocused) {
			try {
				await AsyncStorage.getItem('key', function (err, result) {
					const data = JSON.parse(result);
					if (
						data === null ||
						data === [] ||
						data === 'undefined' ||
						data === ''
					) {
						getContacts();
						console.log('???????????????????????????');
					} else {
						setDatas(data);
						// setBizFriendData(bizFriend);
						console.log('?????????????????????????????????');
					}
				});
			} catch (err) {
				console.log(err);
			}
		}

		// 		getContacts();
		// 	}else{
		// 		setDatas(datases);
		// 		????????????
		// 	}
		// }catch(error){
		// 	console.log(error);
		// }
	}, [isFocused]);

	useEffect(() => {
		if (isFocused) {
			getUserSellerInfo();
			const parent = navigation.dangerouslyGetParent();
			parent?.setOptions({tabBarVisible: true});
			dispatch(floatingShow());
			dispatch(setScreen('PartnerNav'));
		}
	}, [isFocused]);
	//ScrollView????????? FlatList?????? ????????? ?????? ??????
	useEffect(() => {
		LogBox.ignoreLogs([
			'VirtualizedLists should never be nested inside plain ScrollViews',
		]);
		LogBox.ignoreLogs([
			'Warning: Each child in a list should have a unique "key" prop.',
		]);
	}, []);

	useEffect(async () => {
		try {
			await AsyncStorage.getItem('biz', function (err, result) {
				const data = JSON.parse(result);
				if (
					data === null ||
					data === [] ||
					data === 'undefined' ||
					data === ''
				) {
					console.log('???????????????????????????');
				} else {
					setBizFriend(data);
					console.log('?????????????????????????????????');
				}
			});
		} catch (err) {
			console.log(err);
		}
	}, []);

	useEffect(async () => {
		try {
			await AsyncStorage.getItem('me', function (err, result) {
				const data = JSON.parse(result);
				if (
					data === null ||
					data === [] ||
					data === 'undefined' ||
					data === ''
				) {
					console.log('?????????????????????');
				} else {
					setUserProfileInfo(data);
					console.log('???????????????????????????');
				}
			});
		} catch (err) {
			console.log(err);
		}
	}, [isFocused]);

	useEffect(() => {
		if (friendNum === '') {
			console.log('????????? ??????');
		} else {
			createTwoButtonAlert();
		}
	}, [friendNum]);

	useEffect(() => {
		datacheck();
		_storeData();
		_storeData3();
	}, [datas, userProfileInfo]);
	useEffect(() => {
		if (apiAlarm === true) {
			sendCompanyNumAPI();
		}
	}, [apiAlarm]);
	useEffect(() => {
		datacheck2();
		_storeData2();
		try {
			setCompanyN(bizFriend[0].slt_store_name);
			setCompanyBizNum(bizFriend[0].slt_company_num);
			setCompanyBizHp(bizFriend[0].mt_hp);
		} catch (err) {
			console.log(err);
		}
	}, [bizFriend]);

	useEffect(() => {
		console.log(friendNum+'??????????????????????');
	}, [friendNum])
	// useEffect(() => {
	// 	_storeData3();
	// }, [userProfileInfo]);

	const createTwoButtonAlert = () => {
		Alert.alert(
			'[??????]',
			'????????? ?????? ???????????? ?????????/????????? ?????? ????????? ????????????????????????? ',
			[
				{
					text: '??????',
					onPress: () => console.log('?????????????????????.'),
					style: 'cancel',
				},
				{text: '??????', onPress: () => sendPhoneNumAPI()},
			],
		);
	};
	console.log(user.mt_image1);

	return (
		<Container>
			{/* <Text>friend List</Text> */}
			{/* <Button
			title="??????????????? ????????? ???????????? ????????? ?????? ????????????"
			onPress={() => {getContacts(); FirstAlert();}}
			/> */}
			{/* {item.map((items, index) => (
			
			<TouchableOpacity
			onPress={() => navigation.navigate('TodayProfile', {items})}
			>
			<Text key={index}>{items.name}{items.hp}{items.id}</Text>
			{/* <Text key={index}>{items.hp}</Text>
			<Text key={index}>{items.id}</Text> */}
			{/* </TouchableOpacity> */}

			{/* ))} */}
			<Header
				title="????????????"
				headerRight={
					<HeaderRightWrap>
						<ShareButton onPress={() => Sharing()}>
							<Icon name="share-2" size={18} />
						</ShareButton>
						<RefreshButton onPress={() => refreshAlert()}>
							<Icon name="rotate-cw" size={17} />
						</RefreshButton>
					</HeaderRightWrap>
				}
			/>
			
			<ScrollView>
				<MyProfileWrap>
					{/* data = {item} */}
					{/* onPress={()=>myFunc(item)}> */}
					{/* <MyProfile> */}
					{/* <MyImageBox>
					<Image
					// require('~/Assets/Images/foodinus.png')
					source={{uri: user.mt_image1}}
					style={{

						resizeMode: 'cover',
						width: 40,
						height: 40,
						alignItems: 'center',
						justifyContent: 'center',
						borderRadius: 30,
						borderWidth: 1,
						borderColor: '#dfdfdf'
					  }}
					resizeMode="cover"
				/>
				</MyImageBox> */}
					{/* <MyInfoWrap> */}
					{/* <MyTitleLabel>{user.mt_name}</MyTitleLabel> */}
					{/* </MyInfoWrap> */}
					{/* </MyProfile> */}

					<FlatList
						data={userProfileInfoMap}
						keyExtractor={item => {
							item.idx;
						}}
						renderItem={({item}) => (
							<PartnerCard
								data={item}
								// onPress={()=> setShowSub(true)}
								onPress={() => myFunc(item)}
								// onPress={() => navigation.navigate('PartnerProfile', {item})}
							/>
						)}
						bounces={false}
					/>
					<MyGradeWrap>
						<MyGradeLabel>
							<RedLabel>{user.mt_level == 5 ? '?????????' : '?????????'}</RedLabel>
						</MyGradeLabel>
						{user.mt_level !== 5 && (
							<SubscribeButton onPress={() => setShowSub(true)}>
								<SubscribeLabel>??????</SubscribeLabel>
							</SubscribeButton>
						)}
					</MyGradeWrap>
				</MyProfileWrap>
				<PartnerTypeWrap>
					<TypeTitle>
						<PartnerTypeLabel onPress={() => setCompanyOpen(!companyOpen)}>
							<Icon name="briefcase" size={17} ></Icon> {companyN} (
							{bizFriend.length}){' '}
						</PartnerTypeLabel>
						<Icon
							name={companyOpen ? 'chevron-up' : 'chevron-down'}
							size={20}
							onPress={() => setCompanyOpen(!companyOpen)}
						/>
					</TypeTitle>
					
					{companyOpen && (
						<FlatList
							style={{paddingHorizontal: 20}}
							contentContainerStyle={{paddingBottom: 50}}
							data={bizFriendData}
							keyExtractor={item => {
								item.idx;
							}}
							renderItem={({item}) => (
								<PartnerCard
									data={item}
									// onPress={()=> setShowSub(true)}
									onPress={() => companyFunc(item)}
									// onPress={() => navigation.navigate('PartnerProfile', {item})}
								/>
							)}
							bounces={false}
						/>
					)}
				</PartnerTypeWrap>
				<PartnerTypeWrap >
					<TypeTitle>
						<PartnerTypeLabel onPress={() => setPartnerOpen(!partnerOpen)}>
							<Icon name="users" size={17}></Icon> ??? ????????? ({datas.length})
						</PartnerTypeLabel>
						<Icon
							name={partnerOpen ? 'chevron-up' : 'chevron-down'}
							size={20}
							onPress={() => setPartnerOpen(!partnerOpen)}
						/>
					</TypeTitle>
					{loading && (<LoadingSpinner/>)}
					{partnerOpen && (
						<FlatList
							style={{paddingHorizontal: 20}}
							contentContainerStyle={{paddingBottom: 50}}
							data={companyListData}
							keyExtractor={item => {
								item.idx;
							}}
							renderItem={({item}) => (
								<PartnerCard
									data={item}
									// onPress={()=> setShowSub(true)}
									onPress={() => partnerFunc(item)}
									// onPress={() => navigation.navigate('PartnerProfile', {item})}
								/>
							)}
							bounces={false}
						/>
					)}
				</PartnerTypeWrap>
			</ScrollView>

			{/* <PartnerProfile
					data={companyDetail}
					type={memberType}
					visible={showProfile}
					setVisible={setShowProfile}
				/> */}
			<PartnerProfile
				data={partnerDetail}
				type={memberType}
				visible={showProfile}
				setVisible={setShowProfile}
			/>

			<ServiceInfo
				visible={showSub}
				setVisible={setShowSub}
				checkSubscribe={checkSubscribe}
			/>
		</Container>
	);

};

export default PartnerList;