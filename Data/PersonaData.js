import { db } from './firebase.js';
import { collection, query, where, getDocs } from 'firebase/firestore';

// Función para buscar un usuario por un campo específico
async function findUserBy(campo, valor) {
    try {
        const q = query(collection(db, 'User_Data'), where(campo, '==', valor));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            console.log('Datos del usuario:', userData);
            return userData;
        } else {
            console.log(`Documento no encontrado para el campo ${campo} con valor ${valor}`);
            return null;
        }
    } catch (error) {
        console.error(`Error al obtener el usuario por ${campo}:`, error.message);
        return null;
    }
}

async function findAllUsers() {
    try {
        const q = collection(db, 'User_Data');
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const usersData = querySnapshot.docs.map(doc => doc.data());
            console.log('Todos los usuarios:', usersData);
            return usersData;
        } else {
            console.log('No se encontraron usuarios.');
            return [];
        }
    } catch (error) {
        console.error('Error al obtener todos los usuarios:', error.message);
        return [];
    }
}

export { findUserBy,findAllUsers };
