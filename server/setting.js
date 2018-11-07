module.exports = {
  admin: {
    password: '90064d07434fd9548d566c95a382782d67447111bb80b00d1fb2017400e5c70a' // lanbaba
  },
  server: {
      port: 3100  //  本地服务端口
  },
  session: {
      secret:'unique-buddha3',  // 会话
      key: 'buddha3', //cookie
      cookie: {secure: false, maxAge: null},
      resave:true,
      saveUninitialized: true
  }
};
