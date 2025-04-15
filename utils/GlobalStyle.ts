import { StyleSheet } from "react-native";
import { moderateScale } from "../components/Matrix/Matrix";
import Colors from "./Colors";

export const globalStyle = StyleSheet.create({
    row:{
        flexDirection:"row",
        alignItems:"center"
    },
    flex:{
        flexDirection:"row"
    },
    between:{
        flexDirection:"row",
        justifyContent:"space-between"
    },
    betweenCenter:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between"
    },
    center:{
        justifyContent:"center",
        alignItems:"center"
    },
    container:{
        flex:1,
        backgroundColor:"#fff",
    },
    modalbar:{
        width:"30%",
        height:moderateScale(3),
        borderRadius:moderateScale(50),
        alignSelf:"center",
        backgroundColor:Colors.gray_font,
        marginVertical:moderateScale(5)
    }
})