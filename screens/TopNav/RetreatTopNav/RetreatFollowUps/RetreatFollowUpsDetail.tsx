import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import Container from '../../../../components/Container'
import CustomHeader2 from '../../../../components/Customs/Header/CustomHeader2'
import { CommonActions, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import makeApiRequest from '../../../../utils/ApiService'
import { Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger } from 'react-native-popup-menu'
import CustomIcon from '../../../../components/Customs/CustomIcon'
import { globalStyle } from '../../../../utils/GlobalStyle'
import { moderateScale, screenHeight, screenWidth } from '../../../../components/Matrix/Matrix'
import CustomText from '../../../../components/Customs/CustomText'
import Images from '../../../../utils/Images'
import CustomButton from '../../../../components/Customs/CustomButton'
import AccountCourseCard from '../../../../components/Cards/AccountCourseCard'
import Colors from '../../../../utils/Colors'
import { leadChangeStatus } from '../../../../utils/UtilityFuncations'
import FollowUpModal from '@components/Modal/FollowUpModal'

const RetreatFollowUpsDetail = () => {
  const navigation = useNavigation();
  const route: any = useRoute();
  const { followid } = route.params;
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState<any>([]);
  const [data, setData] = useState<any>([]);
  const [nextUpdate, setNextUpdate] = useState<any>([]);
  const [followModal, setFollowModal] = useState(false);


  useFocusEffect(useCallback(() => {
    const fetchData = async () => {
      await followHistory();
    };
    fetchData();
  }, []));


  // console.log("---- date in the retreat follow ups details ----",route?.params);


  const followHistory = async () => {
    setLoading(true);
    try {
      const response: any = await makeApiRequest({
        url: `user-retreat-lead-followup-detail?id=${followid}`,
        method: "GET"
      });

      // console.log("---- response in the follow up details ----", response);


      if (response?.success === true) {
        setData(response['Lead Detail']);
        setUpdate(response['Follow Up History']);
        setNextUpdate(response['Next Follow Up']);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to update lead status:', error);
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ flex: 1, backgroundColor: "#fff" }} size={25} color={'black'} />;
  }

  const confirmAction = async () => {
    const update = await leadChangeStatus('Retreat', data?.lead_id, 2);
    if (update)
      followHistory();
  };

  const text =
    typeof nextUpdate?.comments === 'string' && nextUpdate.comments.length > 100
      ? `${nextUpdate.comments.substring(0, 100)}...`
      : nextUpdate?.comments || 'No comments available';

  return (
    <Container>
      <MenuProvider>
        <View style={[globalStyle.betweenCenter, { marginRight: moderateScale(15), marginBottom: moderateScale(15), marginTop: moderateScale(10) }]} >
          <View style={[globalStyle.row]} >
            <Pressable onPress={() => {
              navigation.goBack();
            }} >
              <CustomIcon type='AntDesign' name='arrowleft' size={30} />
            </Pressable>
            <CustomText customStyle={{ marginLeft: moderateScale(10) }} text='Follow Up Details' size={22} weight='600' />
          </View>
          <View style={[globalStyle.betweenCenter, { flex: .4, marginRight: moderateScale(5) }]} >
            {data.status !== "Subscribed" && data.booking !== 'yes' && (
              <Pressable style={{ marginRight: moderateScale(5) }} onPress={() => {
                setFollowModal(true)
              }} >
                <CustomIcon type='AntDesign' name='plus' size={30} />
              </Pressable>
            )}
            {data.status !== "Subscribed" && (
              <MenuPop
                navigation={navigation}
                followid={followid}
                CloseFun={() => confirmAction()}
                data={data}
              />
            )}
          </View>
        </View>

        {data ? (
          <>
            <View style={styles.row}>
              <AccountCourseCard
                isDisable={true}
                isHome={true}
                item={{
                  name: data?.name,
                  course_name: data?.retreat_name,
                  lead_date: data?.date,
                  image: data.image,
                  status: text,
                }}
              />
              <ScrollView
                showsVerticalScrollIndicator={false}
              // refreshControl={
              //   <RefreshControl
              //     refreshing={refreshing}
              //     onRefresh={onRefresh}
              //   />
              // }
              >
                {nextUpdate.comments ? (
                  <View style={styles.box}>
                    <CustomButton
                      onPress={() => { }}
                      title="Next Follow Up"
                      disabled={true}
                    />
                    <>
                      <View
                        style={[styles.box0, { marginTop: moderateScale(10) }]}>
                        <CustomIcon type="Feather" name="message-square" />
                        <CustomText
                          text={nextUpdate?.comments}
                          size={15}
                          weight="500"
                        />
                      </View>
                      <View style={styles.box0}>
                        <CustomIcon
                          type="Ionicons"
                          name="calendar-number-outline"
                        />
                        <CustomText
                          text={nextUpdate?.follow_up_date}
                          size={15}
                          weight="500"
                        />
                      </View>
                    </>
                  </View>
                ) : (
                  <View style={styles.textBg}>
                    <Text style={styles.course}>No Comment Available</Text>
                  </View>
                )}

                <View style={styles.box1}>
                  {/* follow up history */}
                  <CustomButton
                    onPress={() => { }}
                    title="Follow Up History"
                    disabled={true}
                  />
                  <ScrollView style={{ minHeight: screenHeight * .4 }}>
                    {update.map((item: any, index: number) => (
                      <View key={index}>
                        {/* Use index or a unique key */}
                        <View
                          style={[
                            globalStyle.betweenCenter,
                            { marginTop: moderateScale(5) },
                          ]}>
                          <CustomIcon type="Feather" name="message-square" />
                          <CustomText
                            text={item.comments}
                            size={15}
                            weight="500"
                          />
                        </View>

                        <View
                          style={[
                            globalStyle.betweenCenter,
                            { marginTop: moderateScale(5) },
                          ]}>
                          <CustomIcon
                            type="Ionicons"
                            name="calendar-number-outline"
                          />
                          <CustomText
                            text={item.follow_up_date}
                            size={15}
                            weight="500"
                          />
                        </View>
                        <View
                          style={{
                            width: '98%',
                            height: 0.5,
                            backgroundColor: Colors.gray_font,
                            marginTop: moderateScale(5),
                          }}
                        />
                      </View>
                    ))}
                  </ScrollView>
                </View>
              </ScrollView>
            </View>
          </>
        ) : (
          <View style={[globalStyle.center]}>
            <Images.Logo width={moderateScale(100)} height={moderateScale(100)} />
            <CustomText text='No Data Found' weight='600' />
          </View>
        )}

        {
          followModal && (
            <FollowUpModal followModal={followModal} isRetreat={true} handleLoading={() => {
              followHistory()
            }} onScreen={true} setFollowModal={setFollowModal} lead_id={followid} />
          )
        }
      </MenuProvider>
    </Container>
  )
}

export default RetreatFollowUpsDetail

const MenuPop = ({ navigation, followid, CloseFun, data }: any) => {

  const SentFun1 = () => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'AddBookingScreen',
        params: {
          lead_id: followid,
        },
      }),
    );
  };
  return (
    <Menu>
      <MenuTrigger>
        <CustomIcon type='Entypo' name='dots-three-vertical' />
      </MenuTrigger>

      <MenuOptions
        customStyles={{
          optionWrapper: {
            paddingHorizontal: moderateScale(10), // Adjust horizontal padding
            paddingVertical: moderateScale(7),
            marginVertical: -moderateScale(4),
            height: moderateScale(50),
            justifyContent: "center"
          },
          optionsContainer: {
            marginVertical: moderateScale(25),
            paddingVertical: moderateScale(10),
            backgroundColor: '#fff', // Set background color
            borderRadius: moderateScale(15), // Rounded corners
            elevation: 5, // Add shadow for Android
            shadowColor: '#000', // Shadow color for iOS
            shadowOpacity: 0.2, // Shadow opacity for iOS
            shadowRadius: 4, // Shadow radius for iOS
            shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
          },
        }}
      >

        {data.booking !== 'yes' ? (
          <MenuOption onSelect={() => SentFun1()}>
            <CustomText text='Add Booking' />
          </MenuOption>
        ) : null}

        {data.status !== 'Close' && (
          <MenuOption onSelect={() => CloseFun()}>
            <CustomText text='Close Lead' />
          </MenuOption>
        )}
      </MenuOptions>
    </Menu>
  )
}

