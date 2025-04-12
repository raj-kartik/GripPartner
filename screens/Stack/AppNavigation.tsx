import { useEffect } from "react";
import { userDetail } from "../../redux/Slice/UserSlice/UserSlice";
import { ActivityIndicator, StyleSheet } from "react-native";
import AppStack from "./App/AppStack";
import AuthStack from "./Auth/AuthStack";
import { useDispatch, useSelector } from "react-redux";

const AppNavigation = () => {
    const user = useSelector((state: any) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUser = async () => {
            await dispatch(userDetail());
        }

        fetchUser();
    }, []);  // Track changes in user.auth and user.loading


    if (user?.loading) {
        return <ActivityIndicator style={{ flex: 1, backgroundColor: "#fff" }} color="#000" size="large" />;
    }


    // console.log("==== user auth ===", user);
    return (
        user?.auth ? <AppStack /> : <AuthStack />
    )
}

export default AppNavigation
const styles = StyleSheet.create({})