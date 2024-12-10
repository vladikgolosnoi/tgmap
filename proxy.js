import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = 3000;

// Middleware для настройки CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Прокси-эндпоинт для запросов к Nominatim
app.get('/search', async (req, res) => {
    const { q, viewbox, limit } = req.query;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&bounded=1&viewbox=${viewbox}&limit=${limit}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Ошибка запроса к Nominatim:', error);
        res.status(500).json({ error: 'Ошибка запроса к Nominatim API' });
    }
});

// Прокси-эндпоинт для OSRM маршрутов
app.get('/route', async (req, res) => {
    const { start, end } = req.query;
    const url = `https://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full&geometries=geojson`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Ошибка запроса к OSRM:', error);
        res.status(500).json({ error: 'Ошибка запроса к OSRM API' });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Прокси-сервер запущен на http://localhost:${PORT}`);
});
