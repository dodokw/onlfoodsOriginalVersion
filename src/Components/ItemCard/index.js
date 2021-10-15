import React, {useState} from 'react';
import Svg, {G, Path, SvgXml} from 'react-native-svg';
import styled from 'styled-components/native';
import {ColorRed} from '~/Assets/Style/Colors';
import {
	FONTNanumGothicBold,
	FONTNanumGothicRegular,
} from '~/Assets/Style/Fonts';
import ic_big from '~/Assets/Images/ic_big.svg';
import ic_smile from '~/Assets/Images/ic_smile.svg';
import ic_company from '~/Assets/Images/ic_company.svg';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {useEffect} from 'react';
import NumberComma from '~/Tools/NumberComma';
import {useIsFocused} from '@react-navigation/native';
import {useSelector} from 'react-redux';
dayjs.extend(duration);

const Container = styled.View`
	flex-direction: row;
	padding: 10px 10px;
	background-color: #ffffff;
`;
const ItemImageBox = styled.View`
	position: relative;
	width: 90px;
	height: 90px;
	padding: 3px;
	border-radius: 50px;
	border-width: 1px;
	border-color: #dfdfdf;
	align-items: center;
	justify-content: center;
`;
const ItemImage = styled.Image`
	width: 100%;
	height: 100%;
	border-radius: 50px;
`;

const ItemImageBigBox = styled.TouchableOpacity`
	position: absolute;
	width: 24px;
	height: 24px;
	background-color: #ffffff;
	justify-content: center;
	bottom: 0px;
	right: 0px;
	border-radius: 50px;
`;

const ItemInfoWrap = styled.TouchableOpacity`
	flex: 1;
	margin-left: 10px;
`;

const ItemTitleWrap = styled.View`
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10px;
`;
const ItemTitleText = styled.Text`
	flex: 1;
	font-family: ${FONTNanumGothicBold};
	font-size: 15px;
`;
const ItemLastTimeWrap = styled.View`
	margin-left: 5px;
	flex-direction: row;
	align-items: center;
`;
const ItemLastTimeText = styled.Text`
	color: ${ColorRed};
	font-size: 11px;
	margin-left: 5px;
	font-family: ${FONTNanumGothicBold};
`;

const ItemPricWrap = styled.View`
	flex-direction: row;
	align-items: center;
	padding-bottom: 10px;
	margin-bottom: 10px;
	border-bottom-width: 1px;
	border-bottom-color: #dfdfdf;
`;

const ItemCountWrap = styled.View`
	flex-direction: row;
	border-width: 1px;
	border-color: ${ColorRed};
	border-radius: 7px;
	margin-right: 5px;
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
const ItemPriceText = styled.Text`
	color: #333333;
	font-size: 14px;
	font-family: ${FONTNanumGothicBold};
`;

const ItemSubInfoWrap = styled.View`
	flex-direction: row;
	justify-content: space-between;
`;

const ItemLocationWrap = styled.View`
	flex-direction: row;
	align-items: center;
`;
const ItemLocationText = styled.Text`
	color: #333333;
	font-size: 11px;
	margin-left: 5px;
`;
const ItemCompanyLikeWrap = styled.View`
	flex-direction: row;
`;
const ItemCompanyWrap = styled.View`
	flex-direction: row;
	align-items: center;
`;
const ItemCompnayText = styled.Text`
	color: #333333;
	font-size: 11px;
	margin-left: 3px;
	margin-right: 10px;
	font-family: ${FONTNanumGothicRegular};
`;

const ItemLikeWrap = styled.View`
	flex-direction: row;
	align-items: center;
`;
const ItemLikeText = styled.Text`
	color: #333333;
	font-size: 11px;
	margin-left: 3px;
	font-family: ${FONTNanumGothicRegular};
