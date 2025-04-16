import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useFocusEffect, CommonActions, useNavigation } from '@react-navigation/native';
import makeApiRequest from '../../../utils/ApiService';
import { BASE_URL } from '../../../utils/api';
import CustomIcon from '../../../components/Customs/CustomIcon';
import { moderateScale } from '../../../components/Matrix/Matrix';
import axios from 'axios';

const Colors = {
  white: '#fff',
  black: '#000',
  lightGray: '#f7f7f7',
  gray: '#808080',
};

const DynamicShopProduct = (props:any) => {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [activeSubCategory, setActiveSubCategory] = useState<number | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState([]);
  const navigation = useNavigation();

  useFocusEffect(useCallback(() => {
    const fetchData = async () => {
      await fetchCategory();
    }

    fetchData();
  }, []));

  const fetchCategory = async () => {
    // console.log(storage.response.token)
    setLoading(true);
    try {
      // const response = await getMethod('categories');

      const response:any = await axios.get('https://gripkart.com/rest/V1/categories');

      console.log("--- response in the fetchCategories ----", response);

      if (response?.status === 200) {
        setCategory(response?.data?.children_data);
        // return response?.children_data;
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      return null;
    }
    finally {
      setLoading(false);
    }
  };

  const toggleCategory = (index: number) => {
    setActiveCategory(activeCategory === index ? null : index);
    setActiveSubCategory(null); // Close subcategory when switching category
  };

  const toggleSubCategory = (index: number) => {
    setActiveSubCategory(activeSubCategory === index ? null : index);
  };

  const renderSubcategory = (subcategory: any[], categoryIndex: number, item:any) => {
    return (
      <View style={styles.subCategoryContainer}>
        {subcategory.map((sub, subIndex) => (
          <View key={subIndex}>
            <Pressable
              style={styles.subCategory}
              onPress={() => toggleSubCategory(subIndex)}>
              <Text style={styles.subCategoryName}>{sub.name}</Text>
              <CustomIcon type="MaterialCommunityIcons" name={activeSubCategory === subIndex ? 'chevron-up' : 'chevron-down'} />
            </Pressable>
            {/* Render Sub-Subcategory */}
            {activeSubCategory === subIndex && (
              <View style={{}}>
                {sub['children_data'].map((subSub: any, subSubIndex: any) => (
                  <Pressable
                    key={subSubIndex}
                    style={styles.subSubCategory}
                    onPress={() => sentFun(item.id)}>
                    <Text style={styles.subSubCategoryName}>{subSub.name}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  const sentFun = (id: number) => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'ProductList',
        params: {
          categoryId: id,
        },
      }),
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <FlatList
        data={category}
        keyExtractor={(item:any, index:number) => index.toString()}
        renderItem={({ item, index }:any) => (
          <View>
            {/* Main Category */}
            <Pressable
              style={styles.category}
              onPress={() => toggleCategory(index)}>
              <Text style={styles.categoryName}>{item.name}</Text>
              <CustomIcon type="MaterialCommunityIcons" name={activeCategory === index ? 'chevron-up' : 'chevron-down'} />
            </Pressable>
            {/* Subcategory */}
            {activeCategory === index &&
              renderSubcategory(item['children_data'], index, item)}
          </View>
        )}
      />
    </View>
  )
}

export default DynamicShopProduct

const styles = StyleSheet.create({
  category: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  categoryName: {
    fontSize: 15,

    fontWeight: '600',
    color: Colors.black,
    fontFamily: 'Roboto-Bold',
  },
  subCategoryContainer: {
    backgroundColor: Colors.white,
  },
  subCategory: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: Colors.white,
    borderBottomWidth: 0.8,
    borderBottomColor: Colors.gray,
  },
  subCategoryName: {
    marginLeft: 15,
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
    color: Colors.black,
  },

  subSubCategory: {
    backgroundColor: 'white',
    elevation: 5,
    opacity: 5,

    paddingVertical: 15,
  },
  subSubCategoryName: {
    fontSize: 15,
    color: Colors.black,
    fontFamily: 'Roboto-Regular',
    marginBottom: 0,
    // marginTop:20,
    marginLeft: 50,
  },
});