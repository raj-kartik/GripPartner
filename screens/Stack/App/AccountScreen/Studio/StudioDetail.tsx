import {
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
import { useFocusEffect } from '@react-navigation/native';

const StudioDetail = (props: any) => {
    const { item: studio } = props?.route?.params;

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
                        <Images.Coin
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
                        <CustomText text={studio.location} size={18} weight="500" />
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
                            <CustomText text="Opens at" weight="500" color={Colors.gray} />
                            <CustomText text={studio.closing_time.slice(0, 5)} weight="600" />
                        </View>
                    </View>
                </View>

                {/* courses */}
                <View style={{ marginTop: moderateScale(10), paddingHorizontal: moderateScale(10) }}>
                    <SubHeader title="Courses" isMore={true} />
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
    }
});
