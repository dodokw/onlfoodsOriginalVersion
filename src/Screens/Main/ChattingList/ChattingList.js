import React, {useEffect, useState, useRef} from 'react';
import {SvgXml} from 'react-native-svg';
import ic_search from '~/Assets/Images/ic_search.svg';
import {ColorLineGrey, ColorRed} from '~/Assets/Style/Colors';
import styled from 'styled-components/native';
import {
   FONTNanumGothicBold,
   FONTNanumGothicRegular,
} from '~/Assets/Style/Fonts';
import Header from '~/Components/Header';
import {FlatList} from 'react-native-gesture-handler';
import ChattingCard from '~/Components/ChattingCard';
import SwitchingButton from '~/Components/SwitchingButton';
import {useDispatch, useSelector} from 'react-redux';
import {chatCount, floatingHide, setScreen} from '~/Modules/Action';
import {useIsFocused} from '@react-navigation/core';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/Feather';
import {APICallChattingList} from '~/API/ChattingAPI/ChattingAPI';
import jwtDecode from 'jwt-decode';
import {useFocusEffect} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import {decode} from 'jsonwebtoken';
import {Alert,Dimensions} from 'react-native';
import LoadingSpinner from '~/Components/LoadingSpinner';

import BannerIndicator from '~/Components/BannerIndicator';
import {Animated, Easing} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Container = styled.View`
   flex: 1;
   background-color: #ffffff;
`;
const WIDTH = Dimensions.get('screen').width;
const BannerContainer = styled.View`
   position: relative;
   margin-right: 20px;
   margin-bottom: 20px;
`;

const ListBox = styled.View`
   width: ${WIDTH - 20}px;
   height: 100px;
   border-top-right-radius: 25px;
   border-bottom-right-radius: 25px;
   overflow: hidden;
`;

const BannerBox = styled.TouchableOpacity`
   width: ${WIDTH - 20}px;
   justify-content: center;
   align-items: center;
   height: 100px;
`;

const BannerImage = styled.Image`
   width: 100%;
   height: 100%;
`;

const TabContainer = styled.View`
   flex-direction: row;
   border-bottom-width: 0.5px;
   border-bottom-color: ${ColorLineGrey};
   margin: 10px 20px;
`;
const TabWrap = styled.TouchableOpacity`
   flex: 1;
   padding-bottom: 10px;

   border-bottom-width: ${props => (props.selected ? '3px' : '0')};
   border-bottom-color: ${ColorRed};
`;
const TabLabel = styled.Text`
   text-align: center;
   font-family: ${FONTNanumGothicBold};
   font-size: 16px;
   color: ${props => (props.selected ? ColorRed : '#7b7b7b')};
`;
const SearchContainer = styled.View`
   flex-direction: row;
   margin: 10px 20px;
   align-items: center;
`;

const SearchBox = styled.View`
   flex: 1;
   flex-direction: row;
   border-width: 1px;
   border-color: #dfdfdf;
   border-radius: 5px;
   justify-content: space-between;
   align-items: center;
   padding: 0px 5px;
   margin-right: 10px;
`;
const SearchButton = styled.TouchableOpacity``;
const SearchInput = styled.TextInput`
   flex: 1;
   font-family: ${FONTNanumGothicRegular};
   font-size: 16px;
   color: #000000;
   padding: 5px 0;
`;

const SearchOptionBox = styled.TouchableOpacity`
   border-width: 1px;
   border-color: #dfdfdf;
   border-radius: 5px;
   padding: 0 10px;
   justify-content: center;
   align-items: center;
   width: 120px;
   height: 50px;
`;

const EmptyLabel = styled.Text`
   flex: 1;
   text-align: center;
   margin-top: 60px;
`;

const chattingTypeData = {
   0: [
      {key: 0, label: '전체', value: '전체'},
      {key: 1, label: '행사', value: '행사'},
      {key: 2, label: '오늘입고', value: '오늘입고'},
      {key: 3, label: '공급업체', value: '공급업체'},
   ],
   1: [
      {key: 0, label: '전체', value: '전체'},
      {key: 1, label: '픽업주문', value: '픽업주문'},
      {key: 0, label: '배송주문', value: '배송주문'},
   ],
};


