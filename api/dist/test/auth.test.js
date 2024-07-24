"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
describe('POST /api/v1/auth/signup', () => {
    it('responds with a user and token', async () => {
        (0, supertest_1.default)(app_1.default)
            .get('/api/v1/auth/signup')
            .set('Accept', 'application/json')
            .send({
            name: 'Syed Muzamil',
            email: 'smmhd121@gmail.com',
            role: 'caregiver',
            password: 'testpassword',
            stage: 'pre-conception',
        })
            .expect('Content-Type', /json/)
            .expect(201)
            .then((response) => {
            expect(response.body).toHaveProperty('_id');
            expect(response.body).toHaveProperty('name');
            expect(response.body).toHaveProperty('email');
            expect(response.body).toHaveProperty('role');
            expect(response.body).toHaveProperty('stage');
            expect(response.body).toHaveProperty('tokens');
        });
    });
    it('responds with error', async () => {
        (0, supertest_1.default)(app_1.default)
            .get('/api/v1/auth/signup')
            .set('Accept', 'application/json')
            .send({
            name: 'Syed Muzamil',
            email: 'smmhd121@gmail.com',
            role: 'caregiver',
            password: 'testpassword',
            stage: 'pre-conception',
        })
            .expect('Content-Type', /json/)
            .expect(422)
            .then((response) => {
            expect(response.body).toHaveProperty('message');
        });
    });
});
//# sourceMappingURL=auth.test.js.map