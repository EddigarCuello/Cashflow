import AsyncStorage from '@react-native-async-storage/async-storage';

// Inicializamos los datos de usuarios desde AsyncStorage
let users = {};

// Usuarios de prueba
const defaultUsers = {
    "12345678": { password: "password123", persona: { nombre: "Juan", email: "juan@example.com", cedula: "12345678" } },
    "87654321": { password: "password456", persona: { nombre: "Maria", email: "maria@example.com", cedula: "87654321" } },
};

(async () => {
    const storedUsers = await AsyncStorage.getItem('users');
    if (!storedUsers) {
        // Si no hay usuarios almacenados, inicializamos con los usuarios de prueba
        users = defaultUsers;
        await AsyncStorage.setItem('users', JSON.stringify(users));
    } else {
        users = JSON.parse(storedUsers);
    }
})();

export async function registerUser(cedula, password, persona) {
    if (users[cedula]) {
        throw new Error('El usuario ya está registrado.');
    }
    users[cedula] = { password, persona };
    await AsyncStorage.setItem('users', JSON.stringify(users));
    return 'Usuario registrado con éxito.';
}

export async function loginUser(email, password) {
    const user = Object.values(users).find(u => u.persona.email === email);
    if (!user || user.password !== password) {
        throw new Error('Credenciales incorrectas.');
    }
    return user;
}

export async function findUserBy(field, value) {
    const user = Object.values(users).find(u => u.persona[field] === value);
    return user || null;
}

export async function logoutUser() {
    console.log("Sesión cerrada.");
}

export async function RecoveryPassword(email) {
    const user = Object.values(users).find(u => u.persona.email === email);
    if (!user) {
        throw new Error('Usuario no encontrado.');
    }
    console.log(`Correo de recuperación enviado a ${email}`);
}
