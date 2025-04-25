import { Request, Response, NextFunction } from 'express';
import payload from 'payload';

const ACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutes in milliseconds

export const trackActivity = async (req: Request, res: Response, next: NextFunction) => {
  // Only track activity for authenticated users
  if (req.user) {
    try {
      const now = new Date();
      const userId = req.user.id;
      
      // Update the user's lastActive field
      await payload.update({
        collection: 'users',
        id: userId,
        data: {
          lastActive: now,
        },
      });
      
      // Look for any active session for this user
      const sessions = await payload.find({
        collection: 'sessions',
        where: {
          and: [
            {
              user: {
                equals: userId,
              },
            },
            {
              status: {
                equals: 'active',
              },
            },
          ],
        },
        limit: 1,
      });
      
      if (sessions.docs.length > 0) {
        const session = sessions.docs[0];
        
        // Update the last active time for the session
        await payload.update({
          collection: 'sessions',
          id: session.id,
          data: {
            lastActive: now,
          },
        });
        
        // If the session has been inactive for too long, mark it as paused
        const lastActive = new Date(session.lastActive);
        const timeSinceLastActive = now.getTime() - lastActive.getTime();
        
        if (timeSinceLastActive > ACTIVITY_TIMEOUT) {
          await payload.update({
            collection: 'sessions',
            id: session.id,
            data: {
              status: 'paused',
            },
          });
        }
      }
    } catch (error) {
      console.error('Error tracking user activity:', error);
      // Don't block the request if activity tracking fails
    }
  }
  
  next();
};

export default trackActivity;
