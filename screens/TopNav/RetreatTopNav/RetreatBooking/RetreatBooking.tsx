import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import makeApiRequest from '../../../../utils/ApiService';
import { BASE_URL } from '../../../../utils/api';
import Container from '../../../../components/Container';
import AccountCourseCard from '../../../../components/Cards/AccountCourseCard';
import commonStyle from '../../../../utils/CommonStyleComponent';

const RetreatBooking = () => {
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState([]);
  const [message, setMessage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useSelector((state: any) => state?.user);
  const navigation = useNavigation();

  const onRefresh = () => {
    setRefreshing(true);
    BookingLisfun(); // re-fetch the data
    setRefreshing(false);
  };
  useFocusEffect(
    useCallback(() => {
      BookingLisfun();
    }, []),
  );

  const BookingLisfun = async () => {
    setLoading(true);
    try {
      const endpoint = `user-retreat-booking-list?user_id=${user?.id}`;
      console.log(endpoint, 'endpo');
      // const response: any = await getMethod(endpoint);
      const response: any = await makeApiRequest({
        method: "GET",
        baseUrl: BASE_URL,
        url: endpoint
      })

      // console.log("===== response in the retreat booking ====", response);


      if (response?.success == true) {
        setBooking(response?.data);
        setMessage(response?.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error it');
    }
  };

  const ListDetailFun = (item: any) => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'RetreatBookingDetail',
        params: {
          Booking_id: item.id,
        },
      }),
    );
  };

  return (
    <Container>
      <ScrollView
        style={{ flexGrow: 1, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      // refreshControl={
      //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      // }
      >
        {loading ? (
          <ActivityIndicator size={20} color="black" />
        ) : booking ? (
          booking.map((item: any) => (
            <AccountCourseCard
              onPress={() => ListDetailFun(item)}
              item={{
                // id: item.id,
                name: item.name,
                course_name: item['retreat name'],
                status: item['payment status'],
                lead_date: item.date,
                image: item.image,
              }}
            />
          ))
        ) : (
          <View style={commonStyle.modalView}>
            <Text style={commonStyle.modalText}>No Booking Details</Text>
          </View>
        )}
      </ScrollView>
    </Container>
  )
}

export default RetreatBooking

const styles = StyleSheet.create({})