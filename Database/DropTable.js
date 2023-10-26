import { openDatabase } from "react-native-sqlite-storage"

const db = openDatabase({
    name: 'customer_database',
})

export const dropDatabaseAndTables = () => {
    db.transaction(txn => {
        txn.executeSql(
            'DROP TABLE IF EXISTS customer_info',
            [],
            () => {
                console.log('CUSTOMER TABLE deletd successfully')
            },
            error => {
                console.log('error while creating' + error.message)
            },
        )
        txn.executeSql(
            'DROP TABLE IF EXISTS sale',
            [],
            () => {
                console.log(' SALE TABLE deletd successfully')
            },
            error => {
                console.log('error while creating' + error.message)
            },
        )
        txn.executeSql(
            'DROP TABLE IF EXISTS sale_item',
            [],
            () => {
                console.log('saleitem TABLE deletd successfully')
            },
            error => {
                console.log('error while creating' + error.message)
            },
        )
        txn.executeSql(
            'DROP TABLE IF EXISTS store_info',
            [],
            () => {
                console.log('STORE TABLE deletd successfully')
            },
            error => {
                console.log('error while creating' + error.message)
            },
        )
        txn.executeSql(
            'DROP TABLE IF EXISTS All_Deal ',
            [],
            () => {
                console.log('All_Deal TABLE  deletd successfully')
            },
            error => {
                console.log('error while creating' + error.message)
            },
        )
        txn.executeSql(
            'DROP TABLE IF EXISTS DealDetails_info',
            [],
            () => {
                console.log('TABLE deletd successfully')
            },
            error => {
                console.log('error while creating' + error.message)
            },
        )
        txn.executeSql(
            'DROP TABLE IF EXISTS deal_account',
            [],
            () => {
                console.log('TABLE  DealAccount deletd successfully')
            },
            error => {
                console.log('error while creating' + error.message)
            },
        )
        txn.executeSql(
            'DROP TABLE IF EXISTS deal_contact',
            [],
            () => {
                console.log('TABLE  DealContact deletd successfully')
            },
            error => {
                console.log('error while creating' + error.message)
            },
        )
        txn.executeSql(
            'DROP TABLE IF EXISTS account',
            [],
            () => {
                console.log(' Account TABLE deletd successfully')
            },
            error => {
                console.log('error while creating ' + error.message)
            },
        )
        txn.executeSql(
            'DROP TABLE IF EXISTS company',
            [],
            () => {
                console.log(' Company TABLE deletd successfully')
            },
            error => {
                console.log('error while creating ' + error.message)
            },
        )
        txn.executeSql(
            'DROP TABLE IF EXISTS contacts',
            [],
            () => {
                console.log('contact TABLE deletd successfully')
            },
            error => {
                console.log('error while creating' + error.message)
            },
        )
        txn.executeSql(
            'DROP TABLE IF EXISTS quotation',
            [],
            () => {
                console.log('TABLE deletd successfully of quotation')
            },
            error => {
                console.log('error while creating' + error.message)
            },
        )
        txn.executeSql(
            'DROP TABLE IF EXISTS note_info',
            [],
            () => {
                console.log(' notes TABLE deletd successfully')
            },
            error => {
                console.log(
                    'error while creating notes for contact' + error.message,
                )
            },
        )
        txn.executeSql(
            'DROP TABLE IF EXISTS attendance',
            [],
            () => {
                console.log(' attendance TABLE deletd successfully')
            },
            error => {
                console.log(
                    'error while creating notes for contact' + error.message,
                )
            },
        )
        txn.executeSql(
            'DROP TABLE IF EXISTS employee_info',
            [],
            () => {
                console.log(' Emploeyee TABLE deletd successfully')
            },
            error => {
                console.log(
                    'error while creating notes for contact' + error.message,
                )
            },
        )
        txn.executeSql(
            'DROP TABLE IF EXISTS inventory_info',
            [],
            () => {
                console.log(' inventory_info TABLE deletd successfully')
            },
            error => {
                console.log(
                    'error while creating notes for contact' + error.message,
                )
            },
        )
        txn.executeSql(
            'DROP TABLE IF EXISTS purchaseOrder_info',
            [],
            () => {
                console.log(' purchaseOrder_info TABLE deletd successfully')
            },
            error => {
                console.log(
                    'error while creating notes for contact' + error.message,
                )
            },
        )
        txn.executeSql(
            'DROP TABLE IF EXISTS shipment_info',
            [],
            () => {
                console.log(' purchaseOrder_info TABLE deletd successfully')
            },
            error => {
                console.log(
                    'error while creating notes for contact' + error.message,
                )
            },
        )
        txn.executeSql(
            'DROP TABLE IF EXISTS returnInventory',
            [],
            () => {
                console.log('returnInventory TABLE deletd successfully')
            },
            error => {
                console.log(
                    'error while returnInventory' + error.message,
                )
            },
        )
        txn.executeSql(
            'DROP TABLE IF EXISTS activity_info',
            [],
            () => {
                console.log('activity_info TABLE deletd successfully')
            },
            error => {
                console.log(
                    'error while activity_info' + error.message,
                )
            },
        )
        txn.executeSql(
            'DROP TABLE IF EXISTS company_info',
            [],
            () => {
                console.log('company_info TABLE deletd successfully')
            },
            error => {
                console.log(
                    'error while activity_info' + error.message,
                )
            },
        )
        txn.executeSql(
            'DROP TABLE IF EXISTS product_info',
            [],
            () => {
                console.log('product_info TABLE deletd successfully')
            },
            error => {
                console.log(
                    'error while product_info' + error.message,
                )
            },
        )
    })
}