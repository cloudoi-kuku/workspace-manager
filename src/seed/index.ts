import payload from 'payload';
import path from 'path';
import { config } from 'dotenv';

// Load environment variables
config({ path: path.resolve(__dirname, '../../.env') });

const seed = async () => {
  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET || 'seed-secret-key',
    local: true,
    onInit: async () => {
      payload.logger.info('Seeding database...');
      
      // Create admin user
      const { id: adminId } = await payload.create({
        collection: 'users',
        data: {
          email: 'admin@example.com',
          password: 'password123',
          name: 'Admin User',
          role: 'admin',
        },
      });
      
      payload.logger.info(`Created admin user with ID: ${adminId}`);
      
      // Create regular user
      const { id: userId } = await payload.create({
        collection: 'users',
        data: {
          email: 'user@example.com',
          password: 'password123',
          name: 'Regular User',
          role: 'user',
        },
      });
      
      payload.logger.info(`Created regular user with ID: ${userId}`);
      
      // Create a workspace
      const { id: workspaceId } = await payload.create({
        collection: 'workspaces',
        data: {
          name: 'Sample Workspace',
          description: 'This is a sample workspace for demonstration purposes.',
          owner: adminId,
          members: [
            {
              user: adminId,
              role: 'owner',
            },
            {
              user: userId,
              role: 'member',
            },
          ],
          status: 'active',
        },
      });
      
      payload.logger.info(`Created workspace with ID: ${workspaceId}`);
      
      // Create a project
      const { id: projectId } = await payload.create({
        collection: 'projects',
        data: {
          name: 'Sample Project',
          description: 'This is a sample project for demonstration purposes.',
          workspace: workspaceId,
          status: 'in-progress',
          priority: 'medium',
          startDate: new Date(),
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          assignees: [
            {
              user: adminId,
              role: 'lead',
            },
            {
              user: userId,
              role: 'contributor',
            },
          ],
          tags: [
            { tag: 'sample' },
            { tag: 'demo' },
          ],
          progress: 25,
          createdBy: adminId,
        },
      });
      
      payload.logger.info(`Created project with ID: ${projectId}`);
      
      // Create some tasks
      const { id: task1Id } = await payload.create({
        collection: 'tasks',
        data: {
          title: 'Task 1: Research',
          description: 'Research and gather requirements for the project.',
          project: projectId,
          status: 'completed',
          priority: 'high',
          assignee: adminId,
          estimatedHours: 8,
          actualHours: 10,
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          completedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          tags: [
            { tag: 'research' },
          ],
          progress: 100,
          createdBy: adminId,
        },
      });
      
      payload.logger.info(`Created task with ID: ${task1Id}`);
      
      const { id: task2Id } = await payload.create({
        collection: 'tasks',
        data: {
          title: 'Task 2: Design',
          description: 'Create wireframes and design concepts.',
          project: projectId,
          status: 'in-progress',
          priority: 'medium',
          assignee: userId,
          estimatedHours: 16,
          actualHours: 8,
          startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
          tags: [
            { tag: 'design' },
          ],
          progress: 50,
          dependencies: [
            {
              task: task1Id,
              type: 'finish-to-start',
            },
          ],
          createdBy: adminId,
        },
      });
      
      payload.logger.info(`Created task with ID: ${task2Id}`);
      
      const { id: task3Id } = await payload.create({
        collection: 'tasks',
        data: {
          title: 'Task 3: Development',
          description: 'Implement the core features based on the design.',
          project: projectId,
          status: 'to-do',
          priority: 'medium',
          assignee: adminId,
          estimatedHours: 40,
          startDate: null,
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
          tags: [
            { tag: 'development' },
          ],
          progress: 0,
          dependencies: [
            {
              task: task2Id,
              type: 'finish-to-start',
            },
          ],
          createdBy: adminId,
        },
      });
      
      payload.logger.info(`Created task with ID: ${task3Id}`);
      
      // Create a session to demonstrate work tracking
      const { id: sessionId } = await payload.create({
        collection: 'sessions',
        data: {
          user: userId,
          workspace: workspaceId,
          project: projectId,
          task: task2Id,
          status: 'active',
          notes: 'Working on wireframes for the dashboard screen.',
          startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          lastActive: new Date(),
          context: {
            currentScreen: 'design',
            activeTool: 'wireframe',
            savedState: {
              currentFile: 'dashboard.sketch',
              progress: 65,
              pendingItems: ['navigation', 'user profile'],
              completedItems: ['login screen', 'home screen'],
            },
          },
        },
      });
      
      payload.logger.info(`Created session with ID: ${sessionId}`);
      
      payload.logger.info('Seed completed successfully!');
      process.exit(0);
    },
  });
};

seed().catch((error) => {
  payload.logger.error('Error seeding database:');
  payload.logger.error(error);
  process.exit(1);
});
