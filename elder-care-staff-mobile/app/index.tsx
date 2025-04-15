import { View } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View>
      <Link href="/screens/tabs/home">Click Here</Link>
    </View>
  );
}
