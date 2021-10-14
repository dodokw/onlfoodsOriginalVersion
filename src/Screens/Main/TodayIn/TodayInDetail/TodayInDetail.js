import React, {useEffect, useRef, useState} from 'react';
import {SvgXml} from 'react-native-svg';
import styled from 'styled-components/native';
import {
	FONTNanumGothicBold,
	FONTNanumGothicRegular,
} from '~/Assets/Style/Fonts';
import BackButton from '~/Components/BackButton';
import Header from '~/Components/Header';
import ic_smile from '~/Assets/Images/ic_smile.svg';
import ic_time from '~/Assets/Images/ic_time.svg';
import ic_chatting from '~/Assets/Images/ic_chatting.svg';
import ic_viewer from '~/Assets/Images/ic_viewer.svg';
import ic_bigsmile from '~/Assets/Images/ic_bigsmile.svg';
import ic_report from '~/Assets/Images/ic_report.svg';
import {Alert, Dimensions, ScrollView, TouchableOpacity} from 'react-native';
import {ColorLineGrey, ColorRed} from '~/Assets/Style/Colors';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/core';
import {floatingHide} from '~/Modules/Action';
import Icon from 'react-native-vector-icons/Feather';
import {
	APICallLikeCompany,
	APICallOrderStart,
	APICallTodayInDetail,
} from '~/API/MainAPI/MainAPI';
import jwtDecode from 'jwt-decode';
import LoadingModal from '~/Components/LoadingModal';
import ReportModal from '~/Components/Modal/ReportModal';
import CustomModal from '~/Components/Modal/CustomModal';
import dayjs from 'dayjs';
import MapModal from '~/Components/Modal/MapModal/MapModal';
import InputNumModal from '~/Components/Modal/InputNumModal/InputNumModal';

const Container = styled.View`
	flex: 1;
	background-color: #ffffff;
`;
const Wrap = styled.View`
	flex-direction: row;
	align-items: center;
`;

const WrapC = styled.View`
	align-items: flex-end;
	justify-content: center;
`;

const CompanyContainer = styled.View`
	flex: 1;
	flex-direction: row;
	position: relative;
	background-color: #f5f5f5;
	align-items: center;
`;
const CompanyImage = styled.Image`
	width: 100px;
	height: 100px;
	border-radius: 20px;
	border-width: 1px;
	border-color: #dfdfdf;
	margin: 10px;
`;
const CompanyInfoWrap = styled.View`
	flex: 1;
	margin-left: 10px;
`;

const CompanyTouch = styled.TouchableOpacity`
	flex: 1;
	flex-direction: row;
	align-items: center;
`;

const CompanyOptionWrap = styled.View`
	justify-content: space-between;
	margin-left: 10px;
`;
const CompnayTitleWrap = styled.View`
	flex-direction: row;
	justify-content: space-between;
	margin-bottom: 10px;
`;
const CompanyTitle = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
`;
const CompanyOpenTimeLabel = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	font-size: 14px;
	color: #7b7b7b;
	margin-bottom: 10px;
`;
const CompanyLocationWrap = styled.View`
	flex-direction: row;
	margin-bottom: 10px;
	align-items: center;
`;
const CompanyLocationText = styled.Text`
	flex: 1;
	font-family: ${FONTNanumGothicRegular};
	font-size: 11px;
	color: #333333;
	margin-left: 5px;
`;
const CompnayLocationButton = styled.TouchableOpacity`
	background-color: #d0eefe;
	border-radius: 12px;
	padding: 10px 10px;
	margin: 5px;
`;
const CompanyLocationLabel = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	color: #185eba;
	font-size: 11px;
`;
const CompnayLikeWrap = styled.View`
	flex: 1;
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;
	margin: 5px;
`;
const CompanyLikeText = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	font-size: 11px;
	color: #333333;
	margin-left: 5px;
`;

