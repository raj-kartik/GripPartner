import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { moderateScale, screenHeight } from '@components/Matrix/Matrix'
import ShimmerPlaceholder from 'react-native-shimmer-placeholder'
import LinearGradient from 'react-native-linear-gradient'

const WalletSkeleton = () => {
    return (
        <View style={styles.transactionContainer} >

            <ShimmerPlaceholder
                LinearGradient={LinearGradient}
                shimmerStyle={{
                    borderRadius: moderateScale(5),
                }}
                style={styles.data}
            />

            <ShimmerPlaceholder
                LinearGradient={LinearGradient}
                shimmerStyle={{
                    borderRadius: moderateScale(5),
                    marginTop: moderateScale(5)
                }}
                style={styles.date}
            />
        </View>
    )
}

export default WalletSkeleton

const styles = StyleSheet.create({
    transactionContainer: {
        height: screenHeight * 0.12,
        borderRadius: moderateScale(8),
        padding: moderateScale(8),
        alignSelf: 'center',
        width: '98%',
        elevation: 5,
        marginBottom: moderateScale(10),
        marginTop: moderateScale(5),
        backgroundColor: "#f7f7f7"
    },

    data: {
        width: moderateScale(200),
        height: moderateScale(30)
    },

    date: {
        width: moderateScale(200),
        height: moderateScale(30)
    }
})