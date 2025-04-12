import React from 'react';
import {StyleProp, TextStyle} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Foundation from 'react-native-vector-icons/Foundation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Zocial from 'react-native-vector-icons/Zocial';

const iconSets = {
  MaterialIcons,
  FontAwesome,
  Ionicons,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome5,
  Fontisto,
  Foundation,
  MaterialCommunityIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
  AntDesign,
};

interface CustomIconProps {
  type: keyof typeof iconSets; // Restrict to the keys of `iconSets`
  name: string; // Icon name as a string
  size?: number; // Icon size as a number (optional)
  color?: string; // Icon color as a string (default provided)
  customStyle?: StyleProp<TextStyle>; // Optional custom style
}

const CustomIcon: React.FC<CustomIconProps> = ({
  type,
  name,
  size = 24,
  color = '#000',
  customStyle,
}) => {
  const IconComponent = iconSets[type];

  if (!IconComponent) {
    console.error(`Icon type '${type}' is not supported.`);
    return null;
  }

  return (
    <IconComponent
      name={name}
      size={size}
      color={color}
      style={[customStyle, {padding: 0, margin: 0}]}
    />
  );
};

export default CustomIcon;
