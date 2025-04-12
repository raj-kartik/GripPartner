import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import * as Animatable from 'react-native-animatable';
import Container from '../../../../../components/Container';
import { useBackHandler } from '../../../../../utils/BackHandling';
import CustomText from '../../../../../components/Customs/CustomText';
import CustomIcon from '../../../../../components/Customs/CustomIcon';
import { moderateScale } from '../../../../../components/Matrix/Matrix';

const CouponSuccess = () => {

    useBackHandler('TrainerCoupons');
    return (
        <Container>
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <Animatable.View
                    animation="pulse"
                    iterationCount="infinite"
                // direction="alternate"
                >
                    <CustomIcon
                        type="Feather"
                        name="check-circle"
                        size={70}
                        color="#75cb72"
                    />
                </Animatable.View>
                <CustomText
                    text="Coupon Confirmed"
                    weight="700"
                    size={20}
                    customStyle={{ marginTop: moderateScale(10) }}
                />
                <CustomText text="Your coupon has been confirmed" weight="500" />
            </View>
        </Container>
    )
}

export default CouponSuccess

const styles = StyleSheet.create({})