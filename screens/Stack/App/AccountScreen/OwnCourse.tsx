import { FlatList, KeyboardAvoidingView, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import Container from '../../../../components/Container';
import CustomHeader2 from '../../../../components/Customs/Header/CustomHeader2';
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getCourse } from '../../../../redux/Slice/CourseSlice';
import ProfileCourseCard from '../../../../components/Cards/Course/ProfileCourseCard';
import Images from '../../../../utils/Images';
import CustomText from '../../../../components/Customs/CustomText';
import CustomIcon from '@components/Customs/CustomIcon';
import Colors from '@utils/Colors';
import StudioModal from '@components/Modal/StudioModal';
import CourseSkeleton from '@components/Skeleton/CourseSkeleton';
import { moderateScale } from '@components/Matrix/Matrix';
import { globalStyle } from '@utils/GlobalStyle';

const OwnCourse = () => {
  const dispatch = useDispatch();
  const { user }: any = useSelector((state: any) => state?.user);
  const { course, loading }: any = useSelector((state: any) => state?.course);
  const [studioModal, setStudioModal] = useState(false);
  const [studio, setStudio] = useState<any>(null);
  const [studioText, setStudioText] = useState<string>('');
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = React.useState(false);
  const [filteredCourses, setFilteredCourses] = useState(course);
  const [isClear, setIsClear] = useState(false);

  // console.log("----- course -----", course);
  // console.log("----- filteredCourses -----", filteredCourses);

  const handleSearch = (text: string) => {
    setStudioText(text);
    setStudio({});
    const filtered = course.filter((item: any) =>
      (
        item?.name +
        item?.description +
        item?.trainer +
        item?.yoga_style +
        item?.training_level +
        item?.body_focus +
        item?.class_type
      ).toLowerCase().includes(text.toLowerCase())
    );

    setFilteredCourses(filtered);
  };

  useFocusEffect(
    useCallback(() => {
      fetchCourses('');
    }, []),
  );

  useEffect(() => {
    setFilteredCourses(course)
  }, [loading])


  const fetchCourses = async (id = '') => {
    await dispatch(getCourse({ id: user?.id, studio_id: id }));
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCourses('').then(() => setRefreshing(false));
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

      <KeyboardAvoidingView style={{ flex: 1 }} >
        <View style={[globalStyle.row, styles.inputView]} >
          <View style={[globalStyle.row, { flex: 1 }]} >
            <CustomIcon
              type='AntDesign'
              name='search1'
              size={28}
            />
            <TextInput
              placeholder='Eg. Studio Name'
              value={studioText || studio?.studio_name}
              onChangeText={handleSearch}
              placeholderTextColor={Colors.gray_font}
              style={{ color: "#000", fontSize: 16, flex: 1 }}
            />
          </View>
          <TouchableOpacity onPress={() => {
            setStudioModal(true)
          }} style={styles.filterView} >
            {/* <CustomText text={ studio?.studio_name ||  'Select Studio'} weight='500' /> */}
            <CustomIcon
              type='AntDesign'
              name='filter'
            />
          </TouchableOpacity>
        </View>

        <StudioModal
          modal={studioModal}
          isClear={true}
          setModal={setStudioModal}
          selectStudio={studio}
          handleClear={() => {
            fetchCourses('');
          }}
          handleStudio={(selectStudio: any) => {
            setStudio(selectStudio);
            setFilteredCourses([]);
            fetchCourses(selectStudio?.id);
          }}
        />

        {
          loading ?
            <FlatList
              data={[1, 2, 3]}
              keyExtractor={(item, index) => item}
              renderItem={({ item }: any) => {
                return <CourseSkeleton />
              }}
            />
            : (
              <View style={{ flex: 1 }} >

                {filteredCourses && filteredCourses.length > 0 ? <FlatList
                  data={filteredCourses}
                  keyboardShouldPersistTaps="handled"
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
            )
        }



      </KeyboardAvoidingView>
    </Container>
  );
};

export default OwnCourse;

const styles = StyleSheet.create({
  inputView: {
    borderWidth: .5,
    borderRadius: moderateScale(30),
    height: moderateScale(50),
    paddingHorizontal: moderateScale(5),
    paddingVertical: moderateScale(5),
    marginVertical: moderateScale(10),
    elevation: 5,
    backgroundColor: "#fff"
  },
  filterView: {
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(60),
  }
});
