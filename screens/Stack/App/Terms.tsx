import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Container from '../../../components/Container'
import CustomHeader2 from '../../../components/Customs/Header/CustomHeader2'
import makeApiRequest from '../../../utils/ApiService'
import { GET_TERMS } from '../../../utils/api'
import CustomText from '../../../components/Customs/CustomText'
import { moderateScale } from '../../../components/Matrix/Matrix'

const Terms = () => {

    const [terms, setTerms] = useState(null);

    useEffect(() => {
        const fetchTerms = async () => {
            try {
                const response: any = await makeApiRequest({
                    method: "GET",
                    url: GET_TERMS
                })

                if (response?.status === "success") {
                    setTerms(response?.policy)
                }
                console.log("=== response in the terms and conditions ====", response);

            }
            catch (err: any) {
                console.error("Error in the term and conditions: ", err);


            }
        }

        fetchTerms();
    }, []);
    return (
        <Container>
            <CustomHeader2 title="Terms of Services" />
            <ScrollView style={{marginTop:moderateScale(10)}} showsVerticalScrollIndicator={false} >
                <CustomText text={terms || ""} />
            </ScrollView>
        </Container>
    )
}

export default Terms

const styles = StyleSheet.create({})