const styles = StyleSheet.create({
  row: {
    flexGrow: 3,
    flex: 3,
    borderRadius: moderateScale(10),
    width: screenWidth * .95,
    backgroundColor: 'white',
    padding: moderateScale(10),
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginTop: moderateScale(20),
  },
  box: {
    width: '98%',
    backgroundColor: '#f7f7f7',
    flexDirection: 'column',
    borderRadius: moderateScale(5),
    position: 'relative',
    padding: moderateScale(10),
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginBottom: moderateScale(10),
    elevation: 5,
    marginTop: moderateScale(5),
  },
  box0: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: moderateScale(7),
    // marginTop: moderateScale(3),
  },
  textBg: {
    width: screenWidth * .8,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: moderateScale(5),
    padding: moderateScale(10),
  },
  box1: {
    width: '98%',
    backgroundColor: '#f7f7f7',
    flexDirection: 'column',
    borderRadius: moderateScale(5),
    padding: moderateScale(20),
    alignSelf: 'center',
    gap: 10,
    opacity: 88,
    elevation: 5,
    marginTop: moderateScale(10),
  },
  course: {
    minWidth: screenWidth * .2,
    maxWidth: screenWidth * .45,
    marginBottom: moderateScale(10),
    flexWrap: 'wrap',
    fontFamily: 'Roboto-Regular',
    fontSize: 15,
    color: 'black',
    textAlign: 'justify',
  },
})