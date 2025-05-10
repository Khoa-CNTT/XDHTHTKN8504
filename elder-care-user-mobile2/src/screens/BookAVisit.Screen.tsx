// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Platform,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { StackNavigationProp } from "@react-navigation/stack";
// import { Ionicons } from "@expo/vector-icons";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import { Profile } from "../types/profile";

// type RootStackParamList = {
//   AddCareRecipient: undefined;
//   Profile: undefined;
//   BookVisit: undefined;
// };
// type NavigationProp = StackNavigationProp<RootStackParamList>;

// const BookVisitScreen: React.FC = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const [selectedCareRecipient, setSelectedCareRecipient] = useState<
//     Profile | undefined
//   >(undefined);
//   const [totalPrice, setTotalPrice] = useState<number>(0);
//   const [isSingleDate, setIsSingleDate] = useState<boolean>(true);
//   const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
//   const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [isSelectingStartDate, setIsSelectingStartDate] = useState(true);

//   const [startTime, setStartTime] = useState<Date | null>(null);
//   const [endTime, setEndTime] = useState<Date | null>(null);
//   const [showTimePicker, setShowTimePicker] = useState(false);
//   const [isSelectingStartTime, setIsSelectingStartTime] = useState(true);

//   const handleDateChange = (event: any, selectedDate?: Date) => {
//     setShowDatePicker(false);
//     if (!selectedDate) return;

//     if (isSingleDate) {
//       setSelectedStartDate(selectedDate);
//       setSelectedEndDate(null);
//     } else {
//       if (isSelectingStartDate) {
//         setSelectedStartDate(selectedDate);
//         if (selectedEndDate && selectedDate > selectedEndDate) {
//           setSelectedEndDate(null);
//         }
//       } else {
//         if (selectedStartDate && selectedDate < selectedStartDate) {
//           setSelectedEndDate(null);
//           return;
//         }
//         setSelectedEndDate(selectedDate);
//       }
//       setIsSelectingStartDate(!isSelectingStartDate);
//     }
//   };

//   const handleTimeChange = (event: any, selectedTime?: Date) => {
//     setShowTimePicker(false);
//     if (!selectedTime) return;

//     if (isSelectingStartTime) {
//       setStartTime(selectedTime);
//     } else {
//       setEndTime(selectedTime);
//     }
//   };

//   const renderDateSelection = () => {
//     if (isSingleDate) {
//       return selectedStartDate
//         ? selectedStartDate.toLocaleDateString("vi-VN")
//         : "Chọn ngày";
//     } else {
//       const startText = selectedStartDate
//         ? selectedStartDate.toLocaleDateString("vi-VN")
//         : "Ngày bắt đầu";
//       const endText = selectedEndDate
//         ? selectedEndDate.toLocaleDateString("vi-VN")
//         : "Ngày kết thúc";
//       return `${startText} - ${endText}`;
//     }
//   };

//   const renderTime = (time: Date | null) => {
//     return time
//       ? time.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
//       : "--:--";
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView style={styles.content}>
//         <View style={styles.header}>
//           <TouchableOpacity onPress={() => navigation.goBack()}>
//             <Ionicons name="chevron-back-outline" size={24} color="#2E3A59" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>Đặt lịch hẹn</Text>
//           <TouchableOpacity>
//             <Text style={styles.resetText}>Thiết lập lại</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Người nhận chăm sóc</Text>
//           <TouchableOpacity
//             style={styles.careRecipientButton}
//             onPress={() => navigation.navigate("AddCareRecipient")}
//           >
//             <View style={styles.avatarContainer}>
//               {selectedCareRecipient ? (
//                 <Text style={styles.avatarLetter}>
//                   {selectedCareRecipient.firstName.charAt(0).toUpperCase()}
//                 </Text>
//               ) : (
//                 <Ionicons name="person-outline" size={20} color="#666" />
//               )}
//             </View>
//             <Text style={styles.careRecipientName}>
//               {selectedCareRecipient
//                 ? `${selectedCareRecipient.firstName} ${
//                     selectedCareRecipient.lastName || ""
//                   }`
//                 : "Ông Nguyễn Văn A"}
//             </Text>
//             <Ionicons name="pencil-outline" size={20} color="#666" />
//           </TouchableOpacity>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>
//             Bạn cần dịch vụ hoặc thủ thuật y tế nào?
//           </Text>
//           <TouchableOpacity style={styles.actionButton}>
//             <Text style={styles.actionText}>
//               Chọn dịch vụ hoặc thủ thuật y tế
//             </Text>
//             <Ionicons name="chevron-forward-outline" size={20} color="#666" />
//           </TouchableOpacity>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Ngày đặt lịch?</Text>
//           <View style={styles.dateTypeButtons}>
//             <TouchableOpacity
//               style={[
//                 styles.dateTypeButton,
//                 isSingleDate && styles.activeDateTypeButton,
//               ]}
//               onPress={() => {
//                 setIsSingleDate(true);
//                 setSelectedEndDate(null);
//                 setIsSelectingStartDate(true);
//               }}
//             >
//               <Text
//                 style={[
//                   styles.dateTypeButtonText,
//                   isSingleDate && styles.activeDateTypeButtonText,
//                 ]}
//               >
//                 Thuê ngày
//               </Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[
//                 styles.dateTypeButton,
//                 !isSingleDate && styles.activeDateTypeButton,
//               ]}
//               onPress={() => {
//                 setIsSingleDate(false);
//                 setSelectedStartDate(null);
//                 setSelectedEndDate(null);
//                 setIsSelectingStartDate(true);
//               }}
//             >
//               <Text
//                 style={[
//                   styles.dateTypeButtonText,
//                   !isSingleDate && styles.activeDateTypeButtonText,
//                 ]}
//               >
//                 Chuỗi ngày
//               </Text>
//             </TouchableOpacity>
//           </View>

