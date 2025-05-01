// import { StyleSheet, Text, View, Button } from 'react-native'
// import { Digio, DigioConfig, DigioResponse, Environment, GatewayEvent, ServiceMode } from '@digiotech/react-native';
// import React, { useEffect, useRef } from 'react'

// const AadharCardKyc = () => {
//     const digioRef = useRef<Digio | null>(null);

//     // useEffect(() => {
//     //     const config: DigioConfig = {
//     //         environment: Environment.PRODUCTION,
//     //         serviceMode: ServiceMode.OTP
//     //     };

//     //     // Initialize digio only once
//     //     digioRef.current = new Digio(config);

//     //     const gatewayEventListener = digioRef.current.addGatewayEventListener(
//     //         (event: GatewayEvent) => {
//     //             console.log("Received Digio Event:", event);
//     //             // Handle event (success, failure, close, etc.)
//     //         }
//     //     );

//     //     return () => {
//     //         gatewayEventListener.remove();
//     //     };
//     // }, []);

//     useEffect(() => {

//         const config = {
//             environment: Environment.PRODUCTION, // or Environment.SANDBOX
//             serviceMode: ServiceMode.OTP, // or ServiceMode.BIOMETRIC
//         };
//         const digio = new Digio(config);

//         const documentId = '<document_id>';
//         const identifier = '<email_or_phone>';

//         const digitReponse = async () => {
//             try {
//                 const digioResponse = await digio.start(documentId, identifier);
//                 // Handle the response
//                 console.log(digioResponse);
//             } catch (error) {
//                 // Handle errors
//                 console.error(error);
//             }
//         }

//         digitReponse();

//     }, []);

//     const triggerDigioGateway = async () => {
//         const documentId = "<document_id>";
//         const identifier = "<email_or_phone>";
//         const tokenId = "<gateway_token_id>"; // Make sure this is the actual token string

//         try {
//             if (digioRef.current) {
//                 const digioResponse: DigioResponse = await digioRef.current.start(documentId, identifier, tokenId);
//                 console.log("---- Digio Response ----", digioResponse);
//             } else {
//                 console.warn("Digio not initialized.");
//             }
//         } catch (error) {
//             console.error("Error starting Digio:", error);
//         }
//     };

//     return (
//         <View style={styles.container}>
//             <Text>AadharCardKyc</Text>
//             <Button title="Start KYC" onPress={triggerDigioGateway} />
//         </View>
//     )
// }

// export default AadharCardKyc

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center'
//     }
// });

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