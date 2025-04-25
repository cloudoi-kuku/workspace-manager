import express from 'express';
import payload from 'payload';
import path from 'path';
import { config } from 'dotenv';
import cors from 'cors';
import { trackActivity } from './middleware/trackActivity';

// Load environment variables
config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configure static serving of admin panel
app.use('/assets', express.static(path.resolve(__dirname, '../assets')));

// Initialize Payload
const start = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET || 'your-secret-key-here',
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
  });

  // Register activity tracking middleware after Payload initialization
  // This ensures req.user is populated by Payload auth
  app.use(trackActivity);
  
  // Add your own express routes here if needed
  app.get('/', (req, res) => {
    res.redirect('/admin');
  });
  
  // API endpoint to resume a session
  app.get('/api/resume-session/:id', async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
      const session = await payload.findByID({
        collection: 'sessions',
        id: req.params.id,
      });
      
      if (!session || session.user.id !== req.user.id) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      
      // Update session status to active if it was paused
      if (session.status === 'paused') {
        await payload.update({
          collection: 'sessions',
          id: req.params.id,
          data: {
            status: 'active',
            lastActive: new Date(),
          },
        });
      }
      
      return res.json(session);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });

  // Start the server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, async () => {
    payload.logger.info(`Server started on port ${PORT}`);
  });
};

start();
