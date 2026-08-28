const { MongoClient } = require('mongodb');

async function test() {
  const uri = 'mongodb://127.0.0.1:27017/test';

  try {
    console.log('Пытаюсь подключиться...');
    const client = await MongoClient.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log('Успешно подключился!');

    const db = client.db();
    const collections = await db.listCollections().toArray();
    console.log(
      'Коллекции:',
      collections.map((c) => c.name),
    );

    await client.close();
    console.log('Соединение закрыто');
  } catch (err) {
    console.error('Ошибка подключения:');
    console.error(err.message);
  }
}

test();
