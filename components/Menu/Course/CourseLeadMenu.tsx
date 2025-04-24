import {
    Alert,
    Keyboard,
    Linking,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import React, { useState } from 'react';
import {
    Menu,
    MenuProvider,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import { CommonActions, useNavigation } from '@react-navigation/native';
import CustomText from '../../Customs/CustomText';
import CustomIcon from '../../Customs/CustomIcon';
import { moderateScale, screenWidth, verticalScale } from '../../Matrix/Matrix';
import { globalStyle } from '../../../utils/GlobalStyle';
import CustomModal from '../../Customs/CustomModal';
import Colors from '../../../utils/Colors';

const CourseLeadMenu = ({ courseId, CloseFun, OpenFun, item }: any) => {
    const navigation = useNavigation();
    const [isModalVisible, setModalVisible] = useState(false);
    const courseMenuOptions = [
        {
            id: 1,
            label: 'Change Lead Status',
            handleFunction: () => {
                setModalVisible(!isModalVisible);
            },
        },
        {
            id: 2,
            label: 'Close',
            handleFunction: () => {
                CloseFun();
            },
        },
    ];

    const callPhoneNumber = (phoneNumber: any) => {
        const url = `tel:${phoneNumber}`;
        Linking.canOpenURL(url)
            .then(supported => {
                if (supported) {
                    return Linking.openURL(url);
                } else {
                    Alert.alert('Error', 'Phone call not supported on this device');
                }
            })
            .catch(err => console.error('An error occurred', err));
    };

    return (
        <View style={[globalStyle.between, styles.container]}>
            <View style={[globalStyle.flex]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <CustomIcon type="AntDesign" name="arrowleft" size={25} />
                </TouchableOpacity>
                <CustomText
                    customStyle={{ marginLeft: moderateScale(5) }}
                    text="Lead Details"
                    size={22}
                    weight="700"
                />
            </View>

            <View style={[globalStyle.row]} >
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        callPhoneNumber(item?.phone_no);
                    }}
                    style={[
                        { marginRight: moderateScale(15) },
                    ]}>
                    <CustomIcon type="AntDesign" name="phone" size={25} />
                </TouchableOpacity>
                <Menu >
                    <MenuTrigger>
                        <CustomIcon type="Entypo" name="dots-three-vertical" size={25} />
                    </MenuTrigger>
                    <MenuOptions
                        customStyles={{
                            optionsContainer: styles.optionsContainer,
                        }}>
                        {courseMenuOptions.map((item: any) => (
                            <MenuOption
                                key={item.id}
                                onSelect={() => {
                                    item?.handleFunction();
                                }}
                                customStyles={{
                                    optionWrapper: styles.optionWrapper,
                                    optionText: styles.optionText,
                                }}>
                                <TouchableOpacity onPress={() => {
                                    item?.handleFunction();
                                }} >
                                    <Text>{item.label}</Text>
                                </TouchableOpacity>
                            </MenuOption>
                        ))}

                        <CustomModal
                            visible={isModalVisible}
                            iscenter={true}
                            onDismiss={() => {
                                setModalVisible(false);
                            }}>
                            <View style={{ width: "30%", height: moderateScale(3), borderRadius: moderateScale(30), marginVertical: moderateScale(5), backgroundColor: Colors.gray, alignSelf: 'center' }} />

                            <CustomText text='Change Lead Status' weight='600' size={16} customStyle={{ textAlign: "center" }} />
                            <View style={{ marginTop: moderateScale(15) }}>
                                <TouchableOpacity style={styles.rowIcon1} onPress={() => {
                                    setModalVisible(false);
                                    OpenFun()
                                }}>
                                    <CustomIcon type='Feather' name='check' color={Colors.activeRadio} />
                                    <CustomText text='Open' />
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.rowIcon1} onPress={() => {
                                    setModalVisible(false);
                                    CloseFun()
                                }}>
                                    <CustomIcon type='Feather' name='x' color={Colors.red} />
                                    <CustomText text='Close' />
                                </TouchableOpacity>
                            </View>
                        </CustomModal>
                    </MenuOptions>
                </Menu>
            </View>
        </View>
    );
};

export default CourseLeadMenu;

const styles = StyleSheet.create({
    modalContainer: {
        width: screenWidth * 0.9,
        // height: responsiveHeight(18),
        backgroundColor: 'white',
        justifyContent: 'center',
        borderRadius: moderateScale(10),
        padding: moderateScale(10),
        paddingBottom: 0,
    },
    rowIcon: {},
    menuText1: {
        color: Colors.black,
        fontFamily: 'Roboto-Medium',
        fontSize: 15,
        marginVertical: moderateScale(10),
    },
    rowIcon1: {
        flexDirection: 'row',
        gap: moderateScale(10),
        // marginBottom:10,
        alignItems: 'center',
        marginBottom: moderateScale(20),
    },
    menuText: {
        color: Colors.black,
        fontFamily: 'Roboto-Medium',
        fontSize: 14,
    },
    container: {
        width: screenWidth,
        alignSelf: 'center',
        // backgroundColor: 'rgba(118, 40, 40, 0.9)',
        paddingLeft: moderateScale(15),
        paddingRight: moderateScale(20),
        paddingVertical: moderateScale(10),
    },
    optionsContainer: {
        padding: moderateScale(10),
        borderRadius: moderateScale(10),
        backgroundColor: '#f7f7f7',
        elevation: 5,
        width: moderateScale(180),
        marginTop: moderateScale(10),
    },
    optionWrapper: {
        paddingVertical: moderateScale(10),
        paddingHorizontal: moderateScale(15),
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});
