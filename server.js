const { MongoClient, ObjectId } = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.static(__dirname + '/dist/my_app/browser'));
console.log('📂 __dirname:', __dirname);
const CONTACTS_COLLECTION = 'contacts';
app.use(bodyParser.json());

let db;
let client;

async function startServer() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';
    client = await MongoClient.connect(uri, { serverSelectionTimeoutMS: 5000 });
    db = client.db();
    console.log('База данных подключена');

    const server = app.listen(process.env.PORT || 8080, function () {
      const port = server.address().port;
      console.log(`Приложение запущено на порту ${port}`);
    });
  } catch (err) {
    console.error('Ошибка подключения к MongoDB:', err.message);
    process.exit(1);
  }
}

startServer();

function handleError(res, reason, message, code) {
  console.log('Ошибка: ' + reason);
  res.status(code || 500).json({ error: message });
}

app.get('/api/contacts', async function (req, res) {
  if (!db) {
    handleError(res, 'База данных не подключена', 'Ошибка подключения к БД', 500);
    return;
  }

  try {
    const docs = await db.collection(CONTACTS_COLLECTION).find({}).toArray();
    res.status(200).json(docs);
  } catch (err) {
    handleError(res, err.message, 'Не удалось получить контакты');
  }
});

app.post('/api/contacts', async function (req, res) {
  if (!db) {
    handleError(res, 'База данных не подключена', 'Ошибка подключения к БД', 500);
    return;
  }

  const newContact = req.body;
  if (!newContact.username) {
    handleError(res, 'Нет имени пользователя', 'Необходимо указать username', 400);
    return;
  }

  try {
    const result = await db.collection(CONTACTS_COLLECTION).insertOne(newContact);

    const createdDoc = await db.collection(CONTACTS_COLLECTION).findOne({ _id: result.insertedId });
    res.status(201).json(createdDoc);
  } catch (err) {
    handleError(res, err.message, 'Не удалось создать контакт');
  }
});

app.get('/api/contacts/:id', function (req, res) {
  var id = req.params.id;
  try {
    var oid = new ObjectId(id);
  } catch (e) {
    handleError(res, 'Неверный ID', 'ID должен быть строкой из 24 символов', 400);
    return;
  }
  db.collection(CONTACTS_COLLECTION).findOne({ _id: oid }, function (err, doc) {
    if (err) {
      handleError(res, err.message, 'Не удалось найти контакт');
    } else if (!doc) {
      handleError(res, 'Контакт не найден', 'Контакт с ID ' + id + ' не существует', 404);
    } else {
      res.status(200).json(doc);
    }
  });
});

app.put('/api/contacts/:id', function (req, res) {
  var id = req.params.id;
  try {
    var oid = new ObjectId(id);
  } catch (e) {
    handleError(res, 'Неверный ID', 'ID должен быть строкой из 24 символов', 400);
    return;
  }
  var updateDoc = req.body;
  delete updateDoc._id;
  db.collection(CONTACTS_COLLECTION).updateOne(
    { _id: oid },
    { $set: updateDoc },
    function (err, doc) {
      if (err) {
        handleError(res, err.message, 'Не удалось обновить контакт');
      } else {
        res.status(200).json(updateDoc);
      }
    },
  );
});

app.delete('/api/contacts/:id', function (req, res) {
  var id = req.params.id;
  try {
    var oid = new ObjectId(id);
  } catch (e) {
    handleError(res, 'Неверный ID', 'ID должен быть строкой из 24 символов', 400);
    return;
  }
  db.collection(CONTACTS_COLLECTION).deleteOne({ _id: oid }, function (err, result) {
    if (err) {
      handleError(res, err.message, 'Не удалось удалить контакт');
    } else if (result.deletedCount === 0) {
      handleError(res, 'Контакт не найден', 'Контакт с ID ' + id + ' не существует', 404);
    } else {
      res.status(204).send();
    }
  });
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/dist/my_app/browser/index.html');
});
