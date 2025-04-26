import AsyncStorage from '@react-native-async-storage/async-storage';

const BALANCE_KEY_PREFIX = '@cashflow_balance_';

export const BalanceService = {
  // Obtener el saldo de un usuario específico
  getUserBalance: async (cedula) => {
    try {
      const balanceKey = BALANCE_KEY_PREFIX + cedula;
      const balance = await AsyncStorage.getItem(balanceKey);
      return balance ? parseFloat(balance) : 20000; // Valor por defecto
    } catch (error) {
      console.error('Error obteniendo saldo del usuario:', error);
      return 20000; // Valor por defecto en caso de error
    }
  },

  // Guardar el saldo de un usuario específico
  saveUserBalance: async (cedula, balance) => {
    try {
      const balanceKey = BALANCE_KEY_PREFIX + cedula;
      await AsyncStorage.setItem(balanceKey, balance.toString());
      return true;
    } catch (error) {
      console.error('Error guardando saldo del usuario:', error);
      return false;
    }
  },

  // Obtener todos los saldos (para propósitos de depuración)
  getAllBalances: async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const balanceKeys = keys.filter(key => key.startsWith(BALANCE_KEY_PREFIX));
      const balances = await AsyncStorage.multiGet(balanceKeys);
      
      const result = {};
      balances.forEach(([key, value]) => {
        const cedula = key.replace(BALANCE_KEY_PREFIX, '');
        result[cedula] = parseFloat(value);
      });
      
      return result;
    } catch (error) {
      console.error('Error obteniendo todos los saldos:', error);
      return {};
    }
  },

  // Eliminar el saldo de un usuario específico
  deleteUserBalance: async (cedula) => {
    try {
      const balanceKey = BALANCE_KEY_PREFIX + cedula;
      await AsyncStorage.removeItem(balanceKey);
      return true;
    } catch (error) {
      console.error('Error eliminando saldo del usuario:', error);
      return false;
    }
  },

  // Eliminar todos los saldos (para propósitos de depuración)
  deleteAllBalances: async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const balanceKeys = keys.filter(key => key.startsWith(BALANCE_KEY_PREFIX));
      await AsyncStorage.multiRemove(balanceKeys);
      return true;
    } catch (error) {
      console.error('Error eliminando todos los saldos:', error);
      return false;
    }
  }
}; 