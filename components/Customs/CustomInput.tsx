import React, { useRef, useState } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    TextInputProps,
    StyleProp,
    ViewStyle,
    TextStyle,
} from 'react-native';
import CustomText from './CustomText';
import CustomIcon from './CustomIcon';
import { horizontalScale, moderateScale, verticalScale } from '../Matrix/Matrix';
import Colors from '../../utils/Colors';

// Define prop types for CustomInput
interface CustomInputProps extends TextInputProps {
    text?: string;
    values?: string;
    placeholder?: string;
    multiline?: boolean;
    numOfLine?: number;
    maxLength?: number;
    keyboardType?: TextInputProps['keyboardType'];
    onBlur?: () => void;
    handleChangeText: (text: string) => void;
    textColor?: string;
    autoCaptital?: TextInputProps['autoCapitalize'];
    borderColor?: string;
    editable?: boolean;
    customStyle?: StyleProp<ViewStyle>;
    inputStyle?: StyleProp<ViewStyle>;
    isSecure?: boolean;
    showCross?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({
    text,
    values,
    placeholder,
    multiline = false,
    numOfLine = 4,
    maxLength,
    keyboardType,
    onBlur,
    handleChangeText,
    textColor = Colors.text_primary,
    autoCaptital = 'none',
    borderColor,
    editable = true,
    customStyle,
    isSecure = false,
    showCross = false,
    inputStyle,
    ...props
}) => {
    const inputRef = useRef<TextInput>(null);
    const [isFocused, setIsFocused] = useState<boolean>(false);

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
        if (onBlur) onBlur();
    };

    const clearInput = () => {
        if (handleChangeText) handleChangeText('');
    };

    return (
        <View style={[styles.container, customStyle]}>
            {text && (
                <CustomText
                    text={text}
                    size={15}
                    weight="500"
                    customStyle={{ marginBottom: moderateScale(3) }}
                />
            )}
            <View style={styles.inputWrapper}>
                <TextInput
                    multiline={multiline}
                    autoCapitalize={autoCaptital}
                    numberOfLines={multiline ? numOfLine : 1}
                    secureTextEntry={isSecure}
                    editable={editable}
                    ref={inputRef}
                    style={[
                        styles.input,
                        {
                            borderColor: isFocused ? Colors.black : Colors.gray,
                            color: textColor,
                            textAlignVertical: multiline ? 'top' : 'auto',
                            borderWidth: isFocused ? 0.5 : 0,
                        },
                        inputStyle
                    ]}
                    placeholderTextColor={Colors.gray}
                    onChangeText={handleChangeText}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    keyboardType={keyboardType}
                    value={values}
                    {...props}
                />
                {values && showCross && (
                    <TouchableOpacity style={styles.clearButton} onPress={clearInput}>
                        <CustomIcon name="cross" type="Entypo" size={20} color="#999" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: verticalScale(15),
    },
    inputWrapper: {
        position: 'relative',
    },
    input: {
        paddingHorizontal: moderateScale(15),
        color: Colors.text_primary,
        borderWidth: 0.5,
        backgroundColor: '#fff',
        borderRadius: horizontalScale(8),
        textAlign: 'auto',
        elevation: 2,
        fontSize: 15,
        height: moderateScale(50)
    },
    clearButton: {
        position: 'absolute',
        right: 50,
        top: 25,
        transform: [{ translateY: -10 }],
    },
});

export default CustomInput;
