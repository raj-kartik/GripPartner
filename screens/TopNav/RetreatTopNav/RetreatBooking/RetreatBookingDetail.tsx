import { ActivityIndicator, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import Container from '../../../../components/Container'
import CustomHeader2 from '../../../../components/Customs/Header/CustomHeader2'
import { CommonActions, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import makeApiRequest from '../../../../utils/ApiService'
import { BASE_URL, RETREAT_BOOING_END, RETREAT_BOOKING_DETAILS, RETREAT_BOOKING_HISTORY } from '../../../../utils/api'
import Colors from '../../../../utils/Colors'
import { Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger } from 'react-native-popup-menu'
import CustomIcon from '../../../../components/Customs/CustomIcon'
import CustomText from '../../../../components/Customs/CustomText'
import { globalStyle } from '../../../../utils/GlobalStyle'
import { moderateScale, screenHeight, screenWidth } from '../../../../components/Matrix/Matrix'
import Images from '../../../../utils/Images'
import { FranchiseTrainerCard } from '../../../../components/Cards/FranchiseTrainerCard'
import { CustomToast } from '../../../../components/Customs/CustomToast'
import CustomButton from '../../../../components/Customs/CustomButton'
import CustomModal from '../../../../components/Customs/CustomModal'
import * as Yup from 'yup'
import CalendarPicker from 'react-native-calendar-picker';
import { Formik } from 'formik'
import CustomInput from '../../../../components/Customs/CustomInput'
import axios from 'axios'

const bookingSchema = Yup.object().shape({
  amount: Yup.string().required("*required"),
  date: Yup.date().required('*required'),
});

const RetreatBookingDetail = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [bookingRetreat, setBookingRetreat] = useState<any>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [isCalendar, setIsCalendar] = useState<boolean>(false)
  const [booking, setBooking] = useState<any>([]);
  const route: any = useRoute();
  const [paymentType, setPaymentType] = useState('');
  const { Booking_id }: any = route.params;


  console.log("----- booking id ----",Booking_id);
  

  useFocusEffect(useCallback(() => {
    const fetchData = async () => {
      await BookingLisfun();
      await BookingHistory();
    };

    fetchData();
  }, []));

  const BookingLisfun = async () => {
    setLoading(true);
    try {
      const response: any = await makeApiRequest({
        baseUrl: BASE_URL,
        url: RETREAT_BOOKING_DETAILS(Booking_id),
        method: "POST"
      });

      // const repo:any = await axios.post(`${BASE_URL}${RETREAT_BOOKING_DETAILS(Booking_id)}`);

      // console.log("---- repo in the retreat booking details ----",repo);
      
      if (response.success === true) {
        setBooking(response?.data[0]);
        setBookingRetreat(response?.retreat_details[0]);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error in the booking retreat details ",error);
    }
  };


  console.log("----- booking in retreat details ----", booking);


  const BookingHistory = async () => {
    setLoading(true);
    try {
      const response: any = await makeApiRequest({
        baseUrl: BASE_URL,
        url: RETREAT_BOOKING_HISTORY(Booking_id),
        method: "POST"
      })

      if (response.status === 'success') {
        setHistory(response?.data);
        // setMessage1(response.data.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error');
    }
  };

  const bookingInfo = [
    {
      id: 1,
      label: 'Room Type',
      value: bookingRetreat.room_type,
      iconType: 'Feather',
      iconName: 'airplay',
      color: '#ff0000',
      bg: 'rgba(255,0,0,0.1)',
    },
    {
      id: 2,
      label: 'Group Size',
      value: bookingRetreat.group_size,
      iconType: 'Feather',
      iconName: 'users',
      color: '#cf03eb',
      bg: 'rgba(207, 3, 235,0.1)',
    },
    {
      id: 3,
      label: 'Booking Date',
      value: bookingRetreat['Booking Date'],
      iconType: 'Feather',
      iconName: 'calendar',
      color: '#eba803',
      bg: 'rgba(235, 168, 3,0.1)',
    },
    {
      id: 6,
      label: 'Total Amount',
      value: bookingRetreat?.retreat_price || 0,
      iconType: 'FontAwesome',
      iconName: 'rupee',
      color: '#6b0fa6',
      bg: 'rgba(107, 15, 166,0.1)',
    },
    {
      id: 4,
      label: 'Last Payment Date',
      value: booking?.payment_date,
      iconType: 'Ionicons',
      iconName: 'calendar-outline',
      color: '#05931b',
      bg: 'rgba(5, 147, 27 ,0.1)',
    },
    {
      id: 5,
      label: 'Last Paid Amount',
      value: booking['last payment'],
      iconType: 'FontAwesome',
      iconName: 'rupee',
      color: '#6b0fa6',
      bg: 'rgba(107, 15, 166,0.1)',
    },
    {
      id: 6,
      label: 'Balance Amount',
      value: bookingRetreat?.balance || 0,
      iconType: 'FontAwesome',
      iconName: 'rupee',
      color: Colors.orange,
      bg: 'rgba(255,165,0,0.1)',
    },
  ];

  if (loading) {
    return <ActivityIndicator style={{ flex: 1, backgroundColor: "#fff" }} size="large" color={'black'} />;
  }

  const handlePaymentStatus = async (data: any) => {
    const row = {
      booking_id: Booking_id, // using the correct subscription ID
      due_amount: data.amount,
      due_date: data.date,
    };

    const endpoint = paymentType === "balance_payment" ? 'retreat-booking-mark-fees-due' : 'retreat-booking-mark-fees-paid'

    try {
      const response: any = await makeApiRequest({
        method: "POST",
        url: endpoint,
        data: row
      });

      console.log("=== response in the add payment functions :", response);

      if (response?.success === true) {
        CustomToast({
          type: "success",
          text1: "Fees marked due",
          text2: response?.message
        })
      }
      else {
        CustomToast({
          type: "error",
          text1: "Something want wrong",
          text2: response?.message
        })
        BookingHistory();
        BookingLisfun();
      }
    }
    catch (err) {
      console.log("Error in the add payment function :", err);
    }

  }

  return (
    <Container>
      <MenuProvider>
        <View style={[globalStyle.betweenCenter, { marginRight: moderateScale(15), marginBottom: moderateScale(15), marginTop: moderateScale(10) }]} >
          <View style={[globalStyle.row]} >
            <Pressable>
              <CustomIcon type='AntDesign' name='arrowleft' size={30} />
            </Pressable>
            <CustomText customStyle={{ marginLeft: moderateScale(10) }} text='Booking Details' size={22} weight='600' />
          </View>
          <MenuPop navigation={navigation}
            item={history}
            id={Booking_id}
            // message1={message1}
            bookingDetail={booking} />
        </View>

        <ScrollView style={{ flex: .8 }} showsVerticalScrollIndicator={false} >
          {booking ? (
            <View>
              <FranchiseTrainerCard booking={booking} />

              {bookingInfo.map((item: any) => (
                <View
                  style={[
                    globalStyle.flex,
                    {
                      marginBottom: moderateScale(10),
                      padding: moderateScale(10),
                      backgroundColor: item?.bg,
                      borderWidth: 1,
                      borderColor: item?.color,
                      borderRadius: moderateScale(5),
                    },
                  ]}>
                  <CustomIcon
                    type={item?.iconType}
                    name={item?.iconName}
                    color={item?.color}
                  />
                  <View style={{ marginLeft: moderateScale(5) }}>
                    <CustomText
                      text={item?.label}
                      weight="600"
                      size={16}
                      color={item?.color}
                    />
                    <CustomText text={item?.value} />
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={{}}>
              <Images.Logo />
              <CustomText text='No Bookings' weight='500' size={16} />
            </View>
          )}
        </ScrollView>
        {
          booking["payment status"] !== "Ended" && <View
            style={[
              globalStyle.betweenCenter,
              { width: '100%', marginTop: moderateScale(10), flex: .2 },
            ]}>
            <CustomButton
              title="Add Payment"
              onPress={() => {
                if (bookingRetreat?.balance !== 0) {
                  setPaymentType('balance_payment');
                  setConfirmVisible(true);
                } else {
                  CustomToast({
                    type: 'info',
                    text1: 'No Balance Amount Left',
                    text2: 'User already paid this amount',
                  });
                }
              }}
            />
          </View>
        }

      </MenuProvider>

      <CustomModal
        visible={confirmVisible}
        iscenter={false}
        containerStyle={{ height: screenHeight * .5, width: screenWidth, alignSelf: "center" }}
        onDismiss={() => {
          setConfirmVisible(false)
        }}
      >
        <View style={[globalStyle.modalbar, { marginVertical: moderateScale(10) }]} />
        <CustomText text='Add Payment' weight='500' size={18} customStyle={{ textAlign: "center" }} />

        <KeyboardAvoidingView style={{ flex: 1 }} >
          <Formik
            initialValues={{
              amount: '',
              date: '',
            }}
            validationSchema={bookingSchema}

            onSubmit={async (values) => {
              handlePaymentStatus(values);
            }}
          >
            {({ handleChange, handleSubmit, setFieldValue, values, errors, touched }: any) => {
              return (
                <View style={{ flex: 1 }} >
                  <ScrollView showsVerticalScrollIndicator={false} style={{ flex: .9, paddingHorizontal: moderateScale(10) }} >
                    <CustomInput
                      text='Enter Amount'
                      handleChangeText={handleChange('amount')}
                      keyboardType='numeric'
                    />
                    {
                      errors.amount && (
                        <CustomText text={errors?.amount} color='#ff0000' />
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
                        text={values.date ? values.date : 'To'}
                        color={values.date ? '#000' : '#909090'}
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

                          setFieldValue('date', formattedDate.replaceAll('/', '-'));
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
    </Container>
  )
}

export default RetreatBookingDetail;

const MenuPop = ({ navigation, item, id, bookingDetail }: any) => {

  const [historyModa, setHistoryModal] = useState(false);
  const [isCancel, setIsCancel] = useState(false);

  // const date = new Date().toISOString().slice(0, 10);

  const handleCancelBooking = async () => {
    try {
      const response: any = await makeApiRequest({
        method: "POST",
        url: RETREAT_BOOING_END,
        data: {
          booking_id: id,
          end_date: new Date().toISOString().slice(0, 10)
        }
      });
      if (response?.success === true) {
        CustomToast({
          type: "success",
          text1: "Booking Cancel Successful",
          text2: response?.message
        });
        setIsCancel(false);
      }
    }
    catch (err: any) {
      console.error("Error in the cancelling booking", err);

    }
  }

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
        <MenuOption onSelect={() => {
          setHistoryModal(true)
        }}>
          <CustomText text='History' />
        </MenuOption>

        {bookingDetail['payment status'] === 'Ended' ? null : (
          <MenuOption onSelect={() => {
            setIsCancel(true)
          }}>
            <CustomText text='Cancel Booking' />
          </MenuOption>
        )}


      </MenuOptions>

      <CustomModal
        visible={isCancel}
        onDismiss={() => {
          setIsCancel(false);
        }}
        iscenter={true}
        containerStyle={{ height: screenHeight * .17 }}
      >
        <View style={globalStyle.modalbar} />
        <View style={[globalStyle.center, { flex: 1 }]} >
          <CustomText size={16} customStyle={{ textAlign: "center" }} text='Do you want to cancel to booking?' weight='500' />
          <View style={[globalStyle.betweenCenter, { marginTop: moderateScale(20), flex: 1, width: "100%" }]} >
            <CustomButton bg={Colors.orange} customStyle={{ width: "45%" }} title='No' onPress={() => {
              setIsCancel(false)
            }} />
            <CustomButton customStyle={{ width: "45%" }} title='Yes' onPress={() => {
              // CloseFun()
              handleCancelBooking()
            }} />
          </View>
        </View>
      </CustomModal>

      <CustomModal
        visible={historyModa}
        onDismiss={() => {
          setHistoryModal(false);
        }}
        iscenter={true}
        containerStyle={{ height: screenHeight * .17 }}
      >
        <View style={globalStyle.modalbar} />
        <View style={[globalStyle.center, { flex: 1 }]} >
          <CustomText size={16} customStyle={{ textAlign: "center" }} text='History' weight='500' />
          <ScrollView showsVerticalScrollIndicator={false} style={[{ marginTop: moderateScale(20), flex: 1, width: "100%", }]} >
            {item ? (
              item.map((item: any) => (
                <View style={[globalStyle.betweenCenter, { flex: 1 }]} >
                  <CustomText weight='500' text={`₹${item.paid_amount}` || '₹0'} />
                  <CustomText weight='500' text={`${item.paid_date}` || '₹0'} />
                </View>
              ))
            ) : (
              <View style={[globalStyle.center]}>
                <Images.Logo />
                <CustomText text='No History' />
              </View>
            )}
          </ScrollView>
        </View>
      </CustomModal>
    </Menu>
  )
}

const styles = StyleSheet.create({
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