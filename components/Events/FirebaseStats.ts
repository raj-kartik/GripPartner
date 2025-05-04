import analytics from '@react-native-firebase/analytics';
const firbaseEvent = async ({
    eventName="",
    itemName="",
    description="",
    size="",
    id=0,
}) => {
  analytics().logEvent('basket', {
    id: id,
    item: itemName,
    description: description,
    name: eventName,
    size: size,
  });
};
