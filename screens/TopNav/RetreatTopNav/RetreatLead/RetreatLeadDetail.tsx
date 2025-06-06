import { ActivityIndicator, KeyboardAvoidingView, Modal, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import Container from '../../../../components/Container'
import { Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger } from 'react-native-popup-menu'
import { CommonActions, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import Colors from '../../../../utils/Colors'
import Images from '../../../../utils/Images'
import { globalStyle } from '../../../../utils/GlobalStyle'
import makeApiRequest from '../../../../utils/ApiService'
import { BASE_URL } from '../../../../utils/api'
import CustomButton from '../../../../components/Customs/CustomButton'
import CustomText from '../../../../components/Customs/CustomText'
import { moderateScale, screenHeight, screenWidth } from '../../../../components/Matrix/Matrix'
import CustomIcon from '../../../../components/Customs/CustomIcon'
import AccountCourseCard from '../../../../components/Cards/AccountCourseCard'
import CustomHeader2 from '../../../../components/Customs/Header/CustomHeader2'
import ChatPhoneCard from '../../../../components/Cards/ChatPhoneCard'
import UserTrainerPaymentModal from '../../../../components/Modal/UserTrainerPaymentModal'
import CalendarPicker from 'react-native-calendar-picker';
import { Formik } from 'formik'
import CustomToast  from '../../../../components/Customs/CustomToast'
import * as Yup from 'yup'
import CustomModal from '../../../../components/Customs/CustomModal'
import CustomInput from '../../../../components/Customs/CustomInput'

const followSchema = Yup.object().shape({
  comment: Yup.string().min(3, '*too Short').max(500, '*too large'),
  follow_up_date: Yup.date().required('*required'),
});

const RetreatLeadDetail = () => {
  const route: any = useRoute();
  const { lead_id, item, retreat_id } = route.params;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [lead, setLead] = useState<any>([]);
  const [update, setUpdate] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [data, setData] = useState<any>({});
  const [status1, setStatus1] = useState(null);
  const [transactionModal, settransactionModal] = useState(false);
  const [followModal, setFollowModal] = useState(false);
  const [isCalendar, setIsCalendar] = useState(false)

  useFocusEffect(
    useCallback(() => {
      RetreatList();
      leadLisfun();
    }, []),
  );

  const RetreatList = async () => {
    try {
      setLoading(true);
      // const response: any = await getMethod(
      //   `user-retreat-detail/?id=${retreat_id}`,
      // );

      const response: any = await makeApiRequest({
        baseUrl: BASE_URL,
        method: "GET",
        url: `user-retreat-detail/?id=${retreat_id}`
      });

      if (response?.data) {
        setData(response.data[0]);
        setStatus1(response.data[0].status);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error');
    }
  };

  const leadLisfun = async () => {
    setLoading(true);
    try {
      const response: any = await makeApiRequest({
        method: "GET",
        baseUrl: BASE_URL,
        url: `retreat-lead-detail?lead_id=${lead_id}`
      })

      if (response?.success === true) {
        setLead(response?.lead);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error');
    }
  };

  const retreatDetails = [
    {
      id: 1,
      title: "Price",
      value: data?.price,
      iconType: "MaterialIcons",
      iconName: "currency-rupee",
      bg: Colors.orange_blur,
      iconColor: Colors.orange
    },
    {
      id: 2,
      title: "Location",
      value: data?.location,
      iconType: "Ionicons",
      iconName: "location-sharp",
      bg: Colors.orange_blur,
      iconColor: Colors.orange
    },
    {
      id: 3,
      title: "Details",
      value: data["Program Detail"],
      iconType: "MaterialIcons",
      iconName: "currency-rupee",
      bg: Colors.orange_blur,
      iconColor: Colors.orange
    },
    {
      id: 3,
      title: "Number of Days",
      value: data?.no_of_days,
      iconType: "Feather",
      iconName: "sun",
      bg: Colors.orange_blur,
      iconColor: Colors.orange
    },
    {
      id: 4,
      title: "Number of Nights",
      value: data?.no_of_nights,
      iconType: "Feather",
      iconName: "moon",
      bg: Colors.orange_blur,
      iconColor: Colors.orange
    },
    {
      id: 5,
      title: "Group Size",
      value: data?.group_size,
      iconType: "MaterialIcons",
      iconName: "group",
      bg: Colors.orange_blur,
      iconColor: Colors.orange
    },
    {
      id: 6,
      title: "Start Date",
      value: data["start Date"],
      iconType: "Ionicons",
      iconName: "calendar-clear-outline",
      bg: Colors.orange_blur,
      iconColor: Colors.orange
    },
    {
      id: 7,
      title: "Accommodation Hotel",
      value: data["Accommodation Hotel"],
      iconType: "FontAwesome",
      iconName: "building-o",
      bg: Colors.orange_blur,
      iconColor: Colors.orange
    },
    {
      id: 8,
      title: "Room",
      value: data?.room,
      iconType: "MaterialIcons",
      iconName: "hotel",
      bg: Colors.orange_blur,
      iconColor: Colors.orange
    },

  ]


  console.log("==== log in the data retreat ====", data);
  console.log("==== log in the data lead ====", lead);


  const handleConfirm1 = (date: any) => {
    setDatePickerVisible(false);
    const formattedDate = formatDate(date);
    setSelectedDate(formattedDate);
    // setValue('end_date', formattedDate);
  };

  const formatDate = (date: any) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  const handleChangeStatus = async (status: number) => {
    try {
      const response: any = await makeApiRequest({
        url: 'user-retreat-lead-update-status',
        method: 'POST',
        data: {
          lead_id: lead_id,
          status,
        },
      });
      console.log('=== response ===', response);
      if (response?.success) {
        leadLisfun();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleFollowUps = (item: any) => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'AddRetreatLeadFollow',
        params: {
          lead_id: item,
        },
      }),
    );
  };

  const handleBooking = (item: any) => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'AddBookingScreen',
        params: {
          lead_id: lead_id,
        },
      }),
    );
  };

  const handlePayment = async (amount: number) => {

  }

  const onRefresh = () => {
    setLoading(true);
    leadLisfun(); // re-fetch the data
    RetreatList();
    setLoading(false);
  }

  return (
    <Container>
      <MenuProvider>
        {loading ? (
          <ActivityIndicator size={20} color="black" />
        ) : (
          <>
            <View style={[styles.row0, { marginRight: moderateScale(15) }]}>
              <View style={[globalStyle.row]} >
                <Pressable onPress={() => {
                  navigation.goBack();
                }} >
                  <CustomIcon type='AntDesign' size={30} name='arrowleft' />
                </Pressable>
                <CustomText customStyle={{ marginLeft: moderateScale(10) }} weight='700' size={22} text={`${lead['retreat name']} Details`} />
              </View>
              <View style={{ flexDirection: 'row', gap: 20 }}>
                <ChatPhoneCard lead={lead} />

                <MenuPop
                  navigation={navigation}
                  item={lead}
                  OpenFun={() => {
                    // confirmAction(1);
                    handleChangeStatus(1);
                  }}
                  CloseFun={() => {
                    // confirmAction(0);
                    handleChangeStatus(0);
                  }}
                />
              </View>
            </View>

            <ScrollView 
              refreshControl={
                <RefreshControl
                  refreshing={loading}
                  onRefresh={onRefresh}
                />
              }
            showsVerticalScrollIndicator={false} style={{ marginBottom: moderateScale(10), flex: 1 }} >
              <View style={{ marginBottom: moderateScale(10) }}>
                <AccountCourseCard
                  isDisable={false}
                  item={{
                    course_name: lead['retreat name'],
                    lead_date: lead['Lead Date'],
                    status: lead.status,
                    image: lead.image,
                    name: lead.name,
                  }}
                />
              </View>

              <View style={{ marginBottom: moderateScale(10) }}>
                {retreatDetails.map((item: any) => (
                  <View
                    style={[
                      globalStyle.row,
                      {
                        marginBottom: moderateScale(10),
                        marginTop: moderateScale(5),
                        backgroundColor: '#f7f7f7',
                        padding: moderateScale(10),
                        borderRadius: moderateScale(8),
                        width: '98%',
                        alignSelf: 'center',
                        elevation: 3
                      },
                    ]}>
                    <View
                      style={[
                        globalStyle.center,
                        {
                          width: moderateScale(50),
                          height: moderateScale(50),
                          borderRadius: moderateScale(100),
                          backgroundColor: item?.bg,
                        },
                      ]}>
                      <CustomIcon
                        color={item?.iconColor}
                        type={item?.iconType}
                        name={item?.iconName}
                      />
                    </View>
                    <View style={{ marginLeft: moderateScale(5) }}>
                      <CustomText text={item?.title} size={18} weight="600" />
                      <CustomText
                        text={item?.value}
                        weight="500"
                        size={16}
                        color={Colors.gray_font}
                      />
                    </View>
                  </View>
                ))}
              </View>

              {transactionModal && (
                <UserTrainerPaymentModal handlePayment={(amount: number) => { handlePayment(amount) }} data={data} transactionModal={transactionModal} settransactionModal={settransactionModal} bankData={bankData} />
              )}

            </ScrollView>
            {lead.status === 'Close' ? null : (
              <View
                style={[globalStyle.betweenCenter, { marginBottom: moderateScale(10), backgroundColor: 'transparent' }]}>
                {lead.booking !== 'yes' ? (
                  <CustomButton
                    onPress={() => handleBooking(lead.id)}
                    title="Add Booking"
                    bg={Colors.orange}
                    customStyle={{ width: '45%' }}
                    radius={30}
                  />
                ) : null}

                <CustomButton
                  radius={30}
                  onPress={() => {
                    setFollowModal(true)
                  }}
                  title="Add Follow Up"
                  customStyle={{ width: '45%' }}
                />
              </View>
            )}
          </>
        )}
      </MenuProvider>

      {
        followModal && (
          <CustomModal
            visible={followModal}
            onDismiss={() => {
              setFollowModal(false)
            }}
            iscenter={false}
            containerStyle={{
              height: screenHeight * .6,
              width: screenWidth,
              alignSelf: 'center'
            }}
          >
            <View style={{ width: "30%", height: moderateScale(3), borderRadius: moderateScale(100), marginTop: moderateScale(10), backgroundColor: Colors.gray, alignSelf: 'center', marginBottom: moderateScale(5) }} />
            <CustomText text='Follow Up' weight='600' size={18} customStyle={{ textAlign: 'center' }} />

            <KeyboardAvoidingView style={{ flex: 1 }} >
              <Formik
                initialValues={{
                  comments: '',
                  follow_up_date: '',
                }}
                validationSchema={followSchema}

                onSubmit={async (values) => {
                  // console.log("--- values in the course lead details ---", values)
                  try {
                    // lead_id
                    const row = {
                      lead_id: lead_id,
                      comments: values.comments,
                      follow_up_date: values.follow_up_date,
                    }

                    const response: any = await makeApiRequest({
                      baseUrl: BASE_URL,
                      url: 'user-retreat-lead-followup-create',
                      method: "POST",
                      data: row
                    });

                    console.log("=== comment in the retreat lead details ====", response);


                    if (response?.success === true) {
                      CustomToast({
                        type: "success",
                        text1: "Follow Up Successful",
                        text2: response?.message
                      })
                      navigation.dispatch(
                        CommonActions.navigate({
                          name: 'RetreatTopNav',
                          params: {
                            courseid: null,
                            screen: 'RetreatFollow',
                          },
                        }),
                      );
                      setIsCalendar(false)
                    }
                    else {
                      CustomToast({
                        type: "error",
                        text1: "Follow Up Unsuccessful",
                        text2: response?.message
                      })
                      setIsCalendar(false)
                    }
                  }
                  catch (err: any) {
                    console.log("Error in the Course Lead Details", err);

                  }
                }}
              >
                {({ handleChange, handleSubmit, setFieldValue, values, errors, touched }: any) => {
                  useEffect(() => {
                    console.log("errror in the retreat details", errors);
                  }, [errors]);

                  return (
                    <View style={{ flex: 1 }} >
                      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: .9, paddingHorizontal: moderateScale(10) }} >
                        <CustomInput
                          text='Comments'
                          handleChangeText={handleChange('comments')}
                        />
                        {
                          errors.comments && (
                            <CustomText text={errors?.comments} color='#ff0000' />
                          )
                        }


                        <CustomText text='Select Follow Up Date ' customStyle={{ marginTop: moderateScale(10) }} weight='500' size={15} />
                        <Pressable
                          style={[
                            styles.inputContainer,
                            {
                              borderWidth: touched.type ? 1 : 0,
                              borderColor: touched.type ? '#000' : '#fff',
                              marginVertical: moderateScale(10),
                            },
                          ]}
                          onPress={() => {
                            setIsCalendar(!isCalendar)
                          }}>
                          <CustomText
                            text={values.follow_up_date ? values.follow_up_date : 'To'}
                            color={values.follow_up_date ? '#000' : '#909090'}
                            weight="400"
                            size={15}
                          />
                        </Pressable>
                        {
                          isCalendar && <CalendarPicker
                            onDateChange={(date: any) => {
                              const formattedDate = new Date(
                                date,
                              ).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                              })
                                .split('/')
                                .reverse()
                                .join('-');

                              setFieldValue('follow_up_date', formattedDate.replaceAll('/', '-'));
                              setIsCalendar(false);
                            }}
                          />
                        }

                      </ScrollView>
                      <View style={{ flex: .2 }} >
                        <CustomButton title='Submit' onPress={handleSubmit} />
                      </View>
                    </View>
                  )
                }}
              </Formik>
            </KeyboardAvoidingView>
          </CustomModal>
        )
      }

    </Container>
  )
}

