import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { moderateScale } from "../../../components/Matrix/Matrix";
import { Pressable, View } from "react-native";
import CustomRetreatTopNavigator from "./CustomRetreatTopNavigator";
import CustomIcon from "../../../components/Customs/CustomIcon";
import CustomText from "../../../components/Customs/CustomText";
import { globalStyle } from "../../../utils/GlobalStyle";
import RetreatBooking from "./RetreatBooking/RetreatBooking";
import RetreatLead from "./RetreatLead/RetreatLead";
import RetreatFollow from "./RetreatFollowUps/RetreatFollow";
import RetreatStudent from "./RetreatStudent/RetreatStudent";
import { useNavigation } from "@react-navigation/native";

const RetreatTopNav = ({ route }: any) => {
  const Tab = createMaterialTopTabNavigator();
  const navigation = useNavigation();
  // const { screen }: any = route?.params;

  const tabArray = [
    {
      id: 1,
      label: "Booking",
      route: "RetreatBooking",
      component: RetreatBooking
    },
    {
      id: 2,
      label: "Lead",
      route: "RetreatLead",
      component: RetreatLead
    },
    {
      id: 4,
      label: "Follow Up",
      route: "RetreatFollow",
      component: RetreatFollow
    },
    {
      id: 3,
      label: "Student",
      route: "RetreatStudent",
      component: RetreatStudent
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
      // initialRouteName={screen}
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

export default RetreatTopNav;