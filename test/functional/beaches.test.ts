describe('Beaches functional tests', () => {
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
  });
});
