/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable quotes */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import React, { JSX, useCallback } from 'react';
import { FC } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import Container from '../../../../components/Container';
import { useDispatch, useSelector } from 'react-redux';
import CustomHeader2 from '../../../../components/Customs/Header/CustomHeader2';
import { moderateScale, screenHeight, screenWidth } from '../../../../components/Matrix/Matrix';
import CustomText from '../../../../components/Customs/CustomText';
import CustomIcon from '../../../../components/Customs/CustomIcon';
import Colors from '../../../../utils/Colors';
import { globalStyle } from '../../../../utils/GlobalStyle';
import { getRetreat } from '../../../../redux/Slice/RetreatSlice';
import Images from '@utils/Images';

interface Props { }
const OwnRetreat: FC<Props> = ({ navigation, route }: any): JSX.Element => {

  const dispatch = useDispatch();
  const { retreat } = useSelector((state: any) => state?.retreat);
  const { user } = useSelector((state: any) => state?.user);
  const [refreshing, setRefreshing] = React.useState(false);


  useFocusEffect(useCallback(() => {

    fetchRetreat();
  }, []));

  const fetchRetreat = async () => {
    await dispatch(getRetreat(user?.id));
  }
  // console.log("=== retreat on own retreat ===",retreat);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchRetreat().then(() => setRefreshing(false));
  }, []);


  return (
    <Container>
      <CustomHeader2 title="Own Retreats" isMore={true} iconType="AntDesign" iconName="plus" handleMore={() => {
        navigation.navigate('CreateRetreat');
      }} />
      {
        retreat && retreat.length > 0 ? (
          <FlatList
            data={retreat}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={'#000'}
                colors={['#000']}
                progressBackgroundColor="#fff"
              />
            }
            keyExtractor={(item: any) => item?.id?.toString()}
            renderItem={({ item }) => {
              // console.log("==== item in the own retreat ===", item);
              return (
                <TouchableOpacity activeOpacity={.9} onPress={() => {
                  navigation.dispatch(
                    CommonActions.navigate({
                      name: 'RetreatDetails',
                      params: {
                        retreatid: item?.id,
                      },
                    }),
                  );
                }} style={styles.cartContainer} >
                  <View style={[globalStyle.center, {
                    width: "30%", backgroundColor: item?.status !== 'Active' ? "red" : Colors.success, padding: moderateScale(3),
                    borderRadius: moderateScale(5),
                    position: "absolute",
                    top: moderateScale(5),
                    right: moderateScale(5),
                    flexDirection: "row",
                    alignItems: "center",
                    zIndex: 10
                  }]} >
                    <CustomIcon type='Feather' name={item?.status === 'Active' ? 'check-circle' : 'x-circle'} color='#fff' />
                    <CustomText customStyle={{ marginLeft: moderateScale(5) }} text={item?.status === 'Active' ? "Active" : "In-Active"} weight='500' color="white" />
                  </View>
                  <View style={styles.image}>
                    <Image source={{ uri: item.image }} style={styles.image} />
                    <View
                      style={{
                        alignItems: 'center',
                        position: 'absolute',
                        backgroundColor: '#fff',
                        borderRadius: moderateScale(5),
                        padding: moderateScale(5),
                        bottom: moderateScale(5),
                        right: moderateScale(5),
                        elevation: 3,
                      }}>
                      <CustomIcon type="AntDesign" name="star" color={Colors.orange} />
                      <CustomText
                        text={parseFloat(item.review.averageRating).toFixed(1)}
                        weight="700"
                        customStyle={{ marginTop: moderateScale(3) }}
                      />
                    </View>
                  </View>

                  <View style={{ marginBottom: moderateScale(10) }}>
                    <CustomText
                      text={item?.title}
                      size={20}
                      weight="600"
                      customStyle={{ marginBottom: moderateScale(3) }}
                    />
                    <CustomText
                      text={`By ${item?.user_name}`}
                      weight="500"
                      size={16}
                      color={Colors.gray_font}
                    />
                  </View>

                  {item.location ? (
                    <View style={[globalStyle.row]}>
                      <CustomIcon type="Ionicons" name="location-sharp" />
                      <Text style={styles.text1}>{item.location}</Text>
                    </View>
                  ) : null}

                  <View style={[globalStyle.row]}>
                    {item.group_size ? (
                      <>
                        <CustomIcon type="MaterialIcons" name="group" />
                        <CustomText
                          text={`${item?.group_size} Members`}
                          customStyle={{ marginLeft: moderateScale(5) }}
                          weight="500"
                        />
                      </>
                    ) : null}
                  </View>

                  <View
                    style={[
                      globalStyle.betweenCenter,
                      { alignItems: 'center', marginBottom: moderateScale(5) },
                    ]}>
                    {item.no_of_days ? (
                      <View style={[globalStyle.row]}>
                        <CustomIcon type="Feather" name="calendar" />
                        <CustomText
                          text={`${item.no_of_days} Days`}
                          customStyle={{ marginLeft: moderateScale(5) }}
                          weight="500"
                        />
                      </View>
                    ) : null}
                  </View>

                  <View style={[globalStyle.betweenCenter, { alignItems: 'center' }]}>
                    {item.price ? (
                      <View style={[globalStyle.row]}>
                        <View
                          style={{ width: moderateScale(25), height: moderateScale(25) }}>
                          <CustomIcon
                            customStyle={{ alignSelf: 'center' }}
                            type="FontAwesome"
                            name="rupee"
                          />
                        </View>
                        <CustomText
                          text={`${item.price}`}
                          customStyle={{ marginLeft: moderateScale(5) }}
                          weight="500"
                        />
                      </View>
                    ) : null}
                  </View>


                  {/*---------------------------------------           stats      --------------------------------------------- */}
                  <View style={[globalStyle.row, { justifyContent: "space-between" }]}>
                    <View>
                      <View style={globalStyle.row}>
                        <CustomIcon type="MaterialIcons" name="group" />
                        <CustomText
                          customStyle={{ marginLeft: moderateScale(5) }}
                          text={`${item?.Lead < 1 ? 'No' : item?.Lead} ${item?.Lead <= 1 ? 'Lead' : 'Leads'
                            }`}
                          weight="500"
                          color={item?.Lead < 1 ? Colors.gray_font : '#000'}
                          size={12}
                        />
                      </View>
                      <View style={globalStyle.row}>
                        <CustomIcon type="MaterialIcons" name="person-add" />
                        <CustomText
                          customStyle={{ marginLeft: moderateScale(5) }}
                          text={`${item?.Suscription < 1 ? 'No' : item?.Suscription} ${item?.Suscription <= 1 ? 'Suscription' : 'Suscriptions'
                            }`}
                          weight="500"
                          color={item?.Suscription < 1 ? Colors.gray_font : '#000'}
                          size={12}
                        />
                      </View>
                    </View>

                    <View>

                      <View style={globalStyle.row}>
                        {/* <Icon name="eye" type="font-awesome" size={25} color="#000" /> */}
                        <CustomIcon type='Entypo' name='line-graph' />
                        <CustomText
                          customStyle={{ marginLeft: moderateScale(5) }}
                          text={`${item?.impresssion < 1 ? 'No' : item?.impresssion} ${item?.impresssion <= 1 ? 'Impression' : 'Impressions'
                            }`}
                          weight="500"
                          color={item?.impresssion < 1 ? Colors.gray_font : '#000'}
                          size={12}
                        />
                      </View>
                      <View style={globalStyle.row}>
                        <CustomIcon type="MaterialIcons" name="touch-app" />
                        <CustomText
                          customStyle={{ marginLeft: moderateScale(5) }}
                          text={`${item?.click < 1 ? 'No' : item?.click} ${item?.click <= 1 ? 'Click' : 'Clicks'
                            }`}
                          weight="500"
                          color={item?.click < 1 ? Colors.gray_font : '#000'}
                          size={12}
                        />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        ) : (
          <View style={[globalStyle.center, { flex: 1 }]} >
            <Images.Logo width={moderateScale(150)} height={moderateScale(150)} />
            <CustomText text='No Data Available' weight='500' size={18} />
          </View>
        )
      }


    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    backgroundColor: 'white',
    opacity: 88,
    elevation: 2,
    borderRadius: moderateScale(20),
    width: "100%",
    padding: 10,
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: moderateScale(20),
  },
  name: {
    width: "45%",
    fontFamily: 'Roboto-Bold',
    fontSize: 19,
    color: 'black',
  },
  course: {
    width: "45%",
    fontFamily: 'Roboto-Regular',
    fontSize: 17,
    letterSpacing: 1,
    marginBottom: 0.5,
    color: 'black',
  },
  date: {
    width: "45%",

    fontFamily: 'Roboto-Regular',
    fontSize: 18,
    color: 'black',
  },
  newDate: {
    width: "45%",

    fontFamily: 'Roboto-Regular',
    fontSize: 15,
    color: 'black',
  },
  row1: {
    width: "60%",
    flexDirection: 'row',
    gap: 10,
  },
  modalView: {
    margin: moderateScale(20),
    backgroundColor: 'white',
    borderRadius: moderateScale(20),
    padding: moderateScale(35),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: moderateScale(4),
    elevation: 5,
  },
  modalText: {
    marginBottom: moderateScale(15),
    textAlign: 'center',
    fontSize: 12,
    color: 'black',
  },
  cartContainer: {
    width: screenWidth * .92,
    height: screenHeight * .5,
    backgroundColor: "#fff",
    borderRadius: moderateScale(10),
    elevation: 3,
    alignSelf: "center",
    marginBottom: moderateScale(10),
    marginTop: moderateScale(5),
    padding: moderateScale(10)
  },
  image: {
    width: '100%',
    height: screenHeight * .2,
    marginBottom: moderateScale(10),
    borderRadius: moderateScale(10),
    alignItems: 'center',
    alignSelf: 'center',
  },
  text1: {
    width: screenWidth * .5,
    flexWrap: 'wrap',
    textAlign: 'left',
    color: 'black',
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    marginBottom: 5,
    letterSpacing: 1,
    marginLeft: 5,
  },
});
export default OwnRetreat;
