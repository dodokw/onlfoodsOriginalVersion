import React, {useCallback, useEffect, useState} from 'react';
import {SvgXml} from 'react-native-svg';
import styled from 'styled-components/native';
import {
	FONTNanumGothicBold,
	FONTNanumGothicRegular,
} from '~/Assets/Style/Fonts';
import BackButton from '~/Components/BackButton';
import Header from '~/Components/Header';
import ic_smile from '~/Assets/Images/ic_smile.svg';
import ic_chatting from '~/Assets/Images/ic_chatting.svg';
import ic_viewer from '~/Assets/Images/ic_viewer.svg';
import ic_report from '~/Assets/Images/ic_report.svg';
import {Alert, Dimensions, ScrollView, TouchableOpacity} from 'react-native';
import {ColorRed} from '~/Assets/Style/Colors';
import {useDispatch, useSelector} from 'react-redux';
import {useIsFocused} from '@react-navigation/core';
import {floatingHide, logout} from '~/Modules/Action';
import {APICallTodayEvnetDetail} from '~/API/MainAPI/MainAPI';
import jwtDecode from 'jwt-decode';
import Icon from 'react-native-vector-icons/Feather';
import LoadingModal from '~/Components/LoadingModal';
import CustomModal from '~/Components/Modal/CustomModal';
import ReportModal from '~/Components/Modal/ReportModal';
import {useFocusEffect} from '@react-navigation/native';
import MapModal from '~/Components/Modal/MapModal/MapModal';

const Container = styled.View`
	flex: 1;
	background-color: #ffffff;
`;

const Wrap = styled.View`
	flex-direction: row;
	align-items: center;
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

const ProductSubText = styled.Text`
	font-size: 14px;
	color: #333333;
	font-family: ${FONTNanumGothicRegular};
`;

const ProductName = styled.Text`
	flex: 1;
	font-size: 18px;
	font-family: ${FONTNanumGothicBold};
	margin: 10px 0;
`;

const ProductPeriod = styled.Text`
	font-size: 12px;
	font-family: ${FONTNanumGothicRegular};
	color: #7b7b7b;
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
	padding: 10px;
	border-bottom-width: 1px;
	border-bottom-color: #dfdfdf;
	flex-direction: row;
`;
const LikeButton = styled.TouchableOpacity`
	flex: 2;
	background-color: ${ColorRed};
	border-radius: 8px;
	padding: 20px;
	justify-content: center;
	align-items: center;
	flex-direction: row;
`;
const LikeLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
	color: #ffffff;
	margin-left: 5px;
`;

const ChatButton = styled.TouchableOpacity`
	flex: 4;
	border-color: ${ColorRed};
	border-width: 1px;
	border-radius: 8px;
	padding: 20px;
	justify-content: center;
	align-items: center;
	flex-direction: row;
	margin-left: 5px;
`;
const ChatLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
	color: ${ColorRed};
	margin-left: 5px;
