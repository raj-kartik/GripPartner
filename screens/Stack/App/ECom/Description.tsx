import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import Container from '../../../../components/Container';
import CustomHeader2 from '../../../../components/Customs/Header/CustomHeader2';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { CustomToast } from '../../../../components/Customs/CustomToast';
import Colors from '../../../../utils/Colors';
import CustomText from '../../../../components/Customs/CustomText';
import {
  moderateScale,
  screenHeight,
  screenWidth,
} from '../../../../components/Matrix/Matrix';
import CustomIcon from '../../../../components/Customs/CustomIcon';
import { globalStyle } from '../../../../utils/GlobalStyle';
import { DEFAULT_URL, POST_ADD_TO_CART } from '../../../../utils/api';
import makeApiRequest from '../../../../utils/ApiService';
import CustomButton from '../../../../components/Customs/CustomButton';
import { useSelector } from 'react-redux';

const Description = ({ navigation, route }: any) => {
  // console.log("==== route ====", route);
  const { sku, specialPrice } = route.params;
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<any>({});
  const [quantity, setQuantity] = useState(1);
  const { user } = useSelector((state: any) => state?.user);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const formdata = new FormData();
      formdata.append('sku', route?.params?.sku);

      const response = await axios.post(
        'https://fitwithgrip.com/shop/product-detail',
        formdata,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response?.status === 200) {
        // console.log('==== response in the cart details data =====', response?.data?.data);
        setCategory(response?.data?.data);
      }
    } catch (err: any) {
      console.error('Error in the product details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <ActivityIndicator
        size="large"
        color="#000"
        style={{ flex: 1, backgroundColor: '#fff' }}
      />
    );

  const addToCart = async () => {
    setLoading(true);

    if (!user?.is_registred) {
      navigation.navigate('RegisterUser');
      return;
    }

    try {
      // Check if SKU is valid before proceeding
      if (!sku) {
        CustomToast({
          type: 'error',
          text1: 'Failed to add in cart',
          text2: 'sku is missing',
        });
      }

      // Prepare the FormData with necessary fields
      const formdata = new FormData();
      formdata.append('sku', category?.sku);
      if (category?.stock_item?.qty < quantity) {
        console.log('Not Enough Stock');
        return;
      }
      formdata.append('qty', quantity);

      // Make the POST request using axios
      const response = await axios.post(
        `${DEFAULT_URL}${POST_ADD_TO_CART}`,
        formdata,
        {
          headers: {
            Authorization: `Bearer ${user?.auth_token}`, // Make sure to include the token if required
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      console.log('--- response being add to cart ---', response?.data);
      // return;

      if (response.data?.error) {
        // If there's an error in the response, show the message
        CustomToast({
          type: 'error',
          text1: 'Add To Cart Unsuccessful',
          text2: response?.data?.message,
        });
      } else {
        const data = response.data;
        CustomToast({
          type: 'success',
          text1: 'Add To Cart Successful',
          text2: response?.data?.message,
        });
        navigation.navigate('MyCart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  //   console.log('=== category in the product details ====', category);

  return (
    <Container>
      <CustomHeader2 title="Product Details" customStyle={{ zIndex: 1 }} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {category?.images && category?.images.length > 0 ? (
          <FlatList
            pagingEnabled
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            data={category?.images}
            keyExtractor={(item: any, index: any) => {
              return index;
            }}
            renderItem={({ item }) => {
              return <Image style={styles.image} source={{ uri: item }} />;
            }}
          />
        ) : (
          <View style={[globalStyle.center, styles.image]}>
            <CustomText text="No Image Preview" weight="800" size={18} />
          </View>
        )}
        <CustomText text={category?.name} weight="600" size={20} />

        <View>
          {/* price and add quantity */}
          <View
            style={{
              backgroundColor: '#f0f0f0',
              marginVertical: moderateScale(10),
              paddingVertical: moderateScale(10),
              paddingHorizontal: moderateScale(10),
              borderRadius: moderateScale(10),
            }}>
            {/* special price */}
            <View style={[styles.specification, globalStyle.betweenCenter]}>
              <CustomText
                // customStyle={styles.title}
                text="Price"
                size={15}
                weight="600"
                color="#000"
              />
              <CustomText
                size={15}
                color="#000"
                text={`₹${parseInt(specialPrice).toFixed(2)}`}
              />
            </View>

            {/* actual price */}
            <View
              style={[
                styles.specification,
                globalStyle.betweenCenter,
                { marginTop: moderateScale(10) },
              ]}>
              <CustomText
                // customStyle={styles.title}
                size={15}
                text="MRP"
                color="#000"
                weight="600"
              />
              <CustomText
                customStyle={{
                  // flex: 1,
                  // margin: 0,
                  textDecorationLine: 'line-through',
                }}
                color="#000"
                // color={Colors.gray_font}
                size={15}
                text={`₹${parseFloat(category.price).toFixed(2)}`}
              />
            </View>

            <View
              style={{
                width: '100%',
                height: 0.8,
                backgroundColor: '#000',
                marginTop: moderateScale(10),
              }}
            />
            {/* quantity */}
            <View
              style={[
                styles.specification,
                globalStyle.betweenCenter,
                { marginTop: moderateScale(10) },
              ]}>
              <CustomText
                // customStyle={styles.title}
                size={15}
                text="Quantity"
                color="#000"
                weight="600"
              />

              {category.stock_item?.is_in_stock ? (
                <View style={[globalStyle.row]}>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                      if (quantity > 0) {
                        setQuantity(prev => prev - 1);
                      }
                    }}
                    style={[
                      styles.addToCartBtn,
                      globalStyle.center,
                      { backgroundColor: '#000' },
                    ]}>
                    <CustomIcon type="Entypo" color="#fff" name="minus" />
                  </TouchableOpacity>
                  <View style={{ marginHorizontal: moderateScale(10) }}>
                    <CustomText
                      size={18}
                      weight="600"
                      text={quantity}
                      color="#000"
                    />
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                      console.log(
                        '===== category?.stock_item?.qty ======',
                        category?.stock_item?.qty,
                      );

                      if (quantity < category?.stock_item?.qty) {
                        setQuantity(prev => prev + 1);
                      }
                    }}
                    style={[
                      styles.addToCartBtn,
                      globalStyle.center,
                      { backgroundColor: '#000' },
                    ]}>
                    <CustomIcon type="Entypo" color="#fff" name="plus" />
                  </TouchableOpacity>
                </View>
              ) : (
                <CustomText
                  // customStyle={styles.title1}
                  size={15}
                  text="Out of Stock"
                />
              )}
            </View>
          </View>

          {/* description */}
          <View
            style={[
              styles.specification,
              // globalStyle.row,
              // {alignItems: 'center'},
            ]}>
            <CustomText
              customStyle={{ marginBottom: moderateScale(5) }}
              size={18}
              text="Description"
              weight="700"
            />
            <CustomText text={category?.description || 'No Description'} />
          </View>
        </View>
        <View style={{ marginBottom: moderateScale(100) }} />
      </ScrollView>
      <View
        style={[
          globalStyle.betweenCenter,
          {
            backgroundColor: '#000',
            padding: moderateScale(10),
            borderRadius: moderateScale(8),
            position: 'absolute',
            bottom: moderateScale(10),
            right: moderateScale(5),
            left: moderateScale(5),
          },
        ]}>
        <View
          style={[
            globalStyle.center,
            { marginRight: moderateScale(5), flex: 0.3 },
          ]}>
          <CustomText text="Total" color="#fff" weight="500" />
          <CustomText
            weight="700"
            color={Colors.white}
            size={16}
            text={`₹${(parseInt(specialPrice) * quantity).toFixed(2)}`}
          />
        </View>
        <View style={{ flex: 0.7 }}>
          <CustomButton
            title="Add To Cart"
            onPress={addToCart}
            bg="#fff"
            textColor="#000"
            disabled={
              !category?.stock_item?.is_in_stock || quantity === 0
                ? true
                : false
            }
          />
        </View>
      </View>
    </Container>
  );
};

export default Description;

const styles = StyleSheet.create({
  image: {
    width: screenWidth * 0.94,
    height: screenHeight * 0.4,
    zIndex: 10,
    borderRadius: moderateScale(10),
    elevation: 2,
    backgroundColor: '#fff',
    marginVertical: moderateScale(10),
  },
  specification: {
    marginTop: moderateScale(5),
  },
  addToCartBtn: {
    width: moderateScale(30),
    height: moderateScale(30),
    borderRadius: moderateScale(100),
    backgroundColor: '#000',
  },
});
