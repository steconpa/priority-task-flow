import { User, Role } from '../models/index.js';
import bcrypt from 'bcrypt';

// Función para verificar si el correo electrónico ya está registrado
export const checkEmailExistence = async (email) => {
  return await User.findOne({ email });
};

// Función para generar un hash de contraseña
export const hashPassword = async (password) => {
  const saltRounds = 10; // Número de rondas de sal (puedes ajustarlo)
  return await bcrypt.hash(password, saltRounds);
};

// Función para obtener el rol predeterminado
export const getDefaultRole = async () => {
  return await Role.findOne({ roleName: 'user' });
};
