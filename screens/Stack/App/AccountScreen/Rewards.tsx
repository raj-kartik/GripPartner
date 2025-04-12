import { Alert, Platform, StyleSheet,Share, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Container from '../../../../components/Container';
import { useDispatch, useSelector } from 'react-redux'
import CustomHeader2 from '../../../../components/Customs/Header/CustomHeader2';
import { getReferlist } from '../../../../redux/Slice/ReferalSlice';
// import Share from 'react-native-share';
import Clipboard from '@react-native-clipboard/clipboard';
import { moderateScale, screenHeight, screenWidth } from '../../../../components/Matrix/Matrix';
import { globalStyle } from '../../../../utils/GlobalStyle';
import Colors from '../../../../utils/Colors';
import CustomText from '../../../../components/Customs/CustomText';
import CustomIcon from '../../../../components/Customs/CustomIcon';
import CustomButton from '../../../../components/Customs/CustomButton';
import Images from '../../../../utils/Images';

const Rewards = () => {
    const dispatch = useDispatch();
    const { data } = useSelector((state: any) => state?.referral);
    const [isCopyBtn, setIsCopyBtn] = useState<boolean>(false);
    const {user} = useSelector((state:any)=>state?.user);
    const message = `Join Grip using referral code ${"*" + "ABC123" + "*"} and get guaranteed ₹100 cashback.\nDownload app at https://example.com`;


    console.log("=== user id ====",user?.id);
    
    useEffect(() => {
        const fetchReferral = async () => {
            await dispatch(getReferlist(user?.id));
        }

        fetchReferral();
    }, []);


    console.log("==== data in the refferal code ====",data);
    

    const handleInvite = async () => {
        // const message = 'Join Grip using referral code CN1N3N1 and get guaranteed ₹100 cashback.\nDownload app at';
        try {
            await Share.share({ message });
        } catch (error) {
            console.log('Error sharing:', error);
        }
    };

    const copyToClipboard = () => {
        Clipboard.setString(message);

        // Show a confirmation message
        if (Platform.OS === 'android') {
            ToastAndroid.show('Copied to clipboard!', ToastAndroid.SHORT);
            setIsCopyBtn(true);
        } else {
            Alert.alert('Copied!', 'Text copied to clipboard');
            setIsCopyBtn(true);
        }
    };

    console.log("==== referral ====", data);

    return (
        <Container status="#000" isTopPadding={false} >
            <CustomHeader2 title="Reward" bg="#000" color="#fff" customStyle={{ paddingHorizontal: moderateScale(10), margin: 0, width: screenWidth, alignSelf: "center" }} />
            <View style={[globalStyle.center, styles.profile]} >
                <View style={[globalStyle.center, styles.profileView]} >
                    <Images.Logo />
                </View>
                <View style={styles.whiteDesign} />
            </View>
            <View style={styles.rewardContainer} >
                {/* <CustomText text={user?.data?.profile?.first_name} customStyle={{ textAlign: "center" }} weight='600' size={30} /> */}
                <CustomText text={"Kartik"} customStyle={{ textAlign: "center" }} weight='600' size={30} />
                <CustomText text={"kartik@gmail.com"} size={16} customStyle={{ textAlign: "center", marginBottom: moderateScale(10) }} color={Colors.gray_font} weight='500' />
                {/* <CustomText text={profile?.email_id} size={16} customStyle={{ textAlign: "center", marginBottom: moderateScale(10) }} color={colors.gray_font} weight='500' /> */}

                <View style={{ paddingHorizontal: moderateScale(10), marginTop: moderateScale(10) }} >
                    <CustomText text='Referral Code' size={16} weight='600' />
                    <View style={[globalStyle.row, styles.copyContainer]} >
                        <View style={styles.copyInput} >
                            <CustomText weight='600' size={16} text={"No Available"} />
                            {/* <CustomText weight='600' size={16} color={user?.data?.referral_code ? "#000" : "#505050"} text={user?.data?.referral_code || "No Available"} /> */}
                        </View>
                        <TouchableOpacity onPress={copyToClipboard} activeOpacity={.8} style={[globalStyle.center, styles.copyBtn, { backgroundColor: isCopyBtn ? Colors.activeRadio : "#000" }]} >
                            <CustomIcon type='Feather' name={!isCopyBtn ? 'copy' : "check-circle"} color='#fff' />
                            {/* {isCopyBtn && <CustomText text='Copied' />} */}
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ paddingHorizontal: moderateScale(10), marginTop: moderateScale(10) }} >
                    <CustomButton textStyle={{ marginRight: moderateScale(5) }} onPress={handleInvite} iconType='Feather' iconName='share-2' iconPosition='right' title='Invite Your Friends' bg='#fff' textColor='#000' customStyle={{ borderWidth: 1, borderColor: "#000" }} />
                    <View style={[globalStyle.flex, { marginVertical: moderateScale(10), width: screenWidth * .95, backgroundColor: 'rgba(0,0,0,0.5)', height: screenHeight * .2, borderRadius: moderateScale(10), zIndex: 1 }]} >
                        <Images.Logo fill="#000" width={screenWidth * .95} height={screenHeight * .2} style={styles.coin} />
                        <View style={{ backgroundColor: 'rgba(0,0,0,0.6)', padding: moderateScale(10), borderRadius: moderateScale(10) }} >
                            <CustomText text={`Hurray! Your ${data?.length == 0 ? "No" : data?.length} Friends has joined GRIP!`} color='#fff' size={18} weight='700' />
                            <CustomText text={`You have earned ₹${500}`} color='#f7f7f7' weight='500' size={16} />
                        </View>
                    </View>
                </View>

            </View>
        </Container>
    )
}

export default Rewards

const styles = StyleSheet.create({
    profile: {
        flex: .3,
        backgroundColor: "#000",
        width: screenWidth,
        alignSelf: "center",
        // position: "relative"
    },
    rewardContainer: {
        flex: .7,
        width: screenWidth,
        alignSelf: "center",
        marginTop: moderateScale(60),
        padding: moderateScale(0)
    },
    whiteDesign: {
        width: screenWidth,
        height: screenWidth * .2,
        backgroundColor: "#fff",
        alignSelf: "flex-end",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        position: "absolute",
        bottom: -moderateScale(1),
        right: 0,
        left: 0,
        borderTopRightRadius: moderateScale(15),
        borderTopLeftRadius: moderateScale(15),
        borderTopStartRadius: moderateScale(15),
        zIndex: 0
    },
    profileView: {
        borderWidth: 10,
        borderColor: Colors.gray_font,
        // flex: 1,
        alignSelf: "center",
        width: screenWidth * .7,
        zIndex: 10,
        height: screenWidth * .7,
        borderRadius: moderateScale(3000),
        padding: moderateScale(10),
        marginTop: moderateScale(70),
        backgroundColor: "#fff",
    },
    copyBtn: { flex: .2, backgroundColor: "#000", width: "100%", padding: moderateScale(15) },
    copyInput: { flex: .9, paddingVertical: moderateScale(15), paddingLeft: moderateScale(5) },
    copyContainer: { backgroundColor: "#f7f7f7", padding: moderateScale(0), borderRadius: moderateScale(5), borderWidth: 1, marginTop: moderateScale(5) },
    coin: {
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        width: screenWidth * 2,
        height: screenHeight * .2,
        alignSelf: "center",
        zIndex: -10,
        backgroundColor: "#000",
        borderRadius: moderateScale(10),
        overflow: "hidden"
    }
})