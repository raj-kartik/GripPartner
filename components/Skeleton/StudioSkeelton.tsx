import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { moderateScale } from '@components/Matrix/Matrix'
import ShimmerPlaceholder from 'react-native-shimmer-placeholder'
import LinearGradient from 'react-native-linear-gradient'

const StudioSkeelton = () => {
    return (
        <View style={styles.studioCard} >

            <ShimmerPlaceholder
                style={styles.data}
                LinearGradient={LinearGradient}
                shimmerStyle={{
                    borderRadius: moderateScale(5)
                }}
                shimmerColors={['#E1E9EE', '#F2F8FC', '#E1E9EE']}
                duration={1500}
            />

            <ShimmerPlaceholder
                style={styles.location}
                LinearGradient={LinearGradient}
                shimmerStyle={{
                    borderRadius: moderateScale(5),
                    marginTop: moderateScale(5)
                }}
                shimmerColors={['#E1E9EE', '#F2F8FC', '#E1E9EE']}
                duration={1500}
            />
        </View>
    )
}

export default StudioSkeelton

const styles = StyleSheet.create({
    studioCard: {
        // marginHorizontal:moderateScale(10),
        padding: moderateScale(10),
        borderRadius: moderateScale(10),
        backgroundColor: '#f7f7f7',
        marginBottom: moderateScale(5),
        marginTop: moderateScale(3),
        height: moderateScale(130),
        elevation: 2,
        marginHorizontal: moderateScale(5),
        overflow: "hidden"
        // alignSelf:'center',
    },


    location: {
        width: moderateScale(200),
        height: moderateScale(35)
    },

    data: {
        width: moderateScale(200),
        height: moderateScale(35)
    }
})