const CloseButtonWrap = styled.View`
	flex: 1;
	justify-content: flex-end;
`;
const CloseButton = styled.TouchableOpacity`
	justify-content: flex-end;
	padding: 5px 10px;
	background-color: #ffffff;
	border-top-left-radius: 10px;
	flex-direction: row;
	align-items: center;
`;
const CloseLabel = styled.Text`
	font-size: 12px;
	font-family: ${FONTNanumGothicRegular};
	margin-right: 5px;
`;
const ImageContainer = styled.View``;
const MainImage = styled.Image`
	width: ${Dimensions.get('screen').width + 'px'};
	height: 375px;
`;
const ImageSelector = styled.View`
	flex-direction: row;
	margin: 10px;
`;
const SubImage = styled.Image`
	width: 42px;
	height: 42px;
	border-width: ${props => (props.selected ? '1px' : '0px')};
	border-color: ${ColorRed};
	margin: 3px;
`;
const ProductInfo = styled.View`
	padding: 10px;
	border-bottom-width: 1px;
	border-bottom-color: #dfdfdf;
`;
const ProductCode = styled.Text`
	color: #66c2eb;
	font-size: 12px;
	font-family: ${FONTNanumGothicBold};
`;
const ProductCategoryBox = styled.View`
	background-color: #66c2eb;
	padding: 5px;
	border-radius: 5px;
	margin-left: 5px;
`;
const ProductCategoryLabel = styled.Text`
	color: #ffffff;
	font-size: 12px;
	font-family: ${FONTNanumGothicBold};
`;
const ProductName = styled.Text`
	flex: 1;
	font-size: 18px;
	font-family: ${FONTNanumGothicBold};
	margin: 10px 0;
`;
const ProductLastTime = styled.Text`
	font-size: 14px;
	font-family: ${FONTNanumGothicBold};
	color: ${ColorRed};
	text-align: right;
`;
const ItemCountWrap = styled.View`
	flex-direction: row;
	border-width: 1px;
	border-color: ${ColorRed};
	border-radius: 7px;
	margin-right: 5px;
	margin-bottom: 10px;
`;
const ItemCountLabelBox = styled.View`
	background-color: ${ColorRed};
	align-items: center;
	justify-content: center;
	border-top-left-radius: 7px;
	border-bottom-left-radius: 7px;
	padding: 5px 5px;
`;
const ItemCountLabel = styled.Text`
	color: #ffffff;
	font-size: 10px;
	font-family: ${FONTNanumGothicBold};
`;
const ItemCountTextBox = styled.View`
	background-color: #ffffff;
	align-items: center;
	justify-content: center;
	border-top-right-radius: 7px;
	border-bottom-right-radius: 7px;
	padding: 5px 10px;
`;
const ItemCountText = styled.Text`
	font-size: 10px;
	font-family: ${FONTNanumGothicRegular};
`;
const ProductLabel = styled.Text`
	width: 80px;
	font-family: ${FONTNanumGothicRegular};
	font-size: 14px;
	color: #333333;
	margin: 5px 0px;
`;
const ProductPeriodText = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	font-size: 14px;
	color: #333333;
`;
const ProductPayText = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	font-size: 14px;
	color: #033333;
	text-align: left;
`;
const ProductPriceText = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 14px;
	color: #333333;
`;
const ProductDescription = styled.View`
	padding: 10px;
	border-bottom-width: 1px;
	border-bottom-color: #dfdfdf;
`;
const ProductDescriptionLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 14px;
	color: #333333;
	margin-bottom: 10px;
`;
const ProductDescriptionText = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	font-size: 14px;
`;
const DocInfo = styled.View`
	padding: 10px;
	border-bottom-width: 1px;
	border-bottom-color: #dfdfdf;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
`;
const DocWrap = styled.Text`
	flex-direction: row;
	align-items: center;
`;
const DocText = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	font-size: 12px;
	color: #7b7b7b;
	margin-left: 5px;
	margin-right: 5px;
`;
const ReportButton = styled.TouchableOpacity`
	border-radius: 5px;
	border-color: #dfdfdf;
	border-width: 0.5px;
	flex-direction: row;
	align-items: center;
	padding: 10px 15px;
`;
const ReportLabel = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	font-size: 12px;
	color: #7b7b7b;
	margin-left: 5px;
`;
const ProductOrder = styled.View`
	flex-direction: row;
	padding: 10px;
	border-bottom-width: 1px;
	border-bottom-color: #dfdfdf;
`;
const OrderButton = styled.TouchableOpacity`
	flex: 1;
	background-color: ${props => (props.color ? ColorLineGrey : '#ffffff')};
	border-color: ${ColorRed};
	border-width: 1px;
	border-radius: 8px;
	padding: 20px;
	justify-content: center;
	align-items: center;
	margin-left: 3px;
`;
const OrderLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
	color: ${ColorRed};
`;

