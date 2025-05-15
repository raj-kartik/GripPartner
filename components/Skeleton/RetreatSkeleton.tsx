import { StyleSheet, View } from 'react-native';
import React from 'react';
import { moderateScale, screenHeight, screenWidth } from '@components/Matrix/Matrix';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';

const RetreatSkeleton = () => {
    return (
        <View style={styles.container}>
            <ShimmerPlaceholder
                LinearGradient={LinearGradient}
                style={styles.shimmerBlockTop}
                shimmerStyle={{ borderRadius: 10 }}
                shimmerColors={['#E1E9EE', '#F2F8FC', '#E1E9EE']}
                duration={1500}
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

export default RetreatSkeleton

const styles = StyleSheet.create({
    container: {
        width: screenWidth * 0.75,
        height: screenWidth * 0.9,
        backgroundColor: 'white',
        marginRight: moderateScale(15),
        borderRadius: moderateScale(10),
        elevation: 5,
        marginBottom: moderateScale(15),
        marginVertical: moderateScale(3),
        marginLeft: moderateScale(5),
      },
    shimmerBlockTop: {
        width: '100%',
        height: '70%',
        marginBottom: 5,
        borderRadius: 10,
    },
    shimmerBlockBottom: {
        width: '100%',
        height: '30%',
        borderRadius: 10,
    },
});
