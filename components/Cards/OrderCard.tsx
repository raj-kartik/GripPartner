import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image
} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { globalStyle } from '../../utils/GlobalStyle';
import { moderateScale, screenWidth } from '../Matrix/Matrix';
import CustomText from '../Customs/CustomText';
import Colors from '../../utils/Colors';
import Images from '../../utils/Images';

const OrderCard = ({ item, handleNavigation, btnName = 'Track Order' }: any) => {
  const navigation = useNavigation();

  return (
    <Pressable
      onPress={handleNavigation}
      style={[styles.container, globalStyle.flex]}>
      {item?.image ? (
        <Image source={{ uri: item?.image }} />
      ) : (
        <View style={styles.img}>
          <Images.Logo width={moderateScale(100)} height={moderateScale(100)} />
        </View>
      )}
      <View style={styles.content}>
        {item.products.length > 0 &&
          item.products.map((index: any) => {
            return index?.name.length > 70 ? (
              <View>
                <CustomText
                  text={`${index?.name.slice(0, 70)}...`}
                  weight="500"
                  customStyle={{ marginHorizontal: moderateScale(5) }}
                />
                <CustomText
                  weight="500"
                  color={Colors.gray_font}
                  text={`Quantity ${index?.quantity}`}
                  customStyle={{
                    textAlign: 'right',
                    marginHorizontal: moderateScale(10),
                  }}
                />
              </View>
            ) : (
              <CustomText
                text={index?.name}
                customStyle={{ marginRight: moderateScale(5) }}
                weight="500"
              />
            );
          })}

        <CustomText
          text={`Total ₹${item?.grand_total}`}
          weight="500"
          color={Colors.gray_font}
          customStyle={{
            textAlign: 'right',
            marginRight: moderateScale(10),
          }}
        />
      </View>
      {/* <View
        style={{
          position: 'absolute',
          bottom: moderateScale(10),
          right: moderateScale(10),
          width: moderateScale(100),
          backgroundColor: '#000',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: moderateScale(30),
          padding: moderateScale(8),
        }}>
        <CustomText text={btnName} color="#fff" weight="500" />
      </View> */}
    </Pressable>
  );
};
  
export default OrderCard;

const styles = StyleSheet.create({
  container: {
    width: '95%',
    alignSelf: 'center',
    height: screenWidth * 0.4,
    borderRadius: moderateScale(10),
    elevation: 5,
    marginBottom: moderateScale(10),
    backgroundColor: '#fff',
    marginTop: moderateScale(5),
  },
  img: {
    flex: 0.6,
    height: '95%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    margin: moderateScale(5),
    alignSelf: 'center',
    borderRadius: moderateScale(10),
  },
  content: {
    flex: 1,
    paddingVertical: moderateScale(5),
    paddingTop: moderateScale(10),
  },
});
