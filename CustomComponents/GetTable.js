const { openDatabase } = require("react-native-sqlite-storage")

const db = openDatabase({
    name: 'customer_database',
})

export const gettingAccountData = async () => {
    return new Promise((resolve, reject) => {
        db.transaction(
            (txn) => {
                txn.executeSql(
                    'SELECT * FROM account ORDER BY rowid DESC',
                    [],
                    (tx, res) => {
                        let len = res.rows.length;
                        let results = [];
                        if (len > 0) {
                            for (let i = 0; i < len; i++) {
                                let item = res.rows.item(i);
                                results.push({
                                    ...item,
                                    id: item.accountId,
                                    item: item.accountName,
                                });
                            }
                            resolve({ hasData: 1, data: results });
                        } else {
                            resolve({ hasData: 0, data: results });
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

export async function findMatchedAcount(accountId, mobileAccountId) {
    const results = await gettingAccountData();
    console.log("result console", results)
    const matches = results?.data?.filter(obj => {
        if (obj.accountId !== null && accountId === obj.accountId) {
            return true;
        } else if (accountId === null && mobileAccountId === obj.mobileAccountId) {
            return true;
        } else if (mobileAccountId === obj.mobileAccountId) {
            return true;
        }
        return false;
    });
    return matches;
}

export const gettingContactData = async () => {
    return new Promise((resolve, reject) => {
        db.transaction(
            (txn) => {
                txn.executeSql(
                    'SELECT * FROM contacts ORDER BY rowid DESC',
                    [],
                    (tx, res) => {
                        let len = res.rows.length;
                        let results = [];
                        if (len > 0) {
                            for (let i = 0; i < len; i++) {
                                let item = res.rows.item(i);
                                results.push(item);
                            }
                            resolve({ hasData: 1, data: results });
                        } else {
                            resolve({ hasData: 0, data: results });
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

export async function findMatchedContact(contactId, mobileContactId) {
    const results = await gettingContactData();
    const matches = results?.data?.filter(obj => {
        if (obj.contactId !== null && contactId === obj.contactId) {
            return true;
        } else if (contactId === null && mobileContactId === obj.mobileContactId) {
            return true;
        } else if (mobileContactId === obj.mobileContactId) {
            return true;
        }
        return false;
    });
    return matches;
}

export async function findContactByContactId(contactId) {
    const results = await gettingContactData();
    return results.find(u => u.contactId === contactId);
}

export const gettingQuotationData = async () => {
    return new Promise((resolve, reject) => {
        db.transaction(
            (txn) => {
                txn.executeSql(
                    'SELECT * FROM quotation  ORDER BY rowid DESC',
                    [],
                    (tx, res) => {
                        let len = res.rows.length;
                        // if (len > 0) {
                        //     resolve(1);
                        // } else {
                        //     resolve(0);
                        // }
                        let results = [];
                        if (len > 0) {
                            for (let i = 0; i < len; i++) {
                                let item = res.rows.item(i);
                                results.push(item);
                            }
                            resolve({ hasData: 1, data: results });
                        } else {
                            resolve({ hasData: 0, data: results });
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

export const gettingCompanyData = async () => {
    return new Promise((resolve, reject) => {
        db.transaction(
            (txn) => {
                txn.executeSql(
                    'SELECT * FROM company_info ORDER BY rowid DESC',
                    [],
                    (tx, res) => {
                        let len = res.rows.length;
                        let results = [];
                        if (len > 0) {
                            for (let i = 0; i < len; i++) {
                                let item = res.rows.item(i);
                                results.push(item);
                            }
                            resolve({ hasData: 1, data: results });
                        } else {
                            resolve({ hasData: 0, data: results });
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

export async function findMatchedCompany(companyId, mobileCompanyId) {
    const results = await gettingCompanyData();
    const matches = results?.data?.filter(obj => {
        if (obj.companyId !== null && companyId === obj.companyId) {
            return true;
        } else if (companyId === null && mobileCompanyId === obj.mobileCompanyId) {
            return true;
        } else if (mobileCompanyId === obj.mobileCompanyId) {
            return true;
        }
        return false;
    });
    return matches;
}



export const gettingEmployeeData = async () => {
    return new Promise((resolve, reject) => {
        db.transaction(
            (txn) => {
                txn.executeSql(
                    'SELECT * FROM employee_info ORDER BY rowid DESC',
                    [],
                    (tx, res) => {
                        let len = res.rows.length;
                        let results = [];
                        if (len > 0) {
                            for (let i = 0; i < len; i++) {
                                let item = res.rows.item(i);
                                results.push(item);
                            }
                            resolve({ hasData: 1, data: results });
                        } else {
                            resolve({ hasData: 0, data: results });
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

export const gettingCustomerData = async () => {
    return new Promise((resolve, reject) => {
        db.transaction(
            (txn) => {
                txn.executeSql(
                    'SELECT * FROM customer_info',
                    [],
                    (tx, res) => {
                        let len = res.rows.length;
                        if (len > 0) {
                            resolve(1);
                        } else {
                            resolve(0);
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

export const gettingNoteData = async () => {
    return new Promise((resolve, reject) => {
        db.transaction(
            (txn) => {
                txn.executeSql(
                    'SELECT * FROM note_info ORDER BY rowid DESC',
                    [],
                    (tx, res) => {
                        let len = res.rows.length;
                        if (len > 0) {
                            resolve(1);
                        } else {
                            resolve(0);
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

export async function findMatchedNote(id, mobileId) {
    return new Promise((resolve, reject) => {
        db.transaction(
            (txn) => {
                txn.executeSql(
                    'SELECT * FROM note_info where refId=? or mobileRefId=? ORDER BY rowid DESC',
                    [id, mobileId],
                    (tx, res) => {
                        let len = res.rows.length;
                        let results = [];
                        if (len > 0) {
                            for (let i = 0; i < len; i++) {
                                let item = res.rows.item(i);
                                results.push(item);
                            }
                            resolve(results);
                        } else {
                            resolve(results);
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
}

export const gettingActivityData = async () => {
    return new Promise((resolve, reject) => {
        db.transaction(
            (txn) => {
                txn.executeSql(
                    'SELECT * FROM activity_info',
                    [],
                    (tx, res) => {
                        let len = res.rows.length;
                        let results = [];
                        if (len > 0) {
                            for (let i = 0; i < len; i++) {
                                let item = res.rows.item(i);
                                results.push({
                                    ...item,
                                    companyId: '',
                                    calendarId: item?.calendarId ? item?.calendarId : ""
                                });
                            }
                            resolve({ hasData: 1, data: results });
                        } else {
                            resolve({ hasData: 0, data: results });
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


export async function findMatchedActivity(id) {
    return new Promise((resolve, reject) => {
        db.transaction(
            (txn) => {
                txn.executeSql(
                    'SELECT * FROM activity_info where refId=?',
                    [id],
                    (tx, res) => {
                        let len = res.rows.length;
                        let results = [];
                        if (len > 0) {
                            for (let i = 0; i < len; i++) {
                                let item = res.rows.item(i);
                                results.push(item);
                            }
                            resolve(results);
                        } else {
                            resolve(results);
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
}


export const gettingTerritoryData = async () => {
    return new Promise((resolve, reject) => {
        db.transaction(
            (txn) => {
                txn.executeSql(
                    'SELECT * FROM territory_info ORDER BY rowid DESC',
                    [],
                    (tx, res) => {
                        let len = res.rows.length;
                        let results = [];
                        if (len > 0) {
                            for (let i = 0; i < len; i++) {
                                let item = res.rows.item(i);
                                results.push(item);
                            }
                            resolve({ hasData: 1, data: results });
                        } else {
                            resolve({ hasData: 0, data: results });
                        }
                    },
                    (error) => {
                        console.log('Error while checking for data: ', error);
                        reject(error);
                    },
                );
            },
        );
    });
};

export const gettingInvoiceData = async () => {
    return new Promise((resolve, reject) => {
        db.transaction(
            (txn) => {
                txn.executeSql(
                    'SELECT * FROM invoice_info',
                    [],
                    (tx, res) => {
                        let len = res.rows.length;
                        if (len > 0) {
                            resolve(1);
                        } else {
                            resolve(0);
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

export const gettingSaleData = async () => {
    return new Promise((resolve, reject) => {
        db.transaction(
            (txn) => {
                txn.executeSql(
                    'SELECT * FROM sale',
                    [],
                    (tx, res) => {
                        let len = res.rows.length;
                        if (len > 0) {
                            resolve(1);
                        } else {
                            resolve(0);
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

export const gettingStoreData = async () => {
    return new Promise((resolve, reject) => {
        db.transaction(
            (txn) => {
                txn.executeSql(
                    'SELECT * FROM store_info ORDER BY rowid DESC',
                    [],
                    (tx, res) => {
                        let len = res.rows.length;
                        let results = [];
                        if (len > 0) {
                            for (let i = 0; i < len; i++) {
                                let item = res.rows.item(i);
                                results.push(item);
                            }
                            resolve({ hasData: 1, data: results });
                        } else {
                            resolve({ hasData: 0, data: results });
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

export const gettingProductData = async () => {
    return new Promise((resolve, reject) => {
        db.transaction(
            (txn) => {
                txn.executeSql(
                    'SELECT * from product_info',
                    [],
                    (tx, res) => {
                        let len = res.rows.length;
                        if (len > 0) {
                            resolve(1);
                        } else {
                            resolve(0);
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

export const gettingInventoryData = async () => {
    return new Promise((resolve, reject) => {
        db.transaction(
            (txn) => {
                txn.executeSql(
                    'SELECT * from inventory_info ORDER BY rowid DESC',
                    [],
                    (tx, res) => {
                        let len = res.rows.length;
                        let results = [];
                        if (len > 0) {
                            for (let i = 0; i < len; i++) {
                                let item = res.rows.item(i);
                                results.push(item);
                            }
                            resolve({ hasData: 1, data: results });
                        } else {
                            resolve({ hasData: 0, data: results });
                        }
                    },
                    (error) => {
                        console.log('Error while checking for data: ', error);
                        reject(error);
                    },
                );
            },

        );
    });
};

export const gettingPurchaseOrderData = async () => {
    return new Promise((resolve, reject) => {
        db.transaction(
            (txn) => {
                txn.executeSql(
                    'SELECT * from purchaseOrder_info',
                    [],
                    (tx, res) => {
                        let len = res.rows.length;
                        if (len > 0) {
                            resolve(1);
                        } else {
                            resolve(0);
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

export const gettingShipmentData = async () => {
    return new Promise((resolve, reject) => {
        db.transaction(
            (txn) => {
                txn.executeSql(
                    'SELECT * from shipment_info',
                    [],
                    (tx, res) => {
                        let len = res.rows.length;
                        if (len > 0) {
                            resolve(1);
                        } else {
                            resolve(0);
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

export const gettingAttendanceData = async () => {
    return new Promise((resolve, reject) => {
        db.transaction(
            (txn) => {
                txn.executeSql(
                    'SELECT * from attendance_info',
                    [],
                    (tx, res) => {
                        let len = res.rows.length;
                        if (len > 0) {
                            resolve(1);
                        } else {
                            resolve(0);
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

export const gettingDealData = async () => {
    return new Promise((resolve, reject) => {
        db.transaction(
            (txn) => {
                txn.executeSql(
                    'SELECT * from All_Deal ORDER BY rowid DESC',
                    [],
                    (tx, res) => {
                        let len = res.rows.length;
                        let results = [];
                        if (len > 0) {
                            for (let i = 0; i < len; i++) {
                                let item = res.rows.item(i);
                                results.push(item);
                            }
                            resolve({ hasData: 1, data: results });
                        } else {
                            resolve({ hasData: 0, data: results });
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

export async function findMatchedDeal(dealId, mobileDealId) {
    const results = await gettingDealData();
    const matches = results?.data?.filter(obj => {
        if (obj.dealId !== null && dealId === obj.dealId) {
            return true;
        } else if (dealId === null && mobileDealId === obj.mobileDealId) {
            return true;
        } else if (mobileDealId === obj.mobileDealId) {
            return true;
        }
        return false;
    });
    return matches;
}