import express from 'express';
import cors from 'cors';
import pool from './src/database/dbconfig.js';

const app = express();

app.use(cors());
app.use(express.json());

app.listen(3000, () => {
  console.log("¡Servidor encendido en el puerto 3000!");
});

app.get("/home", (req, res) => {
  res.send("Hello World Express Js");
});

app.get('/posts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM posts');
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener posts:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/posts', async (req, res) => {
  const { titulo, img, descripcion } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, 0) RETURNING *',
      [titulo, img, descripcion]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error al agregar post:", err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/posts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM posts WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al eliminar post:", err);
    res.status(500).json({ error: err.message });
  }
});


app.put('/posts/like/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al actualizar likes:", err);
    res.status(500).json({ error: err.message });
  }
});
