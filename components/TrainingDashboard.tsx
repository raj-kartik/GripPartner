import { StyleSheet, View } from 'react-native';
import React from 'react';
import CustomText from './Customs/CustomText';
import CustomIcon from './Customs/CustomIcon';
import { moderateScale, screenWidth } from './Matrix/Matrix';
import { globalStyle } from '../utils/GlobalStyle';
import Colors from '../utils/Colors';

// import CustomText from '../../../../Custom/CustomText';
// import CustomIcon from '../../../../Custom/CustomIcon';
// import {moderateScale, screenWidth} from '../../../../Matrix/Matrix';
// import {globalStyle} from '../../../../../../utils/GlobalStyles';
// import colors from '../../../../../style/colors';

const ICONS = {
  lead: {
    type: 'MaterialIcons',
    name: 'groups',
    color: '#f7a011',
    bgColor: 'rgba(247, 160, 17, 0.1)',
  },
  interest: {
    type: 'AntDesign',
    name: 'flag',
    color: Colors.orange,
    bgColor: 'rgba(255,165,0, 0.1)',
  },
  application: {
    type: 'MaterialIcons',
    name: 'description',
    color: '#673ab7',
    bgColor: 'rgba(103, 58, 183, 0.1)',
  },
  impression: {
    type: 'FontAwesome',
    name: 'eye',
    color: '#FF5733',
    bgColor: 'rgba(255, 87, 51, 0.1)',
  },
  subs: {
    type: 'MaterialCommunityIcons',
    name: 'account-arrow-left',
    color: '#03b032',
    bgColor: 'rgba(3, 176, 50, 0.1)',
  },
  click: {
    type: 'MaterialIcons',
    name: 'touch-app',
    color: '#1467e8',
    bgColor: 'rgba(20, 103, 232, 0.1)',
  },
};

const TrainerDashboard = ({
  lead,
  interest,
  application,
  impression,
  subs,
  click,
  isRetreat = false
}: any) => {
  const data = [
    { key: 'lead', label: 'Leads', value: lead },
    { key: 'interest', label: 'Interest', value: interest },
    { key: 'application', label: 'Application', value: application },
    { key: 'impression', label: 'Views', value: impression },
    { key: 'subs', label: !isRetreat ? 'Subscribed' : 'Booking', value: subs },
    { key: 'click', label: 'Click', value: click },
  ].filter(item => item.value !== undefined && item.value !== null);

  return (
    <View
      style={[
        globalStyle.row,
        {
          justifyContent: 'space-between',
          alignSelf: 'center',
        },
      ]}>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          marginVertical: moderateScale(10),
          //   flex:1
        }}>
        {data.map(({ key, label, value }) => (
          <View key={key} style={{ alignItems: 'center', flex: 1 }}>
            <View
              style={{
                width: moderateScale(50),
                height: moderateScale(50),
                borderRadius: moderateScale(10),
                backgroundColor: ICONS[key].bgColor,
                padding: moderateScale(2),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <CustomIcon
                type={ICONS[key].type}
                color={ICONS[key].color}
                name={ICONS[key].name}
                size={30}
              />
            </View>
            <CustomText
              customStyle={{ marginTop: moderateScale(3) }}
              text={`${value} ${label}`}
              weight="500"
              size={13}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

export default TrainerDashboard;

const styles = StyleSheet.create({});
