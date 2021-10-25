import React, { useEffect, useState } from 'react';
import {Text} from 'react-native';
import styled from 'styled-components/native';
import {
	FONTNanumGothicBold,
	FONTNanumGothicRegular,
} from '~/Assets/Style/Fonts';
import ic_smile from '~/Assets/Images/ic_smile.svg';
import {SvgXml} from 'react-native-svg';
import {ColorRed} from '~/Assets/Style/Colors';
import Icon from 'react-native-vector-icons/Feather';
import {useSelector} from 'react-redux';
import axios from 'axios';
import { originURL, testURL } from '~/API/default';

const Container = styled.TouchableOpacity`
	flex-direction: row;
	margin: 10px 0;
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
	justify-content: space-around;
`;

const CompanyTitleWrap = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
`;
const CompanyTitleText = styled.Text`
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
`;

const CompanyB2BText = styled.Text`
	margin-left: 10px;
	font-family: ${FONTNanumGothicBold};
	font-size: 16px;
	color: ${ColorRed};
`;
const CompnayDeliverBox = styled.View`
	width: 70px;
	padding: 5px;
	background-color: ${ColorRed};
	border-radius: 25px;
	justify-content: center;
	align-self: flex-end;
`;
const CompanyDeliverText = styled.Text`
	font-size: 13px;
	font-family: ${FONTNanumGothicBold};
	color: #ffffff;
	text-align: center;
`;

const CompanyContentText = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	font-size: 14px;
`;
const CompanyPeriodText = styled.Text`
	font-family: ${FONTNanumGothicRegular};
	color: #7b7b7b;
	font-size: 10px;
`;

const Wrap = styled.View`
	flex-direction: row;
	justify-content: space-between;
`;
const CompanyLocationWrap = styled.View`
	flex-direction: row;
	align-items: center;
`;
const CompanyLocationText = styled.Text`
	font-family: ${FONTNanumGothicRegular};
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
	font-family: ${FONTNanumGothicRegular};
`;

const CompanyCard = ({item, onPress}) => {
	const locationData = useSelector(state => state.dataReducer.location);
	const [countManager, setCountManager] = useState();

	const CountManagerList = async () => {
        try{
        const form = new FormData();
        form.append('slt_idx', item.mt_idx);
        const res = await axios.post(originURL+'getManager_list.php', form);
		// console.log(res.data);
		setCountManager(res.data.length);
		}catch(err){
			console.log(err);
		}
	}
	useEffect(() => {
		CountManagerList();
	}, [])

		

	return (
		<Container onPress={onPress}>
			<CompanyImageBox>
				<CompanyImage source={{uri: item.slt_image}} resizeMode="cover" />
			</CompanyImageBox>
			<CompanyInfoWrap>
				<CompanyTitleWrap>
					<CompanyTitleText>
						{item.slt_store_name}{'  '}<Icon name="users" size={13}/><Text style={{fontSize:14, color:'#444'}}> {countManager}</Text>
						{/* {item.slt_channel === 'B2B' && <CompanyB2BText>B2B</CompanyB2BText>} */}
					</CompanyTitleText>

					<CompnayDeliverBox>
						<CompanyDeliverText>
							{item.slt_deliver_time === 'D-0'
								? '당일배송'
								: item.slt_deliver_time === 'D-1'
								? '익일배송'
								: `${item.slt_deliver_time}`}
						</CompanyDeliverText>
					</CompnayDeliverBox>
				</CompanyTitleWrap>
				<CompanyContentText numberOfLines={1}>
					{item.slt_company_item}
				</CompanyContentText>
				{item.slt_qty_udate && (
					<CompanyPeriodText>
						품목 현황 갱신일{' '}
						{item.slt_qty_udate.split(' ')[0] === '0000-00-00'
							? '-'
							: item.slt_qty_udate.split(' ')[0]}
					</CompanyPeriodText>
				)}
				<Wrap>
					{item.slt_distance !== undefined && (
						<CompanyLocationWrap>
							<Icon name="map-pin" size={11} color="#333333" />
							<CompanyLocationText>
								{item.slt_dong} {item.slt_distance}km
							</CompanyLocationText>
						</CompanyLocationWrap>
					)}
					<CompanyLikeWrap>
						<SvgXml xml={ic_smile} />
						<CompanyLikeText>{item.zzim}</CompanyLikeText>
					</CompanyLikeWrap>
				</Wrap>
			</CompanyInfoWrap>
		</Container>
	);
};

export default React.memo(CompanyCard);
