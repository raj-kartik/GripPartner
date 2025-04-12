import { CommonActions, useFocusEffect } from '@react-navigation/native';
import React, { FC, JSX, useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import makeApiRequest from '../../../../utils/ApiService';
import { BASE_URL, DEFAULT_URL } from '../../../../utils/api';
import Container from '../../../../components/Container';
import CustomHeader2 from '../../../../components/Customs/Header/CustomHeader2';
import { moderateScale, screenHeight, screenWidth } from '../../../../components/Matrix/Matrix';
import CustomText from '../../../../components/Customs/CustomText';
import Colors from '../../../../utils/Colors';
import { globalStyle } from '../../../../utils/GlobalStyle';
import CustomIcon from '../../../../components/Customs/CustomIcon';

interface Props {
  navigation: any;
  courseid: string;
}
const WrittenReview: FC<Props> = ({ navigation, courseid }): JSX.Element => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [allReview, setAllReview] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const { user } = useSelector((state: any) => state.user);

  // console.log("=== user data in the user ===",user);


  const showDeleteModal = (id: any) => {
    setReviewToDelete(id);
    setIsModalVisible(true);
  };

  const hideDeleteModal = () => {
    setIsModalVisible(false);
    setReviewToDelete(null);
  };

  useFocusEffect(
    useCallback(() => {
      ReviewList();
    }, []),
  );

  const ReviewList = async () => {
    try {
      setLoading(true);
      // const response: any = await postMethod('user-review-list', {user_id});
      const response: any = await makeApiRequest({
        baseUrl: BASE_URL,
        method: "POST",
        url: 'user-review-list',
        data: { user_id: user?.id }
      });

      console.log("=== response in the review list ==", response);

      if (response?.review && response?.review.length > 0) {
        setAllReview(response.review);
        setData(response.review);
      }
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.log('error', error);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response: any = await makeApiRequest({
        baseUrl: BASE_URL,
        url: `delete-review-user?id=${reviewToDelete}`,
        method: "POST"
      })
      if (response) {
        console.log(response.data, 'Review deleted');
        await ReviewList(); // Refresh the review list
      }
      setLoading(false);
      hideDeleteModal(); // Close the modal after deletion
    } catch (error) {
      setLoading(false);
      console.log('Error deleting review', error);
      hideDeleteModal(); // Close the modal on error as well
    }
  };

  const sendFunction = (data: any) => {
    navigation.dispatch(
      CommonActions.navigate({
        name: 'EditReviewScreen',
        params: {
          Review: data,
        },
      }),
    );
  };

  const handleShowMoreReviews = () => {
    setShowAllReviews(!showAllReviews);
  };

  const reviewsToShow = showAllReviews ? data : data.slice(0, 5);

  return (
    <Container>
      <CustomHeader2 title="My Reviews" />
      <View style={[styles.container]}>
        {reviewsToShow ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ marginTop: moderateScale(0) }}
            data={reviewsToShow}
            keyExtractor={(item: any) => item?.id}
            renderItem={({ item }) => {
              // console.log('==== item in the review list ====', item);
              return (
                <View
                  style={[
                    {
                      flexDirection: 'column',
                      padding: moderateScale(10),
                      backgroundColor: '#f7f7f7',
                      marginBottom: moderateScale(10),
                      borderRadius: moderateScale(10),
                      elevation: 5,
                      width: '98%',
                      alignSelf: 'center',
                      marginTop: moderateScale(5),
                      height: screenHeight * 0.18,
                    },
                  ]}>
                  <CustomText
                    text={item?.time}
                    size={12}
                    color={Colors.gray_font}
                    customStyle={{
                      position: 'absolute',
                      top: moderateScale(10),
                      right: moderateScale(10),
                    }}
                  />
                  <View style={[styles.containerRow]}>
                    {/* <Avatar size={64} rounded source={{uri: item.image}} /> */}
                    {
                      item?.image && <Image source={{ uri: item.image }} style={{ borderRadius: moderateScale(100) }} width={moderateScale(70)} height={moderateScale(70)} />
                    }
                    <View style={styles.row}>
                      <View>
                        <CustomText text={item?.name} weight="700" size={16} />
                        <CustomText
                          color={Colors.gray_font}
                          text={
                            item?.review && item?.review.length > 20
                              ? `${item.review.substr(0, 20)}...`
                              : item?.review
                          }
                        />
                      </View>
                      <View style={{ alignSelf: 'center' }}>
                        <View
                          style={[
                            globalStyle.row,
                            {
                              marginTop: moderateScale(10),
                              justifyContent: 'space-evenly',
                            },
                          ]}>
                          <TouchableOpacity onPress={() => sendFunction(item)}>
                            <CustomIcon type='Feather' name='edit' />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => showDeleteModal(item.id)}>
                            <CustomIcon type='MaterialIcons' name='delete-outline' />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                  {item['review Image'] ? (
                    <Image
                      source={{ uri: item['review Image'] }}
                      style={styles.image}
                    />
                  ) : null}
                  <Text style={styles.text3}>{item.title}</Text>

                  <View
                    style={{
                      alignItems: 'center',
                      backgroundColor: '#fff',
                      position: 'absolute',
                      bottom: moderateScale(10),
                      right: moderateScale(10),
                      padding: moderateScale(5),
                      borderRadius: moderateScale(5),
                    }}>
                    <CustomIcon type="AntDesign" name="star" color="#FFA500" />
                    <CustomText
                      text={parseFloat(item.rating).toFixed(1)}
                      weight="500"
                    />
                  </View>
                </View>
              );
            }}
          />
        ) : (
          <View style={styles.modalView}>
            <Text style={styles.modalText1}>No reviews available</Text>
          </View>
        )}
      </View>
      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={hideDeleteModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>
              Are you sure you want to delete this review?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={hideDeleteModal}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleDelete}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {data.length > 5 && (
        <Pressable style={styles.tabBottom} onPress={handleShowMoreReviews}>
          <Text style={styles.text}>
            {showAllReviews ? 'Show Less' : 'Show All Reviews'}
          </Text>
        </Pressable>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  text: {
    color: 'black',
    fontFamily: 'Roboto-Medium',
    fontSize: 14,
  },
  containerRow: {
    flexDirection: 'row',
    marginBottom: moderateScale(5),
    justifyContent: 'space-between',
  },
  row: {
    width: screenWidth * .7,

    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text1: {
    color: 'black',
    fontSize: 14,
    fontFamily: 'Roboto-Black',
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text2: {
    // width: responsiveWidth(40),
    color: 'gray',
    fontSize: 14,
    fontFamily: 'Roboto-Light',
    marginBottom: 10,
    marginLeft: 5,
  },
  text3: {
    width: screenWidth * .8,
    color: 'black',
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    marginLeft: 10,
    marginBottom: 20,
  },
  tabBottom: {
    width: '100%',
    height: screenHeight * .7,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'orange',
    elevation: 1,
    borderColor: 'white',
    borderWidth: 2.5,
    position: 'static',
    marginBottom: 10,
    alignSelf: 'center',
  },
  image: {
    width: screenWidth * .8,
    height: screenHeight * .2,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 14,
    marginBottom: 20,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText1: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
    color: 'black',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
    width: '40%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 14,
  },
});

export default WrittenReview;
