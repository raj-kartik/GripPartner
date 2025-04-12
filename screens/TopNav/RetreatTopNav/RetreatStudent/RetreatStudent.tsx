import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { FC, JSX, useCallback, useState } from 'react'
import commonStyle from '../../../../utils/CommonStyleComponent';
import AccountCourseCard from '../../../../components/Cards/AccountCourseCard';
import Container from '../../../../components/Container';
import makeApiRequest from '../../../../utils/ApiService';
import { BASE_URL } from '../../../../utils/api';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';

interface Props {

}
const RetreatStudent: FC<Props> = (): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState([]);
  const [message, setMessage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useSelector((state: any) => state.user);
  const onRefresh = () => {
    setRefreshing(true);
    leadLisfun(); // re-fetch the data
    setRefreshing(false);
  };
  useFocusEffect(
    useCallback(() => {
      leadLisfun();
    }, []),
  );

  const leadLisfun = async () => {
    setLoading(true);
    try {
      const response: any = await makeApiRequest({
        method: "POST",
        baseUrl: BASE_URL,
        url: `user-retreat-student-list?user_id=${user?.id}`
      })

      console.log("---- response in the student retreat ----", response);

      if (response.success === true) {
        setStudent(response?.student_list);
        setMessage(response?.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error it');
    }
  };
  return (
    <Container>
      {loading ? (
        <ActivityIndicator color="black" size={20} />
      ) : student ? (
        <ScrollView
          style={{ flexGrow: 1, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        // refreshControl={
        //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        // }
        >
          {student.map((item: any, index: number) => (
            <View key={item.id}>
              <AccountCourseCard
                // onPress={() => ListDetailFun(item)}
                item={{
                  name: item.name,
                  course_name: item?.retreat,
                  lead_date: item.applied_on,
                }}
              />
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={commonStyle.modalView}>
          <Text style={commonStyle.modalText}>{message}</Text>
        </View>
      )}
    </Container>
  );
};

export default RetreatStudent

const styles = StyleSheet.create({})