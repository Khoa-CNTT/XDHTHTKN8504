import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 20, backgroundColor: "#fff" },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  location: { marginLeft: 5, fontSize: 16, fontWeight: "bold" },
  notificationIcon: { marginLeft: "auto" },
  searchBox: { backgroundColor: "#f0f0f0", padding: 10, borderRadius: 10, marginBottom: 15 },
  banner: { position: "relative", borderRadius: 10, marginBottom: 20 },
  bannerImage: { width: "100%", height: 150, borderRadius: 10, resizeMode: "cover" },
  overlay: { position: "absolute", width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.3)", borderRadius: 10 },
  bannerTextContainer: { position: "absolute", top: 20, left: 20, right: 20 },
  bannerTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  bannerSubtitle: { fontSize: 14, color: "#fff", marginTop: 3 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  card: { width: 200, backgroundColor: "#fff", padding: 10, borderRadius: 10, marginRight: 15 },
  cardImage: { width: "100%", height: 100, borderRadius: 10 },
  cardTitle: { fontSize: 14, fontWeight: "bold", marginTop: 5 },
  cardText: { fontSize: 12, color: "gray" },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
});

export default styles;
