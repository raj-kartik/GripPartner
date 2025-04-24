import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomText from '../Customs/CustomText';
import { useSelector } from 'react-redux';
import CustomIcon from '../Customs/CustomIcon';
import { moderateScale, screenHeight, screenWidth } from '../Matrix/Matrix';
import { globalStyle } from '../../utils/GlobalStyle';
import Colors from '../../utils/Colors';


const WalletCard = () => {
    // console.log("==== item in the wallet card =====", item);

    const { user } = useSelector((state: any) => state?.user);
    const { data } = useSelector((state: any) => state?.wallet);

    // console.log("==== data wallet ===",data);

    return (
        <View style={[styles.walletContainer]} >
            <View style={[globalStyle.row, styles.walletView, { justifyContent: "center" }]} >
                <CustomIcon type='Entypo' size={25} name='wallet' color='#000' />
                <CustomText size={16} text={`₹${data?.wallet_balance || user?.wallet_balance}` || 'No Balance'} customStyle={{ marginLeft: moderateScale(5) }} weight='600' />
            </View>
            <View style={{ marginTop: moderateScale(10) }} >
                <CustomText text={user?.first_name} weight='700' size={25} />
                <CustomText text={user?.email} color={Colors.gray_font} customStyle={{ marginTop: moderateScale(5) }} weight='600' />
                <CustomText text={user?.phone_number} customStyle={{ marginTop: moderateScale(5) }} weight='600' />
            </View>
        </View>
    )
}

export default WalletCard

const styles = StyleSheet.create({
    walletContainer: {
        borderWidth: 1,
        borderRadius: moderateScale(10),
        borderColor: "#000",
        // height: screenHeight * .2,
        padding: moderateScale(10),
        backgroundColor: "#f7f7f7",
        width: "100%",
        marginRight: moderateScale(5),
        // alignSelf: 'center'
    },
    walletView: {
        // width: moderateScale(50),
        // paddingLeft: moderateScale(10),
        height: moderateScale(50),
        borderRadius: moderateScale(100),
        backgroundColor: Colors.orange,
        width: "40%"
    }
})