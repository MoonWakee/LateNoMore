import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("test.db");

export const initializeDatabase = () => {
    db.transaction((tx) => {
        tx.executeSql(
            "CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, start TEXT, end TEXT, count INT, data JSON)"
            // "DROP TABLE IF EXISTS items"
        );
        // console.log("deleted table");
    });
};

export const addItem = (start, end, data) => {
    db.transaction((tx) => {
        tx.executeSql(
            "SELECT * FROM items WHERE start = ? AND end = ? AND data = ?",
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
                            "INSERT INTO items (start, end, count, data) VALUES (?, ?, 0, ?)",
                            [start, end, data],
                            (_, result) => {
                                // Handle success
                                const lastInsertId = result.insertId;
                                console.log(
                                    "Item added with ID:",
                                    lastInsertId,
                                    start,
                                    end,
                                    data
                                );
                                return lastInsertId;
                            },
                            (_, error) => {
                                // Handle error
                                console.log("Error adding item:", error);
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

export const getItems = () => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM items",
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
