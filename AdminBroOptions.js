const bcrypt = require('bcrypt');
const User = require('./models/User');
const Post = require('./models/Post');

const isAdmin = ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin';

const AdminBroOptions = {
  rootPath: '/admin',
  resources: [
    {
      resource: User,  
      options: {
        properties: {
          encryptedPassword: { isVisible: false },
          password: {
            type: 'string',
            isVisible: {
              list: false, edit: true, filter: false, show: false,
            },
          },
        },
        actions: {
          new: {
            before: async (request) => {
              if(request.payload.record.password) {
                request.payload.record = {
                  ...request.payload.record,
                  encryptedPassword: await bcrypt.hash(request.payload.record.password, 12),
                  password: undefined,
                }
              }
              return request
            },
          },
          edit: { isAccessible: isAdmin },
          delete: { isAccessible: isAdmin },
          new: { isAccessible: isAdmin },
        }
      }
    },
    {
      resource: Post, 
      options: { 
        properties: { 
          body: {
            type: 'richtext'
          },
          createdAt: {
            isVisible: {
              list: true, new: false, edit: false, filter: true, show: true,
            },
          },
          lastEdited: {
            isVisible: {
              list: true, new: false, edit: false, filter: true, show: true,
            },
          }
        },
        actions: {
          edit: { 
            isAccessible: isAdmin,
            before: async(request) => {
              request.payload = {
                ...request.payload,
                lastEdited: new Date(),
              }
              return request;
            }
          },
          delete: { isAccessible: isAdmin },
          new: { 
            isAccessible: isAdmin,
            before: async(request) => {
              const date = new Date();
              request.payload = {
                ...request.payload,
                createdAt: date,
                lastEdited: date,
              }
              return request;
            }
          },
        }
      },
    },
  ],
};

module.exports = AdminBroOptions;
