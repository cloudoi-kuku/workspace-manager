import { CollectionConfig } from 'payload/types';

const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: ({ req }) => {
      if (req.user && req.user.role === 'admin') return true;
      return {
        or: [
          {
            'assignees.user': {
              equals: req.user?.id,
            },
          },
          {
            workspace: {
              'members.user': {
                equals: req.user?.id,
              },
            },
          },
        ],
      };
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'workspace',
      type: 'relationship',
      relationTo: 'workspaces',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'Planning',
          value: 'planning',
        },
        {
          label: 'In Progress',
          value: 'in-progress',
        },
        {
          label: 'On Hold',
          value: 'on-hold',
        },
        {
          label: 'Completed',
          value: 'completed',
        },
        {
          label: 'Cancelled',
          value: 'cancelled',
        },
      ],
      defaultValue: 'planning',
      required: true,
    },
    {
      name: 'priority',
      type: 'select',
      options: [
        {
          label: 'Low',
          value: 'low',
        },
        {
          label: 'Medium',
          value: 'medium',
        },
        {
          label: 'High',
          value: 'high',
        },
        {
          label: 'Urgent',
          value: 'urgent',
        },
      ],
      defaultValue: 'medium',
      required: true,
    },
    {
      name: 'startDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'dueDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'assignees',
      type: 'array',
      fields: [
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
        {
          name: 'role',
          type: 'select',
          options: [
            {
              label: 'Lead',
              value: 'lead',
            },
            {
              label: 'Contributor',
              value: 'contributor',
            },
            {
              label: 'Reviewer',
              value: 'reviewer',
            },
            {
              label: 'Observer',
              value: 'observer',
            },
          ],
          defaultValue: 'contributor',
          required: true,
        },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'progress',
      type: 'number',
      min: 0,
      max: 100,
      defaultValue: 0,
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'createdAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
        readOnly: true,
      },
    },
    {
      name: 'lastUpdated',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        const now = new Date();
        
        if (!data.createdAt) {
          data.createdAt = now;
          if (req.user) {
            data.createdBy = req.user.id;
          }
        }
        
        data.lastUpdated = now;
        
        return data;
      },
    ],
  },
};

export default Projects;
