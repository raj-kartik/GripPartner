import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Container from '../../../../../components/Container';
import CustomButton from '../../../../../components/Customs/CustomButton';
import { moderateScale } from '../../../../../components/Matrix/Matrix';
import CustomInput from '../../../../../components/Customs/CustomInput';
import CustomText from '../../../../../components/Customs/CustomText';
import { getCourse } from '../../../../../redux/Slice/CourseSlice';
import { getRetreat } from '../../../../../redux/Slice/RetreatSlice';
import { globalStyle } from '../../../../../utils/GlobalStyle';
import CustomIcon from '../../../../../components/Customs/CustomIcon';
import makeApiRequest from '../../../../../utils/ApiService';
import { POST_ADD_COUPON } from '../../../../../utils/api';
import { CustomToast } from '../../../../../components/Customs/CustomToast';
import CustomHeader2 from '../../../../../components/Customs/Header/CustomHeader2';
import Colors from '../../../../../utils/Colors';
import CalendarPicker from 'react-native-calendar-picker';
import CheckBox from '@react-native-community/checkbox';

const couponSchema = Yup.object().shape({
  couponCode: Yup.string().required('Coupon Code is required'),

  isPercentage: Yup.boolean().required('Please specify discount type'), // Boolean field to determine discount type

  percentage: Yup.number()
      .typeError('Discount Percentage must be a number')
      .min(0, 'Percentage must be at least 0')
      .max(100, 'Percentage cannot exceed 100')
      .when('isPercentage', {
          is: true,
          then: schema => schema.required('Discount Percentage is required'),
          otherwise: schema => schema.notRequired(),
      }),

  amount: Yup.number()
      .typeError('Discount Amount must be a number')
      .when('isPercentage', {
          is: false,
          then: schema => schema.required('Discount Amount is required'),
          otherwise: schema => schema.notRequired(),
      }),

  startDate: Yup.string()
      .matches(/^\d{4}-\d{2}-\d{2}$/, 'Start Date must be in YYYY-MM-DD format')
      .required('Start Date is required'),

  endDate: Yup.string()
      .matches(/^\d{4}-\d{2}-\d{2}$/, 'End Date must be in YYYY-MM-DD format')
      .required('End Date is required')
      .test(
          'is-after-start',
          'End Date must be later than Start Date',
          function (value) {
              if (!value || !this.parent.startDate) return true;
              const [y1, m1, d1] = this.parent.startDate.split('-').map(Number);
              const [y2, m2, d2] = value.split('-').map(Number);
              return new Date(y2, m2 - 1, d2) > new Date(y1, m1 - 1, d1);
          }
      ),

  type: Yup.string().required('Type is required'),

  isSelectAll: Yup.boolean(),
  typeIds: Yup.array()
      .of(Yup.number())
      .when(['isSelectAll', 'type'], {
          is: (isSelectAll: boolean, type: string) =>
              !isSelectAll && (type == 'course' || type == 'retreat'),
          then: schema =>
              schema.min(1, 'At least one Course or Retreat must be selected'),
          otherwise: schema => schema.notRequired(),
      }),
});

