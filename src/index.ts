import express from 'express';
import path from 'path';

interface FavoritesProps {
  videoId: string;
  title: string;
  thumbnail: string;
}

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
  const { videoId, title, thumbnail }: FavoritesProps = req.body;
  favorites.push({ videoId, title, thumbnail });
  res.status(201).send('Added to favorites');
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
