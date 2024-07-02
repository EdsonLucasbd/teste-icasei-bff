import express from 'express';
import path from 'path';
import WebSocket from 'ws';
const wss = new WebSocket.Server({ port: 8080 });


interface FavoritesProps {
  videoId: string;
  title: string;
}

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

const app = express();
const port = 3000;

app.use(express.json());

app.use('/mf_drawer', express.static(path.join(__dirname, '../../mf_drawer')));
app.use('/mf_videos', express.static(path.join(__dirname, '../../mf_videos')));

let favorites: FavoritesProps[] = []

app.get('/mf_videos/videos.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../../mf_videos/src/videos.html'));
});

app.get('/mf_videos/favoritos.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../../mf_videos/src/favoritos.html'));
});

app.post('/mf_videos/add-favorite', (req, res) => {
  const { videoId, title }: FavoritesProps = req.body;
  favorites.push({ videoId, title });
  res.status(201).send('Added to favorites');
});

app.delete('/mf_videos/add-favorite', (req, res) => {
  const { videoId }: FavoritesProps = req.body;
  const newList = favorites.filter((favorites) => favorites.videoId !== videoId);
  favorites = newList;
  res.status(201).send('Removed from favorites');
});

app.get('/mf_videos/favorites', (req, res) => {
  res.json(favorites);
});

app.get('/', (req, res) => {
  res.send('BFF is running');
});

app.listen(port, () => {
  console.log(`BFF is running at http://localhost:${port}`);
});
