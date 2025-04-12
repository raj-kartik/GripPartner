import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {moderateScale, screenWidth} from '../Matrix/Matrix';
import {CommonActions, useNavigation} from '@react-navigation/native';
import CustomText from '../Customs/CustomText';
import { globalStyle } from '../../utils/GlobalStyle';
import Colors from '../../utils/Colors';
import Images from '../../utils/Images';

const ShopCard1 = ({item}:any) => {
  // console.log('--- item in the shop card ---', item);

  const productName =
    item.name.length > 30
      ? `${item.name.slice(0, 30).trim()}...`
      : item.name;

  const navigation = useNavigation();
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => {
        navigation.dispatch(
          CommonActions.navigate({
            name: 'Description',
            params: {
              sku: item.sku,
              specialPrice: item?.special_price,
            },
          }),
        );
      }}
      style={styles.container}>
      {item?.image ? (
        <Image
          style={[styles.img, {marginBottom: moderateScale(10)}]}
          source={{uri: item?.image}}
        />
      ) : (
        <View
          style={[
            styles.img,
            globalStyle.center,
            {backgroundColor: '#f7f7f7', marginBottom: moderateScale(10)},
          ]}>
          <Images.Logo />
        </View>
      )}
      <View>
        <CustomText text={productName} size={18} weight="700" />
        <View
          style={[globalStyle.betweenCenter, {marginTop: moderateScale(10)}]}>
          <CustomText
            text={`₹${parseFloat(item?.special_price).toFixed(2)}`}
            weight="700"
          />
          <CustomText
            text={`₹${item?.price.toFixed(2)}`}
            color={Colors.gray_font}
            customStyle={{
              textDecorationColor: Colors.gray_font,
              textDecorationLine: 'line-through',
            }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ShopCard1;

const styles = StyleSheet.create({
  container: {
    width: screenWidth * 0.8,
    height: screenWidth * 0.65,
    elevation: 5,
    // backgroundColor:"red",
    marginLeft: moderateScale(5),
    marginRight: moderateScale(10),
    borderRadius: moderateScale(10),
    padding: moderateScale(10),
    backgroundColor: '#fff',
    marginTop: moderateScale(5),
    marginBottom: moderateScale(10),
  },
  img: {
    width: '100%',
    flex: 0.9,
    borderRadius: moderateScale(10),
    // backgroundColor: 'red',
  },
});
