import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { moderateScale } from '../Matrix/Matrix'
import CustomIcon from './CustomIcon'
import { TextInput } from 'react-native'
import { globalStyle } from '../../utils/GlobalStyle'

const CustomLeadFilter = ({ setSearchText, searchText, handleFilter }: any) => {

    const [filter, setFilter] = useState(false);
    return (
        <View style={[globalStyle.row,
        {
            width: "100%",
            borderColor: "#ddd",
            borderRadius: moderateScale(30),
            borderWidth: 1,
            marginBottom: moderateScale(10),
            padding: moderateScale(5),
        }]} >
            <View style={[globalStyle.center, { borderRadius: moderateScale(100), backgroundColor: "#ddd", padding: moderateScale(8) }]} >
                <CustomIcon type='Ionicons' name='search' color='#000' />
            </View>
            <TextInput value={searchText} onChangeText={(text) => { setSearchText(text) }} style={{ flex: 1, color: "#000" }} />
            <TouchableOpacity onPress={handleFilter} style={[globalStyle.center, { borderRadius: moderateScale(100), padding: moderateScale(8) }]} >
                <CustomIcon type='AntDesign' name='filter' color='#000' />
            </TouchableOpacity>
        </View>
    )
}

export default CustomLeadFilter

const styles = StyleSheet.create({})