import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { FC, useCallback, useState } from 'react'
import Container from '../../../../components/Container'
import CustomHeader2 from '../../../../components/Customs/Header/CustomHeader2'
import { useFocusEffect } from '@react-navigation/native';
import makeApiRequest from '../../../../utils/ApiService';
import { BASE_URL, POST_UNSUBSCRIBE_COURSE } from '../../../../utils/api';
import { Menu, MenuOption, MenuOptions, MenuProvider, MenuTrigger } from 'react-native-popup-menu';
import CustomIcon from '../../../../components/Customs/CustomIcon';
import CalendarPicker from 'react-native-calendar-picker';
import CustomText from '../../../../components/Customs/CustomText';
import SubscriptionCard from '../../../../components/Cards/SubscriptionCard';
import { globalStyle } from '../../../../utils/GlobalStyle';
import { moderateScale, screenHeight, screenWidth } from '../../../../components/Matrix/Matrix';
import Colors from '../../../../utils/Colors';
import CustomButton from '../../../../components/Customs/CustomButton';
import CustomModal from '../../../../components/Customs/CustomModal';
import CustomInput from '../../../../components/Customs/CustomInput';
import CustomToast  from '../../../../components/Customs/CustomToast';


interface Props {
  navigation: any;
  route: any;
}
const CourseSubsDetails: FC<Props> = ({ navigation, route }) => {
  const { suscription_id } = route.params;
  const [isDatePickerVisible, setDatePickerVisible] = useState({
    dueCalendar: false,
    paidDate: false
  });

  const [modalType, setModalType] = useState({
    paid: false,
    due: false
  })

  const [suscription, setSuscription] = useState<any>([]);
  const [message, setMessage] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // due
  const [dueAmount, setDueAmount] = useState('0');
  const [dueDate, setDueDate] = useState<string>('');

  // paid
  const [paidAmount, setPaidAmount] = useState('0');
  const [paidDate, setPaidDate] = useState<string>('');


  // console.log("=== suscription in the course subs details ====", suscription);


  useFocusEffect(
    useCallback(() => {
      suscriptionLisfun();
      suscriptionHistory();
    }, []),
  );

  const suscriptionLisfun = async () => {
    setLoading(true);
    try {
      const response: any = await makeApiRequest({
        baseUrl: BASE_URL,
        url: `suscription-detail?suscription_id=${suscription_id}`,
        method: "GET"
      });
      if (response.status === 'success') {
        setSuscription(response?.subscription);
      }
      // console.log("==== response in the couse mark fees ===",response.data);

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const suscriptionHistory = async () => {
    setLoading(true);
    try {
      // const response: any = await postMethod('suscription-history', row);
      const response: any = await makeApiRequest({
        method: "POST",
        baseUrl: BASE_URL,
        url: 'suscription-history',
        data: {
          suscription_id: suscription_id
        }
      });

      console.log('=== history ====', response);
      if (response.status === 'success') {
        setHistory(response?.history);
        setMessage(response?.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };


  const handleDue = async () => {

    if (!dueAmount || !dueDate) {
      CustomToast({
        type: "info",
        text1: "Please fill Amount and Date",
        text2: ""
      });
      return;
    }

    try {
      const row = {
        suscription_id: suscription_id, // using the correct subscription ID
        due_amount: dueAmount,
        due_date: dueDate,
      };

      // const response: any = await postMethod('suscription-mark-fees-due', row);
      const response: any = await makeApiRequest({
        method: "POST",
        baseUrl: BASE_URL,
        url: 'suscription-mark-fees-due',
        data: row
      });

      if (response?.success === true) {
        setModalType(false);
        CustomToast({
          type: "success",
          text1: response?.message,
          text2: ""
        });
        suscriptionLisfun();
        suscriptionHistory();
      }
      else {
        setDatePickerVisible({
          paidDate: false,
          dueCalendar: false
        })
        CustomToast({
          type: "error",
          text1: response?.message,
          text2: ""
        })

      }
      setDueAmount('0');
      setDueDate('');

    }
    catch (err: any) {
      console.error("Error in the handle due:", err);

    }
  }

  const today = new Date().toISOString().slice(0, 10);

  console.log("------ subccription ----", suscription);


  const handleUnSubscribe = async () => {
    try {
      const response: any = await makeApiRequest({
        baseUrl: BASE_URL,
        url: POST_UNSUBSCRIBE_COURSE,
        data: {
          // subscription_id: lead_id,
          subscription_id: "",
          end_date: today,
        },
        method: 'POST',
      });


      if (response?.success) {
        CustomToast({
          type: "success",
          text1: "You have succesfully unsubscribe the student",
          text2: "This user is no longer your student"
        });
        suscriptionLisfun();
        suscriptionHistory();
        setUnsubModal(false);
      }

      console.log("---- response in the unsubscribe the trainer ---", response);

    } catch (err: any) {
      console.error('Error in the unsubscribe the course', err);
    }
  };


  console.log("---- paidAmount ----", paidAmount);
  console.log("---- paidDate ----", paidDate);


  const handlePaid = async () => {

    if (!paidAmount || !paidDate) {
      CustomToast({
        type: "info",
        text1: "Please fill Amount and Date",
        text2: ""
      });
      return;
    }

    try {
      const row = {
        suscription_id: suscription_id, // using the correct subscription ID
        paid_amount: paidAmount,
        paid_date: paidDate,
      };

      // const response: any = await postMethod('suscription-mark-fees-due', row);
      const response: any = await makeApiRequest({
        method: "POST",
        baseUrl: BASE_URL,
        url: 'suscription-mark-fees-paid',
        data: row
      });


      console.log("==== response in update ===", response);


      if (response?.success === true) {

        setDatePickerVisible({
          paidDate: false,
          dueCalendar: false
        })
        CustomToast({
          type: "success",
          text1: response?.message,
          text2: ""
        });
        suscriptionLisfun();
        suscriptionHistory();
        setModalType({
          due: false,
          paid: false
        });
      }
      else {

        setDatePickerVisible({
          paidDate: false,
          dueCalendar: false
        })
        CustomToast({
          type: "error",
          text1: response?.message,
          text2: ""
        })

      }
      setPaidAmount('0');
      setPaidDate('');

    }
    catch (err: any) {
      console.error("Error in the handle due:", err);

    }
  }



  return (
    <Container>
      <MenuProvider>
        <View style={[globalStyle.flex, { marginBottom: moderateScale(20), marginRight: moderateScale(15) }]} >
          <View style={[globalStyle.row, { flex: 1 }]} >
            <Pressable onPress={() => {
              navigation.goBack();
            }} >
              <CustomIcon size={25} type='AntDesign' name='arrowleft' />
            </Pressable>
            <CustomText customStyle={{ marginLeft: moderateScale(10) }} text='Subscriber Details' weight='600' size={22} />
          </View>

          <MenuPop
            navigation={navigation}
            item={history}
            id={suscription_id}
            message={message}
            handleUnSub={handleUnSubscribe}
            subscriptionDetails={suscription}
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          <SubscriptionCard item={suscription} />

          {/* subscription date */}
          <View
            style={[
              globalStyle.flex,
              {
                width: '98%',
                paddingVertical: moderateScale(15),
                backgroundColor: 'rgba(255,0,0,0.1)',
                paddingHorizontal: moderateScale(10),
                borderRadius: moderateScale(10),
                marginBottom: moderateScale(10),
              },
            ]}>
            <CustomIcon
              type="Feather"
              name="calendar"
              color="#ff0000"
              size={30}
            />
            <View style={{ marginLeft: moderateScale(5) }}>
              <CustomText
                text="Subscription Start Date"
                color={Colors.gray_font}
                weight="600"
              />
              <CustomText
                weight="500"
                text={suscription['suscription Start Date']}
              />
            </View>
          </View>

          {/* last payment date */}
          <View
            style={[
              globalStyle.flex,
              {
                width: '98%',
                paddingVertical: moderateScale(15),
                backgroundColor: 'rgba(232, 155, 20,0.1)',
                paddingHorizontal: moderateScale(10),
                borderRadius: moderateScale(10),
                marginBottom: moderateScale(10),
              },
            ]}>
            <CustomIcon
              type="Ionicons"
              name="calendar-number-outline"
              color="#e89b14"
              size={30}
            />
            <View style={{ marginLeft: moderateScale(5) }}>
              <CustomText
                text="Last Payment Date"
                color={Colors.gray_font}
                weight="600"
              />
              <CustomText
                weight="500"
                text={suscription['Last Payment Date'] || 'No Date Available'}
              />
            </View>
          </View>

          {/* last payment amount */}
          <View
            style={[
              globalStyle.flex,
              {
                width: '98%',
                paddingVertical: moderateScale(15),
                backgroundColor: 'rgba(4, 163, 218,0.1)',
                paddingHorizontal: moderateScale(10),
                borderRadius: moderateScale(10),
                marginBottom: moderateScale(10),
              },
            ]}>
            <CustomIcon
              type="Ionicons"
              name="cash-outline"
              color="#13799c"
              size={30}
            />
            <View style={{ marginLeft: moderateScale(5) }}>
              <CustomText
                text="Last Payment Amount"
                color={Colors.gray_font}
                weight="600"
              />
              <CustomText
                weight="500"
                text={`₹ ${suscription['Last Payment Amount'] || 0}`}
              />
            </View>
          </View>

          <View style={[globalStyle.betweenCenter, { marginTop: moderateScale(10) }]}>
            <CustomButton
              onPress={() => {
                setModalType({
                  paid: true,
                  due: false
                })
              }}
              title="Mark Fee as Paid"
              customStyle={{ width: '45%' }}
              bg={Colors.orange}
              textColor="#000"
              radius={30}
            />
            <CustomButton
              onPress={() => {
                setModalType({
                  paid: false,
                  due: true
                })
              }}
              customStyle={{ width: '45%' }}
              title="Mark Fee as Due"
              radius={30}
            />
          </View>
        </ScrollView>

        {
          modalType.due && (
            <CustomModal
              visible={modalType.due}
              iscenter={false}
              onDismiss={() => {
                setModalType({
                  due: false,
                  paid: false
                })
              }}
              containerStyle={{
                height: screenHeight * .55,
                width: screenWidth,
                alignSelf: "center"
              }}
            >

              <ScrollView style={{ flex: .9, paddingHorizontal: moderateScale(5) }} >
                <View style={{ width: "30%", height: moderateScale(3), borderRadius: moderateScale(15), backgroundColor: Colors.gray_font, marginVertical: moderateScale(5), alignSelf: "center" }} />
                <CustomText text='Mark Fees as Due' weight='600' customStyle={{ textAlign: "center" }} />

                <CustomInput text='Due Amount' keyboardType='number-pad' handleChangeText={(text) => {
                  setDueAmount(text)
                }} />

                <CustomText text='Select Due Date' weight='500' size={15} customStyle={{ marginTop: moderateScale(10) }} />
                <Pressable
                  style={[
                    styles.inputContainer,
                    {
                      marginTop: moderateScale(5),
                    },
                  ]}
                  onPress={() => {
                    setDatePickerVisible({
                      paidDate: false,
                      dueCalendar: !isDatePickerVisible.dueCalendar,
                    });
                  }}>
                  <CustomText
                    text={dueDate ? dueDate : "Select Due Date"}
                    // color={values.endDate ? '#000' : '#909090'}
                    weight="400"
                    size={15}
                  />
                </Pressable>

                {isDatePickerVisible.dueCalendar && (
                  <CalendarPicker
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

                      setDueDate(formattedDate.replaceAll('/', '-'))
                      // setFieldValue('endDate', formattedDate.replaceAll('/', '-'));
                      setDatePickerVisible({
                        dueCalendar: false,
                        paidDate: false,
                      });
                    }}
                  />
                )}

              </ScrollView>

              <View style={{ flex: .13 }} >
                <CustomButton title='Submit' disabled={loading} onPress={handleDue} />
              </View>
            </CustomModal>
          )
        }

        {
          modalType.paid && (
            <CustomModal
              visible={modalType.paid}
              iscenter={false}
              onDismiss={() => {
                setModalType({
                  due: false,
                  paid: false
                })
              }}
              containerStyle={{
                height: screenHeight * .55,
                width: screenWidth,
                alignSelf: "center"
              }}
            >

              <ScrollView style={{ flex: .9, paddingHorizontal: moderateScale(5) }} >
                <View style={{ width: "30%", height: moderateScale(3), borderRadius: moderateScale(15), backgroundColor: Colors.gray_font, marginVertical: moderateScale(5), alignSelf: "center" }} />
                <CustomText text='Mark Fees as Paid' weight='600' customStyle={{ textAlign: "center" }} />

                <CustomInput text='Paid Amount' keyboardType='number-pad' handleChangeText={(text) => {
                  setPaidAmount(text)
                }} />

                <CustomText text='Select Due Date' weight='500' size={15} customStyle={{ marginTop: moderateScale(10) }} />
                <Pressable
                  style={[
                    styles.inputContainer,
                    {
                      marginTop: moderateScale(5),
                    },
                  ]}
                  onPress={() => {
                    setDatePickerVisible({
                      dueCalendar: false,
                      paidDate: !isDatePickerVisible.dueCalendar,
                    });
                  }}>
                  <CustomText
                    text={paidDate ? paidDate : "Select Payment Date"}
                    // color={values.endDate ? '#000' : '#909090'}
                    weight="400"
                    size={15}
                  />
                </Pressable>

                {isDatePickerVisible.paidDate && (
                  <CalendarPicker
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

                      setPaidDate(formattedDate.replaceAll('/', '-'))
                      // setFieldValue('endDate', formattedDate.replaceAll('/', '-'));
                      setDatePickerVisible({
                        dueCalendar: false,
                        paidDate: false,
                      });
                    }}
                  />
                )}

              </ScrollView>

              <View style={{ flex: .13 }} >
                <CustomButton title='Submit' disabled={loading} onPress={handlePaid} />
              </View>
            </CustomModal>
          )
        }
      </MenuProvider>
    </Container>
  )
}

export default CourseSubsDetails

const MenuPop = ({ navigation, item, id, message, subscriptionDetails, handleUnSub }: any) => {

  const [isTransactionModal, setIsTransactionModal] = useState(false);
  return (
    <Menu>
      <MenuTrigger>
        <CustomIcon type='Entypo' name='dots-three-vertical' />
      </MenuTrigger>

      <MenuOptions
        customStyles={{
          optionsContainer: styles.optionsContainer,
        }}
      >

        <MenuOption
          onSelect={() => {
            setIsTransactionModal(!isTransactionModal)
          }}
        >
          <CustomText text='Transaction History' />
        </MenuOption>

        <MenuOption>
          <Pressable onPress={handleUnSub} >
            <CustomText text='Unsubscribe' />
          </Pressable>
        </MenuOption>
      </MenuOptions>

      {
        isTransactionModal && (
          <CustomModal
            iscenter={false}
            visible={isTransactionModal}
            onDismiss={() => {
              setIsTransactionModal(false)
            }}
            containerStyle={{ width: "95%", height: screenHeight * .4 }}
          >
            <View style={{ width: "30%", backgroundColor: Colors.gray, height: moderateScale(3), borderRadius: moderateScale(5), marginVertical: moderateScale(5), alignSelf: "center" }} />
            <CustomText customStyle={{ textAlign: "center" }} text='Transaction History' weight='500' size={16} />

            <ScrollView showsVerticalScrollIndicator={false} >
              {item ? (
                item.map(
                  (item: {
                    paid_date:
                    | string
                    | number
                    | boolean
                    | React.ReactElement<
                      any,
                      string | React.JSXElementConstructor<any>
                    >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | null
                    | undefined;
                    paid_amount:
                    | string
                    | number
                    | boolean
                    | React.ReactElement<
                      any,
                      string | React.JSXElementConstructor<any>
                    >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | null
                    | undefined;
                  }) => (
                    <View style={[globalStyle.betweenCenter, { marginBottom: moderateScale(10) }]} >
                      <View>
                        <CustomText text={item.type} weight='500' />
                        <CustomText text={item.date} weight='500' />
                      </View>
                      <View>
                        <CustomText text={`₹${item.paid_amount}`} />
                      </View>
                    </View>
                  ),
                )
              ) : (
                <View>
                  <CustomText text='No Transaction History' weight='600' />
                </View>
              )}
            </ScrollView>
          </CustomModal>
        )
      }
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
    marginTop: moderateScale(0),
    elevation: 2,
    backgroundColor: '#fff',
  },
  optionsContainer: {
    padding: moderateScale(10),
    borderRadius: moderateScale(10),
    backgroundColor: '#f7f7f7',
    elevation: 5,
    width: moderateScale(180),
    marginTop: moderateScale(10),
  },
})