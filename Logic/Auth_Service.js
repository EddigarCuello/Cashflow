import { StorageService } from './Storage_Service';

const USERS_KEY = '@users';
const CURRENT_USER_KEY = '@current_user';
const BIOMETRIC_USER_KEY = '@biometric_user';

export const registro = async (userData) => {
  try {
    // Verificar si el usuario ya existe
    const existingUser = await StorageService.findUserByCedula(userData.cedula);
    if (existingUser) {
      throw new Error('Usuario ya registrado con esta cédula');
    }

    // Preparar datos del usuario
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      hasBiometricEnabled: userData.hasBiometricEnabled || false
    };

    // Guardar usuario
    const userSaved = await StorageService.saveUser(newUser);
    if (!userSaved) {
      throw new Error('Error al guardar el usuario');
    }

    // Si el usuario habilitó la biometría, guardar credenciales
    if (userData.hasBiometricEnabled) {
      const biometricSaved = await StorageService.saveBiometricCredentials({
        cedula: userData.cedula,
        password: userData.password
      });
      if (!biometricSaved) {
        throw new Error('Error al guardar credenciales biométricas');
      }
    }

    return { success: true, message: 'Usuario registrado exitosamente' };
  } catch (error) {
    throw new Error(error.message || 'Error al registrar usuario');
  }
};

export const login = async (cedula, password) => {
  try {
    const users = await StorageService.getAllUsers();
    const user = users.find(u => u.cedula === cedula && u.password === password);

    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    // Guardar usuario actual
    const currentUserSaved = await StorageService.setCurrentUser(user);
    if (!currentUserSaved) {
      throw new Error('Error al iniciar sesión');
    }

    return {
      success: true,
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        cedula: user.cedula,
        isAdmin: user.isAdmin,
        hasBiometricEnabled: user.hasBiometricEnabled
      }
    };
  } catch (error) {
    throw new Error(error.message || 'Error al iniciar sesión');
  }
};

export const loginWithBiometric = async () => {
  try {
    const credentials = await StorageService.getBiometricCredentials();
    if (!credentials) {
      throw new Error('No hay credenciales biométricas guardadas');
    }

    return await login(credentials.cedula, credentials.password);
  } catch (error) {
    throw new Error(error.message || 'Error al iniciar sesión con huella dactilar');
  }
};

export const getCurrentUser = async () => {
  return await StorageService.getCurrentUser();
};

export const logout = async () => {
  try {
    const logoutSuccess = await StorageService.removeCurrentUser();
    if (!logoutSuccess) {
      throw new Error('Error al cerrar sesión');
    }
    return { success: true };
  } catch (error) {
    throw new Error('Error al cerrar sesión');
  }
};

export const hasBiometricCredentials = async () => {
  const credentials = await StorageService.getBiometricCredentials();
  return !!credentials;
};

export const mostrarUsuarios = async () => {
  try {
    const users = await StorageService.getAllUsers();
    console.log('=== USUARIOS REGISTRADOS ===');
    console.log(JSON.stringify(users, null, 2));
    console.log('===========================');
    return users;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return [];
  }
};

export const eliminarUsuario = async (cedula) => {
  try {
    const deleted = await StorageService.deleteUser(cedula);
    if (!deleted) {
      throw new Error('Error al eliminar usuario');
    }
    return { success: true, message: 'Usuario eliminado correctamente' };
  } catch (error) {
    throw new Error(error.message || 'Error al eliminar usuario');
  }
};

export const eliminarTodosLosUsuarios = async () => {
  try {
    const deleted = await StorageService.deleteAllUsers();
    if (!deleted) {
      throw new Error('Error al eliminar usuarios');
    }
    return { success: true, message: 'Todos los usuarios han sido eliminados' };
  } catch (error) {
    throw new Error(error.message || 'Error al eliminar usuarios');
  }
};
