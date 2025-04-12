import React, {FC} from 'react';
import {View, TouchableOpacity, StyleSheet, Alert} from 'react-native';
// import DocumentPicker, {
//   DocumentPickerResponse,
//   isInProgress,
// } from '@react-native-documents/picker';
import { pick } from '@react-native-documents/picker'
import RNFS from 'react-native-fs';
import { moderateScale, screenWidth } from './Matrix/Matrix';
import CustomText from './Customs/CustomText';
import Colors from '../utils/Colors';


interface DocumentPickerComponentProps {
  onPickDocument: (
    documents: {name: string; base64: string; type: string}[],
  ) => void; // Callback for selected documents
  buttonText?: string; // Text to display on the button
  customStyle?: object; // Additional styles for the container
  title?: string; // Title for the document picker
  instruction?: string; // Instruction text to display
  allowMultiple?: boolean; // Prop to control multiple document selection
}

const DocumentPickerComponent: FC<DocumentPickerComponentProps> = ({
  onPickDocument,
  buttonText = 'Select Document',
  customStyle,
  title = 'Upload Document',
  instruction = 'Accepted formats Jpg, Jpeg, Png, Tif Max size 2MB',
  allowMultiple = false,
}) => {
  const handleDocumentPick = async () => {
    try {
    //   const result = await DocumentPicker.pick({
    //     type: [DocumentPicker.types.allFiles],
    //     allowMultiSelection: allowMultiple,
    //   });

    const [result]:any = await pick();

      const documents:any = await Promise.all(
        result.map(async (doc:any) => {
          // console.log('Document URI:', doc.uri);

          // Check if the URI is a content URI (Android)
          if (doc.uri.startsWith('content://')) {
            const localFilePath = RNFS.DocumentDirectoryPath + '/' + doc.name;

            // Copy the file to the app's document directory
            await RNFS.copyFile(doc.uri, localFilePath);

            // Now, you can read the file as base64
            const base64Data = await RNFS.readFile(localFilePath, 'base64');
            const fileStat = await RNFS.stat(localFilePath);

            // console.log('==== file upload ===', {
            //   // base64: base64Data,
            //   name: doc.name,
            //   type: doc.type,
            //   size: fileStat,
            //   uri: fileStat?.path,
            // });

            return {
              // base64: base64Data,
              name: doc.name,
              type: doc.type,
              size: fileStat.size,
              uri: fileStat?.path,
            };
          } else {
            // Handle file URI (if not a content URI)
            const base64Data = await RNFS.readFile(doc.uri, 'base64');
            const fileStat = await RNFS.stat(doc.uri);

            return {
              name: doc.name,
              type: doc.type,
              size: fileStat.size,
              uri: fileStat?.path,
            };
          }
        }),
      );

      // console.log('=== documents ====', documents);

      onPickDocument(documents[0]); // Pass selected documents to parent
    } catch (error: any) {
      if (DocumentPicker.isCancel(error)) {
        console.log('User canceled the picker');
      } else if (isInProgress(error)) {
        console.log(
          'Multiple pickers were opened, only the last will be considered',
        );
      } else {
        Alert.alert('Error', error.message || 'Something went wrong');
      }
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, customStyle]}
      onPress={handleDocumentPick}>
      <CustomText weight="600" size={16} text={title} />
      <CustomText
        color={Colors.gray_font}
        customStyle={{marginTop: moderateScale(2)}}
        text={instruction}
        size={15}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: moderateScale(10),
    padding: moderateScale(10),
    width: '100%',
    height: screenWidth * 0.3,
    // justifyContent: 'center',
    // alignItems: 'center',
    elevation: 5,
    backgroundColor: '#fff',
    borderRadius: moderateScale(10),
    borderWidth: 0.4,
    paddingVertical: moderateScale(20),
  },
  button: {
    backgroundColor: Colors.white,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DocumentPickerComponent;
