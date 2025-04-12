import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { moderateScale, screenHeight } from '../Matrix/Matrix';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import CustomText from '../Customs/CustomText';
import CustomIcon from '../Customs/CustomIcon';
import { globalStyle } from '../../utils/GlobalStyle';
import Colors from '../../utils/Colors';

const CouponCard = ({ item, handlePress }: any) => {
    // console.log("=== item in the trainer coupon ===", item);

    // const [isActiveModal, setIsActiveModal] = useState<boolean>(false)
    const primaryColor = item?.status === 'Inactive' ? "#fec4c4" : "#ebfdde";
    const secondaryColor = item?.status === 'Inactive' ? "#fe8a8a" : "#6fde1c";
    const tertiaryColor = item?.status === 'Inactive' ? "#ff1515" : "#2a6200";

    return (
        <LinearGradient colors={['#fceed4', "#f7d699", "#fab332"]} style={styles.container} >
            <Pressable onPress={handlePress} style={styles.contentContainer} >
                <View style={[styles.statusContainer, globalStyle.row]} >
                    <CustomText weight='500' color='#fff' customStyle={{ marginLeft: moderateScale(5) }} text={item?.status === 'Inactive' ? "In-Active" : "Active"} />
                </View>
                <View style={{ position: "absolute", bottom: moderateScale(10), right: moderateScale(10), alignItems: "center" }} >
                    <CustomText weight='500' color={"#000"} text='Valid Till Date' />
                    <CustomText weight='500' size={15} text={moment(item?.end_date).format("MMM Do YYYY")} />
                </View>

                <View style={styles.couponContainer} >
                    <View style={{ flex: 1, width: "100%", backgroundColor: "#fff", borderTopLeftRadius: moderateScale(5), borderTopRightRadius: moderateScale(5), alignItems: "center", paddingTop: moderateScale(2) }} >
                        <CustomText color="#000" text={item?.code} size={24} weight='700' />
                    </View>
                    {
                        item?.discount_type === "percentage" ? (
                            <View style={[globalStyle.row, styles.valueContainer]} >
                                <CustomText weight='600' size={18} text={item?.discount_value} />
                                <CustomIcon customStyle={{ marginLeft: moderateScale(2) }} type='MaterialCommunityIcons' name='brightness-percent' />
                            </View>
                        ) : (
                            <View style={[globalStyle.row, styles.valueContainer]} >
                                <CustomIcon customStyle={{ marginLeft: moderateScale(2) }} type='MaterialIcons' name='currency-rupee' />
                                <CustomText weight='600' size={18} text={item?.discount_value} />
                            </View>
                        )
                    }
                    <CustomText size={18} weight='500' customStyle={{ marginTop: moderateScale(2) }} text={item?.type === "ECOM" ? "E-Commerce" : item?.type === "COURSE" ? "Course" : item?.type === "STORE" ? "In-Store" : item?.type === "RETREAT" ? "Retreat" : ""} />
                </View>
            </Pressable>
        </LinearGradient>
    )
}

export default CouponCard

const styles = StyleSheet.create({
    container: {
        width: "98%",
        alignSelf: "center",
        height: screenHeight * .2,
        elevation: 5,
        backgroundColor: "#fff",
        borderRadius: moderateScale(10),
        // borderWidth: 1,
        marginBottom: moderateScale(10),
        marginTop: moderateScale(5),
    },
    contentContainer: {
        padding: moderateScale(10),
        flex: 1
    },
    statusContainer: {
        width: "35%",
        paddingHorizontal: moderateScale(20),
        paddingVertical: moderateScale(5),
        borderRadius: moderateScale(30),
        backgroundColor: Colors.orange,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: moderateScale(10),
        right: moderateScale(10)
    },
    couponContainer: {
        width: "40%",
        // padding: moderateScale(10),
        // backgroundColor: "#fff",
        borderRadius: moderateScale(5),
        alignItems: "center",
        height: "60%"
    },
    valueContainer: {
        flex: 1,
        backgroundColor: Colors.orange,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        borderBottomLeftRadius: moderateScale(5),
        borderBottomRightRadius: moderateScale(5),
    }
})