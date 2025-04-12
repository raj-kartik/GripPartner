import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import CustomIcon from '../../components/Customs/CustomIcon';
import { moderateScale } from '../../components/Matrix/Matrix';
import Colors from '../../utils/Colors';
import CustomText from '../../components/Customs/CustomText';

const CustomDrawer = ({ state, descriptors, navigation, colors }: any) => {
    // console.log("==== state in drawer ====", state);
    // console.log("==== descriptors in drawer ====", descriptors);
    // console.log("==== route in drawer ====",);

    return (
        <View style={[styles.container]}>
            {state.routes.map((route: any, index: any) => {


                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
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

                // console.log("==== options in the bottom ====",options.type);


                return (
                    <TouchableOpacity
                        key={index}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={
                            label === 'Connect'
                                ? () => {
                                    navigation.navigate('BottomTabs');
                                }
                                : onPress
                        }
                        onLongPress={onLongPress}
                        style={{
                            ...styles.tabItem,
                            backgroundColor: isFocused ? Colors.orange : null,
                            borderRadius: isFocused ? moderateScale(10) : null,
                            padding: moderateScale(5),
                        }}>
                        {isFocused ? (
                            <>
                                {
                                    options?.type ? (
                                        <CustomIcon type={options?.type} name={options?.icon} />
                                    ) : (
                                        <options.Active
                                            width={moderateScale(21)}
                                            height={moderateScale(21)}
                                        // stroke="#000"
                                        />
                                    )
                                }

                            </>
                        ) : (
                            <>
                                {
                                    options?.type ? (
                                        <CustomIcon type={options?.type} color={Colors.gray_font} name={options?.icon} />
                                    ) : (
                                        <options.InActive
                                            width={moderateScale(21)}
                                            height={moderateScale(21)}
                                        />
                                    )
                                }

                            </>

                        )}
                        <CustomText
                            text={` ${label}`}
                            size={14}
                            weight="700"
                            color={isFocused ? "#000000" : Colors.gray_font}
                        />
                    </TouchableOpacity>
                );
            })}
        </View>
    )
}

export default CustomDrawer

const styles = StyleSheet.create({
    container: {
        height: moderateScale(100),
        width: "90%",
        alignSelf: "center",
        marginTop: moderateScale(10),
        borderRadius: moderateScale(10),
        // flex: 1
    },
    tabItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: moderateScale(5),
        height: moderateScale(50)
    }
})