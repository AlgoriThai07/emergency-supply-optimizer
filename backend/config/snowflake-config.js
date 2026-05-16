/**
 * Snowflake connection stub
 * Builds a connection config from env; connect on demand via getSnowflakeConnection().
 */
import snowflake from 'snowflake-sdk';

const {
  SNOWFLAKE_ACCOUNT,
  SNOWFLAKE_USERNAME,
  SNOWFLAKE_PASSWORD,
  SNOWFLAKE_WAREHOUSE,
  SNOWFLAKE_DATABASE,
  SNOWFLAKE_SCHEMA,
} = process.env;

/**
 * Connection options derived from environment (no network call until .connect()).
 */
export function getSnowflakeConfig() {
  return {
    account: SNOWFLAKE_ACCOUNT,
    username: SNOWFLAKE_USERNAME,
    password: SNOWFLAKE_PASSWORD,
    warehouse: SNOWFLAKE_WAREHOUSE,
    database: SNOWFLAKE_DATABASE,
    schema: SNOWFLAKE_SCHEMA,
  };
}

/**
 * Returns true when all required Snowflake env vars are present.
 */
export function isSnowflakeConfigured() {
  return Boolean(
    SNOWFLAKE_ACCOUNT &&
      SNOWFLAKE_USERNAME &&
      SNOWFLAKE_PASSWORD &&
      SNOWFLAKE_WAREHOUSE &&
      SNOWFLAKE_DATABASE &&
      SNOWFLAKE_SCHEMA
  );
}

/**
 * Create a Snowflake SDK connection (stub — call connect() when you need a query).
 * @returns {import('snowflake-sdk').Connection | null}
 */
export function getSnowflakeConnection() {
  if (!isSnowflakeConfigured()) {
    console.log(
      '[Snowflake] Stub mode — set SNOWFLAKE_* in .env to enable warehouse queries.'
    );
    return null;
  }

  console.log('[Snowflake] Connection stub created (not connected yet).');
  return snowflake.createConnection(getSnowflakeConfig());
}

/**
 * Promise wrapper around connection.connect() for async route handlers.
 * @param {import('snowflake-sdk').Connection} connection
 */
export function connectSnowflake(connection) {
  return new Promise((resolve, reject) => {
    connection.connect((err, conn) => {
      if (err) reject(err);
      else resolve(conn);
    });
  });
}

export default snowflake;
