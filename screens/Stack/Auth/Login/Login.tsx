import { StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import LoginContainer from './LoginContainer'
import axios from 'axios'
import { BASE_URL, LOGIN_VIDEO, POST_LOGIN_OTP_REQUEST } from '../../../../utils/api'
import { CustomToast } from '../../../../components/Customs/CustomToast'
import { screenHeight, screenWidth } from '../../../../components/Matrix/Matrix'
import makeApiRequest from '../../../../utils/ApiService'
import Video from 'react-native-video';
import {
  getHash,
  startOtpListener,
  useOtpVerify,
} from 'react-native-otp-verify';

const Login = () => {
  const navigation = useNavigation();
  // const playerRef = useRef<VideoPlayerRef>(null);
  const [isSent, setIsSent] = useState(false);
  const [mobile, setMobile] = useState<string>('');
  const [isEdit, setIsEdit] = useState(false);
  const [hash, setHash] = useState<string>('');

  const [videoUrl, setVideoUrl] = useState<string>('');

  console.log("--- video url ----", videoUrl);




  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response: any = await makeApiRequest({
          method: "POST",
          url: LOGIN_VIDEO,
          baseUrl: BASE_URL
        });
        if (response?.status === "success") {
          setVideoUrl(response?.video_url);
        }
      }
      catch (er) {
        console.error("Error in the login video :", er);
      }
    }

    const fetchGetHash = async () => {
      getHash().then((hash: any) => {
        setHash(hash[0]);
      }).catch(console.log);
    }

    fetchGetHash();
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

    try {
      const response = await axios.post(`${BASE_URL}${POST_LOGIN_OTP_REQUEST}`, {
        phone_no: mobile,
        hash: hash
      });

      console.log("==== response in the login =====", response);

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
    <View style={{ flex: 1 }} >
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
  video: {
    position: "absolute",
    top: 0,
    bottom: 0,
    height: screenHeight,
    width: screenWidth,
    zIndex: 0
  }
})