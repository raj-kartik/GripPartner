import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { FC, JSX, useCallback, useState } from 'react'
import commonStyle from '../../../../utils/CommonStyleComponent';
import AccountCourseCard from '../../../../components/Cards/AccountCourseCard';
import Container from '../../../../components/Container';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import makeApiRequest from '../../../../utils/ApiService';
import { BASE_URL } from '../../../../utils/api';
import { useSelector } from 'react-redux';

interface Props { }
const RetreatFollow: FC<Props> = ({ navigation, route }: any): JSX.Element => {
  // const { retreatid } = route.params;
  const [loading, setLoading] = useState(false);
  const [RetreatFollow, setRetreatFollow] = useState([]);
  const [message, setMessage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useSelector((state: any) => state.user);
  const login_id = user?.id;

  const onRefresh = () => {
    setRefreshing(true);
    RetreatFollowLisfun(); // re-fetch the data
    setRefreshing(false);
  };
  useFocusEffect(
    useCallback(() => {
      RetreatFollowLisfun();
    }, []),
  );

  const RetreatFollowLisfun = async () => {
    setLoading(true);
    try {
      const response: any = await makeApiRequest({
        method: "GET",
        baseUrl: BASE_URL,
        url: `user-retreat-lead-follow-list?user_id=${user?.id}`
      })

      console.log("==== response in the retreat follow ====", response);

      if (response.success === true) {
        setRetreatFollow(response?.lead_list);
        setMessage(response?.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error it');
    }
  };

  const ListDetailFun = (item: any) => {
    console.log(item);
    navigation.dispatch(
      CommonActions.navigate({
        name: 'RetreatFollowUpsDetail',
        params: {
          followid: item.lead_id,
        },
      }),
    );
  };

  // console.log('==== RetreatFollow =====', RetreatFollow);

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
        ) : RetreatFollow && RetreatFollow.length > 0 ? (
          RetreatFollow.map((item: any) => (
            <AccountCourseCard
              isHome={true}
              onPress={() => ListDetailFun(item)}
              item={{
                // id: item.id,
                name: item.name,
                course_name: item?.retreat_title,
                status: item?.lead_status,
                lead_date: item.created_at,
                image: item.image,
              }}
            />
          ))
        ) : (
          <View style={commonStyle.modalView}>
            <Text style={commonStyle.modalText}>{message} </Text>
          </View>
        )}
      </ScrollView>
    </Container>
  );
};

export default RetreatFollow

const styles = StyleSheet.create({})