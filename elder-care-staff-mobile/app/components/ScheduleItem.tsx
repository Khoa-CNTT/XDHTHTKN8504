import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface ScheduleItemProps {
  time: string;
  title: string;
  details: string;
  onPress?: () => void; 
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({
  time,
  title,
  details,
  onPress, 
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.time}>{time}</Text>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.details}>{details}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ScheduleItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  time: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#28A745",
    width: 90,
    paddingRight: 15,
  },
  content: {
    flex: 1,
    gap: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  details: {
    fontSize: 14,
    color: "#6C757D",
  },
});
