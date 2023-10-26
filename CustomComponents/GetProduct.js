const { openDatabase } = require("react-native-sqlite-storage")

const db = openDatabase({
    name: 'customer_database',
})

export const getProductGlobal = async () => {
    let results = []
    await db.transaction(txn => {
        txn.executeSql(
            'SELECT * from product_info ORDER BY productName',
            [],

            (tx, res) => {
                let len = res.rows.length
                if (len > 0) {
                    for (let i = 0; i < len; i++) {
                        let item = res.rows.item(i)
                        results.push({
                            ...item,
                            id: i,
                            productId: item.productId,
                            item: `${item.productName} [${item?.sizing}]`,
                            productDescription: item.productDescription,
                            brandName: item.brandName,
                            category: item.category,
                            subCategory: item.subCategory,
                            sizing: item.sizing,
                            mrp: item.mrp,
                            quantity: 1,
                            sku: item.sku,
                        })
                    }
                }
            },
            error => {
                console.log('error while GETTING', error.message)
            },
        )
    })
    return results
}