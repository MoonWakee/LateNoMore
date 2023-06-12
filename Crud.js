import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('test.db');

export const initializeDatabase = () => {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, count INT)'
    );
  });
};

export const addItem = (text, count) => {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO items (text, count) VALUES (?, ?)',
      [text, count],
      (_, result) => {
        // Handle success
        const lastInsertId = result.insertId;
        console.log('Item added with ID:', lastInsertId);
      },
      (_, error) => {
        // Handle error
        console.log('Error adding item:', error);
      }
    );
  });
};

export const getItems = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM items',
        [],
        (_, result) => {
          // Handle success
          const items = result.rows._array;
          resolve(items);
        },
        (_, error) => {
          // Handle error
          reject(error);
        }
      );
    });
  });
};

export const updateItem = (id, text, count) => {
  db.transaction(tx => {
    tx.executeSql(
      'UPDATE items SET text = ?, count = ? WHERE id = ?',
      [text, count, id],
      (_, result) => {
        // Handle success
        console.log('Item updated successfully');
      },
      (_, error) => {
        // Handle error
        console.log('Error updating item:', error);
      }
    );
  });
};

export const deleteItem = (id) => {
  db.transaction(tx => {
    tx.executeSql(
      'DELETE FROM items WHERE id = ?',
      [id],
      (_, result) => {
        // Handle success
        console.log('Item deleted successfully');
      },
      (_, error) => {
        // Handle error
        console.log('Error deleting item:', error);
      }
    );
  });
};
