import { Pool } from 'pg';
import { env } from './env';

const host = env.USE_PUBLIC_DB ? env.PUBLIC_DB_HOST! : env.DB_HOST;
const port = env.USE_PUBLIC_DB ? env.PUBLIC_DB_PORT! : env.DB_PORT;

export const pool = new Pool({
  connectionString: `postgresql://${env.DB_USERNAME}:${env.DB_PASSWORD}@${host}:${port}/${env.DB_NAME}`
});

if (env.NODE_ENV !== 'production') {
  (async () => {
    try {
      const { rows } = await pool.query('SELECT NOW()');
      console.log('Postgres connected at', rows[0].now);
    } catch (err) {
      console.error('Postgres connection error', err);
      process.exit(1);
    }
  })();
}

pool.on('error', (err) => {
  console.error('Unexpected idle Postgres client error', err);
  process.exit(-1);
});
