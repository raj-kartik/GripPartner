import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { globalStyle } from '../../../utils/GlobalStyle';
import { moderateScale } from '../../Matrix/Matrix';
import Images from '../../../utils/Images';
import CustomIcon from '../CustomIcon';
import { useNavigation } from '@react-navigation/native';
import CustomText from '../CustomText';

const CustomHeader2 = ({
  isBack = true,
  title = '',
  isMore = false,
  bg = '#fff',
  color = '#000',
  customStyle,
  handleMore,
  iconType,
  iconName,
}: any) => {
  const navigation = useNavigation();
  return (
    <View
      style={[
        globalStyle.between,
        { paddingVertical: moderateScale(5), backgroundColor: bg },
        customStyle,
      ]}>
      <View style={[globalStyle.row, { flex: 0.8 }]}>
        {isBack && (
          <Pressable onPress={() => navigation.goBack()}>
            <CustomIcon
              type="AntDesign"
              color={color}
              name="arrowleft"
              size={30}
            />
          </Pressable>
        )}

        <CustomText
          customStyle={{ marginLeft: moderateScale(10) }}
          color={color}
          text={title}
          size={22}
          weight="600"
        />
      </View>
      {isMore && (
        <View style={{ flex: 0.1 }}>
          <Pressable onPress={handleMore}>
            <CustomIcon type={iconType} size={30} name={iconName} />
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default CustomHeader2;

const styles = StyleSheet.create({});
