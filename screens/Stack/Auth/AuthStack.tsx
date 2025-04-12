import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet, View } from "react-native";
import Login from "./Login/Login";
import SignUp from "./SignUp/SignUp";
import OtpVerification from "./Login/OtpVerification";
import Terms from "../App/Terms";
import Policy from "../App/Policy";

const AuthStack = () => {
    const Stack = createNativeStackNavigator();
    // const [isAuth,setIsAuth] = useState(false);
    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }} >
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen name='Login' component={Login} />
                <Stack.Screen name='OtpVerification' component={OtpVerification} />
                <Stack.Screen name='SignUp' component={SignUp} />
                <Stack.Screen name='Terms' component={Terms} />
                <Stack.Screen name='Policy' component={Policy} />
            </Stack.Navigator>
        </View>
    )
}

export default AuthStack;

const styles = StyleSheet.create({})