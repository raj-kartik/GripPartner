import React, { FC } from 'react';
import { StyleSheet, Pressable, ViewStyle } from 'react-native';
import { moderateScale, screenHeight } from './Matrix/Matrix';
import CustomText from './Customs/CustomText';
import Colors from '../utils/Colors';
import { uploadDocument } from '../utils/UtilityFuncations';
import { globalStyle } from '../utils/GlobalStyle';
import CustomIcon from './Customs/CustomIcon';

interface DocumentPickerComponentProps {
  onPickDocument: (
    documents: { name: string; base64: string; type: string }[]
  ) => void;
  buttonText?: string;
  customStyle?: ViewStyle;
  title?: string;
  instruction?: string;
  allowMultiple?: boolean;
  docType?: string[];
}

const DocumentPickerComponent: FC<DocumentPickerComponentProps> = ({
  onPickDocument,
  buttonText = 'Select Document',
  customStyle,
  title = 'Upload Document',
  instruction = 'Accepted formats Jpg, Jpeg, Png, Tif Max size 2MB',
  allowMultiple = false,
  docType,
}) => {
  const handlePick = async () => {
    try {
      const docs: any = await uploadDocument(allowMultiple, docType);
      if (docs && docs.length > 0) {
        onPickDocument(docs);
      }
    } catch (error) {
      console.error('Document pick error:', error);
    }
  };

  return (
    <Pressable onPress={handlePick} style={[globalStyle.center, styles.upload, customStyle]}>
      <CustomIcon type="AntDesign" name="upload" size={30} />
      <CustomText text={title} weight="500" size={16} />
      <CustomText text={instruction} size={13} color={Colors.lightGray} weight="500" />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  upload: {
    width: '100%',
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: Colors.orange,
    height: screenHeight * 0.2,
    marginBottom: moderateScale(10),
    marginTop: moderateScale(5),
    backgroundColor: Colors.orange_blur,
  },
});

export default DocumentPickerComponent;