const CreateCoupons = () => {
  const { user } = useSelector((state: any) => state?.user);
  const { data: course } = useSelector((state: any) => state.course);
  const { data: retreat } = useSelector((state: any) => state.retreat);
  const navigation = useNavigation();
  const [isTypeModal, setIsTypeModal] = useState(false);
  const [isCalendar, setIsCalendar] = useState({
      start: false,
      end: false,
  });

  const dispatch = useDispatch();
  useFocusEffect(
      useCallback(() => {
          const fetchUser = async () => {
              // await dispatch(userDetail());
              await dispatch(getCourse(user?.id));
              await dispatch(getRetreat(user?.id));
          };

          fetchUser();
      }, []),
  );

  const typeDropDown = [
      {
          id: 1,
          title: 'Course',
          value: 'course',
      },
      {
          id: 2,
          title: 'Retreat',
          value: 'retreat',
      },
      {
          id: 3,
          title: 'E-commerce',
          value: 'ecom',
      },
      {
          id: 4,
          title: 'In-Store',
          value: 'store',
      },
  ];

  return (
      <Container>
          <CustomHeader2 title="Create Coupon" />

          <Formik
              initialValues={{
                  couponCode: '',
                  percentage: '',
                  startDate: '',
                  endDate: '',
                  type: '',
                  typeIds: [],
                  amount: '',
                  isPercentage: true,
                  isSelectAll: true,
              }}
              validationSchema={couponSchema}
              onSubmit={values => {

                  // console.log("=== values on on submit ===", {
                  //     code: values.couponCode,
                  //     discount_type: values.isPercentage ? "percentage" : "fixed",
                  //     discount_value: values?.isPercentage ? parseFloat(values.percentage) : parseFloat(values?.amount),
                  //     start_date: values?.startDate,
                  //     end_date: values?.endDate,
                  //     type: values?.type.toUpperCase(),
                  //     specific_id: values?.typeIds,
                  //     created_by: user?.data?.id
                  // });
                  // return;

                  const postCoupon = async () => {
                      try {
                          const response: any = await makeApiRequest({
                              url: POST_ADD_COUPON,
                              method: 'POST',
                              data: {
                                  code: values.couponCode,
                                  discount_type: values.isPercentage ? "percentage" : "fixed",
                                  discount_value: values?.isPercentage ? parseFloat(values.percentage) : parseFloat(values?.amount),
                                  start_date: values?.startDate,
                                  end_date: values?.endDate,
                                  type: values?.type.toUpperCase(),
                                  specific_id: values?.typeIds,
                                  created_by: user?.data?.id
                              }
                          });


                          if (response?.status === 'success') {
                              navigation.navigate('CouponSuccess');
                          }

                          if (response?.status === 'error') {
                              CustomToast({
                                  type: "error",
                                  text1: "Failed to Create Coupon",
                                  text2: "Coupon already exists",
                              })
                          }




                          console.log("=== response ===", response);

                      }
                      catch (err: any) {
                          console.error('Failed to create coupon', err.message);
                      }
                  }
                  postCoupon();
              }}>
              {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                  setFieldValue,
              }) => {
                  // console.log("==== value of tpye ids ===", values.typeIds);

                  useEffect(() => {
                      const fetchSelected = () => {
                          if (values.type == 'course') {
                              console.log('useeffect course');

                              setFieldValue(
                                  'typeIds',
                                  course.map((item: any) => item?.id),
                              );
                          } else if (values.type == 'retreat') {
                              console.log('useeffect retreat');
                              setFieldValue(
                                  'typeIds',
                                  retreat?.map((item: any) => item.id),
                              );
                          }
                      };
                      fetchSelected();
                  }, [values.type == 'course' || values.type == 'retreat']);

                  useEffect(() => {
                      const emptyTypeIds = () => {
                          setFieldValue('typeIds', []);
                      }
                      emptyTypeIds();
                  }, [!values.isSelectAll])

                  // console.log('===== typeIds =====', values.typeIds);
                  // console.log("===== type =====", values.type);

                  return (
                      <KeyboardAvoidingView
                          style={{ flex: 1, marginBottom: moderateScale(10) }}>
                          <ScrollView
                              showsVerticalScrollIndicator={false}
                              style={{ flex: 1 }}>
                              <CustomInput
                                  text="Coupon Code"
                                  placeholder="ABC123"
                                  maxLength={15}
                                  value={values.couponCode}
                                  autoCapitalize={'characters'}
                                  customStyle={styles.input}
                                  handleChangeText={handleChange('couponCode')}
                              />
                              {errors.couponCode && touched.couponCode && (
                                  <CustomText
                                      customStyle={styles.error}
                                      text={errors.couponCode}
                                      size={12}
                                      color="red"
                                  />
                              )}

                              <View
                                  style={[
                                      globalStyle.betweenCenter,
                                      {
                                          marginTop: moderateScale(10),
                                          marginHorizontal: moderateScale(30),
                                      },
                                  ]}>
                                  {/* percentage */}
                                  <Pressable
                                      onPress={() => {
                                          setFieldValue('isPercentage', true);
                                      }}
                                      style={[globalStyle.row]}>
                                      <View
                                          style={[
                                              styles.radio,
                                              {
                                                  borderColor: values.isPercentage
                                                      ? Colors.activeRadio
                                                      : '#000',
                                              },
                                          ]}>
                                          <View
                                              style={[
                                                  styles.selectRadio,
                                                  {
                                                      backgroundColor: values.isPercentage
                                                          ? Colors.activeRadio
                                                          : '#000',
                                                  },
                                              ]}
                                          />
                                      </View>
                                      <CustomText
                                          customStyle={{ marginLeft: moderateScale(5) }}
                                          text="Percentage"
                                      />
                                  </Pressable>

                                  {/* amount */}
                                  <Pressable
                                      onPress={() => {
                                          setFieldValue('isPercentage', false);
                                      }}
                                      style={[globalStyle.row]}>
                                      <View
                                          style={[
                                              styles.radio,
                                              {
                                                  borderColor: !values.isPercentage
                                                      ? Colors.activeRadio
                                                      : '#000',
                                              },
                                          ]}>
                                          <View
                                              style={[
                                                  styles.selectRadio,
                                                  {
                                                      backgroundColor: !values.isPercentage
                                                          ? Colors.activeRadio
                                                          : '#000',
                                                  },
                                              ]}
                                          />
                                      </View>
                                      <CustomText
                                          customStyle={{ marginLeft: moderateScale(5) }}
                                          text="Amount"
                                      />
                                  </Pressable>
                              </View>

                              <CustomInput
                                  text={values.isPercentage ? 'Percentage' : 'Amount'}
                                  placeholder="10"
                                  maxLength={15}
                                  value={`${values?.isPercentage ? values.percentage : values?.amount
                                      }`}
                                  keyboardType="numeric"
                                  customStyle={styles.input}
                                  handleChangeText={
                                      values.isPercentage
                                          ? handleChange('percentage')
                                          : handleChange('amount')
                                  }
                              />
                              {errors.percentage && touched.percentage && (
                                  <CustomText
                                      customStyle={styles.error}
                                      size={12}
                                      text={errors.percentage}
                                      color="red"
                                  />
                              )}

                              {errors.amount && touched.amount && (
                                  <CustomText
                                      customStyle={styles.error}
                                      size={12}
                                      text={errors.amount}
                                      color="red"
                                  />
                              )}

                              <View style={{ marginTop: moderateScale(10) }}>
                                  <CustomText text="Select Type" weight="500" />

                                  <View>
                                      <Pressable
                                          style={[
                                              styles.inputContainer,
                                              {
                                                  borderWidth: touched.type ? 1 : 0,
                                                  borderColor: touched.type ? '#000' : '#fff',
                                                  flex: 1,
                                              },
                                          ]}
                                          onPress={() => setIsTypeModal(!isTypeModal)}>
                                          <CustomText
                                              text={
                                                  values.type
                                                      ? typeDropDown.find(
                                                          item => item.value === values.type,
                                                      )?.title
                                                      : 'Select Type'
                                              }
                                              weight="400"
                                              size={15}
                                          />
                                      </Pressable>
                                  </View>

                                  {isTypeModal && (
                                      <View style={styles.dropdown}>
                                          <FlatList
                                              data={typeDropDown}
                                              keyExtractor={item => item.id.toString()}
                                              renderItem={({ item }) => (
                                                  <TouchableOpacity
                                                      onPress={() => {
                                                          setFieldValue('type', item.value);
                                                          setFieldValue('typeIds', []);
                                                          setIsTypeModal(false); // Close dropdown after selection
                                                      }}
                                                      style={{ paddingVertical: moderateScale(5) }}>
                                                      <CustomText text={item.title} />
                                                  </TouchableOpacity>
                                              )}
                                          />
                                      </View>
                                  )}
                              </View>
                              {errors.type && touched.type && (
                                  <CustomText
                                      customStyle={styles.error}
                                      size={12}
                                      text={errors.type}
                                      color="red"
                                  />
                              )}

                              <View style={{ marginTop: moderateScale(10) }}>
                                  <CustomText text="Select Valid Duration" weight="500" />

                                  <Pressable
                                      style={[
                                          styles.inputContainer,
                                          {
                                              borderWidth: touched.type ? 1 : 0,
                                              borderColor: touched.type ? '#000' : '#fff',
                                          },
                                      ]}
                                      onPress={() => {
                                          setIsCalendar({
                                              start: !isCalendar.start,
                                              end: false,
                                          });
                                      }}>
                                      <CustomText
                                          text={values.startDate ? values.startDate : 'From'}
                                          color={values.startDate ? '#000' : '#909090'}
                                          weight="400"
                                          size={15}
                                      />
                                  </Pressable>
                                  {errors.startDate && touched.startDate && (
                                      <CustomText
                                          customStyle={styles.error}
                                          size={12}
                                          text={errors.startDate}
                                          color="red"
                                      />
                                  )}

                                  <Pressable
                                      style={[
                                          styles.inputContainer,
                                          {
                                              borderWidth: touched.type ? 1 : 0,
                                              borderColor: touched.type ? '#000' : '#fff',
                                              marginTop: moderateScale(10),
                                          },
                                      ]}
                                      onPress={() => {
                                          setIsCalendar({
                                              start: false,
                                              end: !isCalendar.end,
                                          });
                                      }}>
                                      <CustomText
                                          text={values.endDate ? values.endDate : 'To'}
                                          color={values.endDate ? '#000' : '#909090'}
                                          weight="400"
                                          size={15}
                                      />
                                  </Pressable>
                                  {errors.endDate && touched.endDate && (
                                      <CustomText
                                          customStyle={styles.error}
                                          size={12}
                                          text={errors.endDate}
                                          color="red"
                                      />
                                  )}

                                  <View style={{ marginTop: moderateScale(15) }}>
                                      {isCalendar.end && (
                                          <CalendarPicker
                                              onDateChange={(date: any) => {

                                                  // console.log("=== date in the end ===",date);

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

                                                  setFieldValue('endDate', formattedDate.replaceAll('/', '-'));
                                                  setIsCalendar({
                                                      start: false,
                                                      end: false,
                                                  });
                                              }}
                                          />
                                      )}
                                      {isCalendar.start && (
                                          <CalendarPicker
                                              onDateChange={(date: any) => {
                                                  const formattedDate = new Date(
                                                      date,
                                                  ).toLocaleDateString('en-GB', {
                                                      day: '2-digit',
                                                      month: '2-digit',
                                                      year: 'numeric',
                                                  }).split('/')
                                                      .reverse()
                                                      .join('-');

                                                  setFieldValue('startDate', formattedDate.replaceAll('/', '-'));
                                              }}
                                          />
                                      )}
                                  </View>
                              </View>


                              <View>
                                  {values.type == 'course' && (
                                      <View style={[globalStyle.betweenCenter, { marginRight: moderateScale(5) }]}>
                                          {/* <CustomText text='Kartik' /> */}
                                          <CustomText text={`Course List`} size={18} weight='600' />
                                          <View style={[globalStyle.row]} >
                                              <CheckBox
                                                  value={values.isSelectAll}
                                                  onChange={() => {
                                                      setFieldValue('isSelectAll', !values.isSelectAll);
                                                  }}
                                              />
                                              <CustomText text='Select all' customStyle={{ marginLeft: moderateScale(0) }} />
                                          </View>
                                      </View>
                                  )}

                                  {values.type == 'retreat' && (
                                      <View style={[globalStyle.betweenCenter, { marginRight: moderateScale(5) }]}>
                                          {/* <CustomText text='Kartik' /> */}
                                          <CustomText text={`Retreat List`} size={18} weight='600' />
                                          <View style={[globalStyle.row]} >
                                              <CheckBox
                                                  hideBox={true}
                                                  tintColor={"#000"}
                                                  onCheckColor='#000'
                                                  onTintColor='#000'

                                                  value={values.isSelectAll}
                                                  onChange={() => {
                                                      setFieldValue('isSelectAll', !values.isSelectAll);
                                                  }}
                                              />
                                              <CustomText text='Select all' customStyle={{ marginLeft: moderateScale(5) }} />
                                          </View>
                                      </View>
                                  )}
                                  {values.type === 'course' && !values.isSelectAll && course && (
                                      <>
                                          {/* <CustomText
                                              text="Select Spefic Course"
                                              weight="500"
                                              customStyle={{ marginBottom: moderateScale(5) }}
                                          /> */}
                                          <FlatList
                                              data={course}
                                              keyExtractor={(item: any) => item?.id}
                                              renderItem={({ item }: any) => {
                                                  // console.log('==== item ===', item);
                                                  const isSelected = values.typeIds.includes(item?.id);
                                                  return (
                                                      <TouchableOpacity
                                                          style={[
                                                              styles.typeContainer,
                                                              {
                                                                  borderColor: isSelected
                                                                      ? 'black'
                                                                      : 'transparent',
                                                                  borderWidth: 1.5,
                                                              },
                                                          ]}
                                                          onPress={() => {
                                                              let updatedIds = [...values.typeIds];

                                                              if (isSelected) {
                                                                  // Remove if already selected
                                                                  updatedIds = updatedIds.filter(
                                                                      id => id !== item?.id,
                                                                  );
                                                              } else {
                                                                  // Add if not selected
                                                                  updatedIds.push(item?.id);
                                                              }

                                                              setFieldValue('typeIds', updatedIds);
                                                          }}>
                                                          <CustomText
                                                              text={item?.name}
                                                              size={16}
                                                              weight="600"
                                                          />
                                                          {item?.morning_timing && (
                                                              <View
                                                                  style={[
                                                                      globalStyle.row,
                                                                      { marginTop: moderateScale(5) },
                                                                  ]}>
                                                                  <CustomIcon
                                                                      type="Feather"
                                                                      name="sun"
                                                                      color={Colors.gray_font}
                                                                  />
                                                                  <CustomText
                                                                      text={item?.morning_timing}
                                                                      size={14}
                                                                      weight="400"
                                                                      color={Colors.gray_font}
                                                                      customStyle={{ marginLeft: moderateScale(5) }}
                                                                  />
                                                              </View>
                                                          )}

                                                          {item?.evening_timing && (
                                                              <View
                                                                  style={[
                                                                      globalStyle.row,
                                                                      { marginTop: moderateScale(5) },
                                                                  ]}>
                                                                  <CustomIcon
                                                                      type="Feather"
                                                                      name="moon"
                                                                      color={Colors.gray_font}
                                                                  />
                                                                  <CustomText
                                                                      text={item?.evening_timing}
                                                                      size={14}
                                                                      weight="400"
                                                                      color={Colors.gray_font}
                                                                      customStyle={{ marginLeft: moderateScale(5) }}
                                                                  />
                                                              </View>
                                                          )}
                                                      </TouchableOpacity>
                                                  );
                                              }}
                                          />
                                      </>
                                  )}
                              </View>

                              {/* retreat */}
                              <View>
                                  {values.type === 'retreat' && !values.isSelectAll && retreat && (
                                      <>
                                          <CustomText
                                              text="Select Spefic Course"
                                              weight="500"
                                              customStyle={{ marginBottom: moderateScale(5) }}
                                          />
                                          <FlatList
                                              data={retreat}
                                              keyExtractor={item => item?.id}
                                              renderItem={({ item }) => {
                                                  const isSelected = values.typeIds.includes(item?.id);
                                                  return (
                                                      <TouchableOpacity
                                                          style={[
                                                              styles.typeContainer,
                                                              {
                                                                  borderColor: isSelected
                                                                      ? 'black'
                                                                      : 'transparent',
                                                                  borderWidth: 1.5,
                                                              },
                                                          ]}
                                                          onPress={() => {
                                                              let updatedIds = [...values.typeIds];

                                                              if (isSelected) {
                                                                  // Remove if already selected
                                                                  updatedIds = updatedIds.filter(
                                                                      id => id !== item?.id,
                                                                  );
                                                              } else {
                                                                  // Add if not selected
                                                                  updatedIds.push(item?.id);
                                                              }

                                                              setFieldValue('typeIds', updatedIds);
                                                          }}>
                                                          <CustomText
                                                              text={item?.title}
                                                              size={16}
                                                              weight="600"
                                                          />
                                                          {item?.no_of_days && (
                                                              <View
                                                                  style={[
                                                                      globalStyle.row,
                                                                      { marginTop: moderateScale(5) },
                                                                  ]}>
                                                                  <CustomIcon
                                                                      type="Feather"
                                                                      name="sun"
                                                                      color={Colors.gray_font}
                                                                  />
                                                                  <CustomText
                                                                      text={`${item?.no_of_days} Days`}
                                                                      size={14}
                                                                      weight="500"
                                                                      color={Colors.gray_font}
                                                                      customStyle={{ marginLeft: moderateScale(5) }}
                                                                  />
                                                              </View>
                                                          )}

                                                          {item?.no_of_nights && (
                                                              <View
                                                                  style={[
                                                                      globalStyle.row,
                                                                      { marginTop: moderateScale(5) },
                                                                  ]}>
                                                                  <CustomIcon
                                                                      type="Feather"
                                                                      name="moon"
                                                                      color={Colors.gray_font}
                                                                  />
                                                                  <CustomText
                                                                      text={`${item?.no_of_nights} Nights`}
                                                                      size={14}
                                                                      weight="500"
                                                                      color={Colors.gray_font}
                                                                      customStyle={{ marginLeft: moderateScale(5) }}
                                                                  />
                                                              </View>
                                                          )}
                                                      </TouchableOpacity>
                                                  );
                                              }}
                                          />
                                      </>
                                  )}
                              </View>
                          </ScrollView>
                          <CustomButton title="Save" onPress={handleSubmit} />
                      </KeyboardAvoidingView>
                  );
              }}
          </Formik>
      </Container>
  );
};

