import models from '../src/models';

beforeAll(async () => {
  await models.sequelize.sync({ force: true });
});

afterAll(async () => {
  await models.sequelize.close();
});
