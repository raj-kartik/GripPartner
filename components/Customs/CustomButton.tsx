import React from 'react';
import {
    Pressable,
    View,
    StyleSheet,
    StyleProp,
    ViewStyle,
    TextStyle,
    ActivityIndicator,
} from 'react-native';
// import Theme from '../../utils/Theme';
import CustomText from './CustomText';
import CustomIcon from './CustomIcon';
import { moderateScale } from '../Matrix/Matrix';
import Colors from '../../utils/Colors';


interface CustomButtonProps {
    onPress: () => void;
    weight?: string;
    title: string;
    customStyle?: StyleProp<ViewStyle>;
    textColor?: string;
    textStyle?: StyleProp<TextStyle>;
    iconType?: string;
    iconName?: string;
    iconPosition?: 'left' | 'right';
    iconSize?: number;
    size?: number;
    iconColor?: string;
    disabled?: boolean;
    bg?: string;
    radius?: number;
    contentStyle?: StyleProp<ViewStyle>;
    loading?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
    onPress,
    weight = '600',
    title,
    customStyle = {},
    textColor = '#fff',
    textStyle = {},
    iconType,
    iconName,
    iconPosition = 'left',
    iconSize = 24,
    size = 16,
    iconColor,
    disabled = false,
    bg = Colors.btn_primary,
    radius = 4,
    contentStyle,
    loading = false,
}) => {
    return (
        <View
            style={[
                customStyle,
                {
                    backgroundColor: bg,
                    borderRadius: moderateScale(radius),
                    flexDirection: 'row',
                    alignItems: 'center',
                },
            ]}>
            <Pressable
                onPress={onPress}
                disabled={disabled}
                style={({ pressed }) => [
                    styles.button,
                    pressed && { opacity: 0.8 },
                    {
                        flex: 1,
                    },
                ]}>
                <View style={[styles.content, contentStyle]}>
                    {iconName && iconPosition === 'left' && (
                        <CustomIcon
                            type={iconType || 'AntDesign'}
                            name={iconName}
                            size={iconSize}
                            color={iconColor ?? Colors.iconPrimary}
                            style={styles.iconLeft}
                        />
                    )}

                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <CustomText
                            customStyle={[textStyle]}
                            weight={weight}
                            size={size}
                            text={title}
                            color={textColor}
                        />
                    )}

                    {iconName && iconPosition === 'right' && (
                        <CustomIcon
                            type={iconType}
                            name={iconName}
                            size={iconSize}
                            color={iconColor}
                            style={styles.iconRight}
                        />
                    )}
                </View>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: moderateScale(14),
        paddingHorizontal: moderateScale(12),
        borderRadius: moderateScale(4),
        alignItems: 'center',
        justifyContent: 'center',
    },

    content: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconLeft: {
        marginRight: moderateScale(8),
    },
    iconRight: {
        marginLeft: moderateScale(8),
    },
});

export default CustomButton;
