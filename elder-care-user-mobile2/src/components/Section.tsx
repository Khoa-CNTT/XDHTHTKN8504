import React, { ReactNode } from "react";
import { View, Text } from "react-native";

interface SectionProps {
  title: string;
  children: ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <View style={{ marginBottom: 16 }}>
    <Text style={{ fontWeight: "600", fontSize: 16, marginBottom: 6 }}>
      {title}
    </Text>
    {children}
  </View>
);

export default Section;
