import React, { useState } from 'react'
import { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'
import { openDatabase } from 'react-native-sqlite-storage'
import { useIsFocused } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { getCustomerData } from '../../../../Store/CustomerStore'

const db = openDatabase({
    name: 'customer_database',
})

const Adata = [
  { label: 'Isharia', value: '1', },
  { label: 'Subhajit', value: '2' , },
  { label: 'Ayub', value: '3' , },
  { label: 'Asfahan', value: '4' , },
  { label: 'Item 5', value: '5' , },
];

const AddProductDropdown = () => {
    const [value, setValue] = useState(null)
    const [isFocus, setIsFocus] = useState(false)
    const [mobile, setMobile] = useState(null)
    const [cusName, setCusName] = useState(null)


    const isFocussed = useIsFocused()

    const [data, setData] = useState([])
    const dispatch = useDispatch()
    const dispatching = () => {
        dispatch(getCustomerData({ customerData: { cusName, mobile } }))
    }

    console.log('data', data)

    useEffect(() => {
        getProducts()
        console.log('useEffect call')
    }, [isFocussed])
    const getCustomer = () => {
        // if(searchData && searchData.length != 0){
        //   console.log("inside search data",searchData);

        //   setAllData(searchData)
        // }
        // setShow(false)
        db.transaction(txn => {
            txn.executeSql(
                `SELECT * FROM customer_info ORDER BY id DESC`,
                [],

                (tx, res) => {
                    let len = res.rows.length
                    console.log('length', len)
                    if (len > 0) {
                        let results = []

                        for (let i = 0; i < len; i++) {
                            let item = res.rows.item(i)
                            // results[0]={customerName:'Select Customer',customerMobile:""}
                            results.push({
                                customerName: item.customerName,
                                customerMobile: item.customerMobile,
                            })
                            // results.push()
                            // console.log(results, 'july')
                            // console.log(results[i].customerName, 'june')
                            setData(results)

                            // setAllData(results)
                        }
                        // setFullData(results)
                        // console.log("full data", results[i].customerName);
                    }
                },
                error => {
                    console.log('error while GETTING', error.message)
                },
            )
        })
    }

    const getProducts = async () => {
        await db.transaction(txn => {
            txn.executeSql(
                'SELECT * from product_info ORDER BY productId ASC',
                [],

                (tx, res) => {
                    let len = res.rows.length
                    if (len > 0) {
                        let results = []

                        for (let i = 0; i < len; i++) {
                            let item = res.rows.item(i)
                            results.push({
                                id: i,
                                productId: item.productId,
                                item: item.productName,
                                productDescription: item.productDescription,
                                brandName: item.brandName,
                                category: item.category,
                                subCategory: item.subCategory,
                                sizing: item.sizing,
                                mrp: item.mrp,
                                quantity: 1,
                            })
                            setData(results)
                            // setistrue(true)
                        }
                    }
                },
                error => {
                    console.log('error while GETTING', error.message)
                },
            )
        })
    }
    console.log('mob', data)

    const _renderItem = item => {
        return (
        <View style={styles.item}>
            <Text style={styles.textItem}>{item.productDescription}</Text>
        </View>
        );
    };

    return (
        <>
            <View style={styles.DropdownProduct}>
                <View style={styles.container}>
                    {/* {renderLabel()} */}
                    <Dropdown
                        style={[styles.dropdown, isFocus && { borderColor: '#00b8ce' }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        data={data}
                        search
                        maxHeight={300}
                        // itemContainerStyle={styles.item}
                        itemTextStyle={styles.text}
                        labelField="customerName"
                        // valueField="value"
                        placeholder={!isFocus ? 'Select Product' : ''}
                        searchPlaceholder="Search..."
                        value={value}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        renderItem={item => _renderItem(item)}
                        onChange={item => {
                            setValue(item.value)
                            setMobile(item.customerMobile)
                            setCusName(item.customerName)
                            setIsFocus(false)
                            dispatching()
                        }}
                    />

                    {mobile ? (
                        <View style={styles.card}>
                            <Text style={styles.mobileText}>Mobile Number :</Text>
                            <Text style={styles.mobileNum}>{mobile}</Text>
                        </View>
                    ) : null}
                </View>
            </View>
        </>
    )
}

export default AddProductDropdown

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 16,
        color: '#000',
        // display:'flex',
        // flexDirection:'row',
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        color: '#000',
        //   backgroundColor:'grey'
    },
    button: {
        width: 100,
        // paddingBottom:50,
        alignItems: 'center',
        alignSelf: 'center',
        display: 'flex',
        backgroundColor: '#00b8ce',
        paddingVertical: 5,
        borderRadius: 4,
        height: 49,
        marginRight: 10,
        // marginBottom:10
    },

    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
        color: '#000',
    },
    selectedTextStyle: {
        fontSize: 16,
        color: '#000',
    },
    DropdownProduct: {
        // width: '70%',
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        color: '#000',
    },

    text: {
        color: '#000',
    },
    card: {
        marginTop: 20,
        color: '#000',
        paddingHorizontal: 10,
        paddingBottom: 10,
        backgroundColor: 'white',
        elevation: 2,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        borderRadius: 6,
        display: 'flex',
        flexDirection: 'row',
    },
    mobileText: {
        color: 'black',
        fontSize: 16,
        marginTop: 10,
    },
    mobileNum: {
        color: '#263238',
        fontSize: 16,
        marginTop: 10,
        paddingHorizontal: 100,
    },
})
