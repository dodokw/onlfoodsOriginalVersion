import React, {useState} from 'react';
import styled from 'styled-components/native';
import {
	FONTNanumGothicBold,
	FONTNanumGothicRegular,
} from '~/Assets/Style/Fonts';
import Icon from 'react-native-vector-icons/Feather';
import {ColorLineGrey, ColorRed} from '~/Assets/Style/Colors';
import {Alert} from 'react-native';
import {APIDelTodayEvent} from '~/API/MyPageAPI/MyPageAPI';
import dataReducer from '~/Modules/Reducers/dataReducer';
import noImage from '~/Assets/Images/noImage.png'

const Container = styled.TouchableOpacity`
	background-color:#ffffff;
    overflow: hidden;
    padding:10px 0;
    border-bottom-width:1px;
    border-color:#dfdfdf;
`;

const Wrap = styled.View`
	flex-direction: row;
`;

const EventImageBox = styled.View`
	position: relative;
	width: 70px;
	height: 70px;
	align-items: center;
	justify-content: center;
`;
const EventImage = styled.Image`
	width: 100%;
	height: 100%;
	border-radius:15px;
`;
const NoticeType = styled.View`
	background-color: 
		${props=>(
			props.typeNum==1 ? '#FFA7A7': 
			props.typeNum==2 ? '#BCE55C':
			props.typeNum==3 ? '#6799FF':'white')}
	border-radius:10px;
	width:90%;
	position:absolute;
	bottom:-5px;
`;
const NoticeTypeLabel=styled.Text`
	color:#fff;
	font-size:13px;
	text-align:center;
`;

const EventInfoWrap = styled.View`
	flex: 1;
	margin-left: 15px;
	justify-content: center;
`;

const EventTitleWrap = styled.View`
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
    margin-bottom:5px;
`;
const EventTitleText = styled.Text`
	flex: 1;
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
	padding-bottom:3px;
`;

const EventLocationWrap = styled.View`
	flex-direction: row;
	align-items: center;
	margin: 3px;
`;
const EventLocationText = styled.Text`
	color: #333333;
	font-size: 11px;
	margin-left: 5px;
`;

const EventContentText = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	font-size: 14px;
    margin-bottom:5px;
`;
const EventPeriodText = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	font-size: 12px;
	color: #7b7b7b;
`;

const Overlay = styled.View`
	background-color: rgba(245, 245, 245, 0.7);
	border-radius: 5px;
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
`;
const Dive = styled.View`
	width: 0.5px;
	height: 100%;
	background-color: ${ColorLineGrey};
`;

const ButtonWrap = styled.View`
	flex-direction: row;
	border-top-width: 0.5px;
	border-color: ${ColorLineGrey};
	background-color: #ffffff;
`;

const Button = styled.TouchableOpacity`
	flex: 1;
	justify-content: center;
	align-items: center;
	padding: 10px;
`;

const ButtonLabel = styled.Text`
	font-family: ${FONTNanumGothicRegular};
`;

const NoticeTypeName=((item)=>{
	switch (item.et_type){
		case '1' : 
			return '일반';
		case '2' : 
			return '행사';
		case '3' :
			return '시세변동';
	}
});

const NoticeCard = ({
	item,
	onPress,
	disable,
	navigation,
	getData,
	user,
	manage,
}) => {
	const handleRemove = async () => {
		try {
			const res = await APIDelTodayEvent(user.mt_info.mt_idx, item.et_idx);
			if (res.result === 'true') {
				Alert.alert('알림', '공지 삭제 되었습니다.', [
					{text: '확인', onPress: () => getData()},
				]);
			} else {
				Alert.alert('알림', '공지 삭제를 실패하였습니다.', [
					{text: '확인'},
				]);
			}
		} catch (err) {
			console.error(err);
		}
	};
	
	return (
		<Container onPress={onPress}>
			<Wrap>
				<EventImageBox>
					{item.et_thumbnail !== null ?
					<EventImage source={{uri: 'https://onlfoods.com/images/event/'+item.et_thumbnail}} resizeMode="cover" />
					: <EventImage source={require('~/Assets/Images/noImage.png')} resizeMode="cover" />}
					<NoticeType typeNum={item.et_type}>
						<NoticeTypeLabel>
							{NoticeTypeName(item)}
							{/* 일반/행사/시세변동 */}
							</NoticeTypeLabel>	
					</NoticeType>
				</EventImageBox>
				<EventInfoWrap>
					<EventTitleWrap>
						<EventTitleText>{item.et_name}</EventTitleText>
					</EventTitleWrap>
					<EventContentText numberOfLines={1}>
						{item.et_content ? item.et_content : item.slt_company_name}
					</EventContentText>
					{item.et_addr && (
						<EventContentText numberOfLines={1}>
							{item.et_addr}
						</EventContentText>
					)}
					<EventPeriodText>
						기간 : {item.et_sdate} ~ {item.et_edate}
					</EventPeriodText>
					{/* {item.slt_dong !== undefined && (
						<EventLocationWrap>
							<Icon name="map-pin" size={11} color="#333333" />
							<EventLocationText>
								{item.slt_dong} {item.dist}km
							</EventLocationText>
						</EventLocationWrap>
					)} */}
				</EventInfoWrap>
				{disable && <Overlay />}
			</Wrap>

			{manage && (
				<ButtonWrap>
					<Button
						onPress={() =>
							navigation.push('EnrollEvent', {itemID: item.et_idx})
						}>
						<ButtonLabel>수정</ButtonLabel>
					</Button>
					<Dive />
					<Button
						onPress={() =>
							Alert.alert('알림', '해당 공지를 삭제하시겠습니까?', [
								{text: '확인', onPress: () => handleRemove()},
								{text: '취소', style: 'cancel'},
							])
						}>
						<ButtonLabel style={{color: ColorRed}}>삭제</ButtonLabel>
					</Button>
				</ButtonWrap>
			)}
		</Container>
	);
};

export default React.memo(NoticeCard);
