import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import Container from '../../components/Container';
import makeApiRequest from '../../utils/ApiService';
import { BASE_URL, NOTIFICATION_LIST } from '../../utils/api';
import { useDispatch, useSelector } from 'react-redux';
import { getNotificaiton } from '../../redux/Slice/NotificationSlice';
import CustomHeader2 from '../../components/Customs/Header/CustomHeader2';
import Images from '../../utils/Images';
import CustomText from '../../components/Customs/CustomText';
import { moderateScale } from '../../components/Matrix/Matrix';
import { globalStyle } from '../../utils/GlobalStyle';
import { useFocusEffect } from '@react-navigation/native';

const Notifications = () => {
  const { user } = useSelector((state: any) => state?.user);
  const dispatch = useDispatch();

  const { notification, loading } = useSelector(
    (state: any) => state?.notification,
  );

  // console.log("==== notification ====", notification);
  // console.log("==== user ====", user);


  const notificatonType: any = [
    {
      id: 1,
      label: 'All',
      value: 'all',
    },
    // {
    //   id: 2,
    //   label: 'Updates',
    //   value: 'updates',
    // },
    {
      id: 4,
      label: 'Read',
      value: 'read',
    },
    {
      id: 3,
      label: 'Unread',
      value: 'unread',
    },
  ];
  const [selectType, setSelectType] = useState(notificatonType[0].value);

  const getFunction = async (userId: string) => {
    await dispatch(getNotificaiton({ id: userId, notiType: selectType }));
  };

  useFocusEffect(
    useCallback(() => {
      const timeout = setTimeout(() => {
        // console.log("--- use focus effect ----");
        if (user?.id) {
          getFunction(user.id);
        }
      }, 60000);

      return () => clearTimeout(timeout);
    }, [user?.id, getFunction])
  );



  if (loading)
    <ActivityIndicator color="#000" size="large" style={{ flex: 1 }} />;

  return (
    <Container>
      <CustomHeader2 title="Notification" isBack={false} />
      <View style={[globalStyle.row, { flex: 0.05, width: '100%', marginTop: moderateScale(10) }]}>
        {notificatonType.map((item: any, index: number) => {
          return (
            <Pressable
              key={item?.id}
              onPress={() => {
                setSelectType(item?.value);
              }}
              style={[
                globalStyle.center,
                {
                  borderWidth: 1,
                  flex: 1,
                  height: moderateScale(30),
                  paddingHorizontal: moderateScale(10),
                  marginRight: moderateScale(10),
                  borderRadius: moderateScale(5),
                  backgroundColor:
                    selectType === item?.value ? '#000' : '#f7f7f7',
                },
              ]}>
              <CustomText
                text={item?.label}
                color={selectType === item?.value ? '#fff' : '#000'}
                weight={selectType === item?.value ? '500' : '400'}
              />
            </Pressable>
          )
        })}
      </View>
      {notification && notification.length === 0 ? (
        <View style={[globalStyle.center, { flex: 0.9 }]}>
          <Images.Logo width={moderateScale(100)} height={moderateScale(100)} />
          <CustomText text="No Notification" weight="500" />
        </View>
      ) : (
        notification.map((item: any) => {
          // console.log("==== itme in the notification ====", item);
          return (
            <View key={item?.id} style={styles.notificationContainer} >
              <CustomText text={item?.title} weight='600' size={18} />
              <CustomText text={item?.message} />
            </View>
          )
        })
      )}
    </Container>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  notificationContainer: {
    width: "100%",
    height: moderateScale(60),
    backgroundColor: "#f7f7f7",
    borderRadius: moderateScale(10),
    marginTop: moderateScale(10),
    marginBottom: moderateScale(5),
    justifyContent: "center",
    padding: moderateScale(10)
  }
});
