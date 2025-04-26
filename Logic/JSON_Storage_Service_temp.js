import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const JSON_FILE_PATH = FileSystem.documentDirectory + 'users.json';
const STORAGE_KEY = '@cashflow_json_data';

export const JSONStorageService = {
  // Inicializar el archivo JSON si no existe
  initializeJSON: async () => {
    try {
      const fileExists = await FileSystem.getInfoAsync(JSON_FILE_PATH);
      
      if (!fileExists.exists) {
        // Crear un archivo JSON inicial con estructura básica
        const initialData = {
          users: [],
          currentUser: null,
          biometricCredentials: null,
          prestamos: []
        };
        
        await FileSystem.writeAsStringAsync(
          JSON_FILE_PATH,
          JSON.stringify(initialData, null, 2)
        );
        
        // También guardar en AsyncStorage como respaldo
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
        
        return true;
      }
      
      return true;
    } catch (error) {
      console.error('Error inicializando JSON:', error);
      return false;
    }
  },
  
  // Cargar datos del archivo JSON
  loadData: async () => {
    try {
      // Intentar cargar desde el archivo
      const fileExists = await FileSystem.getInfoAsync(JSON_FILE_PATH);
      
      if (fileExists.exists) {
        const jsonContent = await FileSystem.readAsStringAsync(JSON_FILE_PATH);
        return JSON.parse(jsonContent);
      }
      
      // Si no existe el archivo, intentar cargar desde AsyncStorage
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedData) {
        return JSON.parse(storedData);
      }
      
      // Si no hay datos en ningún lado, inicializar
      await JSONStorageService.initializeJSON();
      return { users: [], currentUser: null, biometricCredentials: null, prestamos: [] };
    } catch (error) {
      console.error('Error cargando datos JSON:', error);
      return { users: [], currentUser: null, biometricCredentials: null, prestamos: [] };
    }
  },
  
  // Guardar datos en el archivo JSON
  saveData: async (data) => {
    try {
      // Guardar en el archivo
      await FileSystem.writeAsStringAsync(
        JSON_FILE_PATH,
        JSON.stringify(data, null, 2)
      );
      
      // También guardar en AsyncStorage como respaldo
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      
      return true;
    } catch (error) {
      console.error('Error guardando datos JSON:', error);
      return false;
    }
  },
  
  // Funciones para usuarios
  saveUser: async (userData) => {
    try {
      const data = await JSONStorageService.loadData();
      
      // Verificar si el usuario ya existe
      const existingUserIndex = data.users.findIndex(user => user.cedula === userData.cedula);
      
      if (existingUserIndex >= 0) {
        // Actualizar usuario existente
        data.users[existingUserIndex] = { 
          ...data.users[existingUserIndex], 
          ...userData,
          prestamos: data.users[existingUserIndex].prestamos || []
        };
      } else {
        // Agregar nuevo usuario con array de préstamos vacío
        data.users.push({
          ...userData,
          prestamos: []
        });
      }
      
      return await JSONStorageService.saveData(data);
    } catch (error) {
      console.error('Error guardando usuario:', error);
      return false;
    }
  },
  
  getAllUsers: async () => {
    try {
      const data = await JSONStorageService.loadData();
      return data.users || [];
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      return [];
    }
  },
  
  findUserByCedula: async (cedula) => {
    try {
      const data = await JSONStorageService.loadData();
      return data.users.find(user => user.cedula === cedula) || null;
    } catch (error) {
      console.error('Error buscando usuario:', error);
      return null;
    }
  },
  
  // Funciones para usuario actual
  setCurrentUser: async (user) => {
    try {
      const data = await JSONStorageService.loadData();
      data.currentUser = user;
      return await JSONStorageService.saveData(data);
    } catch (error) {
      console.error('Error guardando usuario actual:', error);
      return false;
    }
  },
  
  getCurrentUser: async () => {
    try {
      const data = await JSONStorageService.loadData();
      return data.currentUser;
    } catch (error) {
      console.error('Error obteniendo usuario actual:', error);
      return null;
    }
  },
  
  removeCurrentUser: async () => {
    try {
      const data = await JSONStorageService.loadData();
      data.currentUser = null;
      return await JSONStorageService.saveData(data);
    } catch (error) {
      console.error('Error eliminando usuario actual:', error);
      return false;
    }
  },
  
  // Funciones para credenciales biométricas
  saveBiometricCredentials: async (cedula, password) => {
    try {
      const data = await JSONStorageService.loadData();
      data.biometricCredentials = {
        cedula,
        password,
        timestamp: new Date().toISOString()
      };
      return await JSONStorageService.saveData(data);
    } catch (error) {
      console.error('Error al guardar credenciales biométricas:', error);
      return false;
    }
  },
  
  getBiometricCredentials: async () => {
    try {
      const data = await JSONStorageService.loadData();
      return data.biometricCredentials || null;
    } catch (error) {
      console.error('Error al obtener credenciales biométricas:', error);
      return null;
    }
  },
  
  deleteBiometricCredentials: async () => {
    try {
      const data = await JSONStorageService.loadData();
      data.biometricCredentials = null;
      return await JSONStorageService.saveData(data);
    } catch (error) {
      console.error('Error al eliminar credenciales biométricas:', error);
      return false;
    }
  },
  
  // Funciones para saldos de usuarios
  getUserBalance: async (cedula) => {
    try {
      const data = await JSONStorageService.loadData();
      
      // Buscar el usuario
      const user = data.users.find(user => user.cedula === cedula);
      
      // Si el usuario existe y tiene saldo, devolverlo
      if (user && user.balance !== undefined) {
        return user.balance;
      }
      
      // Si no tiene saldo, establecer el valor por defecto
      if (user) {
        user.balance = 20000;
        await JSONStorageService.saveData(data);
        return 20000;
      }
      
      return 20000; // Valor por defecto
    } catch (error) {
      console.error('Error obteniendo saldo del usuario:', error);
      return 20000; // Valor por defecto en caso de error
    }
  },
  
  saveUserBalance: async (cedula, balance) => {
    try {
      const data = await JSONStorageService.loadData();
      
      // Buscar el usuario
      const userIndex = data.users.findIndex(user => user.cedula === cedula);
      
      if (userIndex >= 0) {
        // Actualizar el saldo del usuario
        data.users[userIndex].balance = balance;
        return await JSONStorageService.saveData(data);
      }
      
      return false; // Usuario no encontrado
    } catch (error) {
      console.error('Error guardando saldo del usuario:', error);
      return false;
    }
  },
  
  // Función para limpiar todos los datos
  clearAllData: async () => {
    try {
      // Eliminar el archivo JSON
      const fileExists = await FileSystem.getInfoAsync(JSON_FILE_PATH);
      if (fileExists.exists) {
        await FileSystem.deleteAsync(JSON_FILE_PATH);
      }
      
      // Eliminar datos de AsyncStorage
      await AsyncStorage.removeItem(STORAGE_KEY);
      
      // Inicializar datos vacíos
      return await JSONStorageService.initializeJSON();
    } catch (error) {
      console.error('Error limpiando datos:', error);
      return false;
    }
  },
  
  // Función para eliminar un usuario
  deleteUser: async (cedula) => {
    try {
      const data = await JSONStorageService.loadData();
      data.users = data.users.filter(user => user.cedula !== cedula);
      
      // Si el usuario actual es el que se está eliminando, limpiarlo
      if (data.currentUser && data.currentUser.cedula === cedula) {
        data.currentUser = null;
      }
      
      return await JSONStorageService.saveData(data);
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      return false;
    }
  },
  
  // Función para eliminar todos los usuarios
  deleteAllUsers: async () => {
    try {
      const data = await JSONStorageService.loadData();
      data.users = [];
      data.currentUser = null;
      data.biometricCredentials = null;
      return await JSONStorageService.saveData(data);
    } catch (error) {
      console.error('Error eliminando todos los usuarios:', error);
      return false;
    }
  }
}; 