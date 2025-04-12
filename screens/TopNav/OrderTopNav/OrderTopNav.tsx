/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable prettier/prettier */

import Container from "../../../components/Container";
import CustomHeader2 from "../../../components/Customs/Header/CustomHeader2";
import ActiveScreen from "./ActiveScreen";
import CancelScreen from "./CancelScreen";
import CompletedScreen from "./CompletedScreen";

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
const Tab = createMaterialTopTabNavigator();

export default function OrderTopNavigation({ route }: any) {
  // const {jobid,screen} = route.params;
  return (
    <Container>
      <CustomHeader2 title="Order Status" />
      <Tab.Navigator
        // tabBar={props => <CustomOrderTopNavigation {...props} />}
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
      </Tab.Navigator>
    </Container>
  );
}
