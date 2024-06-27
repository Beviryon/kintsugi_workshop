const express = require('express');
const app = express();
const mysql2 = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt'); 

app.use(express.json());
app.use(cors());

const db = mysql2.createPool({
    connectionLimit: 10, 
    user: 'root',
    host: 'localhost',
    password: 'root',
    database: 'bd_ul'
});

app.listen(3002, () => {
    console.log('Serveur connecté !');
});



app.post('/register', (req, res) => {
    const sentEmail = req.body.Email;
    const sentUsername = req.body.Username;
    const sentPassword = req.body.Password;

    // Hacher le mot de passe avec bcrypt
    bcrypt.hash(sentPassword, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Erreur lors du hachage du mot de passe:', err);
            res.status(500).send({ error: err.message });
            return;
        }

        // Vérifier si l'email existe déjà
        const checkEmailSQL = 'SELECT * FROM users WHERE email = ?';
        db.query(checkEmailSQL, [sentEmail], (err, results) => {
            if (err) {
                console.error('Erreur lors de la vérification de l\'email:', err);
                res.status(500).send({ error: err.message });
                return;
            }

            if (results.length > 0) {
                res.status(400).send({ message: 'Cette adresse e-mail est déjà utilisée.' });
            } else {
                // L'email n'existe pas encore
                const insertUserSQL = 'INSERT INTO users (email, username, password) VALUES (?,?,?)';
                const values = [sentEmail, sentUsername, hashedPassword]; // Utilisez le mot de passe haché
                db.query(insertUserSQL, values, (err, results) => {
                    if (err) {
                        console.error('Erreur lors de l\'ajout de l\'utilisateur:', err);
                        res.status(500).send({ error: err.message });
                    } else {
                        console.log('Utilisateur ajouté avec succès!');
                        res.status(200).send({ message: 'Utilisateur ajouté avec succès' });
                        emailService.sendWelcomeEmail(sentEmail);
                    }
                });
            }
        });
    });
});

app.post('/login', (req, res) => {
    const loginUsername = req.body.Username;
    const loginPassword = req.body.Password;

    const SQL = 'SELECT * FROM users WHERE username = ?';

    db.query(SQL, [loginUsername], (err, results) => {
        if (err) {
            res.status(500).send({ error: err.message });
            return;
        }

        if (results.length > 0) {
            const user = results[0];
            // Vérifier le mot de passe haché avec bcrypt
            bcrypt.compare(loginPassword, user.password, (err, passwordMatch) => {
                if (err) {
                    res.status(500).send({ error: err.message });
                    return;
                }
                if (passwordMatch) {
                    res.send(results);
                } else {
                    res.status(404).send({ message: 'Mot de passe incorrect' });
                }
            });
        } else {
            res.status(404).send({ message: 'Vous n\'avez pas de compte' });
        }
    });
});
