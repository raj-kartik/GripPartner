import { StyleSheet } from "react-native";
import { screenWidth } from "../components/Matrix/Matrix";

const commonStyle =StyleSheet.create({
    modalView: {
        width: screenWidth*.8,
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      modalText: {
        width: screenWidth*.6,
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 16,
        color: 'black',
      },
})

export default commonStyle;