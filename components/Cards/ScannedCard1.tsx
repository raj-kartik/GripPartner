import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState, FC, useEffect} from 'react';
import Container from '../Container';
import {moderateScale, screenHeight, screenWidth} from '../Matrix/Matrix';
import {useSelector} from 'react-redux';
import CustomText from '../Customs/CustomText';
import { globalStyle } from '../../utils/GlobalStyle';
import makeApiRequest from '../../utils/ApiService';
import Colors from '../../utils/Colors';
import CustomIcon from '../Customs/CustomIcon';
import { DEFAULT_URL, DELETE_STORE_ITEM, UPDATE_STORE_QUANTITY } from '../../utils/api';
import Images from '../../utils/Images';

const ScannedCard1 = ({item, setCartItems, setLoading, fetchCartItem}: any) => {
  const [quantity, setQuantity] = useState(item?.quantity);
  const [debouncedQuantity, setDebouncedQuantity] = useState(item?.quantity);
  const {user} = useSelector((state: any) => state.user);

  // console.log('==== user=== ', item);

  useEffect(() => {
    // Debounce logic: Update the quantity in the store after a delay
    const handler = setTimeout(() => {
      // console.log('=== calling useEffect ===');

      if (debouncedQuantity !== item?.quantity) {
        // console.log('=== calling debounce ===');
        handleQuantityUpdate(item.id, debouncedQuantity);
      }
    }, 500); // Adjust debounce delay as needed (500ms)

    return () => clearTimeout(handler);
  }, [debouncedQuantity]);

  const handleQuantityUpdate = async (productId: any, qty: number) => {
    // console.log('=== calling ===');

    try {
      const response: any = await makeApiRequest({
        method: 'POST',
        url: UPDATE_STORE_QUANTITY,
        baseUrl: DEFAULT_URL,
        data: {
          product_id: productId,
          quantity: qty,
          user_id: user?.data?.id,
        },
      });
      // console.log('==== response in the update store ===', response);
      if (response.status === 'success') {
        fetchCartItem();
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  // console.log('==== item id ===', user);

  const handleDeleteItem = async () => {
    setLoading(true);
    try {
      const response: any = await makeApiRequest({
        method: 'POST',
        baseUrl: DEFAULT_URL,
        url: DELETE_STORE_ITEM,
        data: {
          user_id: user?.data?.id,
          product_id: item?.id,
        },
      });

      if (response.status === 'success') {
        fetchCartItem(); // Refresh cart after deletion
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {item?.img ? (
        <Image source={{uri: item?.img}} style={styles.img} />
      ) : (
        <View style={styles.img}>
          <Images.Logo />
        </View>
      )}

      <View style={styles.content}>
        <CustomText size={18} weight="700" text={item?.product_name} />

        {/* price */}
        <View style={{marginTop: moderateScale(5)}}>
          <CustomText
            weight="500"
            size={16}
            text={`₹${item?.price * quantity}`}
          />
          <CustomText
            customStyle={{marginTop: moderateScale(2)}}
            size={12}
            weight="500"
            color={'gray'}
            text={`₹${parseInt(item?.price)}/piece`}
          />
        </View>

        {/* quantity button */}
        <View style={[styles.qtyContainer, globalStyle.row]}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              if (quantity > 0) {
                setQuantity((prev: any) => {
                  const newQuantity = prev - 1;
                  setDebouncedQuantity(newQuantity);
                  return newQuantity;
                });

                setCartItems((prev: any) =>
                  prev.map((cartItem: any) =>
                    cartItem.product_id === item.product_id
                      ? {...cartItem, quantity: quantity - 1}
                      : cartItem,
                  ),
                );
              }
            }}
            style={{...styles.qtyBtn, marginRight: moderateScale(5)}}>
            <CustomIcon type="Entypo" color="#fff" name="minus" />
          </TouchableOpacity>

          <CustomText text={quantity} weight="500" size={18} />

          <TouchableOpacity
            onPress={() => {
              setQuantity((prev: any) => {
                const newQuantity = prev + 1;
                setDebouncedQuantity(newQuantity);
                return newQuantity;
              });

              // setCartItems(prev =>
              //   prev.map(cartItem =>
              //     cartItem.product_id === item.product_id
              //       ? {...cartItem, quantity: quantity + 1}
              //       : cartItem,
              //   ),
              // );
            }}
            activeOpacity={0.5}
            style={{...styles.qtyBtn, marginLeft: moderateScale(5)}}>
            <CustomIcon type="Entypo" color="#fff" name="plus" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleDeleteItem}
          style={{
            position: 'absolute',
            bottom: moderateScale(10),
            left: moderateScale(10),
            backgroundColor: 'rgba(255,0,0,0.1)',
            padding: moderateScale(5),
            borderRadius: moderateScale(3),
          }}>
          <CustomIcon type="AntDesign" name="delete" color="#ff0000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ScannedCard1;

const styles = StyleSheet.create({
  container: {
    width: screenWidth * 0.9,
    height: screenHeight * 0.4,
    backgroundColor: '#fff',
    elevation: 5,
    borderRadius: moderateScale(10),
    alignSelf: 'center',
    // marginBottom: moderateScale(5),
    marginVertical: moderateScale(10),
  },
  img: {
    flex: 1,
    borderRadius: moderateScale(10),
    backgroundColor: '#f7f7f7',
  },
  content: {
    flex: 0.8,
    // marginTop:moderateScale(10),
    padding: moderateScale(10),
    // backgroundColor:"green"
  },
  qtyBtn: {
    width: moderateScale(30),
    height: moderateScale(30),
    borderRadius: moderateScale(100),
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyContainer: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    // backgroundColor:"red"
  },
});
