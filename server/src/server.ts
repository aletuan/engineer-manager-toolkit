import app from './app';
import { config } from './shared/config';

// Start server
app.listen(config.port, () => {
  console.log(`REST API Server ready at http://localhost:${config.port}`);
  console.log(`API Documentation available at http://localhost:${config.port}/api-docs`);
}); 