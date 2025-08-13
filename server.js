const express = require('express');
const mysqlx = require('@mysql/xdevapi');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
const PORT = 3000;

// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Carpeta pública
app.use(express.static(__dirname));

// Conexión MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Cambiar si usas otro usuario
    password: 'Silver117Crow10Shadow0496@', // Cambiar si tu MySQL tiene contraseña
    database: 'order_tap'
});

db.connect(err => {
    if (err) throw err;
    console.log('✅ Conectado a MySQL');
});

// Registro
app.post('/registro', (req, res) => {
    const { usuario, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    db.query('INSERT INTO usuarios (usuario, password) VALUES (?, ?)', 
        [usuario, hashedPassword], 
        (err) => {
            if (err) {
                console.error(err);
                return res.send('❌ Error al registrar usuario.');
            }
            console.log(`✅ Usuario registrado: ${usuario}`);
            res.redirect('/inicio_de_sesion.html');
        });
});

// Login
app.post('/login', (req, res) => {
    const { usuario, password } = req.body;

    db.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario], (err, results) => {
        if (err) throw err;

        if (results.length === 0) {
            return res.send('<h2>❌ Usuario no encontrado.</h2><a href="/inicio_de_sesion.html">Volver</a>');
        }

        const usuarioDB = results[0];
        const passwordValida = bcrypt.compareSync(password, usuarioDB.password);

        if (!passwordValida) {
            return res.send('<h2>❌ Contraseña incorrecta.</h2><a href="/inicio_de_sesion.html">Volver</a>');
        }

        console.log(`✅ Usuario inició sesión: ${usuarioDB.usuario}`);
        res.redirect('/inicio.html');
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
