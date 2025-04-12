/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable quotes */
/* eslint-disable no-unreachable */
/* eslint-disable space-infix-ops */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */

import React, { useCallback, useEffect, useId, useMemo, useState } from 'react';
import { FC } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ActivityIndicator,
  Pressable,
  Alert,
} from 'react-native';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Container from '../../components/Container';
import AppBarSearch from '../../components/Cards/AppBarSearch';
import { moderateScale, screenHeight, screenWidth } from '../../components/Matrix/Matrix';
import RetreatCard1 from '../../components/Cards/RetreatCard1';
import makeApiRequest from '../../utils/ApiService';
import { BASE_URL, DEFAULT_URL } from '../../utils/api';
import axios from 'axios';

interface Props {
  navigation: any;
}

const Retreat: FC<Props> = ({ navigation }) => {
  // navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [retreat, setRetreat] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [retreatId, setReatreatId] = useState([]);
  const { user } = useSelector((state: any) => state?.user);
  const userId = user?.id
  const [refreshing, setRefreshing] = useState(false);
  const { data } = useSelector((state: any) => state.feature);
  const onRefresh = async () => {
    setRefreshing(true); // Start refreshing
    setCurrentPage(1); // Reset to page 1 for fresh data
    setRefreshing(false); // Stop refreshing when done
  };

  // useFocusEffect(
  //   useCallback(() => {
  //     const fetchAndProcessRetreats = async () => {
  //       const retreatData = data?.retreat;
  //       if (retreatData && retreatData.length > 0) {
  //         // Start with existing IDs
  //         const allIds = [...retreatId];

  //         // Add current retreat IDs
  //         retreatData.forEach((item: any) => {
  //           allIds.push(item.id);
  //         });

  //         // Remove duplicates
  //         const uniqueIds = [...new Set(allIds)];
  //         console.warn(uniqueIds);
  //         setReatreatId(uniqueIds);

  //         // await retreatImpression(uniqueIds);
  //       }
  //     };

  //     fetchAndProcessRetreats();
  //   }, []),
  // );


  // const retreatImpression = async (retreatIds: any) => {
  //   setLoading(true);
  //   try {
  //     const row = {
  //       userIP: 'jj',
  //       userCountry: 'jjj',
  //       dataArray: [{ retreat: retreatIds }], // Use passed retreatIds
  //     };

  //     const response: any = await axios.post(`${BASE_URL}"tracking-site"`, row);

  //     console.log("==== response in the retreat data ====", response);

  //     setLoading(false);
  //     if (response.status === 200) {
  //       console.warn(response.data, row.dataArray, 'j');
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     setLoading(false); // Ensure loading state is reset on error
  //   }
  // };


  const renderItem = ({ item }: any) => (
    <RetreatCard1 item={item} userId={userId} width={"98%"} />
  );

  return (
    <Container>
      <AppBarSearch
        color="white"
        icon={'arrow-back'}
        setLoading={setLoading}
        isTypeVisible={false}
        searchType="Retreat"
      />
      {data?.retreat && data?.retreat.length > 0 ? (
        <FlatList
          data={data?.retreat}
          renderItem={renderItem}
          keyExtractor={(item: any) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          onRefresh={onRefresh} // Add this to trigger the refresh
          refreshing={refreshing}
        />
      ) : (
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            No data available👎👎 Check your spelling
          </Text>
        </View>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // width: wp('100%'),
    // height: hp('100%'),
    // padding: 10,
    backgroundColor: 'white',
    alignSelf: 'center',
    overflow: 'hidden',
  },
  row0: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoImage: {
    width: screenWidth * .2,
    height: screenHeight * .05,
  },

  text0: {
    width: screenWidth * .9,
    alignSelf: 'center',

    color: 'black',
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    // marginBottom:-0
  },
  card: {
    width: screenWidth * .9,
    backgroundColor: 'white',
    padding: moderateScale(5),
    marginBottom: moderateScale(20),
    marginTop: moderateScale(5),
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    height: screenHeight * .2,
    marginBottom: moderateScale(5),
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
  },
  row: {
    width: screenWidth * .5,
    flexDirection: 'row',
    // alignItems: 'center',
    gap: 5,
    marginBottom: 5,
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowSpace: {
    width: 25,
    alignItems: 'center',
  },
  text: {
    width: screenWidth * .6,
    marginLeft: 5,
    color: 'black',
    fontFamily: 'Roboto-Bold',
    fontSize: 14,
    // marginBottom:5
  },
  text2: {
    width: screenWidth * .7,
    color: 'black',
    fontFamily: 'Roboto-regular',
    fontSize: 20,
    marginBottom: 0,
  },
  review: {
    color: 'black',
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    marginLeft: 8,
  },
  btn: {
    width: '100%',

    height: screenHeight * .06,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    elevation: 1,
    borderColor: 'white',
    position: 'static',
    alignSelf: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  btnText: {
    color: 'white',
    fontSize: 15,
    // marginLeft: 10,
  },

  text1: {
    flexWrap: 'wrap',
    // textAlign: 'center',
    color: 'black',
    fontFamily: 'Roboto-Medium',
    fontSize: 15,
    letterSpacing: 1,
    // marginBottom:5
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  rowColumn: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  rowText: {
    color: 'black',
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
  },

  // Model
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
    color: 'black',
  },
});

export default Retreat;
