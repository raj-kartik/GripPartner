import { BackHandler, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';

import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Container from '../../../components/Container';
import CustomText from '../../../components/Customs/CustomText';
import { globalStyle } from '../../../utils/GlobalStyle';
import Colors from '../../../utils/Colors';
import { moderateScale, screenWidth } from '../../../components/Matrix/Matrix';
import CustomIcon from '../../../components/Customs/CustomIcon';

const PaymentScan = (props: any) => {
    const params = props.route.params;
    const navigation = useNavigation();
    const { data } = useSelector((state: any) => state?.wallet);
    // console.log('----- wallet kartik ----', data);

    useEffect(() => {
        // Disable back button
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => true, // Returning true disables the back button
        );

        // Navigate to home page after 7 seconds
        const timer = setTimeout(() => {
            navigation.navigate('BottomTabs'); // Replace 'Home' with the actual route name for your home screen
        }, 5000);

        // Cleanup function to remove event listener and clear timer
        return () => {
            backHandler.remove();
            clearTimeout(timer);
        };
    }, [navigation]);

    return (
        <Container>
            <View style={[globalStyle.center, { flex: 0.3 }]}>
                <CustomIcon
                    type="MaterialCommunityIcons"
                    name="check-decagram"
                    size={100}
                    color={Colors.success}
                />
                <CustomText text="Payment Sucessfully" weight="700" size={20} />
            </View>
            <View style={[{ flex: 0.8 }]}>
                <View style={{ marginHorizontal: moderateScale(10) }}>
                    <View style={[globalStyle.betweenCenter]}>
                        <CustomText
                            weight="600"
                            customStyle={{ marginTop: moderateScale(10) }}
                            size={18}
                            text="Invoice Summary"
                        />
                    </View>

                    <View style={[globalStyle.betweenCenter]}>
                        <CustomText
                            weight="500"
                            customStyle={{ marginTop: moderateScale(10) }}
                            size={16}
                            text="Invoice No."
                        />
                        <CustomText text="S1-4" weight="500" size={14} />
                    </View>

                    <View style={[globalStyle.betweenCenter]}>
                        <CustomText
                            weight="500"
                            customStyle={{ marginTop: moderateScale(10) }}
                            size={16}
                            text="Fulfillment  Type"
                        />
                        <CustomText text="Fulfilled at Checkout" weight="500" size={14} />
                    </View>
                </View>

                <View
                    style={{
                        width: screenWidth,
                        backgroundColor: '#000',
                        height: 1,
                        marginTop: moderateScale(10),
                        alignSelf: 'center',
                    }}
                />

                <View style={{ marginHorizontal: moderateScale(10) }}>
                    <View style={[globalStyle.betweenCenter]}>
                        <CustomText
                            weight="600"
                            customStyle={{ marginTop: moderateScale(10) }}
                            size={18}
                            text="Payment Summary"
                        />
                    </View>

                    <View style={[globalStyle.betweenCenter]}>
                        <CustomText
                            weight="500"
                            customStyle={{ marginTop: moderateScale(10) }}
                            size={16}
                            text="Amount"
                        />
                        <CustomText text="₹ 500.00" weight="500" size={14} />
                    </View>
                </View>

                <View
                    style={{
                        width: screenWidth,
                        backgroundColor: '#000',
                        height: 1.2,
                        marginTop: moderateScale(10),
                        alignSelf: 'center',
                    }}
                />
                <View
                    style={[
                        globalStyle.betweenCenter,
                        { marginHorizontal: moderateScale(10) },
                    ]}>
                    <CustomText
                        weight="500"
                        customStyle={{ marginTop: moderateScale(13) }}
                        size={16}
                        text="Total Paid Amount"
                    />
                    <CustomText text="₹ 500.00" weight="500" size={14} />
                </View>
            </View>
        </Container>
    );
};

export default PaymentScan;

const styles = StyleSheet.create({});
