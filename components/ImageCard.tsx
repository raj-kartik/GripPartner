import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import CustomIcon from './Customs/CustomIcon';
import CustomText from './Customs/CustomText';
import { moderateScale, screenHeight, screenWidth } from './Matrix/Matrix';
import Colors from '../utils/Colors';
const ImageCard = ({img, rating}: any) => {
  return (
    <View style={styles.image}>
      <Image source={{uri: img}} style={[styles.image]} />
      <View
        style={{
          alignItems: 'center',
          position: 'absolute',
          backgroundColor: '#fff',
          borderRadius: moderateScale(5),
          padding: moderateScale(5),
          bottom: moderateScale(5),
          right: moderateScale(10),
          elevation: 3,
        }}>
        <CustomIcon type="AntDesign" name="star" color={Colors.orange} />
        <CustomText
          text={parseFloat(rating).toFixed(1)}
          weight="700"
          customStyle={{marginTop: moderateScale(3)}}
        />
      </View>
    </View>
  );
};

export default ImageCard;

const styles = StyleSheet.create({
  image: {
    width: screenWidth * 0.95,
    height: screenHeight*.2,
    marginBottom: moderateScale(10),
    borderRadius: moderateScale(10),
    alignItems: 'center',
    alignSelf: 'center',
  },
});
