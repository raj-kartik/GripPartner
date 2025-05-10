import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Container from '../../../components/Container'
import CustomHeader2 from '../../../components/Customs/Header/CustomHeader2'
import makeApiRequest from '../../../utils/ApiService'
import { GET_POLICY } from '../../../utils/api'
import CustomText from '../../../components/Customs/CustomText'
import { moderateScale, screenWidth } from '../../../components/Matrix/Matrix'
import RenderHTML from 'react-native-render-html';

const Policy = () => {

    const [terms, setTerms] = useState(null);

    useEffect(() => {
        const fetchTerms = async () => {
            try {
                const response: any = await makeApiRequest({
                    method: "GET",
                    url: GET_POLICY
                })

                if (response?.status === "success") {
                    setTerms(response?.policy)
                }
                console.log("=== response in the privacy policy ====", response?.policy);

            }
            catch (err: any) {
                console.error("Error in the term and conditions: ", err);


            }
        }

        fetchTerms();
    }, []);
    return (
        <Container>
            <CustomHeader2 title="Privacy Policy" />
            <ScrollView style={{marginTop:moderateScale(10)}} showsVerticalScrollIndicator={false} >
                <RenderHTML contentWidth={screenWidth} source={{ html: terms || "" }} />
            </ScrollView>
        </Container>
    )
}

export default Policy

const styles = StyleSheet.create({})