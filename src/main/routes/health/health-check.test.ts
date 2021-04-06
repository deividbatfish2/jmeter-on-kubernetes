import app from '../../config/app'
import request from 'supertest'

describe('Health Check Routes', () => {
  describe('GET /api/health-check', () => {
    test('Should return 200 on success', async () => {
      await request(app)
        .get('/api/health-check')
        .expect(200)
    })
  })
})
