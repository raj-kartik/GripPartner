import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import makeApiRequest from '../../../../utils/ApiService';
import { BASE_URL } from '../../../../utils/api';
import { globalStyle } from '../../../../utils/GlobalStyle';
import CustomModal from '../../../../components/Customs/CustomModal';
import CustomText from '../../../../components/Customs/CustomText';
import { moderateScale } from '../../../../components/Matrix/Matrix';
import CustomButton from '../../../../components/Customs/CustomButton';
import Colors from '../../../../utils/Colors';
import SubscriptionCard from '../../../../components/Cards/SubscriptionCard';
import commonStyle from '../../../../utils/CommonStyleComponent';
import Container from '../../../../components/Container';

const CourseLead = ({ route }: any) => {
  const { user } = useSelector((state: any) => state.user);
  const [loading, setLoading] = useState(false);
  const [lead, setLead] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filterModal, setFilterModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('')
  const [filteredData, setFilteredData] = useState([]);

  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      CoursesLead();
    }, []),
  );

  const CoursesLead = async () => {
    setLoading(true);
    try {
      const endpoint = `lead-list-user?user_id=${user?.id}`;
      console.log(endpoint, 'endpo');
      // const response: any = await getMethod(endpoint);
      const response: any = await makeApiRequest({
        baseUrl: BASE_URL,
        method: "GET",
        url: endpoint,
      })

      // console.log("---- response in the lead coruse ----", response);

      if (response.success == true) {
        setLead(response.leads);
        setFilteredData(response.leads);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log('error it');
    }
  };

  const ListDetailFun = (item: any) => {
    console.log(item);
    // return;
    navigation.dispatch(
      CommonActions.navigate({
        name: 'CourseLeadDetails',
        params: {
          lead_id: item.id,
          subscription_id: item.suscription_id,
          courseId: item?.course_id,
        },
      }),
    );
  };

  useEffect(() => {
    if (!searchText && !filterStatus) {
      // Show all data when no filters are applied
      setFilteredData(lead);
      return;
    }

    const filtered = lead.filter((item: any) => {
      const matchesStatus = filterStatus ? item.status.toLowerCase() === filterStatus.toLowerCase() : true;
      const matchesSearchText =
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item["course name"].toLowerCase().includes(searchText.toLowerCase());

      return matchesStatus && matchesSearchText;
    });

    setFilteredData(filtered);
  }, [searchText, filterStatus]);


  return (
    <Container >
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
        showsVerticalScrollIndicator={false}>
        {filteredData.length > 0 ? (
          filteredData.map(item => (
            <SubscriptionCard
              item={item}
              handlePress={() => ListDetailFun(item)}
            />
          ))
        ) : (
          <View style={[commonStyle.modalView]}>
            <Text style={commonStyle.modalText}>Oops! No Lead Found</Text>
          </View>
        )}
      </ScrollView>

    </Container>
  )
}

export default CourseLead

const styles = StyleSheet.create({})