import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("test.db");

export const initializeDatabase = () => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS place_items (id INTEGER PRIMARY KEY AUTOINCREMENT, start TEXT, end TEXT, count INT, data JSON)",
                // "DROP TABLE IF EXISTS place_items",

                [],
                () => {},
                (_, error) => reject(error)
            );
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS timer_items (id INTEGER PRIMARY KEY AUTOINCREMENT, place_id INTEGER, date TEXT, time TEXT)",
                // "DROP TABLE IF EXISTS timer_items",

                [],
                () => {},
                (_, error) => reject(error)
            );
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS alarm_items (alarm_id INTEGER PRIMARY KEY AUTOINCREMENT, place_id INTEGER, hour INT, minute INT, isOn INT, subtract INT, minus_time INT, notificationIds JSON)",
                // "DROP TABLE IF EXISTS alarm_items",
                [],
                () => {},
                (_, error) => reject(error)
            );
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS on_boarding (id INTEGER PRIMARY KEY AUTOINCREMENT, existing INTEGER)",
                // "DROP TABLE IF EXISTS on_boarding",
                [],
                () => resolve(),
                (_, error) => reject(error)
            );
            tx.executeSql(
                "CREATE TABLE IF NOT EXISTS running (id INTEGER PRIMARY KEY AUTOINCREMENT, date INTEGER)",
                // "DROP TABLE IF EXISTS running",
                [],
                () => resolve(),
                (_, error) => reject(error)
            );
        });
    });
};

export const addRunning = (date) => {
    db.transaction((tx) => {
        tx.executeSql(
            "INSERT INTO running (date) VALUES (?)",
            [date],
            (_, result) => {
                // Handle success
                // console.log(date)
                const items = result.rows._array;
            },
            (_, error) => {
                // Handle error
                console.log(error);
            }
        );
    });
};

export const getRunningItems = () => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM running",
                [],
                (_, result) => {
                    // Handle success
                    const items = result.rows._array;
                    if (items.length > 0){
                        resolve(items);
                    } else {
                        resolve([])
                    }
                    
                },
                (_, error) => {
                    // Handle error
                    reject(error);
                }
            );
        });
    });
};

export const deleteRunningItem = (id) => {
    db.transaction((tx) => {
        tx.executeSql(
            "DELETE FROM running",
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

export const setOnboard = () => {
    db.transaction((tx) => {
        tx.executeSql(
            "INSERT INTO on_boarding (existing) VALUES (?)",
            [1],
            (_, result) => {
                // Handle success
                const items = result.rows._array;
            },
            (_, error) => {
                // Handle error
                console.log(error);
            }
        );
    });
};

export const getOnboard = () => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM on_boarding",
                [],
                (_, result) => {
                    // Handle success
                    const items = result.rows._array;
                    if (items.length === 0) {
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                },
                (_, error) => {
                    // Handle error
                    reject(error);
                }
            );
        });
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
        );
    });
};

export const getTimerItems = (place_id) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM timer_items WHERE place_id = ?",
                [place_id],
                (_, result) => {
                    // Handle success
                    const items = result.rows._array;
                    if (items.length === 0) {
                        resolve([]);
                    } else {
                        resolve(items);
                    }
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
                                    console.log(
                                        "Place item added with ID:",
                                        lastInsertId
                                    );
                                    resolve(lastInsertId); // Resolve the promise with the inserted ID
                                },
                                (_, error) => {
                                    // Handle error
                                    console.log(
                                        "Error adding place item:",
                                        error
                                    );
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
                    const item = result.rows.item(0);
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

export const addAlarmItem = (
    place_id,
    hour,
    minute,
    subtract,
    minus_time,
    notificationIds
) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "INSERT INTO alarm_items (place_id, hour, minute, isOn, subtract, minus_time, notificationIds) VALUES (?, ?, ?, 1, ?, ?, ?)",
                [place_id, hour, minute, subtract, minus_time, notificationIds],
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
                        minus_time,
                        notificationIds
                    );
                    return resolve(lastInsertId);
                },
                (_, error) => {
                    // Handle error
                    console.log("Error adding Alerm item:", error);
                }
            );
        });
    });
};

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

export const getAlarmItemsOn = () => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM alarm_items WHERE isOn = ?",
                [1],
                (_, result) => {
                    // Handle success
                    const items = result.rows._array;
                    resolve(items.length);
                },
                (_, error) => {
                    // Handle error
                    reject("is it this?", error);
                }
            );
        });
    });
};

export const getAlarmwithPlace = (place_id) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM alarm_items WHERE place_id = ?",
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

export const getAlarmNotificationIds = (alarm_id) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT notificationIds FROM alarm_items WHERE alarm_id = ?",
                [alarm_id],
                (_, result) => {
                    // Handle success
                    const item = result.rows._array;
                    if (item.length == 0) {
                        resolve([]);
                    } else {
                        resolve(item[0].notificationIds);
                    }
                },
                (_, error) => {
                    // Handle error
                    reject(error);
                }
            );
        });
    });
};

export const updateAlarmOn = (alarm_id, isOn, notificationIds) => {
    db.transaction((tx) => {
        tx.executeSql(
            "UPDATE alarm_items SET isOn = ?, notificationIds = ? WHERE alarm_id = ?",
            [isOn, notificationIds, alarm_id],
            (_, result) => {
                // Handle success
                console.log(
                    "Alarm Toggle updated successfully",
                    isOn,
                    notificationIds
                );
            },
            (_, error) => {
                // Handle error
                console.log("Error updating Alarm Toggle:", error);
            }
        );
    });
};

export const updateAlarmItem = (
    alarm_id,
    hour,
    minute,
    isOn,
    subtract,
    minus_time,
    notificationIds
) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "UPDATE alarm_items SET hour = ?, minute = ?, isOn = ?, subtract = ?, minus_time = ?, notificationIds = ? WHERE alarm_id = ?",
                [
                    hour,
                    minute,
                    isOn,
                    subtract,
                    minus_time,
                    notificationIds,
                    alarm_id,
                ],
                (_, result) => {
                    // Handle success
                    console.log(
                        "Alarm Item updated successfully: ",
                        hour,
                        minute
                        // subtract,
                        // minus_time
                    );
                    resolve(isOn);
                },
                (_, error) => {
                    // Handle error
                    console.log("Error updating Alarm item:", error);
                    resolve("YO", error)
                }
            );
        });
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
                console.log(
                    "Alerm Item deleted successfully from deletePlaceItem"
                );
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
                console.log(
                    "Timer Item deleted successfully from deletePlaceItem"
                );
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
                console.log(
                    "Place Item deleted successfully from deletePlaceItem"
                );
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