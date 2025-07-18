import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Images from '../../utils/Images'
import CustomText from '../Customs/CustomText'
import Colors from '../../utils/Colors'
import { moderateScale } from '../Matrix/Matrix'
import { globalStyle } from '../../utils/GlobalStyle'
import CustomButton from '../Customs/CustomButton'
import { useNavigation } from '@react-navigation/native'

const IsKycCard = () => {
    const navigation = useNavigation()
    return (
        <View style={[globalStyle.center, { flex: 1 }]} >
            <Images.Logo width={moderateScale(100)} height={moderateScale(100)} />
            <CustomText text='Your KYC is pending! You may access our features after verification' size={18} customStyle={{ textAlign: "center" }} weight='500' />
            {/* <CustomText text='You can see your E-commerce Products' color={Colors.gray_font} size={18} customStyle={{ textAlign: "center" }} weight='500' /> */}
            {/* <CustomButton  /> */}
            <Pressable
                onPress={() => {
                    // navigation.navigate('PanVerification')
                    navigation.navigate('KycVerification')
                }}
            >
                <CustomText text='Click to verify your KYC' weight='500' size={16} color={Colors.orange} customStyle={{ textDecorationLine: "underline", textDecorationColor: Colors.orange, textDecorationStyle: "solid" }} />
            </Pressable>
            {/* <CustomButton customStyle={{ marginTop: moderateScale(10) }} title='Verify KYC' onPress={() => {
                navigation.navigate('KycVerification')
            }} /> */}
        </View>
    )
}

export default IsKycCard

const styles = StyleSheet.create({})