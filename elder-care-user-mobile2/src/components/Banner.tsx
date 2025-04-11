import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Animated } from 'react-native';

const bannerData = [
  {
    id: '1',
    title: 'Looking for\nSpecialist Doctors?',
    subtitle: 'Schedule an appointment with\nour top doctors.',
    image: require('../asset/img/hinh1.png'),
    backgroundColor: '#4B9B9B',
  },
  {
    id: '2',
    title: 'Expert Medical\nCare For You',
    subtitle: 'Get connected with the best\nmedical specialists.',
    image: require('../asset/img/hinh1.png'),
    backgroundColor: '#5B8CD5',
  },
  {
    id: '3',
    title: 'Your Health\nOur Priority',
    subtitle: 'Quality healthcare at your\nfingertips.',
    image: require('../asset/img/hinh1.png'),
    backgroundColor: '#7C65B0',
  },
];

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width - 32; // 16px padding on each side
const AUTO_SCROLL_INTERVAL = 3000;

const Banner: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const bannerRef = useRef<any>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (activeIndex + 1) % bannerData.length;
      bannerRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setActiveIndex(nextIndex);
    }, AUTO_SCROLL_INTERVAL);

    return () => clearInterval(timer);
  }, [activeIndex]);

  const renderItem = ({ item }: { item: typeof bannerData[0] }) => (
    <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>
      <Image source={item.image} style={styles.image} resizeMode="cover" />
    </View>
  );

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={bannerRef}
        data={bannerData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(event.nativeEvent.contentOffset.x / BANNER_WIDTH);
          setActiveIndex(newIndex);
        }}
        keyExtractor={(item) => item.id}
      />
      <View style={styles.pagination}>
        {bannerData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === activeIndex && styles.dotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 16,
  },
  slide: {
    width: BANNER_WIDTH,
    height: 160,
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    lineHeight: 20,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  dotActive: {
    width: 20,
    backgroundColor: '#4B9B9B',
  },
});

export default Banner;
