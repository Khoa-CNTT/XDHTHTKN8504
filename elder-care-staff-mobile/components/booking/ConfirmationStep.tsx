// import React from "react";
// import { View, StyleSheet } from "react-native";
// import { Text, Button, Card } from "react-native-paper";

// type Props = {
//   data: {
//     name: string;
//     phone: string;
//     email: string;
//     address: string;
//     service: string;
//   };
//   onConfirm: () => void;
// };

// export default function ConfirmationStep({ data, onConfirm }: Props) {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Review & Confirm</Text>

//       <Card style={styles.card}>
//         <Card.Content>
//           <Text>Name: {data.name}</Text>
//           <Text>Phone: {data.phone}</Text>
//           <Text>Email: {data.email}</Text>
//           <Text>Address: {data.address}</Text>
//           <Text>Service: {data.service}</Text>
//         </Card.Content>
//       </Card>

//       <Button
//         mode="contained"
//         onPress={onConfirm}
//         style={styles.confirmButton}
//         buttonColor="#28a745"
//         labelStyle={{ color: "white" }}
//       >
//         Confirm & Pay
//       </Button>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     backgroundColor: "#f4fdf4",
//     flex: 1,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "600",
//     marginBottom: 16,
//     color: "#333",
//   },
//   card: {
//     backgroundColor: "white",
//     borderRadius: 12,
//     marginBottom: 24,
//   },
//   confirmButton: {
//     borderRadius: 8,
//     paddingVertical: 8,
//   },
// });
