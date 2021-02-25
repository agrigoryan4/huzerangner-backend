const AdminBro = require('admin-bro');
const AdminBroExpressjs = require('admin-bro-expressjs');
const AdminBroMongoose = require('@admin-bro/mongoose');
const AdminBroOptions = require('./AdminBroOptions');
const bcrypt = require('bcrypt');

const User = require('./models/User');

AdminBro.registerAdapter(AdminBroMongoose);


const adminBro = new AdminBro(AdminBroOptions);

const router = AdminBroExpressjs.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, password) => {
    const user = await User.findOne({ email });
      if (user) {
        // if (password === user.encryptedPassword) {
          //   return user;
          // }
          const isMatch = await bcrypt.compare(password, user.encryptedPassword);
          if(isMatch === true) {
            return user;
        }
      }
    return false;
  },
  cookiePassword: 'session Key',
});



module.exports = router;
module.exports.adminBroInstance = adminBro; 