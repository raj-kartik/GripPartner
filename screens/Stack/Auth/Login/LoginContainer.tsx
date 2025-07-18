import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import CustomInput from '../../../../components/Customs/CustomInput';
import CustomButton from '../../../../components/Customs/CustomButton';
import { moderateScale, screenWidth } from '../../../../components/Matrix/Matrix';
import Colors from '../../../../utils/Colors';
import LinearGradient from 'react-native-linear-gradient';
import CustomText from '../../../../components/Customs/CustomText';
import { globalStyle } from '../../../../utils/GlobalStyle';

const LoginContainer = ({ mobile, setMobile, handleLogin, loading }: any) => {
    const navigation: any = useNavigation();
    return (
        <LinearGradient
            colors={['transparent', 'transparent', 'transparent', '#333333', '#000000']}
            style={styles.container}>
            <CustomText
                color="#fff"
                text="Log in"
                weight="700"
                size={22}
                customStyle={{ textAlign: 'center' }}
            />
            <TextInput
                maxLength={10}
                style={styles.input}
                keyboardType="numeric"
                placeholderTextColor={Colors.gray_font}
                placeholder="10-digit mobile number"
                onChangeText={(text: string) => {
                    setMobile(text);
                }}
            />
            <View>
                <CustomButton
                    disabled={mobile.length !== 10 && loading}
                    loading={loading}
                    bg={mobile.length !== 10 ? Colors.gray_font : '#666666'}
                    textColor={mobile.length !== 10 ? '#fff' : '#ffffff'}
                    radius={10}
                    customStyle={{ marginTop: moderateScale(10) }}
                    onPress={handleLogin}
                    title="Continue"
                />
                <Pressable onPress={() => {
                    navigation.navigate('SignUp')
                }} style={[globalStyle.row, { alignSelf: 'center', marginTop: moderateScale(10) }]} >
                    <CustomText text='Do not have Account?' color='#666' size={16} />
                    <CustomText text='Sign Up' color='#fff' size={16} customStyle={{ marginLeft: moderateScale(5) }} />
                </Pressable>
            </View>

            <View style={styles.temrs}>
                <CustomText customStyle={{ textAlign: "center" }} size={18} weight='600' text="By continuing, You agree our" color="#fff" />
                <View style={[styles.policy]}>

                    <Pressable onPress={() => { navigation.navigate('Terms') }} style={globalStyle.center} >
                        <CustomText customStyle={{ textDecorationStyle: "dashed", textDecorationColor: "#fff", textDecorationLine: "underline" }} text="Terms of Services" color="#fff" />
                    </Pressable>

                    <Pressable onPress={() => { navigation.navigate('Policy') }} style={globalStyle.center} >
                        <CustomText customStyle={{ textDecorationStyle: "dashed", textDecorationColor: "#fff", textDecorationLine: "underline" }} text="Privacy Policy" color="#fff" />
                    </Pressable>
                </View>
            </View>
        </LinearGradient>
    );
};

export default LoginContainer;

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: Colors.gray_font,
        backgroundColor: '#fff',
        padding: moderateScale(10),
        height: moderateScale(50),
        marginTop: moderateScale(10),
        borderRadius: moderateScale(10),
        fontSize: 16,
        color: '#000',
        width: '100%',
    },
    container: {
        width: screenWidth,
        paddingHorizontal: moderateScale(10),
        paddingTop: moderateScale(25),
        justifyContent: "flex-end",
        paddingBottom: moderateScale(30),
        flex: 1
    },
    temrs: {
        width: screenWidth,
        marginTop: moderateScale(10)
    },
    policy: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginTop: moderateScale(5)
    }
});