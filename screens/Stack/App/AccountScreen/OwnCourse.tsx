import { FlatList, StyleSheet, Text, View } from 'react-native';
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

const OwnCourse = () => {
  const dispatch = useDispatch();
  const { user }: any = useSelector((state: any) => state?.user);
  const { course } = useSelector((state: any) => state?.course);
  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      const fetchCourses = async () => {
        await dispatch(getCourse(user?.id));
      };

      fetchCourses();
    }, []),
  );
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
          renderItem={({ item }) => { return <ProfileCourseCard item={item} /> }}
          showsVerticalScrollIndicator={false}
        /> : <View>
          <Images.Logo />
          <CustomText text='No Course Found' />
        </View>}
      </View>
    </Container>
  );
};

export default OwnCourse;

const styles = StyleSheet.create({});
