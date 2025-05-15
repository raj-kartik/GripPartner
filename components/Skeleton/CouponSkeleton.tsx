import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { moderateScale, screenHeight } from '@components/Matrix/Matrix'
import ShimmerPlaceholder from 'react-native-shimmer-placeholder'
import LinearGradient from 'react-native-linear-gradient'

const CouponSkeleton = () => {
    return (
        <View style={styles.container} >

            <ShimmerPlaceholder
                style={styles.coupon}
                LinearGradient={LinearGradient}
                duration={1500}
                shimmerStyle={{ borderRadius: moderateScale(5) }}
            />

            <ShimmerPlaceholder
                style={styles.active}
                LinearGradient={LinearGradient}
                duration={1500}
                shimmerStyle={{ borderRadius: moderateScale(5) }}
            />

            <ShimmerPlaceholder
                style={styles.downType}
                LinearGradient={LinearGradient}
                duration={1500}
                shimmerStyle={{ borderRadius: moderateScale(5) }}
            />
        </View>
    )
}

export default CouponSkeleton

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

    coupon: {
        width: moderateScale(150),
        height: moderateScale(50),
        position: "absolute",
        top: moderateScale(10),
        left: moderateScale(10)
    },

    active: {
        width: moderateScale(100),
        height: moderateScale(30),
        position: "absolute",
        bottom: moderateScale(10),
        right: moderateScale(10)
    },

    downType: {
        width: moderateScale(120),
        height: moderateScale(30),
        position: "absolute",
        top: moderateScale(10),
        right: moderateScale(10)
    },
})