import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Container from '../../../../components/Container';
import { useSelector } from 'react-redux';
import CustomHeader2 from '../../../../components/Customs/Header/CustomHeader2';
import * as yup from 'yup';
import { FieldArray, Formik } from 'formik';
import CustomButton from '../../../../components/Customs/CustomButton';
import CustomInput from '../../../../components/Customs/CustomInput';
import CustomText from '../../../../components/Customs/CustomText';
import { moderateScale } from '../../../../components/Matrix/Matrix';
import Colors from '../../../../utils/Colors';
import StateModal from '../../../../components/Modal/StateModal';
import TimeModal from '../../../../components/Modal/TimeModal';
import { globalStyle } from '../../../../utils/GlobalStyle';
import CustomIcon from '../../../../components/Customs/CustomIcon';
import DocumentPickerComponent from '../../../../components/DocumentPicker';
import { fetchLocationUtility } from '../../../../utils/UtilityFuncations';
import axios from 'axios';
import { BASE_URL, POST_ADD_STUDIO_FORM } from '../../../../utils/api';
import CustomToast from '../../../../components/Customs/CustomToast';
import { Text } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

interface StudioFormValues {
  name: string;
  location: string;
  state: string;
  pincode: string;
  contactNumber: string;
  email: string;
  capacity: string;
  // aadharCard: DocumentPickerResponse | null;
  aadharCard: any;
  aadharCardNumber: string;
  // panCard: DocumentPickerResponse | null;
  panCard: any;
  panCardNumber: string;
  openingTime: string;
  closingTime: string;
}

interface StudioFormValues {
  name: string;
  location: string;
  state: string;
  pincode: string;
  contactNumber: string;
  email: string;
  capacity: string;
  aadharCard: any;
  aadharCardNumber: string;
  panCard: any;
  panCardNumber: string;
  openingTime: string;
  closingTime: string;
}

const initialValues: any = {
  aadharCard: null,
  aadharCardNumber: '',
  panCard: null,
  panCardNumber: '',
  studio: [
    {
      name: '',
      studioType: '',
      studioPic: [],
      location: '',
      state: '',
      pincode: '',
      email: '',
      capacity: '',
      openingTime: '',
      closingTime: '',
      contactNumber: '',
    },
  ],
};

const maxLengths: Record<keyof StudioFormValues, number> = {
  name: 50,
  location: 50,
  state: 50,
  pincode: 6,
  contactNumber: 15,
  email: 100,
  capacity: 5,
  aadharCard: 0, // no maxLength (file)
  aadharCardNumber: 12,
  panCard: 0, // no maxLength (file)
  panCardNumber: 10,
  openingTime: 10,
  closingTime: 10,
};

const studioItemSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required('*required')
    .min(2, '*too short')
    .max(50, '*too long'),
  studioType: yup
    .string()
    .trim()
    .required('*required')
    .min(2, '*too short')
    .max(50, '*too long'),
  location: yup
    .string()
    .trim()
    .required('*required')
    .min(2, '*too short')
    .max(50, '*too long'),
  state: yup
    .string()
    .trim()
    .required('*required')
    .min(2, '*too short')
    .max(50, '*too long'),
  pincode: yup
    .string()
    .matches(/^[0-9]{6}$/, '*must be a valid 6-digit pincode')
    .required('*required'),
  email: yup.string().email('*enter valid email').required('*required'),
  capacity: yup
    .number()
    .typeError('*must be a number')
    .min(1, '*must be at least 1')
    .required('*required'),
  openingTime: yup.string().required('*required'),
  closingTime: yup.string().required('*required'),
  contactNumber: yup
    .string()
    .matches(/^[6-9][0-9]{9}$/, '*must be a valid 10-digit phone number')
    .required('*required'),
});

const overallSchema = yup.object().shape({
  aadharCard: yup.mixed().notRequired(),
  aadharCardNumber: yup
    .string()
    .matches(/^[0-9]{12}$/, '*must be a valid 12-digit Aadhaar number')
    .required('*required'),
  panCard: yup.mixed().notRequired(),
  panCardNumber: yup
    .string()
    .transform(value => value?.toUpperCase())
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, '*must be a valid PAN number')
    .required('*required'),
  studio: yup
    .array()
    .of(studioItemSchema)
    .min(1, '*at least one studio is required'),
});

