import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import React, { useCallback, useState } from 'react';
import {
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import makeApiRequest from '../../../../utils/ApiService';
import { DEFAULT_URL, GET_ORDER_DETAILS, ORDER_INVOICE, POST_CANCEL_ORDER } from '../../../../utils/api';
import Container from '../../../../components/Container';
import CustomHeader2 from '../../../../components/Customs/Header/CustomHeader2';
import CustomText from '../../../../components/Customs/CustomText';
import { moderateScale, screenWidth } from '../../../../components/Matrix/Matrix';
import Colors from '../../../../utils/Colors';
import CustomButton from '../../../../components/Customs/CustomButton';
import CustomModal from '../../../../components/Customs/CustomModal';
import { globalStyle } from '../../../../utils/GlobalStyle';
import Images from '../../../../utils/Images';
const CompletedOrderDetails = (props: any) => {
  const params = props.route.params;
  const [details, setDetails] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [invoice, setInvoice] = useState<{}>({});
  const navigation = useNavigation();

  console.log('=== params ===', invoice);

  useFocusEffect(
    useCallback(() => {
      orderDetails();
      handleInvoice();
    }, []),
  );

  const orderDetails = async () => {
    try {
      setLoading(true);
      const response: any = await makeApiRequest({
        method: 'POST',
        url: GET_ORDER_DETAILS,
        baseUrl: DEFAULT_URL,
        data: {
          order_id: params.id,
        },
      });

      if (!response.error) setDetails(response.data);
    } catch (err) {
      console.log(err, 'error in order details');
    } finally {
      setLoading(false);
    }
  };

  const handleInvoice = async () => {
    try {
      setLoading(true);
      const response: any = await makeApiRequest({
        baseUrl: DEFAULT_URL,
        url: ORDER_INVOICE,
        method: 'POST',
        data: {
          invoice_id: params.invoiceId,
        },
      });

      if (!response?.error) {
        setInvoice(response.data);
      }
    } catch (err) {
      console.log('Error in the order: ', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <CustomHeader2 title="Order Details" />
      {!loading ? (
        <>
          <View
            style={{
              alignSelf: 'center',
              alignItems: 'center',
              marginBottom: moderateScale(10),
            }}>
            <Images.Logo width={100} height={100} />
            <CustomText
              customStyle={{
                textAlign: 'center',
                marginBottom: moderateScale(2),
              }}
              text="GRIP INTERNATIONAL PRIVATE LIMITED"
              weight="600"
              size={16}
            />
            <CustomText
              weight="600"
              customStyle={{
                textAlign: 'center',
                marginBottom: moderateScale(2),
              }}
              text="C-90, Sector-63, Noida-201301"
            />
            <CustomText
              text="GSTIN: 09AAHCG9550D1ZG"
              color={Colors.gray_font}
              weight="500"
              customStyle={{
                textAlign: 'center',
                marginBottom: moderateScale(2),
              }}
            />
          </View>

          {/* Invoice */}
          <View style={styles.borderline} />
          <View style={[globalStyle.between]}>
            <View>
              {invoice?.invoice_id && (
                <CustomText
                  weight="500"
                  text={`Invoice ${' '}${invoice?.invoice_id}`}
                />
              )}

              {invoice?.created_at && (
                <CustomText
                  customStyle={{ marginTop: moderateScale(2) }}
                  text={`${invoice?.created_at}`}
                />
              )}
            </View>
            {invoice?.items && invoice.items.length > 0 && (
              <View>
                <CustomText text={`${invoice.items.length.toString()} item`} />
              </View>
            )}
          </View>

          {/* name of the user */}
          <View style={styles.borderline} />
          <View>
            <View style={[globalStyle.row, { marginBottom: moderateScale(10) }]}>
              <View style={{ flex: 1 }}>
                <CustomText
                  customStyle={{ textAlign: 'center' }}
                  // color={Colors.gray_font}
                  weight="500"
                  text="Name"
                />
              </View>
              <View style={{ flex: 1 }}>
                <CustomText
                  customStyle={{ textAlign: 'center' }}
                  weight="500"
                  text="Qty."
                />
              </View>
              <View style={{ flex: 1 }}>
                <CustomText
                  customStyle={{ textAlign: 'center' }}
                  weight="500"
                  text="Rate"
                />
              </View>
              <View style={{ flex: 1 }}>
                <CustomText
                  customStyle={{ textAlign: 'center' }}
                  weight="500"
                  text="Amount"
                />
              </View>
            </View>

            {invoice?.items &&
              invoice.items.map((item: any, index: number) => {
                // console.log('=== item ===', item);

                return (
                  <View style={[globalStyle.row, { marginTop: moderateScale(10) }]} key={index}>
                    <View style={{ flex: 1 }}>
                      <CustomText
                        // customStyle={{textAlign: 'center'}}
                        weight="500"
                        text={item?.name}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <CustomText
                        customStyle={{ textAlign: 'center' }}
                        text={item?.qty}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <CustomText
                        customStyle={{ textAlign: 'center' }}
                        text={`₹${item?.price.toFixed(2)}`}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <CustomText
                        customStyle={{ textAlign: 'center' }}
                        text={`₹${item?.row_total.toFixed(2)}`}
                      />
                    </View>
                  </View>
                );
              })}
          </View>

          {/* amount */}
          <View style={styles.borderline} />
          <View>
            <View
              style={[
                globalStyle.betweenCenter,
                { marginBottom: moderateScale(5) },
              ]}>
              <CustomText text="Sub Total" size={18} />
              <CustomText
                text={`₹${details?.totals?.subtotal.toFixed(2)}`}
                size={18}
              />
            </View>

            <View
              style={[
                globalStyle.betweenCenter,
                { marginBottom: moderateScale(5) },
              ]}>
              <CustomText weight="500" text="Bill Total" size={24} />
              <CustomText
                text={`₹${details?.totals?.grand_total.toFixed(2)}`}
                weight="500"
                size={24}
              />
            </View>
          </View>

          {/* Payment summary */}
          <View style={styles.borderline} />
          <View>
            <CustomText weight="500" size={18} text="Payment Summary" />

            <View style={{ marginTop: moderateScale(10) }}>
              <CustomText weight="500" size={18} text="Tax Summary" />

              {/* tax amount */}
              <View
                style={[
                  globalStyle.betweenCenter,
                  { marginTop: moderateScale(3) },
                ]}>
                <CustomText text="Tax Amount" weight="500" />
                <CustomText
                  text={`₹${invoice?.totals?.tax_amount}`}
                  weight="500"
                />
              </View>

              {/* cgst amount */}
              <View
                style={[
                  globalStyle.betweenCenter,
                  { marginTop: moderateScale(3) },
                ]}>
                <CustomText text="CGST" weight="500" />
                <CustomText
                  text={`₹${invoice?.totals?.tax_amount}`}
                  weight="500"
                />
              </View>

              {/* sgcgst amount */}
              <View
                style={[
                  globalStyle.betweenCenter,
                  { marginTop: moderateScale(3) },
                ]}>
                <CustomText text="SGST" weight="500" />
                <CustomText
                  text={`₹${invoice?.totals?.tax_amount}`}
                  weight="500"
                />
              </View>
            </View>
          </View>
        </>
      ) : (
        <ActivityIndicator size="large" style={{ flex: 1 }} />
      )}
    </Container>
  );
};

export default CompletedOrderDetails;

const styles = StyleSheet.create({
  img: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    borderRadius: moderateScale(8),
  },
  itemContainer: {
    width: '100%',
    borderRadius: moderateScale(8),
    padding: moderateScale(5),
    backgroundColor: '#fff',
    elevation: 5,
    height: screenWidth * 0.4,
    borderWidth: 1,
    alignSelf: 'center',
  },
  content: {
    flex: 0.6,
    marginHorizontal: moderateScale(10),
    // backgroundColor:"#000"
  },
  borderline: {
    width: '100%',
    height: 1.2,
    backgroundColor: '#ccc',
    marginVertical: moderateScale(10),
  },
});
