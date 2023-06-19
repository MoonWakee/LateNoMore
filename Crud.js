import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("test.db");

export const initializeDatabase = () => {
    db.transaction((tx) => {
        tx.executeSql(
            "CREATE TABLE IF NOT EXISTS place_items (id INTEGER PRIMARY KEY AUTOINCREMENT, start TEXT, end TEXT, count INT, data JSON)"
            // "DROP TABLE IF EXISTS place_items"
        );
        tx.executeSql(
            "CREATE TABLE IF NOT EXISTS timer_items (id INTEGER PRIMARY KEY AUTOINCREMENT, place_id INTEGER, date TEXT, time TEXT)"
            // "DROP TABLE IF EXISTS timer_items"
        );
        tx.executeSql(
            "CREATE TABLE IF NOT EXISTS alarm_items (alarm_id INTEGER PRIMARY KEY AUTOINCREMENT, place_id INTEGER, hour INT, minute INT, isOn INT, subtract INT, minus_time INT)"
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
                    // place_id,
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
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM place_items WHERE start = ? AND end = ? AND data = ?",
          [start, end, data],
          (_, result) => {
            const existingItem = result.rows._array[0];
            if (existingItem) {
              console.log("Item already exists:", existingItem);
              alert("Item already exists!");
              reject("Item already exists"); // Reject the promise with an error message
            } else {
              // Item does not exist, insert it into the database
              db.transaction((tx) => {
                tx.executeSql(
                  "INSERT INTO place_items (start, end, count, data) VALUES (?, ?, 0, ?)",
                  [start, end, data],
                  (_, result) => {
                    // Handle success
                    const lastInsertId = result.insertId;
                    console.log("Place item added with ID:", lastInsertId);
                    resolve(lastInsertId); // Resolve the promise with the inserted ID
                  },
                  (_, error) => {
                    // Handle error
                    console.log("Error adding place item:", error);
                    reject("Error adding place item"); // Reject the promise with an error message
                  }
                );
              });
            }
          },
          (_, error) => {
            // Handle error
            console.log("Error checking existing items:", error);
            reject("Error checking existing items"); // Reject the promise with an error message
          }
        );
      });
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

export const getPlaceItem = (place_id) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM place_items WHERE id = ?",
                [place_id],
                (_, result) => {
                    // Handle success
                    const item = result.rows.item(0)
                    resolve(item);
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
  
  export const addAlarmItem = (place_id, hour, minute, subtract, minus_time) => {
    db.transaction((tx) => {
        tx.executeSql(
            "INSERT INTO alarm_items (place_id, hour, minute, isOn, subtract, minus_time) VALUES (?, ?, ?, 1, ?, ?)",
            [place_id, hour, minute, subtract, minus_time],
            (_, result) => {
                // Handle success
                const lastInsertId = result.insertId;
                console.log(
                    "Alarm item added with ID:",
                    lastInsertId,
                    place_id,
                    hour, 
                    minute,
                    subtract,
                    minus_time
                );
                return lastInsertId;
            },
            (_, error) => {
                // Handle error
                console.log("Error adding Alerm item:", error);
            }
        )
    })
}

export const getAlarmItems = () => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM alarm_items",
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

export const updateAlarmOn = (alarm_id, isOn) => {
    db.transaction((tx) => {
        tx.executeSql(
            "UPDATE alarm_items SET isOn = ? WHERE alarm_id = ?",
            [isOn, alarm_id],
            (_, result) => {
                // Handle success
                console.log("Alarm Toggle updated successfully");
            },
            (_, error) => {
                // Handle error
                console.log("Error updating Alarm Toggle:", error);
            }
        );
    });
};

export const updateAlarmItem = (alarm_id, hour, minute, isOn, subtract, minus_time) => {
    db.transaction((tx) => {
        tx.executeSql(
            "UPDATE alarm_items SET hour = ?, minute = ?, isOn = ?, subtract = ?, minus_time = ? WHERE alarm_id = ?",
            [hour, minute, isOn, subtract, minus_time, alarm_id],
            (_, result) => {
                // Handle success
                console.log("Alarm Item updated successfully: ", subtract, minus_time);
            },
            (_, error) => {
                // Handle error
                console.log("Error updating Alarm item:", error);
            }
        );
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

export const deleteTimerItem = (id) => {
    db.transaction((tx) => {
        tx.executeSql(
            "DELETE FROM timer_items WHERE id = ?",
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

export const deletePlaceItem = (id) => {
    db.transaction((tx) => {
        tx.executeSql(
            "DELETE FROM alarm_items WHERE place_id = ?",
            [id],
            (_, result) => {
                // Handle success
                console.log("Alerm Item deleted successfully from deletePlaceItem");
            },
            (_, error) => {
                // Handle error
                console.log("Error deleting item:", error);
            }
        );
        tx.executeSql(
            "DELETE FROM timer_items WHERE place_id = ?",
            [id],
            (_, result) => {
                // Handle success
                console.log("Timer Item deleted successfully from deletePlaceItem");
            },
            (_, error) => {
                // Handle error
                console.log("Error deleting Timer item:", error);
            }
        );
        tx.executeSql(
            "DELETE FROM place_items WHERE id = ?",
            [id],
            (_, result) => {
                // Handle success
                console.log("Place Item deleted successfully from deletePlaceItem");
            },
            (_, error) => {
                // Handle error
                console.log("Error deleting Place item:", error);
            }
        );
    });
};



export const deleteAlarmItem = (id) => {
    db.transaction((tx) => {
        tx.executeSql(
            "DELETE FROM alarm_items WHERE alarm_id = ?",
            [id],
            (_, result) => {
                // Handle success
                console.log("Alarm Item deleted successfully");
            },
            (_, error) => {
                // Handle error
                console.log("Error deleting Timer item:", error);
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
