import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Footer from '../components/Footer';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import useAuthStore from '../stores/authStore';
import type User from '../types/auth';
import * as ImagePicker from 'expo-image-picker';
import { uploadAvatar } from '../api/uploadService';

type RootStackParamList = {
  Login: undefined;
  ServiceScreenTest: undefined;
  Notifications: undefined;
  ProfileList: undefined;
  BookAService: undefined;
  PaymentInfoScreen: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface MenuItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const menuItems: MenuItem[] = [
  {
    id: 'payment',
    title: 'Ví điện tử',
    icon: 'chevron-forward',
  },
  {
    id: 'notifications',
    title: 'Thông báo',
    icon: 'chevron-forward',
  },
  {
    id: 'profile',
    title: 'Danh sách Hồ sơ',
    icon: 'chevron-forward',
  },
  {
    id: 'help',
    title: 'Trợ giúp và Hỗ trợ',
    icon: 'chevron-forward',
  },
  {
    id: 'terms',
    title: 'Điều khoản và Điều kiện',
    icon: 'chevron-forward',
  },
  {
    id: 'logout',
    title: 'Đăng xuất',
    icon: 'chevron-forward',
  },
];

const Profile: React.FC = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigation = useNavigation<NavigationProp>();
  const { logout, user, updateUser } = useAuthStore();
  const [avatarSource, setAvatarSource] = useState<string | ReturnType<typeof require> | null>(
    user?.avatarUrl || require('../asset/img/hinh1.png')
  );

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Bạn cần cấp quyền truy cập vào thư viện ảnh!');
      }
      if (user?.avatarUrl) {
        setAvatarSource(user.avatarUrl);
      }
    })();
  }, [user?.avatarUrl]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri;
      setAvatarSource(selectedImageUri);
      try {
        const uploadedAvatarUrl = await uploadAvatar(selectedImageUri);
        if (uploadedAvatarUrl) {
          updateUser({ ...user, avatarUrl: uploadedAvatarUrl });
        } else {
          alert('Có lỗi khi tải lên ảnh đại diện.');
        }
      } catch (error: any) {
        console.error('Lỗi tải lên avatar:', error);
        alert('Có lỗi khi tải lên ảnh đại diện.');
      }
    }
  };

  // Sửa lại hàm đăng xuất: xóa token, user khỏi store và chuyển về Login
  const handleLogout = async () => {
    setShowLogoutModal(false);
    await logout();
    navigation.replace('Login');
  };

  const handleMenuPress = (id: string) => {
    if (id === 'logout') {
      setShowLogoutModal(true);
    } else if (id === 'favorite') {
      navigation.navigate('ServiceScreenTest');
    } else if (id === 'notifications') {
      navigation.navigate('Notifications');
    } else if (id === 'profile') {
      navigation.navigate('ProfileList');
    } else if (id === 'help') {
      navigation.navigate('BookAService');
    } else if (id === 'payment') {
      navigation.navigate('PaymentInfoScreen');
    } else if (id === 'terms') {
      navigation.navigate('ServiceScreenTest');
    }
  };

  const renderIcon = (id: string) => {
    switch (id) {
      case 'notifications':
        return <Ionicons name="notifications-outline" size={20} color="#000" />;
      case 'profile':
        return <Ionicons name="person-circle-outline" size={20} color="#000" />;
      case 'help':
        return <Ionicons name="help-circle-outline" size={20} color="#000" />;
      case 'terms':
        return <Ionicons name="shield-outline" size={20} color="#000" />;
      case 'payment':
        return <Ionicons name="home-outline" size={20} color="#000" />;
      case 'logout':
        return <Ionicons name="log-out-outline" size={20} color="#000" />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.headerTitle}>Trang cá nhân</Text>

        <View style={styles.profileSection}>
          <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
            <Image
              source={typeof avatarSource === 'string' ? { uri: avatarSource } : avatarSource}
              style={styles.avatar}
            />
            <View style={styles.editIconContainer}>
              <Ionicons name="create" size={14} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.name}>{user?.phone || '+84'}</Text>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                index !== menuItems.length - 1 && styles.menuItemBorder,
              ]}
              onPress={() => handleMenuPress(item.id)}
            >
              <View style={styles.menuItemLeft}>
                {renderIcon(item.id)}
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <Ionicons name={item.icon} size={20} color="#000" />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Footer />

      <Modal
        animationType="fade"
        transparent={true}
        visible={showLogoutModal}
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Đăng xuất</Text>
            <Text style={styles.modalText}>Bạn có chắc chắn muốn đăng xuất?</Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.button, styles.buttonCancel]}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.buttonText}>Hủy</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonLogout]}
                onPress={handleLogout}
              >
                <Text style={[styles.buttonText, styles.buttonLogoutText]}>Đồng ý</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#000',
    marginTop: 40,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#000',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '000',
    marginBottom: 8,
  },
  phone: {
    fontSize: 14,
    color: '#000',
  },
  menuContainer: {
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F7F9FC',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#2E3A59',
    marginLeft: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2E3A59',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  buttonCancel: {
    backgroundColor: '#F7F9FC',
  },
  buttonLogout: {
    backgroundColor: '#FF4B4B',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E3A59',
  },
  buttonLogoutText: {
    color: 'white',
  },
});

export default Profile;