`;

const ItemCard = ({item, onPress, setShowModal}) => {
	const [time, setTime] = useState('00:00:00');
	const locationData = useSelector(state => state.dataReducer.location);
	const isFocused = useIsFocused();
	const timer = () => {
		const basicTime = dayjs(item.pt_wdate);
		const endTime = basicTime.add(1, 'day');
		const nowTime = dayjs();
		if (endTime < nowTime) {
			return setTime('00:00:00');
		}
		const diffHour = Math.floor(endTime.diff(nowTime, 'minute') / 60);
		const diffMin = Math.floor(endTime.diff(nowTime, 'minute') % 60);
		const diffSec = Math.floor((endTime.diff(nowTime, 's') % 3600) % 60);
		const Hour = diffHour < 10 ? `0${diffHour}` : `${diffHour}`;
		const Min = diffMin < 10 ? `0${diffMin}` : `${diffMin}`;
		const Sec = diffSec < 10 ? `0${diffSec}` : `${diffSec}`;
		if (isFocused) setTime(`${Hour}:${Min}:${Sec}`);
	};

	useEffect(() => {
		const tictoc = setInterval(() => {
			timer();
		}, 1000);
		return () => clearInterval(tictoc);
	}, []);

	return (
		<Container>
			<ItemImageBox>
				<ItemImage source={{uri: item.pt_thumbnail}} />
				<ItemImageBigBox onPress={() => setShowModal(item.pt_thumbnail)}>
					<SvgXml xml={ic_big} />
				</ItemImageBigBox>
			</ItemImageBox>
			<ItemInfoWrap onPress={onPress}>
				<ItemTitleWrap>
					<ItemTitleText ellipsizeMode="tail" numberOfLines={2}>
						{item.pt_title}
					</ItemTitleText>
					<ItemLastTimeWrap>
						<Svg
							xmlns="http://www.w3.org/2000/svg"
							width="10.286"
							height="12.169"
							viewBox="0 0 10.286 12.169">
							<Path
								id="stopwatch"
								d="M9.1,3.74l.477-.477a.475.475,0,0,0-.671-.671l-.477.477A5.094,5.094,0,0,0,5.617,1.9V.949h.459a.475.475,0,0,0,0-.949H4.209a.475.475,0,0,0,0,.949h.459V1.9A5.143,5.143,0,1,0,9.1,3.74ZM5.143,11.219A4.193,4.193,0,1,1,9.336,7.026a4.2,4.2,0,0,1-4.193,4.193Zm2.2-6.393a.475.475,0,0,1,0,.671L5.478,7.362a.475.475,0,1,1-.671-.671L6.671,4.826A.475.475,0,0,1,7.343,4.826Zm0,0"
								transform="translate(0 0)"
								fill="#ec636b"
							/>
						</Svg>

						<ItemLastTimeText>{time}</ItemLastTimeText>
					</ItemLastTimeWrap>
				</ItemTitleWrap>
				<ItemPricWrap>
					<ItemCountWrap>
						<ItemCountLabelBox backgroundColor={ColorRed}>
							<ItemCountLabel>수량</ItemCountLabel>
						</ItemCountLabelBox>
						<ItemCountTextBox>
							<ItemCountText>{item.pt_qty}개</ItemCountText>
						</ItemCountTextBox>
					</ItemCountWrap>
					<ItemPriceText>
						{item.pt_price === '가격 채팅문의'
							? item.pt_price
							: NumberComma(item.pt_price) + '원'}
					</ItemPriceText>
				</ItemPricWrap>
				<ItemSubInfoWrap>
					<ItemLocationWrap>
						<Svg
							xmlns="http://www.w3.org/2000/svg"
							width="7.727"
							height="10.388"
							viewBox="0 0 7.727 10.388">
							<G id="pin" transform="translate(-47.98 0.1)">
								<G
									id="그룹_34"
									data-name="그룹 34"
									transform="translate(48.08)">
									<G id="그룹_33" data-name="그룹 33" transform="translate(0)">
										<Path
											id="패스_47"
											data-name="패스 47"
											d="M51.844,0A3.768,3.768,0,0,0,48.08,3.764,4.342,4.342,0,0,0,48.4,5.212a6.069,6.069,0,0,0,.435.814l2.58,3.91a.491.491,0,0,0,.858,0l2.581-3.91a6.044,6.044,0,0,0,.435-.814,4.341,4.341,0,0,0,.319-1.449A3.768,3.768,0,0,0,51.844,0ZM54.88,5.041a5.562,5.562,0,0,1-.4.742L51.9,9.692c-.051.077-.067.077-.118,0L49.2,5.782a5.564,5.564,0,0,1-.4-.742,3.942,3.942,0,0,1-.285-1.277,3.321,3.321,0,0,1,6.642,0A3.945,3.945,0,0,1,54.88,5.041Z"
											transform="translate(-48.08)"
											stroke="#333333"
											strokeWidth="0.5"
										/>
										<Path
											id="패스_48"
											data-name="패스 48"
											d="M114.072,64.008A1.992,1.992,0,1,0,116.065,66,1.995,1.995,0,0,0,114.072,64.008Zm0,3.542a1.55,1.55,0,1,1,1.55-1.55A1.552,1.552,0,0,1,114.072,67.55Z"
											transform="translate(-110.309 -62.237)"
											stroke="#333333"
											strokeWidth="0.5"
										/>
									</G>
								</G>
							</G>
						</Svg>

						<ItemLocationText>
							{item.slt_dong} {item.dist}km
						</ItemLocationText>
					</ItemLocationWrap>
					<ItemCompanyLikeWrap>
						<ItemCompanyWrap>
							<SvgXml xml={ic_company} />
							<ItemCompnayText>{item.slt_company_name}</ItemCompnayText>
						</ItemCompanyWrap>
						<ItemLikeWrap>
							<SvgXml xml={ic_smile} />
							<ItemLikeText>{item.zzim}</ItemLikeText>
						</ItemLikeWrap>
					</ItemCompanyLikeWrap>
				</ItemSubInfoWrap>
			</ItemInfoWrap>
		</Container>
	);
};

export default ItemCard;
