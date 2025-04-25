import { Plugin } from 'payload/config';
import { CollectionConfig } from 'payload/types';

// Define the Session model to keep track of user work sessions
const Sessions: CollectionConfig = {
  slug: 'sessions',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['user', 'startedAt', 'lastActive', 'status'],
  },
  access: {
    read: ({ req }) => {
      if (req.user && req.user.role === 'admin') return true;
      return {
        user: {
          equals: req.user?.id,
        },
      };
    },
    update: ({ req }) => {
      if (req.user && req.user.role === 'admin') return true;
      return {
        user: {
          equals: req.user?.id,
        },
      };
    },
    delete: ({ req }) => {
      if (req.user && req.user.role === 'admin') return true;
      return {
        user: {
          equals: req.user?.id,
        },
      };
    },
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'workspace',
      type: 'relationship',
      relationTo: 'workspaces',
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
    },
    {
      name: 'task',
      type: 'relationship',
      relationTo: 'tasks',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'Active',
          value: 'active',
        },
        {
          label: 'Paused',
          value: 'paused',
        },
        {
          label: 'Completed',
          value: 'completed',
        },
      ],
      defaultValue: 'active',
      required: true,
    },
    {
      name: 'notes',
      type: 'richText',
    },
    {
      name: 'startedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'lastActive',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'completedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'durationMinutes',
      type: 'number',
      min: 0,
    },
    {
      name: 'context',
      type: 'json',
      admin: {
        description: 'Saved state and context to resume work from',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        const now = new Date();
        
        if (operation === 'create') {
          data.startedAt = now;
          if (req.user) {
            data.user = req.user.id;
          }
        }
        
        data.lastActive = now;
        
        // Auto-update completedAt based on status
        if (data.status === 'completed' && !data.completedAt) {
          data.completedAt = now;
          
          // Calculate duration if session is completed
          if (data.startedAt) {
            const startTime = new Date(data.startedAt).getTime();
            const endTime = now.getTime();
            data.durationMinutes = Math.round((endTime - startTime) / 60000); // Convert ms to minutes
          }
        }
        
        return data;
      },
    ],
  },
};

// Define a custom endpoint to save ongoing work state
const saveState = async (req, res, next) => {
  const payload = req.payload;
  const { sessionId, context } = req.body;
  
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    // Validate that the session exists and belongs to the user
    const session = await payload.findByID({
      collection: 'sessions',
      id: sessionId,
    });
    
    if (!session || session.user.id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    // Update the session with the new context
    await payload.update({
      collection: 'sessions',
      id: sessionId,
      data: {
        context,
        lastActive: new Date(),
      },
    });
    
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Define the session tracking plugin
const sessionTrackingPlugin: Plugin = {
  collections: [Sessions],
  endpoints: [
    {
      path: '/api/session-tracking/save-state',
      method: 'post',
      handler: saveState,
    },
  ],
};

export default sessionTrackingPlugin;
