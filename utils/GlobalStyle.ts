import { StyleSheet } from "react-native";

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
    }
})