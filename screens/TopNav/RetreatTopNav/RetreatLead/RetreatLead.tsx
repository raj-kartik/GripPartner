import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import makeApiRequest from '../../../../utils/ApiService';
import { BASE_URL } from '../../../../utils/api';
import commonStyle from '../../../../utils/CommonStyleComponent';
import Container from '../../../../components/Container';
import CustomModal from '../../../../components/Customs/CustomModal';
import CustomText from '../../../../components/Customs/CustomText';
import { moderateScale } from '../../../../components/Matrix/Matrix';
import Colors from '../../../../utils/Colors';
import CustomButton from '../../../../components/Customs/CustomButton';
import AccountCourseCard from '../../../../components/Cards/AccountCourseCard';
import CustomLeadFilter from '../../../../components/Customs/CustomLeadFilter';

const RetreatLead = () => {

  const [loading, setLoading] = useState(false);
  const [RetreatLead, setRetreatLead] = useState([]);
  const [message, setMessage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterModal, setFilterModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('')
  const [filteredData, setFilteredData] = useState([]);
  const { user } = useSelector((state: any) => state.user);

  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      RetreatLeadLisfun();
    }, []),
  );

  const RetreatLeadLisfun = async () => {
    let endpoint = ``;

    setLoading(true);
    try {
      endpoint = `user-retreat-lead-list?user_id=${user?.id}`;
      // const response: any = await getMethod(endpoint);
      const response: any = await makeApiRequest({
        url: endpoint,
        baseUrl: BASE_URL,
        method: "GET"
      })
      if (response.success === true) {
        setRetreatLead(response?.lead_list);
        setMessage(response?.message);
        setFilteredData(response?.lead_list);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error it');
    }
  };

  const ListDetailFun = (item: any) => {
    console.log('=== item in the nacigation  ===', item);
    // return;
    navigation.dispatch(
      CommonActions.navigate({
        name: 'RetreatLeadDetail',
        params: {
          lead_id: item.lead_id,
          item: item,
          retreat_id: item?.retreat_id
        },
      }),
    );
  };
  
  const onRefresh = () => {
    setRefreshing(true);
    RetreatLeadLisfun(); // re-fetch the data
    setRefreshing(false);
  };
  useEffect(() => {
    if (!searchText && !filterStatus) {
      // Show all data when no filters are applied
      setFilteredData(RetreatLead);
      return;
    }

    const filtered = RetreatLead.filter((item: any) => {
      const matchesStatus = filterStatus ? item.status.toLowerCase() === filterStatus.toLowerCase() : true;
      const matchesSearchText =
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item?.retreat_title.toLowerCase().includes(searchText.toLowerCase());

      return matchesStatus && matchesSearchText;
    });

    setFilteredData(filtered);
  }, [searchText, filterStatus]);

  return (
    <Container>
      <CustomLeadFilter searchText={searchText} setSearchText={setSearchText} handleFilter={() => { setFilterModal(true) }} />

      <CustomModal visible={filterModal} onDismiss={() => { setFilterModal(false) }} iscenter={true} >

        <CustomText text='Filter' size={18} weight='700' customStyle={{ textAlign: "center" }} />

        {/* status */}
        <View style={{ marginBottom: moderateScale(10) }} >
          <CustomText text='Status' weight='600' size={16} color={Colors.gray_font} customStyle={{ marginBottom: moderateScale(5) }} />
          <TouchableOpacity style={{ backgroundColor: "#f7f7f7", width: "98%", padding: moderateScale(10), marginBottom: moderateScale(5) }} onPress={() => { setFilterStatus('Open') }} >
            <CustomText text='Open' size={16} weight='500' />
          </TouchableOpacity>

          <TouchableOpacity style={{ backgroundColor: "#f7f7f7", width: "98%", padding: moderateScale(10), marginBottom: moderateScale(5) }} onPress={() => { setFilterStatus('Close') }} >
            <CustomText text='Close' size={16} weight='500' />
          </TouchableOpacity>

          <TouchableOpacity style={{ backgroundColor: "#f7f7f7", width: "98%", padding: moderateScale(10), marginBottom: moderateScale(5) }} onPress={() => { setFilterStatus('Subscribed') }} >
            <CustomText text='Subscribed' size={16} weight='500' />
          </TouchableOpacity>
        </View>

        <CustomButton title='Save' customStyle={{ marginBottom: moderateScale(10) }} onPress={() => {
          setFilterModal(false)
        }} />

        <CustomButton title='Clear' bg={Colors.orange} customStyle={{ marginBottom: moderateScale(10) }} onPress={() => {
          setFilterStatus('');
          setSearchText('');
          setFilterModal(false);
        }} />

      </CustomModal>
      <ScrollView
        style={{ flexGrow: 1, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      >
        {loading ? (
          <ActivityIndicator size={20} color="black" />
        ) : filteredData ? (
          filteredData.map((item: any) => {
            return (
              <AccountCourseCard
                onPress={() => ListDetailFun(item)}
                item={{
                  course_name: item?.retreat_title,
                  lead_date: item?.created_at,
                  status: item?.lead_status,
                  image: item?.image,
                  name: item?.name,
                }}
              />
            );
          })
        ) : (
          <View style={commonStyle.modalView}>
            <Text style={commonStyle.modalText}>{message}</Text>
          </View>
        )}
      </ScrollView>
    </Container>
  )
}

export default RetreatLead

const styles = StyleSheet.create({})