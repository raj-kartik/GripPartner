import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { globalStyle } from '../../../utils/GlobalStyle'
import Images from '../../../utils/Images'
import { moderateScale } from '../../Matrix/Matrix'
import CustomIcon from '../CustomIcon'

const CustomHeader1 = () => {
  return (
    <View style={[globalStyle.between, styles.container]} >
      <View>
        <Images.Logo width={moderateScale(70)} height={moderateScale(70)} />
      </View>
      <Pressable>
        <CustomIcon type='Feather' name='settings' />
      </Pressable>
    </View>
  )
}

export default CustomHeader1

const styles = StyleSheet.create({
  container: {
    // backgroundColor:"red"
  }
})