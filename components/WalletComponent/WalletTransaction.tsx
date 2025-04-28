import { FlatList, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Colors from '../../utils/Colors';
import { useDispatch, useSelector } from 'react-redux';
import makeApiRequest from '../../utils/ApiService';
import { GET_TRANSAXTION } from '../../utils/api';
import { moderateScale, screenHeight } from '../Matrix/Matrix';
import Images from '../../utils/Images';
import { globalStyle } from '../../utils/GlobalStyle';
import CustomText from '../Customs/CustomText';
import moment from 'moment';

const WalletTransaction = () => {
  const [loading, setLoading] = useState(false);
  const [transaction, setTransaction] = useState<any>([]);
  const { user } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  console.log('====== user in the transaction ===', transaction);

  useEffect(() => {
    const fetchTransaction = async () => {
      setLoading(true);
      try {
        const response: any = await makeApiRequest({
          url: GET_TRANSAXTION,
          method: 'POST',
          data: { user_id: user?.id },
        });
        // console.log("==== response in transaction ====", response);

        if (response?.status === 'success') {
          setLoading(false);
          setTransaction(response?.transactions);
        }
      } catch (error) {
        console.log('==== error in transaction ====', error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, []);

  console.log('==== response in transaction ====', transaction);

  return (
    <View style={{ marginTop: moderateScale(5), flex: 1 }}>
      {transaction && transaction.length > 0 ? (
        <FlatList
          data={transaction}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item: any) => item?.id}
          renderItem={({ item }: any) => (
            <View
              style={[
                globalStyle.betweenCenter,
                styles.transactionContainer,
                { backgroundColor: '#fff' },
              ]}>
              <View style={{ flex: 0.8 }}>
                <CustomText
                  text={item?.name || 'Wallet Transaction'}
                  size={20}
                  weight="600"
                  color={item?.type === 'debit' ? Colors.red : Colors.success}
                />
                {/* <CustomText text={item?.date.slice(0,10)} color='#000' size={14} weight='500' /> */}
                <CustomText text={moment(item?.date).format('MMMM Do YYYY, h:mm a')} size={14} weight='500' />
                <CustomText
                  // color={item?.type === 'debit' ? Colors.red : Colors.success}
                  color={Colors.gray_font}
                  text={`₹${item?.amount}`}
                  size={16}
                  weight="600"
                  customStyle={{ marginTop: moderateScale(3) }}
                />
              </View>
              <View style={[globalStyle.center, { flex: 0.2 }]}>
                {item?.type === 'debit' ? (
                  <Images.Redcoin
                    width={moderateScale(50)}
                    stroke="#ff0000"
                    height={moderateScale(50)}
                  />
                ) : (
                  <Images.Coins
                    width={moderateScale(50)}
                    height={moderateScale(50)}
                  />
                )}
              </View>
            </View>
          )}
        />
      ) : (
        <CustomText
          text="No Transactions"
          color={Colors.gray_font}
          size={18}
          weight="500"
          customStyle={{ textAlign: 'center' }}
        />
      )}
    </View>
  );
};

export default WalletTransaction;

const styles = StyleSheet.create({
  transactionContainer: {
    height: screenHeight * 0.12,
    borderRadius: moderateScale(8),
    padding: moderateScale(8),
    alignSelf: 'center',
    width: '98%',
    elevation: 5,
    marginBottom: moderateScale(10),
    marginTop: moderateScale(5),
  },
});
