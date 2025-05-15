import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { moderateScale, screenWidth } from '@components/Matrix/Matrix'
import { globalStyle } from '@utils/GlobalStyle'
import ShimmerPlaceholder from 'react-native-shimmer-placeholder'
import LinearGradient from 'react-native-linear-gradient'
const OrderSkeleton = () => {
    return (
        <View style={[styles.container, globalStyle.flex]} >
            <ShimmerPlaceholder
                style={styles.img}
                LinearGradient={LinearGradient}
                shimmerColors={['#E1E9EE', '#F2F8FC', '#E1E9EE']}
                duration={2000}
            />
            <View style={styles.content} >

                <ShimmerPlaceholder
                    LinearGradient={LinearGradient}
                    shimmerColors={['#E1E9EE', '#F2F8FC', '#E1E9EE']}
                    duration={1500}
                    style={{ width: "95%", height: moderateScale(30) }}
                    shimmerStyle={{
                        borderRadius: moderateScale(3)
                    }}
                />

                <ShimmerPlaceholder
                    style={{ width: "95%", height: moderateScale(20) }}
                    LinearGradient={LinearGradient}
                    shimmerColors={['#E1E9EE', '#F2F8FC', '#E1E9EE']}
                    duration={1500}
                    shimmerStyle={{
                        borderRadius: moderateScale(3),
                        marginTop: moderateScale(5)
                    }}
                />
            </View>
        </View>
    )
}

export default OrderSkeleton

const styles = StyleSheet.create({
    container: {
        width: '95%',
        alignSelf: 'center',
        height: screenWidth * 0.4,
        borderRadius: moderateScale(10),
        elevation: 5,
        marginBottom: moderateScale(10),
        backgroundColor: '#fff',
        marginTop: moderateScale(5),
    },
    img: {
        flex: 0.6,
        height: '95%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f7f7f7',
        margin: moderateScale(5),
        alignSelf: 'center',
        borderRadius: moderateScale(10),
    },
    content: {
        flex: 1,
        paddingVertical: moderateScale(5),
        paddingTop: moderateScale(10),
    },
})