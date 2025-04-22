import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  TextInput,
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialIcons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

interface CareRecipient {
  id: number;
  name: string;
}

interface Service {
  id: number;
  name: string;
}

const BookVisitScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [recipientModalVisible, setRecipientModalVisible] = useState(false);
  const [serviceModalVisible, setServiceModalVisible] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<CareRecipient | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [timeModalVisible, setTimeModalVisible] = useState(false);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [notesModalVisible, setNotesModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');

  const paymentMethods = ['Tiền mặt', 'Chuyển khoản', 'Momo', 'ZaloPay'];

  const serviceOptions: Service[] = [
    { id: 1, name: 'Home Personal Care & Nursing' },
    { id: 2, name: 'Home Therapy' },
    { id: 3, name: 'Medical Escort' },
    { id: 4, name: 'Home Blood Test' },
    { id: 5, name: 'Health Screening at Home' },
  ];

  const careRecipients: CareRecipient[] = [
    { id: 1, name: 'Nguyễn Văn A' },
    { id: 2, name: 'Trần Thị B' },
  ];

  const handleReset = () => {
    setSelectedRecipient(null);
    setSelectedService(null);
    setTime('');
    setLocation('');
    setNotes('');
    setPaymentMethod('');
  };

  const handleBookVisit = () => {
    if (!selectedRecipient || !selectedService || !time || !location || !paymentMethod) {
      alert('Vui lòng điền đầy đủ thông tin trước khi đặt lịch!');
      return;
    }

    console.log('Người nhận:', selectedRecipient.name);
    console.log('Dịch vụ:', selectedService.name);
    console.log('Địa điểm:', location);
    console.log('Thời gian:', time);
    console.log('Ghi chú:', notes || 'Không có');
    console.log('Phương thức thanh toán:', paymentMethod);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Book a Visit</Text>
          <Text style={styles.subtitle}>
            {selectedService ? selectedService.name : 'Home Personal Care & Nursing'}
          </Text>
        </View>
        <TouchableOpacity onPress={handleReset}>
          <Text style={styles.reset}>Reset</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.row} onPress={() => setRecipientModalVisible(true)}>
          <FontAwesome5 name="user" size={22} color="#bbb" style={styles.rowIcon} />
          <View style={styles.rowTextBox}>
            <Text style={styles.bold}>
              {selectedRecipient ? selectedRecipient.name : 'Chọn người nhận chăm sóc'}
            </Text>
          </View>
          <Ionicons name="create-outline" size={20} color="#bbb" />
        </TouchableOpacity>

        <Modal visible={recipientModalVisible} transparent animationType="slide">
          <View style={styles.overlay}>
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>Chọn người nhận chăm sóc</Text>
              {careRecipients.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedRecipient(item);
                    setRecipientModalVisible(false);
                  }}
                >
                  <Text style={styles.itemText}>{item.name}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={() => setRecipientModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TouchableOpacity style={styles.row} onPress={() => setServiceModalVisible(true)}>
          <MaterialIcons name="volunteer-activism" size={22} color="#666" style={styles.rowIcon} />
          <View style={styles.rowTextBox}>
            <Text style={styles.rowTitle}>Bạn cần dịch vụ nào?</Text>
            <Text style={styles.rowSubtitle}>
              {selectedService ? selectedService.name : 'Chọn dịch vụ'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#bbb" />
        </TouchableOpacity>

        <Modal visible={serviceModalVisible} transparent animationType="slide">
          <View style={styles.overlay}>
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>Chọn dịch vụ</Text>
              <FlatList
                data={serviceOptions}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.modalItem, selectedService?.id === item.id && styles.selectedItem]}
                    onPress={() => {
                      setSelectedService(item);
                      setServiceModalVisible(false);
                    }}
                  >
                    <Text style={styles.itemText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity onPress={() => setServiceModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TouchableOpacity style={styles.row} onPress={() => setLocationModalVisible(true)}>
          <Ionicons name="location-outline" size={22} color="#666" style={styles.rowIcon} />
          <View style={styles.rowTextBox}>
            <Text style={styles.rowTitle}>Địa điểm cung cấp dịch vụ</Text>
            <Text style={styles.rowSubtitle}>{location || 'Nhập địa chỉ'}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#bbb" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.row} onPress={() => setTimeModalVisible(true)}>
          <Ionicons name="calendar-outline" size={22} color="#666" style={styles.rowIcon} />
          <View style={styles.rowTextBox}>
            <Text style={styles.rowTitle}>Thời gian và ngày mong muốn</Text>
            <Text style={styles.rowSubtitle}>{time || 'Thêm ngày giờ'}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#bbb" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.row} onPress={() => setNotesModalVisible(true)}>
          <Feather name="clipboard" size={22} color="#666" style={styles.rowIcon} />
          <View style={styles.rowTextBox}>
            <Text style={styles.rowTitle}>Yêu cầu cụ thể khác</Text>
            <Text style={styles.rowSubtitle}>{notes || 'Ghi chú thêm (tuỳ chọn)'}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#bbb" />
        </TouchableOpacity>

        {[{
          visible: timeModalVisible,
          setVisible: setTimeModalVisible,
          value: time,
          setValue: setTime,
          label: 'Thời gian và ngày mong muốn',
        }, {
          visible: locationModalVisible,
          setVisible: setLocationModalVisible,
          value: location,
          setValue: setLocation,
          label: 'Địa điểm cung cấp dịch vụ',
        }, {
          visible: notesModalVisible,
          setVisible: setNotesModalVisible,
          value: notes,
          setValue: setNotes,
          label: 'Các yêu cầu cụ thể khác',
        }].map(({ visible, setVisible, value, setValue, label }, index) => (
          <Modal key={index} visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
              <View style={styles.modal}>
                <Text style={styles.modalTitle}>{label}</Text>
                <TextInput
                  style={styles.input}
                  value={value}
                  onChangeText={setValue}
                  placeholder={`Nhập ${label.toLowerCase()}`}
                  multiline
                />
                <TouchableOpacity onPress={() => setVisible(false)} style={styles.closeButton}>
                  <Text style={styles.closeText}>Xong</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        ))}

        <TouchableOpacity style={styles.row} onPress={() => setPaymentModalVisible(true)}>
          <Ionicons name="card-outline" size={22} color="#666" style={styles.rowIcon} />
          <View style={styles.rowTextBox}>
            <Text style={styles.rowTitle}>Phương thức thanh toán</Text>
            <Text style={styles.rowSubtitle}>{paymentMethod || 'Cài đặt thanh toán'}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#bbb" />
        </TouchableOpacity>

        <Modal visible={paymentModalVisible} transparent animationType="slide">
          <View style={styles.overlay}>
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>Chọn phương thức thanh toán</Text>
              {paymentMethods.map((method, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalItem}
                  onPress={() => {
                    setPaymentMethod(method);
                    setPaymentModalVisible(false);
                  }}
                >
                  <Text style={styles.itemText}>{method}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={() => setPaymentModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.price}>0.000 VND</Text>
        <TouchableOpacity style={styles.bookBtn} onPress={handleBookVisit}>
          <Text style={styles.bookBtnText}>Đặt lịch</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BookVisitScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16 },
  header: {
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 20, fontWeight: 'bold' },
  subtitle: { fontSize: 14, color: '#555' },
  reset: { color: '#00AEEF', fontWeight: '500' },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  rowIcon: {
    marginRight: 12,
    marginTop: 4,
  },
  rowTextBox: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 2,
  },
  rowSubtitle: {
    fontSize: 13,
    color: '#888',
  },
  bold: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
  },
  bookBtn: {
    backgroundColor: '#00AEEF',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  bookBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  selectedItem: {
    backgroundColor: '#e0f7fa',
  },
  itemText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    alignSelf: 'center',
  },
  closeText: {
    color: '#00AEEF',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    minHeight: 80,
    textAlignVertical: 'top',
  },
});
