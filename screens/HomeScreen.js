import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; // Importa useNavigation

const transactions = [
  {
    id: "2",
    name: "Income",
    amount: "$3000",
    color: "#0FA958",
    icon: "arrow-up-circle"
  },
  {
    id: "3",
    name: "Bills",
    amount: "-$800",
    color: "#E55B42",
    icon: "receipt"
  },
  {
    id: "4",
    name: "Income",
    amount: "$3000",
    color: "#0FA958",
    icon: "arrow-up-circle"
  },
  {
    id: "5",
    name: "Bills",
    amount: "-$800",
    color: "#E55B42",
    icon: "receipt"
  },
  {
    id: "6",
    name: "Income",
    amount: "$3000",
    color: "#0FA958",
    icon: "arrow-up-circle"
  },
  { id: "7", name: "Bills", amount: "-$800", color: "#E55B42", icon: "receipt" }
];

const HomeScreen = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const navigation = useNavigation(); // Obtén el objeto de navegación

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/fondo.jpg")}
          style={styles.backgroundImage}
        />
        <Text style={styles.currency}>COP pesos</Text>
        <Text style={styles.balance}>$20,000</Text>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="trending-up" size={24} color="#E5A442" />
          <Text style={styles.menuText}>Tasa de Interés</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => navigation.navigate("TasaDeInteres")} // Navega a TasaDeInteres
        >
          <Ionicons name="calculator" size={24} color="#E5A442" />
          <Text style={styles.menuText}>I. Simple</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setShowMoreOptions(!showMoreOptions)}
        >
          <Ionicons
            name={showMoreOptions ? "close" : "ellipsis-horizontal"}
            size={24}
            color="#E5A442"
          />
          <Text style={styles.menuText}>Más</Text>
        </TouchableOpacity>
      </View>

      {showMoreOptions &&
        <View style={styles.extraMenuContainer}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate("InteresCompuesto")} // Navega a Interés Compuesto
          >
            <Ionicons name="bar-chart" size={24} color="#E5A442" />
            <Text style={styles.menuText}>I. Compuesto</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.navigate("Anualidades")} // Navega a Anualidades
          >
            <Ionicons name="calendar" size={24} color="#E5A442" />
            <Text style={styles.menuText}>Anualidades</Text>
          </TouchableOpacity>
        </View>}

      <View style={styles.transactionContainer}>
        <Text style={styles.transactionTitle}>Transaction</Text>
        <FlatList
          data={transactions}
          keyExtractor={item => item.id}
          renderItem={({ item }) =>
            <View
              style={[styles.transactionItem, { borderLeftColor: item.color }]}
            >
              <Ionicons
                name={item.icon}
                size={24}
                color={item.color}
                style={styles.icon}
              />
              <Text style={styles.transactionText}>
                {item.name}
              </Text>
              <Text
                style={[
                  styles.transactionAmount,
                  { color: item.amount.includes("-") ? "red" : "green" }
                ]}
              >
                {item.amount}
              </Text>
            </View>}
        />
      </View>

      <View style={styles.pagination}>
        <TouchableOpacity
          style={[styles.button, activeIndex === 0 && styles.activeButton]}
          onPress={() => setActiveIndex(0)}
        >
          <Ionicons
            name="home-outline"
            size={24}
            color={activeIndex === 0 ? "#FFF" : "#B0B0B0"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, activeIndex === 1 && styles.activeButton]}
          onPress={() => setActiveIndex(1)}
        >
          <Ionicons
            name="person-outline"
            size={24}
            color={activeIndex === 1 ? "#FFF" : "#B0B0B0"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1B1D2A", padding: 20 },
  header: {
    position: "relative",
    height: 250,
    padding: 0,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    overflow: "hidden"
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 15,
    opacity: 0.5
  },
  currency: { color: "#FFD700", fontSize: 16 },
  balance: {
    color: "#FFF",
    fontSize: 36,
    fontWeight: "bold",
    marginVertical: 10
  },
  menuContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#2A2D3E",
    borderRadius: 10,
    padding: 15
  },
  extraMenuContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#2A2D3E",
    borderRadius: 10,
    padding: 10,
    marginTop: 10
  },
  menuButton: {
    flex: 1,
    alignItems: "center"
  },
  menuText: { color: "#FFF", fontSize: 14, marginTop: 5 },
  transactionContainer: { flex: 1, marginTop: 10, paddingBottom: 80 },
  transactionTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#2A2D3E",
    borderRadius: 10,
    marginVertical: 5,
    borderLeftWidth: 5
  },
  icon: { marginRight: 10 },
  transactionText: { color: "#FFF", fontSize: 16, flex: 1 },
  transactionAmount: { fontSize: 16, fontWeight: "bold" },
  pagination: {
    flexDirection: "row",
    backgroundColor: "#1B1D2A",
    padding: 6,
    borderRadius: 20,
    justifyContent: "space-between",
    alignItems: "center",
    width: 250,
    height: 70,
    alignSelf: "center",
    position: "absolute",
    bottom: 20,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.5)"
  },
  button: { padding: 15, borderRadius: 15 },
  activeButton: { backgroundColor: "#2D5EFF" }
});

export default HomeScreen;
