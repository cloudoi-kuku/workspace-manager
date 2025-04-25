import { buildConfig } from 'payload/config';
import path from 'path';
import Users from './collections/Users';
import Workspaces from './collections/Workspaces';
import Projects from './collections/Projects';
import Tasks from './collections/Tasks';
import Media from './collections/Media';
import sessionTrackingPlugin from './plugins/sessionTracking';

export default buildConfig({
  serverURL: process.env.SERVER_URL || 'http://localhost:3000',
  admin: {
    user: Users.slug,
  },
  collections: [
    Users,
    Workspaces,
    Projects,
    Tasks,
    Media,
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  db: {
    type: 'postgres',
    url: process.env.POSTGRES_URI,
  },
  cors: ['http://localhost:3000', 'http://localhost:3001'],
  csrf: ['http://localhost:3000', 'http://localhost:3001'],
  debug: process.env.NODE_ENV === 'development',
  cookiePrefix: 'workspace-manager',
  plugins: [sessionTrackingPlugin],
});
