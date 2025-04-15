import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useSelector } from 'react-redux';
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import makeApiRequest from '../../../../utils/ApiService';
import { BASE_URL } from '../../../../utils/api';
import Container from '../../../../components/Container';
import CustomText from '../../../../components/Customs/CustomText';
import { moderateScale, screenHeight } from '../../../../components/Matrix/Matrix';
import CustomIcon from '../../../../components/Customs/CustomIcon';
import commonStyle from '../../../../utils/CommonStyleComponent';
import Colors from '../../../../utils/Colors';

const CourseFollowUps = () => {
  const [loading, setLoading] = useState(false);
  const [follow, setFollow] = useState([]);
  const { user } = useSelector((state: any) => state.user);

  const navigation = useNavigation();
  const sentFun = (item: any) => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'CourseFollowDetails',
        params: {
          follow: item,
          lead_id: item.lead_id,
        },
      }),
    );
  };

  useFocusEffect(
    useCallback(() => {
      fetchCourses();
    }, []),
  );

  const fetchCourses = async () => {
    setLoading(true);
    const row = {
      userId: user?.id,
    };
    try {
      // const response: any = await postMethod(`followup-all`, row);
      const response: any = await makeApiRequest({
        method: "POST",
        url: "followup-all",
        baseUrl: BASE_URL,
        data: row
      })

      console.log("==== response in the follow ups ====",response);
      
      if (response?.success === true) {
        setFollow(response?.followUp);
      }
    } catch (error) {
      console.error('Failed to update lead status:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <ScrollView
        style={{ flexGrow: 1, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size={20} color="black" />
        ) : follow.length > 0 ? (
          follow.map((item: any) => (
            <Pressable style={styles.row} onPress={() => sentFun(item)}>
              <View style={styles.row1}>
                {/* <Avatar
                  size={50}
                  avatarStyle={{backgroundColor: '#D3D3D3'}}
                  rounded
                  source={require('../../../img/one.jpeg')}
                /> */}
                <View>
                  <CustomText
                    size={20}
                    weight="700"
                    // family="Roboto-Bold"
                    text={item?.Name || 'No Name'}
                  />
                  <CustomText size={12} text={item?.course_name} weight="500" />
                </View>
              </View>

              <View>
                <View style={[styles.row1, { marginBottom: moderateScale(5) }]}>
                  <CustomIcon size={20} type='MaterialCommunityIcons' name='message-reply-outline' />
                  <CustomText
                    text={
                      item.comments.length > 10
                        ? `${item.comments.substring(0, 10)}...`
                        : item.comments
                    }
                    weight="500"
                  />
                </View>
                <View style={styles.row1}>
                  <CustomIcon type='Feather' name='calendar' size={20} color='#000' />
                  <CustomText text={item?.follow_up_date} weight="500" />
                </View>
              </View>
            </Pressable>
          ))
        ) : (
          <View style={commonStyle.modalView}>
            <Text style={commonStyle.modalText}>No Follow up found</Text>
          </View>
        )}
      </ScrollView>
    </Container>
  )
}

export default CourseFollowUps

const styles = StyleSheet.create({
  row: {
    backgroundColor: '#fff',
    elevation: 5,
    borderRadius: moderateScale(20),
    width: '99%',
    height: screenHeight * .1,
    padding: 10,
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: moderateScale(15),
    borderWidth: 0.5,
    borderColor: Colors.lightGray,
  },
  row1: {
    flexDirection: 'row',
    gap: 10,
  },
})