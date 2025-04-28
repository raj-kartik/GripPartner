import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useCallback, useEffect } from "react";
import { Keyboard, Platform } from "react-native";
import { moderateScale } from "../Matrix/Matrix";
import CustomBottomTabBar from "./CustomBottom";
import HomeBlank from "../../screens/Bottom/HomeBlank";
import Products from "../../screens/Bottom/Products";
import Notifications from "../../screens/Bottom/Notifications";
import Profile from "../../screens/Bottom/Profile";
import Scanner from "../../screens/Bottom/Scanner";
import Colors from "../../utils/Colors";
import Home from "../../screens/Drawer/Home";
import ShopDrawer from "../../screens/Drawer/ShopDrawer/ShopDrawer";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { addToCart } from "../../redux/Slice/AddToCartSlice";


const Tab = createBottomTabNavigator();


const { Navigator, Screen } = createBottomTabNavigator();
export function BottomTabs(route: any) {
    const dispatch = useDispatch();
    
    const { data } = useSelector((state: any) => state?.cart);
    useFocusEffect(useCallback(() => {
        const fetchCart = async () => {
            await dispatch(addToCart());
        }
        fetchCart();
    }, []));

    const TabArr = [
        {
            id: 0,
            route: 'Home',
            label: 'Home',
            type: 'Octicons',
            icon: 'home',
            // inActive: Images.Home,
            // active: Images.Home,
            component: Home,
            data:0
        },
        {
            id: 1,
            route: 'ShopDrawer',
            label: 'Shopping',
            type: 'Feather',
            icon: 'shopping-cart',
            // inActive: Images.Home,
            // active: Images.Home,
            component: ShopDrawer,
            data:data?.cart_items.length
        },
        {
            id: 2,
            route: 'Scanner',
            label: 'Scanner',
            type: "Ionicons",
            icon: "scan",
            // inActive: Images.Scanner,
            // active: Images.Scanner,
            component: Scanner,
            data:0
        },
        {
            id: 3,
            route: 'Notification',
            label: 'Notification',
            type: "Feather",
            icon: "bell",
            component: Notifications,
            data:0
        },
        {
            id: 4,
            route: 'Profile',
            label: 'Profile',
            type: 'Feather',
            icon: 'user',
            component: Profile,
            data:0
        }
    ];

    const [tabBarVisible, setTabBarVisible] = React.useState(true);

    React.useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow',
            () => setTabBarVisible(false),
        );
        const keyboardDidHideListener = Keyboard.addListener(
            Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide',
            () => setTabBarVisible(true),
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    return (
        <Navigator
            screenOptions={{
                tabBarStyle: {
                    padding: moderateScale(10),
                },
            }}
            tabBar={props =>
                tabBarVisible && <CustomBottomTabBar {...props} colors={Colors} />
            }
        >
            {TabArr.map(item => {
                return (
                    <Screen
                        key={item.id}
                        name={item.route}
                        component={item.component}
                        options={{
                            tabBarLabel: item.label,
                            Active: item.active,
                            headerShown: false,
                            InActive: item.inActive,
                            type: item?.type,
                            icon: item?.icon,
                            data:item?.data
                        }}
                    />
                );
            })}
        </Navigator>
    );
}