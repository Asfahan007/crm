import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  FlatList,
  TouchableWithoutFeedback,
  Modal,
  Pressable,
} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import React, { useState } from 'react'
import FloatingButton from '../../MD/components/FloatingButton'
// import DatePicker from 'react-native-date-picker'
import Icon from 'react-native-vector-icons/Ionicons'
import { Picker } from '@react-native-picker/picker'
import MultiSelect from '../Deal/Deals/Deals/MultiSelect'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { useEffect } from 'react'
import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import { store } from '../../Store'
import { openDatabase } from 'react-native-sqlite-storage'
import DateTimePicker from '@react-native-community/datetimepicker'
import {
  cardContainer,
  errorMessage,
  floatingLabelContainer,
  floatingLabelContainerInternal,
  floatingLabelContainerInternalRow,
  floatingLabelContainerRow,
  multiSelectOptions,
  multiSelectOptionsRow,
  pickerInputContainer,
  pickerInputContainerRow,
  pickerItem,
  pickerItem2,
  placeholderTextColor,
  screenHeight,
} from '../CustomComponents/Style'
import CardWrapper from '../CustomComponents/CardWrapper'
import { appColor, whiteTextColor } from '../CustomComponents/Image'
import SaveAndCancelButton from '../CustomComponents/SaveAndCancelButton'
import generateUUID from '../CustomComponents/GetUUID'
import { and } from 'react-native-reanimated'

const screenWidth = Dimensions.get('window').width

