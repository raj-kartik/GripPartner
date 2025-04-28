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


const CustomBottomTabBar = ({ state, descriptors, navigation, colors }: any) => {
    // const navigation = useNavigation();
    // console.log("==== route in the navigation =====", state);
    return (
        <View style={styles.container}>
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
                            marginHorizontal: moderateScale(0),
                            backgroundColor: isFocused ? Colors.orange : null,
                            borderRadius: isFocused ? moderateScale(20) : null,
                            padding: moderateScale(5),
                            flex: isFocused ? 1 : 0.5,
                        }}>
                        {isFocused ? (
                            <>
                                {
                                    options?.type ? (
                                        <View>
                                            <CustomIcon type={options?.type} name={options?.icon} />
                                            {/* {
                                                options?.data === 0 && (
                                                    <CustomText text='1' />
                                                )
                                            } */}
                                        </View>
                                    ) : (
                                        <View>
                                            <options.Active
                                                width={moderateScale(21)}
                                                height={moderateScale(21)}
                                            // stroke="#000"
                                            />
                                        </View>
                                    )
                                }

                            </>
                        ) : (
                            <>
                                {
                                    options?.type ? (
                                        <CustomIcon type={options?.type} name={options?.icon} />
                                    ) : (
                                        <options.InActive
                                            width={moderateScale(21)}
                                            height={moderateScale(21)}
                                        />
                                    )
                                }

                            </>

                        )}
                        {isFocused && (
                            <CustomText
                                text={` ${label}`}
                                size={12}
                                weight="700"
                                customStyle={{
                                    fontFamily: 'Nexa-Heavy',
                                    color: '#000000',
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
