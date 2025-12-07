export declare const config: {
    port: string | number;
    nodeEnv: string;
    database: {
        connectionString: string | undefined;
        host: string;
        port: number;
        user: string;
        password: string;
        database: string;
        ssl: {
            rejectUnauthorized: boolean;
        } | undefined;
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
    bcrypt: {
        saltRounds: number;
    };
};
//# sourceMappingURL=index.d.ts.map