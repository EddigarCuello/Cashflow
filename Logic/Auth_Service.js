import { registerUser } from "../Data/Auth.js";
import { findUserBy } from "../Data/PersonaData.js";
import { loginUser, logoutUser } from "../Data/Auth.js";

export const registro = async (Persona) => {
  try {
    const user = await registerUser(Persona);
    console.log("Usuario registrado:", user);
  } catch (error) {
    const errorMessage = error.message || "Error durante el registro";
    console.error("Error en el registro:", errorMessage);
  }
};

export const login = async (email, password) => {
  try {
    // Autenticar al usuario
    const user = await loginUser(email, password);
    if (!user) {
      // Si el usuario no existe o las credenciales son incorrectas, lanzar un error o devolver null
      throw new Error("Credenciales incorrectas");
    }
    
    // Obtener los datos del usuario por email
    const userData = await findUserBy("email", email);
    if (userData) {
      
      console.log("Usuario ha iniciado sesión:", user);
      return userData;
    } else {
      console.error("Datos del usuario no encontrados.");
      return null;
    }
  } catch (error) {
    console.error("Error en el inicio de sesión:", error.message);
    return null;
  }
};

export const logout = async () => {
  try {
    await logoutUser();
    console.log("Usuario ha cerrado sesión");
  } catch (error) {
    console.error("Error en el cierre de sesión:", error.message);
  }
};
