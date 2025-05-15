import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import Container from '../../../../components/Container';
import CustomHeader2 from '../../../../components/Customs/Header/CustomHeader2';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import makeApiRequest from '../../../../utils/ApiService';
import {
  DEFAULT_URL,
  POST_ADD_TO_CART,
  POST_ADD_TO_CART_LIST,
  POST_DELETE_ADD_TO_CART_ITEM,
} from '../../../../utils/api';
import { throttle, times } from 'lodash';
import axios from 'axios';
import CustomToast from '../../../../components/Customs/CustomToast';
import CustomButton from '../../../../components/Customs/CustomButton';
import CustomText from '../../../../components/Customs/CustomText';
import Images from '../../../../utils/Images';
import {
  horizontalScale,
  moderateScale,
  screenHeight,
  screenWidth,
  verticalScale,
} from '../../../../components/Matrix/Matrix';
import { globalStyle } from '../../../../utils/GlobalStyle';
import CustomIcon from '../../../../components/Customs/CustomIcon';
import ApplyCoupon from '../../../../components/ApplyCoupon';
import CartSkeleton from '@components/Skeleton/CartSkeleton';

const MyCart = () => {
  const [loading, setLoading] = useState(false);
  const [itemBill, setItemsBill] = useState([]); // Cart items
  const [allItem, setAllItem] = useState({}); // Additional cart details
  const [isRemove, setIsRemove] = useState(false);
  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      fetchCartData();
    }, []),
  );

  // console.log("==== itemBill in the mycart.tsx ====", itemBill);


  const fetchCartData = async () => {
    setLoading(true);
    try {
      const response: any = await makeApiRequest({
        method: 'POST',
        baseUrl: DEFAULT_URL,
        url: POST_ADD_TO_CART_LIST,
      });



      if (response?.error == false) {
        // console.log("=== response in the fetchcartdata ====", response);
        setItemsBill(response.data.cart_items);
        setAllItem(response.data);
      }
      // console.log('==== response in the cart list ====', response);
    } catch (err: any) {
      console.log('Error in the Cart:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update Quantity Locally
  const updateLocalCart = (index: any, newQuantity: any) => {
    setItemsBill((prevItems: any) =>
      prevItems.map((item: any, i: any) =>
        i === index ? { ...item, qty: newQuantity } : item,
      ),
    );
    setAllItem((prevAllItem: any) => ({
      ...prevAllItem,
      cart_items: prevAllItem.cart_items.map((item: any, i: any) =>
        i === index ? { ...item, qty: newQuantity } : item,
      ),
    }));
  };

  // Send Updated Quantity to Server
  const updateServerCart = async (sku: any, quantity: any) => {
    // console.log("--- updating ---");
    try {
      const formData = new FormData();
      formData.append('sku', sku);
      formData.append('qty', quantity);

      const response = await axios.post(
        `${DEFAULT_URL}${POST_ADD_TO_CART}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );

      // console.log("----- response in update ----",response);

      if (response?.status === 200) {
        fetchCartData();
      }
    } catch (error) {
      console.error('Error updating quantity on server:', error);
    }
  };

  // Throttle API Call
  const throttledUpdateServerCart = throttle(updateServerCart, 1000);

  // Handle Quantity Change
  const handleQuantityChange = (index: any, item: any, newQuantity: any) => {
    if (newQuantity < 1) return;
    updateLocalCart(index, newQuantity);
    throttledUpdateServerCart(item.sku, newQuantity);
  };

  const removeFromCart = async (item: any) => {
    try {
      const formdata = new FormData();
      formdata.append('sku', item?.sku);

      setLoading(true);

      const response = await axios.post(
        `${DEFAULT_URL}${POST_DELETE_ADD_TO_CART_ITEM}`,
        formdata, // Pass the FormData object as the request body
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Set the correct Content-Type for FormData
          },
        },
      );

      const data = response?.data;

      if (!data?.error) {
        CustomToast({
          type: 'success',
          text1: 'Item Removed',
          text2: 'You may add new product to shop',
        });
        setIsRemove(true);
        fetchCartData();
      }

      // console.log('==== reponse in the delete cart ====', response?.data);
    } catch (error) {
    } finally {
      setLoading(false);
      setIsRemove(false);
    }
  };

  // if (loading) {
  //   return (
  //     <ActivityIndicator
  //       size="large"
  //       style={{ flex: 1, backgroundColor: '#fff' }}
  //       color="black"
  //     />
  //   );
  // }

  return (
    <Container>
      <CustomHeader2 title="My Cart" />

      {
        loading ? (
          <View
            style={{ flex: 1 }}
          >
            <CartSkeleton />
          </View>
          // <ActivityIndicator style={{ flex: .8 }} size="large" color="#000" />
        ) : (
          <View style={{ flex: 5 }} >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {itemBill && itemBill?.length <= 0 ? (
                <View
                  style={[globalStyle.center, { flex: 1, height: screenHeight * .9 }]}>
                  <Images.Logo
                    width={moderateScale(100)}
                    height={moderateScale(100)}
                  />
                  <CustomText text="ohhh. Your cart is empty" weight="500" />
                  <CustomText text="but it doesn’t have to be" weight="500" />
                  <CustomButton
                    title="Shop Now"
                    customStyle={{
                      width: screenWidth * 0.5,
                      marginTop: moderateScale(10),
                    }}
                    onPress={() => {
                      // navigation.navigate('BottomTabs')
                      navigation.navigate('BottomTabs', {
                        screen: 'ShopDrawer',
                      });
                    }}
                  />
                </View>
              ) : (
                itemBill.length > 0 &&
                itemBill.map((item: any, index: number) => {
                  // console.log("--- index in the 243 line ----",index);
                  return (
                    <View style={[styles.cart, globalStyle.flex]} key={index}>
                      <View
                        style={{
                          position: 'absolute',
                          top: moderateScale(10),
                          right: moderateScale(5),
                          zIndex: 9,
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          borderRadius: moderateScale(50),
                          padding: moderateScale(2),
                        }}>
                        <Pressable onPress={() => removeFromCart(item)}>
                          <CustomIcon type="AntDesign" name="closecircleo" />
                        </Pressable>
                      </View>
                      {item?.image ? (
                        <View style={[styles.image, { width: moderateScale(100), height: '100%' }]}>
                          <Image
                            source={{ uri: item?.image }}
                            style={[
                              styles.image,
                              { width: moderateScale(100), height: '100%', flex: 1 },
                            ]}
                          />
                        </View>
                      ) : (
                        <View style={[styles.image, { width: moderateScale(100), height: '100%' }]}>
                          <Images.Logo />
                        </View>
                      )}

                      <View style={{ marginLeft: moderateScale(10) }}>
                        <CustomText
                          weight="600"
                          customStyle={{ flexWrap: 'wrap' }}
                          size={15}
                          text={
                            item?.name.length > 28
                              ? `${item?.name.substring(0, 28)}...`
                              : item?.name
                          }
                        />
                        <CustomText
                          weight="600"
                          customStyle={{ marginVertical: moderateScale(5) }}
                          text={`Rs ${item.qty < 1 ? item.price : item.price * item.qty
                            }`}
                        />
                        <View
                          style={[
                            styles.numberContainer,
                            {
                              borderWidth: 1,
                              marginTop: moderateScale(5),
                              borderRadius: moderateScale(5),
                            },
                          ]}>
                          <Pressable
                            // style=
                            onPress={() =>
                              handleQuantityChange(index, item, item.qty - 1)
                            }>
                            <CustomIcon type="AntDesign" name="minuscircleo" />
                          </Pressable>
                          <CustomText text={item.qty.toString()} weight="600" />
                          <Pressable
                            onPress={() =>
                              handleQuantityChange(index, item, item.qty + 1)
                            }>
                            <CustomIcon type="AntDesign" name="pluscircleo" />
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  );
                })
              )}
            </ScrollView>
          </View>
        )
      }

      {
        allItem && <ApplyCoupon itemBill={allItem} navigation={navigation} />
      }

    </Container>
  );
};

export default MyCart;

const styles = StyleSheet.create({
  numberContainer: {
    width: horizontalScale(90),
    height: verticalScale(40),
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    justifyContent: 'space-between',
    borderRadius: 10,
    padding: 5,
    elevation: 1,

  },
  image: {
    width: moderateScale(100),
    height: "10%",
    resizeMode: 'contain',
    // backgroundColor:"red"
  },
  content: {
    elevation: 1,
    opacity: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    height: verticalScale(120)
  },
  cart: {
    width: screenWidth * 0.89,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'flex-start',
    elevation: 3,
    opacity: 85,
    alignSelf: 'center',
    margin: moderateScale(5),
    padding: 10,
    borderWidth: 0.4,
    // flexDirection: 'row',
  },
});
