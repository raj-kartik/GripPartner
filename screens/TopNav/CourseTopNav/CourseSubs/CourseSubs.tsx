import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useSelector } from 'react-redux';
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import makeApiRequest from '../../../../utils/ApiService';
import { BASE_URL } from '../../../../utils/api';
import Container from '../../../../components/Container';
import { moderateScale, screenWidth } from '../../../../components/Matrix/Matrix';
import SubscriptionCard from '../../../../components/Cards/SubscriptionCard';
import SubsSkeleton from '@components/Skeleton/SubsSkeleton';

const CourseSubs = () => {
  const [loading, setLoading] = useState(false);
  const [subs, setSubs] = useState([]);
  const { user } = useSelector((state: any) => state.user);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      fetchCourses();
    }, []),
  );

  const fetchCourses = async () => {
    const row = {
      userId: user?.id,
    };
    try {
      setLoading(true);

      // const response: any = await postMethod(`suscription-all`, row);
      const response: any = await makeApiRequest({
        baseUrl: BASE_URL,
        url: "suscription-all",
        method: "POST",
        data: row
      })

      console.log("==== response in the course subs ====", response);

      if (response.success === true) {
        setSubs(response.followUp);
      }
    } catch (error) {
      console.error('Failed to update lead status:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendId = (id: number) => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'CourseSubsDetails',
        params: {
          suscription_id: id,
        },
      }),
    );
  };

  return (
    <Container>
      <ScrollView
        style={{ flexGrow: 1, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}>
        {loading ? (
          <FlatList
            data={[1, 2, 3, 4]}
            style={{ paddingHorizontal: moderateScale(5), paddingTop: moderateScale(5) }}
            contentContainerStyle={{ rowGap: moderateScale(10) }}
            keyExtractor={(item: any) => item}
            renderItem={() => (
              <SubsSkeleton />
            )}
          />
        ) : subs.length > 0 ? (
          subs.map(item => {

            return (<SubscriptionCard item={item} handlePress={() => sendId(item.id)} />)
          })
        ) : (
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Oops! No Subscription found</Text>
          </View>
        )}
      </ScrollView>
    </Container>
  )
}

export default CourseSubs

const styles = StyleSheet.create({
  modalView: {
    width: screenWidth * .8,
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
  modalText: {
    width: screenWidth * .6,
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
    color: 'black',
  },
})