//           <TouchableOpacity
//             style={styles.actionButton}
//             onPress={() => setShowDatePicker(true)}
//           >
//             <Text style={styles.actionText}>{renderDateSelection()}</Text>
//             <Ionicons name="calendar-outline" size={20} color="#666" />
//           </TouchableOpacity>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Thời gian thăm khám?</Text>
//           <TouchableOpacity
//             style={styles.actionButton}
//             onPress={() => {
//               setIsSelectingStartTime(true);
//               setShowTimePicker(true);
//             }}
//           >
//             <Text style={styles.actionText}>
//               Bắt đầu: {renderTime(startTime)}
//             </Text>
//             <Ionicons name="time-outline" size={20} color="#666" />
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.actionButton, { marginTop: 10 }]}
//             onPress={() => {
//               setIsSelectingStartTime(false);
//               setShowTimePicker(true);
//             }}
//           >
//             <Text style={styles.actionText}>
//               Kết thúc: {renderTime(endTime)}
//             </Text>
//             <Ionicons name="time-outline" size={20} color="#666" />
//           </TouchableOpacity>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>
//             Bạn có yêu cầu nào cho người chăm sóc không?
//           </Text>
//           <TouchableOpacity style={styles.actionButton}>
//             <Text style={styles.actionText}>Chọn yêu cầu</Text>
//             <Ionicons name="chevron-forward-outline" size={20} color="#666" />
//           </TouchableOpacity>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Hướng dẫn đặc biệt?</Text>
//           <TouchableOpacity style={styles.actionButton}>
//             <Text style={styles.actionText}>Thêm hướng dẫn (tùy chọn)</Text>
//             <Ionicons name="chevron-forward-outline" size={20} color="#666" />
//           </TouchableOpacity>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Chọn phương thức thanh toán</Text>
//           <TouchableOpacity style={styles.actionButton}>
//             <Text style={styles.actionText}>
//               Thiết lập phương thức thanh toán
//             </Text>
//             <Ionicons name="chevron-forward-outline" size={20} color="#666" />
//           </TouchableOpacity>
//         </View>
//       </ScrollView>

//       <View style={styles.bottomBar}>
//         <Text style={styles.totalPrice}>SGD {totalPrice.toFixed(2)}</Text>
//         <TouchableOpacity style={styles.bookVisitButton} onPress={() => {}}>
//           <Text style={styles.bookVisitText}>Đặt lịch hẹn</Text>
//         </TouchableOpacity>
//       </View>

//       {showDatePicker && (
//         <DateTimePicker
//           value={new Date()}
//           mode="date"
//           display={Platform.OS === "ios" ? "spinner" : "default"}
//           onChange={handleDateChange}
//         />
//       )}

//       {showTimePicker && (
//         <DateTimePicker
//           value={new Date()}
//           mode="time"
//           is24Hour={true}
//           display={Platform.OS === "ios" ? "spinner" : "default"}
//           onChange={handleTimeChange}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff" },
//   content: { flex: 1, padding: 16 },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 20,
//   },
//   headerTitle: { fontSize: 20, fontWeight: "bold", color: "#2E3A59" },
//   resetText: { color: "#00A8E8", fontSize: 16 },
//   section: { marginBottom: 20 },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#2E3A59",
//     marginBottom: 12,
//   },
//   careRecipientButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#F8F8F8",
//     padding: 12,
//     borderRadius: 10,
//     borderColor: "#E0E0E0",
//     borderWidth: 1,
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   careRecipientName: { flex: 1, marginLeft: 10, fontSize: 14, color: "#666" },
//   actionButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: 12,
//     borderRadius: 10,
//     backgroundColor: "#F8F8F8",
//     borderColor: "#E0E0E0",
//     borderWidth: 1,
//   },
//   actionText: { fontSize: 16, color: "#666" },
//   bottomBar: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: 16,
//     backgroundColor: "#fff",
//     borderTopWidth: 1,
//     borderTopColor: "#E0E0E0",
//   },
//   totalPrice: { fontSize: 18, fontWeight: "bold", color: "#2E3A59" },
//   bookVisitButton: {
//     backgroundColor: "#FFC107",
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 10,
//     alignItems: "center",
//   },
//   bookVisitText: { fontSize: 18, fontWeight: "bold", color: "#000" },
//   avatarContainer: {
//     backgroundColor: "#c4a484",
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 10,
//   },
//   avatarLetter: { fontSize: 18, color: "white" },
//   dateTypeButtons: { flexDirection: "row", marginBottom: 10 },
//   dateTypeButton: {
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 20,
//     marginRight: 8,
//     backgroundColor: "#F8F8F8",
//     borderColor: "#E0E0E0",
//     borderWidth: 1,
//   },
//   activeDateTypeButton: { backgroundColor: "#FFC107", borderColor: "#FFC107" },
//   dateTypeButtonText: { fontSize: 14, color: "#666" },
//   activeDateTypeButtonText: { color: "#000", fontWeight: "bold" },
// });

// export default BookVisitScreen;
