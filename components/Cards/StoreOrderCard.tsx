import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
// import {Images} from '../../../utils/Images/Images';
import {useNavigation} from '@react-navigation/native';
import {moderateScale, screenHeight} from '../Matrix/Matrix';
import CustomText from '../Customs/CustomText';
import Images from '../../utils/Images';

const StoreOrderCard = ({item}:any) => {
  const navigation = useNavigation();
  // console.log("==== item of store order ===",item);
  
  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        navigation.navigate('StoreOrderDetails', {
          orderId: item?.order_id,
        });
      }}>
      <View style={{flex: 0.3, backgroundColor: '#f7f7f7', borderRadius: 8}}>
        <Images.Logo width={100} height={100} />
      </View>
      <View style={{flex: 0.7, marginLeft: 10}}>
        <CustomText
          text={`Method ${item?.payment_method}`}
          weight="600"
          size={18}
        />
        <CustomText text={`₹${item?.total_amount}`} weight="500" />
      </View>

      <View
        style={{
          width: '30%',
          backgroundColor: '#000',
          position: 'absolute',
          bottom: 10,
          right: 10,
          padding: 5,
          paddingHorizontal: 10,
          alignItems: 'center',
          borderRadius: moderateScale(8),
        }}>
        <CustomText text={item?.status} weight="500" color="#fff" />
      </View>
    </Pressable>
  );
};

export default StoreOrderCard;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: screenHeight*.2,
    backgroundColor: '#fff',
    flexDirection: 'row',
    paddingHorizontal: 5,
    marginTop: 2,
    marginBottom: 13,
    padding: 5,
    borderWidth: 1,
    borderRadius: 8,
  },
});
