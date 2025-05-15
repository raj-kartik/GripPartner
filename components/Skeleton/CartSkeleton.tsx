import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { moderateScale, screenWidth } from '@components/Matrix/Matrix'
import { globalStyle } from '@utils/GlobalStyle'
import ShimmerPlaceholder from 'react-native-shimmer-placeholder'
import LinearGradient from 'react-native-linear-gradient'

const CartSkeleton = () => {
    return (
        <View style={[globalStyle.flex, styles.cartContainer]} >
            <ShimmerPlaceholder
                style={styles.img}
                LinearGradient={LinearGradient}
                shimmerColors={['#E1E9EE', '#F2F8FC', '#E1E9EE']}
                duration={1500}
            />
            <View style={{ flex: .7, marginLeft: moderateScale(10) }} >

                <ShimmerPlaceholder
                    style={styles.content}
                    shimmerStyle={{ borderRadius: moderateScale(5) }}
                    LinearGradient={LinearGradient}
                    shimmerColors={['#E1E9EE', '#F2F8FC', '#E1E9EE']}
                    duration={1500}
                />

                <ShimmerPlaceholder
                    style={styles.content}
                    shimmerStyle={{ marginTop: moderateScale(5), borderRadius: moderateScale(5) }}
                    LinearGradient={LinearGradient}
                    shimmerColors={['#E1E9EE', '#F2F8FC', '#E1E9EE']}
                    duration={1500}
                />

            </View>
        </View>
    )
}

export default CartSkeleton

const styles = StyleSheet.create({
    cartContainer: {
        width: screenWidth * 0.89,
        backgroundColor: 'white',
        borderRadius: 10,
        height: moderateScale(120),
        // justifyContent: 'space-between',
        alignItems: 'flex-start',
        elevation: 3,
        opacity: 85,
        alignSelf: 'center',
        margin: moderateScale(5),
        padding: 10,
        borderWidth: 0.4,
        // flexDirection: 'row',
    },
    img: {
        flex: .3,
        height: "100%",
        alignSelf: 'center',
        borderRadius: moderateScale(5)
    },
    content: {
        width: "100%",
        height: moderateScale(25)
    }
})