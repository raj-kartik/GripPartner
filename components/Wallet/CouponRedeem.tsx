import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { moderateScale } from '../Matrix/Matrix'
import CustomText from '../Customs/CustomText'
import CustomButton from '../Customs/CustomButton'
import Colors from '../../utils/Colors'
import { globalStyle } from '../../utils/GlobalStyle'
const CouponRedeem = ({ handleApplyCoupon, isApplied, handleRemoveCoupon }: any) => {
    const [couponCode, setCouponCode] = useState("");
    return (
        <View style={styles.container} >
            <CustomText text='Apply Coupon' size={16} weight='600' />
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }} >
                <TextInput autoCapitalize='characters' onChangeText={(text) => setCouponCode(text)} placeholder='Enter Coupon Code' style={styles.input} />
                <TouchableOpacity style={[styles.applyBtn, globalStyle.center, { backgroundColor: isApplied ? "#ff0000" : "black" }]} onPress={() => {

                    if (couponCode.length === 0) {
                        return;
                    }

                    if (isApplied) {
                        handleRemoveCoupon(couponCode);
                        return;
                    }
                    handleApplyCoupon(couponCode);
                }} >
                    <CustomText text={isApplied ? 'Remove' : 'Apply'} size={16} color="#fff" weight='600' customStyle={{ textAlign: "center" }} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default CouponRedeem
const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignSelf: "center",
        marginVertical: moderateScale(10)
        // padding: moderateScale(5)
    },
    input: {
        width: "100%",
        borderWidth: 1.5,
        borderColor: Colors.gray_font,
        borderRadius: moderateScale(5),
        padding: moderateScale(5),
        marginVertical: moderateScale(5),
        flex: .7,
        marginRight: moderateScale(5),
        color: "#000",
        height: moderateScale(40)
    },
    applyBtn: {
        backgroundColor: "#000",
        flex: .3,
        alignSelf: 'center',
        padding: moderateScale(10),
        borderRadius: moderateScale(5)
    }
})