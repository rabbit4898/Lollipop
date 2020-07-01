const express = require('express');
const expressSession = require('express-session');
const path = require('path');
//const http = require('http');
const bodyParser = require('body-parser');
const loginService = require('./services/loginService.js');
const admin = require('firebase-admin');
var email = '';
let serviceAccount = require('./serviceAccountKey.json');
const { isBuffer } = require('util');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json());
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

app.set('trust proxy', 1);
app.use(
  expressSession({
    secret: 'shopCaffe',
    saveUninitialized: true,
    resave: true,
    cookie: {
      maxAge: 10 * 60 * 100000000000
    }
  })
);
// đang nhập
app.get('/', async (req, res) => {
  let { token } = req.session;
  console.log({ token });
  let role = '';
  // lấy thông tin user
  if (!token) {
    res.render('login', { title: 'Login Page' });
  }
  await db
    .collection('UserCollection')
    .doc('' + token.email)
    .get()
    .then(function(doc) {
      role = doc.data().role;
      console.log(doc.data().role);
    });
  if ((role = 'Admin')) {
    // đã đăng nhập ròi cho vào home không cần đăng nhập nữa
    res.redirect('/home');
  } else {
    res.render('login', { title: 'Login Page' });
  }
});
// load trang home
app.get('/home', async (req, res) => {
  var role = '';
  let { token } = req.session;
  // call tới firebase
  let listCategoryBook = [];
  //lấy danh sách các danh mục sách để hiển thị
  let docRefCategoryList = db.collection('DanhMucCollection');
  let Category = await docRefCategoryList
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        listCategoryBook.push(doc.data());
      });
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });

  // lấy thông tin user
  if (!token || !token.email) {
    res.redirect('/');
  }

  await db
    .collection('UserCollection')
    .doc('' + token.email)
    .get()
    .then(function(doc) {
      role = doc.data().role;
      console.log(doc.data().role);
    });
  console.log(role);
  if (role == 'Admin') {
    res.render('home-page', {
      title: 'Home Page',
      listCategory: listCategoryBook
    });
  } else {
    res.json({ error: true, message: 'not amin' });
    console.log('NO ADMIN');
  }

  // if (req.session.User) {

  // }
});
//============================================================QUAN LY KHACH HANG

app.get('/list-user', async (req, res) => {
  var role = '';
  let { token } = req.session;
  // call tới firebase
  let listCategoryBook = [];
  //lấy danh sách các danh mục sách để hiển thị
  let docRefCategoryList = db.collection('DanhMucCollection');
  let Category = await docRefCategoryList
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        listCategoryBook.push(doc.data());
      });
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });

  // lấy thông tin user
  if (!token || !token.email) {
    res.redirect('/');
  }

  await db
    .collection('UserCollection')
    .doc('' + token.email)
    .get()
    .then(function(doc) {
      role = doc.data().role;
      console.log(doc.data().role);
    });
  console.log(role);
  if (role == 'Admin') {
    let listCategory = [];
    //lấy danh sách các danh mục sách để hiển thị
    let docRefCategoryList = db.collection('DanhMucCollection');
    let Category = await docRefCategoryList
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          console.log(doc.id, '=>', doc.data());
          listCategory.push(doc.data());
        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
    let docRef = db.collection('DanhMucCollection');
    // danh mục category
    let resulFinded = [];
    let infoCategory = await docRef
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          console.log(doc.id, '=>', doc.data());
          resulFinded.push(doc.data());
        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
    let _listUser = [];
    let docRefUseryList = db.collection('UserCollection');
    let listUser = await docRefUseryList
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          console.log(doc.id, '=>', doc.data());
          _listUser.push(doc.data());
        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });

    res.render('tableUsers', {
      listUser: _listUser,
      resulFinded,
      listCategory
    });
  } else {
    res.json({ error: true, message: 'not amin' });
    console.log('NO ADMIN');
  }

  // if (req.session.User) {

  // }
});

