import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { checkEmailExistence, getDefaultRole } from '../utils/userHelpers.js';

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Busca el usuario por su correo electrónico
    const user = await checkEmailExistence(email);

    // Verifica si el usuario existe
    if (!user) {
      return res.status(401).json({ message: 'El correo electrónico no esta registrado' });
    }

    // Compara la contraseña proporcionada con la contraseña almacenada en la base de datos
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    // Verifica que el rol del usuario sea "user"
    const defaultRole = await getDefaultRole();

    if (user.role.toString() !== defaultRole._id.toString()) {
      return res.status(403).json({ message: 'Acceso no autorizado.' });
    }

    // Genera un token de acceso
    const token = jwt.sign(
      {
        userId: user._id,
        userEmail: user.email
      },
      process.env.tokenSecret,
      {
        expiresIn: '10h'
      });

    // Devuelve el token como respuesta
    res.status(200).json({ token });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};