const NewSale = ({ navigation, price, route }) => {
  const db = openDatabase({
    name: 'customer_database',
  })

  let invoiceNumber = Date.now()
  const [subtotalPrice, setsubTotalPrice] = useState(0)
  const [GSTPrice, setGSTPrice] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [showFrom, setShowFrom] = useState(false)
  const [showTo, setShowTo] = useState(false)
  const [customerData, setCustomerData] = useState([])
  const [producting, setProducting] = useState([])
  const [customer, setCustomers] = useState(false)
  const [payment, setPayment] = useState('')
  const [selectedTerritory, setSelectedTerritory] = useState('')
  const [selectedStore, setSelectedStore] = useState('')
  const [paymentType, setPaymentType] = useState('')
  const [fullPayType, setFullPayType] = useState('')
  const [fullPay, setFullPay] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [showDiscount, setShowDiscount] = useState(false)
  const [switchValue, setSwitchValue] = useState(false)
  const [productData, setProductdata] = useState([])
  const [territoryData, setTerritoryData] = useState([])
  const [storeData, setStoreData] = useState([])
  const [productDatabarcode, setProductdatabarcode] = useState([])
  const [barcodeKOptions, setBarcodeKOptions] = useState([])
  const [selectedOptionForProduct, setSelectedOptionForProduct] = useState([])
  const [multipleResults, setMultipleResults] = useState([])
  const isFocused = useIsFocused()
  const [reRender, setReRender] = useState(false)
  const [disPrice, setDisPrice] = useState(0)
  const [generateSaleId, setGenerateSaleid] = useState(generateUUID())
  // const [showPaynow, setShowPaynow] = useState(false)
  // const [showPaylater, setShowPaylater] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [showStore, setShowStore] = useState(true)
  const full = [{ id: 1, item: 'Full Payment' }]

  const [paymentMethod, setPaymentMethod] = useState('')

  const paymentOption = [
    { id: 1, item: 'Pay Now' },
    { id: 2, item: 'Pay Later' },
  ]

  const paymentTypeOption = [
    { id: 1, item: 'Pay in 30 days' },
    { id: 2, item: 'Pay in 60 days' },
    { id: 3, item: 'Pay in 90 days' },
  ]

  const paymentMode = [
    { id: 1, item: 'Cash' },
    { id: 2, item: 'Cheque' },
    { id: 3, item: 'Debit Card' },
    { id: 4, item: 'Credit Card' },
    { id: 5, item: 'Online' },
    { id: 6, item: 'Wallet' },
  ]

  const validationSchema = Yup.object().shape({
    invoiceDate: Yup.string().required('Date is required').label('dealStage'),
    notes: Yup.string().required('Note is required').label('Deal name'),
    paymentType:
      fullPayType === 'Pay Later'
        ? Yup.string().test(
            'isRequired',
            'Payment Later Type is required',
            () => {
              if (paymentType != '') return true
              return false
            },
          )
        : null,
    customer: Yup.string().test(
      'isRequired',
      'Customer Name is required',
      () => {
        if (selectedCustomer != '') return true
        return false
      },
    ),
    product: Yup.string().test('isRequired', 'Product is required', () => {
      if (producting.length > 0) return true
      return false
    }),
    paymentMethod:
      fullPayType === 'Pay Now'
        ? Yup.string().test('isRequired', 'Payment Method is required', () => {
            if (payment != '') return true
            return false
          })
        : null,
  })

  const pressOffer = () => {
    var myHeaders = new Headers()
    myHeaders.append('Cache-Control', 'no cache')
    myHeaders.append(
      'Authorization',
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJrYXJlbiIsInJvbGVzIjoiU1RPUkVfQ0xFUksiLCJpYXQiOjE2NjY3NzkyODQsImV4cCI6MTY2Njc5NzI4NH0.rq2zaGzcihOM0NEgHuQLNNc1zBqL7TGMXDM1hh0YhCE',
    )
    var raw = ''
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    }

    fetch(
      'https://apps.trisysit.com/posbackendapi/api/discount/list',
      requestOptions,
    )
      .then(response => response.json())
      .then(result => console.log(result))
      .catch(error => console.log('error', error))
  }

  useEffect(() => {
    getTerritory()
  }, [isFocused])

  useEffect(() => {
    getStore()
  }, [selectedTerritory])

  useEffect(() => {
    getCustomer()
  }, [selectedStore])

  useEffect(() => {
    getProductsBarcode()
  }, [route?.params?.reRenderBarcode])

  useEffect(() => {
    getProducts()
  }, [selectedStore])

  const [generateMobileSaleId, setGenerateMobileSaleId] = useState(
    generateUUID(),
  )
  const addSale = (values, item) => {
    let productId = []
    console.log('product', producting)
    // producting.map((i) => {
    //   productId.push({ "productId": i.productId, "quantity": i.quantity, "netprice": i.quantity * i.mrp, "price": i.mrp })
    // })
    producting?.map(i => {
      productId.push(i)
    })
    console.log('final product', productId)

    console.log('payload of sale', [
      {
        saleId: '',
        mobileSaleId: generateUUID(),
        customerId: selectedCustomer?.customerId || '',
        mobileCustomerId: selectedCustomer?.mobileCustomerId || '',
        companyId: store.getState().auth.companyId,
        customerName: selectedCustomer?.item || '',
        customerMobile: values.mobile || selectedCustomer?.customerMobile,
        customerEmail: values.email || selectedCustomer?.emailId,
        sub: null,
        offer: values?.offersTypes,
        invoiceNo: invoiceNumber,
        originalInvoiceNo: '',
        invoiceDate: values.invoiceDate || '',
        subTotal: subtotalPrice || '',
        finalPrice: totalPrice || '',
        discountedPrice: disPrice > 100 ? 0 : (disPrice / 100) * subtotalPrice,
        discountedPercentage: disPrice,
        taxPercentage: '18',
        totalTax: GSTPrice,
        total: totalPrice,
        paymentMethod: payment || '',
        paymentType: fullPayType || '',
        notes: values.notes || '',
        createdBy: store.getState().auth?.firstName || 'Admin',
        createdDate: '',
        updatedBy: null,
        updatedDate: null,
        accountId: '',
        type: 'Sale',
        storeId: selectedStore?.storeId || null,
        mobileStoreId: selectedStore?.mobileStoreId || null,
        storeName: selectedStore?.item || '',
        storeEmail: selectedStore?.storeEmail || '',
        storeAddress: selectedStore?.addressLine1 || '',
        city: selectedStore?.city || null,
        state: selectedStore?.state || null,
        zipCode: selectedStore?.zipCode || '',
        storePhone: selectedStore?.storePhone || null,
        storeContactName: selectedStore?.storeContactName || null,
        storeStatus: selectedStore?.storeStatus || null,
        fullpaymentType: null,
        paylaterType: paymentType,
        syncTime: null,
        lastSyncTime: null,
        cache: 0,
        saleItems: productId?.map(v => ({
          accountId: null,
          category: v?.category || null,
          createdBy: null,
          // "createdDate": v?.createdDate || null,
          createdDate: null,
          mrp: v?.mrp || null,
          productId: v?.productId || null,
          productInventoryId: v?.productInventoryId || null,
          mobileProductInventoryId: v?.mobileProductInventoryId || null,
          productName: v?.productName || null,
          qty: v?.quantity || null,
          quantityPostReturn: '1',
          saleId: null,
          saleItemId: '',
          mobileSaleItemId: generateUUID(),
          mobileSaleId: generateMobileSaleId,
          mobileStoreId: selectedStore?.mobileStoreId || null,
          sizing: v?.sizing || null,
          sku: v?.sku || null,
          storeId: selectedStore?.storeId || null,
          subCategory: v?.subCategory || null,
          total: Number(v?.quantity) * Number(v?.mrp) || null,
          type: 'Sale',
          updatedBy: null,
          updatedDate: v?.updatedDate || null,
        })),
      },
    ])

    // {
    //   productId?.map(j =>
    //     db.transaction((tx) => {
    //       tx.executeSql(
    //         'SELECT qty FROM inventory_info WHERE productInventoryId = ?',
    //         [j?.productInventoryId],
    //         (tx, results) => {
    //           for (let i = 0; i < results.rows.length; i++) {
    //             console.log(results.rows.item(i));
    //             let quantity = results.rows.item(i).qty;
    //             console.log(quantity - j.quantity)
    //             tx.executeSql(
    //               'UPDATE inventory_info SET qty=? WHERE productInventoryId=?',
    //               [quantity - j.quantity, j?.productInventoryId],
    //               (tx, results) => {
    //                 console.log('inventory item updated', results)
    //               },
    //               (error) => {
    //                 console.log('error while updating inventory item ' + error.message)
    //               }
    //             );
    //           }
    //         },
    //         (error) => {
    //           console.log(error);
    //         }
    //       );
    //     })
    //   )
    // }

    store.getState().online.isOnline
      ? fetch(
          `https://apps.trisysit.com/posbackendapi/api/syncSale/processSale/1`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer' + store.getState().auth.token,
            },
            body: JSON.stringify([
              {
                saleId: '',
                mobileSaleId: generateUUID(),
                customerId: selectedCustomer?.customerId || '',
                mobileCustomerId: selectedCustomer?.mobileCustomerId || '',
                companyId: store.getState().auth.companyId,
                customerName: selectedCustomer?.item || '',
                customerMobile:
                  values.mobile || selectedCustomer?.customerMobile,
                customerEmail: values.email || selectedCustomer?.emailId,
                sub: null,
                offer: values?.offersTypes,
                invoiceNo: invoiceNumber,
                originalInvoiceNo: '',
                invoiceDate: values.invoiceDate || '',
                subTotal: subtotalPrice || '',
                finalPrice: totalPrice || '',
                discountedPrice:
                  disPrice > 100 ? 0 : (disPrice / 100) * subtotalPrice,
                discountedPercentage: disPrice,
                taxPercentage: '18',
                totalTax: GSTPrice,
                total: totalPrice,
                paymentMethod: payment || '',
                paymentType: fullPayType || '',
                notes: values.notes || '',
                createdBy: store.getState().auth?.firstName || 'Admin',
                createdDate: '',
                updatedBy: null,
                updatedDate: null,
                accountId: '',
                type: 'Sale',
                storeId: selectedStore?.storeId || null,
                mobileStoreId: selectedStore?.mobileStoreId || null,
                storeName: selectedStore?.item || '',
                storeEmail: selectedStore?.storeEmail || '',
                storeAddress: selectedStore?.addressLine1 || '',
                city: selectedStore?.city || null,
                state: selectedStore?.state || null,
                zipCode: selectedStore?.zipCode || '',
                storePhone: selectedStore?.storePhone || null,
                storeContactName: selectedStore?.storeContactName || null,
                storeStatus: selectedStore?.storeStatus || null,
                fullpaymentType: null,
                paylaterType: paymentType,
                syncTime: null,
                lastSyncTime: null,
                cache: 0,
                saleItems: productId?.map(v => ({
                  accountId: null,
                  category: v?.category || null,
                  createdBy: null,
                  // "createdDate": v?.createdDate || null,
                  createdDate: null,
                  mrp: v?.mrp || null,
                  productId: v?.productId || null,
                  productInventoryId: v?.productInventoryId || null,
                  mobileProductInventoryId: v?.mobileProductInventoryId || null,
                  productName: v?.productName || null,
                  qty: v?.quantity || null,
                  quantityPostReturn: '1',
                  saleId: null,
                  saleItemId: '',
                  mobileSaleItemId: generateUUID(),
                  mobileSaleId: generateMobileSaleId,
                  mobileStoreId: selectedStore?.mobileStoreId || null,
                  sizing: v?.sizing || null,
                  sku: v?.sku || null,
                  storeId: selectedStore?.storeId || null,
                  subCategory: v?.subCategory || null,
                  total: Number(v?.quantity) * Number(v?.mrp) || null,
                  type: 'Sale',
                  updatedBy: null,
                  updatedDate: v?.updatedDate || null,
                })),
              },
            ]),
          },
        )
          .then(response => response.json())
          .then(result => {
            console.log('sale result', result)
            result.data?.forEach(i => {
              db.transaction(tx => {
                tx.executeSql(
                  'INSERT INTO sale (saleId,mobileSaleId, customerId,mobileCustomerId, customerName, customerEmail, customerMobile, invoiceDate,invoiceNo,category,subTotal, taxPercentage, totalTax, total, paymentMethod, status,notes, storeId,mobileStoreId,storeName, accountId, createdBy,type, discountedPrice, discountedPercentage, offer, sub, paymentType, fullpaymentType, paylaterType,isOnline)VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                  [
                    i?.saleId || '',
                    i?.mobileSaleId || '',
                    i?.customerId || '',
                    i?.mobileCustomerId || '',
                    i?.customerName || '',
                    i?.customerEmail || '',
                    i?.customerMobile || '',
                    i?.invoiceDate || '',
                    i?.invoiceNo || '',
                    i?.category || '',
                    i?.subTotal || '',
                    i?.taxPercentage || '',
                    i?.totalTax || '',
                    i?.total || '',
                    i?.paymentMethod || '',
                    i?.status || '',
                    i?.notes || '',
                    i?.storeId || '',
                    i?.mobileStoreId || '',
                    i?.storeName || '',
                    i?.accountId || '',
                    i?.createdBy || '',
                    'Sale',
                    i?.discountedPrice || '',
                    i?.discountedPercentage || '',
                    i?.offer || '',
                    i?.sub || '',
                    i?.paymentType || '',
                    i?.fullpaymentType || '',
                    i?.paylaterType || '',
                    true,
                  ],
                  (txn, res) => {
                    if (res.rowsAffected > 0) {
                      Alert.alert(
                        'Success',
                        'Sale created successfully',
                        [
                          {
                            text: 'Ok',
                            onPress: () => navigation.navigate('Menu'),
                          },
                        ],
                        { cancelable: false },
                      )
                    } else alert('Updation Failed')
                  },
                  error => {
                    console.log('all sale data incoming error ' + error.message)
                  },
                )
                {
                  i?.saleItems?.map(j => {
                    tx.executeSql(
                      'INSERT INTO sale_item (mobileSaleItemId,saleItemId,productId,productName,category,subCategory,sizing,mrp,qty,quantityPostReturn,sku,total,storeId,accountId,saleId,mobileSaleId,createdBy,updatedBy,createdDate,updatedDate,type,productInventoryId,mobileProductInventoryId)VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                      [
                        j?.mobileSaleItemId || generateUUID(),
                        j?.saleItemId || '',
                        j?.productId || '',
                        j?.productName || '',
                        j?.category || '',
                        j?.subCategory || '',
                        j?.sizing || '',
                        j?.mrp || '',
                        j?.qty || '',
                        j?.quantityPostReturn || '',
                        j?.sku || '',
                        j?.total || '',
                        j?.storeId || '',
                        j?.accountId || '',
                        i?.saleId || '',
                        i?.mobileSaleId || '',
                        j?.createdBy || '',
                        j?.updatedBy || '',
                        j?.createdDate || '',
                        j?.updatedDate || '',
                        'Sale',
                        j?.productInventoryId || '',
                        j?.mobileProductInventoryId || '',
                      ],
                      (tx, results) => {
                        console.log('sale item added', results)
                      },
                      error => {
                        console.log(
                          'error while adding sale item ' + error.message,
                        )
                      },
                    ),
                      tx.executeSql(
                        'UPDATE inventory_info SET qty=? WHERE mobileProductInventoryId=?',
                        [j?.quantityPostReturn, j?.mobileProductInventoryId],
                        (tx, results) => {
                          console.log(
                            'associate inventory_info updated offline',
                            results,
                          )
                        },
                        error => {
                          console.log(
                            'all sale data incoming error ' + error.message,
                          )
                        },
                      )
                  })
                }
              })
            })
          })
          .catch(error => console.log('api error', error))
      : db.transaction(
          tx => {
            tx.executeSql(
              'INSERT INTO sale (mobileSaleId, customerId, mobileCustomerId, customerName, customerEmail, customerMobile, invoiceDate,invoiceNo,subTotal, taxPercentage, totalTax, total, paymentMethod,notes, storeId, mobileStoreId, storeName, accountId, createdBy,type, discountedPrice, discountedPercentage, offer, sub, paymentType, fullpaymentType, paylaterType,isOnline)VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
              [
                generateSaleId,
                selectedCustomer?.customerId || '',
                selectedCustomer?.mobileCustomerId || '',
                selectedCustomer?.item || '',
                selectedCustomer?.emailId || '',
                selectedCustomer?.customerMobile || '',
                values?.invoiceDate || '',
                invoiceNumber || '',
                subtotalPrice || '',
                '18',
                GSTPrice || '',
                totalPrice || '',
                payment || '',
                values?.notes || '',
                selectedStore?.storeId || '',
                selectedStore?.mobileStoreId || '',
                selectedStore?.storeName || '',
                '',
                store.getState().auth?.firstName || 'Admin',
                'Sale',
                disPrice > 100 ? 0 : (disPrice / 100) * subtotalPrice || '',
                disPrice || '',
                values?.offersTypes || '',
                null,
                fullPayType || '',
                null,
                paymentType,
                false,
              ],
              (txn, res) => {
                if (res.rowsAffected > 0) {
                  Alert.alert(
                    'Success',
                    'Sale created offline',
                    [
                      {
                        text: 'Ok',
                        onPress: () => navigation.navigate('Menu'),
                      },
                    ],
                    { cancelable: false },
                  )
                } else alert('Updation Failed')
              },
              error => {
                console.log('all sale data incoming error ' + error.message)
              },
            )
            {
              productId?.map(v => {
                tx.executeSql(
                  'UPDATE inventory_info SET qty=? WHERE mobileProductInventoryId=?',
                  [
                    Number(v?.qty) - Number(v?.quantity),
                    v?.mobileProductInventoryId,
                  ],
                  (tx, results) => {
                    console.log(
                      'associate inventory_info updated offline',
                      results,
                    )
                  },
                  error => {
                    console.log('all sale data incoming error ' + error.message)
                  },
                ),
                  tx.executeSql(
                    'INSERT INTO sale_item (mobileSaleItemId,saleItemId,productId,productName,category,subCategory,sizing,mrp,qty,quantityPostReturn,sku,total,storeId,mobileStoreId,accountId,saleId,mobileSaleId,createdBy,updatedBy,createdDate,updatedDate,type,productInventoryId,mobileProductInventoryId)VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                    [
                      generateUUID(),
                      '',
                      v?.productId || null,
                      v?.productName || null,
                      v?.category || null,
                      v?.subCategory || null,
                      v?.sizing || null,
                      v?.mrp || '',
                      v?.quantity || '',
                      Number(v?.qty) - Number(v?.quantity) || '',
                      v?.sku || Date.now(),
                      Number(v?.quantity) * Number(v?.mrp) || null,
                      selectedStore?.storeId || null,
                      selectedStore?.mobileStoreId || null,
                      v?.accountId || null,
                      null,
                      generateSaleId,
                      store.getState().auth?.firstName || '',
                      store.getState().auth?.firstName || '',
                      v?.createdDate || '',
                      v?.updatedDate || '',
                      'Sale',
                      v?.productInventoryId || '',
                      v?.mobileProductInventoryId || null,
                    ],
                    (tx, results) => {
                      console.log('sale item added', results)
                    },
                    error => {
                      console.log(
                        'error while adding sale item ' + error.message,
                      )
                    },
                  )
              })
            }
          },
          error => {
            console.error('Error:', error.message)
          },
        )
  }

  const getTerritory = async () => {
    await db.transaction(txn => {
      txn.executeSql(
        'SELECT * from territory_info',
        [],
        (tx, res) => {
          let len = res.rows.length
          let results = []
          if (len > 0) {
            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              results.push({
                ...item,
                id: item?.territoryId || item?.mobileTerritoryId,
                item: item?.territoryName,
              })
            }
          }
          setTerritoryData(results)
        },
        error => {
          console.log('error while GETTING terr', error.message)
        },
      )
    })
  }

  const getStore = () => {
    const query = 'select * from store_info where '
    const condition = selectedTerritory?.territoryId
      ? 'territoryId=?'
      : 'mobileTerritoryId=?'
    const data =
      selectedTerritory?.territoryId || selectedTerritory?.mobileTerritoryId
    db.transaction(txn => {
      txn.executeSql(
        query + condition,
        [data],
        (tx, res) => {
          let len = res.rows.length
          let results = []
          if (len > 0) {
            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              results.push({
                ...item,
                id: item?.storeId || item?.mobileStoreId,
                item: item?.storeName,
              })
            }
          }
          setStoreData(results)
        },
        error => {
          console.log('error while GETTING store', error.message)
        },
      )
    })
  }

  const getProducts = async () => {
    const query = 'select * from inventory_info where '
    const condition =
      store.getState().auth.storeId || selectedStore?.storeId
        ? 'storeId=?'
        : 'mobileStoreId=? and mobileStoreId not in ("")'
    const data = store.getState().auth.storeId
      ? store.getState().auth.storeId
      : selectedStore?.storeId
      ? selectedStore?.storeId
      : selectedStore?.mobileStoreId
    await db.transaction(txn => {
      txn.executeSql(
        query + condition,
        [data],
        (tx, res) => {
          let len = res.rows.length
          let results = []
          if (len > 0) {
            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              results.push({
                ...item,
                item: `${item?.productName} [${item?.sizing}X${item?.qty}]`,
                id: item?.productInventoryId,
                quantity: 1,
              })
            }
          }
          setProductdata(results)
        },
        error => {
          console.log('error while GETTING inve', error.message)
        },
      )
    })
  }
