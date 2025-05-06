import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';

// import Container from '../../Component/Container';
// import CustomHeader1 from '../../Component/Custom/CustomHeader1';
// import ScannedCard1 from '../../Component/Cards/ScannedCard1';
// import makeApiRequest from '../../../utils/API/apiServices';
// import {DEFAULT_URL} from '../../../utils/API/api';
// import {getStorageData} from '../../../utils/helper';
// import {CustomToast} from '../../Component/Custom/CustomToast';
// import CustomButton from '../../Component/Custom/CustomButton';
// import {moderateScale} from '../../Component/Matrix/Matrix';
// import CustomText from '../../Component/Custom/CustomText';
// import Colors from '../../style/Colors';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Container from '../../../components/Container';
import CustomHeader2 from '../../../components/Customs/Header/CustomHeader2';
import CustomToast  from '../../../components/Customs/CustomToast';
import makeApiRequest from '../../../utils/ApiService';
import { DEFAULT_URL } from '../../../utils/api';
import ScannedCard1 from '../../../components/Cards/ScannedCard1';
import CustomButton from '../../../components/Customs/CustomButton';
import CustomText from '../../../components/Customs/CustomText';
import Colors from '../../../utils/Colors';
import { moderateScale } from '../../../components/Matrix/Matrix';

const ScannerCart = (props: any) => {
  const params = props.route.params;

  const [cartItems, setCartItems] = useState([]);
  const navigation = useNavigation();
  const { user } = useSelector((state: any) => state.user);
  const [loading, setLoading] = useState(false);

  const fetchCartItem = async () => {
    if (loading) return;

    const userId = user?.id;
    if (!userId) {
      CustomToast({
        type: 'error',
        text1: 'User not found',
        text2: 'Unable to process the scan.',
      });
      return;
    }

    try {
      setLoading(true);
      const response: any = await makeApiRequest({
        baseUrl: DEFAULT_URL,
        url: 'store-api/view-cart',
        data: { user_id: userId },
        method: 'POST',
        contentType: 'application/json',
      });

      setCartItems(response?.data);
    } catch (error) {
      console.log('error in the scanning cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // Call fetchCartItem only when needed
  useEffect(() => {
    if (!loading) {
      fetchCartItem();
    }
  }, []);

  const handleOrder = () => {
    navigation.navigate('ScanPaymentMethod', { item: cartItems });
  };

  console.log('==== item in teh scan cart ===', cartItems);

  return (
    <Container>
      <CustomHeader2 title="Scanned Cart" />

      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ flex: 1 }} />
      ) : (
        <View style={{ flex: 0.9 }}>
          {cartItems && cartItems.length > 0 ? (
            <FlatList
              data={cartItems}
              style={{ flex: 1 }}
              keyExtractor={(item: any) => item.product_id}
              renderItem={({ item }) => {
                return (
                  <ScannedCard1
                    setLoading={setLoading}
                    setCartItems={setCartItems}
                    fetchCartItem={fetchCartItem} // Pass function
                    item={item}
                  />
                );
              }}
            />
          ) : (
            <View>
              <CustomText
                size={18}
                weight="500"
                color={Colors.gray_font}
                text="No Item Added"
                customStyle={{ textAlign: 'center' }}
              />
            </View>
          )}
        </View>
      )}

      <View style={{ flex: 0.1 }}>
        <CustomButton
          title="Place Order"
          onPress={handleOrder}
          customStyle={styles.btn}
        />
      </View>
    </Container>
  );
};

export default ScannerCart;

const styles = StyleSheet.create({
  btn: {
    position: 'absolute',
    bottom: moderateScale(20),
    left: moderateScale(10),
    right: moderateScale(10),
  },
});
