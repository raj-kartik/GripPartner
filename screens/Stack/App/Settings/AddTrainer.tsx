import { Image, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Container from '@components/Container'
import CustomHeader2 from '@components/Customs/Header/CustomHeader2'
import * as yup from 'yup'
import { FieldArray, Formik } from 'formik'
import CustomButton from '@components/Customs/CustomButton'
import CustomInput from '@components/Customs/CustomInput'
import DocumentPickerComponent from '@components/DocumentPicker'
import { moderateScale } from '@components/Matrix/Matrix'
import Colors from '@utils/Colors'
import CustomText from '@components/Customs/CustomText'
import { globalStyle } from '@utils/GlobalStyle'
import CustomIcon from '@components/Customs/CustomIcon'
import makeApiRequest from '@utils/ApiService'
import { BASE_URL, POST_ADD_TRAINER } from '@utils/api'
import SelectStudio from '@components/Modal/SelectStudio'
import axios from 'axios'
import CustomToast from '@components/Customs/CustomToast'
import { set } from 'date-fns'
import { useNavigation } from '@react-navigation/native'

const trainerSchema = yup.object().shape({
  trainers: yup.array().of(
    yup.object().shape({
      name: yup
        .string()
        .required('*required')
        .min(2, '*too short')
        .max(50, '*too long'),

      email: yup
        .string()
        .email('*invalid email')
        .required('*required'),

      mobile: yup
        .string()
        .matches(/^[6-9]\d{9}$/, '*invalid mobile number')
        .required('*required'),

      profile_pic: yup
        .mixed()
        .required('*required'),
      skills: yup.string().required('*skill is required'),

      language: yup.string().required('*language is required'),

      about: yup
        .string()
        .min(10, '*too short')
        .max(500, '*too long')
        .required('*required'),
    })
  )
});



const AddTrainer = () => {
  const navigation:any = useNavigation();
  const [loading, setLoading] = useState(false);
  const handleAddTrainer = async (values: any) => {
    const trainer = values;

    // console.log("----- Trainer Data:", trainer);
    // console.log("----- Trainer studio id:", trainer?.studioId?.id);
    // return;
    setLoading(true);
    if (!trainer) {
      console.error("No trainer data provided");
      return;
    }
    try {
      const formData = new FormData();

      formData.append('first_name', trainer.name);
      formData.append('email', trainer.email);
      formData.append('mobile_no', trainer.mobile);
      formData.append('about_me', trainer.about);
      formData.append('skills', trainer.skills);
      formData.append('language', trainer.language);
      formData.append('studio_id', trainer?.studioId?.id);
      formData.append('user_type', 'Trainer');

      if (trainer.profile_pic) {
        formData.append('profile_pic', {
          uri: trainer.profile_pic.uri,
          type: trainer.profile_pic.type,
          name: trainer.profile_pic.name || 'profile.jpg',
        });
      }

      // console.log("----- Form Data for Trainer:", formData);

      // const response = await makeApiRequest({
      //   method: 'POST',
      //   url: POST_ADD_TRAINER,
      //   baseUrl: BASE_URL,
      //   data: formData,
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });

      const response: any = await axios.post(`${BASE_URL}${POST_ADD_TRAINER}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response?.data?.status == false) {
        CustomToast({
          type: "error",
          text1: response?.data?.message || "Failed to add trainer",
          text2: "Please try again later",
        })
      }
      else if (response?.data?.status == true) {
        CustomToast({
          type: "success",
          text1: response?.data?.message || "Trainer added successfully",
          text2: "You can view the trainer in the list",
        });
        navigation.navigate('CompleteTrainer');
      }

      console.log('----- Trainer added:', response);
    } catch (err) {
      console.error('Error in adding trainer', err);
    }
    finally {
      setLoading(false);
    }
  };



  const initialValues = {
    trainers: [
      {
        name: '',
        email: '',
        mobile: '',
        profile_pic: '',
        skills: '',
        language: '',
        about: '',
        studioId: {}, // Assuming a static studio ID for now
      },
    ],
  };

  return (
    <Container>
      <CustomHeader2
        title="Add Trainer"
      />

      <Formik
        initialValues={initialValues}
        validationSchema={trainerSchema}
        onSubmit={values => {
          // console.log('Submitted Data:', values);
          handleAddTrainer(values?.trainers[0]); // Assuming we only submit the first trainer
        }}
      >
        {({ handleChange, handleSubmit, values, errors, touched, setFieldValue }) => (
          <KeyboardAvoidingView style={{ flex: 1 }} >


            <ScrollView showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps='handled'
            >
              <FieldArray name="trainers">
                {({ push, remove }) => (
                  <View style={{ rowGap: moderateScale(10) }} >


                    {/* </> */}
                    {values.trainers.map((trainer, index) => {
                      const trainerErrors: any = errors.trainers?.[index] || {};
                      const trainerTouched: any = touched.trainers?.[index] || {};
                      const isLastTrainer = index === values.trainers.length - 1;

                      return (
                        <View
                          key={index}
                          style={{ borderWidth: 1, padding: moderateScale(10), borderRadius: moderateScale(10) }}
                        >
                          {/* <View style={[globalStyle.betweenCenter]}>
                            <CustomText text={trainer?.name || `Trainer ${index + 1}`} size={18} weight="600" />

                            {isLastTrainer ? (
                              <TouchableOpacity onPress={() => push(initialValues.trainers[0])}>
                                <CustomText text="Add more" weight="500" />
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                onPress={() => remove(index)}
                                style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}
                              >
                                <CustomIcon type="Feather" name="trash" color={Colors.red} />
                              </TouchableOpacity>
                            )}
                          </View> */}
                          <CustomInput
                            text="Name"
                            placeholder="Enter name"
                            autoCapitalize='words'
                            value={trainer.name}
                            handleChangeText={handleChange(`trainers[${index}].name`)}
                            customStyle={{ marginBottom: 5 }}
                          />
                          {trainerTouched.name && trainerErrors.name && (
                            <Text style={{ color: 'red', fontSize: 12 }}>{trainerErrors.name}</Text>
                          )}

                          <CustomInput
                            text="Email"
                            placeholder="Enter email"
                            value={trainer.email}
                            handleChangeText={handleChange(`trainers[${index}].email`)}
                            keyboardType="email-address"
                            customStyle={{ marginBottom: 5 }}
                          />
                          {trainerTouched.email && trainerErrors.email && (
                            <Text style={{ color: 'red', fontSize: 12 }}>{trainerErrors.email}</Text>
                          )}

                          <CustomInput
                            text="Mobile Number"
                            placeholder="Enter mobile number"
                            value={trainer.mobile}
                            maxLength={10}
                            handleChangeText={handleChange(`trainers[${index}].mobile`)}
                            keyboardType="phone-pad"
                            customStyle={{ marginBottom: 5 }}
                          />
                          {trainerTouched.mobile && trainerErrors.mobile && (
                            <Text style={{ color: 'red', fontSize: 12 }}>{trainerErrors.mobile}</Text>
                          )}

                          <View style={{ marginTop: moderateScale(5) }}>
                            <CustomText text="Select Studio" size={16} weight="500" />
                            <SelectStudio
                              selectedStudios={trainer.studioId}
                              handleSelectStudio={(studio: any) => {
                                console.log("Selected Studio:", studio);
                                setFieldValue(`trainers[${index}].studioId`, studio);
                              }}
                            />
                          </View>

                          <CustomInput
                            text="Skills"
                            placeholder="Enter skills (comma separated)"
                            autoCapitalize='words'
                            value={trainer.skills}
                            handleChangeText={handleChange(`trainers[${index}].skills`)}
                            customStyle={{ marginBottom: 5 }}
                          />
                          {trainerTouched.skills && trainerErrors.skills && (
                            <Text style={{ color: 'red', fontSize: 12 }}>{trainerErrors.skills}</Text>
                          )}

                          <CustomInput
                            text="Languages"
                            placeholder="Enter languages (comma separated)"
                            autoCapitalize='words'
                            value={trainer.language}
                            handleChangeText={handleChange(`trainers[${index}].language`)}
                            customStyle={{ marginBottom: 5 }}
                          />
                          {trainerTouched.language && trainerErrors.language && (
                            <Text style={{ color: 'red', fontSize: 12 }}>{trainerErrors.language}</Text>
                          )}

                          <CustomInput
                            text="About"
                            placeholder="About the trainer"
                            autoCapitalize='sentences'
                            value={trainer.about}
                            handleChangeText={handleChange(`trainers[${index}].about`)}
                            multiline
                            customStyle={{ marginBottom: 5 }}
                          />
                          {trainerTouched.about && trainerErrors.about && (
                            <Text style={{ color: 'red', fontSize: 12 }}>{trainerErrors.about}</Text>
                          )}

                          <View style={{ marginTop: moderateScale(10) }}>
                            <CustomText text="Profile Picture" size={16} weight="500" />
                            <DocumentPickerComponent
                              customStyle={{ marginTop: moderateScale(5) }}
                              docType={['image/jpeg', 'image/png', 'image/jpg']}
                              onPickDocument={documents => {
                                setFieldValue(`trainers[${index}].profile_pic`, documents[0]);
                              }}
                            />
                            {
                              trainer.profile_pic && (
                                <Image
                                  source={{ uri: trainer?.profile_pic?.uri }}
                                  style={{ width: moderateScale(100), height: moderateScale(100), marginVertical: moderateScale(5), borderRadius: moderateScale(10) }}
                                />
                              )
                            }
                            {trainerTouched.profile_pic && trainerErrors.profile_pic && (
                              <Text style={{ color: 'red', fontSize: 12 }}>{trainerErrors.profile_pic}</Text>
                            )}
                          </View>

                          {/* {
                            isLastTrainer && <TouchableOpacity onPress={() => remove(index)} style={{ marginTop: 10, justifyContent: "flex-end", alignItems: "flex-end" }}>
                              <CustomIcon
                                type='Feather'
                                name='trash'
                                color={Colors.red}
                              />
                            </TouchableOpacity>
                          } */}

                        </View>
                      );
                    })}

                    {/* <TouchableOpacity onPress={() => push(initialValues.trainers[0])}>
                      <Text style={{ color: 'blue' }}>+ Add Another Trainer</Text>
                    </TouchableOpacity> */}
                  </View>
                )}
              </FieldArray>
            </ScrollView>

            <CustomButton textColor='#000' loading={loading} disabled={loading} customStyle={{ marginVertical: moderateScale(10) }} bg={Colors.orange} title="Submit" onPress={handleSubmit} />
          </KeyboardAvoidingView>
        )}
      </Formik>


    </Container>
  )
}

export default AddTrainer

const styles = StyleSheet.create({})