const RenderItem = ({item, navigation}) => {
   return (
      <BannerBox onPress={() => navigation.navigate('BannerDetail', {item})}>
         <BannerImage
            source={{
               uri: item.img,
            }}
            resizeMode="cover"
         />
      </BannerBox>
   );
};




const ChattingList = ({navigation}) => {

   const dispatch = useDispatch();
   const isFocused = useIsFocused();
   const state = useSelector(state => state.loginReducer.state);
   const user = useSelector(state => state.loginReducer.user.mt_info);
   const [selectedTab, setSelectedTab] = useState(0);
   const [chattingType, setSetChttingType] = useState('전체');
   const [data, setData] = useState([]);
   const [list, setList] = useState([]);
   const [keyword, setKeyword] = useState('');
   const [isLoading, setLoading] = useState(true);

   const [bannerData, setBannerData] = useState();
   const bannerIndex = useRef(0);
   const BannerRef = useRef();
   const [hideBanner, setHideBanner] = useState(false);
   const [nowIndex, setNowIndex] = useState();
   const aniValue = useRef(new Animated.Value(1)).current;
   const isSet = useRef(false);

   const getData = async () => {
      try {
         const res = await APICallChattingList(user.mt_idx);
         if (res.result === 'true') {
            const decode = jwtDecode(res.jwt);
            console.log(decode.data);

            setData(decode.data.chatting);
            setList(decode.data.chatting);
            dispatch(chatCount(decode.data.chat_tot_cnt));
         }
      } catch (err) {
         console.error(err);
      }
      setLoading(false);
   };

   const onSearch = () => {
      const newData = data.filter(item => {
         if (item.slt_name === null) return false;
         return item.slt_name.indexOf(keyword) === -1 ? false : true;
      });
      setList(newData);
   };

   const onClear = () => {
      setKeyword('');
      setList(data);
   };

   useEffect(() => {
      if (isFocused) {
         setLoading(true);
         const parent = navigation.dangerouslyGetParent();
         parent?.setOptions({tabBarVisible: true});
         dispatch(floatingHide());
         dispatch(setScreen('ChattingNav'));
         getData();
         if (user.mt_hp === null) {
            setLoading(false);
            Alert.alert('알림', '추가정보를 필요로합니다. 입력하시겠습니까?', [
               {text: '확인', onPress: () => navigation.navigate('SNSSignUp')},
               {text: '취소', onPress: () => navigation.goBack()},
            ]);
         }
      }
   }, [isFocused]);

   useEffect(() => {
      const message = messaging().onMessage(remoteMessage => {
         getData();
      });
      return message;
   });

   useEffect(() => {
      if (!hideBanner) {
         console.log('배너숨김동작함');
         Animated.timing(aniValue, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.linear,
         }).start();
      } else {
         console.log('배너펴짐동작함');
         Animated.timing(aniValue, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.linear,
         }).start();
      }
   }, [hideBanner]);
   

   const onViewableItemsChanged = useRef(({viewableItems}) => {
      if (viewableItems.length > 0) {
         bannerIndex.current = viewableItems[0].index;
         setNowIndex(viewableItems[0].index);
      }
   });

   const settingBanner = async () => {
      const str = await AsyncStorage.getItem('Banner');
      const banner = JSON.parse(str);
      console.log('배너', banner.event);
      setBannerData(banner.event);
   };

   useEffect(() => {
      settingBanner();
   }, []);


   useEffect(() => {
      if (!isSet.current && bannerData !== undefined) {
         isSet.current = true;
         const BannerControl = BannerRef.current;
         // eslint-disable-next-line no-unused-vars
         const movingBanner = setTimeout(function () {
            isSet.current = false;
            if (bannerData !== undefined)
               BannerControl.scrollToIndex({
                  animated: true,
                  index:
                     bannerIndex.current === bannerData.length - 1
                        ? 0
                        : bannerIndex.current + 1,
               });
         }, 2000);
      }
   }, [nowIndex]);


   return (
      <Container>
         <Header
            title="채팅목록"
         />

         {/* <BannerContainer>
               <ListBox>
                  {bannerData !== undefined && (
                     <FlatList
                        style={{
                           width: WIDTH - 20,
                           height: 100,
                           borderTopRightRadius: 25,
                           borderBottomRightRadius: 25,
                        }}
                        onViewableItemsChanged={onViewableItemsChanged.current}
                        viewabilityConfig={{viewAreaCoveragePercentThreshold: 80}}
                        ref={BannerRef}
                        data={bannerData}
                        keyExtractor={(item, index) => `banner-${index}`}
                        renderItem={({item}) => (
                           <RenderItem item={item} navigation={navigation} />
                        )}
                        horizontal={true}
                        pagingEnabled={true}
                        showsHorizontalScrollIndicator={false}
                        initialNumToRender={1}
                        initialScrollIndex={0}
                        bounces={false}
                     />
                  )}
               </ListBox>
               <BannerIndicator
                  bottom={-10}
                  count={nowIndex}
                  all={bannerData === undefined ? 0 : bannerData.length}
                  onPress={() => navigation.navigate('BannerList', {bannerData})}
               />
            </BannerContainer> */}

         {/* <TabContainer>
            <TabWrap
               selected={selectedTab === 0 ? true : false}
               onPress={() => setSelectedTab(0)}>
               <TabLabel selected={selectedTab === 0 ? true : false}>문의</TabLabel>
            </TabWrap>
            <TabWrap
               selected={selectedTab === 1 ? true : false}
               onPress={() => setSelectedTab(1)}>
               <TabLabel selected={selectedTab === 1 ? true : false}>주문</TabLabel>
            </TabWrap>
         </TabContainer> */}
         <SearchContainer>
            <SearchBox>
               <SearchInput
                  placeholder="업체명"
                  placeholderColor="#7b7b7b"
                  value={keyword}
                  onChangeText={text => setKeyword(text)}
                  onSubmitEditing={onSearch}
               />
               {keyword.length > 0 && (
                  <SearchButton
                     onPress={onClear}
                     style={{
                        marginHorizontal: 5,
                        padding: 3,
                        backgroundColor: '#777777',
                        borderRadius: 50,
                     }}>
                     <Icon name="x" size={12} color="#ffffff" />
                  </SearchButton>
               )}
            </SearchBox>
            <SearchButton onPress={onSearch}>
               <Icon name="search" size={26} />
            </SearchButton>
            {/* <SearchOptionBox>
               <RNPickerSelect
                  value={chattingType}
                  items={chattingTypeData[selectedTab]}
                  onValueChange={value => setSetChttingType(value.value)}
                  doneText="확인"
                  style={{
                     inputIOSContainer: {
                        flexDirection: 'row',
                        position: 'relative',
                        height: '100%',
                     },
                     inputIOS: {
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        fontSize: 15,
                        fontFamily: FONTNanumGothicRegular,
                        paddingRight: 30,
                     },
                     inputAndroidContainer: {
                        flexDirection: 'row',
                        position: 'relative',
                        height: '100%',
                     },
                     inputAndroid: {
                        position: 'relative',
                        width: '100%',
                        fontSize: 15,
                        height: '100%',
                        fontFamily: FONTNanumGothicRegular,
                        color: '#000000',
                        padding: 0,
                        paddingRight: 20,
                     },
                     iconContainer: {top: 15},
                  }}
                  Icon={() => <Icon name="chevron-down" size={20} />}
                  useNativeAndroidPickerStyle={false}
                  placeholder={{}}
               />
            </SearchOptionBox> */}
         </SearchContainer>
         {isLoading ? (
            <LoadingSpinner />
         ) : (
            <FlatList
               style={{paddingHorizontal: 20}}
               contentContainerStyle={{paddingBottom: 80}}
               data={list}
               initialNumToRender={10}
               keyExtractor={item => `chat-${item.chat_idx}`}
               renderItem={({item}) => (
                  <ChattingCard
                     data={item}
                     user={user}
                     onPress={() =>
                        navigation.push('ChattingPage', {
                           chatID: item.chat_idx,
                           otherImg: item.slt_image,
                           otherName: item.slt_name,
                           seller_idx: item.slt_idx,
                           user_idx: item.mt_idx,
                        })
                     }
                  />
               )}
               bounces={false}
               ListEmptyComponent={<EmptyLabel>채팅내역이 없습니다.</EmptyLabel>}

               onScrollEndDrag={event => {
                  if (event.nativeEvent.contentOffset.y < 5) {
                     setHideBanner(false);
                  } else {
                     if (data !== undefined) setHideBanner(true);
                  }}}

            />
         )}
      </Container>
   );
};

export default ChattingList;