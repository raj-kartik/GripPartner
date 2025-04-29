import { StyleSheet, Text, View } from 'react-native'
import React, { use } from 'react'
import Container from '../../../../components/Container'
import { useSelector } from 'react-redux'
import CustomHeader2 from '../../../../components/Customs/Header/CustomHeader2'

const UpdateStudioProfile = () => {
    const {user} = useSelector((state:any)=>state?.user);

    console.log("--- studio profile user details ----",user);
    
  return (
    <Container>
        <CustomHeader2 title="Studio Profile" />

        {/* map */}
        <View>

        </View>
    </Container>
  )
}

export default UpdateStudioProfile

const styles = StyleSheet.create({})