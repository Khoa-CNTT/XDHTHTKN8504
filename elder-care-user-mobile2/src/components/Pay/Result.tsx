// components/Result.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

interface ResultProps {
    success: boolean;
}

const Result: React.FC<ResultProps> = ({ success }) => {
    return (
        <View style={styles.container}>
            <FontAwesome5
                name={success ? 'check-circle' : 'times-circle'}
                size={60}
                color={success ? 'green' : 'red'}
                style={styles.icon}
            />
            <Text style={styles.title}>{success ? 'Nạp tiền thành công!' : 'Nạp tiền thất bại!'}</Text>
            {success ? (
                <Text style={styles.message}>Giao dịch của bạn đã được xử lý thành công.</Text>
            ) : (
                <Text style={styles.message}>Đã có lỗi xảy ra trong quá trình nạp tiền. Vui lòng thử lại sau.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 20,
    },
    icon: {
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
    },
});

export default Result;