import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import Container from '../../components/Container'
import Images from '../../utils/Images'
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import CustomHeader2 from '../../components/Customs/Header/CustomHeader2'
import { featureList } from '../../redux/Slice/FeatureSlice'
import { moderateScale, screenHeight, screenWidth } from '../../components/Matrix/Matrix'
import Colors from '../../utils/Colors'
import CourseCard2 from '../../components/Cards/CourseCard2'
import AppBarSearch from '../../components/Cards/AppBarSearch'

const Course = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const { data } = useSelector((state: any) => state.feature);
  const { user } = useSelector((state: any) => state.user);
  const { location } = useSelector((state: any) => state.location);
  const dispatch = useDispatch();

  const { course } = data || [];


  // console.log("=== date in the feature course ====", data);


  const handlePressCourse = (item: any, id: string) => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'CourseDetails',
        params: {
          courseid: id,
          course: item,
        },
      }),
    );
  };

  return (
    <Container>
      <AppBarSearch
        color="white"
        icon={'arrow-back'}
        setLoading={setLoading}
        isTypeVisible={false}
        searchType="Course"
      />

      {loading ? (
        <ActivityIndicator size={20} color={Colors.black} />
      ) : (
        <>
          {course.length > 0 ? (
            <FlatList
              data={data?.course}
              renderItem={({ item }: any) => {

                return item["slot and time"]?.first_start_time && <CourseCard2 item={item} />
              }}
              keyExtractor={(item: any) => item.id}
              contentContainerStyle={{ paddingBottom: 20 }}
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
        </>
      )}
    </Container>
  )
}

export default Course

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
    padding: 10,
    backgroundColor: 'white',
    alignSelf: 'center',
    overflow: 'hidden',
  },
  row0: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: moderateScale(20),
  },
  logoImage: {
    width: "20%",
    height: "5%",
  },

  text0: {
    width: "90%",
    alignSelf: 'center',

    color: 'black',
    fontFamily: 'Roboto-Bold',
    fontSize: 14,
    // marginBottom:-0
  },
  card: {
    width: "90%",
    backgroundColor: 'white',
    padding: moderateScale(10),
    marginBottom: moderateScale(20),
    marginTop: moderateScale(5),
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    height: "20%",
    marginBottom: moderateScale(20),
    borderRadius: moderateScale(10),
    alignItems: 'center',
    alignSelf: 'center',
    flex: 1,
  },
  row: {
    width: "55%",

    flexDirection: 'row',
    alignItems: 'flex-start',
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
    width: "50%",
    marginLeft: 5,
    color: 'black',
    fontFamily: 'Roboto-Bold',
    fontSize: 12,
  },
  text2: {
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

    height: "6%",
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

  text1: {
    flexWrap: 'wrap',
    // textAlign: 'center',
    color: 'black',
    fontFamily: 'Roboto-Medium',
    fontSize: 16,
    letterSpacing: 1,
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
    fontSize: 12,
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