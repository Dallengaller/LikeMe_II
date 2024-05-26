import pool from './dbconfig.js';

pool.query('SELECT version()', (err, res) => {
  if (err) {
    console.error('Error al ejecutar la consulta:', err);
  } else {
    console.log('Versión del servidor PostgreSQL:', res.rows[0].version);
  }
  
  pool.end();
});