const buildFormData = (initialValues: any, user_id: string) => {
  const formData = new FormData();

  // Flat fields
  formData.append('user_id', user_id);
  formData.append('aadhar_number', initialValues.aadharCardNumber);
  formData.append('pan_number', initialValues.panCardNumber);

  // Aadhar & PAN files
  // if (initialValues.aadharCard) {
  //   formData.append('aadharCard', {
  //     uri: initialValues.aadharCard.uri,
  //     name: `${user_id}_aadhar.jpg`,
  //     type: initialValues.aadharCard.type || 'image/jpeg',
  //   });
  // }

  // if (initialValues.panCard) {
  //   formData.append('panCard', {
  //     uri: initialValues.panCard.uri,
  //     name: `${user_id}_pan.jpg`,
  //     type: initialValues.panCard.type || 'image/jpeg',
  //   });
  // }

  // Studios (nested fields)
  initialValues.studio.forEach((studio: any, index: number) => {
    formData.append(`studios[${index}][studio_name]`, studio.name);
    formData.append(`studios[${index}][studio_type]`, studio.studioType);
    formData.append(`studios[${index}][location]`, studio.location);
    formData.append(`studios[${index}][state]`, studio.state);
    formData.append(`studios[${index}][pincode]`, studio.pincode);
    formData.append(`studios[${index}][email]`, studio.email);
    formData.append(`studios[${index}][capacity]`, studio.capacity);
    formData.append(`studios[${index}][opening_time]`, studio.openingTime);
    formData.append(`studios[${index}][closing_time]`, studio.closingTime);
    formData.append(`studios[${index}][contact_number]`, studio.contactNumber);

    // Studio photos array
    studio.studioPic.forEach((pic: any, picIndex: number) => {
      formData.append(`studio_photos[${index}][]`, {
        uri: pic.uri,
        name: pic.name || `studio_${index}_photo_${picIndex}.jpg`,
        type: pic.type || 'image/jpeg',
      });
    });

  });

  return formData;
};


