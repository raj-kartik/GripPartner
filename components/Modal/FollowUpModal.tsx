import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import CustomModal from '@components/Customs/CustomModal';
import { moderateScale, screenHeight, screenWidth } from '@components/Matrix/Matrix';
import Colors from '@utils/Colors';
import CustomText from '@components/Customs/CustomText';
import { Formik } from 'formik';
import makeApiRequest from '@utils/ApiService';
import { BASE_URL } from '@utils/api';
import CustomToast from '@components/Customs/CustomToast';
import { CommonActions, useNavigation } from '@react-navigation/native';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';

import * as Yup from 'yup';
import CustomInput from '@components/Customs/CustomInput';
import CustomButton from '@components/Customs/CustomButton';
const followSchema = Yup.object().shape({
    comment: Yup.string().min(3, '*too Short').max(500, '*too large'),
    follow_up_date: Yup.date().required('*required'),
});

const FollowUpModal = ({ followModal, setFollowModal, lead_id, onScreen = false, handleLoading, isRetreat = false }: any) => {
    const [isCalendar, setIsCalendar] = useState(false);
    const navigation = useNavigation();
    return (
        <CustomModal
            visible={followModal}
            onDismiss={() => {
                setFollowModal(false);
            }}
            iscenter={false}
            containerStyle={{
                height: screenHeight * 0.6,
                width: screenWidth,
                alignSelf: 'center',
            }}>
            <View
                style={{
                    width: '30%',
                    height: moderateScale(3),
                    borderRadius: moderateScale(100),
                    marginTop: moderateScale(10),
                    backgroundColor: Colors.gray,
                    alignSelf: 'center',
                    marginBottom: moderateScale(5),
                }}
            />
            <CustomText
                text="Follow Up"
                weight="600"
                size={18}
                customStyle={{ textAlign: 'center' }}
            />

            <KeyboardAvoidingView style={{ flex: 1 }}>
                <Formik
                    initialValues={{
                        comments: '',
                        follow_up_date: '',
                    }}
                    validationSchema={followSchema}
                    onSubmit={async values => {
                        console.log(
                            '--- values in the course lead details ---',
                            values,
                        );
                        try {
                            // lead_id
                            const row = {
                                lead_id: lead_id,
                                comments: values.comments,
                                follow_up_date: values.follow_up_date,
                            };

                            // if(onScreen){
                            //     setLoading(true);
                            // }

                            const response: any = await makeApiRequest({
                                baseUrl: BASE_URL,
                                url: isRetreat ? 'user-retreat-lead-followup-create' : 'lead-followup',
                                method: 'POST',
                                data: row,
                            });

                            console.log("-------respons in the follow retreat -----",response);
                            

                            if (response?.success === true) {
                                CustomToast({
                                    type: 'success',
                                    text1: 'Follow Up Successful',
                                    text2: response?.message,
                                });

                                if (!onScreen && !isRetreat) {
                                    navigation.dispatch(
                                        CommonActions.navigate({
                                            name: 'CourseTopNav',
                                            params: {
                                                courseid: null,
                                                screen: 'CourseFollowUps',
                                            },
                                        }),
                                    );
                                    setFollowModal(false)
                                }
                                else {
                                    handleLoading()
                                    setFollowModal(false)
                                }
                                setIsCalendar(false);
                            } else {
                                CustomToast({
                                    type: 'error',
                                    text1: 'Follow Up Unsuccessful',
                                    text2: response?.message,
                                });
                                setIsCalendar(false);
                            }
                        } catch (err: any) {
                            console.log('Error in the Course Lead Details', err);
                        }
                    }}>
                    {({
                        handleChange,
                        handleSubmit,
                        setFieldValue,
                        values,
                        errors,
                        touched,
                    }: any) => {
                        return (
                            <View style={{ flex: 1 }}>
                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                    style={{ flex: 0.9, paddingHorizontal: moderateScale(10) }}>
                                    <CustomInput
                                        text="Comments"
                                        handleChangeText={handleChange('comments')}
                                    />
                                    {errors.comments && (
                                        <CustomText text={errors?.comments} color="#ff0000" />
                                    )}

                                    <CustomText
                                        text="Select Follow Up Date "
                                        customStyle={{ marginTop: moderateScale(10) }}
                                        weight="500"
                                        size={15}
                                    />
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
                                            setIsCalendar(!isCalendar);
                                        }}>
                                        <CustomText
                                            text={
                                                values.follow_up_date ? moment(values.follow_up_date).format("MMMM, Do YYYY") : 'To'
                                            }
                                            color={values.follow_up_date ? '#000' : '#909090'}
                                            weight="400"
                                            size={15}
                                        />
                                    </Pressable>
                                    {isCalendar && (
                                        <CalendarPicker
                                            onDateChange={(date: any) => {
                                                const formattedDate = new Date(date)
                                                    .toLocaleDateString('en-GB', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                    })
                                                    .split('/')
                                                    .reverse()
                                                    .join('-');

                                                setFieldValue(
                                                    'follow_up_date',
                                                    formattedDate.replaceAll('/', '-'),
                                                );
                                                setIsCalendar(false);
                                            }}
                                        />
                                    )}
                                </ScrollView>
                                <View style={{ flex: 0.2 }}>
                                    <CustomButton title="Submit" onPress={handleSubmit} />
                                </View>
                            </View>
                        );
                    }}
                </Formik>
            </KeyboardAvoidingView>
        </CustomModal>
    )
}

export default FollowUpModal

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