app.get('/sua-tai-khoan/:emailUserEdit', async (req, res) => {
  var role = '';
  let { emailUserEdit } = req.params;
  let { token } = req.session;
  // call tới firebase
  let listCategoryBook = [];
  //lấy danh sách các danh mục sách để hiển thị
  let docRefCategoryList = db.collection('DanhMucCollection');
  let Category = await docRefCategoryList
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        listCategoryBook.push(doc.data());
      });
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });

  // lấy thông tin user
  if (!token || !token.email) {
    res.redirect('/');
  }

  await db
    .collection('UserCollection')
    .doc('' + token.email)
    .get()
    .then(function(doc) {
      role = doc.data().role;
      console.log(doc.data().role);
    });
  console.log(role);
  if (role == 'Admin') {
    let listCategory = [];
    //lấy danh sách các danh mục sách để hiển thị
    let docRefCategoryList = db.collection('DanhMucCollection');
    let Category = await docRefCategoryList
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          console.log(doc.id, '=>', doc.data());
          listCategory.push(doc.data());
        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
    let docRef = db.collection('DanhMucCollection');
    // danh mục category
    let resulFinded = [];
    let infoCategory = await docRef
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          console.log(doc.id, '=>', doc.data());
          resulFinded.push(doc.data());
        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
    let infoUser = '';
    await db
      .collection('UserCollection')
      .doc('' + emailUserEdit)
      .get()
      .then(function(doc) {
        infoUser = doc.data();
        console.log(doc.data().role);
      });

    res.render('edit-user', {
      infoUser,
      resulFinded,
      listCategory
    });
  } else {
    res.json({ error: true, message: 'not amin' });
    console.log('NO ADMIN');
  }

  // if (req.session.User) {

  // }
});
app.post('/sua-tai-khoan', async (req, res) => {
  let { token } = req.session;
  if (!token || !token.email) {
    res.redirect('/');
  }

  let { diaChi, role, email } = req.body;
  console.log({ dataUpdate, categoryName });
  let roleC = '';
  // lấy thông tin user
  await db
    .collection('UserCollection')
    .doc('' + token.email)
    .get()
    .then(function(doc) {
      roleC = doc.data().role;
      console.log(doc.data().role);
    });
  if ((roleC = 'Admin')) {
    let docRef = db.collection('UserCollection').doc(email);
    let resulFinded = [];
    let infoBook = await docRef.update({ diaChi, role });
    return res.json({ infoBook });
  }
});

//============================================================QUAN LY SACH====
// load ra trang Thêm sách================
app.get('/them-sach', async (req, res) => {
  let { token } = req.session;
  console.log({ token });
  let role = '';
  if (!token || !token.email) {
    res.redirect('/');
  }

  console.log(token);
  // lấy thông tin user check đủ quyền mơi cho vào
  await db
    .collection('UserCollection')
    .doc('' + token.email)
    .get()
    .then(function(doc) {
      console.log(doc.data());
      role = doc.data().role;
      console.log(doc.data().role);
    });
  if ((role = 'Admin')) {
    let listCategory = [];
    //lấy danh sách các danh mục sách để hiển thị
    let docRefCategoryList = db.collection('DanhMucCollection');
    let Category = await docRefCategoryList
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          console.log(doc.id, '=>', doc.data());
          listCategory.push(doc.data());
        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });

    let docRef = db.collection('DanhMucCollection');
    // danh mục category
    let resulFinded = [];
    let infoCategory = await docRef
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          console.log(doc.id, '=>', doc.data());
          resulFinded.push(doc.data());
        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });

    return res.render('add-book', { resulFinded, listCategory });
  }
});
// thêm sách vào DB
app.post('/them-sach', async (req, res) => {
  let { nameBook, amoutBook, priceBook, categoryName } = req.body;
  let { token } = req.session;
  if (!token || !token.email) {
    res.redirect('/');
  }

  console.log({ nameBook, amoutBook, priceBook, categoryName });
  let role = '';
  // lấy thông tin user
  await db
    .collection('UserCollection')
    .doc('' + token.email)
    .get()
    .then(function(doc) {
      role = doc.data().role;
      console.log(doc.data().role);
    });
  if ((role = 'Admin')) {
    let docRef = db
      .collection('DanhMucCollection')
      .doc(categoryName.toString())
      .collection('SachCollection')
      .doc(nameBook);
    let resulFinded = [];
    let infoBook = await docRef.set({
      tenSach: nameBook,
      soLuong: Number(amoutBook),
      donGia: Number(priceBook)
    });
    res.json({ infoBook });
  }
});
// sửa sách
app.get('/sua-sach/:maSP/:categoryID', async (req, res) => {
  let { token } = req.session;
  if (!token || !token.email) {
    res.redirect('/');
  }

  let { maSP, categoryID } = req.params;
  console.log({ token });
  let role = '';
  // lấy thông tin user
  await db
    .collection('UserCollection')
    .doc('' + token.email)
    .get()
    .then(function(doc) {
      role = doc.data().role;
      console.log(doc.data().role);
    });
  if ((role = 'Admin')) {
    let listCategory = [];
    //lấy danh sách các danh mục sách để hiển thị
    let docRefCategoryList = db.collection('DanhMucCollection');
    let Category = await docRefCategoryList
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          console.log(doc.id, '=>', doc.data());
          listCategory.push(doc.data());
        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });

    let docRef = db
      .collection('DanhMucCollection')
      .doc(categoryID)
      .collection('SachCollection')
      .doc(maSP);

    // danh mục category
    let resulFinded = [];
    let infoBook;
    let infoCategory = await docRef
      .get()
      .then(snapshot => {
        infoBook = snapshot._fieldsProto;
        console.log({ snapshot: snapshot._fieldsProto });
        // snapshot.forEach(doc => {
        //   if (doc.id) console.log(doc.id, '=>', doc.data());
        //   infoBook = doc.data();
        // });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
    return res.render('edit-book', { infoBook, listCategory });
  }
});

