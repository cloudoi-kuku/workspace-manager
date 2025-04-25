import { CollectionConfig } from 'payload/types';

const Workspaces: CollectionConfig = {
  slug: 'workspaces',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
    update: ({ req }) => {
      if (req.user && req.user.role === 'admin') return true;
      return {
        'members.user': {
          equals: req.user?.id,
        },
      };
    },
    delete: ({ req }) => {
      if (req.user && req.user.role === 'admin') return true;
      return {
        'owner': {
          equals: req.user?.id,
        },
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
      type: 'textarea',
    },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'members',
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
              label: 'Owner',
              value: 'owner',
            },
            {
              label: 'Admin',
              value: 'admin',
            },
            {
              label: 'Member',
              value: 'member',
            },
            {
              label: 'Viewer',
              value: 'viewer',
            },
          ],
          defaultValue: 'member',
          required: true,
        },
      ],
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
          label: 'Archived',
          value: 'archived',
        },
      ],
      defaultValue: 'active',
      required: true,
    },
    {
      name: 'createdAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
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
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        const now = new Date();
        
        if (!data.createdAt) {
          data.createdAt = now;
        }
        
        data.lastUpdated = now;
        
        if (!data.owner && req.user) {
          data.owner = req.user.id;
        }
        
        return data;
      },
    ],
  },
};

export default Workspaces;
