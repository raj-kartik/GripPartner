import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Images from '../../utils/Images'
import CustomText from '../Customs/CustomText'
import Colors from '../../utils/Colors'
import { moderateScale } from '../Matrix/Matrix'
import { globalStyle } from '../../utils/GlobalStyle'
import CustomButton from '../Customs/CustomButton'

const IsKycCard = () => {
    return (
        <View style={[globalStyle.center, { flex: 1 }]} >
            <Images.Logo width={moderateScale(100)} height={moderateScale(100)} />
            <CustomText text='Your KYC is pending! You may access our features after verification' size={18} customStyle={{ textAlign: "center" }} weight='500' />
            <CustomText text='You can see your E-commerce Products' color={Colors.orange} size={18} customStyle={{ textAlign: "center" }} weight='500' />
            {/* <CustomButton  /> */}
        </View>
    )
}

export default IsKycCard

const styles = StyleSheet.create({})