export default RetreatLeadDetail

const MenuPop = ({ navigation, item, OpenFun, CloseFun }: any) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const colorIcon = item.status === 'Open' ? 'green' : 'gray';
  const colorIcon1 = item.status === 'Close' ? 'red' : 'gray';
  const [closeButtonClicked, setCloseButtonClicked] = useState(false);
  const [isModal, setIsModal] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    setCloseButtonClicked(false); // Reset close button state when opening modal
  };

  const handleToggleAndClick = () => {
    if (!closeButtonClicked) {
      setModalVisible(false);
      setCloseButtonClicked(true); // Set close button clicked once
    }
  };

  return (
    <Menu>
      <MenuTrigger>
        {/* <Icon name="more-vert" type="material" color="black" size={40} /> */}
        <CustomIcon type='Entypo' name='dots-three-vertical' />
      </MenuTrigger>

      <MenuOptions
        customStyles={{
          optionWrapper: {
            paddingHorizontal: 15, // Adjust horizontal padding
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
        }}>
        <MenuOption  >
          <Pressable onPress={toggleModal} >
            <CustomText size={16} text='Change Lead Status' />

          </Pressable>
        </MenuOption>
        <Modal
          transparent={true}
          visible={isModalVisible}
          animationType="slide"
          onRequestClose={toggleModal}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Pressable style={styles.cancelIcon} onPress={toggleModal}>
                {/* <Icon type="material" name="close" size={30} color="#000" /> */}
                <CustomIcon type='AntDesign' name='close' />
              </Pressable>
              <View style={styles.rowIcon}>
                <Text style={styles.menuText1}>Change Lead Status</Text>

                <TouchableOpacity
                  style={styles.rowIcon1}
                  onPress={() => OpenFun(1)}>
                  <CustomIcon
                    type="Feather"
                    name="check-circle"
                    color={Colors.activeRadio}
                    size={30}
                  />
                  <Text style={styles.menuText}>Open</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rowIcon1}
                  onPress={() => CloseFun(0)}>
                  <CustomIcon
                    type="Feather"
                    name="x-circle"
                    color={Colors.red}
                    size={30}
                  />
                  <Text style={styles.menuText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {item.status !== 'Close' ? (
          <MenuOption  >
            <Pressable onPress={() => {
              setIsModal(true);
            }} >
              <CustomText size={16} text='Close Lead' />
            </Pressable>

          </MenuOption>
        ) : null}

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
                CloseFun(0)
              }} />
            </View>
          </View>
        </CustomModal>
      </MenuOptions>
    </Menu>
  );
};

const styles = StyleSheet.create({
  row0: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  menuText1: {
    color: Colors.black,
    fontFamily: 'Roboto-Medium',
    fontSize: 15,
    marginBottom: 10,
    marginTop: 20,
  },
  menuText2: {
    color: Colors.black,
    fontFamily: 'Roboto-Regular',
    fontSize: 14,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: screenWidth * .9,
    // height: responsiveHeight(18),
    backgroundColor: 'white',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 10,
    paddingBottom: 0,
  },
  cancelIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  modalText: {
    // marginTop: 20,
    // fontSize: 18,
    // textAlign: 'center',
  },
  rowIcon: {},
  rowIcon1: {
    flexDirection: 'row',
    gap: 10,
    // marginBottom:10,
    alignItems: 'center',
    marginBottom: 20,
  },
  menuText: {
    color: Colors.black,
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
  },
  inputContainer: {
    width: '100%',
    alignSelf: 'center',
    paddingVertical: moderateScale(15),
    borderRadius: moderateScale(8),
    borderWidth: 1,
    paddingHorizontal: moderateScale(10),
    marginTop: moderateScale(3),
    elevation: 2,
    backgroundColor: '#fff',
  },
})