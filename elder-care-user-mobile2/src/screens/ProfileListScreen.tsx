import React, { useEffect } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
    Image,
} from "react-native";
import useProfileStore from "../stores/profileStore";
import { Profile } from "../types/profile";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

type RootStackParamList = {
    ProfileDetails: { profileId: string };
    AddCareRecipient: undefined;
    EditCareRecipient: { profileId: string };
    AddProfileScreen: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const ProfileListScreen: React.FC = () => {
    const {
        profiles,
        fetchProfiles,
        isLoading,
        error,
        removeProfile,
        getProfileById,
    } = useProfileStore();
    const navigation = useNavigation<NavigationProp>();

    useEffect(() => {
        fetchProfiles();
    }, [fetchProfiles]);

    const confirmDelete = (id: string) => {
        Alert.alert(
            "Xác nhận xóa",
            "Bạn có chắc chắn muốn xóa profile này?",
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Xóa",
                    style: "destructive",
                    onPress: () => removeProfile(id),
                },
            ],
            { cancelable: true }
        );
    };

    const handleEdit = (id: string) => {
        const profileToEdit = getProfileById(id);
        if (profileToEdit) {
            navigation.navigate("EditCareRecipient", { profileId: id });
        } else {
            Alert.alert("Lỗi", "Không tìm thấy profile để chỉnh sửa.");
        }
    };

    const renderItem = ({ item }: { item: Profile }) => (
        <View style={styles.listItem}>
            <View style={styles.leftContent}>
                {item.avartar ? (
                    <Image
                        source={{ uri: item.avartar }}
                        style={styles.avatarContainer}
                        resizeMode="cover"
                    />
                ) : item.firstName ? (
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarLetter}>
                            {item.firstName.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                ) : (
                    <View style={styles.placeholderAvatar}>
                        <Feather name="user" size={24} color="#ccc" />
                    </View>
                )}
                <Text style={styles.name}>
                    {item.firstName} {item.lastName}
                </Text>
            </View>

            {/* Nút xóa */}
            <TouchableOpacity
                style={styles.editButton}
                onPress={() => confirmDelete(item._id)}
            >
                <Feather name="trash-2" size={20} color="#777" />
            </TouchableOpacity>

            {/* Nút chỉnh sửa */}
            <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEdit(item._id)}
            >
                <Feather name="edit" size={20} color="#777" />
            </TouchableOpacity>
        </View>
    );

    if (isLoading) {
        return <ActivityIndicator size="large" style={styles.centered} />;
    }

    if (error) {
        return <Text style={styles.centered}>Error: {error}</Text>;
    }

    return (
        <View style={styles.container}>
            {/* Nút quay lại */}
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>Danh sách hồ sơ</Text>
            </View>

            <FlatList
                data={profiles}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Feather name="user-x" size={48} color="#bdbdbd" style={{ marginBottom: 12 }} />
                        <Text style={styles.emptyText}>Không có hồ sơ nào.</Text>
                    </View>
                }
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.addRecipientButton}
                    onPress={() => navigation.navigate("AddProfileScreen")}
                >
                    <Text style={styles.addRecipientText}>Thêm hồ sơ mới</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 20, backgroundColor: "#fff" },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingBottom: 20,
        paddingTop: 20,
        paddingHorizontal: 10,
    },
    backButton: {
        marginRight: 10,
    },
    title: {
        flex: 1,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#000',

    },
    listItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: "#fff",
        borderRadius: 10,
        marginHorizontal: 15,
        marginVertical: 8,
    },
    leftContent: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    avatarContainer: {
        backgroundColor: "#c4a484",
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 20,
    },
    avatarLetter: { color: "white", fontSize: 20, fontWeight: "bold" },
    placeholderAvatar: {
        backgroundColor: "#e0e0e0",
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 20,
    },
    name: { fontSize: 18, fontWeight: "500" },
    centered: { flex: 1, justifyContent: "center", alignItems: "center" },
    editButton: {
        padding: 10,
    },
    separator: {
        height: 1,
        backgroundColor: "#e0e0e0",
        marginHorizontal: 15,
    },
    buttonContainer: {
        padding: 20,
    },
    addRecipientButton: {
        backgroundColor: "#47B33E",
        padding: 18,
        alignItems: "center",
        borderRadius: 10,
    },
    addRecipientText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    emptyContainer: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f6f8fa",
        borderRadius: 16,
        margin: 32,
        paddingVertical: 40,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: "#e0e0e0",
    },
    emptyText: {
        color: "#888",
        fontSize: 18,
        fontWeight: "500",
        textAlign: "center",
    },
});

export default ProfileListScreen;