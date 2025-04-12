import { StyleSheet, Text, TextStyle } from 'react-native';
import React from 'react';

interface CustomTextProps {
  text: string;
  customStyle?: TextStyle; // React Native TextStyle type for styles
  weight?: "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
  size?: number;
  color?: string;
  family?: string;
}

const CustomText: React.FC<CustomTextProps> = ({
  text,
  customStyle,
  weight = "400",
  size = 15,
  color = "#000",
  family,
}) => {
  return (
    <Text
      style={[
        customStyle,
        { fontWeight: weight, fontSize: size, fontFamily: family, color: color },
      ]}
    >
      {text}
    </Text>
  );
};

export default CustomText;

const styles = StyleSheet.create({});
