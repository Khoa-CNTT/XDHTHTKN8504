import { Linking, Platform } from 'react-native';

export const openInMaps = (address: string) => {
  const encodedAddress = encodeURIComponent(address);
  const mapsUrl = Platform.select({
    ios: `maps:0,0?q=${encodedAddress}`,
    android: `geo:0,0?q=${encodedAddress}`,
    default: `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
  });

  Linking.canOpenURL(mapsUrl).then((supported) => {
    if (supported) {
      Linking.openURL(mapsUrl);
    } else {
      // Fallback to web browser if maps app is not available
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`);
    }
  });
};
