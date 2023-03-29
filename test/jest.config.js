const { resolve } = require('path');
const root = resolve(__dirname, '..');
const rootConfig = require(`${root}/jest.config.js`);

/*
  setupFilesAfterEnv: Arquivo que roda antes dos testes
    - setup de database,
    - setup do servidor
*/
module.exports = {...rootConfig, ...{
  rootDir: root,
  displayName: 'end2end-tests',
  setupFilesAfterEnv: ['<rootDir>/test/jest-setup.ts'],
  testMatch: ['<rootDir>/test/**/*.test.ts'],
}};