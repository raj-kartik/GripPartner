import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import React, { useCallback } from 'react';
import Container from '../../../../components/Container';
import CustomHeader2 from '../../../../components/Customs/Header/CustomHeader2';
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getCourse } from '../../../../redux/Slice/CourseSlice';
import ProfileCourseCard from '../../../../components/Cards/Course/ProfileCourseCard';
import { moderateScale } from '../../../../components/Matrix/Matrix';
import Images from '../../../../utils/Images';
import CustomText from '../../../../components/Customs/CustomText';
import { globalStyle } from '../../../../utils/GlobalStyle';

const OwnCourse = () => {
  const dispatch = useDispatch();
  const { user }: any = useSelector((state: any) => state?.user);
  const { course } = useSelector((state: any) => state?.course);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = React.useState(false);

  // console.log("----- user id -----",user?.id);

  useFocusEffect(
    useCallback(() => {
      fetchCourses();
    }, []),
  );

  const fetchCourses = async () => {
    await dispatch(getCourse(user?.id));
  };
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCourses().then(() => setRefreshing(false));
  }, []);

  return (
    <Container>
      <CustomHeader2 title="Own Courses" isMore={true} iconType="AntDesign" iconName="plus" handleMore={() => {
        navigation.dispatch(
          CommonActions.navigate({
            // name: 'NewCourseScreen',
            name: 'TrainerNewCourse',
          }),
        );
      }} />

      <View style={{ flex: 1 }} >
        {course && course.length > 0 ? <FlatList
          data={course}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={'#000'}
              colors={['#000']}
              progressBackgroundColor="#fff"
            />
          }
          renderItem={({ item }) => { return <ProfileCourseCard item={item} /> }}
          showsVerticalScrollIndicator={false}
        /> : <View style={[globalStyle.center, { flex: 1 }]} >
          <Images.Logo width={moderateScale(100)} height={moderateScale(100)} />
          <CustomText text='No Course Found' weight='500' size={18} />
        </View>}
      </View>
    </Container>
  );
};

export default OwnCourse;

const styles = StyleSheet.create({});
