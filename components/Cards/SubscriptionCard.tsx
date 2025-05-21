import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { CommonActions, useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { Image } from 'react-native';
import CustomText from '../Customs/CustomText';
import { moderateScale, screenHeight } from '../Matrix/Matrix';
import CustomIcon from '../Customs/CustomIcon';
import Images from '../../utils/Images';
import { globalStyle } from '../../utils/GlobalStyle';
import Colors from '../../utils/Colors';

const dateFix = (str: string) => {
    if (!str) return ''; // Handle empty or undefined cases

    const parts = str.split('-'); // Splitting based on "-"
    if (parts.length === 3) {
        const [day, month, year] = parts; // Extracting day, month, year
        return `${year}-${month}-${day}`; // Rearranging into YYYY-MM-DD
    }

    return str; // Return original string if not in expected format
};

const SubscriptionCard = ({ item, handlePress }: any) => {
    // console.log('--- item in the subscription cars ---', item);

    const navigation = useNavigation();
    // date
    const date = dateFix(
        item?.fee_date || item['Lead Date'] || item['suscription Start Date'],
    );

    // console.log('==== date =====', item);

    const sendId = (id: any) => {
        navigation.dispatch(
            CommonActions.navigate({
                name: 'MarkFees',
                params: {
                    suscription_id: id,
                },
            }),
        );
    };

    return (
        <Pressable style={styles.row} onPress={handlePress}>
            <View style={[styles.row1, { flex: 0.65 }]}>
                {item?.image ? (
                    <Image
                        source={{ uri: item?.image }}
                        style={{
                            width: moderateScale(60),
                            height: moderateScale(60),
                            borderRadius: moderateScale(100),
                        }}
                    />
                ) : (
                    <View
                        style={[
                            globalStyle.center,
                            {
                                width: moderateScale(60),
                                height: moderateScale(60),
                                backgroundColor: '#f7f7f7',
                                borderRadius: moderateScale(50),
                            },
                        ]}>
                        <Images.Logo width={moderateScale(40)} height={moderateScale(40)} />
                    </View>
                )}
                <View style={{ marginLeft: moderateScale(5) }}>
                    <CustomText
                        size={20}
                        weight="700"
                        // family="Roboto-Bold"
                        text={item?.Name || item?.name || 'No Name'}
                    />
                    <CustomText
                        text={
                            (item?.course_name || item['course name'] || item?.course)?.length > 20
                                ? (item?.course_name || item['course name'] || item?.course).substring(0, 20) + '...'
                                : (item?.course_name || item['course name'] || item?.course)
                        }
                        weight="500"
                        size={14}
                    />

                    {/* <Text style={styles.course}>{item.course_name}</Text> */}
                </View>
            </View>

            <View style={{ flex: 0.3 }}>
                <View style={[styles.row1, { marginBottom: moderateScale(5) }]}>
                    {/* <Icon name="update" size={20} color="black" /> */}
                    <CustomIcon type='Ionicons' name='link-outline' />
                    <CustomText
                        text={
                            item?.type || item?.status || item?.subscription_type || 'No Data'
                        }
                        weight="500"
                        size={16}
                        customStyle={{ marginLeft: moderateScale(5) }}
                    />
                </View>
                <View style={globalStyle.row}>
                    <CustomIcon type="Feather" name="calendar" size={20} color="#000" />
                    <CustomText
                        customStyle={{ marginLeft: moderateScale(5) }}
                        text={
                            item?.fee_date ||
                            item['Lead Date'] ||
                            item['suscription Start Date']
                        }
                        weight="500"
                    />
                </View>
            </View>
        </Pressable>
    );
};

export default SubscriptionCard;

const styles = StyleSheet.create({
    row: {
        backgroundColor: '#fff',
        elevation: 5,
        borderRadius: moderateScale(10),
        width: '98%',
        height: screenHeight * .1,
        padding: 10,
        alignItems: 'center',
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: moderateScale(15),
        borderWidth: 0.5,
        borderColor: Colors.lightGray,
    },
    row1: {
        flexDirection: 'row',
    },
});
