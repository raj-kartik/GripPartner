import analytics, {logEvent} from '@react-native-firebase/analytics';
export const shopCustomEvent = async ({
  eventName = '',
  itemName = '',
  description = '',
  size = 0,
  id = 0,
}) => {
  try {
    await analytics().logEvent(eventName, {
      id: id,
      name: itemName,
      description: description,
      // name: eventName,
      size: size,
    });

    console.log('Event captured succesfully');
  } catch (e) {
    console.log('Error in shopCustomEvent', e);
  }
};
