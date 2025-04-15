import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Container from '../../../../components/Container'
import CustomText from '../../../../components/Customs/CustomText'
import CustomHeader2 from '../../../../components/Customs/Header/CustomHeader2'
import * as Yup from 'yup'

const followSchema = Yup.object().shape({
    comment:Yup.string().min(3,'*too Short').max(500,'*too large'),
    date:Yup.date().required('*required'),
});
const LeadFollowUp = () => {
  return (
    <Container>
        <CustomHeader2 title='Follow Up' />
    </Container>
  )
}

export default LeadFollowUp

const styles = StyleSheet.create({})