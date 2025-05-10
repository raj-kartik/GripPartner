import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Container from '../../../../../components/Container'
import CustomHeader2 from '../../../../../components/Customs/Header/CustomHeader2'

const StudioDetail = (props: any) => {

    console.log("item in the studio detail", props?.route?.params?.item);

    return (
        <Container>
            <CustomHeader2 title="Studio Detail" />
        </Container>
    )
}

export default StudioDetail

const styles = StyleSheet.create({})