import {FlatList, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Container from '../../../../components/Container';
import makeApiRequest from '../../../../utils/ApiService';
import { DEFAULT_URL, GET_STORE_ORDER_DETAILS } from '../../../../utils/api';
import CustomHeader2 from '../../../../components/Customs/Header/CustomHeader2';
import { moderateScale, screenHeight } from '../../../../components/Matrix/Matrix';
import CustomText from '../../../../components/Customs/CustomText';
import { globalStyle } from '../../../../utils/GlobalStyle';
import Colors from '../../../../utils/Colors';
import Images from '../../../../utils/Images';


const StoreOrderDetails = (props: any) => {
  const params = props.route?.params;
  const [data, setData] = useState<{}>({});

  console.log('==== params ===', params);

  useEffect(() => {
    const fetchDetails = async () => {
      const response: any = await makeApiRequest({
        baseUrl: DEFAULT_URL,
        method: 'POST',
        data: {
          order_id: params?.orderId,
        },
        url: GET_STORE_ORDER_DETAILS,
      }); 

      if (response?.status === 'success') {
        setData(response?.data);
      }
    };
    fetchDetails();
  }, []);

  return (
    <Container>
      <CustomHeader2 title="Order Details" />
      <View style={{alignSelf: 'center'}}>
        <Images.Logo width={moderateScale(100)} height={moderateScale(100)} />
      </View>

      <View
        style={[
          globalStyle.between,
          {marginHorizontal: moderateScale(10), marginBottom: moderateScale(5)},
        ]}>
        <CustomText
          text="Order Id"
          color={Colors.gray_font}
          weight="600"
          size={16}
        />
        <CustomText text={data?.order_id} size={16} weight="500" />
      </View>

      <View
        style={[
          globalStyle.between,
          {marginHorizontal: moderateScale(10), marginBottom: moderateScale(5)},
        ]}>
        <CustomText
          color={Colors.gray_font}
          text="Order Date"
          weight="600"
          size={16}
        />
        <CustomText weight="500" text={data?.created_at} size={16} />
      </View>

      <View
        style={[
          globalStyle.between,
          {marginHorizontal: moderateScale(10), marginBottom: moderateScale(5)},
        ]}>
        <CustomText
          text="Payment Method"
          weight="600"
          color={Colors.gray_font}
          size={16}
        />
        <CustomText text={data?.payment_method} size={16} weight="500" />
      </View>

      <View
        style={[
          globalStyle.between,
          {marginHorizontal: moderateScale(10), marginBottom: moderateScale(5)},
        ]}>
        <CustomText
          text="Payment Amount"
          weight="600"
          color={Colors.gray_font}
          size={16}
        />
        <CustomText text={`₹${data?.total_amount}`} size={16} weight="500" />
      </View>

      {/* items */}
      {data?.items && data?.items.length > 0 && (
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flex: 1}}
          data={data?.items}
          keyExtractor={(item: any) => item?.product_id}
          renderItem={({item}: any) => (
            <View
              style={[
                globalStyle.flex,
                {
                  marginTop: moderateScale(10),
                  backgroundColor: '#fff',
                  padding: moderateScale(5),
                  borderRadius: moderateScale(10),
                  height: screenHeight * 0.15,
                  elevation: 5,
                  width: '95%',
                  alignSelf: 'center',
                  marginBottom: moderateScale(5),
                },
              ]}>
              <View
                style={[
                  globalStyle.center,
                  {
                    flex: 0.3,
                    backgroundColor: '#f7f7f7',
                    borderRadius: moderateScale(8),
                  },
                ]}>
                <Images.Logo
                  width={moderateScale(40)}
                  height={moderateScale(40)}
                />
              </View>
              <View style={{flex: 0.7, marginHorizontal: moderateScale(5)}}>
                <CustomText
                  text={
                    item?.product_name.length > 50
                      ? `${item?.product_name.substr(0, 50)}...`
                      : item?.product_name
                  }
                  customStyle={{marginBottom: moderateScale(5)}}
                  weight="500"
                  size={16}
                />
                <CustomText
                  weight="500"
                  customStyle={{marginBottom: moderateScale(5)}}
                  color={Colors.gray_font}
                  text={`Quantity ${item?.quantity}`}
                />

                <CustomText
                  customStyle={{marginBottom: moderateScale(5)}}
                  text={`₹${item?.price}`}
                  weight="500"
                />
              </View>
              <View
                style={[
                  globalStyle.center,
                  {
                    backgroundColor: '#000',
                    position: 'absolute',
                    padding: moderateScale(3),
                    width: '25%',
                    bottom: moderateScale(5),
                    right: moderateScale(10),
                    borderRadius: moderateScale(3),
                  },
                ]}>
                <CustomText
                  weight="500"
                  color="#fff"
                  text={`₹${item?.total}`}
                />
              </View>
            </View>
          )}
        />
      )}
    </Container>
  );
};

export default StoreOrderDetails;

const styles = StyleSheet.create({});
