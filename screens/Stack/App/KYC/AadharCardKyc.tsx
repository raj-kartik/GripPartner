

// import { StyleSheet, Text, View } from 'react-native'
// import React, { useEffect } from 'react'
// import { Digio, DigioConfig, DigioResponse, Environment, GatewayEvent, ServiceMode } from '@digiotech/react-native';

// const config: DigioConfig = { environment: Environment.PRODUCTION, serviceMode: ServiceMode.OTP };
// const digio = new Digio(config);
// const documentId = "<document_id>";
// const identifier = "<email_or_phone>";
// const tokenId = "<gateway_token_id";

// const AadharCardKyc = () => {
//   useEffect(() => {
//     const gatewayEventListener = digio.addGatewayEventListener(
//       (event: GatewayEvent) => {
//         // Do some operation on the received events
//         console.log("----- event in teh addahra card kyc ----", event);

//       }
//     );
//     return () => {
//       gatewayEventListener.remove();
//     }
//   }, []);

//   const triggerDigioGateway = async () => {
//     const digioResponse: DigioResponse = await digio.start(documentId, identifier, tokenId);

//   }

//   return (
//     <View>
//       <Text>AadharCardKyc</Text>
//     </View>
//   )
// }

// export default AadharCardKyc

// const styles = StyleSheet.create({})

import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const AadharCardKyc = () => {
  return (
    <View>
      <Text>AadharCardKyc</Text>
    </View>
  )
}

export default AadharCardKyc

const styles = StyleSheet.create({})