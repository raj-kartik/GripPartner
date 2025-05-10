import {
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { FieldArray, Formik } from 'formik';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MultiSelect } from 'react-native-element-dropdown';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Container from '../../../../../components/Container';
import CustomHeader2 from '../../../../../components/Customs/Header/CustomHeader2';
import CustomInput from '../../../../../components/Customs/CustomInput';
import CustomButton from '../../../../../components/Customs/CustomButton';
import {
  moderateScale,
  screenHeight,
  verticalScale,
} from '../../../../../components/Matrix/Matrix';
import CustomText from '../../../../../components/Customs/CustomText';
import { globalStyle } from '../../../../../utils/GlobalStyle';
import CustomIcon from '../../../../../components/Customs/CustomIcon';
import CustomModal from '../../../../../components/Customs/CustomModal';
import makeApiRequest from '../../../../../utils/ApiService';
import { BASE_URL, POST_ADD_COURSE } from '../../../../../utils/api';
import CustomToast from '../../../../../components/Customs/CustomToast';
import DocumentPickerComponent from '../../../../../components/DocumentPicker';
import Colors from '../../../../../utils/Colors';
import SelectStudio from '../../../../../components/Modal/SelectStudio';

const isTimeBefore = (startTime: string, endTime: string) => {
  if (!startTime || !endTime) return false;

  const parseTime = (time: string) => {
    const matchedTime = time.match(/^(\d{2}):(\d{2})$/); // Match 24-hour format "HH:MM"
    if (!matchedTime) return null; // Return null for invalid time format

    const [hour, minute] = matchedTime.slice(1).map(Number); // Parse hours and minutes as numbers
    return hour * 60 + minute; // Convert to total minutes since 00:00
  };

  const startMinutes = parseTime(startTime);
  const endMinutes = parseTime(endTime);

  if (startMinutes === null || endMinutes === null) {
    console.error(
      'Invalid time format. Please enter time in 24-hour HH:MM format.',
    );
    return false; // Return false if parsing fails
  }

  return startMinutes < endMinutes;
};

const CourseSchema = Yup.object().shape({
  title: Yup.string()
    .required('*required')
    .min(2, 'Too Short')
    .max(50, 'Too Long'),

  description: Yup.string()
    .required('*required')
    .min(2, 'Too Short')
    .max(500, 'Too Long'),

  fees: Yup.string().required('*required').min(1, 'Fees must be at least 1'),

  training_level: Yup.array().test(
    'notEmpty',
    '*required',
    value => value && value.length > 0,
  ),

  class_type: Yup.array().test(
    'notEmpty',
    '*required',
    value => value && value.length > 0,
  ),

  body_focus: Yup.array().test(
    'notEmpty',
    '*required',
    value => value && value.length > 0,
  ),

  yoga_style: Yup.array().test(
    'notEmpty',
    '*required',
    value => value && value.length > 0,
  ),

  meta_title: Yup.string().min(2, 'Too Short').max(50, 'Too Long'),
  meta_keywords: Yup.string().min(2, 'Too Short').max(50, 'Too Long'),
  meta_description: Yup.string().min(2, 'Too Short').max(500, 'Too Long'),

  file: Yup.mixed()
    .test(
      'fileSize',
      'File size is too large (max 5MB)',
      (value: any) => !value || (value.size && value.size <= 5 * 1024 * 1024),
    ).notRequired(),

  batch: Yup.array()
    .of(
      Yup.object().shape({
        startTime: Yup.string()
          .required('*required')
          .matches(/^\d{2}:\d{2}$/, 'Invalid time format (use HH:MM)')
          .test(
            'valid-start-time',
            'Start Time must be before End Time',
            function (startTime) {
              const endTime = this.parent.endTime; // Access endTime in the current batch object
              if (startTime && endTime) {
                return isTimeBefore(startTime, endTime); // Ensure startTime is before endTime
              }
              return true; // Pass validation if endTime isn't set yet
            },
          ),
        endTime: Yup.string()
          .required('*required')
          .matches(/^\d{2}:\d{2}$/, 'Invalid time format (use HH:MM)')
          .test(
            'is-before',
            'End Time must be after Start Time',
            function (endTime) {
              const startTime = this.parent.startTime;
              if (startTime && endTime) {
                return isTimeBefore(startTime, endTime); // Ensure endTime is after startTime
              }
              return true; // Pass validation if startTime isn't set yet
            },
          ),
        batch_strength: Yup.number()
          .required('*required')
          .min(1, 'Batch Strength must be at least 1'),
        days: Yup.array().test(
          'notEmpty',
          '*required',
          value => value && value.length > 0,
        ),
        current_availability: Yup.number()
          .required('*required')
          .test(
            'availability-check',
            '*invalid, must be less than batch strength',
            function (value) {
              return value <= this.parent.batch_strength;
            },
          ),
      }),
    )
    .min(1, 'At least one batch is required'),
});

