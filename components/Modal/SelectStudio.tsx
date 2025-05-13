import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { moderateScale } from '../Matrix/Matrix';
import Colors from '../../utils/Colors';
import CustomText from '../Customs/CustomText';
import { useSelector } from 'react-redux';

const SelectStudio = ({ handleSelectStudio, selectedStudios }: any) => {
    const { studio } = useSelector((state: any) => state.studio);

    // console.log("---- studio ----", studio);

    const studioArray = studio.map((item: any) => (
        { label: item?.studio_name, value: item?.studio_name, id: item?.id, type: item?.studio_type }
        // { label: item?.studio_name, value: item?.studio_name, id: item?.id }
    ));

    return (
        <View style={styles.container}>
            <Dropdown
                data={studioArray}
                value={selectedStudios}
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                placeholder='Select Studio'
                labelField="label"
                valueField="value"
                search={false}
                onChange={(item) => {
                    handleSelectStudio(item);
                }}
            />
        </View>
    );
};

export default SelectStudio;

const styles = StyleSheet.create({
    container: {
        // padding: moderateScale(16),
    },
    placeholderStyle: {
        color: Colors.gray_font,
    },
    selectedTextStyle: {
        color: '#000',
        fontWeight: '500',
        fontSize: 16,
    },
    inputSearchStyle: {
        color: '#000',
        backgroundColor: '#fff',
    },
    dropdown: {
        width: '98%',
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: Colors.gray_font,
        paddingHorizontal: moderateScale(10),
        borderRadius: moderateScale(8),
        marginTop: moderateScale(0),
        paddingVertical: moderateScale(13),
        backgroundColor: '#fff',
    },
    selectedStyle: {
        borderWidth: 1,
        borderColor: '#000',
        alignItems: 'center',
        flexDirection: 'row',
    },
});
