type Config = {
    app: {
        port: number;
    },
    db: {
        host: string;
        port: number;
        name: string;
    }
}

export const config: Config = {
    app: {
        port: 3000,
    },
    db: {
        host: 'localhost',
        port: 27017,
        name: 'test'
    }
}