`;

const defaultImage = [
	{image: require('~/Assets/Images/item_sample.png')},
	{image: require('~/Assets/Images/event_sample.png')},
];

const defaultData = {
	slt_company_name: '',
	slt_business_hours: '',
	regular_cnt: 0,
	slt_addr1: '',
	slt_addr2: '',
	slt_dong: '',
	dist: 1,
	et_name: '',
	et_sdate: '',
	et_edate: '',
	et_addr1: '',
	et_addr2: '',
	et_content: '',
	et_chatting_cnt: '',
	et_hit: '',
	et_banner: '',
	et_thumbnail: '',
	et_image: [],
};

const TodayEventDetail = ({navigation, route}) => {
	const user = useSelector(state => state.loginReducer.user.mt_info);
	const {lat, lng, mt_idx, et_idx, seller_idx} = route.params;
	const dispatch = useDispatch();
	const isFocused = useIsFocused();
	const [data, setData] = useState(defaultData);
	const [imageArr, setImageArr] = useState([]);
	const [loadingData, setLoadingData] = useState(false);
	const [showImage, setShowImage] = useState(true);
	const [showLogin, setShowLogin] = useState(false);
	const [showReport, setShowReport] = useState(false);
	const [imageIndex, setImageIndex] = useState(0);
	const [showMap, setShowMap] = useState(false);

	const GetDetail = async () => {
		try {
			setLoadingData(true);
			const res = await APICallTodayEvnetDetail(lat, lng, et_idx, mt_idx);
			if (res.result === 'true') {
				const decode = jwtDecode(res.jwt);
				setData(decode.data);
				setImageArr([decode.data.et_thumbnail, ...decode.data.et_image]);
			} else {
				console.log(res);
			}
		} catch (err) {
			console.log(err);
		}
		setLoadingData(false);
	};

	const goChatting = async () => {
		try {
			navigation.navigate('DeliverPickupDetail', {
				slt_idx: seller_idx,
				before: 'TodayEvent',
			});
		} catch (err) {
			Alert.alert('알림', err.message, [
				{text: '확인', onPress: () => navigation.goBack()},
			]);
		}
	};

	const goLogin = async () => {
		try {
			dispatch(logout());
		} catch (err) {
			console.log(err);
		}
	};
//stashtest
	useEffect(() => {
		const parent = navigation.dangerouslyGetParent();
		parent?.setOptions({tabBarVisible: false});
		dispatch(floatingHide());
		GetDetail();
	}, []);

	console.log(imageArr[imageIndex]);

	return (
		<Container>
			<Header
				title={data.et_name}
				headerLeft={
					<BackButton
						onPress={() => {
							navigation.goBack();
						}}
					/>
				}
			/>
			<ScrollView bounces={false} contentContainerStyle={{paddingBottom: 30}}>
				{/* <CompanyContainer>
					<CompanyTouch
						onPress={() =>
							navigation.navigate('DeliverPickupDetail', {
								slt_idx: seller_idx,
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
							<CompanyLikeText>{data.zzim}</CompanyLikeText>
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
				</CompanyContainer> */}
				{showImage && (
					<ImageContainer>
						<MainImage source={ imageArr[imageIndex] !== undefined ?{uri: imageArr[imageIndex]} : require('~/Assets/Images/noImage.png')} />
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
					<Wrap>
						<ProductName>{data.et_name}</ProductName>
						<Wrap>
							<ProductPeriod>
								기간 : {data.et_sdate} ~ {data.et_edate}
							</ProductPeriod>
						</Wrap>
					</Wrap>
					<Wrap>
						{/* <ProductSubText>
							{data.et_addr1} {data.et_addr2}
						</ProductSubText> */}
					</Wrap>
				</ProductInfo>
				<ProductDescription>
					<ProductDescriptionLabel>공지설명</ProductDescriptionLabel>
					<ProductDescriptionText>{data.et_content}</ProductDescriptionText>
				</ProductDescription>
				<DocInfo>
					<DocWrap>
						<Wrap>
							<SvgXml xml={ic_viewer} />
							<DocText>조회 {data.et_hit}</DocText>
						</Wrap>
					</DocWrap>
					{user.mt_idx !== seller_idx && (
						<ReportButton onPress={() => setShowReport(true)}>
							<SvgXml xml={ic_report} />
							<ReportLabel>신고하기</ReportLabel>
						</ReportButton>
					)}
				</DocInfo>
				{/* <ProductOrder>
					<ChatButton onPress={goChatting}>
						<ChatLabel>업체 보기</ChatLabel>
					</ChatButton>
				</ProductOrder> */}
			</ScrollView>
			<LoadingModal visible={loadingData} />
			<ReportModal
				visible={showReport}
				setVisible={setShowReport}
				type="user"
				slt_idx={seller_idx}
				mt_idx={user.mt_idx}
			/>
			<MapModal isShow={showMap} setShow={setShowMap} idx={seller_idx} />
			<CustomModal
				visible={showLogin}
				title="로그인이 필요한 서비스 입니다."
				subText="로그인 하시겠습니까?"
				confirmLabel="확인"
				confirmAction={() => goLogin()}
				cancelLabel="취소"
				cancelAction={() => setShowLogin(false)}
			/>
		</Container>
	);
};

export default TodayEventDetail;
