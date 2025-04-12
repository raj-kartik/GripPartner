import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { CustomToast } from '../Customs/CustomToast';
import { moderateScale } from '../Matrix/Matrix';
import Colors from '../../utils/Colors';
import { globalStyle } from '../../utils/GlobalStyle';
import CustomText from '../Customs/CustomText';
import CustomIcon from '../Customs/CustomIcon';
import Images from '../../utils/Images';
// import {Images} from '../../../../../../utils/Images/Images';


const AccountCourseCard = ({
    item,
    isDisable = false,
    onPress,
    isHome = false,
}: any) => {
    const navigation = useNavigation();
    const ListDetailFun = (item: any) => {
        navigation.dispatch(
            CommonActions.navigate({
                name: 'UserCourseDetail',
                params: {
                    course_id: item,
                },
            }),
        );
    };

    return (
        <Pressable
            disabled={isDisable}
            style={[globalStyle.flex, styles.container]}
            // key={item.id}
            onPress={onPress}>
            <View style={[globalStyle.flex, { flex: 0.75 }]}>
                {item?.image ? (
                    <Image
                        source={{ uri: item.image }}
                        width={moderateScale(60)}
                        height={moderateScale(60)}
                        style={{ borderRadius: moderateScale(100) }}
                    />
                ) : (
                    <View
                        style={[
                            globalStyle.center,
                            {
                                width: moderateScale(60),
                                height: moderateScale(60),
                                borderRadius: moderateScale(90),
                                backgroundColor: '#fff',
                                marginRight: moderateScale(5),
                            },
                        ]}>
                        <Images.Logo width={moderateScale(40)} height={moderateScale(40)} />
                    </View>
                )}

                <View style={{ marginLeft: moderateScale(5), flex: 1 }}>
                    <CustomText
                        text={item?.course_name}
                        // customStyle={{flex: 1}}
                        size={17}
                        weight="600"
                    />
                    <CustomText
                        text={`By ${item?.name}`}
                        size={14}
                        color={Colors.gray_font}
                        weight="500"
                    />
                </View>
            </View>
            <View style={{ flex: 0.35 }}>
                {item?.status && (
                    <View style={[globalStyle.row, { marginBottom: moderateScale(5) }]}>
                        <CustomIcon
                            name={!isHome ? 'timer-outline' : 'message-square'}
                            color={item?.status === 'Subscribed' ? Colors.success : '#000'}
                            type={!isHome ? 'Ionicons' : 'Feather'}
                        />
                        <CustomText
                            customStyle={{ marginLeft: moderateScale(3) }}
                            text={item?.status}
                            color={item?.status === 'Subscribed' ? Colors.success : '#000'}
                            weight="500"
                        />
                    </View>
                )}

                <View style={[globalStyle.row, { marginBottom: moderateScale(5) }]}>
                    <CustomIcon
                        color={item?.status === 'Subscribed' ? Colors.success : '#000'}
                        name="calendar-number-outline"
                        type="Ionicons"
                    />
                    <CustomText
                        color={item?.status === 'Subscribed' ? Colors.success : '#000'}
                        customStyle={{ marginLeft: moderateScale(3) }}
                        text={item?.lead_date}
                        weight="500"
                    />
                </View>
            </View>
        </Pressable>
    );
};

export default AccountCourseCard;

const styles = StyleSheet.create({
    container: {
        width: '98%',
        alignSelf: 'center',
        backgroundColor: '#f7f7f7',
        marginBottom: moderateScale(10),
        marginTop: moderateScale(5),
        padding: moderateScale(10),
        borderRadius: moderateScale(8),
        elevation: 5,
    },
});
