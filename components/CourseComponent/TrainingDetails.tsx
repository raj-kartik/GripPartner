import { FC, JSX } from "react";
import { StyleSheet, View } from "react-native";
import { moderateScale, screenHeight, screenWidth } from "../Matrix/Matrix";
import { globalStyle } from "../../utils/GlobalStyle";
import CustomIcon from "../Customs/CustomIcon";
import CustomText from "../Customs/CustomText";
import Colors from "../../utils/Colors";

interface Props { }
const TrainingDetail: FC<Props> = ({
    item,
    Coursedata,
}: any): JSX.Element => {


    console.log("==== item in the training details ====",item);
    
    const trainingLevels = [
        {
            id: 1,
            label: 'Training',
            value: item?.training_level,
            iconType: 'Entypo',
            iconName: 'yelp',
        },
        {
            id: 2,
            label: 'Class',
            value: item?.class_type,
            iconType: 'Feather',
            iconName: 'award',
        },
        {
            id: 3,
            label: 'Focus',
            value: item?.body_focus,
            iconType: 'MaterialCommunityIcons',
            iconName: 'dumbbell',
        },
        {
            id: 4,
            label: 'Yoga Style',
            value: item?.yoga_style,
            iconType: 'MaterialCommunityIcons',
            iconName: 'yoga',
        },
    ];

    return (
        <View style={styles.container}>
            <View style={{ width: screenWidth * .95, alignSelf: 'center' }}>
                <View>
                    {trainingLevels.map((item, index) =>
                        item ? (
                            <View
                                key={index}
                                style={[
                                    globalStyle.flex,
                                    {
                                        marginBottom: moderateScale(10),
                                        marginTop: moderateScale(5),
                                        elevation: 4,
                                        backgroundColor: '#f7f7f7',
                                        paddingVertical: moderateScale(10),
                                        paddingHorizontal: moderateScale(5),
                                        borderRadius: moderateScale(8),
                                        width: '98%',
                                        alignSelf: 'center',
                                    },
                                ]}>
                                <View
                                    style={[
                                        globalStyle.center,
                                        {
                                            backgroundColor: 'rgba(247, 160, 17 ,0.1)',
                                            width: moderateScale(50),
                                            height: moderateScale(50),
                                            borderRadius: moderateScale(100),
                                            marginRight: moderateScale(5),
                                        },
                                    ]}>
                                    <CustomIcon
                                        color="#f7a011"
                                        type={item?.iconType}
                                        name={item?.iconName}
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <CustomText
                                        text={item?.label}
                                        size={16}
                                        weight="600"
                                        color={Colors.gray_font}
                                    />
                                    <CustomText
                                        text={item?.value}
                                        // color="rgba(255,0,0,1)"
                                        weight="500"
                                    />
                                </View>
                            </View>
                        ) : null,
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 2,
        // alignItems: 'flex-start',
        // marginBottom:20,
    },
    title: {
        fontFamily: 'Roboto-Black',
        fontWeight: 'bold',
        fontSize: 24,
        color: 'black',
        marginBottom: 20,
    },
    textInput: {
        width: "90%",
        minHeight: screenHeight * .07,
        backgroundColor: 'white',
        opacity: 658,
        elevation: 3,
        marginBottom: 15,
        borderRadius: 10,
        alignItems: 'center',
        paddingHorizontal: 15,
        // borderStartWidth:0.1,
        borderTopRightRadius: 10,
        alignSelf: 'center',
        borderTopLeftRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    text: {
        marginBottom: 5,
        color: 'black',
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
    },
    row: {
        // height: responsiveHeight(80),
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    row_container: {
        width: screenWidth * .4,
        height: screenHeight * .16,
        // padding:20,
        opacity: 958,
        elevation: 5,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        marginBottom: 20,
        borderLeftWidth: 0.1,
        // borderStartWidth:0.1,
        borderRightWidth: 0.1,
    },
    icon: {
        backgroundColor: 'white',
        width: 45,
        height: 45,
        opacity: 555,
        elevation: 2,
        borderRadius: 50,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    Active: {
        color: 'black',
        fontFamily: 'Roboto-Black',
    },
    btn: {
        width: screenWidth * .35,
        height: screenHeight * .06,
        backgroundColor: 'white',
        elevation: 2,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
        borderRadius: 10,
    },

    btnText: {
        color: 'black',
        fontSize: 18,
    },
});

export default TrainingDetail;
