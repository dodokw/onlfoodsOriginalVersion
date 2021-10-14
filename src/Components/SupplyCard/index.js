import React from 'react';
import styled from 'styled-components/native';
import {
	FONTNanumGothicBold,
	FONTNanumGothicRegular,
} from '~/Assets/Style/Fonts';
import ic_smile from '~/Assets/Images/ic_smile.svg';
import {SvgXml} from 'react-native-svg';
import {ColorBlue, ColorRed} from '~/Assets/Style/Colors';
import {Text} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {Alert} from 'react-native';
import {APIDelOrderList} from '~/API/MyPageAPI/MyPageAPI';
import {useSelector} from 'react-redux';
import {Linking} from 'react-native';

const Container = styled.View`
	border-radius: 10px;
	border-width: 1px;
	border-color: #dfdfdf;
	margin-bottom: 10px;
	background-color: #ffffff;
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

const ItemDelButton = styled.TouchableOpacity``;

const ItemContent = styled.View`
	flex-direction: row;
	align-items: center;
	padding: 10px;
`;

const CompanyImageBox = styled.View`
	position: relative;
	width: 80px;
	height: 80px;
	border-radius: 10px;
	align-items: center;
	justify-content: center;
`;
const CompanyImage = styled.Image`
	width: 100%;
	height: 100%;
	border-radius: 10px;
	border-width: 1px;
	border-color: #dfdfdf;
`;

const CompanyInfoWrap = styled.View`
	flex: 1;
	margin-left: 10px;
`;

const CompanyTitleText = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
`;

const CompanyContentText = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	font-size: 14px;
	margin-bottom: 10px;
`;
const CompanyPeriodText = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	color: #7b7b7b;
	font-size: 10px;
	margin-bottom: 3px;
`;

const Wrap = styled.View`
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
`;
const CompanyLocationWrap = styled.View`
	flex-direction: row;
	align-items: center;
`;
const CompanyLocationText = styled.Text`
	color: #333333;
	font-size: 11px;
	margin-left: 5px;
`;
const CompanyLikeWrap = styled.View`
	flex-direction: row;
	align-items: center;
`;
const CompanyLikeText = styled.Text`
	color: #333333;
	font-size: 11px;
	margin-left: 5px;
`;

const DetailViewButton = styled.TouchableOpacity`
	border-top-width: 1px;
	border-color: #dfdfdf;
	padding: 20px;
	justify-content: center;
	align-items: center;
`;

const DetailViewLabel = styled.Text`
	font-size: 14px;
	color: #333333;
	font-family: ${FONTNanumGothicBold};
`;

const CallButton = styled.TouchableOpacity``;

