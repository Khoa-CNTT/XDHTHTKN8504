import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useBookingStore } from '../stores/BookingStore';
import { BookingStatus } from '../types/BookingStatus';
import { User, CalendarDays, Clock, Stethoscope, DollarSign } from 'lucide-react-native';
import Footer from "../components/Footer";
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

type TabType = 'Upcoming' | 'Completed' | 'Canceled';

const TABS: TabType[] = ['Upcoming', 'Completed', 'Canceled'];

interface DetailRowProps {
  label: string;
  value: string;
  icon: React.ReactElement;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value, icon }) => (
  <View style={styles.detailRow}>
    {icon}
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const MyBookings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('Upcoming');
  const { fetchBookings, filteredBookings, filterByStatus } = useBookingStore();

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterByStatus(activeTab as BookingStatus);
  }, [activeTab]);

  const formatTime = (isoDate: string | null | undefined, type: 'date' | 'time' | 'dateTime') => {
    if (!isoDate) {
      console.warn("Giá trị thời gian không hợp lệ (null hoặc undefined), trả về 'N/A'");
      return 'N/A';
    }
    try {
      let date;
      // Kiểm tra xem chuỗi có vẻ chỉ là thời gian (ví dụ: HH:mm)
      if (/^\d{2}:\d{2}$/.test(isoDate)) {
        // Nếu chỉ là thời gian, tạo một đối tượng Date giả với ngày hiện tại
        // để có thể sử dụng format của date-fns
        const [hours, minutes] = isoDate.split(':');
        const now = new Date();
        date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(hours, 10), parseInt(minutes, 10), 0);
        if (isNaN(date.getTime())) {
          console.warn(`Giá trị thời gian không hợp lệ: ${isoDate}, trả về 'N/A'`);
          return 'N/A';
        }
        return format(date, 'HH:mm', { locale: vi });
      } else {
        // Nếu là định dạng ngày giờ đầy đủ
        date = new Date(isoDate);
        if (isNaN(date.getTime())) {
          console.warn(`Giá trị ngày giờ không hợp lệ: ${isoDate}, trả về 'N/A'`);
          return 'N/A';
        }
        if (type === 'date') {
          return format(date, 'dd/MM/yyyy', { locale: vi });
        } else if (type === 'time') {
          return format(date, 'HH:mm', { locale: vi });
        } else {
          return format(date, 'HH:mm, dd/MM/yyyy', { locale: vi });
        }
      }
    } catch (error) {
      console.error("Lỗi định dạng thời gian:", error);
      return 'N/A';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lịch hẹn của tôi</Text>

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.activeTab]}>
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab === 'Upcoming' ? 'Sắp tới' : tab === 'Completed' ? 'Đã hoàn thành' : 'Đã hủy'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Booking list */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {filteredBookings.map((booking) => (
          <View key={booking._id} style={styles.card}>
            <View style={styles.cardContent}>
              <Image
                source={require('../asset/img/hinh1.png')}
                style={styles.image}
              />
              <View style={styles.info}>
                <DetailRow
                  label="Khách hàng"
                  value={`${booking.profileId?.firstName || 'N/A'} ${booking.profileId?.lastName || 'N/A'}`}
                  icon={<User size={22} color="#4f46e5" />}
                />
                <DetailRow
                  label="Dịch vụ"
                  value={booking.serviceId?.name || 'N/A'}
                  icon={<Stethoscope size={22} color="#4f46e5" />}
                />
                {booking.repeatFrom && booking.repeatTo && (
                  <DetailRow
                    label="Ngày thực hiện"
                    value={`${formatTime(booking.repeatFrom, "date")} - ${formatTime(booking.repeatTo, "date")}`}
                    icon={<CalendarDays size={22} color="#4f46e5" />}
                  />
                )}
                {booking.timeSlot && booking.timeSlot.start && booking.timeSlot.end && (
                  <DetailRow
                    label="Thời Gian"
                    value={`${formatTime(booking.timeSlot.start, "time")} - ${formatTime(booking.timeSlot.end, "time")}`}
                    icon={<Clock size={22} color="#4f46e5" />}
                  />
                )}
                {booking.totalDiscount !== undefined && (
                  <DetailRow
                    label="Tiền nhận được"
                    value={`${(booking.totalDiscount || 0).toLocaleString()}đ`}
                    icon={<DollarSign size={22} color="#4f46e5" />}
                  />
                )}
                {booking.notes ? <Text style={styles.notesText}>Ghi chú: {booking.notes}</Text> : null}
                <Text style={{ marginTop: 8 }}>Trạng thái: <Text style={{ fontWeight: 'bold' }}>{
                  booking.status === 'pending' ? 'Đang chờ' :
                  booking.status === 'accepted' ? 'Đã xác nhận' :
                  booking.status === 'completed' ? 'Đã hoàn thành' :
                  booking.status === 'cancelled' ? 'Đã hủy' : booking.status
                }</Text></Text>
              </View>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelButton}>
                <Text style={styles.buttonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rescheduleButton}>
                <Text style={styles.buttonText}>Đổi lịch</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  tabText: {
    color: '#aaa',
    fontWeight: '600',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  activeTabText: {
    color: '#000',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
  },
  info: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    marginLeft: 8,
    fontWeight: 'bold',
    flex: 0.4,
  },
  detailValue: {
    flex: 0.6,
  },
  notesText: {
    fontStyle: 'italic',
    color: '#555',
    marginTop: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: '#E5E7EB',
    padding: 10,
    borderRadius: 10,
    flex: 0.48,
  },
  rescheduleButton: {
    backgroundColor: '#111827',
    padding: 10,
    borderRadius: 10,
    flex: 0.48,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default MyBookings;