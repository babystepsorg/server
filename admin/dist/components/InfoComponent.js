"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var react_router_dom_1 = require("react-router-dom");
var StepNav_1 = require("payload/dist/admin/components/elements/StepNav");
var InfoComponent = function () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var _j = (0, StepNav_1.useStepNav)(), setStepNav = _j.setStepNav, stepNav = _j.stepNav;
    var location = (0, react_router_dom_1.useLocation)();
    var _k = (0, react_1.useState)({}), data = _k[0], setData = _k[1];
    var _l = (0, react_1.useState)(false), loading = _l[0], setLoading = _l[1];
    // This effect will only run one time and will allow us
    // to set the step nav to display our custom route name
    (0, react_1.useEffect)(function () {
        setStepNav(__spreadArray(__spreadArray([], stepNav, true), [
            {
                label: 'Info',
            },
        ], false));
    }, [setStepNav]);
    (0, react_1.useEffect)(function () {
        setLoading(true);
        var fetchData = function () { return __awaiter(void 0, void 0, void 0, function () {
            var paths, id, res, json;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        paths = location.pathname.split("/");
                        paths.pop();
                        id = paths.pop();
                        return [4 /*yield*/, fetch("/week-info/".concat(id))];
                    case 1:
                        res = _a.sent();
                        return [4 /*yield*/, res.json()];
                    case 2:
                        json = _a.sent();
                        setData(json);
                        setLoading(false);
                        return [2 /*return*/];
                }
            });
        }); };
        fetchData();
    }, [location]);
    return (react_1.default.createElement(react_1.Fragment, null,
        react_1.default.createElement("div", { style: {
                marginTop: 'calc(var(--base) * 2)',
                paddingLeft: 'var(--gutter-h)',
                paddingRight: 'var(--gutter-h)',
            } },
            react_1.default.createElement("h1", { id: "custom-view-title" }, "Info"),
            loading ? (react_1.default.createElement("p", null, "Loading...")) : (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement("h2", null, "Symptoms"),
                react_1.default.createElement("ul", null, (_b = (_a = data === null || data === void 0 ? void 0 : data.symptoms) === null || _a === void 0 ? void 0 : _a.docs) === null || _b === void 0 ? void 0 : _b.map(function (doc) { return (react_1.default.createElement("li", null, doc.name)); })),
                react_1.default.createElement("div", { style: { marginTop: '1rem' } },
                    react_1.default.createElement("h2", null, "Content"),
                    react_1.default.createElement("ul", null, (_d = (_c = data === null || data === void 0 ? void 0 : data.content) === null || _c === void 0 ? void 0 : _c.docs) === null || _d === void 0 ? void 0 : _d.map(function (doc) { return (react_1.default.createElement("li", null, doc.title)); }))),
                react_1.default.createElement("div", { style: { marginTop: '1rem' } },
                    react_1.default.createElement("h2", null, "Products"),
                    react_1.default.createElement("ul", null, (_f = (_e = data === null || data === void 0 ? void 0 : data.products) === null || _e === void 0 ? void 0 : _e.docs) === null || _f === void 0 ? void 0 : _f.map(function (doc) { return (react_1.default.createElement("li", null, doc.name)); }))),
                react_1.default.createElement("div", { style: { marginTop: '1rem' } },
                    react_1.default.createElement("h2", null, "Todos"),
                    react_1.default.createElement("ul", null, (_h = (_g = data === null || data === void 0 ? void 0 : data.todos) === null || _g === void 0 ? void 0 : _g.docs) === null || _h === void 0 ? void 0 : _h.map(function (doc) { return (react_1.default.createElement("li", null, doc.title)); }))))))));
};
exports.default = InfoComponent;
