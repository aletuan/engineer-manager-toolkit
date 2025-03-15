import app from './app';
import { config } from './shared/config';

const startServer = () => {
  try {
    app.listen(config.server.port, () => {
      console.log(
        `Server is running on port ${config.server.port} in ${config.server.nodeEnv} mode`
      );
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 