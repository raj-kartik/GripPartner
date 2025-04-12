/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable prettier/prettier */


import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// import CustomJobTopNavigation from './CustomJobTopNavigation';
// import CompletedScreen from '../../screens/Ecom/Order/CompletedScreen';
// import ActiveScreen from '../../screens/Ecom/Order/ActiveScreen';
// import CancelScreen from '../../screens/Ecom/Order/CancelScreen';
// import CustomOrderTopNavigation from './CustomOrderTopNavigation';
// import StoreOrder from '../../screens/Ecom/Order/StoreOrder';

const Tab = createMaterialTopTabNavigator();

export default function OrderTopNavigation({ route }: any) {
    // const {jobid,screen} = route.params;
    return (
        <Tab.Navigator
            //   tabBar={props => <CustomOrderTopNavigation {...props} />}
            initialRouteName="Active">
            <Tab.Screen
                name="Active" // Change this to "LeadList" to match navigation name
                component={ActiveScreen}
                options={{ tabBarLabel: 'Processing' }}
            />
            <Tab.Screen
                name="Completed"
                component={CompletedScreen}
                options={{ tabBarLabel: 'Completed' }}
            />
            <Tab.Screen
                name="Cencelled"
                component={CancelScreen}
                options={{ tabBarLabel: 'Cancelled' }}
            />
            {/* <Tab.Screen
        name="Store"
        component={StoreOrder}
        options={{tabBarLabel: 'In-Store'}}
      /> */}
        </Tab.Navigator>
    );
}
