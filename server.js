const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Ustawienie katalogu, z którego będą serwowane pliki statyczne
app.use(express.static(path.join(__dirname, 'public')));

// Nasłuch na porcie 3000
app.listen(port, () => {
    console.log(`Serwer działa pod adresem http://localhost:${port}`);
});