const SupplyCard = ({item, setShowDetailId, state, getData, user, zzim}) => {
	const sendDel = async () => {
		try {
			const res = await APIDelOrderList(item.od_idx, user.mt_idx);
			if (res.result === 'true') {
				console.log('삭제함');
				getData();
			} else {
				Alert.alert('알림', res.message, [{text: '확인'}]);
			}
		} catch (err) {
			console.error(err.message);
		}
	};

	return (
		<Container>
			<ItemHeader>
				<ItemCodeWrap>
					<ItemCodeLabel>품목코드</ItemCodeLabel>
					<ItemCodeText>{item.ot_code}</ItemCodeText>
				</ItemCodeWrap>
				{!state && item.od_status !== '1' && (
					<ItemDelButton
						onPress={() =>
							Alert.alert('알림', '해당 주문내역을 삭제하시겠습니까?', [
								{text: '확인', onPress: () => sendDel()},
								{text: '취소 '},
							])
						}>
						<Icon name="x" size={20} />
					</ItemDelButton>
				)}
			</ItemHeader>
			<ItemContent>
				<CompanyImageBox>
					<CompanyImage
						source={{
							uri: item.mt_image
								? zzim
									? item.slt_image
									: item.mt_image
								: item.slt_image,
						}}
						resizeMode="cover"
					/>
				</CompanyImageBox>
				{state ? (
					zzim ? (
						<CompanyInfoWrap>
							<Wrap>
								<CompanyTitleText style={{flex: 1}}>
									{item.mt_store_name
										? item.mt_store_name
										: item.slt_store_name}
								</CompanyTitleText>
								<CompanyLikeWrap>
									<SvgXml xml={ic_smile} />
									<CompanyLikeText>
										{item.zzim ? item.zzim : item.zzim_cnt}
									</CompanyLikeText>
								</CompanyLikeWrap>
							</Wrap>
							<CompanyContentText numberOfLines={1}>
								{item.mt_item ? item.mt_item : item.slt_company_item}
							</CompanyContentText>
							<CompanyPeriodText>주문일 {item.ot_wdate}</CompanyPeriodText>
							{item.ot_dsdate && (
								<CompanyPeriodText>
									{item.delivery === '배송주문' ? '배송' : '픽업'} 완료일{' '}
									{item.ot_dsdate}
								</CompanyPeriodText>
							)}
							{item.ot_cdate && (
								<CompanyPeriodText>
									취소 처리일 {item.ot_cdate}
								</CompanyPeriodText>
							)}
							{item.ot_cancel_reason && (
								<CompanyPeriodText
									style={{
										backgroundColor: '#f1f1f1',
										color: '#555',
										padding: 5,
									}}>
									취소 사유 : {item.ot_cancel_reason}
								</CompanyPeriodText>
							)}
						</CompanyInfoWrap>
					) : (
						<CompanyInfoWrap>
							<CompanyTitleText>
								{item.ot_name ? item.ot_name : ''}
							</CompanyTitleText>
							<CallButton
								onPress={() =>
									Linking.openURL(`tel:${item.ot_hp.replace(/-/g, '')}`)
								}>
								<CompanyContentText numberOfLines={1}>
									{item.ot_hp ? item.ot_hp : ''}
								</CompanyContentText>
							</CallButton>
							<CompanyPeriodText>주문일 {item.ot_wdate}</CompanyPeriodText>
							{item.ot_dsdate && (
								<CompanyPeriodText>
									{item.delivery === '배송주문' ? '배송' : '픽업'} 완료일{' '}
									{item.ot_dsdate}
								</CompanyPeriodText>
							)}
							{item.ot_cdate && (
								<CompanyPeriodText>
									취소 처리일 {item.ot_cdate}
								</CompanyPeriodText>
							)}
							{item.ot_cancel_reason && (
								<CompanyPeriodText
									style={{
										backgroundColor: '#f1f1f1',
										color: '#555',
										padding: 5,
									}}>
									취소 사유 : {item.ot_cancel_reason}
								</CompanyPeriodText>
							)}
							<Wrap>
								{/* <CompanyLocationWrap>
							<SvgXml xml={ic_location} />
							<CompanyLocationText>{item.location}</CompanyLocationText>
						</CompanyLocationWrap> */}
								{/* <CompanyLikeWrap>
								<SvgXml xml={ic_smile} />
								<CompanyLikeText>
									{item.zzim ? item.zzim : item.zzim_cnt}
								</CompanyLikeText>
							</CompanyLikeWrap> */}
							</Wrap>
						</CompanyInfoWrap>
					)
				) : (
					<CompanyInfoWrap>
						<Wrap>
							<CompanyTitleText style={{flex: 1}}>
								{item.mt_store_name ? item.mt_store_name : item.slt_store_name}
							</CompanyTitleText>
							<CompanyLikeWrap>
								<SvgXml xml={ic_smile} />
								<CompanyLikeText>
									{item.zzim ? item.zzim : item.zzim_cnt}
								</CompanyLikeText>
							</CompanyLikeWrap>
						</Wrap>
						<CompanyContentText numberOfLines={1}>
							{item.mt_item ? item.mt_item : item.slt_company_item}
						</CompanyContentText>
						<CompanyPeriodText>
							품목 현황 갱신일{' '}
							{item.qty_update.split(' ')[0] === '0000-00-00'
								? '-'
								: item.qty_update.split(' ')[0]}
						</CompanyPeriodText>
						<CompanyPeriodText>주문일 {item.ot_wdate}</CompanyPeriodText>
						{item.ot_dsdate && (
							<CompanyPeriodText>
								{item.delivery === '배송주문' ? '배송' : '픽업'} 완료일{' '}
								{item.ot_dsdate}
							</CompanyPeriodText>
						)}
						{item.ot_cdate && (
							<CompanyPeriodText>취소 처리일 {item.ot_cdate}</CompanyPeriodText>
						)}
						{item.ot_cancel_reason && (
							<CompanyPeriodText
								style={{
									backgroundColor: '#f1f1f1',
									color: '#555',
									padding: 5,
								}}>
								취소 사유 : {item.ot_cancel_reason}
							</CompanyPeriodText>
						)}
					</CompanyInfoWrap>
				)}
			</ItemContent>
			<DetailViewButton
				onPress={() => {
					console.log(item.od_idx);
					setShowDetailId(item.od_idx);
				}}>
				<DetailViewLabel>
					<Text style={{color: state ? ColorBlue : ColorRed}}>
						{item.delivery_type ? item.delivery_type : item.delivery}
					</Text>{' '}
					상세보기
				</DetailViewLabel>
			</DetailViewButton>
		</Container>
	);
};

export default SupplyCard;
