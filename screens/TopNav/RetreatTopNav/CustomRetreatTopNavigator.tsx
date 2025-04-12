import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { moderateScale } from '../../../components/Matrix/Matrix';
import { globalStyle } from '../../../utils/GlobalStyle';

const CustomRetreatTopNavigator = ({state, descriptors, navigation, position}:any) => {
  return (
    <View style={styles.container}>
    {state.routes.map((route:any, index:any) => {
      const {options} = descriptors[route.key];
      const label = options.tabBarLabel || route.name;
      const isFocused = state.index === index;

      return (
        <TouchableOpacity
          key={route.key}
          onPress={() => navigation.navigate(route.name)}
          style={[
            styles.tabItem,
            isFocused && styles.activeTab,
            globalStyle.center,
          ]}>
          <Text style={[styles.tabText, isFocused && styles.activeText]}>
            {label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
  )
}

export default CustomRetreatTopNavigator

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: '#f7f7f7', // Background color
      paddingVertical: moderateScale(8),
      justifyContent: 'space-around',
      paddingHorizontal: moderateScale(10),
      marginBottom: moderateScale(10),
      marginHorizontal: moderateScale(5),
      borderRadius: moderateScale(8),
    },
    tabItem: {
      paddingVertical: moderateScale(10),
      paddingHorizontal: moderateScale(5),
      borderRadius: moderateScale(5),
      flex: 1,
    },
    activeTab: {
      backgroundColor: '#ddd', // Change active tab background color
    },
    tabText: {
      fontSize: 16,
      color: '#666', // Default text color
    },
    activeText: {
      color: '#000', // Active tab text color
      fontWeight: 'bold',
    },
  });