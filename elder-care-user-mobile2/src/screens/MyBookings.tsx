import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useBookingStore } from '../stores/BookingStore';
import { BookingStatus } from '../types/BookingStatus';
import { User, CalendarDays, Clock, Stethoscope, DollarSign } from 'lucide-react-native';
import Footer from "../components/Footer";
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

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

const AppointmentTabs = ({ onTabChange }: { onTabChange: (status: BookingStatus) => void }) => {
    const [selectedTab, setSelectedTab] = useState<BookingStatus>('accepted'); // Khởi tạo là 'accepted'

    const handleTabPress = (tab: BookingStatus) => {
        setSelectedTab(tab);
        onTabChange(tab);
    };

    return (
        <View style={styles.tabsContainer}>
            <Text style={styles.tabsTitle}>Lịch hẹn của tôi</Text>
            <View style={styles.tabs}>
                <TouchableOpacity
                    key="accepted"
                    onPress={() => handleTabPress('accepted')}
                    style={[styles.tab, selectedTab === 'accepted' && styles.activeTab]}
                >
                    <Text style={[styles.tabText, selectedTab === 'accepted' && styles.activeTabText]}>
                        Sắp tới
                    </Text>
                    {selectedTab === 'accepted' && <View style={styles.underline} />}
                </TouchableOpacity>
                <TouchableOpacity
                    key="completed"
                    onPress={() => handleTabPress('completed')}
                    style={[styles.tab, selectedTab === 'completed' && styles.activeTab]}
                >
                    <Text style={[styles.tabText, selectedTab === 'completed' && styles.activeTabText]}>
                        Đã hoàn thành
                    </Text>
                    {selectedTab === 'completed' && <View style={styles.underline} />}
                </TouchableOpacity>
                <TouchableOpacity
                    key="cancelled"
                    onPress={() => handleTabPress('cancelled')}
                    style={[styles.tab, selectedTab === 'cancelled' && styles.activeTab]}
                >
                    <Text style={[styles.tabText, selectedTab === 'cancelled' && styles.activeTabText]}>
                        Đã hủy
                    </Text>
                    {selectedTab === 'cancelled' && <View style={styles.underline} />}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const MyBookings: React.FC = () => {
    const { fetchBookings, filteredBookings, filterByStatus } = useBookingStore();
    const [selectedStatus, setSelectedStatus] = useState<BookingStatus>('accepted'); // Khởi tạo là 'accepted'

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    useEffect(() => {
        filterByStatus(selectedStatus);
    }, [selectedStatus, filterByStatus]);

    const handleTabChange = (status: BookingStatus) => {
        setSelectedStatus(status);
    };

    const formatTime = (isoDate: string | null | undefined, type: 'date' | 'time' | 'dateTime') => {
        if (!isoDate) {
            console.warn("Giá trị thời gian không hợp lệ (null hoặc undefined), trả về 'N/A'");
            return 'N/A';
        }
        try {
            let date;
            if (/^\d{2}:\d{2}$/.test(isoDate)) {
                const [hours, minutes] = isoDate.split(':');
                const now = new Date();
                date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(hours, 10), parseInt(minutes, 10), 0);
                if (isNaN(date.getTime())) {
                    console.warn(`Giá trị thời gian không hợp lệ: ${isoDate}, trả về 'N/A'`);
                    return 'N/A';
                }
                return format(date, 'HH:mm', { locale: vi });
            } else {
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
            <AppointmentTabs onTabChange={handleTabChange} />

            {/* Booking list */}
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {filteredBookings.map((booking) => (
                    <View key={booking._id} style={styles.card}>
                        <View style={styles.cardContent}>
                            <Image
                                source={require('../asset/img/use.jpg')}
                                style={styles.image}
                            />
                            <View style={styles.info}>
                                <DetailRow
                                    label="Khách hàng"
                                    value={`${booking.profileId?.firstName || 'N/A'} ${booking.profileId?.lastName || 'N/A'}`}
                                    icon={<User size={22} color="#37B44E" />}
                                />
                                <DetailRow
                                    label="Dịch vụ"
                                    value={booking.serviceId?.name || 'N/A'}
                                    icon={<Stethoscope size={22} color="#37B44E" />}
                                />
                                {booking.repeatFrom && booking.repeatTo && (
                                    <DetailRow
                                        label="Ngày thực hiện"
                                        value={`${formatTime(booking.repeatFrom, "date")} - ${formatTime(booking.repeatTo, "date")}`}
                                        icon={<CalendarDays size={22} color="#37B44E" />}
                                    />
                                )}
                                {booking.timeSlot && booking.timeSlot.start && booking.timeSlot.end && (
                                    <DetailRow
                                        label="Thời Gian"
                                        value={`${formatTime(booking.timeSlot.start, "time")} - ${formatTime(booking.timeSlot.end, "time")}`}
                                        icon={<Clock size={22} color="#37B44E" />}
                                    />
                                )}
                                {booking.totalPrice !== undefined && (
                                    <DetailRow
                                        label="Tiền nhận được"
                                        value={`${(booking.totalPrice || 0).toLocaleString()}đ`}
                                        icon={<DollarSign size={22} color="#37B44E" />}
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
    tabsContainer: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    tabsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#black',
    },
    tabs: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    tabText: {
        color: '#9E9E9E',
        fontWeight: '500',
        fontSize: 16,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#0F172A',
        backgroundColor: '#fff', // ĐÃ SỬA: Thêm màu nền khác biệt khi active
    },
    activeTabText: {
        color: '#0F172A', // ĐÃ SỬA: Trở lại màu tối
        fontWeight: '700',
        fontSize: 16,
    },
    underline: {
        marginTop: 4,
        height: 3,
        width: 24,
        // backgroundColor: '#0F172A',
        borderRadius: 1.5,
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
        backgroundColor: '#37B44E',
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