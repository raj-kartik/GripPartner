/* eslint-disable react/jsx-no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable quotes */
/* eslint-disable no-sequences */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { FC, JSX, useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import axios from 'axios';
import CustomIcon from '../Customs/CustomIcon';
import Images from '../../utils/Images';
import { moderateScale } from '../Matrix/Matrix';
import { globalStyle } from '../../utils/GlobalStyle';

interface Props {
  color: string;
  searchType: string;
  icon: any;
  setResults: any;
  setLoading: any;
  isScanner: boolean;
  isBack: boolean;
  isTypeVisible: boolean;
}

const AppBarSearch: FC<Props> = ({
  color,
  setLoading = () => { },
  isBack = true,
  searchType,
  isTypeVisible = true,
}): JSX.Element => {
  const navigation = useNavigation();
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: color, marginRight: moderateScale(10) },
      ]}>
      <View style={styles.row}>
        {isBack && (
          <Pressable
            onPress={() => {
              navigation.goBack();
            }}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: moderateScale(10),
            }}>
            <CustomIcon type="AntDesign" name="arrowleft" />
          </Pressable>
        )}

        {/* <Image source={require('../img/one.jpeg')} style={styles.image} /> */}
        <Images.Logo
          width={moderateScale(70)}
          height={moderateScale(70)}
          style={styles.image}
        />
      </View>

      <View
        style={[globalStyle.row, { flex: 0.2 }]}>
        <Pressable
          style={{ marginRight: moderateScale(15) }}
          onPress={() =>
            navigation.navigate('Search', {
              type: searchType,
              isTypeVisible,
            }) 
          }>
          <Images.Search width={moderateScale(20)} height={moderateScale(20)} />
        </Pressable>

        {/* <Pressable
          style={{marginRight: moderateScale(15)}}
          onPress={() => navigation.navigate('Scanner')}>
          <CustomIcon
            size={20}
            type="MaterialCommunityIcons"
            name="qrcode-scan"
          /> 
          </Pressable> */}

        <Pressable
          style={{ marginRight: moderateScale(20) }}
          onPress={() => navigation.navigate('NotificationScreen')}>
          <CustomIcon type="Feather" name="bell" />
          {/* <Images.Search width={moderateScale(22)} height={moderateScale(22)} /> */}
        </Pressable>
      </View>
      {/* <Icon name="bell" type="material-community" color="black" size={25} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#d3d3d3',
    width: '100%',
    alignItems: 'center',
  },

  row: {
    flex: 0.8,
    flexDirection: 'row',
    padding: 10,
    paddingHorizontal: 0,
  },
  resultsContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  resultItem: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
});

export default AppBarSearch;
