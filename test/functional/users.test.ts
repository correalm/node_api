import { User } from 'src/models/user';

describe('Users functional tests', () => {
  beforeEach(() => User.deleteMany({}))

  describe('When create a new user', () => {
    test('should successfully create a new user', async () => {
      const newUser = {
        name: 'John Doe',
        email: 'john@doe.com',
        password: '1234'
      }

      const response = await global.testRequest.post('/users').send(newUser)

      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining(newUser));
    })
  })
});