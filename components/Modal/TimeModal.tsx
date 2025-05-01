import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomModal from '../Customs/CustomModal';
import { moderateScale, screenHeight } from '../Matrix/Matrix';
import Colors from '../../utils/Colors';
import CustomText from '../Customs/CustomText';
import { globalStyle } from '../../utils/GlobalStyle';

const TimeModal = ({ timeModal, setTimeModal, handleTime, values = "" }: any) => {
    const time = [
        { label: '01:00 AM', value: '01:00' },
        { label: '02:00 AM', value: '02:00' },
        { label: '03:00 AM', value: '03:00' },
        { label: '04:00 AM', value: '04:00' },
        { label: '05:00 AM', value: '05:00' },
        { label: '06:00 AM', value: '06:00' },
        { label: '07:00 AM', value: '07:00' },
        { label: '08:00 AM', value: '08:00' },
        { label: '09:00 AM', value: '09:00' },
        { label: '10:00 AM', value: '10:00' },
        { label: '11:00 AM', value: '11:00' },
        { label: '12:00 PM', value: '12:00' },
        { label: '01:00 PM', value: '13:00' },
        { label: '02:00 PM', value: '14:00' },
        { label: '03:00 PM', value: '15:00' },
        { label: '04:00 PM', value: '16:00' },
        { label: '05:00 PM', value: '17:00' },
        { label: '06:00 PM', value: '18:00' },
        { label: '07:00 PM', value: '19:00' },
        { label: '08:00 PM', value: '20:00' },
        { label: '09:00 PM', value: '21:00' },
        { label: '10:00 PM', value: '22:00' },
        { label: '11:00 PM', value: '23:00' },
        { label: '12:00 AM', value: '00:00' },
    ];
    return (
        <CustomModal
            visible={timeModal}
            iscenter={false}
            containerStyle={{
                width: '100%',
                alignSelf: 'center',
                height: screenHeight * 0.5,
            }}
            onDismiss={() => setTimeModal(false)}>
            <View
                style={{
                    width: '30%',
                    height: moderateScale(4),
                    borderRadius: moderateScale(10),
                    backgroundColor: Colors.gray_font,
                    alignSelf: 'center',
                    marginTop: moderateScale(5),
                    marginBottom: moderateScale(10),
                }}
            />
            <CustomText
                text="Select Time"
                size={18}
                weight="700"
                customStyle={{ textAlign: 'center' }}
            />

            <ScrollView style={{ flex: 1, }} showsVerticalScrollIndicator={false} >
                <View
                    style={[
                        globalStyle.betweenCenter,
                        {
                            flexWrap: 'wrap',
                            marginTop: moderateScale(10),
                        },
                    ]}>
                    {time &&
                        time.map((item: any) => {
                            // let index =
                            return (
                                <Pressable
                                    onPress={() => {
                                        handleTime(item);
                                        setTimeModal(false);
                                    }}
                                    style={[
                                        globalStyle.center,
                                        {
                                            width: '30%',
                                            padding: moderateScale(10),
                                            borderWidth: values === item?.value ? 0 : 1,
                                            borderColor: Colors.gray_font,
                                            borderRadius: moderateScale(8),
                                            marginBottom: moderateScale(10),
                                            backgroundColor:
                                                values === item?.value
                                                    ? Colors.orange
                                                    : '#fff',
                                        },
                                    ]}>
                                    <CustomText
                                        text={item?.label}
                                        weight={
                                            values === item?.value
                                                ? '700'
                                                : '500'
                                        }
                                        color={
                                            values === item?.value
                                                ? '#000'
                                                : '#000'
                                        }
                                    />
                                </Pressable>
                            );
                        })}
                </View>
            </ScrollView>
        </CustomModal>
    )
}

export default TimeModal

const styles = StyleSheet.create({})