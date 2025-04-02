import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/StackNavigator';
import { useBookings } from '../context/BookingsContext';
import { Picker } from '@react-native-picker/picker';

type BookAppointmentProps = {
  route: RouteProp<RootStackParamList, 'BookAppointment'>;
  navigation: StackNavigationProp<RootStackParamList>;
};

type SuccessModalProps = {
  visible: boolean;
  onDone: () => void;
  appointment: {
    doctorName: string;
    date: string;
    time: string;
    isSeriesBooking?: boolean;
    endDate?: string;
  };
};

type BookingMode = 'single' | 'series';

const timeOptions = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
  '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM'
];

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

const SuccessModal: React.FC<SuccessModalProps> = ({ visible, onDone, appointment }) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark" size={32} color="#fff" />
        </View>
        <Text style={styles.congratsText}>Congratulations!</Text>
        <Text style={styles.appointmentText}>
          Your {appointment.isSeriesBooking ? 'series of appointments' : 'appointment'} with {appointment.doctorName.replace(/^Dr\.\s+/, '')} {
            appointment.isSeriesBooking 
              ? `are confirmed from ${appointment.date} to ${appointment.endDate}`
              : `is confirmed for ${appointment.date}`
          }, at {appointment.time}.
        </Text>
        <TouchableOpacity style={styles.doneButton} onPress={onDone}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const BookAppointment: React.FC<BookAppointmentProps> = ({ route, navigation }) => {
  const { doctor } = route.params;
  const { addBooking } = useBookings();

  const [bookingMode, setBookingMode] = useState<BookingMode>('single');
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<number | null>(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
  const monthName = new Date(currentYear, currentMonth).toLocaleString('en-US', { month: 'long' });

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'next') {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    } else {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    }
    setSelectedDate(null);
    setSelectedEndDate(null);
  };

  const formatAppointmentDate = (year: number, month: number, day: number): string => {
    const date = new Date(year, month, day);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleConfirm = () => {
    if (!selectedDate || !startTime || !endTime || (bookingMode === 'series' && !selectedEndDate)) {
      return;
    }

    const formattedStartDate = formatAppointmentDate(currentYear, currentMonth, selectedDate);
    const formattedEndDate = bookingMode === 'series' 
      ? formatAppointmentDate(currentYear, currentMonth, selectedEndDate!)
      : undefined;

    // For series booking, create multiple bookings
    if (bookingMode === 'series' && selectedEndDate) {
      for (let day = selectedDate; day <= selectedEndDate; day++) {
        addBooking({
          doctorId: doctor.id,
          doctorName: doctor.name,
          doctorSpecialty: doctor.specialty,
          doctorImage: doctor.image,
          clinic: doctor.clinic || "Women's Health Clinic",
          date: formatAppointmentDate(currentYear, currentMonth, day),
          time: `${startTime} - ${endTime}`,
        });
      }
    } else {
      // Single booking
      addBooking({
        doctorId: doctor.id,
        doctorName: doctor.name,
        doctorSpecialty: doctor.specialty,
        doctorImage: doctor.image,
        clinic: doctor.clinic || "Women's Health Clinic",
        date: formattedStartDate,
        time: `${startTime} - ${endTime}`,
      });
    }

    setShowSuccess(true);
  };

  const handleDone = () => {
    setShowSuccess(false);
    navigation.navigate('MyBookings');
  };

  const handleDayPress = (day: number) => {
    if (bookingMode === 'single') {
      setSelectedDate(day);
      setSelectedEndDate(null);
    } else {
      if (!selectedDate || (selectedDate && selectedEndDate)) {
        // Start new selection
        setSelectedDate(day);
        setSelectedEndDate(null);
      } else {
        // Complete the selection
        if (day >= selectedDate) {
          setSelectedEndDate(day);
        } else {
          setSelectedEndDate(selectedDate);
          setSelectedDate(day);
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#2E3A59" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Appointment</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.bookingModeContainer}>
        <TouchableOpacity 
          style={[styles.modeTab, bookingMode === 'single' && styles.activeTab]}
          onPress={() => setBookingMode('single')}
        >
          <Text style={[styles.modeText, bookingMode === 'single' && styles.activeText]}>
            Book by Day
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.modeTab, bookingMode === 'series' && styles.activeTab]}
          onPress={() => setBookingMode('series')}
        >
          <Text style={[styles.modeText, bookingMode === 'series' && styles.activeText]}>
            Book Series of Days
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={() => navigateMonth('prev')}>
            <Ionicons name="chevron-back" size={24} color="#2E3A59" />
          </TouchableOpacity>
          <Text style={styles.monthYear}>{monthName} {currentYear}</Text>
          <TouchableOpacity onPress={() => navigateMonth('next')}>
            <Ionicons name="chevron-forward" size={24} color="#2E3A59" />
          </TouchableOpacity>
        </View>

        <View style={styles.calendar}>
          <View style={styles.weekDaysContainer}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <Text key={day} style={styles.weekDay}>{day}</Text>
            ))}
          </View>

          <View style={styles.daysContainer}>
            {Array(firstDayOfMonth).fill(null).map((_, index) => (
              <View key={`empty-${index}`} style={styles.dayCell} />
            ))}
            {Array(daysInMonth).fill(null).map((_, index) => {
              const day = index + 1;
              const isSelected = bookingMode === 'single' 
                ? day === selectedDate
                : selectedDate && selectedEndDate 
                  ? day >= selectedDate && day <= selectedEndDate
                  : day === selectedDate;
              const isToday = day === today.getDate() && 
                            currentMonth === today.getMonth() && 
                            currentYear === today.getFullYear();

              return (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayCell,
                    isSelected && styles.selectedDay,
                    isToday && styles.today,
                  ]}
                  onPress={() => handleDayPress(day)}
                >
                  <Text style={[
                    styles.dayText,
                    isSelected && styles.selectedDayText,
                    isToday && styles.todayText,
                  ]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.timeSection}>
          <Text style={styles.sectionTitle}>Select Time</Text>
          <View style={styles.timePickerContainer}>
            <View style={styles.pickerWrapper}>
              <Text style={styles.pickerLabel}>Start Time</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={startTime}
                  onValueChange={(itemValue) => setStartTime(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select start time" value="" />
                  {timeOptions.map((time) => (
                    <Picker.Item key={time} label={time} value={time} />
                  ))}
                </Picker>
              </View>
            </View>
            <View style={styles.pickerWrapper}>
              <Text style={styles.pickerLabel}>End Time</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={endTime}
                  onValueChange={(itemValue) => setEndTime(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Select end time" value="" />
                  {timeOptions.map((time) => (
                    <Picker.Item key={time} label={time} value={time} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.confirmButton,
            (!selectedDate || !startTime || !endTime || (bookingMode === 'series' && !selectedEndDate)) && styles.disabledButton
          ]}
          onPress={handleConfirm}
          disabled={!selectedDate || !startTime || !endTime || (bookingMode === 'series' && !selectedEndDate)}
        >
          <Text style={styles.confirmButtonText}>Confirm Booking</Text>
        </TouchableOpacity>
      </ScrollView>

      <SuccessModal
        visible={showSuccess}
        onDone={handleDone}
        appointment={{
          doctorName: doctor.name,
          date: selectedDate ? formatAppointmentDate(currentYear, currentMonth, selectedDate) : '',
          time: `${startTime} - ${endTime}`,
          isSeriesBooking: bookingMode === 'series',
          endDate: selectedEndDate ? formatAppointmentDate(currentYear, currentMonth, selectedEndDate) : undefined,
        }}
      />
    </View>
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
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2E3A59',
  },
  placeholder: {
    width: 24,
  },
  bookingModeContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  modeTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#F5F6FA',
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  modeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2E3A59',
  },
  activeText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  monthYear: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E3A59',
  },
  calendar: {
    padding: 16,
  },
  weekDaysContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    color: '#2E3A59',
    fontWeight: '500',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  dayText: {
    fontSize: 16,
    color: '#2E3A59',
  },
  selectedDay: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  selectedDayText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  today: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
  },
  todayText: {
    fontWeight: '600',
  },
  timeSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E3A59',
    marginBottom: 16,
  },
  timePickerContainer: {
    gap: 16,
  },
  pickerWrapper: {
    gap: 8,
  },
  pickerLabel: {
    fontSize: 16,
    color: '#2E3A59',
    fontWeight: '500',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#E1E1E1',
    borderRadius: 8,
    backgroundColor: '#F5F6FA',
  },
  picker: {
    height: 50,
  },
  confirmButton: {
    margin: 16,
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#B4B4B4',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#34C759',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  congratsText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2E3A59',
    marginBottom: 8,
  },
  appointmentText: {
    fontSize: 16,
    color: '#2E3A59',
    textAlign: 'center',
    marginBottom: 24,
  },
  doneButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BookAppointment;