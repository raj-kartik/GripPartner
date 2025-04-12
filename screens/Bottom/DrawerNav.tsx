import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import Course from '../Drawer/Course';
import Retreat from '../Drawer/Retreat';
import HomeBlank from './HomeBlank';
import Trainer from '../Drawer/Trainer';
import CustomDrawer from '../Drawer/CustomDrawer';
import { moderateScale } from '../../components/Matrix/Matrix';

const DrawerNav = () => {
    const { Navigator, Screen } = createDrawerNavigator();

    const DrawerNav = [
        {
            id: 1,
            route: "HomeBlank",
            label: "Home",
            type: "Feather",
            icon: 'home',
            component: HomeBlank
        },
        {
            id: 2,
            label: "Course",
            route: "Course",
            type: "MaterialCommunityIcons",
            icon: 'yoga',
            component: Course
        },
        {
            id: 3,
            label: "Retreat",
            route: "Retreat",
            type: "MaterialIcons",
            icon: 'area-chart',
            component: Retreat
        },
        {
            id: 4,
            label: "Trainer",
            route: "Trainer",
            type: "FontAwesome",
            icon: 'universal-access',
            component: Trainer
        },
    ]

    return (
        <Navigator initialRouteName='HomeBlank' screenOptions={{
            headerShown: false,
            gestureEnabled: true,
            swipeEdgeWidth: moderateScale(50),
            drawerStyle: {
                backgroundColor: '#fff',
                width: moderateScale(240),
            },
        }}
            drawerContent={props => <CustomDrawer {...props} />}
        >
            {DrawerNav.map(item => {
                return (
                    <Screen
                        key={item.id}
                        name={item.route}
                        component={item.component}
                        options={{
                            tabBarLabel: item.label,
                            headerShown: false,
                            type: item?.type,
                            icon: item?.icon
                        }}
                    />
                );
            })}
        </Navigator>
    )
}

export default DrawerNav

const styles = StyleSheet.create({})