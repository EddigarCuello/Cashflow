import { auth,db } from './firebase.js';
import { sendPasswordResetEmail } from "firebase/auth";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc } from 'firebase/firestore';


export const registerUser = async (Persona) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, Persona.correo, Persona.password);
        const user = userCredential.user;

        const PersonaToSave = {
            uid: user.uid,
            nombre: Persona.nombre,
            apellido: Persona.apellido,
            telefono: Persona.telefono,
            f_nacimiento: Persona.fecha_nacimiento,
            cedula: Persona.cedula,
            email: Persona.correo,
            password: Persona.password,
            
        };

        // Guardar los datos en Firestore
        await setDoc(doc(db, 'User_Data', user.uid), PersonaToSave);

        return user;

    } catch (error) {
        if (error.code === 'auth/weak-password') {
            console.error('Contraseña Débil');
            throw new Error('Contraseña Débil');
        } else if (error.code === 'auth/email-already-in-use') {
            console.error('Correo ya Existe');
            throw new Error('Correo ya Existe');
        } else {
            console.error(error.message);
            throw new Error(error.message);
        }
    }
};

export const loginUser = async (email, password) => {
    try {
        // Iniciar sesión con correo electrónico y contraseña
        const userCredential = await signInWithEmailAndPassword(auth,email, password);
        return userCredential.user;

    } catch (error) {
        if (error.code === 'auth/user-not-found') {
            console.error('Correo no encontrado');
            throw new Error(error.message);
            
            
        } else if (error.code === 'auth/wrong-password') {
            console.error('Contraseña incorrecta');
            throw new Error(error.message);
            

        } else {
            console.error('Error al iniciar sesión:', error.message);
            throw new Error(error.message);
            
        }
    }
};

export const RecoveryPassword = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        return "Correo enviado con éxito.";
    } catch (error) {
        console.error("Error al recuperar contraseña:", error.message);
        throw new Error(error.message);
    }
};


export const logoutUser = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        throw new Error(error.message);
    }
};
