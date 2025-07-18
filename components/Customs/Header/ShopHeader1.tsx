import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import CustomIcon from '../CustomIcon';
import CustomText from '../CustomText';
import { globalStyle } from '../../../utils/GlobalStyle';
import { moderateScale } from '../../Matrix/Matrix';
import { useNavigation } from '@react-navigation/native';
interface Props {
    navigation: any
}
const ShopHeader1: FC<Props> = () => {
    const { data } = useSelector((state: any) => state?.cart);
    const navigation: any = useNavigation();
    const { shortAddress, state, pincode } = useSelector((state: any) => state?.location);
    return (
        <View style={[globalStyle.betweenCenter, { marginRight: moderateScale(20), paddingBottom: moderateScale(10) }]} >
            {/* side drawer + location */}
            <View style={[globalStyle.row, { flex: .7 }]} >
                <Pressable onPress={() => { navigation.openDrawer() }} >
                    <CustomIcon size={30} type='Entypo' name='menu' />
                </Pressable>
                <Pressable onPress={() => {
                    // navigation.navigate('LocationTracker');
                }} style={{ marginLeft: moderateScale(10) }} >
                    {
                        (shortAddress && state && pincode) ? <CustomText weight='500' customStyle={{ width: "70%" }} text={`${shortAddress},${state},${pincode}`} /> : <CustomText text='Tap to Detect Location' />
                    }

                </Pressable>
            </View>
            <View style={[globalStyle.betweenCenter, { flex: .35, alignItems: "flex-end" }]} >

                <TouchableOpacity onPress={() => {
                    navigation.navigate('Search', {
                        type: "Shop"
                    })
                }} >
                    <CustomIcon type="AntDesign" name='search1' size={27} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { navigation.navigate('Scanner') }} >
                    <CustomIcon type="Ionicons" name='scan' size={27} />
                </TouchableOpacity>


                <TouchableOpacity onPress={() => { navigation.navigate('MyCart') }} >
                    <CustomIcon type="AntDesign" name='shoppingcart' size={30} />
                    {
                        data?.cart_items?.length > 0 && <View style={[globalStyle.center, { backgroundColor: "#000", width: moderateScale(20), height: moderateScale(20), borderRadius: moderateScale(100), position: "absolute", top: -moderateScale(10), right: -moderateScale(10) }]} >
                            <CustomText text={data?.cart_items?.length} color='#fff' weight='500' />
                        </View>
                    }

                </TouchableOpacity>

            </View>
        </View>
    )
}

export default ShopHeader1

const styles = StyleSheet.create({})