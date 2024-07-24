"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const emojis_1 = __importDefault(require("./emojis"));
const auth_route_1 = __importDefault(require("./auth/auth.route"));
const todo_route_1 = __importDefault(require("./todos/todo.route"));
const user_route_1 = __importDefault(require("./users/user.route"));
const calander_route_1 = __importDefault(require("./calander/calander.route"));
const content_route_1 = __importDefault(require("./content/content.route"));
const symptom_route_1 = __importDefault(require("./symptom/symptom.route"));
const router = express_1.default.Router();
router.get('/', (req, res) => {
    res.json({
        message: 'API - 👋🌎🌍🌏',
    });
});
router.use('/emojis', emojis_1.default);
router.use('/auth', auth_route_1.default);
router.use('/todos', todo_route_1.default);
router.use('/users', user_route_1.default);
router.use('/calander', calander_route_1.default);
router.use('/content', content_route_1.default);
router.use('/symptoms', symptom_route_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map