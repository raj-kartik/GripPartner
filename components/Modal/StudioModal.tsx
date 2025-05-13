import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux';
import CustomModal from '@components/Customs/CustomModal';
import { globalStyle } from '@utils/GlobalStyle';
import CustomText from '@components/Customs/CustomText';
import { moderateScale, screenHeight, screenWidth } from '@components/Matrix/Matrix';
import Colors from '@utils/Colors';

const StudioModal = ({ modal, setModal, handleStudio, selectStudio }: any) => {
    const { studio } = useSelector((state: any) => state.studio);

    // console.log("---- selectStudio ----", selectStudio);

    return (
        <CustomModal
            iscenter={false}
            visible={modal}
            containerStyle={{
                width: screenWidth,
                alignSelf: "center",
                height: screenHeight * .4
            }}
            onDismiss={() => {
                setModal(false)
            }}
        >
            <View style={[globalStyle.modalbar]} />
            <CustomText customStyle={{ textAlign: "center" }} text='Select Studio' weight='500' size={16} />

            <FlatList
                data={studio}
                keyExtractor={item => item?.id}
                renderItem={({ item }: any) => {
                    return (
                        <TouchableOpacity onPress={() => {
                            handleStudio(item);
                            setModal(false);
                        }} style={[styles.studioContainaer, {
                            backgroundColor: item?.id === selectStudio?.id ? Colors.orange : "#f7f7f7"
                        }]} >
                            <CustomText weight='500' text={item?.studio_name} size={14} />
                        </TouchableOpacity>
                    )
                }}
            />
        </CustomModal>
    )
}

export default StudioModal

const styles = StyleSheet.create({
    studioContainaer: {
        width: "100%",
        // height:moderateScale(20),
        backgroundColor: "#f7f7f7",
        marginVertical: moderateScale(5),
        paddingVertical: moderateScale(20),
        paddingHorizontal: moderateScale(10),
        borderRadius: moderateScale(10)
    }
})