console.log('proooooooooood',productData,store.getState().auth.storeId)
  const getCustomer = () => {
    const query = 'select * from customer_info where '
    const condition =
     store.getState().auth.storeId || selectedStore?.storeId
        ? 'storeId=? '
        : 'mobileStoreId=? '
    const data = store.getState().auth.storeId
      ? store.getState().auth.storeId
      : selectedStore?.storeId
      ? selectedStore?.storeId
      : selectedStore?.mobileStoreId

    db.transaction(txn => {
      txn.executeSql(query + condition, [data], (tx, res) => {
        let len = res.rows.length
        let results = []
        if (len > 0) {
          for (let i = 0; i < len; i++) {
            let item = res.rows.item(i)
            results.push({
              ...item,
              id: item?.customerId,
              item: item?.customerName,
            })
          }
        }
        setCustomerData(results)
      })
    })
  }

  const getProductsBarcode = async () => {
    console.log('getProductsBarcode call hua', route?.params?.sku)
    const query = 'select * from inventory_info where sku = ? and '
    const condition =
      store.getState().auth.storeId || selectedStore?.storeId
        ? 'storeId=?'
        : 'mobileStoreId=?'
    const data = store.getState().auth.storeId
      ? store.getState().auth.storeId
      : selectedStore?.storeId
      ? selectedStore?.storeId
      : selectedStore?.mobileStoreId
    await db.transaction(txn => {
      txn.executeSql(
        query + condition,
        [route?.params?.sku, data],
        (tx, res) => {
          let len = res.rows.length
          if (len == 1) {
            let results = []
            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              results.push({
                ...item,
                item: item?.productName,
                id: item?.productInventoryId,
                quantity: 1,
              })
            }
            setProducting([...producting, ...results])
          } else if (route?.params?.sku && len > 1) {
            let results = []
            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              results.push({
                ...item,
                item: item?.productName,
                id: item?.productInventoryId,
                quantity: 1,
              })
            }
            setMultipleResults(results)
            setModalVisible(true)
          } else if (route?.params?.sku && len == 0) {
            Alert.alert(
              'Error!',
              'Quantity out of stock',
              [
                {
                  text: 'Ok',
                },
              ],
              { cancelable: false },
            )
          } else {
            console.log('no data found')
          }
        },
        error => {
          console.log('error while GETTING barcode', error.message)
        },
      )
    })
  }
  console.log(
    'dssssssssssssssssss',
    selectedStore.storeId,
    store.getState().auth.storeId,
  )

  useEffect(() => {
    const uniqueArray = productDatabarcode.filter(
      (obj, index, self) => index === self.findIndex(t => t.id === obj.id),
    )
    setBarcodeKOptions(uniqueArray)
  }, [productDatabarcode])

  const getSelectedProduct = values => {
    console.log(values, 'product selected')
    // setProducting([...producting, ...values])
    const newProducts = [...producting]
    values.forEach(value => {
      if (!newProducts.includes(value)) {
        newProducts.push(value)
      }
    })
    setProducting(newProducts)
  }

  // const getSelectedProductbarcode = values => {
  //   console.log(values, 'product selected from barcode')
  //   // setProductingbarcode(values)
  //   // setProducting([...producting, ...values])
  //   const newProducts = [...producting];
  //   values.forEach(value => {
  //     if (!newProducts.includes(value)) {
  //       newProducts.push(value);
  //     }
  //   });
  //   setProducting(newProducts);
  // }

  const getSelectedCustomer = values => {
    console.log('account', values)
    setSelectedCustomer(values)
    var data = values.item
    setCustomers(data)
  }

  const getSelectedTerritory = values => {
    setShowStore(false)
    console.log('getSelectedTerritory', values)
    setProducting([])
    setSelectedTerritory(values)
    setTimeout(() => {
      setShowStore(true)
    }, 0)
  }

  const getSelectedStore = values => {
    console.log('getSelectedStoreeeeee', values)
    setSelectedStore(values)
    setProducting([])
  }
  // useEffect(() => {
  //  getSelectedStore()
  // }, [selectedTerritory])

  // const getSelectedStore = () => {
  //   db.transaction(txn => {
  //     txn.executeSql(
  //       'Select * fro store_info WHERE territoryId=?  or mobileTerritoryId=?',
  //       [selectedTerritory?.territoryId, selectedTerritory?.mobileTerritoryId],
  //       (tx, res) => {
  //         let len = res.rows.length
  //         if (len > 0) {
  //           let results = []

  //           for (let i = 0; i < len; i++) {
  //             let item = res.rows.item(i)
  //             results.push({
  //               ...item,
  //               id: item.storeId,
  //               item: item.storeName,
  //               mobileAccountId: item.mobileStoreId,
  //             })
  //             setSelectedStore(results)
  //             console.log('kjkjkjkjkjkjkjkj', results)
  //           }
  //         }
  //       },
  //       error => {
  //         console.log('error while GETTING' + error.message)
  //       },
  //     )
  //   })
  // }

  const fullPayment = values => {
    setFullPay(values.item)
  }

  const getPayment = values => {
    setPayment(values.item)
  }

  const getFullPayment = values => {
    setFullPayType(values.item)
    console.log('fuullllllpaaay', values.item)
    //    values.item=== 'Pay Now'? setShowPaynow(true) :values.item==='Pay Later'? setShowPaylater(true):null
    //  console.log('PPPPLLL',showPaylater)
    //  console.log('PPPPNNN',showPaynow)
  }
  const getPaymentType = values => {
    setPaymentType(values.item)
    console.log('kjkjkjkj', paymentType)
  }

  const getPaymentMethod = values => {
    setPaymentMethod(values.item)
    console.log('gggggggggg', paymentMethod)
  }

  useEffect(() => {
    const arr =
      producting.length > 0
        ? producting.map(ele => {
            return ele?.quantity * ele?.mrp
          })
        : []
    const newprice = arr.reduce((prev, current) => {
      return prev + current
    }, 0)
    console.log(newprice, 'ppppp')

    setsubTotalPrice(newprice)
    setGSTPrice(((newprice - (disPrice / 100) * newprice) * 18) / 100)
    setTotalPrice(
      (
        newprice -
        (disPrice / 100) * newprice +
        ((newprice - (disPrice / 100) * newprice) * 18) / 100
      ).toFixed(2),
    )
  }, [isFocused, producting, reRender, disPrice])

  const addCounter = item => {
    const counter = producting.map(val => {
      if (item?.id === val.id) {
        if (Number(item?.qty) > val?.quantity) {
          return { ...val, quantity: val.quantity + 1 }
        } else {
          alert(`Max ${item?.qty} quantity available in stock`)
          return val
        }
      } else {
        return val
      }
    })
    setProducting(counter)
  }

  const deleteProductList = item => {
    // console.log(item, 'kkkkkkkkk')
    let tempList = producting
    producting?.map(data => {
      if (data.id === item?.id) {
        let temp = producting.indexOf(item)
        tempList.splice(temp, 1)
        return setProducting(tempList), setPayment([]), setReRender(!reRender)
      }
    })
  }

  const subCounter = item => {
    const counter = producting.map(val => {
      console.log('vaaaaaaaaallllllll', val)
      if (item?.id === val.id && val.quantity >= 2) {
        return { ...val, quantity: val.quantity - 1 }
      } else {
        return val
      }
    })
    setProducting(counter)
  }

  const scanBarcode = () => {
    if (selectedStore?.id || store.getState().auth.storeId) {
      navigation.navigate('Barcode')
    } else {
      Alert.alert(
        'Error!',
        'Please select store to proceed',
        [
          {
            text: 'Ok',
          },
        ],
        { cancelable: false },
      )
    }
  }

  const addMultiProductSizing = item => {
    console.log('addMultiProductSizing', item)
    setProducting([...producting, item])
    setModalVisible(!modalVisible)
  }

  return (
    <CardWrapper>
      <Formik
        initialValues={{
          openDate: new Date(Date.now()),
          invoiceDate: '',
          notes: '',
          offersTypes: '',
          Discount: '',
          paymentType: '',
          customer: '',
          dateOfPayment: '',
          mobile: '',
          paymentMethod: '',
          product: '',
        }}
        validationSchema={validationSchema}
        onSubmit={values => addSale(values)}
      >
        {({ handleChange, handleSubmit, values, errors, touched }) => (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          >
            {showFrom && (
              <DateTimePicker
                testID="dateTimePicker"
                timeZoneOffsetInMinutes={0}
                value={values.openDate}
                mode="date"
                minimumDate={new Date(Date.now())}
                is24Hour={true}
                display="default"
                selected={values.invoiceDate}
                onChange={val => {
                  values.invoiceDate = new Date(val.nativeEvent.timestamp)
                    .toISOString()
                    .slice(0, 10)
                  setShowFrom(false)
                }}
              />
            )}
            {showTo && (
              <DateTimePicker
                testID="dateTimePicker"
                timeZoneOffsetInMinutes={0}
                value={values.openDate}
                mode="date"
                minimumDate={new Date(Date.now())}
                is24Hour={true}
                display="default"
                selected={values.dateOfPayment}
                onChange={val => {
                  values.dateOfPayment = new Date(val.nativeEvent.timestamp)
                    .toISOString()
                    .slice(0, 10)
                  setShowTo(false)
                }}
              />
            )}

            <View style={cardContainer}>
              {!store.getState().auth.storeId && (
                <>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View
                      style={{
                        marginTop: 7,
                        marginHorizontal: 10,
                        borderColor: 'grey',
                        borderRadius: 4,
                        flex: 1,
                      }}
                    >
                      <MultiSelect
                        onSelect={getSelectedTerritory}
                        single
                        label="Select Territory"
                        K_OPTIONS={territoryData}
                      />
                    </View>
                  </View>
                  {/* <View style={pickerInputContainer}>
                    <Picker
                      style={{
                        bottom: 3.5,
                        display: 'flex',
                      }}
                      selectedValue={values?.contactOwner}
                      onValueChange={handleChange('contactOwner')}
                    >
                      <Picker.Item
                        label={'Select Store'}
                        value=""
                        style={pickerItem}
                      />
                      {storeData.map((name, index) => (
                        <Picker.Item
                          label={name.storeName}
                          value={name?.storeId || name?.mobileStoreId}
                          key={index}
                          style={pickerItem2}
                        />
                      ))}
                    </Picker>
                  </View> */}
                  {showStore && (
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      <View
                        style={{
                          marginTop: 7,
                          marginHorizontal: 10,
                          borderColor: 'grey',
                          borderRadius: 4,
                          flex: 1,
                        }}
                      >
                        <MultiSelect
                          onSelect={getSelectedStore}
                          single
                          label={'Select Store'}
                          K_OPTIONS={storeData}
                        />
                      </View>
                    </View>
                  )}
                </>
              )}
              <View style={multiSelectOptions}>
                <MultiSelect
                  onSelect={getSelectedCustomer}
                  single
                  label="Select Customer"
                  K_OPTIONS={customerData}
                />
                {errors.customer && touched.customer && (
                  <Text style={[errorMessage, { marginBottom: -11 }]}>
                    {errors.customer}
                  </Text>
                )}
              </View>

              <View style={floatingLabelContainer}>
                <TextInput
                  style={floatingLabelContainerInternal}
                  onChangeText={handleChange('mobile')}
                  value={selectedCustomer.customerMobile || values.mobile}
                  placeholderTextColor={placeholderTextColor}
                  placeholder="Mobile Number"
                  maxLength={10}
                  keyboardType="numeric"
                />
              </View>
              {/* <ScrollView nestedScrollEnabled={true}> */}
              <View style={multiSelectOptions}>
                <MultiSelect
                  onSelect={getSelectedProduct}
                  multiple
                  label="Product"
                  K_OPTIONS={productData}
                  // selects={producting}
                />
                {errors.product && touched.product && (
                  <Text style={[errorMessage, { marginBottom: -11 }]}>
                    {errors.product}
                  </Text>
                )}
              </View>
              {/* </ScrollView> */}
              <TouchableOpacity
                style={[
                  styles.buttonbarcode,
                  { marginBottom: producting?.length > 0 ? 0 : -5 },
                ]}
                onPress={() => scanBarcode()}
              >
                <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                  <View>
                    <Text style={styles.textCancel}>Scan Barcode</Text>
                  </View>
                  <View style={{ marginLeft: 15 }}>
                    <Icon
                      name={'camera'}
                      color={whiteTextColor}
                      solid
                      size={25}
                    />
                  </View>
                </View>
              </TouchableOpacity>

              {/* {route?.params?.sku && (
                <View style={[multiSelectOptions, { marginTop: producting?.length > 0 ? 0 : 7 }]}>
                  <MultiSelect
                    onSelect={getSelectedProductbarcode}
                    multiple
                    label="Barcodes Product"
                    K_OPTIONS={barcodeKOptions}
                  // selects={producting}
                  />
                </View>
              )} */}

              {producting ? (
                <View
                  style={{
                    width: screenWidth - 70,
                    marginHorizontal: 10,
                    marginTop: 5,
                  }}
                >
                  <FlatList
                    nestedScrollEnabled={true}
                    contentContainerStyle={{ paddingBottom: 10 }}
                    data={producting}
                    // extraData={reRender}
                    gap={10}
                    renderItem={({ item }) => {
                      return (
                        <View
                          style={[styles.cardproduct, { alignItems: 'center' }]}
                        >
                          <View style={{ width: '40%' }}>
                            <Text
                              style={{
                                fontSize: 16,
                                color: '#263238',
                                marginTop: 5,
                              }}
                            >
                              {item?.item}
                            </Text>
                            <Text
                              style={{
                                fontSize: 14,
                                color: '#263238',
                                paddingBottom: 10,
                                marginTop: 5,
                              }}
                            >
                              {item?.sizing}
                            </Text>
                          </View>
                          <View
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginLeft: 10,
                            }}
                          >
                            <View style={{ width: '35%' }}>
                              {/* <Counterbutton></Counterbutton> */}
                              <View style={{}}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                  }}
                                >
                                  <FloatingButton
                                    size={20}
                                    style={{
                                      backgroundColor: appColor,
                                      position: 'relative',
                                    }}
                                    image={require('../../MD/assets/icon/ic_minus.png')}
                                    imageStyle={{
                                      tintColor: 'white',
                                      width: 20,
                                      height: 20,
                                    }}
                                    onPress={() => subCounter(item)}
                                  />
                                  <Text
                                    style={{
                                      width: 25,
                                      textAlign: 'center',
                                      fontSize: 14,
                                      color: '#000',
                                    }}
                                  >
                                    {item?.quantity}
                                  </Text>
                                  <FloatingButton
                                    size={20}
                                    style={{
                                      backgroundColor: appColor,
                                      position: 'relative',
                                    }}
                                    image={require('../../MD/assets/icon/ic_plus.png')}
                                    imageStyle={{
                                      tintColor: 'white',
                                      width: 20,
                                      height: 20,
                                    }}
                                    onPress={() => addCounter(item)}
                                  />
                                </View>
                              </View>
                            </View>
                            <View
                              style={{
                                alignSelf: 'center',
                                width: '30%',
                                marginLeft: 5,
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: 14,
                                  color: '#263238',
                                  // marginLeft: 15,
                                  // marginTop: 3,
                                }}
                              >
                                ₹{item?.mrp * item?.quantity}
                              </Text>
                            </View>
                            <View style={{ position: 'absolute', right: 25 }}>
                              <TouchableOpacity
                                onPress={() => {
                                  deleteProductList(item)
                                }}
                              >
                                <View
                                  style={{
                                    alignSelf: 'flex-end',
                                    marginLeft: 20,
                                  }}
                                >
                                  <Icon name={'trash'} solid size={30} />
                                </View>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      )
                    }}
                  />
                </View>
              ) : null}

              <View
                style={[
                  floatingLabelContainer,
                  {
                    marginTop: route?.params?.sku
                      ? 0
                      : producting != []
                      ? 0
                      : 10,
                  },
                ]}
              >
                <TextInput
                  style={floatingLabelContainerInternal}
                  onChangeText={handleChange('invoiceDate')}
                  placeholderTextColor={placeholderTextColor}
                  value={values.invoiceDate}
                  placeholder="Date"
                />
                <TouchableOpacity onPress={() => setShowFrom(!showFrom)}>
                  <View
                    style={{
                      position: 'absolute',
                      right: 10,
                      top: -42.5,
                    }}
                  >
                    <Icon name={'calendar'} solid size={30} />
                  </View>
                </TouchableOpacity>
                {errors.invoiceDate && touched.invoiceDate && (
                  <Text style={errorMessage}>{errors.invoiceDate}</Text>
                )}
              </View>

              <View style={floatingLabelContainer}>
                {/* <FloatingLabelInput
                  containerStyles={[styles.dropdown]}
                  placeholder="Notes"
                  label={'Notes'}
                  placeholderTextColor="grey"
                  paddingHorizontal={10}
                  paddingTop={5}
                  value={values.notes}
                  onChangeText={handleChange('notes')}
                /> */}
                <TextInput
                  style={floatingLabelContainerInternal}
                  value={values.notes}
                  onChangeText={handleChange('notes')}
                  placeholderTextColor={placeholderTextColor}
                  placeholder="Notes"
                />
                {errors.notes && touched.notes && (
                  <Text style={errorMessage}>{errors.notes}</Text>
                )}
              </View>
              <View style={pickerInputContainer}>
                <Picker
                  style={{ bottom: 3.5 }}
                  selectedValue={values.offersTypes}
                  onValueChange={handleChange('offersTypes')}
                >
                  <Picker.Item
                    label="Select Offers"
                    value=""
                    style={pickerItem}
                  />
                  <Picker.Item
                    style={pickerItem2}
                    label="FreeBie"
                    value="FreeBie"
                  />
                  <Picker.Item
                    style={pickerItem2}
                    label="Cash Back"
                    value="Cash Back"
                  />
                  <Picker.Item
                    style={pickerItem2}
                    label="Rewards"
                    value="Rewards"
                  />
                  <Picker.Item
                    style={pickerItem2}
                    label="Discount"
                    value="Discount"
                  />
                </Picker>
                {/* {errors.stage && touched.stage && (
                  <Text style={errorMessage}>{errors.stage}</Text>
                )} */}
              </View>
              <View style={floatingLabelContainer}>
                {/* <FloatingLabelInput
                  containerStyles={[styles.dropdown]}
                  placeholder="Discount %"
                  label={'Discount %'}
                  placeholderTextColor="grey"
                  paddingHorizontal={10}
                  paddingTop={5}
                  value={values.Discount}
                  onChangeText={handleChange('Discount')}
                /> */}
                <TextInput
                  style={floatingLabelContainerInternal}
                  value={disPrice}
                  onChangeText={e => setDisPrice(e)}
                  placeholderTextColor={placeholderTextColor}
                  placeholder="Discount %"
                  keyboardType="numeric"
                />
              </View>

              <View style={multiSelectOptions}>
                <MultiSelect
                  onSelect={fullPayment}
                  single
                  label="Payment Type"
                  K_OPTIONS={full}
                />

                {/* {errors.category && touched.category && (
                  <Text style={styles.error}>{errors.category}</Text>
                )} */}
              </View>
              {fullPay === 'Full Payment' ? (
                <View style={multiSelectOptions}>
                  <MultiSelect
                    onSelect={getFullPayment}
                    single
                    label="Full Payment Type"
                    K_OPTIONS={paymentOption}
                  />
                  {/* {errors.category && touched.category && (
                  <Text style={styles.error}>{errors.category}</Text>
                )} */}
                </View>
              ) : null}
              {fullPayType === 'Pay Now' ? (
                <View style={multiSelectOptions}>
                  <MultiSelect
                    onSelect={getPayment}
                    single
                    label="Payment Method"
                    K_OPTIONS={paymentMode}
                  />
                  {errors.paymentMethod && touched.paymentMethod && (
                    <Text style={[errorMessage, { marginBottom: -11 }]}>
                      {errors.paymentMethod}
                    </Text>
                  )}
                </View>
              ) : fullPayType === 'Pay Later' ? (
                <View style={multiSelectOptions}>
                  <MultiSelect
                    onSelect={getPaymentType}
                    single
                    label="Pay Later Type"
                    K_OPTIONS={paymentTypeOption}
                  />
                  {errors.paymentType && touched.paymentType && (
                    <Text style={[errorMessage, { marginBottom: -11 }]}>
                      {errors.paymentType}
                    </Text>
                  )}
                </View>
              ) : null}

              {paymentType === 'Pay in 30 days' ||
              paymentType === 'Pay in 60 days' ||
              paymentType === 'Pay in 90 days' ? (
                <View style={multiSelectOptions}>
                  <MultiSelect
                    onSelect={getPaymentMethod}
                    single
                    label="Payment Method"
                    K_OPTIONS={paymentMode}
                  />
                  {errors.paymentMethod && touched.paymentMethod && (
                    <Text style={[errorMessage, { marginBottom: -11 }]}>
                      {errors.paymentMethod}
                    </Text>
                  )}
                </View>
              ) : null}

              {/* {paymentType ? (
                <View style={multiSelectOptions}>
                  <MultiSelect
                    onSelect={getPayment}
                    single
                    label="Payment Method"
                    K_OPTIONS={paymentMode}
                  />
                  {errors.paymentMethod && touched.paymentMethod && (
                    <Text style={[errorMessage, { marginBottom: -11 }]}>
                      {errors.paymentMethod}
                    </Text>
                  )}
                </View>
              ) : null} */}
              {showDiscount === false ? (
                <View
                  style={{
                    alignItems: 'flex-end',
                    borderBottomWidth: 1,
                    borderBottomColor: 'gray',
                    marginHorizontal: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setShowDiscount(!showDiscount)}
                    style={{ marginRight: -5 }}
                  >
                    <Icon name={'add-sharp'} solid color={'black'} size={40} />
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={{
                    alignItems: 'flex-end',
                    borderBottomWidth: 1,
                    borderBottomColor: 'gray',
                    marginHorizontal: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setShowDiscount(!showDiscount)}
                    style={{ marginRight: -1 }}
                  >
                    <Icon
                      name={'remove-sharp'}
                      solid
                      color={'black'}
                      size={40}
                    />
                  </TouchableOpacity>
                </View>
              )}
              {showDiscount && (
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      display: 'flex',
                      marginHorizontal: '5%',
                      borderBottomWidth: 1,
                      borderBottomColor: 'gray',
                    }}
                  >
                    <View style={{ marginTop: '5%' }}>
                      <Text
                        style={{
                          fontSize: 15,
                          color: 'black',
                          fontWeight: 'bold',
                        }}
                      >
                        Sub Total :
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginHorizontal: '0%',
                        marginTop: '5%',
                        marginBottom: '5%',
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          color: 'black',
                          fontWeight: 'bold',
                        }}
                      >
                        {subtotalPrice}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      display: 'flex',
                      marginHorizontal: '5%',
                      borderBottomWidth: 1,
                      borderBottomColor: 'gray',
                    }}
                  >
                    <View style={{ marginTop: '5%' }}>
                      <Text
                        style={{
                          fontSize: 15,
                          color: 'black',
                          fontWeight: 'bold',
                        }}
                      >
                        Offer :
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginHorizontal: '0%',
                        marginTop: '5%',
                        marginBottom: '5%',
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          color: 'black',
                          fontWeight: 'bold',
                        }}
                      >
                        {' '}
                        {disPrice > 100 ? 0 : (disPrice / 100) * subtotalPrice}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      display: 'flex',
                      marginHorizontal: '5%',
                      borderBottomWidth: 1,
                      borderBottomColor: 'gray',
                    }}
                  >
                    <View style={{ marginTop: '5%' }}>
                      <Text
                        style={{
                          fontSize: 15,
                          color: 'black',
                          fontWeight: 'bold',
                        }}
                      >
                        GST (18%):
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginHorizontal: '0%',
                        marginTop: '5%',
                        marginBottom: '5%',
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          color: 'black',
                          fontWeight: 'bold',
                        }}
                      >
                        {GSTPrice}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  display: 'flex',
                  marginHorizontal: '5%',
                  borderBottomWidth: 1,
                  borderBottomColor: 'gray',
                }}
              >
                <View style={{ marginTop: '5%' }}>
                  <Text
                    style={{ fontSize: 15, color: 'black', fontWeight: 'bold' }}
                  >
                    Total :
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginHorizontal: '0%',
                    marginTop: '5%',
                    marginBottom: '5%',
                  }}
                >
                  <Text
                    style={{ fontSize: 15, color: 'black', fontWeight: 'bold' }}
                  >
                    {totalPrice}
                  </Text>
                </View>
              </View>

              {/* <View
                style={{
                  marginHorizontal: '5%',
                  marginTop: '3%',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    color: 'black',
                    fontWeight: 'bold',
                  }}
                >
                  Payment Schedule{' '}
                </Text>
                <TouchableWithoutFeedback onPress={() => setSwitchValue(!switchValue)}>
                  <Switch
                    trackColor={{ false: 'gray', true: '#00b8ce' }}
                    thumbColor={switchValue ? '#f4f3f4' : '#f4f3f4'}
                    style={{ marginHorizontal: 5 }}
                    onValueChange={() => setSwitchValue(!switchValue)}
                    value={switchValue}
                  />
                </TouchableWithoutFeedback>
              </View> */}
              {switchValue && (
                <View>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={pickerInputContainerRow}>
                      <Picker
                        style={{
                          color: '#43628e',
                          placeholder: 'Status',
                          display: 'flex',
                          bottom: 6,
                        }}
                        selectedValue={values.paymentinfo}
                        onValueChange={handleChange('paymentinfo')}
                      >
                        <Picker.Item
                          label="Payment"
                          value=""
                          style={{ fontSize: 14 }}
                        />
                        <Picker.Item
                          label="payment 1"
                          value="payment 1"
                          style={{ fontSize: 14 }}
                        />
                        <Picker.Item
                          label="payment 2"
                          value="payment 2"
                          style={{ fontSize: 14 }}
                        />
                        <Picker.Item
                          label="payment 3"
                          value="payment 3"
                          style={{ fontSize: 14 }}
                        />
                      </Picker>
                    </View>
                    <View
                      style={[
                        floatingLabelContainerRow,
                        { width: '50%', marginBottom: 5 },
                      ]}
                    >
                      <TextInput
                        style={floatingLabelContainerInternalRow}
                        onChangeText={handleChange('dateOfPayment')}
                        placeholderTextColor={placeholderTextColor}
                        value={values.dateOfPayment}
                        placeholder="Payment Date"
                      />
                      <TouchableOpacity onPress={() => setShowTo(true)}>
                        <View
                          style={{
                            position: 'absolute',
                            right: 10,
                            top: -42.5,
                          }}
                        >
                          <Icon name={'calendar'} solid size={30} />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={multiSelectOptions}>
                    <MultiSelect
                      onSelect={getPayment}
                      single
                      label="Payment Mode"
                      K_OPTIONS={paymentMode}
                    />
                  </View>
                </View>
              )}

              <SaveAndCancelButton
                handleSubmit={handleSubmit}
                saveTitle={'Proceed'}
                navigation={navigation}
                screenName="Menu"
              />
            </View>
            {/* </> */}
          </TouchableOpacity>
        )}
      </Formik>
      {modalVisible && multipleResults ? (
        <View style={styles.centeredView}>
          {console.log('multipleResults', multipleResults)}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.')
              setModalVisible(!modalVisible)
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: 'lightgray',
                    padding: 10,
                    width: screenWidth - 150,
                    maxHeight: screenHeight - 100,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      backgroundColor: 'lightgray',
                      padding: 10,
                      marginBottom: 5,
                    }}
                  >
                    <Text style={[styles.modalText, { fontWeight: 'bold' }]}>
                      Size
                    </Text>
                    <Text style={[styles.modalText, { fontWeight: 'bold' }]}>
                      Qty
                    </Text>
                  </View>
                  {multipleResults?.map((item, index) => (
                    <TouchableOpacity
                      onPress={() => addMultiProductSizing(item)}
                    >
                      <View
                        key={index}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          padding: 5,
                          borderBottomWidth: 1,
                          borderBottomColor: 'gray',
                          padding: 10,
                        }}
                      >
                        <Text style={styles.modalText}>{item?.sizing}</Text>
                        <Text style={styles.modalText}>{item?.qty}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <View
                    style={{
                      height: 30,
                      width: 60,
                      backgroundColor: 'lightgray',
                      marginTop: 15,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: -5,
                    }}
                  >
                    <Text style={[styles.modalText, { fontWeight: 'bold' }]}>
                      Close
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      ) : null}
    </CardWrapper>
  )
}