app.post('/sua-sach', async (req, res) => {
  let { token } = req.session;
  if (!token || !token.email) {
    res.redirect('/');
  }

  let { dataUpdate, categoryName } = req.body;
  console.log({ dataUpdate, categoryName });
  let role = '';
  // lấy thông tin user
  await db
    .collection('UserCollection')
    .doc('' + token.email)
    .get()
    .then(function(doc) {
      role = doc.data().role;
      console.log(doc.data().role);
    });
  if ((role = 'Admin')) {
    let docRef = db
      .collection('DanhMucCollection')
      .doc(categoryName.toString())
      .collection('SachCollection')
      .doc(dataUpdate.tenSach);
    let resulFinded = [];
    let infoBook = await docRef.update(dataUpdate);
    return res.json({ infoBook });
  }
});

app.post('/xoa-sach', async (req, res) => {
  let { token } = req.session;
  if (!token || !token.email) {
    res.redirect('/');
  }

  let { idBook, categoryName } = req.body;
  let role = '';
  // lấy thông tin user
  await db
    .collection('UserCollection')
    .doc('' + token.email)
    .get()
    .then(function(doc) {
      role = doc.data().role;
      console.log(doc.data().role);
    });
  if ((role = 'Admin')) {
    let docRef = db
      .collection('DanhMucCollection')
      .doc(categoryName.toString())
      .collection('SachCollection')
      .doc(idBook);
    let resulFinded = [];
    let infoBook = await docRef.delete();
    return res.json({ infoBook });
  }
});
//========================
app.post('/signin', async (req, res) => {
  const { username, password } = req.body;
  email = username;
  console.log(req.body);
  console.log('Hello');
  console.log({ username, password });
  try {
    const user = await loginService.authenticate(username, password);
    req.session.token = user.user;
    res.redirect('/');
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});
// load sách của từng dang mục
app.get('/danhmuc/:categoryName', async (req, res) => {
  let { categoryName } = req.params;
  let listCategory = [];
  //lấy danh sách các danh mục sách để hiển thị
  let docRefCategoryList = db.collection('DanhMucCollection');
  let Category = await docRefCategoryList
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        listCategory.push(doc.data());
      });
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });

  let docRef = db
    .collection('DanhMucCollection')
    .doc(categoryName)
    .collection('SachCollection');
  let resulFinded = [];
  let infoBook = await docRef
    .get()
    .then(snapshot => {
      console.log({ snapshot });
      snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        resulFinded.push(doc.data());
      });
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
  // let setAda = docRef.set({
  //   first: 'Ada',
  //   last: 'Lovelace',
  //   born: 1815
  // });
  console.log({ resulFinded });
  let { token } = req.session;
  console.log({ token });
  if (!token || !token.email) {
    res.redirect('/');
  }

  let role = '';
  // lấy thông tin user
  await db
    .collection('UserCollection')
    .doc('' + token.email)
    .get()
    .then(function(doc) {
      role = doc.data().role;
      console.log(doc.data().role);
    });
  if ((role = 'Admin')) {
    return res.render('tableBook', { resulFinded: resulFinded, listCategory });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

//set session
app.get('/set_session', (req, res) => {
  //set a object to session

  req.session.User = {
    website: 'anonystick.com',
    type: 'blog javascript',
    like: '4550'
  };

  return res.status(200).json({ status: 'success' });
});

//set session
app.get('/get_session', (req, res) => {
  //check session
  if (req.session.User) {
    return res
      .status(200)
      .json({ status: 'success', session: req.session.User });
  }
  return res.status(200).json({ status: 'error', session: 'No session' });
});

//destroy session
app.get('/destroy_session', (req, res) => {
  //destroy session
  req.session.destroy(function(err) {
    return res
      .status(200)
      .json({ status: 'success', session: 'cannot access session here' });
  });
});
