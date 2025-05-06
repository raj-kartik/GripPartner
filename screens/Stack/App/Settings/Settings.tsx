import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import Container from '../../../../components/Container'
import CustomHeader2 from '../../../../components/Customs/Header/CustomHeader2'
import { useDispatch, useSelector } from 'react-redux'
import Images from '../../../../utils/Images'
import { moderateScale, screenHeight, screenWidth } from '../../../../components/Matrix/Matrix'
import { globalStyle } from '../../../../utils/GlobalStyle'
import CustomText from '../../../../components/Customs/CustomText'
import Colors from '../../../../utils/Colors'
import CustomIcon from '../../../../components/Customs/CustomIcon'
import { useNavigation } from '@react-navigation/native'
import CustomButton from '../../../../components/Customs/CustomButton'
import CustomModal from '../../../../components/Customs/CustomModal'
import { logout } from '../../../../redux/Slice/UserSlice/UserSlice'

const Settings = () => {

    const dispatch = useDispatch();
    const { user } = useSelector((state: any) => state?.user);
    const navigation = useNavigation();
    const [isLogout, setIsLogout] = useState(false);

    const settingArray = [
        {
            id: 1,
            label: 'Edit Profile',
            route: "UpdateProfile"
        },
        {
            id: 4,
            label: 'Studio Profile',
            route: "UpdateStudioProfile"
            // route: "LocationTracker"
        },
        {
            id: 2,
            label: 'Privacy Policy',
            route: "Policy"
        },
        {
            id: 3,
            label: 'Terms and Conditions',
            route: "Terms"
        },
    ]
    return (
        <Container>
            <CustomHeader2 title="Settings" />

            <ScrollView showsVerticalScrollIndicator={false} style={{ width: screenWidth, alignSelf: 'center' }} >
                <View style={[styles.profileContainer]} >
                    <View style={[globalStyle.center, { width: moderateScale(170), height: moderateScale(170), backgroundColor: "#f7f7f7", borderRadius: moderateScale(200) }]} >
                        <Images.Logo fill="#000" width={moderateScale(150)} height={moderateScale(150)} />
                    </View>
                    <CustomText text={user?.first_name ? user?.first_name.trim() : "No Name"} weight='600' size={20} customStyle={{ textAlign: "center", marginTop: moderateScale(10) }} />
                </View>

                <View style={styles.content} >
                    <ScrollView style={{ flex: .99 }} >
                        {
                            settingArray && settingArray.map((item: any) => (
                                <Pressable key={item?.id} onPress={() => {
                                    navigation.navigate(item?.route)
                                }} style={[globalStyle.row, { backgroundColor: Colors.orange_bg, padding: moderateScale(10), marginBottom: moderateScale(10), borderRadius: moderateScale(8) }]} >
                                    <CustomIcon type='Entypo' name='chevron-left' />
                                    <CustomText weight='500' text={item?.label} />
                                </Pressable>
                            ))
                        }
                    </ScrollView>
                    <View style={{ flex: .01 }} >
                        <CustomButton title='Log Out' onPress={() => {
                            setIsLogout(true);
                        }} />
                    </View>
                </View>
            </ScrollView>

            <CustomModal
                visible={isLogout}
                onDismiss={() => {
                    setIsLogout(false);
                }}
                iscenter={true}
                containerStyle={{ height: screenHeight * .17 }}
            >
                <View style={globalStyle.modalbar} />
                <View style={[globalStyle.center, { flex: 1 }]} >
                    <CustomText size={16} customStyle={{ textAlign: "center" }} text='Are you sure you want to close?' weight='500' />
                    <View style={[globalStyle.betweenCenter, { marginTop: moderateScale(20), flex: 1, width: "100%" }]} >
                        <CustomButton bg={Colors.orange} customStyle={{ width: "45%" }} title='No' onPress={() => {
                            setIsLogout(false)
                        }} />
                        <CustomButton customStyle={{ width: "45%" }} title='Yes' onPress={() => {
                            dispatch(logout());
                            // CloseFun()
                        }} />
                    </View>
                </View>
            </CustomModal>
        </Container>
    )
}

export default Settings

const styles = StyleSheet.create({
    profileContainer: {
        flex: .4,
        // backgroundColor:"red",
        justifyContent: "center",
        alignItems: 'center'
    },
    content: {
        borderTopWidth: 1,
        borderTopColor: Colors.gray_font,
        marginTop: moderateScale(15),
        width: "105%",
        alignSelf: "center",
        borderTopLeftRadius: moderateScale(15),
        borderTopRightRadius: moderateScale(15),
        paddingTop: moderateScale(10),
        borderLeftWidth: 1,
        borderRightWidth: 1,
        padding: moderateScale(20),
        height: "100%"
    }
})