export default NewSale

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    textAlign: 'center',
  },
  card: {
    margin: 4,
    color: '#000',
    paddingHorizontal: 10,
    backgroundColor: 'white',
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    borderRadius: 4,
    flex: 1,
  },
  cardproduct: {
    margin: 4,
    color: '#000',
    paddingHorizontal: 10,
    backgroundColor: '#D3D3D3',
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    borderRadius: 4,
    flex: 1,
    flexDirection: 'row',
    display: 'flex',
  },
  button: {
    width: 100,
    marginBottom: 30,
  },
  buttonCancel: {
    alignItems: 'center',
    backgroundColor: appColor,
    borderRadius: 4,
    marginTop: 20,
    height: 40,
  },
  buttonbarcode: {
    width: screenWidth - 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    marginRight: 5,
    backgroundColor: appColor,
    borderRadius: 4,
    height: 40,
    marginTop: 10,
  },
  texbar: {
    color: '#fff',
    textAlign: 'center',
    justifyContent: 'center',
  },
  texSub: {
    color: '#fff',
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  textCancel: {
    color: whiteTextColor,
    // textAlign: 'center',
    // justifyContent: 'center',
    // marginTop: 10
  },
  datePickerStyle: {
    height: 50,
    width: 300,
    backgroundColor: '#f1f5f7',
    borderColor: 'grey',
    borderWidth: 0.5,
    marginTop: 20,
    borderRadius: 8,
    marginLeft: 25,
  },
  txt: {
    color: 'black',
    marginLeft: 14,
    fontSize: 16,
  },
  paymentPicker: {
    height: 50,
    width: 140,
    backgroundColor: '#f1f5f7',
    borderColor: 'grey',
    borderWidth: 0.5,
    marginTop: 20,
    borderRadius: 8,
    marginLeft: 175,
    marginTop: -50,
  },
  txt1: {
    color: '#43628e',
    marginLeft: 14,
    fontSize: 16,
  },
  input: {
    height: 50,
    width: 300,
    marginTop: 25,
    backgroundColor: '#fff',
    borderRadius: 2,
    fontSize: 16,
    color: '#000000',
    paddingTop: 0.5,
    marginLeft: 25,
    marginRight: 5,
    fontWeight: 200,
  },
  inputpayment: {
    height: 50,
    width: 140,
    marginTop: -50,
    backgroundColor: '#fff',
    borderRadius: 2,
    fontSize: 16,
    color: '#000000',
    paddingTop: 0.5,
    marginLeft: 175,
    marginRight: 5,
    fontWeight: 200,
  },
  inputnotes: {
    height: 50,
    width: 300,
    marginTop: 25,
    backgroundColor: '#fff',
    borderRadius: 2,
    fontSize: 16,
    color: '#000000',
    paddingTop: 0.5,
    marginLeft: 25,
    marginRight: 5,
    fontWeight: 200,
  },
  selectbox: {
    marginTop: 15,
    width: 300,
    marginLeft: 25,
    borderColor: 'grey',
    borderRadius: 4,
  },
  selectboxBarpro: {
    marginTop: -15,
    width: 300,
    marginLeft: 25,
    borderColor: 'grey',
    borderRadius: 4,
  },
  selectboxCustomer: {
    marginTop: 15,
    width: 260,
    marginLeft: 25,
    borderColor: 'grey',
    borderRadius: 4,
  },
  inputoffer: {
    height: 50,
    width: 140,
    marginTop: -50,
    backgroundColor: '#fff',
    borderRadius: 2,
    fontSize: 16,
    color: '#000000',
    paddingTop: 0.5,
    marginLeft: 185,
    fontWeight: 200,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 15,
    color: '#000',
    backgroundColor: '#f1f5f7',
  },
  dropdownpayment: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 15,
    color: '#000',
    backgroundColor: '#f1f5f7',
  },
  pickerInput: {
    height: 50,
    width: 140,
    marginTop: 25,
    backgroundColor: '#f1f5f7',
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    paddingLeft: 10,
    borderColor: 'gray',
    color: '#000000',
    marginLeft: 25,
    marginRight: 5,
  },
})
