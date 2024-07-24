"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var payload_1 = __importDefault(require("payload"));
var models_1 = require("./models");
var fileUpload_1 = __importDefault(require("./utils/fileUpload"));
var cors_1 = __importDefault(require("cors"));
var morgan_1 = __importDefault(require("morgan"));
var sendEmail_1 = require("./utils/sendEmail");
require('dotenv').config();
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, morgan_1.default)('combined'));
// Cors
app.use((0, cors_1.default)({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST',
}));
// Redirect root to Admin panel
app.get('/', function (_, res) {
    res.redirect('/admin');
});
// Adding email to waitlist
app.post('/api/waitlist', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var checkEmail, result, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, models_1.Waitlist.findOne({ email: req.body.email })];
            case 1:
                checkEmail = _a.sent();
                if (checkEmail) {
                    return [2 /*return*/, res.status(200).send(checkEmail)];
                }
                result = new models_1.Waitlist({ email: req.body.email });
                return [4 /*yield*/, result.save()];
            case 2:
                _a.sent();
                res.status(200).send(result);
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                res.status(500).send(err_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Applying for a career
app.post('/api/careers', fileUpload_1.default.single('resume'), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var request, resume_location, resume_link, result, err_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                request = req;
                resume_location = request.file.location.split('/');
                resume_link = 'https://admin.babysteps.world/media/' + resume_location.pop();
                result = new models_1.Career({
                    full_name: req.body.full_name,
                    email: req.body.email,
                    phone_number: req.body.phone,
                    linkedin_url: req.body.linkedin_url,
                    resume_link: resume_link,
                    cover_letter: req.body.cover_letter,
                    portfolio_link: (_a = req.body.portfolio_link) !== null && _a !== void 0 ? _a : '',
                    job: req.body.job,
                });
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, result.save()];
            case 2:
                _b.sent();
                (0, sendEmail_1.sendMail)("".concat(req.body.full_name, " applied for ").concat(req.body.job, " on Careers page"), "\n      <p>A new job application has been submitted for the role of ".concat(req.body.job, ". Please find the details of the applicant below.</p>\n      <br />\n\n      Full Name: <strong>").concat(req.body.full_name, "</strong><br />\n      Email: <strong>").concat(req.body.email, "</strong><br />\n      Phone Number: <strong>").concat(req.body.phone, "</strong><br />\n      LinkedIn URL: <strong>").concat(req.body.linkedin_url, "</strong><br />\n      Resume Link: <strong>").concat(resume_link, "</strong><br />\n      Cover Letter: <strong>").concat(req.body.cover_letter, "</strong><br />\n      Portfolio Link: <strong>").concat(req.body.portfolio_link || 'Not provided', "</strong><br />\n      "));
                return [3 /*break*/, 4];
            case 3:
                err_2 = _b.sent();
                res.status(500).send(err_2);
                return [3 /*break*/, 4];
            case 4:
                res.status(200).send({});
                return [2 /*return*/];
        }
    });
}); });
var start = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // Initialize Payload
            return [4 /*yield*/, payload_1.default.init({
                    secret: process.env.PAYLOAD_SECRET,
                    express: app,
                    onInit: function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            payload_1.default.logger.info("Payload Admin URL: ".concat(payload_1.default.getAdminURL()));
                            return [2 /*return*/];
                        });
                    }); },
                })];
            case 1:
                // Initialize Payload
                _a.sent();
                app.get("/week-info/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, symptoms, products, content, todos, data, err_3;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                _b.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, Promise.all([
                                        payload_1.default.find({
                                            collection: 'symptoms',
                                            where: {
                                                weeks: {
                                                    in: [req.params.id]
                                                }
                                            }
                                        }),
                                        payload_1.default.find({
                                            collection: 'products',
                                            where: {
                                                weeks: {
                                                    in: [req.params.id]
                                                }
                                            }
                                        }),
                                        payload_1.default.find({
                                            collection: 'contents',
                                            where: {
                                                weeks: {
                                                    in: [req.params.id]
                                                }
                                            }
                                        }),
                                        payload_1.default.find({
                                            collection: 'todos',
                                            where: {
                                                week: {
                                                    in: [req.params.id]
                                                }
                                            }
                                        })
                                    ])];
                            case 1:
                                _a = _b.sent(), symptoms = _a[0], products = _a[1], content = _a[2], todos = _a[3];
                                data = { symptoms: symptoms, products: products, content: content, todos: todos };
                                res.status(200).json(data);
                                return [3 /*break*/, 3];
                            case 2:
                                err_3 = _b.sent();
                                res.status(500).json({ error: err_3.message });
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); });
                app.get("/change-collection", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                    var result, err_4;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, payload_1.default.db.connection.db.renameCollection('_content_versions', '_contents_versions')];
                            case 1:
                                result = _a.sent();
                                res.send(result);
                                return [3 /*break*/, 3];
                            case 2:
                                err_4 = _a.sent();
                                res.send(err_4);
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); });
                app.listen(process.env.PORT || 3000, function () { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        payload_1.default.logger.info("Server listening on port ".concat(process.env.PORT || 3000));
                        return [2 /*return*/];
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); };
start();