const TrainerCreateCourse = (props: any) => {

  console.log("==== props ====", props?.route?.params);

  const existCourse = props.route?.params?.course || {};
  const [loading, setLoading] = useState(false);
  // const [isUpdateCourse,setIsUpdateCourse] = useState(false);
  console.log('==== existCourse in trainer new course ===', existCourse);

  const { user } = useSelector((state: any) => state.user);
  const id = user?.id;
  const navigation = useNavigation();

  const traininLevel = [
    { label: 'Basic', value: 'Basic' },
    { label: 'Practice', value: 'Practice' },
    { label: 'Intense', value: 'Intense' },
  ];

  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token'); // Read token from AsyncStorage
        if (storedToken) {
          setToken(storedToken); // Set token in state if it exists
        }
      } catch (error) {
        console.error('Failed to fetch token from AsyncStorage:', error);
      }
    };

    fetchToken();
  }, []);

  const yogaStyle = [
    { label: 'Vinyasa', value: 'Vinyasa' },
    { label: 'Kundalini', value: 'Kundalini' },
    { label: 'Yin', value: 'Yin' },
    { label: 'Hatha', value: 'Hatha' },
    { label: 'Meditation', value: 'Meditation' },
    { label: 'Power', value: 'Power' },
    { label: 'Aerial Yoga', value: 'Aerial Yoga' },
    { label: 'Tai Chi/QiGong', value: 'Tai Chi/QiGong' },
    { label: 'Restorative', value: 'Restorative' },
    { label: 'Yoga Fusion', value: 'Yoga Fusion' },
    { label: 'Acro Yoga', value: 'Acro Yoga' },
    { label: 'Bhakti', value: 'Bhakti' },
    { label: 'Chair Yoga', value: 'Chair Yoga' },
  ];

  const bodyFocus = [
    { label: 'Abs', value: 'Abs' },
    { label: 'Ankle', value: 'Ankle' },
    { label: 'Arms', value: 'Arms' },
    { label: 'Buttock', value: 'Buttock' },
    { label: 'Calves', value: 'Calves' },
    { label: 'Chest', value: 'Chest' },
    { label: 'Elbows', value: 'Elbows' },
    { label: 'Eyes', value: 'Eyes' },
    { label: 'Feet', value: 'Feet' },
    { label: 'Hamstrings', value: 'Hamstrings' },
    { label: 'Legs', value: 'Legs' },
    { label: 'Hands', value: 'Hands' },
    { label: 'Head', value: 'Head' },
    { label: 'Lower Back', value: 'Lower Back' },
    { label: 'Hips', value: 'Hips' },
    { label: 'Core', value: 'Core' },
    { label: 'Immune System', value: 'Immune System' },
    { label: 'Stomach', value: 'Stomach' },
    { label: 'IT Band', value: 'IT Band' },
    { label: 'Back', value: 'Back' },
    { label: 'Bone', value: 'Bone' },
    { label: 'Knee', value: 'Knee' },
    { label: 'Heart', value: 'Heart' },
    { label: 'Neck', value: 'Neck' },
    { label: 'Psoas', value: 'Psoas' },
    { label: 'Quadriceps', value: 'Quadriceps' },
    { label: 'Shoulders', value: 'Shoulders' },
    { label: 'Side Body', value: 'Side Body' },
    { label: 'Spine', value: 'Spine' },
    { label: 'Thighs', value: 'Thighs' },
    { label: 'Upper Back', value: 'Upper Back' },
    { label: 'Wrists', value: 'Wrists' },
  ];

  const classType = [
    { label: 'In-Person Class', value: 'In-Person Class' },
    { label: 'Virtual Class', value: 'Virtual Class' },
  ];

  const time = [
    { label: '01:00 AM', value: '01:00' },
    { label: '02:00 AM', value: '02:00' },
    { label: '03:00 AM', value: '03:00' },
    { label: '04:00 AM', value: '04:00' },
    { label: '05:00 AM', value: '05:00' },
    { label: '06:00 AM', value: '06:00' },
    { label: '07:00 AM', value: '07:00' },
    { label: '08:00 AM', value: '08:00' },
    { label: '09:00 AM', value: '09:00' },
    { label: '10:00 AM', value: '10:00' },
    { label: '11:00 AM', value: '11:00' },
    { label: '12:00 PM', value: '12:00' },
    { label: '01:00 PM', value: '13:00' },
    { label: '02:00 PM', value: '14:00' },
    { label: '03:00 PM', value: '15:00' },
    { label: '04:00 PM', value: '16:00' },
    { label: '05:00 PM', value: '17:00' },
    { label: '06:00 PM', value: '18:00' },
    { label: '07:00 PM', value: '19:00' },
    { label: '08:00 PM', value: '20:00' },
    { label: '09:00 PM', value: '21:00' },
    { label: '10:00 PM', value: '22:00' },
    { label: '11:00 PM', value: '23:00' },
    { label: '12:00 AM', value: '00:00' },
  ];

  const days = [
    { label: 'Monday', value: 'Monday' },
    { label: 'Tuesday', value: 'Tuesday' },
    { label: 'Wednesday', value: 'Wednesday' },
    { label: 'Thursday', value: 'Thursday' },
    { label: 'Friday', value: 'Friday' },
    { label: 'Saturday', value: 'Saturday' },
    { label: 'Sunday', value: 'Sunday' },
  ];

  const handleSubmit = async (values: any) => {
    const formData = new FormData();

    // user id
    formData.append('user_id', user?.id);
    // formdata.append('user_id', id);

    // course title
    formData.append('enter_course_title', values.title);
    // formdata.append('enter_course_title', values.title);

    // course description
    formData.append('description', values.description);
    // formdata.append('description', values.description);

    // course fees
    formData.append('fees', parseFloat(values.fees).toFixed(2)); // Ensuring 2 decimal points
    // formdata.append('fees', parseFloat(values.fees).toFixed(2));

    // training level
    formData.append('training_level', values.training_level.join(','));
    // formdata.append('training_level', JSON.stringify(values.training_level)); // Stringify arrays

    // class type
    formData.append('class_type', values.class_type.join(','));
    // formdata.append('class_type', JSON.stringify(values.class_type));

    // body style
    formData.append('body_focus', values.body_focus.join(','));
    formData.append('yoga_style', values.yoga_style.join(','));
    formData.append('meta_title', values.meta_title || '');
    formData.append('meta_keywords', values.meta_keywords || '');

    formData.append('meta_description', values.meta_description || '');
    values.batch.forEach((slot: any, index: any) => {
      formData.append(`slot[${index}][start_time]`, slot.startTime);
      formData.append(`slot[${index}][end_time]`, slot.endTime);
      formData.append(`slot[${index}][batch_strength]`, slot.batch_strength);
      formData.append(
        `slot[${index}][availability]`,
        slot.current_availability,
      );
      // formData.append(`slot[${index}][slot_days]`, JSON.stringify(slot.days.join(",")));  // Comma-separated slot days
      formData.append(`slot[${index}][slot_days]`, slot.days.join(',')); // Comma-separated slot days
    });

    if (values.file) {
      formData.append('select_image', {
        uri: values?.file?.uri,
        type: values.file.type || 'application/octet-stream',
        name: values.file.name || 'file',
      });
    }
    console.log('===== form data result =====', formData);
    // return;

    try {

      const response = await axios.post(`https://fitwithgrip.com/trainer/${POST_ADD_COURSE}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      console.log("==== response in the create course ====", response);


      if (response?.status === 200) {
        CustomToast({
          text1: 'Course added successfully!',
          type: 'success',
          text2: 'You have successfully added',
        });
        navigation.goBack();
      }
    } catch (error: any) {
      if (error.response) {
        console.error('Server Error Response:', error.response.data);
      } else if (error.request) {
        console.error(
          'No response received from server. Request details:',
          error.request,
        );
      } else {
        console.error('Unexpected Axios Error:', error.message);
      }
    }
  };

  // const trainingLevel = existCourse.class_type.split(",");

  // console.log("==== training level: " trainingLevel);

  return (
    <Container>
      <CustomHeader2 title={!existCourse?.id ? "Create Course" : "Update Course"} />
      <Formik
        initialValues={{
          title: existCourse ? existCourse?.name : '',
          description: existCourse ? existCourse?.description : '',
          fees: existCourse ? existCourse?.price : '',
          studio: existCourse?.studio_id || '',
          training_level: Array.isArray(existCourse?.training_level)
            ? existCourse.training_level
            : existCourse?.training_level
              ? existCourse.training_level.split(',')
              : [],

          class_type: Array.isArray(existCourse?.class_type)
            ? existCourse.class_type
            : existCourse?.class_type
              ? existCourse.class_type.split(',')
              : [],

          body_focus: Array.isArray(existCourse?.body_focus)
            ? existCourse.body_focus
            : existCourse?.body_focus
              ? existCourse.body_focus.split(',')
              : [],

          yoga_style: Array.isArray(existCourse?.yoga_style)
            ? existCourse.yoga_style
            : existCourse?.yoga_style
              ? existCourse.yoga_style.split(',')
              : [],

          meta_title: existCourse ? existCourse?.meta_title : '',
          meta_keywords: existCourse ? existCourse?.meta_keywords : '',
          meta_description: existCourse ? existCourse?.meta_description : '',
          file: null,
          batch: [
            {
              startTime: '',
              endTime: '',
              batch_strength: '',
              current_availability: '',
              days: [],
            },
          ],
        }}
        onSubmit={(values: any) => {

          handleSubmit(values);
        }}
        validationSchema={CourseSchema}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
        }: any) => {
          // console.log("==== values in the trainer level ====", values.training_level);
          const [timeModal, setTimeModal] = useState(false);
          const [timeType, setTimeType] = useState('');
          const [activeBatchIndex, setActiveBatchIndex] = useState(null);

          // console.log("==== values  ====", values.file);

          const handleTimeType = (type: any, index: any) => {
            setTimeType(type);
            setActiveBatchIndex(index); // Set the index of the batch
            setTimeModal(true); // Open the modal only for the selected batch
          };

          // let {training_level} = values;

          useEffect(() => {
            if (values && !user?.is_registred) {
              CustomToast({
                type: "info",
                text1: "Your KYC is pending!",
                text2: "You can create after verification"
              })
            }
          }, [!user?.is_registred, values])

          return (
            <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
              <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
                {/* title */}
                <CustomInput
                  text="Title"
                  value={values.title}
                  handleChangeText={handleChange('title')}
                  placeholder="Enter Title"
                  customStyle={{ width: '98%', alignSelf: 'center' }}
                />
                {errors.title && touched.title && (
                  <Text style={{ color: 'red' }}>{errors.title}</Text>
                )}

                {/* description */}
                <CustomInput
                  text="Description"
                  value={values.description}
                  handleChangeText={handleChange('description')}
                  placeholder="Enter Description"
                  customStyle={{ width: '98%', alignSelf: 'center' }}
                  multiline={true}
                  numberOfLines={6}
                />
                {errors.description && touched.description && (
                  <Text style={{ color: 'red' }}>{errors.description}</Text>
                )}

                {/* studio */}
                <View style={{ marginTop: moderateScale(10) }} >
                  <CustomText text='Studio' weight='500' size={16} customStyle={{ marginBottom: moderateScale(2) }} />
                  <SelectStudio selectedStudios={values?.studio} handleSelectStudio={(item: any) => {
                    console.log("==== selected studio ====", item);
                    setFieldValue('studio', item);
                  }} />
                </View>

                <FieldArray
                  name="batch"
                  render={arrayHelpers => (
                    <View>
                      <View
                        style={[
                          globalStyle.betweenCenter,
                          { marginTop: moderateScale(15) },
                        ]}>
                        <CustomText text="Batches" weight="500" />

                        <TouchableOpacity
                          onPress={() => {
                            const lastBatch =
                              values?.batch[values?.batch?.length - 1] || {}; // Get the last batch or initialize an empty object
                            arrayHelpers.push({
                              startTime: lastBatch.startTime || '', // Copy the last batch's startTime
                              endTime: lastBatch.endTime || '', // Copy the last batch's endTime
                              batch_strength: lastBatch.batch_strength || '', // Copy batch_strength
                              current_availability:
                                lastBatch.current_availability || '', // Copy current_availability
                              days: lastBatch.days || [], // Copy days (array)
                            });
                          }}>
                          <CustomText
                            text="Add more"
                            size={14}
                            weight="500"
                            color={Colors.gray_font}
                          />
                        </TouchableOpacity>
                      </View>
                      {values.batch.map((item: any, index: number) => {
                        // console.log("index", index);
                        // console.log("error in the start tme",);

                        return (
                          <View
                            key={index}
                            style={{
                              backgroundColor: '#f7f7f7',
                              padding: moderateScale(10),
                              marginTop: moderateScale(5),
                              marginBottom: moderateScale(10),
                            }}>
                            <View style={[globalStyle.betweenCenter]}>
                              <CustomText
                                size={18}
                                weight="700"
                                text={`Batch ${index + 1}`}
                              />
                              {values.batch.length > 1 && (
                                <TouchableOpacity
                                  onPress={() => arrayHelpers.remove(index)}>
                                  <CustomIcon type="Feather" name="x" />
                                </TouchableOpacity>
                              )}
                            </View>
                            <View
                              style={[
                                globalStyle.betweenCenter,
                                { marginTop: moderateScale(10) },
                              ]}>
                              <View
                                style={{
                                  flex: 1,
                                  marginRight: moderateScale(5),
                                }}>
                                <CustomButton
                                  title={
                                    values?.batch[index]?.startTime?.length > 0
                                      ? values?.batch[index]?.startTime
                                      : 'Start Time'
                                  }
                                  bg={Colors.gray}
                                  textColor='#fff'
                                  onPress={() => {
                                    handleTimeType('start', index);
                                  }}
                                  customStyle={{ alignSelf: 'center' }}
                                />
                                {errors?.batch && touched?.batch && (
                                  <Text style={{ color: 'red' }}>
                                    {errors?.batch[index]?.startTime}
                                  </Text>
                                )}
                              </View>
                              <View
                                style={{ flex: 1, marginLeft: moderateScale(5) }}>
                                <CustomButton
                                  bg={Colors.gray}
                                  textColor='#fff'
                                  title={
                                    values?.batch[index]?.endTime?.length > 0
                                      ? values?.batch[index]?.endTime
                                      : 'End Time'
                                  }
                                  // disabled={values?.batch[index]?.endTime?.length > 0 ? true : false}
                                  onPress={() => {
                                    handleTimeType('end', index);
                                  }}
                                  customStyle={{ alignSelf: 'center' }}
                                />
                                {errors?.batch &&
                                  errors?.batch[index]?.endTime &&
                                  touched?.batch &&
                                  touched?.batch[index]?.endTime && (
                                    <Text style={{ color: 'red', fontSize: 12 }}>
                                      {errors?.batch[index]?.endTime}
                                    </Text>
                                  )}
                              </View>
                            </View>
                            <CustomInput
                              text="Batch Strength"
                              value={item.batch_strength}
                              handleChangeText={handleChange(
                                `batch.${index}.batch_strength`,
                              )}
                              keyboardType="numeric"
                            />
                            {errors?.batch && touched?.batch && (
                              <Text style={{ color: 'red' }}>
                                {errors?.batch[index]?.batch_strength}
                              </Text>
                            )}
                            <CustomInput
                              text="Current Availability"
                              value={item.current_availability}
                              handleChangeText={handleChange(
                                `batch.${index}.current_availability`,
                              )}
                              keyboardType="numeric"
                            />
                            {errors?.batch && touched?.batch && (
                              <Text style={{ color: 'red' }}>
                                {errors?.batch[index]?.current_availability}
                              </Text>
                            )}

                            <CustomText
                              text="Number of Days"
                              weight="500"
                              customStyle={{ marginTop: moderateScale(10) }}
                            />
                            <MultiSelect
                              style={styles.dropdown}
                              containerStyle={{ backgroundColor: '#fff' }}
                              placeholderStyle={styles.placeholderStyle}
                              selectedTextStyle={styles.selectedTextStyle}
                              inputSearchStyle={styles.inputSearchStyle}
                              // activeColor={Colors.orange_bg}
                              data={days}
                              labelField="label"
                              valueField="value"
                              value={values.batch[index].days}
                              placeholder="Select Days"
                              onChange={(item: any) => {
                                setFieldValue(`batch.${index}.days`, item);
                              }}
                              renderRightIcon={() => (
                                <CustomIcon
                                  type="AntDesign"
                                  name="downcircleo"
                                  color={Colors.gray_font}
                                />
                              )}
                            />

                            {timeModal && activeBatchIndex === index && (
                              <CustomModal
                                visible={timeModal}
                                iscenter={false}
                                containerStyle={{
                                  width: '100%',
                                  alignSelf: 'center',
                                  height: screenHeight * 0.5,
                                }}
                                onDismiss={() => setTimeModal(false)}>
                                <View
                                  style={{
                                    width: '30%',
                                    height: moderateScale(4),
                                    borderRadius: moderateScale(10),
                                    backgroundColor: Colors.gray_font,
                                    alignSelf: 'center',
                                    marginTop: moderateScale(5),
                                    marginBottom: moderateScale(10),
                                  }}
                                />
                                <CustomText
                                  text="Select Time"
                                  size={18}
                                  weight="700"
                                  customStyle={{ textAlign: 'center' }}
                                />

                                <View
                                  style={[
                                    globalStyle.betweenCenter,
                                    {
                                      flexWrap: 'wrap',
                                      marginTop: moderateScale(10),
                                    },
                                  ]}>
                                  {time &&
                                    time.map((item: any) => {
                                      // let index =
                                      return (
                                        <Pressable
                                          onPress={() => {
                                            if (timeType === 'start') {
                                              setFieldValue(
                                                `batch.${index}.startTime`,
                                                item?.value,
                                              );
                                            }
                                            if (timeType === 'end') {
                                              setFieldValue(
                                                `batch.${index}.endTime`,
                                                item?.value,
                                              );
                                            }
                                            setTimeModal(false);
                                          }}
                                          style={[
                                            globalStyle.center,
                                            {
                                              width: '30%',
                                              padding: moderateScale(6),
                                              borderWidth: 1,
                                              borderColor: Colors.gray_font,
                                              borderRadius: moderateScale(8),
                                              marginBottom: moderateScale(10),
                                              backgroundColor:
                                                values?.batch[index]
                                                  ?.startTime === item?.value
                                                  ? '#000'
                                                  : '#fff',
                                            },
                                          ]}>
                                          <CustomText
                                            text={item?.label}
                                            weight={
                                              values?.batch[index]
                                                ?.startTime === item?.value
                                                ? '700'
                                                : '500'
                                            }
                                            color={
                                              values?.batch[index]
                                                ?.startTime === item?.value
                                                ? '#fff'
                                                : '#000'
                                            }
                                          />
                                        </Pressable>
                                      );
                                    })}
                                </View>
                              </CustomModal>
                            )}
                          </View>
                        );
                      })}
                    </View>
                  )}
                />
                {errors.batch && touched.batch && (
                  <Text style={{ color: 'red' }}>*required</Text>
                )}

                {/* fees */}
                <CustomInput
                  text="Fees"
                  value={values?.fees ? values?.fees.toString() : ''}
                  handleChangeText={handleChange('fees')}
                  placeholder="Enter Fees"
                  keyboardType="numeric"
                  customStyle={{ width: '98%', alignSelf: 'center' }}
                />
                {errors.fees && touched.fees && (
                  <Text style={{ color: 'red' }}>{errors.fees}</Text>
                )}

                {/* training_level */}
                <CustomText
                  text="Training Level"
                  weight="500"
                  customStyle={{ marginTop: moderateScale(10) }}
                />
                <MultiSelect
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  data={traininLevel}
                  search
                  maxHeight={verticalScale(300)}
                  labelField="label"
                  valueField="value"
                  value={values.training_level}
                  placeholder="Select Training Level"
                  searchPlaceholder="Search..."
                  onChange={(item: any) => {
                    setFieldValue('training_level', item);
                  }}
                  // value={values.training_level}
                  renderRightIcon={() => (
                    <CustomIcon
                      type="AntDesign"
                      name="downcircleo"
                      color={Colors.gray_font}
                    />
                  )}
                />

                {/* class_type */}
                <CustomText
                  text="Class Type"
                  weight="500"
                  customStyle={{ marginTop: moderateScale(10) }}
                />
                <MultiSelect
                  selectedStyle={styles.selectedStyle}
                  // search
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  data={classType}
                  labelField="label"
                  valueField="value"
                  value={values.class_type}
                  placeholder="Select Class Type"
                  searchPlaceholder="Search..."
                  onChange={(item: any) => {
                    setFieldValue('class_type', item);
                  }}
                  renderRightIcon={() => (
                    <CustomIcon
                      type="AntDesign"
                      name="downcircleo"
                      color={Colors.gray_font}
                    />
                  )}
                />

                {/* body_focus */}
                <CustomText
                  text="Body Focus"
                  weight="500"
                  customStyle={{ marginTop: moderateScale(10) }}
                />
                <MultiSelect
                  style={styles.dropdown}
                  selectedStyle={styles.selectedStyle}
                  search
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  data={bodyFocus}
                  labelField="label"
                  valueField="value"
                  value={values.body_focus}
                  placeholder="Select Body Focus"
                  searchPlaceholder="Search..."
                  onChange={(item: any) => {
                    setFieldValue('body_focus', item);
                  }}
                  renderRightIcon={() => (
                    <CustomIcon
                      type="AntDesign"
                      name="downcircleo"
                      color={Colors.gray_font}
                    />
                  )}
                />

                {/* yoga_style */}
                <CustomText
                  text="Yoga Style"
                  weight="500"
                  customStyle={{ marginTop: moderateScale(10) }}
                />
                <MultiSelect
                  selectedStyle={styles.selectedStyle}
                  style={styles.dropdown}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  // iconStyle={{width:20,height:30}}
                  data={yogaStyle}
                  search
                  labelField="label"
                  valueField="value"
                  value={values.yoga_style}
                  placeholder="Select Yoga Style"
                  searchPlaceholder="Search..."
                  onChange={(item: any) => {
                    setFieldValue('yoga_style', item);
                  }}
                  renderRightIcon={() => (
                    <CustomIcon
                      type="AntDesign"
                      name="downcircleo"
                      color={Colors.gray_font}
                    />
                  )}
                />

                {/* choose_file */}
                <View style={{ marginTop: moderateScale(10) }}>
                  <CustomText text="Choose File" weight="500" size={14} />
                  <DocumentPickerComponent
                    customStyle={{ marginTop: moderateScale(5) }}
                    onPickDocument={documents => {
                      console.log('documents: ', documents[0]);
                      setFieldValue('file', documents[0]);
                    }}
                  />
                  <CustomText
                    weight="600"
                    color={Colors.activeRadio}
                    size={16}
                    text={values?.file?.name ? 'Uploaded' : ''}
                  />
                  {errors.file && touched.file && (
                    <Text style={{ color: 'red' }}>{errors.file}</Text>
                  )}
                </View>

                {/* meta_title */}
                <CustomInput
                  text="Meta Title"
                  value={values.meta_title}
                  handleChangeText={handleChange('meta_title')}
                  placeholder="Enter Meta Title"
                  customStyle={{ width: '98%', alignSelf: 'center' }}
                />
                {errors.meta_title && touched.meta_title && (
                  <Text style={{ color: 'red' }}>{errors.meta_title}</Text>
                )}

                {/* meta_keywords */}
                <CustomInput
                  text="Meta Keywords"
                  value={values.meta_keywords}
                  handleChangeText={handleChange('meta_keywords')}
                  placeholder="Enter Meta Keywords"
                  customStyle={{ width: '98%', alignSelf: 'center' }}
                />
                {errors.meta_keywords && touched.meta_keywords && (
                  <Text style={{ color: 'red' }}>{errors.meta_keywords}</Text>
                )}

                {/* meta_description */}
                <CustomInput
                  text="Meta Description"
                  value={values.meta_description}
                  handleChangeText={handleChange('meta_description')}
                  placeholder="Enter Meta Description"
                  customStyle={{ width: '98%', alignSelf: 'center' }}
                  multiline={true}
                  numberOfLines={10}
                />
                {errors.meta_description && touched.meta_description && (
                  <Text style={{ color: 'red' }}>{errors.meta_description}</Text>
                )}

                {/* submit */}
                <CustomButton
                  customStyle={{ marginVertical: moderateScale(10) }}
                  title={existCourse?.id ? 'Update' : 'Submit'}
                  // disabled={!user?.is_registred || loading}
                  onPress={() => {
                    if (!user?.is_registred) {
                      CustomToast({
                        type: "info",
                        text1: "Your KYC is pending!",
                        text2: "You can create after verification"
                      })
                    }
                    else {
                      handleSubmit()
                    }
                  }}
                />
              </ScrollView>
            </KeyboardAvoidingView>
          );
        }}
      </Formik>
    </Container>
  );
};

export default TrainerCreateCourse;

const styles = StyleSheet.create({
  touchContainer: {
    width: '98%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: moderateScale(8),
    paddingVertical: moderateScale(15),
    opacity: 5,
    paddingHorizontal: moderateScale(10),
    marginTop: moderateScale(5),
  },
  dropdown: {
    width: '98%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: Colors.gray_font,
    paddingHorizontal: moderateScale(10),
    borderRadius: moderateScale(8),
    marginTop: moderateScale(5),
    paddingVertical: moderateScale(8),
    backgroundColor: '#fff',
  },
  placeholderStyle: {
    color: Colors.gray_font,
  },
  selectedTextStyle: {
    color: '#000',
    fontWeight: '500',
    fontSize: 14,
  },
  inputSearchStyle: {
    color: '#000',
    backgroundColor: '#fff',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  listItemStyle: {
    color: '#000',
  },
  listTextStyle: {
    color: '#000',
  },
  selectedItemStyle: {
    color: '#000',
  },
  searchInputStyle: {
    color: '#000',
  },
  searchContainerStyle: {
    color: '#000',
  },
  searchInputContainerStyle: {
    color: '#000',
  },
  searchInputTextStyle: {
    color: '#000',
  },
  selectedStyle: {
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
