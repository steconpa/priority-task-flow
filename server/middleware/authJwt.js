import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { getDefaultRole } from '../utils/userHelpers.js';

export const verifyToken = async (req, res, next) => {
  try {
    // Verifica si el token existe
    if (!req.headers.authorization) {
      return res.status(403).json({ message: 'No se proporcionó un token de acceso.' });
    }

    // Extrae el token de la cabecera de autorización
    const token = req.headers.authorization.split(' ')[1];

    // Verifica si el token es válido
    const decodedToken = jwt.verify(token, process.env.tokenSecret);

    // Verifica si el usuario existe
    const user = await User.findById(decodedToken.userId);

    if (!user) {
      return res.status(401).json({ message: 'El usuario ya no existe.' });
    }

    // Verifica si el rol del usuario es "user"
    const defaultRole = await getDefaultRole();

    if (user.role.toString() !== defaultRole._id.toString()) {
      return res.status(403).json({ message: 'Acceso no autorizado.' });
    }

    // Agrega el id del usuario a la solicitud
    req.userId = user._id;

    next();
  } catch (error) {
    console.error('Error al verificar el token:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};