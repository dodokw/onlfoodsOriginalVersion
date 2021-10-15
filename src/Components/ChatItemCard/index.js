import React, {useEffect, useState} from 'react';
import {SvgXml} from 'react-native-svg';
import styled from 'styled-components/native';
import {ColorBlue, ColorLineGrey, ColorRed} from '~/Assets/Style/Colors';
import {
	FONTNanumGothicBold,
	FONTNanumGothicRegular,
} from '~/Assets/Style/Fonts';
import ic_time from '~/Assets/Images/ic_time.svg';
import Icon from 'react-native-vector-icons/Feather';
import dayjs from 'dayjs';
import {APIDelTodayIn} from '~/API/MyPageAPI/MyPageAPI';
import {Alert} from 'react-native';
import NumberComma from '~/Tools/NumberComma';
import {TouchableOpacity} from 'react-native-gesture-handler';

const Container = styled.TouchableOpacity`
	position: relative;
	border-radius: 10px;
	border-width: 1px;
	border-color: #dfdfdf;
	margin-bottom: 10px;
	overflow: hidden;
`;

const ItemHeader = styled.View`
	flex-direction: row;
	justify-content: space-between;
	padding: 10px 20px;
	border-color: #dfdfdf;
	border-bottom-width: 0.5px;
`;
const ItemCodeWrap = styled.View`
	flex-direction: row;
`;
const ItemCodeLabel = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 12px;
	margin-right: 5px;
`;
const ItemCodeText = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	font-size: 12px;
`;

const ItemLastTimeWrap = styled.View`
	flex-direction: row;
	align-items: center;
`;
const ItemLastTimeText = styled.Text`
	color: ${ColorRed};
	font-size: 11px;
	margin-left: 5px;
	font-family: ${FONTNanumGothicBold};
`;

const ItemContent = styled.View`
	flex-direction: row;
	align-items: center;
	padding: 10px;
`;

const ItemImageWrap = styled.View`
	width: 100px;
	height: 100px;
	padding: 5px;
	border-radius: 50px;
	border-width: 1px;
	border-color: #dfdfdf;
`;

const ItemImage = styled.Image`
	width: 100%;
	height: 100%;
	border-radius: 50px;
`;

const ItemContentInfo = styled.View`
	flex: 1;
	margin-left: 10px;
`;
const ItemTitle = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
	margin-bottom: 10px;
`;
const ItemPrice = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	font-size: 14px;
	margin-bottom: 10px;
`;
const Dive = styled.View`
	width: 0.5px;
	height: 100%;
	background-color: ${ColorLineGrey};
`;

const ItemLocation = styled.View`
	flex-direction: row;
	align-items: center;
	margin: 10px 0;
`;
const ItemLocationText = styled.Text`
	flex: 1;
	margin-left: 5px;
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

const RefreshBox = styled.TouchableOpacity`
	background-color: ${props => (props.end ? ColorBlue : ColorRed)};
	border-radius: 50px;
	padding: 5px;
	position: absolute;
	top: 3px;
	right: 10px;
`;

const RefreshLabel = styled.Text`
	color: #ffffff;
	font-family: ${FONTNanumGothicRegular};
	font-size: 14px;
`;

const ChatItemCard = ({
	item,
	getData,
	onPress,
	navigation,
	refreshItem,
	expiredItem,
}) => {
	// console.log(disable);
	// const [time, setTime] = useState('00:00:00');
	// const timer = () => {
	// 	const basicTime = dayjs(item.pt_wdate);
	// 	const endTime = basicTime.add(1, 'day');
	// 	const nowTime = dayjs();
	// 	const diffHour = Math.floor(endTime.diff(nowTime, 'minute') / 60);
	// 	const diffMin = Math.floor(endTime.diff(nowTime, 'minute') % 60);
	// 	const diffSec = Math.floor((endTime.diff(nowTime, 's') % 3600) % 60);
	// 	const Hour = diffHour < 10 ? `0${diffHour}` : `${diffHour}`;
	// 	const Min = diffMin < 10 ? `0${diffMin}` : `${diffMin}`;
	// 	const Sec = diffSec < 10 ? `0${diffSec}` : `${diffSec}`;

	// 	setTime(`${Hour}:${Min}:${Sec}`);
	// };

	// useEffect(() => {
	// 	if (!disable) {
	// 		setInterval(() => {
	// 			timer();
	// 		}, 1000);
	// 	}
	// }, []);

	const handleRemove = async () => {
		try {
			const res = await APIDelTodayIn(item.pt_idx);
			if (res.result === 'true') {
				Alert.alert('알림', '오늘만 아이템이 삭제 되었습니다.', [
					{text: '확인', onPress: () => getData()},
				]);
			} else {
				Alert.alert('알림', '오늘만 아이템 삭제를 실패하였습니다.', [
					{text: '확인'},
				]);
			}
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<Container onPress={onPress} disabled={item.end}>
			<ItemHeader>
				<ItemCodeWrap>
					<ItemCodeLabel>품목코드</ItemCodeLabel>
					<ItemCodeText>{item.pt_code}</ItemCodeText>
				</ItemCodeWrap>
				{/* <ItemLastTimeWrap>
					<SvgXml xml={ic_time} />
					<ItemLastTimeText>{time}</ItemLastTimeText>
				</ItemLastTimeWrap> */}
			</ItemHeader>
			<ItemContent>
				<ItemImageWrap>
					<ItemImage source={{uri: item.pt_thumbnail}} />
				</ItemImageWrap>
				<ItemContentInfo>
					<ItemTitle>{item.pt_title}</ItemTitle>
					<ItemPrice>
						{item.pt_qty === '0' ? '재고 없음' : '재고 ' + item.pt_qty + '개'}
					</ItemPrice>
					<ItemPrice>
						{item.pt_price === '가격 채팅문의'
							? item.pt_price
							: '가격 ' + NumberComma(item.pt_price) + '원'}
					</ItemPrice>
					{/* <Dive />
					<ItemLocation>
						<Icon name="map-pin" size={11} color="#333333" />
						<ItemLocationText>오류동 4km</ItemLocationText>
					</ItemLocation> */}
				</ItemContentInfo>
			</ItemContent>
			{item.end && <Overlay />}
			<ButtonWrap>
				<Button
					onPress={() =>
						navigation.push('EnrollTodayIn', {itemID: item.pt_idx})
					}>
					<ButtonLabel>수정</ButtonLabel>
				</Button>
				<Dive />
				<Button
					onPress={() =>
						Alert.alert('알림', '해당 항목을 삭제하시겠습니까?', [
							{text: '확인', onPress: () => handleRemove()},
							{text: '취소', style: 'cancel'},
						])
					}>
					<ButtonLabel style={{color: ColorRed}}>삭제</ButtonLabel>
				</Button>
			</ButtonWrap>
			<RefreshBox
				end={item.end}
				onPress={() => {
					if (item.end)
						Alert.alert('알림', '해당 아이템을 재등록하시겠습니까?', [
							{text: '확인', onPress: () => refreshItem(item.pt_idx)},
							{text: '취소'},
						]);
					else
						Alert.alert('알림', '해당 아이템을 만료하시겠습니까?', [
							{text: '확인', onPress: () => expiredItem(item.pt_idx)},
							{text: '취소'},
						]);
				}}>
				{item.end ? (
					<Icon name="refresh-cw" color="#ffffff" size={18} />
				) : (
					<Icon name="x" color="#ffffff" size={18} />
				)}
			</RefreshBox>
		</Container>
	);
};

export default ChatItemCard;