export default CreateCoupons;

const styles = StyleSheet.create({
  input: {
      width: '98%',
      alignSelf: 'center',
  },
  inputContainer: {
      width: '98%',
      alignSelf: 'center',
      paddingVertical: moderateScale(15),
      borderRadius: moderateScale(8),
      borderWidth: 1,
      paddingHorizontal: moderateScale(10),
      marginTop: moderateScale(3),
      elevation: 2,
      backgroundColor: '#fff',
  },
  dropdown: {
      width: '98%',
      alignSelf: 'center',
      borderWidth: 1.5,
      color: '#000',
      position: 'absolute',
      marginTop: moderateScale(10),
      backgroundColor: '#fff',
      padding: moderateScale(10),
      bottom: -moderateScale(140),
      borderRadius: moderateScale(8),
      zIndex: 10,
  },
  typeContainer: {
      width: '98%',
      padding: moderateScale(10),
      borderRadius: moderateScale(8),
      backgroundColor: '#f7f7f7',
      marginBottom: moderateScale(5),
      marginTop: moderateScale(5),
      paddingVertical: moderateScale(15),
  },
  selectRadio: {
      backgroundColor: '#000',
      width: moderateScale(12),
      height: moderateScale(12),
      borderRadius: moderateScale(50),
  },
  radio: {
      width: moderateScale(20),
      height: moderateScale(20),
      borderRadius: moderateScale(50),
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
      // borderColor:""
  },
  error: {
      marginTop: moderateScale(5),
  },
});
