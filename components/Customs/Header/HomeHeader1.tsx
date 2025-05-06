import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { moderateScale, verticalScale } from '../../Matrix/Matrix'
import Images from '../../../utils/Images'
import { globalStyle } from '../../../utils/GlobalStyle'
import CustomText from '../CustomText'
import CustomIcon from '../CustomIcon'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'

const HomeHeader1 = ({ handlePress }: any) => {
    const navigation:any = useNavigation();
    const { shortAddress, state, pincode } = useSelector((state: any) => state?.location);

    // console.log("==== shortAddress ====", shortAddress);

    return (
        <View style={[globalStyle.betweenCenter, styles.container]} >
            <View style={[globalStyle.row]} >
                <Pressable onPress={handlePress} style={[globalStyle.row]} >
                    <Images.Logo width={moderateScale(60)} height={moderateScale(60)} />
                </Pressable>
                {
                    shortAddress && state && pincode && <CustomText weight='500' customStyle={{ marginLeft: moderateScale(10), width: "70%" }} text={`${shortAddress},${state}-${pincode}`} />
                }

            </View>
            <View  >
                <Pressable onPress={() => {
                    navigation.navigate('Search')
                }} >
                    <CustomIcon type='AntDesign' name='search1' />
                </Pressable>
            </View>
        </View>
    )
}

export default HomeHeader1

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: verticalScale(50),
        paddingRight: moderateScale(10),
        alignSelf: "center"
        // backgroundColor:"red",
        // flex:1 
        // alignSelf:"center",
    }
})