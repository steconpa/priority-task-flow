import User from '../models/User.js';
import Role from '../models/Roles.js';
import bcrypt from 'bcrypt';

// Controlador para registrar un nuevo usuario
export const registerUser = async (req, res) => {
  try {
    // Obtener datos del formulario de registro
    const { name, email, password } = req.body;

    // Verificar si el correo electrónico ya está registrado
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
    }

    // Generar un hash de la contraseña
    const saltRounds = 10; // Número de rondas de sal (puedes ajustarlo)
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Consultar el rol predeterminado (por ejemplo, "user")
    const defaultRole = await Role.findOne({ roleName: 'user' });

    // Crear un nuevo usuario con el rol predeterminado "user"
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: defaultRole._id,
    });

    // Guardar el usuario en la base de datos
    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado con éxito.' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};
