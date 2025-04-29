import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CourseSubs from './CourseSubs/CourseSubs';
import CourseLead from './CourseLead/CourseLead';
import CourseStudent from './CourseStudent/CourseStudent';
import CourseFollowUps from './CourseFollowUps/CourseFollowUps';
import CustomRetreatTopNavigator from '../RetreatTopNav/CustomRetreatTopNavigator';
import Container from '../../../components/Container';
import CustomHeader2 from '../../../components/Customs/Header/CustomHeader2';
import CustomIcon from '../../../components/Customs/CustomIcon';
import { globalStyle } from '../../../utils/GlobalStyle';
import { moderateScale } from '../../../components/Matrix/Matrix';
import CustomText from '../../../components/Customs/CustomText';
import { useNavigation } from '@react-navigation/native';

const CourseTopNav = ({ route }: any) => {
    const { screen } = route?.params;
    const Tab = createMaterialTopTabNavigator();
    const navigation = useNavigation();

    const tabArray = [
        {
            id: 1,
            label: "Subscribe",
            route: "CourseSubs",
            component: CourseSubs
        },
        {
            id: 2,
            label: "Lead",
            route: "CourseLead",
            component: CourseLead
        },
        {
            id: 4,
            label: "Follow Up",
            route: "CourseFollowUps",
            component: CourseFollowUps
        },
        {
            id: 3,
            label: "Student",
            route: "CourseStudent",
            component: CourseStudent
        },
    ]
    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }} >
            <View style={[globalStyle.row, { paddingHorizontal: moderateScale(15), marginVertical: moderateScale(15) }]} >
                <Pressable onPress={() => {
                    navigation.goBack();
                }} >
                    <CustomIcon type='AntDesign' name='arrowleft' size={25} />
                </Pressable>
                <CustomText customStyle={{ marginLeft: moderateScale(10) }} text='Leads & Follow Ups' weight='700' size={20} />
            </View>
            <Tab.Navigator
                tabBar={props => <CustomRetreatTopNavigator {...props} />}
                initialRouteName={screen}
            >
                {
                    tabArray.map((item) => (
                        <Tab.Screen
                            key={item?.id}
                            name={item?.route}
                            component={item?.component}
                            options={{ tabBarLabel: item?.label }}
                        />
                    ))
                }
            </Tab.Navigator>
        </View>
    )
}

export default CourseTopNav

const styles = StyleSheet.create({})