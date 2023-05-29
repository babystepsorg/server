import request from 'supertest'

import app from '../src/app'

describe('POST /api/v1/auth/signup', () => {
  it('responds with a user and token', async () => {
    request(app)
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
        expect(response.body).toHaveProperty('_id')
        expect(response.body).toHaveProperty('name')
        expect(response.body).toHaveProperty('email')
        expect(response.body).toHaveProperty('role')
        expect(response.body).toHaveProperty('stage')
        expect(response.body).toHaveProperty('tokens')
      })
  })
})
