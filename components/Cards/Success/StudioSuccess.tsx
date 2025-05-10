import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useBackHandler } from '../../../utils/BackHandling';
import Container from '../../Container';
import CustomIcon from '../../Customs/CustomIcon';
import CustomText from '../../Customs/CustomText';
import { moderateScale } from '../../Matrix/Matrix';
import * as Animatable from 'react-native-animatable';

const StudioSuccess = () => {
    useBackHandler('BottomTabs');
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
                    text="Studio Added Successfully"
                    weight="700"
                    size={20}
                    customStyle={{ marginTop: moderateScale(10) }}
                />
                <CustomText text="You can add more studio in future" weight="500" />
            </View>
        </Container>
    )
}

export default StudioSuccess

const styles = StyleSheet.create({})