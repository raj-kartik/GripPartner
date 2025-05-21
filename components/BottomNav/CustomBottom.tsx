import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Image } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';

// import CustomText from '../components/Customs/CustomText';
// import {moderateScale} from '../components/Matrix/Matrix';
// import Theme from '../utils/Theme';
import CustomIcon from '../Customs/CustomIcon';
import { moderateScale } from '../Matrix/Matrix';
import Colors from '../../utils/Colors';
import CustomText from '../Customs/CustomText';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from 'react-native-reanimated';


const CustomBottomTabBar = ({ state, descriptors, navigation, colors }: any) => {
    const scaleValues = React.useRef(
        state.routes.map((_, index) =>
            useSharedValue(state.index === index ? 1 : 1)
        )
    ).current;

    return (
        <View style={styles.container}>
            {state.routes.map((route: any, index: number) => {
                const { options } = descriptors[route.key];
                const label = options.tabBarLabel ?? options.title ?? route.name;
                const isFocused = state.index === index;

                // Animate when isFocused changes
                React.useEffect(() => {
                    scaleValues[index].value = withTiming(isFocused ? 1.2 : 1, {
                        duration: 500,
                    });
                }, [isFocused]);

                const animatedStyle = useAnimatedStyle(() => ({
                    transform: [{ scale: scaleValues[index].value }],
                }));

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
                    navigation.emit({ type: 'tabLongPress', target: route.key });
                };

                return (
                    <TouchableOpacity
                        key={index}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={
                            label === 'Connect'
                                ? () => navigation.navigate('BottomTabs')
                                : onPress
                        }
                        onLongPress={onLongPress}
                        style={{
                            ...styles.tabItem,
                            marginHorizontal: moderateScale(0),
                            backgroundColor: isFocused ? colors?.orange : null,
                            borderRadius: isFocused ? moderateScale(20) : null,
                            padding: moderateScale(5),
                            flex: isFocused ? 1 : 0.5,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Animated.View style={animatedStyle}>
                            {options?.type ? (
                                <CustomIcon type={options?.type} name={options?.icon} />
                            ) : isFocused ? (
                                <options.Active width={21} height={21} />
                            ) : (
                                <options.InActive width={21} height={21} />
                            )}
                        </Animated.View>

                        {isFocused && (
                            <CustomText
                                text={` ${label}`}
                                size={12}
                                weight="700"

                                customStyle={{
                                    fontFamily: 'Nexa-Heavy',
                                    color: '#000000',
                                    marginLeft: moderateScale(3)
                                }}
                            />
                        )}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: moderateScale(60),
        backgroundColor: '#fff',
        paddingHorizontal: moderateScale(10),
        paddingVertical: moderateScale(10),
        elevation: 5,
        borderTopWidth: 1,
        borderColor: Colors.orange,
        width: "95%",
        alignSelf: "center",
        borderRadius: moderateScale(30),
        position: "absolute",
        bottom: moderateScale(20)
    },
    tabItem: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
});

export default CustomBottomTabBar;
