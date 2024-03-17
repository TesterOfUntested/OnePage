const express = require('express');
const mysql = require('mysql');

const https = require('https');
const fs = require('fs');
const path = require('path');

const config = require('./databaseConfig.js');

const app = express();
const port = 443;

const keystorePath = path.join(__dirname, 'keystore.p12');

const httpsOptions = {
    pfx: fs.readFileSync(keystorePath),
    passphrase: 'password'
};

const pool = mysql.createPool({
    user: config.user,
    host: config.host,
    database: config.database,
    password: config.password,
    port: config.port,
    ssl: config.ssl
});

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Błąd połączenia z bazą danych:', err);
    } else {
        console.log('Połączenie z bazą danych MySQL udane.');
    }
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/posts', async (req, res) => {
    try {
        const queryResult = await queryDatabase('SELECT * FROM posts', []);
        res.json(queryResult);
    } catch (error) {
        console.error('Błąd podczas pobierania postów z bazy danych:', error);
        res.status(500).json({ error: 'Wystąpił błąd podczas pobierania postów z bazy danych.' });
    }
});

app.get('/tech_posts', async (req, res) => {
    try {
        const queryResult = await queryDatabase('SELECT * FROM tech_posts', []);
        res.json(queryResult);
    } catch (error) {
        console.error('Błąd podczas pobierania postów z bazy danych:', error);
        res.status(500).json({ error: 'Wystąpił błąd podczas pobierania postów z bazy danych.' });
    }
});

app.get('/post/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const sql = 'SELECT * FROM posts WHERE id = ?';

        const queryResult = await queryDatabase(sql, [postId]);

        res.json(queryResult);
    } catch (error) {
        console.error('Błąd podczas pobierania postu z bazy danych:', error);
        res.status(500).json({ error: 'Wystąpił błąd podczas pobierania postu z bazy danych.' });
    }
});

app.get('/tech_post/:id', async (req, res) => {
    try {
        const postId = req.params.id;
        const sql = 'SELECT * FROM tech_posts WHERE id = ?';

        const queryResult = await queryDatabase(sql, [postId]);

        res.json(queryResult);
    } catch (error) {
        console.error('Błąd podczas pobierania postu z bazy danych:', error);
        res.status(500).json({ error: 'Wystąpił błąd podczas pobierania postu z bazy danych.' });
    }
});


app.get('/config.json', (req, res) => {
    const configPath = path.join(__dirname, 'config.json');
    res.sendFile(configPath);
});

async function queryDatabase(sql, params) {
    try {
        const queryResult = await new Promise((resolve, reject) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                    return;
                }
                connection.query(sql, params, (error, results, fields) => {
                    connection.release();
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve(results);
                });
            });
        });
        return queryResult;
    } catch (error) {
        throw error;
    }
}

https.createServer(httpsOptions, app).listen(port, () => {
    console.log(`Serwer działa pod adresem https://localhost:${port}`);
});
