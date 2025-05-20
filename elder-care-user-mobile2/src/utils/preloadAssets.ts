import { Asset } from "expo-asset";

const images = [
    require("../asset/img/logo.png"),
];

export async function preloadAssetsAsync() {
  const cacheImages = images.map((image) => {
    return Asset.fromModule(image).downloadAsync();
  });

  return Promise.all(cacheImages);
}
