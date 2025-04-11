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

// Define the type for the navigation prop
type OnboardingScreenNavigationProp = StackNavigationProp<
  {
    Login: undefined;
  },
  "Login"
>;

const slides = [
  {
    id: 1,
    image: require("../asset/img/hinh1.png"),
    title: "Connect with Specialists",
    description:
      "Connect with Specialized Doctors Online for Convenient and Comprehensive Medical Consultations.",
  },
  {
    id: 2,
    image: require("../asset/img/hinh1.png"),
    title: "Thousands of Online Specialists",
    description:
      "Explore a Vast Array of Online Medical Specialists, Offering an Extensive Range of Expertise Tailored to Your Healthcare Needs.",
  },
  {
    id: 3,
    image: require("../asset/img/hinh1.png"),
    title: "Get Started Easily",
    description:
      "Book your first online consultation today and experience top-notch medical care from the comfort of your home.",
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
                  ? navigation.navigate("Login")
                  : swiperRef.current?.scrollBy(1)
              }
            >
              <Text style={styles.buttonText}>
                {index === slides.length - 1 ? "Get Started" : "Next"}
              </Text>
            </TouchableOpacity>
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
  },
  image: {
    width: "100%",
    height: height * 0.6,
    resizeMode: "cover",
  },
  textContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    marginTop: -40,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "gray",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#28A745", // ✅ Tông màu theo yêu cầu
    width: 180,
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default OnboardingScreen;
