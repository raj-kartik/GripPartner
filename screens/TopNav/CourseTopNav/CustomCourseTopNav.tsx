import {
    Animated,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import React from 'react'
import { moderateScale, screenHeight, screenWidth } from '../../../components/Matrix/Matrix';
import CustomHeader2 from '../../../components/Customs/Header/CustomHeader2';
import Colors from '../../../utils/Colors';
import { globalStyle } from '../../../utils/GlobalStyle';

const CustomCourseTopNav = ({ state, descriptors, navigation, position }: any) => {
    return (
        <>
            <CustomHeader2 title="" />

            <View
                style={{
                    flexDirection: 'row',
                    backgroundColor: Colors.white,
                    marginVertical: moderateScale(10),
                    marginHorizontal: moderateScale(5),
                    borderRadius: moderateScale(30),
                    paddingHorizontal: moderateScale(5),
                    elevation: 5,
                }}>
                {state.routes.map((route:any, index:number) => {
                    const { options } = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : route.name;

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name, route.params);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };

                    const inputRange = state.routes.map((_:any, i:any) => i);
                    const opacity = position.interpolate({
                        inputRange,
                        outputRange: inputRange.map((i:any) => (i === index ? 1 : 0)),
                    });

                    return (
                        <TouchableOpacity
                            key={index} // <-- Add unique key prop here
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarTestID}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={[
                                styles.row,
                                globalStyle.center,
                                isFocused && styles.activeTab,
                                {
                                    borderRadius: moderateScale(20),
                                    height: moderateScale(50),
                                    paddingHorizontal: 0,
                                    // backgroundColor: 'red',
                                    flex: label === 'Subscription' ? 1.1 : 1,
                                },
                            ]}>
                            <Animated.Text
                                style={[styles.label, isFocused && styles.activeLabel]}>
                                {label}
                            </Animated.Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </>
    )
}

export default CustomCourseTopNav

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5F5F5',

        alignSelf: 'center',
    },

    row0: {
        width: screenWidth * .9,
        alignSelf: 'center',
        paddingVertical: 5,
        opacity: 9989,
        backgroundColor: '#F5F5F5',

        flexDirection: 'row',
        marginBottom: 5,
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    logoImage: {
        width: screenWidth * .1,
        height: screenHeight * .05,
    },

    row: {
        backgroundColor: 'white',
        // opacity: 0.88,
        // height: responsiveHeight(7),
        alignItems: 'center',
        textAlign: 'center',
        justifyContent: 'center',
        marginBottom: 0,
        color: 'black',
        flex: 1,
    },
    activeTab: {
        // width: responsiveWidth(25), // Adjust the width as needed

        justifyContent: 'center',
        backgroundColor: 'white', // Change the background color of the active tab
    },

    label: {
        color: 'black',
        fontSize: 14,
        // fontWeight:"900"
    },
    activeLabel: {
        fontWeight: '700', // Bold style for active label
        textDecorationLine: 'underline',
    },
});