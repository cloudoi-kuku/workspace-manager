import { CollectionConfig } from 'payload/types';

const Tasks: CollectionConfig = {
  slug: 'tasks',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'assignee', 'dueDate'],
  },
  access: {
    read: ({ req }) => {
      if (req.user && req.user.role === 'admin') return true;
      return {
        or: [
          {
            assignee: {
              equals: req.user?.id,
            },
          },
          {
            'project.workspace': {
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
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      required: true,
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'tasks',
      filterOptions: ({ id }) => {
        if (!id) return true;
        return {
          id: {
            not_equals: id,
          },
        };
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'To Do',
          value: 'to-do',
        },
        {
          label: 'In Progress',
          value: 'in-progress',
        },
        {
          label: 'In Review',
          value: 'in-review',
        },
        {
          label: 'Blocked',
          value: 'blocked',
        },
        {
          label: 'Completed',
          value: 'completed',
        },
      ],
      defaultValue: 'to-do',
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
      name: 'assignee',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'estimatedHours',
      type: 'number',
      min: 0,
    },
    {
      name: 'actualHours',
      type: 'number',
      min: 0,
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
      name: 'completedDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
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
      name: 'dependencies',
      type: 'array',
      fields: [
        {
          name: 'task',
          type: 'relationship',
          relationTo: 'tasks',
          required: true,
          filterOptions: ({ id }) => {
            if (!id) return true;
            return {
              id: {
                not_equals: id,
              },
            };
          },
        },
        {
          name: 'type',
          type: 'select',
          options: [
            {
              label: 'Finish to Start',
              value: 'finish-to-start',
            },
            {
              label: 'Start to Start',
              value: 'start-to-start',
            },
            {
              label: 'Finish to Finish',
              value: 'finish-to-finish',
            },
            {
              label: 'Start to Finish',
              value: 'start-to-finish',
            },
          ],
          defaultValue: 'finish-to-start',
          required: true,
        },
      ],
    },
    {
      name: 'attachments',
      type: 'array',
      fields: [
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
        },
      ],
    },
    {
      name: 'comments',
      type: 'array',
      fields: [
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
        {
          name: 'content',
          type: 'richText',
          required: true,
        },
        {
          name: 'createdAt',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
            readOnly: true,
          },
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
      ({ data, req, operation }) => {
        const now = new Date();
        
        if (operation === 'create') {
          data.createdAt = now;
          if (req.user) {
            data.createdBy = req.user.id;
          }
        }
        
        data.lastUpdated = now;
        
        // Auto-update completedDate based on status
        if (data.status === 'completed' && !data.completedDate) {
          data.completedDate = now;
        } else if (data.status !== 'completed') {
          data.completedDate = null;
        }
        
        return data;
      },
    ],
  },
};

export default Tasks;
