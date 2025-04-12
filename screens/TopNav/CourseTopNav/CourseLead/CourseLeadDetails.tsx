import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import Container from '../../../../components/Container'
import CustomHeader2 from '../../../../components/Customs/Header/CustomHeader2'
import { CommonActions, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native'
import { MenuProvider } from 'react-native-popup-menu'
import CourseLeadMenu from '../../../../components/Menu/Course/CourseLeadMenu'
import makeApiRequest from '../../../../utils/ApiService'
import { BASE_URL } from '../../../../utils/api'
import CustomButton from '../../../../components/Customs/CustomButton'
import { globalStyle } from '../../../../utils/GlobalStyle'
import Colors from '../../../../utils/Colors'
import CustomText from '../../../../components/Customs/CustomText'
import { moderateScale } from '../../../../components/Matrix/Matrix'
import CustomIcon from '../../../../components/Customs/CustomIcon'
import SubscriptionCard from '../../../../components/Cards/SubscriptionCard'

const CourseLeadDetails = () => {
    const route: any = useRoute();
    const { lead_id, subscription_id, courseId } = route.params;
    const [loading, setLoading] = useState(false);
    const [lead, setLead] = useState({});
    const confirmAction = (num: number) => {
    };

    const navigation = useNavigation();
    const [data, setData] = useState<any>(null)
    const [update, setUpdate] = useState([]);
    const [subscriptionModalVisible, setSubscriptionModalVisible] = useState(false);

    useFocusEffect(
        useCallback(() => {
            leadLisfun();
            CourseListDetail();
        }, []),
    );

    const leadLisfun = async () => {
        setLoading(true);

        try {
            //   const response: any = await getMethod(`lead-detail?lead_id=${lead_id}`);
            const response: any = await makeApiRequest({
                baseUrl: BASE_URL,
                url: `lead-detail?lead_id=${lead_id}`,
                method: "GET",
            })

            console.log("==== response in the lead details ====", response);

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
                url: `course-detail/?id=${route.params.courseId}`,
                method: "GET"
            });
            if (response.status === 200) {
                setData(response.data);
                // console.log(response.data, 'drx');
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log('error');
        }
    };

    const unsubFun = () => {
        console.log('==== unsubfun calling ====');
        Alert.alert('Confirmation', 'Are you sure you want to unsubscribe?', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Yes',
                onPress: () => {
                    confirmAction(2);
                    setSubscriptionModalVisible(true);
                },
            },
        ]);
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
            value: data?.description,
            iconType: 'AntDesign',
            iconName: 'database',
            iconColor: '#ff0000',
            bg: 'rgba(255,0,0,0.1)',
        },
        {
            id: 3,
            title: 'Course Price',
            value: data?.price,
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

    const SentFun = (item: any) => {
        navigation.dispatch(
          CommonActions.navigate({
            name: 'FollowUpScreen',
            params: {
              lead_id: item,
            },
          }),
        );
      };
    
      const SentFun1 = (item: any) => {
        confirmAction(1);
        navigation.dispatch(
          CommonActions.navigate({
            name: 'AddSubscriptionScreen',
            params: {
              lead_id: item,
            },
          }),
        );
      };

    return (
        <Container>
            <MenuProvider>
                <CourseLeadMenu
                    item={lead}
                    OpenFun={() => confirmAction(1)}
                    CloseFun={() => confirmAction(0)}
                    courseId={courseId} />

                {loading ? (
                    <ActivityIndicator size={20} color={'black'} />
                ) : (
                    <View>
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

                        {lead?.status === 'Close' ? null : (
                            <View style={[globalStyle.betweenCenter]}>
                                {lead?.status === 'Subscribed' ? (
                                    <CustomButton
                                        title="Unsubscribe"
                                        onPress={() => {
                                            console.log('==== pressing =====');
                                            unsubFun();
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
                                    onPress={() => SentFun(lead_id)}
                                    customStyle={{ width: '48%' }}
                                    radius={30}
                                />
                            </View>
                        )}
                    </View>
                )}
            </MenuProvider>
        </Container>
    )
}

export default CourseLeadDetails

const styles = StyleSheet.create({})