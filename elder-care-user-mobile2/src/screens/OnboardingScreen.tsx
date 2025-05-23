import React, { useRef, useMemo } from "react";
 import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
 } from "react-native";
 import Swiper from "react-native-swiper";
 import { useNavigation } from "@react-navigation/native";
 import { StackNavigationProp } from "@react-navigation/stack";

 const { width, height } = Dimensions.get("window");

 type OnboardingScreenNavigationProp = StackNavigationProp<
  {
   Login: undefined;
   Home: undefined;
  },

  "Login",
  "Home"
 >;

 const slides = [
  {
   id: 1,
   image: require("../asset/img/Onboarding3.png"),
   title: "Kết nối với Chuyên gia",
   description:
    "Kết nối với các Bác sĩ Chuyên khoa trực tuyến để được tư vấn y tế thuận tiện và toàn diện.",
  },
  {
   id: 2,
   image: require("../asset/img/Onboarding2.png"),
   title: "Hàng ngàn Chuyên gia Trực tuyến",
   description:
    "Khám phá vô số các Chuyên gia Y tế trực tuyến, cung cấp nhiều lĩnh vực chuyên môn đa dạng phù hợp với nhu cầu chăm sóc sức khỏe của bạn.",
  },
  {
   id: 3,
   image: require("../asset/img/Onboarding1.png"),
   title: "Bắt đầu Dễ dàng",
   description:
    "Đặt lịch tư vấn trực tuyến đầu tiên của bạn ngay hôm nay và trải nghiệm dịch vụ chăm sóc y tế hàng đầu ngay tại nhà.",
  },
 ];

 const OnboardingScreen: React.FC<{}> = () => {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();
  const swiperRef = useRef<Swiper | null>(null);

  const renderSlides = useMemo(
   () =>
    slides.map((slide, index) => (
     <View key={slide.id} style={styles.slide}>
      <Image source={slide.image} style={styles.image} />
      <View style={styles.textContainer}>
       <Text style={styles.title}>{slide.title}</Text>
       <Text style={styles.description}>{slide.description}</Text>

       <TouchableOpacity
        style={styles.button}
        onPress={() =>
         index === slides.length - 1
          ? navigation.navigate("Home")
          : swiperRef.current?.scrollBy(1)
        }
       >
        <Text style={styles.buttonText}>
         {index === slides.length - 1 ? "Bắt đầu" : "Tiếp tục"}
        </Text>
       </TouchableOpacity>

       <View style={styles.paginationDots}>
        {slides.map((_, i) => (
         <View
          key={i}
          style={[styles.dot, index === i && styles.activeDot]}
         />
        ))}
       </View>

       {/* <Text style={styles.skipText} onPress={() => navigation.navigate("Login")}> */}
       <Text style={styles.skipText} onPress={() => navigation.navigate("Home")}>
        Bỏ qua
       </Text>
      </View>
     </View>
    )),
   []
  );

  return (
   <Swiper ref={swiperRef} loop={false} showsPagination={false}>
    {renderSlides}
   </Swiper>
  );
 };

 const styles = StyleSheet.create({
  slide: {
   flex: 1,
   backgroundColor: "#fff",
   alignItems: "center",
   justifyContent: "center",
  },
  image: {
   width: 250,
   height: 250,
   borderRadius: 125,
   marginTop: 60,
   marginBottom: 30,
   resizeMode: "cover",
  },
  textContainer: {
   paddingHorizontal: 30,
   alignItems: "center",
  },
  title: {
   fontSize: 22,
   fontWeight: "bold",
   textAlign: "center",
   marginBottom: 10,
   color: "#000",
  },
  description: {
   fontSize: 15,
   textAlign: "center",
   color: "#666",
   marginBottom: 30,
  },
  button: {
   backgroundColor: "#0D1C2E",
   width: 200,
   height: 50,
   borderRadius: 25,
   alignItems: "center",
   justifyContent: "center",
   marginBottom: 15,
  },
  buttonText: {
   color: "#fff",
   fontSize: 16,
   fontWeight: "bold",
  },
  paginationDots: {
   flexDirection: "row",
   justifyContent: "center",
   marginBottom: 10,
  },
  dot: {
   width: 8,
   height: 8,
   borderRadius: 4,
   backgroundColor: "#ccc",
   marginHorizontal: 4,
  },
  activeDot: {
   backgroundColor: "#0D1C2E",
  },
  skipText: {
   fontSize: 14,
   color: "#888",
   marginBottom: 10,
  },
 });

 export default OnboardingScreen;