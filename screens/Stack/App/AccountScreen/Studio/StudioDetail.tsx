import {
    FlatList,
    Image,
    Linking,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import CustomText from '@components/Customs/CustomText';
import Container from '@components/Container';
import CustomHeader2 from '@components/Customs/Header/CustomHeader2';
import Images from '@utils/Images';
import { moderateScale, screenWidth } from '@components/Matrix/Matrix';
import { globalStyle } from '@utils/GlobalStyle';
import Colors from '@utils/Colors';
import CustomIcon from '@components/Customs/CustomIcon';
import SubHeader from '@components/Customs/Header/SubHeader1';
import makeApiRequest from '@utils/ApiService';
import { BASE_URL, GET_STUDIO_DETAILS } from '@utils/api';
import CustomToast from '@components/Customs/CustomToast';
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native';

const StudioDetail = (props: any) => {
    const { item: studio } = props?.route?.params;
    const navigation = useNavigation();
    const [data, setData] = useState<any>(null)

    useFocusEffect(useCallback(() => {
        const fetchStudioDetails = async () => {
            try {
                const response: any = await makeApiRequest({
                    method: "POST",
                    url: GET_STUDIO_DETAILS,
                    baseUrl: BASE_URL,
                    data: {
                        studio_id: studio?.id
                    }
                });

                if (response?.success) {
                    setData(response?.data);
                }
                else {
                    CustomToast({
                        type: "error",
                        text1: "Invalid Studio Credientials",
                        text2: ""
                    });
                }

                console.log("--- response in the studio details ---", response?.data);

            }
            catch (err: any) {
                console.log("---error in the studio details ----", err);
            }
        };

        fetchStudioDetails();
    }, []));


    console.log("--- studio details trainer ---", data?.trainers);

    const sendId = (item: any, id: string) => {
        navigation.dispatch(
            CommonActions.navigate({
                // name: 'CourseDetails',
                name: 'CourseDetails',
                params: {
                    courseid: id,
                    course: item,
                },
            }),
        );
    };


    return (
        <View style={{ flex: 1, backgroundColor: "#fff", }} >
            <StatusBar
                backgroundColor={Colors.orange_bg}
            />
            <CustomHeader2 title="Studio Detail" bg={Colors.orange_bg} />
            <ScrollView showsVerticalScrollIndicator={false} >
                <View style={[styles.imageView, globalStyle.center]}>

                    <View
                        style={styles.imageDesign}
                    />
                    {studio.image ? (
                        <Image
                            source={{ uri: studio.image }}
                            style={{
                                height: moderateScale(140),
                                width: moderateScale(140),
                                borderRadius: moderateScale(140),
                            }}
                        />
                    ) : (
                        <Images.Logo
                            width={moderateScale(120)}
                            height={moderateScale(120)}
                            style={{
                                height: moderateScale(150),
                            }}
                        />
                    )}

                    <View
                        style={[
                            globalStyle.center,
                            {
                                width: moderateScale(100),
                                height: moderateScale(30),
                                // height:moderateScale(20),
                                padding: moderateScale(5),
                                backgroundColor: Colors.orange_bg,
                                borderRadius: moderateScale(100),
                                position: 'absolute',
                                bottom: -10,
                                right: -moderateScale(20),
                            },
                        ]}>
                        <CustomText text={studio.studio_type} weight="500" />
                    </View>
                </View>

                {/* contact + email */}
                <View style={{ alignSelf: 'center', paddingHorizontal: moderateScale(10) }}>
                    <CustomText
                        text={studio.studio_name}
                        size={22}
                        weight="600"
                        customStyle={{ textAlign: 'center', marginTop: moderateScale(5) }}
                    />
                    <View
                        style={[
                            globalStyle.center,
                            {
                                width: '100%',
                                alignSelf: 'center',
                                marginVertical: moderateScale(10),
                                flexDirection: 'row',
                            },
                        ]}>
                        <Pressable
                            onPress={() => {
                                if (studio.contact_number) {
                                    Linking.openURL(`tel:${studio?.contact_number}`);
                                }
                            }}
                            style={[
                                globalStyle.row,
                                {
                                    alignSelf: 'center',
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                },
                            ]}>
                            <CustomIcon type="Feather" name="phone" color={Colors.orange} />
                            <CustomText
                                customStyle={{ marginLeft: moderateScale(5) }}
                                text={`+91-${studio.contact_number}`}
                                size={15}
                                weight="500"
                                color={Colors.gray_font}
                            />
                        </Pressable>

                        <Pressable
                            onPress={() => {
                                if (studio.email) {
                                    Linking.openURL(`mailto:${studio?.email}`);
                                }
                            }}
                            style={[
                                globalStyle.row,
                                {
                                    alignSelf: 'center',
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                },
                            ]}>
                            <CustomIcon type="Feather" name="mail" color={Colors.orange} />
                            <CustomText
                                customStyle={{ marginLeft: moderateScale(5) }}
                                text={studio.email}
                                size={15}
                                weight="500"
                                color={Colors.gray_font}
                            />
                        </Pressable>
                    </View>

                    {/* location */}
                    <View
                        style={[
                            globalStyle.center,
                            { alignItems: 'center', width: '100%', flexDirection: 'row' },
                        ]}>
                        <CustomIcon
                            type="Ionicons"
                            name="location-sharp"
                            color={Colors.orange}
                        />
                        <CustomText
                            text={
                                studio.pincode
                                    ? `${studio.location} - ${studio.pincode}`
                                    : studio.location
                            }
                            size={18}
                            weight="500"
                        />

                    </View>
                </View>

                <View
                    style={[
                        globalStyle.betweenCenter,
                        { marginTop: moderateScale(10), justifyContent: 'space-evenly', paddingHorizontal: moderateScale(10) },
                    ]}>
                    {/* opens at */}
                    <View style={[globalStyle.center, styles.timingContainer, { marginHorizontal: moderateScale(5) }]}>
                        <CustomIcon
                            type="MaterialCommunityIcons"
                            name="clock-time-four-outline"
                            color={Colors.orange}
                            size={30}
                        />
                        <View style={{ marginLeft: moderateScale(5) }}>
                            <CustomText text="Opens at" weight="500" color={Colors.gray} />
                            <CustomText text={studio.opening_time.slice(0, 5)} weight="600" />
                        </View>
                    </View>

                    {/* closes at */}
                    <View
                        style={[
                            globalStyle.center,
                            styles.timingContainer,
                            {
                                marginHorizontal: moderateScale(5),
                            },
                        ]}>
                        <CustomIcon
                            type="MaterialCommunityIcons"
                            name="clock-time-nine-outline"
                            color={Colors.orange}
                            size={30}
                        />
                        <View style={{ marginLeft: moderateScale(5) }}>
                            <CustomText text="Closes at" weight="500" color={Colors.gray} />
                            <CustomText text={studio.closing_time.slice(0, 5)} weight="600" />
                        </View>
                    </View>
                </View>

                {/* courses */}
                <View style={{ marginTop: moderateScale(10), paddingHorizontal: moderateScale(10) }}>
                    <SubHeader title="Courses" isMore={false} />
                    {
                        data?.courses?.length > 0 ? (
                            <FlatList
                                data={data?.courses || []}
                                keyExtractor={(item) => item.id.toString()}
                                horizontal
                                contentContainerStyle={{ columnGap: moderateScale(10) }}
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item }) => (
                                    <Pressable style={styles.courseCard}
                                        onPress={() => sendId(item, item?.id)}
                                    >
                                        <View style={{ flex: 2 }} >
                                            <Image
                                                source={{ uri: item?.image }}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    borderRadius: moderateScale(10),
                                                }}
                                            />
                                        </View>

                                        <View style={{ flex: 1, marginTop: moderateScale(5) }} >
                                            <CustomText
                                                text={item?.title}
                                                weight='600'
                                                size={16}
                                            />

                                            <View style={[globalStyle.row, { marginTop: moderateScale(5) }]}>
                                                {item?.slottiming?.first_start_time && (
                                                    <View style={[globalStyle.row, { marginTop: moderateScale(0), marginBottom: moderateScale(5) }]}>
                                                        <CustomIcon color="#8c8c8c" type="Ionicons" name="time-outline" />
                                                        <CustomText
                                                            weight="500"
                                                            color="#8c8c8c"
                                                            customStyle={{ marginLeft: moderateScale(5) }}
                                                            text={item?.slottiming?.first_start_time}
                                                        />
                                                    </View>
                                                )}

                                                {item?.slottiming?.last_end_time && (
                                                    <View style={[globalStyle.row, { marginTop: moderateScale(0), marginBottom: moderateScale(5), marginLeft: moderateScale(10) }]}>
                                                        <CustomIcon color="#8c8c8c" type="Ionicons" name="time-outline" />
                                                        <CustomText
                                                            weight="500"
                                                            color="#8c8c8c"
                                                            customStyle={{ marginLeft: moderateScale(5) }}
                                                            text={item?.slottiming?.last_end_time}
                                                        />
                                                    </View>
                                                )}

                                            </View>
                                        </View>
                                    </Pressable>
                                )}
                            />
                        ) : (
                            <View>
                                <CustomText text="No Course Available" size={16} weight='500' color={Colors.gray_font} />
                            </View>
                        )
                    }

                </View>

                {/* trainer */}
                <View style={{ marginTop: moderateScale(10), paddingHorizontal: moderateScale(10) }}>
                    <SubHeader title="Trainers" isMore={false} />
                    {
                        data?.trainers?.length > 0 ? (
                            <FlatList
                                data={data?.trainers || []}
                                keyExtractor={(item) => item.id.toString()}
                                horizontal
                                contentContainerStyle={{ columnGap: moderateScale(10) }}
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item }) => {
                                    // console.log("---- item in the trainer ----",item);

                                    return (
                                        <Pressable style={styles.courseCard}
                                        // onPress={() => sendId(item, item?.id)}
                                        >
                                            <View style={{ flex: 2 }} >
                                                {
                                                    item["user image"] ? <Image
                                                        source={{ uri: item["user image"] }}
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            borderRadius: moderateScale(10),
                                                            // flex:1
                                                        }}
                                                    /> :
                                                        <View style={[globalStyle.center, { backgroundColor: "#f7f7f7" }]} >
                                                            <Images.Logo
                                                                width={moderateScale(120)}
                                                                height={moderateScale(120)}
                                                                style={{
                                                                    height: moderateScale(150),
                                                                }}
                                                            />
                                                        </View>
                                                }

                                            </View>

                                            <View style={{ flex: 1, marginTop: moderateScale(5) }} >
                                                <CustomText
                                                    text={item?.name}
                                                    weight='600'
                                                    size={16}
                                                />

                                                <View style={[globalStyle.row, { marginTop: moderateScale(5) }]}>
                                                    {item?.slottiming?.first_start_time && (
                                                        <View style={[globalStyle.row, { marginTop: moderateScale(0), marginBottom: moderateScale(5) }]}>
                                                            <CustomIcon color="#8c8c8c" type="Ionicons" name="time-outline" />
                                                            <CustomText
                                                                weight="500"
                                                                color="#8c8c8c"
                                                                customStyle={{ marginLeft: moderateScale(5) }}
                                                                text={item?.slottiming?.first_start_time}
                                                            />
                                                        </View>
                                                    )}

                                                    {item?.slottiming?.last_end_time && (
                                                        <View style={[globalStyle.row, { marginTop: moderateScale(0), marginBottom: moderateScale(5), marginLeft: moderateScale(10) }]}>
                                                            <CustomIcon color="#8c8c8c" type="Ionicons" name="time-outline" />
                                                            <CustomText
                                                                weight="500"
                                                                color="#8c8c8c"
                                                                customStyle={{ marginLeft: moderateScale(5) }}
                                                                text={item?.slottiming?.last_end_time}
                                                            />
                                                        </View>
                                                    )}

                                                </View>
                                            </View>
                                        </Pressable>
                                    )
                                }}
                            />
                        ) : (
                            <View>
                                <CustomText text="No Trainers Shown" weight='500' size={16} color={Colors.gray_font} />
                            </View>
                        )
                    }

                </View>

            </ScrollView>
        </View>
    );
};

export default StudioDetail;

const styles = StyleSheet.create({
    imageView: {
        alignSelf: 'center',
        // backgroundColor:"red",
        borderRadius: moderateScale(200),
        borderWidth: 2,
        padding: moderateScale(5),
        borderColor: Colors.orange,
        width: moderateScale(150),
        height: moderateScale(150),
        marginBottom: moderateScale(15),
    },
    timingContainer: {
        backgroundColor: Colors.orange_bg,
        flex: 1,
        // marginRight: moderateScale(5),
        flexDirection: 'row',
        padding: moderateScale(10),
        borderRadius: moderateScale(5),
        elevation: 5,
        shadowColor: Colors.text_orange
    },
    imageDesign: {
        width: screenWidth * 1.2,
        alignSelf: "center",
        zIndex: -1,
        backgroundColor: Colors.orange_bg,
        height: 400,
        position: "absolute",
        top: -280,
        borderRadius: moderateScale(300)
    },
    courseCard: {
        width: screenWidth * 0.6,
        borderWidth: 1,
        borderRadius: moderateScale(10),
        height: screenWidth * 0.5,
        padding: moderateScale(5),
        backgroundColor: "#fff",
        elevation: 5,
        marginBottom: moderateScale(2),
    }
});
