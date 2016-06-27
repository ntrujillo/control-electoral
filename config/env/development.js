module.exports = {
    db: 'mongodb://localhost/control-electoral3',
    sessionSecret: 'adminControlElectoral987654321',
    sequelize: {
        db: {
            name: process.env.DB_NAME || "seanjs_dev",
            host: process.env.DB_HOST || "localhost",
            port: process.env.DB_PORT || 5432,
            username: process.env.DB_USERNAME || "postgres",
            password: process.env.DB_PASSWORD || "alcivar1703",
            dialect: process.env.DB_DIALECT || "postgres", //mysql, postgres, sqlite3,...
            enableSequelizeLog: process.env.DB_LOG || false,
            ssl: process.env.DB_SSL || false,
            sync: process.env.DB_SYNC || true //Synchronizing any model changes with database
        }
    }

};