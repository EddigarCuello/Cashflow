import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { JSONStorageService } from "../Logic/JSON_Storage_Service";

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

const HomeScreen = ({ navigation, route }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [balance, setBalance] = useState(0);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [prestamos, setPrestamos] = useState([]);

  useEffect(() => {
    // Obtener datos del usuario desde los parámetros de navegación
    if (route.params?.user) {
      setUsuarioActual(route.params.user);
      setBalance(route.params.balance);
    }
  }, [route.params]);

  const cargarDatosUsuario = async () => {
    try {
      const user = await JSONStorageService.getCurrentUser();
      if (user) {
        setUsuarioActual(user);
        const saldo = await JSONStorageService.getUserBalance(user.cedula);
        setBalance(saldo);
        
        // Cargar préstamos del usuario
        const data = await JSONStorageService.loadData();
        const userData = data.users.find(u => u.cedula === user.cedula);
        if (userData && userData.prestamos) {
          setPrestamos(userData.prestamos);
        }
      }
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      cargarDatosUsuario();
    }, [])
  );

  const menuButtons = [
    {
      id: "1",
      name: "Tasa de Interés",
      icon: "trending-up",
      onPress: () => navigation.navigate("TotalInteres", { balance, user: usuarioActual }),
    },
    {
      id: "2",
      name: "I. Simple",
      icon: "calculator",
      onPress: () => navigation.navigate("TasaDeInteres", { balance, user: usuarioActual })
    },
    {
      id: "3",
      name: "I. Compuesto",
      icon: "bar-chart",
      onPress: () => navigation.navigate("InteresCompuesto", { balance, user: usuarioActual })
    },
    {
      id: "4",
      name: "Anualidades",
      icon: "calendar",
      onPress: () => navigation.navigate("Anualidades", { balance, user: usuarioActual })
    },
    {
      id: "5",
      name: "Gradiente",
      icon: "trending-up",
      onPress: () => navigation.navigate("Gradiente", { balance, user: usuarioActual }),
    },
    {
      id: "6",
      name: "Amortización",
      icon: "calculator-outline",
      onPress: () => navigation.navigate("Amortizacion", { balance, user: usuarioActual }),
    },
    {
      id: "7",
      name: "Capitalización",
      icon: "account-balance",
      onPress: () => navigation.navigate("Capitalizacion", { balance, user: usuarioActual }),
    },
    {
      id: "8",
      name: "TIR",
      icon: "analytics-outline",
      onPress: () => navigation.navigate("TIR", { balance, user: usuarioActual }),
    }
  ];

  const filteredTransactions = prestamos.filter((prestamo) =>
    prestamo.tipo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {activeIndex !== 1 && (
        <View style={styles.header}>
          <Image
            source={require("../assets/fondo.jpg")}
            style={styles.backgroundImage}
          />
          <Text style={styles.welcomeText}>Bienvenido, {usuarioActual?.nombre || 'Usuario'}</Text>
          <Text style={styles.balance}>${balance ? balance.toLocaleString() : '0'}</Text>
          <Text style={styles.currency}>COP pesos</Text>
          
          <TouchableOpacity
            style={styles.consignarButton}
            onPress={() => navigation.navigate("Consignar", { 
              balance, 
              user: usuarioActual 
            })}
          >
            <Ionicons name="cash-outline" size={24} color="#FFF" />
            <Text style={styles.consignarButtonText}>Consignar</Text>
          </TouchableOpacity>
        </View>
      )}

      {activeIndex !== 1 && (
        <View style={styles.buttonsSection}>
          <ScrollView>
            <FlatList
              data={menuButtons}
              keyExtractor={(item) => item.id}
              numColumns={2}
              scrollEnabled={false}
              contentContainerStyle={styles.menuContainer}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.menuButton} onPress={item.onPress}>
                  <Ionicons name={item.icon} size={24} color="#E5A442" />
                  <Text style={styles.menuText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </ScrollView>
        </View>
      )}

      {activeIndex === 1 && (
        <View style={styles.transactionContainer}>
          <Text style={styles.transactionTitle}>Préstamos</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar préstamo..."
            placeholderTextColor="#B0B0B0"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <FlatList
            data={filteredTransactions}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={true}
            renderItem={({ item }) => (
              <View
                style={[styles.transactionItem, { borderLeftColor: '#E5A442' }]}
              >
                <Ionicons
                  name="cash-outline"
                  size={24}
                  color="#E5A442"
                  style={styles.icon}
                />
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionText}>{item.tipo}</Text>
                  <Text style={styles.transactionDate}>
                    {new Date(item.fechaCreacion).toLocaleDateString()}
                  </Text>
                  <Text style={[styles.transactionStatus, 
                    item.estado === 'pendiente' ? styles.pendingStatus : 
                    item.estado === 'aprobado' ? styles.approvedStatus : 
                    styles.rejectedStatus
                  ]}>
                    {item.estado.charAt(0).toUpperCase() + item.estado.slice(1)}
                  </Text>
                </View>
                <Text style={styles.transactionAmount}>
                  ${item.total ? item.total.toLocaleString() : '0'}
                </Text>
              </View>
            )}
          />
        </View>
      )}

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
  container: {
    flex: 1,
    backgroundColor: "#1B1D2A",
    padding: 20
  },
  header: {
    position: "relative",
    height: 250,
    padding: 0,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 40,
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
  buttonsSection: {
    flex: 1,
    marginBottom: 100,
    maxHeight: '50%',
  },
  menuContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  menuButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2A2D3E",
    borderRadius: 10,
    padding: 20,
    margin: 10,
    maxWidth: "45%",
    marginTop: 5
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
  transactionAmount: { 
    fontSize: 16, 
    fontWeight: "bold",
    color: "#FFF"
  },
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
  activeButton: { backgroundColor: "#2D5EFF" },
  consignarButton: {
    flexDirection: 'row',
    backgroundColor: '#E5A442',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  consignarButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  welcomeText: {
    color: '#E5A442',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  transactionInfo: {
    flex: 1,
    marginLeft: 10,
  },
  transactionDate: {
    color: '#B0B0B0',
    fontSize: 12,
    marginTop: 2,
  },
  transactionStatus: {
    fontSize: 12,
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  pendingStatus: {
    backgroundColor: '#FFA500',
    color: '#FFF',
  },
  approvedStatus: {
    backgroundColor: '#4CAF50',
    color: '#FFF',
  },
  rejectedStatus: {
    backgroundColor: '#F44336',
    color: '#FFF',
  },
});

export default HomeScreen;