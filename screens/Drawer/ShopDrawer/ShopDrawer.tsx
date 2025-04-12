import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import Products from '../../Bottom/Products';
import CustomDrawer from '../CustomDrawer';
import { moderateScale } from '../../../components/Matrix/Matrix';
import DynamicShopProduct from './DynamicShopProduct';
import makeApiRequest from '../../../utils/ApiService';
import axios from 'axios';

const ShopDrawer = () => {
  const { Navigator, Screen } = createDrawerNavigator();
  // https://gripkart.com/rest/V1/categories
  useEffect(() => {
    const fetchShopCategory = async () => {
      try {
        const response: any = await axios.get('https://gripkart.com/rest/V1/categories', {
          headers: {
            Authorization: `Bearer y45sgnlki88jt4gp9o6nmfw6fkrds4jc`, // 🔑 Replace with your token
          },
        });
        console.log('==== shop category ===', response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchShopCategory();
  }, []);

  const shopNav = [
    {
      id: 1,
      route: "ECom",
      label: "Home",
      component: Products
    },
    {
      id: 2,
      route: "Product",
      label: "Product",
      component: DynamicShopProduct
    },
  ]
  return (
    <Navigator initialRouteName='ECom' screenOptions={{
      headerShown: false,
      gestureEnabled: true,
      swipeEdgeWidth: moderateScale(50),
      drawerStyle: {
        backgroundColor: '#fff',
        width: moderateScale(240),
      },
    }}
    // drawerContent={props => <CustomDrawer {...props} />}
    >
      {shopNav.map((item: any) => {
        return (
          <Screen
            key={item.id}
            name={item.route}
            component={item.component}
            options={{
              tabBarLabel: item.label,
              headerShown: false,
              type: item?.type,
              icon: item?.icon
            }}
          />
        );
      })}
    </Navigator>
  )
}

export default ShopDrawer

const styles = StyleSheet.create({})