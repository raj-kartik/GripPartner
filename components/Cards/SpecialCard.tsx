import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {CommonActions, useNavigation} from '@react-navigation/native';
import Images from '../../utils/Images';
import { moderateScale, screenWidth } from '../Matrix/Matrix';
import CustomText from '../Customs/CustomText';
import Colors from '../../utils/Colors';

const SpecialCard = ({item}:any) => {
  const navigation = useNavigation();
  return (
    <Pressable
      style={[styles.cardContainer, {padding: 0}]}
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
      }}>
      {item?.image !== '' ? (
        <Image
          source={{
            uri: item?.image,
          }}
          style={styles.image3}
        />
      ) : (
        <View style={[styles.image3, {backgroundColor: '#f7f7f7'}]}>
          <Images.Logo />
        </View>
      )}

      <View style={{margin: moderateScale(10), marginHorizontal: 10}}>
        <CustomText
          weight="600"
          size={13}
          text={
            item.name.length > 40
              ? `${item.name.substring(0, 30)}...`
              : item.name
          }
        />
        <CustomText
          text={`₹${item?.price.toFixed(2)}`}
          size={13}
          color={Colors.gray}
          family="Roboto-Regular"
          customStyle={styles.productSpecialPrice}
        />
        {item?.price && (
          <CustomText
            // text={`Rs ${parseFloat(
            //   Object.values(item.custom_attributes || {}).find(
            //     attr => attr.attribute_code === 'special_price',
            //   )?.value,
            // ).toFixed(2)}`}
            text={`₹ ${parseFloat(item.special_price).toFixed(2)}`}
            size={13}
            weight="600"
            color={Colors.black}
          />
        )}
      </View>
    </Pressable>
  );
};

export default SpecialCard;

const styles = StyleSheet.create({
  image3: {
    width: '100%',
    alignSelf: 'center',
    borderTopLeftRadius: moderateScale(10),
    borderTopRightRadius: moderateScale(10),
    marginTop: moderateScale(0),
    height: moderateScale(120),
  },
  cardContainer: {
    width: screenWidth * 0.415, // 40% of screen width
    // height: screenWidth * 0.4, // Square card
    borderRadius: moderateScale(10),
    backgroundColor: 'white',
    elevation: 5,
    margin: moderateScale(10),
    padding: moderateScale(5),
  },
  productSpecialPrice: {
    textDecorationLine: 'line-through',
  },
});
