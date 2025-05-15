import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomIcon from '../../Customs/CustomIcon'
import CustomText from '../../Customs/CustomText'
import { moderateScale, screenHeight } from '../../Matrix/Matrix'
import { globalStyle } from '../../../utils/GlobalStyle'
import Colors from '../../../utils/Colors'
import moment from 'moment'
import { CommonActions, useNavigation } from '@react-navigation/native'

const ProfileCourseCard = ({ item }: any) => {

    const navigation = useNavigation();

    const sendId = (item: any) => {
        navigation.dispatch(
            CommonActions.navigate({
                name: 'TrainerCourseDetails',
                params: {
                    course_id: item.id,
                },
            }),
        );
    };
    return (
        <Pressable style={[styles.card]} key={item.id} onPress={() => sendId(item)}>
            {/* over view */}
            <View style={{ flex: 0.4 }}>
                <Image source={{ uri: item.select_image }} style={styles.image} />
                <View style={[globalStyle.row, {
                    position: "absolute",
                    bottom: moderateScale(5),
                    right: moderateScale(10),
                    backgroundColor: "#fff",
                    alignSelf: "center",
                    alignItems: "center",
                    padding: moderateScale(3),
                    borderRadius: moderateScale(5),
                    elevation: 3
                }]} >
                    <CustomIcon type='AntDesign' name='star' color={Colors.orange} />
                    <CustomText text={parseFloat(item?.fullstar).toFixed(1)} color='#000' weight='500' />
                    <CustomText
                        text={`(${parseFloat(item?.totalreview).toFixed(0)})`}
                        weight="700"
                        customStyle={{ marginLeft: moderateScale(3) }}
                    />
                </View>
            </View>

            <View style={[globalStyle.center, {
                width: "30%", backgroundColor: item?.status !== 'Active' ? "red" : Colors.success, padding: moderateScale(3),
                borderRadius: moderateScale(5),
                position: "absolute",
                top: moderateScale(10),
                right: moderateScale(10),
                flexDirection: "row",
                alignItems: "center"
            }]} >
                <CustomIcon type='Feather' name={item?.status === 'Active' ? 'check-circle' : 'x-circle'} color='#fff' />
                <CustomText customStyle={{ marginLeft: moderateScale(5) }} text={item?.status === 'Active' ? "Active" : "In-Active"} weight='500' color="white" />
            </View>

            <View style={{ flex: 0.6 }}>
                <View style={{ marginTop: moderateScale(5) }}>
                    <CustomText text={item?.name} size={20} weight="700" customStyle={{ marginBottom: moderateScale(1) }} />
                    <CustomText text={item?.studio_name || "No Studio Joined"} color={Colors.gray_font} weight="500" />
                </View>

                {item["slot and time"] ? (
                    <View style={[globalStyle.row, { marginTop: moderateScale(5) }]} >
                        <CustomIcon type='Ionicons' name='time-outline' customStyle={{ marginRight: moderateScale(3) }} />
                        <CustomText weight='500' text={`Starts from ${moment(item["slot and time"]?.first_start_time, "HH:mm").format("hh:mm A")} ownwards `} />
                    </View>
                ) : null}

                {/* {item["slot and time"] ? (
            <View style={[globalStyle.row]} >
              <CustomText weight='500' text={`Till ${moment(item["slot and time"]?.last_end_time, "HH:mm").format("hh:mm A")} ownwards `} />
            </View>
          ) : null} */}

                {
                    item?.price && (
                        <View style={[globalStyle.row, { marginTop: moderateScale(5) }]} >
                            <CustomIcon type='MaterialIcons' name='currency-rupee' customStyle={{ marginRight: moderateScale(3) }} />
                            <CustomText weight='500' text={item?.price || "0"} />
                        </View>
                    )
                }

                <View style={styles.itemRow}>
                    <View style={styles.rowColumn}>
                        <CustomIcon type="MaterialIcons" name="group" />
                        <CustomText
                            size={12}
                            text={`${item?.lead < 1 ? 'No' : item?.lead} ${item?.lead <= 1 ? 'Lead' : 'Leads'
                                }`}
                            weight="500"
                            color={`${item?.lead < 1 ? Colors.gray_font : '#000'}`}
                        />
                    </View>

                    <View style={styles.rowColumn}>
                        <CustomIcon
                            type="MaterialCommunityIcons"
                            name="account-arrow-left-outline"
                        />
                        <CustomText
                            size={12}
                            text={`${item?.suscription < 1 ? 'No' : item?.suscription} ${item?.suscription <= 1 ? 'Subscription' : 'Subscriptions'
                                }`}
                            weight="500"
                            color={`${item?.suscription < 1 ? Colors.gray_font : '#000'}`}
                        />
                    </View>

                    <View style={styles.rowColumn}>
                        <CustomIcon type="AntDesign" name="flag" />
                        <CustomText
                            size={12}
                            text={`${item?.impression < 1 ? 'No' : item?.impression} ${item?.impression <= 1 ? 'Impression' : 'Impressions'
                                }`}
                            weight="500"
                            color={`${item?.impression < 1 ? Colors.gray_font : '#000'}`}
                        />
                    </View>

                    <View style={styles.rowColumn}>
                        <CustomIcon type="MaterialIcons" name="touch-app" />
                        <CustomText
                            size={12}
                            text={`${item?.clicks < 1 ? 'No' : item?.clicks} ${item?.clicks <= 1 ? 'Click' : 'Clicks'
                                }`}
                            weight="500"
                            color={`${item?.clicks < 1 ? Colors.gray_font : '#000'}`}
                        />
                    </View>
                </View>
            </View>
        </Pressable>
    )
}

export default ProfileCourseCard

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        padding: moderateScale(10),
        borderRadius: moderateScale(10),
        marginTop: moderateScale(5),
        alignSelf: 'center',
        elevation: 5,
        width: '98%',
        height: screenHeight * 0.4,
        marginBottom: moderateScale(10),
    },
    image: {
        width: '100%',
        height: '100%',
        // resizeMode: 'contain',
        marginBottom: 5,
        borderRadius: 10,
        alignItems: 'center',
        alignSelf: 'center',
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    rowColumn: {
        flexDirection: 'column',
        alignItems: 'center',
    },
})