const LikeButton = styled.TouchableOpacity`
	flex: 0.5;
	background-color: ${ColorRed};
	border-radius: 8px;
	padding: 20px;
	justify-content: center;
	align-items: center;
	flex-direction: row;
	margin-right: 3px;
`;
const LikeLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
	color: #ffffff;
	margin-left: 5px;
`;
const defaultData = {
	slt_company_name: '',
	slt_business_hours: '',
	regular_cnt: 0,
	slt_addr1: '',
	slt_addr2: '',
	slt_dong: '',
	slt_image: 'https://onlfoods.com/images/no_profile.png',
	dist: 0,
	pct_code: '',
	ct_id: '1',
	pt_title: '',
	pt_wdate: '',
	pt_qty: '',
	pt_expired_date: '',
	slt_payment: '',
	pt_price: '',
	pt_content: '',
	pt_chatting_cnt: '',
	pt_hit: '',
	pt_banner: '',
	pt_thumbnail: '',
	pt_img: [],
};

const CategoryData = [
	{key: '1', label: '공산', value: '1'},
	{key: '2', label: '농산', value: '2'},
	{key: '3', label: '수산', value: '3'},
	{key: '4', label: '축산', value: '4'},
	{key: '5', label: '기타', value: '5'},
];

const PaymentData = ['현금', '카드', '온누리상품권', '기타'];

const TodayInDetail = ({navigation, route}) => {
	const user = useSelector(state => state.loginReducer.user.mt_info);
	const location = useSelector(state => state.dataReducer.location);
	const dispatch = useDispatch();
	const isFocused = useIsFocused();
	const {lat, lng, mt_idx, pt_idx, slt_idx} = route.params;
	const [data, setData] = useState(defaultData);
	const [imageArr, setImageArr] = useState([]);
	const [showImage, setShowImage] = useState(true);
	const [imageIndex, setImageIndex] = useState(0);
	const [loadingData, setLoadingData] = useState(false);
	const [showReport, setShowReport] = useState(false);
	const [showMap, setShowMap] = useState(false);
	const [zzimState, setZzimState] = useState(false);
	const [zzimLoading, setZzimLoading] = useState(false);
	const [isOrder, setOrder] = useState(false);
	const zzim = useRef();

	const [time, setTime] = useState('00:00:00');

	const getDetail = async () => {
		try {
			setLoadingData(true);
			const res = await APICallTodayInDetail(lat, lng, pt_idx, mt_idx);
			if (res.result === 'true') {
				const decode = jwtDecode(res.jwt);
				console.log('오늘만 상세', decode.data);
				zzim.current = parseInt(decode.data.zzim);
				if (decode.data.slt_zzim_check === 'on') {
					setZzimState(true);
				}
				setData(decode.data);
				const pt_image = decode.data.pt_image ? decode.data.pt_image : [];
				setImageArr([decode.data.pt_thumbnail, ...pt_image]);
			} else {
				console.log(res);
				Alert.alert('알림', res.message, [
					{text: '확인', onPress: () => navigation.goBack()},
				]);
			}
		} catch (err) {
			console.error(err);
		}
		setLoadingData(false);
	};

	const goChatting = async num => {
		setOrder(false);
		if (num < 1) {
			return Alert.alert('알림', '올바른 수량을 입력해주세요.', [
				{text: '확인'},
			]);
		}
		setLoadingData(true);
		try {
			const res = await APICallOrderStart(
				user.mt_idx,
				slt_idx,
				'',
				[{pt_idx: pt_idx, pt_qty: num}],
				location,
			);
			if (res.result === 'true') {
				const decode = jwtDecode(res.jwt);
				navigation.goBack();
				navigation.navigate('ChattingNav', {
					screen: 'ChattingPage',
					params: {chatID: decode.data.chat_idx},
					initial: false,
				});
			}
		} catch (err) {
			Alert.alert('알림', err.message, [
				{text: '확인', onPress: () => navigation.goBack()},
			]);
		}
		setLoadingData(false);
	};
	const onLike = async () => {
		setZzimLoading(true);
		try {
			const res = await APICallLikeCompany(slt_idx, user.mt_idx);
			if (res.result === 'true') {
				if (res.data.wst_status === 'Y') {
					console.log('관심업체 등록!');
					setZzimState(true);
					zzim.current += 1;
				} else {
					console.log('관심업체 해제!');
					setZzimState(false);
					zzim.current -= 1;
				}
			}
		} catch (err) {
			console.error(err);
		}
		setZzimLoading(false);
	};

	const timer = () => {
		const endTime = dayjs(data.pt_wdate).add(1, 'day');
		const nowTime = dayjs();
		if (endTime < nowTime) {
			return setTime('00:00:00');
		} else {
			const diffHour = Math.floor(endTime.diff(nowTime, 'minute') / 60);
			const diffMin = Math.floor(endTime.diff(nowTime, 'minute') % 60);
			const diffSec = Math.floor((endTime.diff(nowTime, 's') % 3600) % 60);
			const Hour = diffHour < 10 ? `0${diffHour}` : `${diffHour}`;
			const Min = diffMin < 10 ? `0${diffMin}` : `${diffMin}`;
			const Sec = diffSec < 10 ? `0${diffSec}` : `${diffSec}`;
			setTime(`${Hour}:${Min}:${Sec}`);
		}
	};

	useEffect(() => {
		if (isFocused) {
			dispatch(floatingHide());
			if (user.mt_hp === null) {
				Alert.alert('알림', '추가정보를 필요로합니다. 입력하시겠습니까?', [
					{text: '확인', onPress: () => navigation.navigate('SNSSignUp')},
					{text: '취소', onPress: () => navigation.goBack()},
				]);
			}
		}
	}, [isFocused]);

	useEffect(() => {
		const parent = navigation.dangerouslyGetParent();
		parent?.setOptions({tabBarVisible: false});
		getDetail();
	}, []);

	useEffect(() => {
		if (data.pt_wdate !== '') {
			const timecall = setInterval(() => {
				timer();
			}, 1000);
			return () => clearInterval(timecall);
		}
	}, [data]);

	return (
		<Container>
			<Header
				title="오늘만"
				headerLeft={
					<BackButton
						onPress={() => {
							navigation.goBack();
						}}
					/>
				}
			/>
			<ScrollView bounces={false} contentContainerStyle={{paddingBottom: 30}}>
				<CompanyContainer>
					<CompanyTouch
						onPress={() =>
							navigation.navigate('DeliverPickupDetail', {
								slt_idx: slt_idx,
								before: 'TodayIn',
							})
						}>
						<CompanyImage
							source={{
								uri:
									data.slt_image === 'https://onlfoods.com/images/uploads/'
										? 'https://onlfoods.com/images/no_profile.png'
										: data.slt_image,
							}}
						/>
						<CompanyInfoWrap>
							<CompnayTitleWrap>
								<CompanyTitle>{data.slt_company_name}</CompanyTitle>
							</CompnayTitleWrap>
							<CompanyOpenTimeLabel>
								영업시간 {data.slt_business_hours}
							</CompanyOpenTimeLabel>
							<CompanyLocationWrap>
								<Icon name="map-pin" size={11} color="#333333" />
								<CompanyLocationText>
									{data.slt_addr1} {data.slt_addr2}
								</CompanyLocationText>
							</CompanyLocationWrap>
						</CompanyInfoWrap>
					</CompanyTouch>
					<CompanyOptionWrap>
						<CompnayLikeWrap>
							<SvgXml xml={ic_smile} />
							<CompanyLikeText>{zzim.current}</CompanyLikeText>
						</CompnayLikeWrap>
						<CompnayLocationButton onPress={() => setShowMap(true)}>
							<CompanyLocationLabel>업체위치</CompanyLocationLabel>
						</CompnayLocationButton>
						<CloseButtonWrap>
							<CloseButton onPress={() => setShowImage(!showImage)}>
								<CloseLabel>{showImage ? '접기' : '펴기'}</CloseLabel>
								<Icon
									name={showImage ? 'chevron-up' : 'chevron-down'}
									color={ColorRed}
								/>
							</CloseButton>
						</CloseButtonWrap>
					</CompanyOptionWrap>
				</CompanyContainer>
				{showImage && (
					<ImageContainer>
						<MainImage source={{uri: imageArr[imageIndex]}} />
						<ImageSelector>
							{imageArr.map((item, index) => (
								<TouchableOpacity
									key={index}
									onPress={() => setImageIndex(index)}>
									<SubImage
										source={{uri: item}}
										selected={index === imageIndex}
									/>
								</TouchableOpacity>
							))}
						</ImageSelector>
					</ImageContainer>
				)}
				<ProductInfo>
					<Wrap style={{justifyContent: 'space-between', alignItems: 'center'}}>
						<Wrap>
							<ProductCode>품목코드 {data.pct_code}</ProductCode>
							<ProductCategoryBox>
								<ProductCategoryLabel>
									{
										CategoryData.find(element => element.key === data.ct_id)
											.label
									}
								</ProductCategoryLabel>
							</ProductCategoryBox>
						</Wrap>
						<WrapC>
							<Wrap>
								<SvgXml xml={ic_time} />
								<ProductLastTime>{time}</ProductLastTime>
							</Wrap>
							<Wrap>
								<ProductPeriodText style={{color: ColorLineGrey, fontSize: 12}}>
									{data.pt_wdate}
								</ProductPeriodText>
							</Wrap>
						</WrapC>
					</Wrap>
					<Wrap>
						<ProductName style={{flex: 1}}>{data.pt_title}</ProductName>
					</Wrap>
					<Wrap>
						<ItemCountWrap>
							<ItemCountLabelBox backgroundColor={ColorRed}>
								<ItemCountLabel>입고수량</ItemCountLabel>
							</ItemCountLabelBox>
							<ItemCountTextBox>
								<ItemCountText>{data.pt_qty}개</ItemCountText>
							</ItemCountTextBox>
						</ItemCountWrap>
					</Wrap>
					<Wrap>
						<ProductLabel>유통기한</ProductLabel>
						<ProductPeriodText>{data.pt_expired_date}</ProductPeriodText>
					</Wrap>
					<Wrap>
						<ProductLabel>결제수단</ProductLabel>
						<ProductPayText>
							{PaymentData[parseInt(data.slt_payment) - 1]}
						</ProductPayText>
					</Wrap>
					<Wrap>
						<ProductLabel>과세여부</ProductLabel>
						<ProductPeriodText>
							{data.pt_vat === '1' ? '과세' : '면세'}
						</ProductPeriodText>
					</Wrap>
					<Wrap>
						<ProductLabel>단가</ProductLabel>
						<ProductPriceText>{data.pt_price}</ProductPriceText>
					</Wrap>
				</ProductInfo>
				<ProductDescription>
					<ProductDescriptionLabel>상품 설명</ProductDescriptionLabel>
					<ProductDescriptionText>{data.pt_content}</ProductDescriptionText>
				</ProductDescription>
				<DocInfo>
					<DocWrap>
						<Wrap>
							<SvgXml xml={ic_chatting} />
							<DocText>채팅 {data.pt_chatting_cnt}</DocText>
						</Wrap>
						<Wrap>
							<SvgXml xml={ic_viewer} />
							<DocText>조회 {data.pt_hit}</DocText>
						</Wrap>
					</DocWrap>
					{mt_idx !== slt_idx && (
						<ReportButton onPress={() => setShowReport(true)}>
							<SvgXml xml={ic_report} />
							<ReportLabel>신고하기</ReportLabel>
						</ReportButton>
					)}
				</DocInfo>
				{slt_idx !== user.mt_idx && (
					<ProductOrder>
						<LikeButton onPress={() => onLike()} disabled={zzimLoading}>
							<SvgXml xml={ic_bigsmile} />
							<LikeLabel>{zzimState ? '관심해제' : '관심'}</LikeLabel>
						</LikeButton>
						<OrderButton
							onPress={() => setOrder(true)}
							disabled={mt_idx === slt_idx || time === '00:00:00'}
							color={mt_idx === slt_idx}>
							<OrderLabel>주문하기(견적)</OrderLabel>
						</OrderButton>
					</ProductOrder>
				)}
			</ScrollView>
			<LoadingModal visible={loadingData} />
			<ReportModal
				visible={showReport}
				setVisible={setShowReport}
				type="user"
				slt_idx={slt_idx}
				mt_idx={user.mt_idx}
			/>
			<MapModal isShow={showMap} setShow={setShowMap} idx={slt_idx} />
			<InputNumModal
				visible={isOrder}
				title="오늘만 주문"
				subText="주문하실 수량을 입력해주세요."
				confirmLabel="주문"
				confirmAction={goChatting}
				cancelLabel="취소"
				cancelAction={() => setOrder(false)}
			/>
			{/* <CustomModal
				visible={showLogin}
				title="로그인이 필요한 서비스 입니다."
				subText="로그인 하시겠습니까?"
				confirmLabel="확인"
				confirmAction={() => goLogin()}
				cancelLabel="취소"
				cancelAction={() => navigation.goBack()}
			/> */}
		</Container>
	);
};

export default TodayInDetail;
