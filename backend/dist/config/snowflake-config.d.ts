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
/**
 * Creates a Snowflake connection (stub-ready).
 * Call connect() on the returned connection when you need to run queries.
 */
export declare function createSnowflakeConnection(): snowflake.Connection;
/**
 * Runs a single SQL statement and resolves with rows (promise wrapper for hackathon speed).
 */
export declare function executeQuery<T = unknown>(sqlText: string, binds?: snowflake.Binds): Promise<T[]>;
//# sourceMappingURL=snowflake-config.d.ts.map