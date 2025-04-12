import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import { moderateScale } from '../../Matrix/Matrix';
import CustomText from '../CustomText';
import { globalStyle } from '../../../utils/GlobalStyle';


const SubHeader = ({title, isMore = false, handlePress}:any) => {
  return (
    <View style={[globalStyle.betweenCenter, {marginBottom: moderateScale(10)}]}>
      <CustomText size={20} weight="700" text={title} />
      {isMore && (
        <TouchableOpacity onPress={handlePress}>
          <CustomText  weight='500' size={13} text="View all" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SubHeader;

const styles = StyleSheet.create({});
