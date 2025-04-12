import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'

import { useNavigation } from '@react-navigation/native'
import LoginContainer from './LoginContainer'
import OtpVerification from './OtpVerification'
import axios from 'axios'
import Container from '../../../../components/Container'
import { BASE_URL, LOGIN_VIDEO, POST_LOGIN_OTP_REQUEST } from '../../../../utils/api'
import { CustomToast } from '../../../../components/Customs/CustomToast'
import CustomButton from '../../../../components/Customs/CustomButton'
import CustomInput from '../../../../components/Customs/CustomInput'
import CustomText from '../../../../components/Customs/CustomText'
import { globalStyle } from '../../../../utils/GlobalStyle'
import { moderateScale, screenHeight, screenWidth } from '../../../../components/Matrix/Matrix'
import makeApiRequest from '../../../../utils/ApiService'
import Images from '../../../../utils/Images'
import VideoPlayer, { type VideoPlayerRef } from 'react-native-video-player';
import Video from 'react-native-video';

const Login = () => {
  const navigation = useNavigation();
  // const playerRef = useRef<VideoPlayerRef>(null);
  const [isSent, setIsSent] = useState(false);
  const [mobile, setMobile] = useState<string>('');
  const [isEdit, setIsEdit] = useState(false);

  const [videoUrl, setVideoUrl] = useState<string>('');


  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response: any = await makeApiRequest({
          method: "POST",
          url: LOGIN_VIDEO,
          baseUrl: BASE_URL
        });

        if (response?.status === "success") {
          console.log("response in the video of login:", response);
          setVideoUrl(response?.video_url);
        }
      }
      catch (er) {
        console.error("Error in the login video :", er);

      }
    }

    fetchVideo();
  }, []);

  const handleLogin = async () => {
    if (mobile.length !== 10) {
      CustomToast({
        type: "error",
        text1: "Invalid Mobile Number",
        text2: "Please enter a valid 10-digit mobile number",
      });
      return;
    }

    // console.log("== mobile number ==", mobile);

    try {
      const response = await axios.post(`${BASE_URL}${POST_LOGIN_OTP_REQUEST}`, {
        phone_no: mobile,
      });

      if (response.status === 200 && response.data.success) {
        CustomToast({
          type: "success",
          text1: "OTP sent successfully",
          text2: "Do not share your OTP",
        });
        setIsSent(true); // Only update when the request is successful

        navigation.navigate('OtpVerification', {
          mobile,
          setIsSent,
          isSent,
          setIsEdit,
        });
      }

      // console.log("==== response in login otp ====", response);
    } catch (err: any) {
      console.error("Error in the Login Mobile Number", err);
      CustomToast({
        type: "error",
        text1: "Login Failed",
        text2: "Something went wrong, please try again.",
      });
    }
  };

  return (
    <View style={{flex:1}} >
        {
          videoUrl && <Video
            source={{ uri: videoUrl }} // or require('./assets/video.mp4')
            style={styles.video}
            resizeMode="cover"
            repeat
            muted
            playWhenInactive
            playInBackground
            ignoreSilentSwitch="obey"
          />
        }
      <LoginContainer handleLogin={handleLogin} mobile={mobile} setMobile={setMobile} setIsSent={setIsSent} isSent={isSent} />
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
  video:{
    position:"absolute",
    top:0,
    bottom:0,
    height:screenHeight,
    width:screenWidth,
  }
})