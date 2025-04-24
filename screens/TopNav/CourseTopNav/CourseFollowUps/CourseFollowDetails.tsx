import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { FC, useCallback, useEffect, useState } from 'react'
import Container from '../../../../components/Container'
import CourseCard2 from '../../../../components/Cards/CourseCard2'
import CustomHeader2 from '../../../../components/Customs/Header/CustomHeader2'
import makeApiRequest from '../../../../utils/ApiService'
import { BASE_URL } from '../../../../utils/api'
import { longFormatters } from 'date-fns'
import { CommonActions, useFocusEffect } from '@react-navigation/native'
import FollowUpCard from '../../../../components/Cards/FollowUpCard'
import { Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger } from 'react-native-popup-menu'
import CustomIcon from '../../../../components/Customs/CustomIcon'
import CustomText from '../../../../components/Customs/CustomText'
import { globalStyle } from '../../../../utils/GlobalStyle'
import { moderateScale, screenHeight, screenWidth } from '../../../../components/Matrix/Matrix'
import Colors from '../../../../utils/Colors'
import CustomModal from '../../../../components/Customs/CustomModal'
import CustomButton from '../../../../components/Customs/CustomButton'
import { leadChangeStatus } from '../../../../utils/UtilityFuncations'

interface Props {
  route: any;
  navigation: any
}

const CourseFollowDetails: FC<Props> = ({ route, navigation }) => {

  const { follow, lead_id } = route.params;


  // console.log("=== course follow up details ===",follow);
  // console.log("=== course lead id ===",lead_id);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>([]);
  const [nextUpdate, setNextUpdate] = useState([]);
  const [update, setUpdate] = useState<any>([]);

  useFocusEffect(useCallback(() => {
    handleNextFollowUpHistory();
    handleFollowHistory();
  }, []));

  const handleNextFollowUpHistory = async () => {
    try {
      const response: any = await makeApiRequest({
        baseUrl: BASE_URL,
        method: "POST",
        url: 'next-lead-follow-up-history',
        data: {
          leadId: lead_id
        }
      });

      console.log("response in the handleNextFollowUpHistory:", response)

      if (response?.success === true) {
        setNextUpdate(response?.followUpHistory);
      }

    }
    catch (err: any) {
      console.error("Error in the follow up details course handleNextFollowUpHistory:", err);
    }
  }

  const handleFollowHistory = async () => {
    setLoading(true);
    try {
      // const response: any = await postMethod('lead-follow-up-history', row);
      const response: any = await makeApiRequest({
        method: "POST",
        baseUrl: BASE_URL,
        url: 'lead-follow-up-history',
        data: { leadId: lead_id, }
      })

      console.log("=== response in the handle follow history ===", response);

      if (response?.success === true) {
        setUpdate(response?.followUpHistory);
      }
    } catch (error) {
      console.error('Failed to update lead status:', error);
    } finally {
      setLoading(false);
    }
  };


  const confirmAction = async (num: number) => {
    const update = await leadChangeStatus('Course', lead_id, num);

    if (update) {
      handleNextFollowUpHistory();
      handleFollowHistory();
    }
  };

  return (
    <Container>

      <MenuProvider>
        <View style={[globalStyle.between, { marginBottom: moderateScale(15), marginRight: moderateScale(15), marginTop: moderateScale(10) }]} >
          <View style={[globalStyle.row]} >
            <Pressable>
              <CustomIcon type='AntDesign' name='arrowleft' size={30} />
            </Pressable>
            <CustomText customStyle={{ marginLeft: moderateScale(10) }} text='Follow Up Detail' weight='600' size={22} />
          </View>
          <MenuPop
            navigation={navigation}
            lead_id={lead_id}
            CloseFun={() => confirmAction(0)}
            follow={follow}
          />
        </View>
        {
          loading ? (
            <ActivityIndicator size="large" color="#000" />) : (
            <View>
              <FollowUpCard follow={follow} />
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.box}>
                  <View style={styles.textBg}>
                    <CustomText
                      text="Next Follow Up"
                      color="#fff"
                      weight="600"
                      size={16}
                    />
                  </View>
                  {nextUpdate.map((item: any) => (
                    <>
                      <ScrollView style={{ maxHeight: screenHeight * 1.5 }}>
                        <View
                          style={{
                            backgroundColor: '#fcfcfc',
                            marginBottom: moderateScale(15),
                            marginHorizontal: moderateScale(5),
                            padding: moderateScale(12),
                            borderRadius: moderateScale(10),
                            elevation: 5,

                            // marginTop: moderateScale(3),
                          }}>
                          <View style={[globalStyle.between]}>
                            <CustomIcon
                              size={20}
                              type="MaterialCommunityIcons"
                              name="message-reply-outline"
                            />
                            <Text style={styles.course}>{item.comments}</Text>
                          </View>
                          <View style={[globalStyle.between]}>
                            <CustomIcon
                              type="Feather"
                              name="calendar"
                              size={20}
                              color="#000"
                            />
                            <CustomText
                              color={Colors.gray_font}
                              text={item.follow_up_date}
                            />
                          </View>
                        </View>
                      </ScrollView>
                    </>
                  ))}
                </View>

                <View style={styles.box1}>
                  <View
                    style={[styles.textBg, { marginBottom: moderateScale(10) }]}>
                    <CustomText
                      text="Follow Up History"
                      color="#fff"
                      weight="600"
                      size={16}
                    />
                  </View>

                  <ScrollView showsVerticalScrollIndicator={false} >
                    {update.map((item: any, index: number) => (
                      <View key={index}>
                        {/* Use index or a unique key */}
                        <View
                          style={{
                            backgroundColor: '#fcfcfc',
                            marginBottom: moderateScale(15),
                            marginHorizontal: moderateScale(5),
                            padding: moderateScale(12),
                            borderRadius: moderateScale(10),
                            elevation: 5,

                            // marginTop: moderateScale(3),
                          }}>
                          <View style={[globalStyle.between]}>
                            <CustomIcon
                              size={20}
                              type="MaterialCommunityIcons"
                              name="message-reply-outline"
                            />
                            {/* <Text style={styles.course}>{item.comments}</Text> */}
                            <CustomText weight="500" text={item?.comments} />
                          </View>
                          <View style={[globalStyle.between]}>
                            <CustomIcon
                              type="Feather"
                              name="calendar"
                              size={20}
                              color="#000"
                            />
                            <CustomText
                              text={item.follow_up_date}
                              color={Colors.gray_font}
                            />
                          </View>
                        </View>
                        {/* <Divider /> */}
                      </View>
                    ))}
                  </ScrollView>
                </View>
              </ScrollView>
            </View>
          )
        }
      </MenuProvider>
    </Container>
  )
}


