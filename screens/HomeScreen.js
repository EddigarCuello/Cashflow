import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput
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

const menuButtons = [
  {
    id: "1",
    name: "Tasa de Interés",
    icon: "trending-up",
    onPress: () => navigation.navigate("TasaDeInteres")
  },
  {
    id: "2",
    name: "I. Simple",
    icon: "calculator",
    onPress: () => navigation.navigate("TasaDeInteres")
  },
  {
    id: "3",
    name: "I. Compuesto",
    icon: "bar-chart",
    onPress: () => navigation.navigate("InteresCompuesto")
  },
  {
    id: "4",
    name: "Anualidades",
    icon: "calendar",
    onPress: () => navigation.navigate("Anualidades")
  }
];

const HomeScreen = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation(); // Obtén el objeto de navegación

  // Filtrar transacciones según el texto de búsqueda
  const filteredTransactions = transactions.filter((transaction) =>
    transaction.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Ocultar el header cuando activeIndex es 1 (person-outline) */}
      {activeIndex !== 1 && (
        <View style={styles.header}>
          <Image
            source={require("../assets/fondo.jpg")}
            style={styles.backgroundImage}
          />
          <Text style={styles.currency}>COP pesos</Text>
          <Text style={styles.balance}>$20,000</Text>
        </View>
      )}

      {/* Ocultar los botones del menú cuando activeIndex es 1 (person-outline) */}
      {activeIndex !== 1 && (
        <FlatList
          data={menuButtons}
          keyExtractor={(item) => item.id}
          numColumns={2} // Grilla de 2 columnas
          contentContainerStyle={styles.menuContainer}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.menuButton} onPress={item.onPress}>
              <Ionicons name={item.icon} size={24} color="#E5A442" />
              <Text style={styles.menuText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Mostrar transacciones solo si el botón "person-outline" está activo */}
      {activeIndex === 1 && (
        <View style={styles.transactionContainer}>
          <Text style={styles.transactionTitle}>Transaction</Text>
          {/* Buscador */}
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar transacción..."
            placeholderTextColor="#B0B0B0"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <FlatList
            data={filteredTransactions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={[styles.transactionItem, { borderLeftColor: item.color }]}
              >
                <Ionicons
                  name={item.icon}
                  size={24}
                  color={item.color}
                  style={styles.icon}
                />
                <Text style={styles.transactionText}>{item.name}</Text>
                <Text
                  style={[
                    styles.transactionAmount,
                    { color: item.amount.includes("-") ? "red" : "green" }
                  ]}
                >
                  {item.amount}
                </Text>
              </View>
            )}
          />
        </View>
      )}

      {/* Paginación: Mostrar botones uno debajo del otro */}
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
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 10
  },
  menuButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2A2D3E",
    borderRadius: 10,
    padding: 20,
    margin: 10,
    maxWidth: "45%" // Ancho máximo para 2 columnas
  },
  menuText: { color: "#FFF", fontSize: 14, marginTop: 10 },
  transactionContainer: { flex: 1, marginTop: 10, paddingBottom: 80 },
  transactionTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10
  },
  searchInput: {
    backgroundColor: "#2A2D3E",
    borderRadius: 10,
    padding: 15,
    color: "#FFF",
    marginBottom: 10
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