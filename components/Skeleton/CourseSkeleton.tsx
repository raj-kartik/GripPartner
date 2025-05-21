import { StyleSheet, View } from 'react-native';
import React from 'react';
import { moderateScale, screenHeight, screenWidth } from '@components/Matrix/Matrix';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';

const CourseSkeleton = () => {
    return (
        <View style={styles.card}>
            <ShimmerPlaceholder
                LinearGradient={LinearGradient}
                shimmerColors={['#E1E9EE', '#F2F8FC', '#E1E9EE']}
                duration={1500}
                style={styles.shimmerBlockTop}
                shimmerStyle={{ borderRadius: 10 }}
            />
            <ShimmerPlaceholder
                LinearGradient={LinearGradient}
                style={styles.shimmerBlockBottom}
                shimmerStyle={{ borderRadius: 10 }}
                shimmerColors={['#E1E9EE', '#F2F8FC', '#E1E9EE']}
                duration={2000}
            />
        </View>
    );
};

export default CourseSkeleton;

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        padding: moderateScale(10),
        borderRadius: moderateScale(10),
        marginTop: moderateScale(5),
        alignSelf: 'center',
        elevation: 5,
        width: screenWidth * .9,
        height: screenHeight * 0.35,
        marginBottom: moderateScale(10),
        justifyContent: 'space-between'
    },
    shimmerBlockTop: {
        width: '100%',
        height: '40%',
        marginBottom: 5,
        borderRadius: 10,
    },
    shimmerBlockBottom: {
        width: '100%',
        height: '55%',
        borderRadius: 10,
    },
});