const MenuPop = ({ navigation, lead_id, CloseFun, follow }: any) => {

  const [isModal, setIsModal] = useState<boolean>(false);
  const SentFun1 = (item: any) => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'CourseSubsDetails',
        params: {
          lead_id: item,
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
            paddingHorizontal: moderateScale(15), // Adjust horizontal padding
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

        {follow?.status !== '2' && (
          <MenuOption onSelect={() => SentFun1(lead_id)}>
            <CustomText text='Subscribe' />
          </MenuOption>
        )}

        {/* <MenuOption>
          <CustomText text='Change Lead Status' />
        </MenuOption> */}

        <MenuOption onSelect={() => {
          setIsModal(true);
        }} >
          <CustomText text='Close Lead' />
        </MenuOption>
      </MenuOptions>

      <CustomModal
        visible={isModal}
        onDismiss={() => {
          setIsModal(false);
        }}
        iscenter={true}
        containerStyle={{ height: screenHeight * .17 }}
      >
        <View style={globalStyle.modalbar} />
        <View style={[globalStyle.center, { flex: 1 }]} >
          <CustomText size={16} customStyle={{ textAlign: "center" }} text='Are you sure you want to close?' weight='500' />
          <View style={[globalStyle.betweenCenter, { marginTop: moderateScale(20), flex: 1, width: "100%" }]} >
            <CustomButton bg={Colors.orange} customStyle={{ width: "45%" }} title='No' onPress={() => {
              setIsModal(false)
            }} />
            <CustomButton customStyle={{ width: "45%" }} title='Yes' onPress={() => {
              CloseFun()
            }} />
          </View>
        </View>
      </CustomModal>
    </Menu>
  )
}

export default CourseFollowDetails

const styles = StyleSheet.create({
  course: {
    minWidth: screenWidth * .2,
    maxWidth: screenWidth * .5,
    marginBottom: 10,
    flexWrap: 'wrap',
    fontFamily: 'Roboto-Regular',
    fontSize: 15,
    color: 'black',
    textAlign: 'justify',
  },
  box: {
    width: '100%',
    backgroundColor: '#D3D3D3',
    flexDirection: 'column',
    borderRadius: 5,
    alignSelf: 'center',
    justifyContent: 'space-between',
    padding: moderateScale(10),
    gap: moderateScale(10),
    marginBottom: moderateScale(10),
    // opacity: 88,
    elevation: 1,
  },

  // EEECEC
  box1: {
    width: '100%',
    backgroundColor: '#EEECEC',
    flexDirection: 'column',
    borderRadius: 5,
    alignSelf: 'center',
    padding: moderateScale(10),
    opacity: 88,
    elevation: 1,
  },

  textBg: {
    width: '100%',
    maxHeight: screenHeight * .5,
    alignItems: 'center',
    backgroundColor: 'black',
    borderRadius: moderateScale(5),
    padding: moderateScale(10),
  },
})