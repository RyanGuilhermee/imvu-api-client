import { SuperTest, Test } from 'supertest';

declare global {
  var globalRequest: SuperTest<Test>;
}
