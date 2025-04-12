/* eslint-disable react/self-closing-comp */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { JSX, useState } from 'react';
import { FC } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

// import Colors from '../../style/Colors';
// import Container from '../../Component/Container';
// import { moderateScale } from '../../Component/Matrix/Matrix';
// import CustomText from '../../Component/Custom/CustomText';
// import TrainersCard1 from '../../Component/Cards/TrainersCard1';
import { useSelector } from 'react-redux';
import Container from '../../components/Container';
import CustomText from '../../components/Customs/CustomText';
import { moderateScale, screenHeight, screenWidth } from '../../components/Matrix/Matrix';
import AppBarSearch from '../../components/Cards/AppBarSearch';
import Colors from '../../utils/Colors';
import TrainersCard1 from '../../components/Cards/TrainerCard1';
const Trainer= (): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const feature = useSelector((state: any) => state.feature);
  const navigation = useNavigation();

  // console.log("===== feature in the training ====",feature);
  

  const renderItem = ({ item }: any) => (
    <TrainersCard1 item={item} />
  );
  return (
    <Container>
      <AppBarSearch
        color="white"
        icon={'arrow-back'}
        setLoading={setLoading}
        isTypeVisible={false}
        searchType="Trainer"
      />
      <View style={styles.container}>
        <CustomText text="Trainer" weight="700" size={20} />
        {loading ? (
          <ActivityIndicator size={20} color={Colors.black} />
        ) : feature?.data?.trainer.length > 0 ? (
          <FlatList
            data={
              feature?.data?.trainer.length > 0 ? feature?.data?.trainer : []
            }
            renderItem={renderItem}
            keyExtractor={(item: any) => item.id}
            contentContainerStyle={{
              paddingBottom: moderateScale(20), marginTop: moderateScale(10)
            }}
            showsVerticalScrollIndicator={false}
          // refreshControl={
          //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          // }
          />
        ) : (
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              No data available👎👎 Check your spelling
            </Text>
          </View>
        )}
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    // padding: 10,
    paddingBottom: 0,
    alignSelf: 'center',
    backgroundColor: 'white',
    // marginBottom
  },
  text: {
    width: screenWidth*.9,
    color: 'black',
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    alignSelf: 'center',
  },
  row0: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowimage: {
    width: screenWidth*.14,
    height: screenHeight*.07,
    borderRadius: moderateScale(100),
    marginBottom: moderateScale(20),
  },

  logoImage: {
    width: screenWidth*.14,
    height: screenHeight*.07,
},
tittle: {
    width: screenWidth*.68,
    color: 'black',
    fontFamily: 'Roboto-Bold',
    fontSize: 14,
    marginLeft: 5,
},
name: {
    width: screenWidth*.68,
    color: 'black',
    fontFamily: 'Roboto-Medium',
    fontSize: 15,

    marginBottom: 5,
  },
  rowTitle: {
    width: '100%',
    marginLeft: 5,
    marginBottom: 5,
  },

  text1: {
    width: '80%',
    display: 'flex',
    flexWrap: 'wrap',
    color: 'black',
    letterSpacing: 0.5,
    fontFamily: 'Roboto-Medium',
    fontSize: 15,
  },
  card: {
    width: screenWidth*.9,
    paddingBottom: 5,
    padding: 10,
    marginBottom: 20,
    backgroundColor: 'white',
    marginTop: 10,
    alignSelf: 'center',
  },
  image: {
    width: screenWidth*.9,
    height: screenHeight*.25,
    padding: 15,
    alignSelf: 'center',
    resizeMode: 'cover',
    marginBottom: 5,
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowSpace: {},
  text3: {
    width: screenWidth*.9,
    color: 'black',
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    // marginBottom: 10,
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
    fontSize: 18,
    color: 'black',
  },
});

export default Trainer;
