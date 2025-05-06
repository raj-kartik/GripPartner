import React, { useRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { moderateScale } from '../Matrix/Matrix';

const CustomOtpInput = ({ code, setCode, length = 6 }: any) => {
    const inputs: any = useRef([]);

    const handleChange = (text: string, index: number) => {
        if (/^\d*$/.test(text)) {
            const newCode = code.split('');
            newCode[index] = text;
            setCode(newCode.join(''));

            if (text && index < length - 1) {
                inputs.current[index + 1].focus();
            }
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    return (
        <View style={styles.container}>
            {[...Array(length)].map((_, index) => (
                <TextInput
                    key={index}
                    ref={ref => (inputs.current[index] = ref)}
                    style={styles.input}
                    keyboardType="number-pad"
                    maxLength={1}
                    onChangeText={text => handleChange(text, index)}
                    onKeyPress={e => handleKeyPress(e, index)}
                    value={code[index] || ''}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    input: {
        width: moderateScale(50),
        height: moderateScale(60),
        borderWidth: 1,
        borderRadius: moderateScale(8),
        textAlign: 'center',
        fontSize: moderateScale(24),
        borderColor: '#ccc',
        color: "#fff"
    },
});

export default CustomOtpInput;
