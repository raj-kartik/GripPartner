import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import Container from '../../../../components/Container';
import CustomHeader2 from '../../../../components/Customs/Header/CustomHeader2';
import {
    CommonActions,
    useFocusEffect,
    useNavigation,
    useRoute,
} from '@react-navigation/native';
import { MenuProvider } from 'react-native-popup-menu';
import CourseLeadMenu from '../../../../components/Menu/Course/CourseLeadMenu';
import makeApiRequest from '../../../../utils/ApiService';
import { BASE_URL, POST_UNSUBSCRIBE_COURSE } from '../../../../utils/api';
import CustomButton from '../../../../components/Customs/CustomButton';
import { globalStyle } from '../../../../utils/GlobalStyle';
import Colors from '../../../../utils/Colors';
import CustomText from '../../../../components/Customs/CustomText';
import CalendarPicker from 'react-native-calendar-picker';
import {
    moderateScale,
    screenHeight,
    screenWidth,
} from '../../../../components/Matrix/Matrix';
import CustomIcon from '../../../../components/Customs/CustomIcon';
import SubscriptionCard from '../../../../components/Cards/SubscriptionCard';
import CustomModal from '../../../../components/Customs/CustomModal';
import { Formik } from 'formik';
import CustomInput from '../../../../components/Customs/CustomInput';
import CustomToast from '../../../../components/Customs/CustomToast';
import { leadChangeStatus } from '../../../../utils/UtilityFuncations';
import moment from 'moment';

import * as Yup from 'yup';
const followSchema = Yup.object().shape({
    comment: Yup.string().min(3, '*too Short').max(500, '*too large'),
    follow_up_date: Yup.date().required('*required'),
});

