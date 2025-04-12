import React, { ReactNode } from 'react';
import { StatusBar, StyleSheet, View, ViewStyle } from 'react-native';

import { moderateScale } from './Matrix/Matrix';
import Colors from '../utils/Colors';

interface ContainerProps {
    children: ReactNode; // To represent the nested components
    customStyle?: ViewStyle; // Optional custom styles for the container
}

const Container: React.FC<ContainerProps> = ({ children, customStyle, status = Colors.white, isTopPadding = true }: any) => {
    return (
        <View
            style={[
                styles.container,
                customStyle, // Merge custom styles with default styles
                {
                    paddingTop: isTopPadding ? moderateScale(10) : 0
                }
            ]}
        >
            <StatusBar backgroundColor={status} />
            {children}
        </View>
    );
};

export default Container;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        // backgroundColor: Colors.white,
        paddingHorizontal: moderateScale(10),
        // paddingTop: moderateScale(10),
    },
});
