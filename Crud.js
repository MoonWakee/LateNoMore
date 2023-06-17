import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("test.db");

export const initializeDatabase = () => {
    db.transaction((tx) => {
        tx.executeSql(
            "CREATE TABLE IF NOT EXISTS place_items (id INTEGER PRIMARY KEY AUTOINCREMENT, start TEXT, end TEXT, count INT, data JSON)"
            // "DROP TABLE IF EXISTS items"
        );
        tx.executeSql(
            "CREATE TABLE IF NOT EXISTS timer_items (id INTEGER PRIMARY KEY AUTOINCREMENT, place_id INTEGER, date TEXT, time TEXT)"
            // "DROP TABLE IF EXISTS timer_items"
        );
        tx.executeSql(
            "CREATE TABLE IF NOT EXISTS alarm_items (id INTEGER PRIMARY KEY AUTOINCREMENT, place_id INTEGER, time INT)"
            // "DROP TABLE IF EXISTS alarm_items"
        );
    });
};

export const addTimerItem = (place_id, date, time) => {
    db.transaction((tx) => {
        tx.executeSql(
            "INSERT INTO timer_items (place_id, date, time) VALUES (?, ?, ?)",
            [place_id, date, time],
            (_, result) => {
                // Handle success
                const lastInsertId = result.insertId;
                console.log(
                    "Timer item added with ID:",
                    lastInsertId,
                    place_id,
                    date,
                    time
                );
                return lastInsertId;
            },
            (_, error) => {
                // Handle error
                console.log("Error adding timer item:", error);
            }
        )
    })
}

export const getTimerItems = (place_id) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM timer_items WHERE place_id = ?",
                [place_id],
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

export const addPlaceItem = (start, end, data) => {
    db.transaction((tx) => {
        tx.executeSql(
            "SELECT * FROM place_items WHERE start = ? AND end = ? AND data = ?",
            [start, end, data],
            (_, result) => {
                const existingItem = result.rows._array[0];
                if (existingItem) {
                    console.log("Item already exists:", existingItem);
                    alert("Item already Exists!")
                } else {
                    // Item does not exist, insert it into the database
                    db.transaction((tx) => {
                        tx.executeSql(
                            "INSERT INTO place_items (start, end, count, data) VALUES (?, ?, 0, ?)",
                            [start, end, data],
                            (_, result) => {
                                // Handle success
                                const lastInsertId = result.insertId;
                                console.log(
                                    "Place item added with ID:",
                                    lastInsertId,
                                    start,
                                    end,
                                    data
                                );
                                return lastInsertId;
                            },
                            (_, error) => {
                                // Handle error
                                console.log("Error adding place item:", error);
                            }
                        );
                    });
                }
            },
            (_, error) => {
                // Handle error
                console.log("Error checking existing items:", error);
            }
        );
    });
};

export const getPlaceItems = () => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM place_items",
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

export const checkIfPlaceItemExists = (start, end, data) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM place_items WHERE start = ? AND end = ? AND data = ?",
          [start, end, data],
          (_, result) => {
            // Handle success
            const items = result.rows._array;
            resolve(items.length > 0); // Resolve with true if items exist, false otherwise
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
    db.transaction((tx) => {
        tx.executeSql(
            "UPDATE items SET text = ?, count = ? WHERE id = ?",
            [text, count, id],
            (_, result) => {
                // Handle success
                console.log("Item updated successfully");
            },
            (_, error) => {
                // Handle error
                console.log("Error updating item:", error);
            }
        );
    });
};

export const deleteItem = (id) => {
    db.transaction((tx) => {
        tx.executeSql(
            "DELETE FROM items WHERE id = ?",
            [id],
            (_, result) => {
                // Handle success
                console.log("Item deleted successfully");
            },
            (_, error) => {
                // Handle error
                console.log("Error deleting item:", error);
            }
        );
    });
};
