import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { JSONStorageService } from "../Logic/JSON_Storage_Service";

const AdminScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLoansModal, setShowLoansModal] = useState(false);

  const loadUsers = async () => {
    try {
      const allUsers = await JSONStorageService.getAllUsers();
      // Filter out admin users
      const nonAdminUsers = allUsers.filter((user) => !user.isAdmin);
      setUsers(nonAdminUsers);
    } catch (error) {
      console.error("Error loading users:", error);
      Alert.alert("Error", "No se pudieron cargar los usuarios");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleLoanAction = async (loan, action) => {
    try {
      const data = await JSONStorageService.loadData();
      const userIndex = data.users.findIndex(
        (user) => user.cedula === selectedUser.cedula
      );

      if (userIndex >= 0) {
        const loanIndex = data.users[userIndex].prestamos.findIndex(
          (l) => l.fechaCreacion === loan.fechaCreacion
        );

        if (loanIndex >= 0) {
          data.users[userIndex].prestamos[loanIndex].estado =
            action === "approve" ? "aprobado" : "rechazado";

          if (action === "approve") {
            const currentBalance = data.users[userIndex].balance || 0;
            const newBalance = currentBalance + loan.total;
            data.users[userIndex].balance = newBalance;
          }

          await JSONStorageService.saveData(data);
          setShowLoansModal(false); // Close modal first
          loadUsers(); // Then reload users
          Alert.alert(
            "Éxito",
            action === "approve"
              ? "Préstamo aprobado y balance actualizado"
              : "Préstamo rechazado"
          );
        }
      }
    } catch (error) {
      console.error("Error updating loan:", error);
      Alert.alert("Error", "No se pudo actualizar el préstamo");
    }
  };

  const handleCloseModal = () => {
    setShowLoansModal(false);
    setSelectedUser(null); // Reset selected user when closing
  };

  const filteredUsers = users.filter(
    (user) =>
      user.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.cedula.includes(searchQuery)
  );

  const renderUserItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => {
        setSelectedUser(item);
        setShowLoansModal(true);
      }}
    >
      <View style={styles.userInfo}>
        <Text style={styles.userName}>
          {item.nombre} {item.apellido}
        </Text>
        <Text style={styles.userCedula}>Cédula: {item.cedula}</Text>
        <Text style={styles.loanCount}>
          Préstamos: {item.prestamos ? item.prestamos.length : 0}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#E5A442" />
    </TouchableOpacity>
  );

  const renderLoanItem = ({ item }) => (
    <View style={[styles.loanItem, { borderLeftColor: "#E5A442" }]}>
      <View style={styles.loanInfo}>
        <Text style={styles.loanType}>{item.tipo}</Text>
        <Text style={styles.loanDate}>
          Fecha:{" "}
          {item.fechaCreacion
            ? new Date(item.fechaCreacion).toLocaleDateString()
            : "Fecha no disponible"}
        </Text>
        <Text
          style={[
            styles.loanStatus,
            item.estado === "por_aprobar"
              ? styles.pendingStatus
              : item.estado === "aprobado"
              ? styles.approvedStatus
              : styles.rejectedStatus,
          ]}
        >
          {item.estado === "por_aprobar"
            ? "Por Aprobar"
            : item.estado === "aprobado"
            ? "Aprobado"
            : "Rechazado"}
        </Text>
      </View>
      <View style={styles.loanActions}>
        <Text style={styles.loanAmount}>${item.total.toLocaleString()}</Text>
        {item.estado === "por_aprobar" && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.approveButton]}
              onPress={() => handleLoanAction(item, "approve")}
            >
              <Ionicons name="checkmark-circle" size={24} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => handleLoanAction(item, "reject")}
            >
              <Ionicons name="close-circle" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  const handleShowUsers = async () => {
    try {
      const allUsers = await JSONStorageService.getAllUsers();
      console.log('=== DETALLE COMPLETO DE USUARIOS REGISTRADOS ===');
      console.log('Total de usuarios:', allUsers.length);
      console.log('----------------------------------------');
      allUsers.forEach((user, index) => {
        console.log(`Usuario #${index + 1}:`);
        console.log('Datos completos del usuario:');
        console.log(JSON.stringify(user, null, 2));
        console.log('----------------------------------------');
      });
      console.log('========================================');
      
      // También mostrar en una alerta para confirmar
      let usersMessage = '=== USUARIOS REGISTRADOS ===\n\n';
      allUsers.forEach((user, index) => {
        usersMessage += `${index + 1}. ${user.nombre} ${user.apellido} (Cédula: ${user.cedula})\n`;
      });
      usersMessage += '\n===========================\n\nRevisa la consola para ver más detalles.';
      
      Alert.alert('Usuarios Registrados', usersMessage);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      Alert.alert('Error', 'No se pudieron obtener los usuarios');
    }
  };

  const handleDeleteUsers = async () => {
    try {
      const result = await JSONStorageService.deleteAllUsers();
      if (result) {
        Alert.alert('Éxito', 'Todos los usuarios han sido eliminados correctamente');
        loadUsers(); // Recargar la lista de usuarios
      } else {
        Alert.alert('Error', 'No se pudieron eliminar los usuarios');
      }
    } catch (error) {
      console.error('Error al eliminar usuarios:', error);
      Alert.alert('Error', 'Ocurrió un error al eliminar los usuarios');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Panel de Administración</Text>
        <Text style={styles.subtitle}>Gestión de Usuarios y Préstamos</Text>
      </View>

      <View style={styles.adminButtons}>
        <TouchableOpacity 
          style={[styles.adminButton, { backgroundColor: '#4CAF50' }]}
          onPress={handleShowUsers}
        >
          <Text style={styles.adminButtonText}>Mostrar Usuarios</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.adminButton, { backgroundColor: '#ff4444' }]}
          onPress={handleDeleteUsers}
        >
          <Text style={styles.adminButtonText}>Eliminar Usuarios</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por nombre o cédula..."
        placeholderTextColor="#B0B0B0"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.cedula}
        renderItem={renderUserItem}
        contentContainerStyle={styles.usersList}
      />

      <Modal
        visible={showLoansModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Préstamos de {selectedUser?.nombre} {selectedUser?.apellido}
              </Text>
              <TouchableOpacity
                onPress={handleCloseModal}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={selectedUser?.prestamos || []}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderLoanItem}
              contentContainerStyle={styles.loansList}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B1D2A",
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    color: "#E5A442",
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#FFF",
    fontSize: 16,
    marginTop: 5,
  },
  searchInput: {
    backgroundColor: "#2A2D3E",
    borderRadius: 10,
    padding: 15,
    color: "#FFF",
    marginBottom: 20,
  },
  usersList: {
    paddingBottom: 20,
  },
  userItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2A2D3E",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  userCedula: {
    color: "#B0B0B0",
    fontSize: 14,
    marginTop: 4,
  },
  loanCount: {
    color: "#E5A442",
    fontSize: 12,
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1B1D2A",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    color: "#E5A442",
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  loansList: {
    paddingBottom: 20,
  },
  loanItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#2A2D3E",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 5,
  },
  loanInfo: {
    flex: 1,
  },
  loanType: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  loanDate: {
    color: "#B0B0B0",
    fontSize: 12,
    marginTop: 2,
  },
  loanStatus: {
    fontSize: 12,
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: "hidden",
    alignSelf: "flex-start",
  },
  pendingStatus: {
    backgroundColor: "#FFA500",
    color: "#FFF",
  },
  approvedStatus: {
    backgroundColor: "#4CAF50",
    color: "#FFF",
  },
  rejectedStatus: {
    backgroundColor: "#F44336",
    color: "#FFF",
  },
  loanActions: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  loanAmount: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  actionButtons: {
    flexDirection: "row",
    marginTop: 10,
  },
  actionButton: {
    padding: 8,
    borderRadius: 20,
    marginLeft: 10,
  },
  approveButton: {
    backgroundColor: "#4CAF50",
  },
  rejectButton: {
    backgroundColor: "#F44336",
  },
  adminButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  adminButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  adminButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdminScreen;
