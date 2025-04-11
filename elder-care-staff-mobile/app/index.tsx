import { View } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View>
      <Link href="/screens/auth/Login">Click Here</Link>
    </View>
  );
}
