import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { CommonActions, useNavigation } from '@react-navigation/native';
import CustomText from '../Customs/CustomText';
import CustomIcon from '../Customs/CustomIcon';
import { moderateScale, screenWidth, verticalScale } from '../Matrix/Matrix';
import { globalStyle } from '../../utils/GlobalStyle';

const CourseDetailMenu = ({ isEnable = true, courseid, courseItem }: any) => {
  const navigation = useNavigation();

  // console.log("==== course item ====",courseItem);
  
  const courseMenuOptions = [
    {
      id: 1,
      label: 'Edit',
      route: 'Home',
    },
    {
      id: 2,
      label: 'Subscribed',
      route: 'CourseSubs',
    },
    {
      id: 3,
      label: 'Lead',
      route: 'CourseLead',
    },
    {
      id: 4,
      label: 'Follow Ups',
      route: 'CourseFollowUps',
    },
    {
      id: 5,
      label: isEnable ? 'Disable' : 'Enable',
      route: 'Home',
    },
  ];

  return (
    <View style={[globalStyle.between, styles.container]}>
      <View style={[globalStyle.flex]}>
        <Pressable onPress={() => navigation.goBack()}>
          <CustomIcon type="AntDesign" name="arrowleft" size={25} />
        </Pressable>
        <CustomText
          customStyle={{ marginLeft: moderateScale(5) }}
          text="Course Details"
          size={22}
          weight="700"
        />
      </View>

      <Menu>
        <MenuTrigger>
          <CustomIcon type="Entypo" name="dots-three-vertical" size={22} />
        </MenuTrigger>
        <MenuOptions
          customStyles={{
            optionsContainer: styles.optionsContainer,
          }}>
          {courseMenuOptions.map((item: any) => (
            <MenuOption
              key={item.id}
              onSelect={() => {

                if (item?.label === "Edit") {
                  navigation.navigate('TrainerNewCourse', {
                    course: courseItem
                  })
                }
                else {
                  navigation.dispatch(
                    CommonActions.navigate({
                      name: 'CourseTopNav',
                      params: {
                        courseid: courseid,
                        screen: item?.route,
                      },
                    }),
                  );
                }
              }}
              customStyles={{
                optionWrapper: styles.optionWrapper,
                optionText: styles.optionText,
              }}>
              <Text>{item.label}</Text>
            </MenuOption>
          ))}
        </MenuOptions>
      </Menu>
    </View>
  );
};

export default CourseDetailMenu;

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    alignSelf: 'center',
    // backgroundColor: 'rgba(118, 40, 40, 0.9)',
    paddingLeft: moderateScale(15),
    paddingRight: moderateScale(20),
    flex: 1,
    paddingVertical: moderateScale(10),
  },
  optionsContainer: {
    padding: moderateScale(10),
    borderRadius: moderateScale(10),
    backgroundColor: '#f7f7f7',
    elevation: 5,
    width: moderateScale(180),
    marginTop: moderateScale(10),
  },
  optionWrapper: {
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(15),
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
});
