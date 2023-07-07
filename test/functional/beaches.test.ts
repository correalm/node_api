import { Beach } from 'src/models/beach';

describe('Beaches functional tests', () => {
  beforeAll(async () => await Beach.deleteMany({}))

  describe('When create a beach', () => {
    test('create a beach with success', async () => {
      const beach = {
        lat: -11.11,
        lng: 12.12,
        name: 'Cassino',
        position: 'E',
      };

      const response = await global.testRequest.post('/beaches').send(beach);

      expect(response.status).toBe(201);

      // expect.objectContaining(beach) -> importante para testar só as chaves e valores que quero. Outros que venham não interessam no teste.
      expect(response.body).toEqual(expect.objectContaining(beach));
    });

    test('return 422 when there is a validation error', async () => {
      const beach = {
        lat: 'invalid lat',
        lng: 12.12,
        name: 'Cassino',
        position: 'E',
      };

      const response = await global.testRequest.post('/beaches').send(beach);

      expect(response.status).toBe(422);

      expect(response.body).toEqual({
        error: 'Beach validation failed: lat: Cast to Number failed for value "invalid lat" (type string) at path "lat"'
      });
    })

    test.skip('return 500 when there is any error other than validation error', async () => {
      // todo
    })
  });
});
