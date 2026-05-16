import snowflake from "snowflake-sdk";

/** Connection options pulled from environment (see .env.example). */
export interface SnowflakeEnvConfig {
  account: string;
  username: string;
  password: string;
  warehouse: string;
  database: string;
  schema: string;
}

function getSnowflakeConfig(): SnowflakeEnvConfig {
  return {
    account: process.env.SNOWFLAKE_ACCOUNT ?? "",
    username: process.env.SNOWFLAKE_USERNAME ?? "",
    password: process.env.SNOWFLAKE_PASSWORD ?? "",
    warehouse: process.env.SNOWFLAKE_WAREHOUSE ?? "",
    database: process.env.SNOWFLAKE_DATABASE ?? "",
    schema: process.env.SNOWFLAKE_SCHEMA ?? "",
  };
}

/**
 * Creates a Snowflake connection (stub-ready).
 * Call connect() on the returned connection when you need to run queries.
 */
export function createSnowflakeConnection() {
  const config = getSnowflakeConfig();

  console.log(
    "[Snowflake] Connection stub — account:",
    config.account || "(not set)"
  );

  return snowflake.createConnection({
    account: config.account,
    username: config.username,
    password: config.password,
    warehouse: config.warehouse,
    database: config.database,
    schema: config.schema,
  });
}

/**
 * Runs a single SQL statement and resolves with rows (promise wrapper for hackathon speed).
 */
export function executeQuery<T = unknown>(
  sqlText: string,
  binds: snowflake.Binds = []
): Promise<T[]> {
  const connection = createSnowflakeConnection();

  return new Promise((resolve, reject) => {
    connection.connect((connectErr) => {
      if (connectErr) {
        reject(connectErr);
        return;
      }

      connection.execute({
        sqlText,
        binds,
        complete: (err, _stmt, rows) => {
          connection.destroy((destroyErr) => {
            if (destroyErr) console.warn("[Snowflake] destroy:", destroyErr);
          });
          if (err) reject(err);
          else resolve((rows ?? []) as T[]);
        },
      });
    });
  });
}
