import app from './app';
import { config } from './shared/config';

const startServer = () => {
  try {
    app.listen(config.port, () => {
      console.log(
        `Server is running on port ${config.port} in ${config.nodeEnv} mode`
      );
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 