const UpdateStudioProfile: React.FC = () => {
  const { user } = useSelector((state: any) => state?.user);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [startModal, setStartModal] = useState(false);
  const [endModal, setEndModal] = useState(false);
  const [placeText, setPlaceText] = useState('');
  const [place, setPlace] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const navigation:any = useNavigation();

  const studioTypeArray = [
    {
      id: 1,
      label: 'Gym',
    },

    {
      id: 2,
      label: 'Yoga',
    },

    {
      id: 3,
      label: 'Zumba',
    },

    {
      id: 4,
      label: 'Pilates',
    },

    {
      id: 5,
      label: 'Dance',
    },

    {
      id: 6,
      label: 'Crossfit',
    },
  ];

  const handleSubmitStudio = async (values: StudioFormValues) => {
    // return;
    try {
      setLoading(true);
      const formData = buildFormData(values, user?.id); // user?.id = user_id
      // console.log('---- Submitted values formdata:', formData);
      const response = await axios.post(`${BASE_URL}${POST_ADD_STUDIO_FORM}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // optional; axios will auto set this
        },
      });

      console.log('----- Upload success -----', response);

      if (response?.data[0]?.success == true) {
        CustomToast({
          type: "success",
          text1: response?.data?.message || "Studio profile updated successfully",
          text2: "You can add more studios later",
        });
        navigation.navigate('StudioSuccess');
      }

      // ✅ handle success UI here
    } catch (error) {
      console.error('Upload error:', error);
      // ✅ handle error UI here
    }
    finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const response = await fetchLocationUtility(placeText);
        setPlace(response); // Assuming the API returns a placeName field
      } catch (error) {
        console.error('Error fetching place:', error);
      }
    }
    fetchPlace();
  }, [placeText]);

  return (
    <Container>
      <CustomHeader2 title="Studio Profile" />

      {/* map */}
      <View></View>

      <Formik
        initialValues={initialValues}
        validationSchema={overallSchema}
        onSubmit={(values: StudioFormValues) => {
          handleSubmitStudio(values);
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          errors,
          touched,
        }: any) => {

          useEffect(() => {
            console.log("----- errrors of the studio type ----", errors);
          }, [errors])
          // console.log("----- values of the studio type ----", values?.studio);

          return (
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  flexGrow: 1,
                  paddingHorizontal: moderateScale(5),
                }}>
                {/* FieldArray for Studio */}
                <FieldArray name="studio">
                  {({ push, remove }) => (
                    <>
                      <View
                        style={[
                          globalStyle.betweenCenter,
                          { marginVertical: moderateScale(10) },
                        ]}>
                        <CustomText text="Studios" weight="600" size={20} />
                        <Pressable
                          onPress={() => {
                            push({
                              name: '',
                              location: '',
                              state: '',
                              pincode: '',
                              email: '',
                              capacity: '',
                              openingTime: '',
                              closingTime: '',
                              contactNumber: '',
                              studioType: ''
                            });
                            ToastAndroid.show(
                              'Added a new studio field',
                              ToastAndroid.SHORT,
                            );
                          }}>
                          <CustomIcon
                            type="AntDesign"
                            size={27}
                            name="pluscircle"
                          />
                        </Pressable>
                      </View>
                      {values.studio.map((studioItem: any, index: any) => (
                        <View
                          key={index}
                          style={{
                            marginBottom: moderateScale(20),
                            borderWidth: 1,
                            borderRadius: moderateScale(10),
                            padding: moderateScale(10),
                          }}>
                          <View style={[globalStyle.between]}>
                            <CustomText
                              text={studioItem?.name || `Studio ${index + 1}`}
                              size={20}
                              weight="600"
                            />
                            {values?.studio.length > 1 && (
                              <Pressable
                                onPress={() => {
                                  remove(index);
                                }}>
                                <CustomIcon type="AntDesign" name="minuscircle" />
                              </Pressable>
                            )}
                          </View>

                          <View style={{ marginTop: moderateScale(10) }}>
                            <CustomText
                              size={16}
                              text="Select Studio Type"
                              weight="500"
                            />
                            <ScrollView
                              horizontal
                              showsHorizontalScrollIndicator={false}>
                              {studioTypeArray.map((item: any) => (
                                <Pressable
                                  onPress={() => {
                                    setFieldValue(`studio[${index}].studioType`, item?.label);
                                  }}
                                  style={[globalStyle.row, { marginTop: moderateScale(7), width: moderateScale(90), marginRight: moderateScale(5), height: moderateScale(40) }]}>
                                  <View
                                    style={[globalStyle.center, {
                                      width: moderateScale(18),
                                      height: moderateScale(18),
                                      borderRadius: moderateScale(100),
                                      marginRight: moderateScale(3),
                                      borderWidth: 2,
                                      borderColor: values.studio[index]?.studioType === item?.label ? Colors.success : Colors.gray,
                                    }]}
                                  >
                                    <View
                                      style={{
                                        width: moderateScale(10),
                                        height: moderateScale(10),
                                        borderRadius: moderateScale(100),
                                        // marginRight: moderateScale(3),
                                        backgroundColor: values.studio[index]?.studioType === item?.label ? Colors.success : "#fff",
                                      }}
                                    />
                                  </View>
                                  <CustomText text={item?.label} />
                                </Pressable>
                              ))}
                            </ScrollView>
                          </View>

                          <View>
                            <CustomInput autoCapitalize='words' maxLength={50} text='Studio Name' handleChangeText={handleChange(
                              `studio[${index}].name`,
                            )} value={values.studio[index]?.name} />
                          </View>


                          <View>
                            <CustomInput text='Location' value={placeText} handleChangeText={(text: string) => {
                              setPlaceText(text);
                            }} />
                            {
                              place?.length > 0 && placeText.length > 0 && (
                                <FlatList
                                  data={place}
                                  keyboardShouldPersistTaps="handled"
                                  contentContainerStyle={{
                                    height: moderateScale(300),
                                    zIndex: 2,
                                    borderRadius: moderateScale(10),
                                    borderWidth: 1,
                                    marginTop: moderateScale(10)
                                  }}
                                  keyExtractor={(item: any, index) => index.toString()}
                                  renderItem={({ item }) => (
                                    <TouchableOpacity
                                      onPress={() => {
                                        setFieldValue(
                                          `studio[${index}].location`,
                                          item?.description,
                                        );
                                        setPlaceText(item?.description);
                                        setPlace([]);
                                      }}
                                      style={{
                                        padding: moderateScale(10),
                                        borderBottomWidth: 1,
                                        borderBottomColor: Colors.gray,
                                      }}>
                                      <CustomText text={item?.description} />
                                    </TouchableOpacity>
                                  )}
                                />
                              )
                            }

                          </View>


                          {/* Studio Fields */}
                          {[
                            // { name: 'name', label: 'Studio Name', maxLengths: 50 },
                            // { name: 'location', label: 'Location' },
                            {
                              name: 'pincode',
                              label: 'Pincode',
                              keyboardType: 'numeric',
                              maxLengths: 6,
                            },
                            {
                              name: 'capacity',
                              label: 'Capacity',
                              keyboardType: 'numeric',
                              maxLengths: 10,
                            },
                            {
                              name: 'email',
                              label: 'Email',
                              keyboardType: 'email-address',
                              maxLengths: 100,
                            },
                            {
                              name: 'contactNumber',
                              label: 'Contact Number',
                              keyboardType: 'phone-pad',
                              maxLengths: 10,
                            },
                          ].map((field: any) => (
                            <View
                              key={field.name}
                              style={{ marginBottom: moderateScale(10) }}>
                              <CustomInput
                                text={field.label}
                                handleChangeText={handleChange(
                                  `studio[${index}].${field.name}`,
                                )}
                                value={values.studio[index][field.name]}
                                maxLength={field?.maxLengths}
                                keyboardType={field?.keyboardType || 'default'}
                              // keyboardType='ascii-capable'
                              />
                              {errors.studio?.[index]?.[field.name] &&
                                touched.studio?.[index]?.[field.name] && (
                                  <CustomText
                                    color={Colors.red}
                                    customStyle={{ marginTop: moderateScale(5) }}
                                    text={errors.studio[index][field.name]}
                                  />
                                )}
                            </View>
                          ))}

                          {/* State Selector */}
                          <View style={{ marginVertical: moderateScale(10) }}>
                            <CustomText
                              text="State"
                              size={16}
                              weight="500"
                              customStyle={{ marginBottom: moderateScale(3) }}
                            />
                            <TouchableOpacity
                              onPress={() => setIsModalVisible(index)} // pass index to identify which studio item
                              style={{
                                borderWidth: 1,
                                borderColor: '#ccc',
                                padding: moderateScale(15),
                                borderRadius: moderateScale(8),
                              }}>
                              <CustomText
                                color={
                                  values.studio[index].state
                                    ? '#000'
                                    : Colors.gray_font
                                }
                                weight="500"
                                text={
                                  values.studio[index].state || 'Select State'
                                }
                              />
                            </TouchableOpacity>
                            {errors.studio?.[index]?.state &&
                              touched.studio?.[index]?.state && (
                                <CustomText
                                  color="red"
                                  customStyle={{ marginTop: moderateScale(5) }}
                                  text={errors.studio[index].state}
                                />
                              )}
                          </View>



                          <StateModal
                            showmodal={isModalVisible === index}
                            setShowModal={setIsModalVisible}
                            handleState={(stateValue: string) => {
                              setFieldValue(`studio[${index}].state`, stateValue);
                              setIsModalVisible(false);
                            }}
                          />

                          {/* Opening Time */}
                          <View style={{ marginVertical: moderateScale(10) }}>
                            <CustomText
                              text="Opening Timing"
                              size={16}
                              weight="500"
                              customStyle={{ marginBottom: moderateScale(3) }}
                            />
                            <TouchableOpacity
                              onPress={() => setStartModal(index)}
                              style={{
                                borderWidth: 1,
                                borderColor: '#ccc',
                                padding: moderateScale(15),
                                borderRadius: moderateScale(8),
                              }}>
                              <CustomText
                                weight="500"
                                color={
                                  values.studio[index].openingTime
                                    ? '#000000'
                                    : Colors.gray_font
                                }
                                text={values.studio[index].openingTime || 'From'}
                              />
                            </TouchableOpacity>
                            {errors.studio?.[index]?.openingTime &&
                              touched.studio?.[index]?.openingTime && (
                                <CustomText
                                  color="red"
                                  customStyle={{ marginTop: moderateScale(5) }}
                                  text={errors.studio[index].openingTime}
                                />
                              )}

                            <TimeModal
                              values={values.studio[index].openingTime}
                              timeModal={startModal === index}
                              setTimeModal={setStartModal}
                              handleTime={(time: any) => {
                                setFieldValue(
                                  `studio[${index}].openingTime`,
                                  time.value,
                                );
                                setStartModal(false);
                              }}
                            />

                            {/* Closing Time */}
                            <TouchableOpacity
                              onPress={() => setEndModal(index)}
                              style={{
                                borderWidth: 1,
                                borderColor: '#ccc',
                                padding: moderateScale(15),
                                borderRadius: moderateScale(8),
                                marginTop: moderateScale(10),
                              }}>
                              <CustomText
                                weight="500"
                                color={
                                  values.studio[index].closingTime
                                    ? '#000000'
                                    : Colors.gray_font
                                }
                                text={values.studio[index].closingTime || 'To'}
                              />
                            </TouchableOpacity>
                            {errors.studio?.[index]?.closingTime &&
                              touched.studio?.[index]?.closingTime && (
                                <CustomText
                                  color="red"
                                  customStyle={{ marginTop: moderateScale(5) }}
                                  text={errors.studio[index].closingTime}
                                />
                              )}

                            <TimeModal
                              values={values.studio[index].closingTime}
                              timeModal={endModal === index}
                              setTimeModal={setEndModal}
                              handleTime={(time: any) => {
                                setFieldValue(
                                  `studio[${index}].closingTime`,
                                  time.value,
                                );
                                setEndModal(false);
                              }}
                            />
                          </View>

                          {/* studio pics */}
                          <View>
                            <CustomText text='Studio Photos' size={16} weight='500' />
                            <DocumentPickerComponent
                              allowMultiple={true}
                              docType={["image/*"]}
                              customStyle={{ marginTop: moderateScale(5) }}
                              onPickDocument={documents => {
                                // console.log("---- documents in the studio form ----", documents);
                                setFieldValue(`studio[${index}].studioPic`, documents);
                              }}
                            />

                            <ScrollView
                              showsHorizontalScrollIndicator={false}
                              horizontal
                            >
                              {
                                values?.studio[index]?.studioPic && values?.studio[index]?.studioPic.length > 1 && values?.studio[index]?.studioPic.map((item: any) => {
                                  return (
                                    <View
                                      style={{
                                        borderWidth: 1.5,
                                        borderColor: Colors.orange,
                                        padding: moderateScale(5),
                                        marginRight: moderateScale(10),
                                        borderRadius: moderateScale(5)
                                      }}
                                    >
                                      <Image
                                        source={{ uri: item?.uri }}
                                        width={moderateScale(100)}
                                        height={moderateScale(100)}
                                        borderRadius={moderateScale(3)}
                                      />
                                    </View>
                                  )
                                })
                              }
                            </ScrollView>
                          </View>
                        </View>
                      ))}
                    </>
                  )}
                </FieldArray>

                {/* Aadhaar and PAN Fields */}
                {[
                  {
                    name: 'aadharCardNumber',
                    label: 'Aadhaar Card Number',
                    maxLengths: 12,
                    keyType: 'numeric',
                  },
                  {
                    name: 'panCardNumber',
                    label: 'PAN Card Number',
                    maxLengths: 10,
                  },
                ].map((field: any) => (
                  <View
                    key={field.name}
                    style={{ marginBottom: moderateScale(10) }}>
                    <CustomInput
                      text={field.label}
                      handleChangeText={handleChange(field.name)}
                      value={values[field.name]}
                      maxLength={field?.maxLengths}
                      autoCapitalize={field.name === 'panCardNumber' ? 'characters' : 'none'}
                      keyboardType={field?.keyType || 'default'}
                    />
                    {errors[field.name] && touched[field.name] && (
                      <CustomText
                        color={Colors.red}
                        customStyle={{ marginTop: moderateScale(5) }}
                        text={errors[field.name]}
                      />
                    )}
                  </View>
                ))}

                {/* Submit */}
                <CustomButton
                  onPress={handleSubmit}
                  loading={loading}
                  disabled={loading}
                  title="Submit"
                  customStyle={{ marginTop: moderateScale(20) }}
                />
                <View style={{ marginBottom: moderateScale(50) }} />
              </ScrollView>
            </KeyboardAvoidingView>
          )
        }}
      </Formik>
    </Container>
  );
};

export default UpdateStudioProfile;

const styles = StyleSheet.create({});