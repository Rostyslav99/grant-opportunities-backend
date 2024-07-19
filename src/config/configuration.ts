import { databaseConfig } from './database.config';

export default () => ({
  database: {
    ...databaseConfig,
  },
});