const CourseLeadDetails = () => {
    const route: any = useRoute();
    const { lead_id, subscription_id, courseId } = route.params;
    const [loading, setLoading] = useState(false);
    const [lead, setLead] = useState<any>({});

    // ----------------------- MODAL ---------------------- //
    const [followModal, setFollowModal] = useState(false);
    const [isCalendar, setIsCalendar] = useState(false);

    const navigation = useNavigation();
    const [data, setData] = useState<any>(null);
    const [update, setUpdate] = useState([]);
    const [subscriptionModalVisible, setSubscriptionModalVisible] =
        useState(false);
    const [unsubModal, setUnsubModal] = useState(false);

    const date = new Date;

    // console.log('----- course lead details ----', lead_id);

    useFocusEffect(
        useCallback(() => {
            leadLisfun();
            CourseListDetail();
        }, []),
    );
    const today = new Date().toISOString().slice(0, 10);

    const leadLisfun = async () => {
        setLoading(true);

        try {
            //   const response: any = await getMethod(`lead-detail?lead_id=${lead_id}`);
            const response: any = await makeApiRequest({
                baseUrl: BASE_URL,
                url: `lead-detail?lead_id=${lead_id}`,
                method: 'GET',
            });

            // console.log('==== response in the lead details ====', response);

            if (response?.success === true) {
                setLead(response?.lead);
                // console.log(response.data, 'va');
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log('error');
        }
    };

    const CourseListDetail = async () => {
        try {
            setLoading(true);
            //   const response: any = await getMethod(
            //     `course-detail/?id=${route.params.courseId}`,
            //   );
            const response: any = await makeApiRequest({
                baseUrl: BASE_URL,
                url: `course-detail/?id=${courseId}`,
                method: 'GET',
            });

            // console.log('=== response in the course details ====', response);

            if (response) {
                setData(response);
                // console.log(response.data, 'drx');
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log('error');
        }
    };

    const handleUnSubscribe = async () => {
        try {
            const response: any = await makeApiRequest({
                baseUrl: BASE_URL,
                url: POST_UNSUBSCRIBE_COURSE,
                data: {
                    subscription_id: lead_id,
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
                leadLisfun();
                CourseListDetail();
                setUnsubModal(false);
            }

            console.log("---- response in the unsubscribe the trainer ---", response);

        } catch (err: any) {
            console.error('Error in the unsubscribe the course', err);
        }
    };

    const courseDetails = [
        {
            id: 1,
            title: 'Course Name',
            value: data?.name,
            iconType: 'AntDesign',
            iconName: 'infocirlceo',
            iconColor: '#ff0000',
            bg: 'rgba(255,0,0,0.1)',
        },
        {
            id: 2,
            title: 'Course Description',
            value: data?.description || 'No Description',
            iconType: 'AntDesign',
            iconName: 'database',
            iconColor: '#ff0000',
            bg: 'rgba(255,0,0,0.1)',
        },
        {
            id: 3,
            title: 'Course Price',
            value: data?.price || 'Not mentioned',
            iconType: 'MaterialIcons',
            iconName: 'currency-rupee',
            iconColor: '#ff0000',
            bg: 'rgba(255,0,0,0.1)',
        },
        {
            id: 4,
            title: 'Training Level',
            value: data?.training_level,
            iconType: 'Ionicons',
            iconName: 'barbell',
            iconColor: '#ff0000',
            bg: 'rgba(255,0,0,0.1)',
        },
    ];


    const onRefresh = async () => {
        setLoading(true);
        leadLisfun();
        CourseListDetail();
        setLoading(false);
    }

    const SentFun1 = (item: any) => {
        // confirmAction(1);
        navigation.dispatch(
            CommonActions.navigate({
                name: 'AddSubscription',
                params: {
                    lead_id: item,
                },
            }),
        );
    };

    // open close course details
    const confirmAction = async (num: number) => {
        const update: any = await leadChangeStatus('Course', lead_id, num);

        console.log("---- update in the course lead details ---", update);

        if (update) {
            leadLisfun();
            CourseListDetail();
        }
    };

    return (
        <Container>
            <MenuProvider>
                <CourseLeadMenu
                    item={lead}
                    OpenFun={() => confirmAction(1)}
                    CloseFun={() => confirmAction(0)}
                    courseId={courseId}
                />

                {loading ? (
                    <ActivityIndicator size={20} color={'black'} />
                ) : (
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={loading}
                                onRefresh={onRefresh}
                            />
                        }
                        style={{ flexGrow: 1 }}
                        showsVerticalScrollIndicator={false}
                    >
                        <SubscriptionCard item={lead} handlePress={() => { }} />

                        <View style={{ marginBottom: moderateScale(10) }}>
                            {courseDetails.map((item: any) => (
                                <View
                                    style={[
                                        globalStyle.row,
                                        {
                                            marginBottom: moderateScale(10),
                                            marginTop: moderateScale(5),
                                            backgroundColor: '#f7f7f7',
                                            padding: moderateScale(10),
                                            borderRadius: moderateScale(8),
                                            width: '100%',
                                            alignSelf: 'center',
                                            elevation: 3,
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

                        {lead?.status === 'Close' ? null : (
                            <View style={[globalStyle.betweenCenter]}>
                                {lead?.status === 'Subscribed' ? (
                                    <CustomButton
                                        title="Unsubscribe"
                                        onPress={() => {
                                            setUnsubModal(true);
                                        }}
                                        radius={30}
                                        customStyle={{ width: '48%' }}
                                        bg="#FFA500"
                                    />
                                ) : (
                                    <CustomButton
                                        title="Add Subscription"
                                        onPress={() => SentFun1(lead_id)}
                                        customStyle={{ width: '48%' }}
                                        textColor="#000"
                                        bg="#FFA500"
                                        radius={30}
                                    />
                                )}
                                <CustomButton
                                    title="Add Follow Up"
                                    onPress={() => {
                                        setFollowModal(true);
                                        // SentFun(lead_id)
                                    }}
                                    customStyle={{ width: '48%' }}
                                    radius={30}
                                />
                            </View>
                        )}

                        <CustomModal
                            visible={unsubModal}
                            iscenter={true}
                            onDismiss={() => {
                                setUnsubModal(false);
                            }}
                            containerStyle={{
                                height: screenHeight * 0.2,
                                justifyContent: 'center',
                            }}>
                            <CustomText
                                customStyle={{ textAlign: 'center' }}
                                text="Do You really want to Unsubscribe the student?"
                                weight="500"
                            />
                            <View
                                style={[
                                    globalStyle.betweenCenter,
                                    { marginTop: moderateScale(10) },
                                ]}>
                                <CustomButton
                                    title="No"
                                    bg={Colors.orange}
                                    customStyle={{ width: '45%' }}
                                    onPress={() => {
                                        setUnsubModal(false);
                                    }}
                                />
                                <CustomButton
                                    title="Yes"
                                    customStyle={{ width: '45%' }}
                                    onPress={() => {
                                        handleUnSubscribe();
                                    }}
                                />
                            </View>
                        </CustomModal>
                    </ScrollView>
                )}
            </MenuProvider>

            {followModal && (
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

                                    const response: any = await makeApiRequest({
                                        baseUrl: BASE_URL,
                                        url: 'lead-followup',
                                        method: 'POST',
                                        data: row,
                                    });

                                    if (response?.success === true) {
                                        CustomToast({
                                            type: 'success',
                                            text1: 'Follow Up Successful',
                                            text2: response?.message,
                                        });
                                        navigation.dispatch(
                                            CommonActions.navigate({
                                                name: 'CourseTopNav',
                                                params: {
                                                    courseid: null,
                                                    screen: 'CourseFollowUps',
                                                },
                                            }),
                                        );
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
                            }) => {
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
            )}
        </Container>
    );
};

export default CourseLeadDetails;

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
});
