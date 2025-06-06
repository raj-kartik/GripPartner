import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useMemo, useState } from 'react'
import Container from '../../../../../components/Container'
import CustomHeader2 from '../../../../../components/Customs/Header/CustomHeader2'
import { useFocusEffect } from '@react-navigation/native'
import makeApiRequest from '../../../../../utils/ApiService'
import { BASE_URL, TRAINER_COURSE_DETAILS } from '../../../../../utils/api'
import CustomText from '../../../../../components/Customs/CustomText'
import CustomIcon from '../../../../../components/Customs/CustomIcon'
import { globalStyle } from '../../../../../utils/GlobalStyle'
import { moderateScale, screenHeight, screenWidth } from '../../../../../components/Matrix/Matrix'
import Colors from '../../../../../utils/Colors'
import Images from '../../../../../utils/Images'
import TrainingDetails from '../../../../../components/DetailsComponent/TrainingDetails'
import TrainerDashboard from '../../../../../components/TrainingDashboard'
import CourseDetailMenu from '../../../../../components/Menu/CourseDetailMenu'
import { MenuProvider } from 'react-native-popup-menu'
import CustomToast from '@components/Customs/CustomToast'

const TrainerCourseDetails = (props: any) => {

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>([]);
    const [status, setStatus] = useState(false);
    const [first, setFirst] = useState(null);
    const [last, setLast] = useState(null);
    const { course_id } = props.route?.params;


    // console.log("---- data in the course details ----", data);


    useFocusEffect(
        useCallback(() => {
            CourseListDetail();
        }, []),
    );

    const CourseListDetail = async () => {
        try {
            setLoading(true);
            //   const response: any = await getMethod(`course-detail/?id=${course_id}`);
            const response: any = await makeApiRequest({
                baseUrl: BASE_URL,
                method: "GET",
                url: TRAINER_COURSE_DETAILS(course_id)
            });

            // console.log("==== reponse in the course details ====", response);

            if (response) {
                setData(response);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log('error');
        }
    };

    // console.log("===== data in the course details ====", data);



    const RenderItem = () => (
        <View style={styles.card}>
            <View style={styles.image}>
                <View
                    style={[
                        globalStyle.row,
                        {
                            position: 'absolute',
                            backgroundColor: 'rgba(255,255,255,1)',
                            paddingHorizontal: moderateScale(10),
                            paddingVertical: moderateScale(5),
                            zIndex: 10,
                            borderRadius: moderateScale(6),
                            top: moderateScale(5),
                            right: moderateScale(5),
                        },
                    ]}>
                    <CustomIcon
                        type="Feather"
                        name={data?.status ? 'check-circle' : 'x-circle'}
                        color={data?.status ? Colors.activeRadio : '#ff0000'}
                        size={22}
                    />
                    <CustomText
                        text={data?.status === 1 ? 'Active' : 'Disabled'}
                        customStyle={{ marginLeft: moderateScale(3) }}
                        weight="500"
                    />
                </View>
                {data?.select_image ? (
                    <Image source={{ uri: data?.select_image }} style={styles.image} />
                ) : (
                    <View style={styles.image}>
                        <Images.Logo />
                    </View>
                )}
                <View
                    style={{
                        alignItems: 'center',
                        backgroundColor: 'white',
                        position: 'absolute',
                        bottom: moderateScale(10),
                        right: moderateScale(10),
                        padding: moderateScale(5),
                        borderRadius: moderateScale(5),
                    }}>
                    <View style={[globalStyle.row]}>
                        <CustomIcon
                            type="AntDesign"
                            name="star"
                            size={18}
                            color={Colors.orange}
                        />
                        <CustomText
                            weight="600"
                            customStyle={{ marginLeft: moderateScale(10) }}
                            text={parseFloat(data?.fullstar).toFixed(1)}
                        // text="4.5"
                        />
                    </View>
                    <CustomText
                        text={`${data?.totalreview} Review`}
                        size={12}
                        customStyle={{ marginTop: moderateScale(3) }}
                        weight="600"
                        color={Colors.gray_font}
                    />
                </View>
            </View>

            <View style={[globalStyle.betweenCenter]}>
                <CustomText
                    text={data?.name}
                    size={22}
                    weight="700"
                    customStyle={{ marginBottom: moderateScale(3) }}
                />
            </View>

            <CustomText
                text={`By ${data?.trainer}`}
                size={14}
                weight="500"
                color={Colors.gray_font}
                customStyle={{ marginBottom: moderateScale(5) }}
            />

            <TrainerDashboard
                lead={data?.lead}
                subs={data?.suscription}
                impression={data?.impression}
                click={data?.clicks}
            />

            <View>
                {detailInfo
                    .filter(item => item && item.value !== '' && item.value !== null && item.value !== undefined)
                    .map((item, index) => (
                        <View
                            key={index}
                            style={[
                                globalStyle.flex,
                                {
                                    marginBottom: moderateScale(10),
                                    marginTop: moderateScale(5),
                                    elevation: 4,
                                    backgroundColor: '#f7f7f7',
                                    paddingVertical: moderateScale(10),
                                    paddingHorizontal: moderateScale(5),
                                    borderRadius: moderateScale(8),
                                    width: '100%',
                                },
                            ]}
                        >
                            <View
                                style={[
                                    globalStyle.center,
                                    {
                                        backgroundColor: 'rgba(255,0,0,0.1)',
                                        width: moderateScale(50),
                                        height: moderateScale(50),
                                        borderRadius: moderateScale(100),
                                        marginRight: moderateScale(5),
                                    },
                                ]}
                            >
                                <CustomIcon
                                    color="#ff0000"
                                    type={item.iconType}
                                    name={item.iconName}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <CustomText
                                    text={item.label}
                                    size={16}
                                    weight="600"
                                    color={Colors.gray_font}
                                />
                                <CustomText text={item.value} size={13} weight="500" />
                            </View>
                        </View>
                    ))}

            </View>

            <View style={{ marginTop: moderateScale(10) }}>
                <CustomText
                    text="Description"
                    weight="600"
                    size={18}
                    color={Colors.gray_font}
                />

                <Text
                    style={[
                        styles.text1,

                        {
                            width: screenWidth * .8,
                            fontSize: 15,
                            textAlign: 'justify',
                            marginBottom: 0,
                        },
                    ]}>
                    {data?.description != null && data?.description.length > 250
                        ? status
                            ? data?.description
                            : data?.description.substring(0, 250)
                        : data?.description}
                </Text>
                {data?.description ? (
                    <Pressable
                        style={{ flexDirection: 'row' }}
                        onPress={() => setStatus(!status)}>
                        <Text style={[styles.text1, { color: 'green' }]}>
                            {data?.description != null && data?.description.length > 250
                                ? status
                                    ? ' Show More Details'
                                    : 'Hide More Details'
                                : ' '}
                        </Text>
                    </Pressable>
                ) : (
                    <View style={{ display: 'none' }}></View>
                )}
            </View>
        </View>
    );


    const detailInfo = [
        {
            id: 1,
            label: 'Location',
            value: data?.location || '',
            iconType: 'Ionicons',
            iconName: 'location-sharp',
        },
        {
            id: 2,
            label: 'Date',
            value: data?.created_at || '',
            iconType: 'Feather',
            iconName: 'calendar',
        },
        data?.morning_days &&
        data?.morning_timing && {
            id: 3,
            label: 'Morning',
            value: `${data?.morning_days} || ${data?.morning_timing}`,
            iconType: 'Feather',
            iconName: 'sun',
        },
        data?.evening_timing &&
        data?.evening_days && {
            label: 'Evening',
            value: `${data?.evening_days} || ${data?.evening_timing}`,
            iconType: 'Feather',
            iconName: 'moon',
        },
        {
            id: 4,
            label: 'Price',
            value: data?.price || 0,
            iconType: 'MaterialIcons',
            iconName: 'currency-rupee',
        },
    ];

    const distableFun = async (res: number) => {
        console.log("==== res in the distableFun ====", res);
        const data = res === 1 ? 'Enable' : 'Disable';

        setLoading(true);
        try{
            const response:any = await makeApiRequest({
                baseUrl: BASE_URL,
                method: "POST",
                url: `course-status`,
                data: {
                    id: course_id,
                    status: res
                }
            })

            // console.log("==== response in the distableFun ====", response);

            if(response?.success == true) {
                CustomToast({
                    type: 'success',
                    text1: `Course ${data}d successfully!`,
                })
                CourseListDetail();
            }
            
        }
        catch (error) {
            // setLoading(false);
            console.log('error',error);
        }
        finally {
            setLoading(false);
        }
    };

    // console.log("==== data in the trainer course details ====", data);
    


    return (
        <Container>
            {/* <CustomHeader2 title="Course Details" /> */}
            <MenuProvider>
                <ScrollView
                    showsVerticalScrollIndicator={false} // Hide vertical scrollbar
                    showsHorizontalScrollIndicator={false}>
                    <CourseDetailMenu handleEnable={(isEnable: number) => distableFun(isEnable)} isEnable={data?.status} courseid={course_id} courseItem={data} />
                    <RenderItem />
                    <TrainingDetails
                        item={data}
                        Coursedata={true}
                    />

                    <View style={{ marginTop: moderateScale(10) }} >
                        <CustomText text='Slots' weight='700' size={18} customStyle={{ marginBottom: moderateScale(10) }} />
                        <FlatList
                            data={data?.slottime?.slots}
                            keyExtractor={(item) => item?.id}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => {
                                // console.log("==== item in the slot ====", item);
                                return (
                                    <View style={[styles.slotContainer, globalStyle.flex]} >
                                        <View
                                            style={[
                                                globalStyle.center,
                                                {
                                                    backgroundColor: 'rgba(247, 160, 17 ,0.1)',
                                                    width: moderateScale(50),
                                                    height: moderateScale(50),
                                                    borderRadius: moderateScale(100),
                                                    marginRight: moderateScale(5),
                                                },
                                            ]}>
                                            <CustomIcon
                                                color="#f7a011"
                                                type="MaterialIcons"
                                                name="access-time"
                                            />
                                        </View>
                                        <View style={{ width: "100%", paddingRight: moderateScale(50) }}>
                                            <CustomText
                                                text={`${item?.start_time} - ${item?.end_time}`}
                                                // size={16}
                                                weight="600"
                                                color={Colors.gray_font}
                                            />
                                            <CustomText
                                                text={item?.slot_days}
                                                customStyle={{
                                                    flexWrap: 'wrap',
                                                    flexShrink: 1, // allow shrinking if needed
                                                    flexGrow: 1, // allow growth
                                                }}
                                                // size={16}
                                                weight="600"
                                            />
                                        </View>

                                    </View>
                                )

                            }}
                        />
                    </View>
                </ScrollView>
            </MenuProvider>
        </Container>
    )
}

export default TrainerCourseDetails

const styles = StyleSheet.create({
    text1: {
        width: "75%",
        flexWrap: 'wrap',
        textAlign: 'left',
        color: 'black',
        fontFamily: 'Roboto-Medium',
        fontSize: 15,
        marginBottom: 0,
    },
    slotContainer: {
        padding: moderateScale(10),
        elevation: 2,
        backgroundColor: "#f7f7f7",
        borderRadius: moderateScale(10),
        height: moderateScale(80),
        marginBottom: moderateScale(10),
        marginTop: moderateScale(5),
        width: "98%",
        alignSelf: "center"
    },
    image: {
        height: screenHeight * .3,
        resizeMode: 'cover',
        marginBottom: moderateScale(10),
        borderRadius: moderateScale(10),
        alignItems: 'center',
        width: '100%',
    },
})