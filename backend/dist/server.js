"use strict";
// backend/src/server.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const typeorm_1 = require("typeorm");
const applicationRoutes_1 = __importDefault(require("./routes/applicationRoutes"));
const PORT = process.env.PORT || 3000;
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.config();
        this.routes();
        this.database();
        this.start();
    }
    config() {
        // Middleware
        this.app.use((0, cors_1.default)());
        this.app.use(body_parser_1.default.json());
        this.app.use(body_parser_1.default.urlencoded({ extended: true }));
    }
    routes() {
        // Initialize routes
        this.app.use('/api/applications', applicationRoutes_1.default);
        // Default route
        this.app.get('/', (req, res) => {
            res.send('Welcome to your application tracking API.');
        });
    }
    database() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, typeorm_1.createConnection)({
                    type: 'postgres',
                    host: 'localhost',
                    port: 5432,
                    username: 'your_username',
                    password: 'your_password',
                    database: 'your_database_name',
                    synchronize: true, // Set to false in production
                    logging: true,
                    entities: [__dirname + '/models/*.js'], // Adjust based on your models
                });
                console.log('Connected to PostgreSQL');
            }
            catch (error) {
                console.error('Connection to PostgreSQL failed:', error);
            }
        });
    }
    start() {
        this.app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    }
}
new Server();
