import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Footer from '../components/Footer';

interface NotificationItem {
  id: string;
  type: 'success' | 'cancelled' | 'changed';
  title: string;
  message: string;
  time: string;
  date: string;
}

const notifications: NotificationItem[] = [
  {
    id: '1',
    type: 'success',
    title: 'Đặt lịch thành công',
    message: 'Bạn đã đặt lịch hẹn thành công với bác sĩ Emily Walker.',
    time: '1 giờ trước',
    date: 'HÔM NAY'
  },
  {
    id: '2',
    type: 'cancelled',
    title: 'Lịch hẹn đã hủy',
    message: 'Bạn đã hủy thành công lịch hẹn với bác sĩ David Patel.',
    time: '2 giờ trước',
    date: 'HÔM NAY'
  },
  {
    id: '3',
    type: 'changed',
    title: 'Lịch hẹn đã thay đổi',
    message: 'Bạn đã thay đổi thành công lịch hẹn với bác sĩ Jessica Turner.',
    time: '8 giờ trước',
    date: 'HÔM NAY'
  },
  {
    id: '4',
    type: 'success',
    title: 'Đặt lịch thành công',
    message: 'Bạn đã đặt lịch hẹn thành công với bác sĩ David Patel.',
    time: '1 ngày trước',
    date: 'HÔM QUA'
  }
];

const NotificationIcon: React.FC<{ type: NotificationItem['type'] }> = ({ type }) => {
  const iconProps = {
    success: { name: 'checkmark-circle', color: '#4CAF50', bgColor: '#E8F5E9' },
    cancelled: { name: 'close-circle', color: '#F44336', bgColor: '#FFEBEE' },
    changed: { name: 'time', color: '#2196F3', bgColor: '#E3F2FD' }
  }[type];

  return (
    <View style={[styles.notificationIcon, { backgroundColor: iconProps.bgColor }]}>
      <Ionicons name={iconProps.name as any} size={20} color={iconProps.color} />
    </View>
  );
};

const Notifications: React.FC = () => {
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };

  const renderNotificationGroup = (date: string, items: NotificationItem[]) => (
    <View key={date} style={styles.notificationGroup}>
      <View style={styles.dateHeader}>
        <Text style={styles.dateText}>{date}</Text>
        <TouchableOpacity>
          <Text style={styles.markAsReadText}>Đánh dấu tất cả là đã đọc</Text>
        </TouchableOpacity>
      </View>
      {items.map(notification => (
        <View key={notification.id} style={styles.notificationItem}>
          <NotificationIcon type={notification.type} />
          <View style={styles.notificationContent}>
            <View style={styles.notificationHeader}>
              <Text style={styles.notificationTitle}>{notification.title}</Text>
              <Text style={styles.notificationTime}>{notification.time}</Text>
            </View>
            <Text style={styles.notificationMessage}>{notification.message}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const groupedNotifications = notifications.reduce((groups: { [key: string]: NotificationItem[] }, notification) => {
    if (!groups[notification.date]) {
      groups[notification.date] = [];
    }
    groups[notification.date].push(notification);
    return groups;
  }, {});

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2E3A59" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông báo</Text>
        <View style={styles.newBadge}>
          <Text style={styles.newBadgeText}>1 Mới</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {Object.entries(groupedNotifications).map(([date, items]) =>
          renderNotificationGroup(date, items)
        )}
      </ScrollView>

      <Footer />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,

    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF1F7',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    color: '#2E3A59',
  },
  newBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  newBadgeText: {
    color: '#2196F3',
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  notificationGroup: {
    marginBottom: 24,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
    marginTop: 24,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8F9BB3',
  },
  markAsReadText: {
    fontSize: 12,
    color: '#2196F3',
  },
  notificationItem: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2E3A59',
  },
  notificationTime: {
    fontSize: 12,
    color: '#8F9BB3',
  },
  notificationMessage: {
    fontSize: 12,
    color: '#8F9BB3',
    lineHeight: 18,
  },
});

export default Notifications;