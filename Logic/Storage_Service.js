import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USERS: '@cashflow_users',
  CURRENT_USER: '@cashflow_current_user',
  BIOMETRIC_USER: '@cashflow_biometric_user',
  BALANCES: '@cashflow_balances'
};

export const StorageService = {
  // Funciones para usuarios
  saveUser: async (userData) => {
    try {
      const users = await StorageService.getAllUsers();
      users.push(userData);
      await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      return true;
    } catch (error) {
      console.error('Error guardando usuario:', error);
      return false;
    }
  },

  getAllUsers: async () => {
    try {
      const users = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      return [];
    }
  },

  findUserByCedula: async (cedula) => {
    try {
      const users = await StorageService.getAllUsers();
      return users.find(user => user.cedula === cedula);
    } catch (error) {
      console.error('Error buscando usuario:', error);
      return null;
    }
  },

  // Funciones para usuario actual
  setCurrentUser: async (user) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      return true;
    } catch (error) {
      console.error('Error guardando usuario actual:', error);
      return false;
    }
  },

  getCurrentUser: async () => {
    try {
      const user = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error obteniendo usuario actual:', error);
      return null;
    }
  },

  removeCurrentUser: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      return true;
    } catch (error) {
      console.error('Error eliminando usuario actual:', error);
      return false;
    }
  },

  // Funciones para autenticación biométrica
  saveBiometricCredentials: async (credentials) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.BIOMETRIC_USER, JSON.stringify(credentials));
      return true;
    } catch (error) {
      console.error('Error guardando credenciales biométricas:', error);
      return false;
    }
  },

  getBiometricCredentials: async () => {
    try {
      const credentials = await AsyncStorage.getItem(STORAGE_KEYS.BIOMETRIC_USER);
      return credentials ? JSON.parse(credentials) : null;
    } catch (error) {
      console.error('Error obteniendo credenciales biométricas:', error);
      return null;
    }
  },

  removeBiometricCredentials: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.BIOMETRIC_USER);
      return true;
    } catch (error) {
      console.error('Error eliminando credenciales biométricas:', error);
      return false;
    }
  },

  // Funciones para manejar el saldo por usuario
  saveBalance: async (balance, cedula) => {
    try {
      // Obtener todos los saldos
      const balances = await StorageService.getAllBalances();
      
      // Actualizar o agregar el saldo para este usuario
      balances[cedula] = balance;
      
      // Guardar todos los saldos
      await AsyncStorage.setItem(STORAGE_KEYS.BALANCES, JSON.stringify(balances));
      return true;
    } catch (error) {
      console.error('Error guardando saldo:', error);
      return false;
    }
  },

  getBalance: async (cedula) => {
    try {
      const balances = await StorageService.getAllBalances();
      return balances[cedula] || 20000; // Valor por defecto si no existe
    } catch (error) {
      console.error('Error obteniendo saldo:', error);
      return 20000; // Valor por defecto en caso de error
    }
  },

  getAllBalances: async () => {
    try {
      const balances = await AsyncStorage.getItem(STORAGE_KEYS.BALANCES);
      return balances ? JSON.parse(balances) : {};
    } catch (error) {
      console.error('Error obteniendo todos los saldos:', error);
      return {};
    }
  },

  // Función para limpiar todo el almacenamiento
  clearAllStorage: async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USERS,
        STORAGE_KEYS.CURRENT_USER,
        STORAGE_KEYS.BIOMETRIC_USER,
        STORAGE_KEYS.BALANCES
      ]);
      return true;
    } catch (error) {
      console.error('Error limpiando almacenamiento:', error);
      return false;
    }
  },

  deleteUser: async (cedula) => {
    try {
      const users = await StorageService.getAllUsers();
      const updatedUsers = users.filter(user => user.cedula !== cedula);
      await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updatedUsers));
      return true;
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      return false;
    }
  },

  deleteAllUsers: async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
      return true;
    } catch (error) {
      console.error('Error eliminando todos los usuarios:', error);
      return false;
    }
  }
}; 