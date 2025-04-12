import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import Container from '../../../components/Container';
import CustomIcon from '../../../components/Customs/CustomIcon';
import { globalStyle } from '../../../utils/GlobalStyle';
import Colors from '../../../utils/Colors';
import { moderateScale, screenWidth } from '../../../components/Matrix/Matrix';
import makeApiRequest from '../../../utils/ApiService';
import { DEFAULT_URL, POST_SEARCH } from '../../../utils/api';
import CustomText from '../../../components/Customs/CustomText';
import SearchCourse from '../../../components/Cards/Search/SearchCourse';
import SearchRetreat from '../../../components/Cards/Search/SearchRetreat';
import SearchTrainer from '../../../components/Cards/Search/SearchTrainer';
import SearchCareer from '../../../components/Cards/Search/SearchCareer';
import SearchFranchise from '../../../components/Cards/Search/SearchFranchise';
import SearchShop from '../../../components/Cards/Search/SearchShop';


//   import Container from '../../Component/Container';
//   import CustomIcon from '../../Component/Custom/CustomIcon';
//   import {globalStyle} from '../../../utils/GlobalStyles';
//   import Colors from '../../style/Colors';
//   import {moderateScale, screenWidth} from '../../Component/Matrix/Matrix';
//   import {getMethod} from '../../../utils/helper';
//   import CustomText from '../../Component/Custom/CustomText';
//   import SearchCard1 from '../../Component/Cards/SearchCard1';
//   import makeApiRequest from '../../../utils/API/apiServices';
//   import {DEFAULT_URL, POST_SEARCH} from '../../../utils/API/api';
//   import SearchCourse from '../../Component/Cards/Search/SearchCourse';
//   import SearchTrainer from '../../Component/Cards/Search/SearchTrainer';
//   import SearchRetreat from '../../Component/Cards/Search/SearchRetreat';
//   import SearchCareer from '../../Component/Cards/Search/SearchCareer';
//   import SearchShop from '../../Component/Cards/Search/SearchShop';
//   import SearchFranchize from '../../Component/Cards/Search/SearchFranchize';

const Search = ({ route }: any) => {
  const { type = 'Course', isTypeVisible = true } = route.params || {};
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState<any>({});
  const [filterQuantity, setFilterQuantity] = useState(type);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [search, filterQuantity]),
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const lowercaseFilterQuantity = filterQuantity.toLowerCase();

      console.log('=== lowercaseFilterQuantity ==', lowercaseFilterQuantity);

      const response: any = await makeApiRequest({
        baseUrl: DEFAULT_URL,
        url: POST_SEARCH,
        data: {
          type: [lowercaseFilterQuantity],
          search: search.trim(),
        },
        method: 'POST',
      });

      if (response?.status === 'success') {
        setSearchData((prevData: any) => ({
          ...prevData,
          ...response.data, // Merge new results with existing data
        }));
      } else {
        setSearchData({});
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setSearchData({});
    } finally {
      setLoading(false);
    }
  };

  const filterOptions = [
    'Course',
    'Trainer',
    'Retreat',
    'Shop',
    // 'Franchise',
    // 'Career',
  ];

  // Reorder filterOptions to place the selected type at index 0
  const orderedFilterOptions = [
    type,
    ...filterOptions.filter(item => item !== type),
  ];

  const handleSelect = (item: string) => {
    setFilterQuantity(item);
  };

  const navigation = useNavigation();

  return (
    <Container>
      {/* Search Bar */}
      <View style={[globalStyle.row, {}]}>
        <View style={[globalStyle.row, styles.searchBar]}>
          <Pressable
            onPress={() => {
              navigation.goBack(); // Navigate back to previous screen when back button is pressed
            }}
            style={{ marginRight: moderateScale(5) }}>
            <CustomIcon type="AntDesign" name="arrowleft" />
          </Pressable>
          <TextInput
            value={search}
            onChangeText={text => setSearch(text)}
            autoFocus={true}
            style={styles.input}
            placeholder="Search here.."
            placeholderTextColor={Colors.gray}
          />
        </View>
      </View>

      {/* Filter Options */}
      <View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={orderedFilterOptions}
          keyExtractor={item => item}
          style={{ alignSelf: "center" }}
          contentContainerStyle={styles.typeBtn}
          renderItem={({ item }) => {
            const isSelected = filterQuantity.includes(item);
            return (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => handleSelect(item)}
                style={[
                  styles.searchType,
                  { backgroundColor: isSelected ? '#000' : '#f7f7f7' },
                ]}>
                <CustomText
                  text={item}
                  color={isSelected ? '#fff' : '#000'}
                  weight={!isSelected ? '400' : '500'}
                  size={13}
                />
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Results */}
      {loading ? (
        <ActivityIndicator size={20} color={Colors.brand_primary} />
      ) : (
        <View
          style={{
            flex: 1,
            marginTop: moderateScale(10),
            marginBottom: moderateScale(5),
          }}>
          {Object.keys(searchData).length > 0 ? (
            Object.keys(searchData).map(
              type =>
                searchData[type]?.length > 0 && (
                  <View key={type}>
                    <FlatList
                      data={searchData[type]}
                      keyExtractor={item =>
                        item?.id ? String(item.id) : Math.random().toString()
                      }
                      renderItem={({ item }) => {
                        if (type === 'course') {
                          return <SearchCourse item={item} type={type} />;
                        } else if (type === 'trainer') {
                          return <SearchTrainer item={item} type={type} />;
                        } else if (type === 'retreat') {
                          return <SearchRetreat item={item} type={type} />;
                        } else if (type === 'career') {
                          return <SearchCareer item={item} type={type} />;
                        } else if (type === 'shop') {
                          return <SearchShop item={item} type={type} />;
                        } else {
                          return <SearchFranchise item={item} type={type} />;
                        }
                      }}
                    />
                  </View>
                ),
            )
          ) : (
            <CustomText
              customStyle={{ textAlign: 'center' }}
              text={`No Results Found`}
            />
          )}
        </View>
      )}
    </Container>
  );
};

export default Search;

const styles = StyleSheet.create({
  searchBar: {
    paddingHorizontal: moderateScale(10),
    borderRadius: moderateScale(25),
    backgroundColor: Colors.white,
    elevation: 5,
    marginTop: moderateScale(10),
    // marginRight: moderateScale(10),
  },
  input: {
    // backgroundColor:"red",
    flex: 1,
    color: Colors.black,
    fontSize: 14,
    height:moderateScale(50)
    // marginBottom:moderateScale(10)
  },
  searchType: {
    marginBottom: 10,
    marginHorizontal: 1,
    // Highlight color when selected
    padding: moderateScale(5),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(5),
    width: moderateScale(80),
    marginRight: moderateScale(5),
    paddingVertical: moderateScale(8),
    elevation: 2,
  },
  typeBtn: {
    marginVertical: moderateScale(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: moderateScale(20),
    alignSelf: "center"
  },
});
