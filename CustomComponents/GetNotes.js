const { openDatabase } = require("react-native-sqlite-storage")

const db = openDatabase({
    name: 'customer_database',
})

export const getNotesData = async () => {
    let results = []
    return new Promise((resolve, reject) => {
        db.transaction(
            (txn) => {
                txn.executeSql(
                    'SELECT * FROM note_info order by id asc',
                    [],
                    (tx, res) => {
                        let len = res.rows.length;
                        if (len > 0) {
                            for (let i = 0; i < len; i++) {
                                let item = res.rows.item(i)
                                results.push(item)
                            }
                            resolve(results)
                        } else {
                            resolve([]);
                        }
                    },
                    (error) => {
                        console.log('Error while checking for data: ', error);
                        reject(error);
                    },
                );
            },
            (error) => {
                console.log('Error while checking for data: ', error);
                reject(error);
            },
        );
    });
};
