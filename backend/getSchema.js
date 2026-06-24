const getPool = require('./Configs/dbConfig');
const pool = getPool();

async function getSchema() {
    try {
        const res = await pool.query(`
            SELECT table_name, column_name, data_type 
            FROM information_schema.columns 
            WHERE table_schema = 'public'
            ORDER BY table_name;
        `);
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error("Error:", err);
    } finally {
        pool.end();
    }
}

getSchema();
