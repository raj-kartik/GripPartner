import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as Animatable from 'react-native-animatable'
import { moderateScale, screenWidth } from '../Matrix/Matrix';
import { globalStyle } from '../../utils/GlobalStyle';
import Colors from '../../utils/Colors';
import Images from '../../utils/Images';
import CustomIcon from './CustomIcon';
import CustomText from './CustomText';
const CustomToastUI = ({
    type = 'success',
    text1 = '',
    text2 = '',
    onHide,
}: any) => {
    const [animation, setAnimation] = useState('bounceInDown');

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimation('slideOutUp');
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (animation === 'slideOutUp') {
            const hideTimer = setTimeout(() => {
                onHide?.();
            }, 1000);
            return () => clearTimeout(hideTimer);
        }
    }, [animation, onHide]);

    return (
        <Animatable.View
            animation={animation}
            iterationCount={1}
            duration={1000}
            style={[
                styles.container,
                globalStyle.row,
                {
                    borderWidth: 1,
                    borderColor: type === 'success' ? Colors.orange : type === 'error' ? Colors.red : type === 'warning' || type === 'info' ? Colors.info : "#f7f7f7",
                    shadowColor: type === 'success' ? Colors.orange : type === 'error' ? Colors.red : type === 'warning' || type === 'info' ? Colors.info : "#f7f7f7",
                    alignItems: 'center',
                    backgroundColor: type === 'success' ? Colors.orange_bg : type === 'error' ? "#fcc7c7" : type === 'warning' || type === 'info' ? "#c7e4fc" : "#f7f7f7",
                },
            ]}>
            <View style={{ marginRight: moderateScale(3) }}>
                {type === 'success' ? (
                    <Images.Logo
                        width={moderateScale(20)}
                        height={moderateScale(20)}
                    />
                ) : type === 'error' ? (
                    <CustomIcon
                        type="MaterialCommunityIcons"
                        name="alert-circle"
                        color="#FF0000"
                    />
                ) : type === 'warning' || type === 'info' ? (
                    <CustomIcon
                        type="MaterialCommunityIcons"
                        name="alert-octagon"
                        color={Colors.button}
                    />
                ) : (
                    type == 'info' && <CustomIcon color={Colors.button} type="Feather" name="info" />
                )}
            </View>
            <View>
                <CustomText text={text1} size={16}
                    weight='600'
                // fontFamily={Fonts.bold} 
                />
                {text2 && (
                    <CustomText
                        text={text2}
                        size={12}
                    // fontFamily={Fonts.JosefinSans.Regular}
                    // textColor={Theme.text.tertiary}
                    />
                )}
            </View>
        </Animatable.View>
    );
};
export default CustomToastUI;

const styles = StyleSheet.create({
    container: {
        width: screenWidth * 0.95,
        height: screenWidth * 0.15,
        borderRadius: moderateScale(5),
        position: 'absolute',
        top: moderateScale(10),
        zIndex: 1000,
        backgroundColor: '#f7f7f7',
        elevation: 80,
        shadowColor: '#f7f7f7',
        alignSelf: 'center',
        shadowOpacity: 0.2,
        padding: moderateScale(10),
        paddingRight:moderateScale(20)
    },
});