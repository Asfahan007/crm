import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Button,
  Switch,
} from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import {
  Dimensions,
} from 'react-native'
import { useState, useEffect } from 'react'
import { Formik } from 'formik'
import DatePicker from 'react-native-date-picker'
import { FloatingLabelInput } from 'react-native-floating-label-input'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import { openDatabase } from 'react-native-sqlite-storage'
import * as Yup from 'yup'
import { store } from '../../../../Store'
import { Picker } from '@react-native-picker/picker'
import DeviceInfo from 'react-native-device-info'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useRef } from 'react'
import MultiSelect from '../Deals/MultiSelect'
import AddProductDropdown from './AddProductDropdown'
import FloatingButton from '../../../../MD/components/FloatingButton'

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width
const screenWidth = Dimensions.get('window').width

const db = openDatabase({
  name: 'customer_database',
})

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required('Title is required')
    .min(2, 'Too short, title must be of 2 charecters'),
  dealName: Yup.string().required('Deal is required'),
  expiryDate: Yup.string().required('Date is required'),
  // accountName: Yup.string().required('Account Name is required'),
  // contactName: Yup.string().required('Contact Name is required'),
  owner: Yup.string().required('Owner is required'),
  quotationItem: Yup.array().of(Yup.object()).required('required'),
  stage: Yup.string().required('Stage is required'),
  notes: Yup.string().required('Purchase Term is required'),
  discountedPercentage: Yup.number()
    .min(0, 'Discount can not be less than 0')
    .max(100, 'Discount can not be more than 100'),
})

function PullOverAddQuote({ navigation }) {
  const [showDiscount, setShowDiscount] = useState(false)
  const [mobileId, setMobileId] = useState()
  const [mobileDeviceId, setMobileDeviceId] = useState()
  const [showFrom, setShowFrom] = useState(false)
  const [switchValue, setSwitchValue] = useState(false)
  const [product, setProduct] = useState(false)
  const [productData, setProductdata] = useState([])
  const [qty, setQty] = useState('')
  const refRBSheet = useRef()
  const [selected, setSelected] = React.useState('')

  const [accountName, setAccountName] = useState('')
  const [contactName, setContactName] = useState('')

  const [productList, setProductList] = useState([])
  const [reRender, setReRender] = useState(false)

  const [subtotalPrice, setsubTotalPrice] = useState(0)
  const [GSTPrice, setGSTPrice] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)

  const [dealData, setDealData] = useState([])
  const [accountData, setAccountData] = useState([])
  const [filteredAcc, setFilteredAcc] = useState([])
  const [filteredProduct, setFilteredProduct] = useState([])

  const [contactData, setContactData] = useState([])
  const [filteredContact, setFilteredContact] = useState([])

  const dataNew = [
    { id: '1', item: 'Karen' },
    { id: '2', item: 'Julio' },
    { id: '3', item: 'Brendon' },
    { id: '4', item: 'John' },
  ]
  const profile = store.getState().auth.profile.name

  let userRole = store.getState().auth.role
  // console.log('userRole', profile)

  const K_OPTIONS = [
    { id: 1, item: 'Alenza', size: '4 x 4' },
    { id: 2, item: 'BridgeStone', size: '4 x 4' },
    { id: 3, item: 'Firestone', size: '4 x 4' },
  ]

  // create table for user


  // const createTablesUser = () => {
  //   db.transaction(txn => {
  //     txn.executeSql(
  //       'CREATE TABLE IF NOT EXISTS user_info (id INTEGER PRIMARY KEY AUTOINCREMENT,territory VRACHAR(30),storeName VRACHAR(30),employeeName VRACHAR(30),fullName VARCHAR(30),title VARCHAR(20),userName VARCHAR(20),password VARCHAR(20),confirmPassword VARCHAR(20),mobileNumber VARCHAR(20),customerStatus VARCHAR(20))',
  //       [],
  //       () => {
  //         console.log('TABLE CREATED SUCCESSFULLY user')
  //       },
  //       error => {
  //         console.log('error while creating' + error.message)
  //       },
  //     )
  //   })
  // }

  const getOwner = async () => {
    await db.transaction(txn => {
      txn.executeSql(
        'SELECT * from user_info ORDER BY id DESC',
        [],

        (tx, res) => {
          let len = res.rows.length
          if (len > 0) {
            let results = []

            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              // console.log(item, 'owner')
              // results.push({
              //   id: i,
              //   productId: item.productId,
              //   item: item.productName,
              //   productDescription: item.productDescription,
              //   brandName: item.brandName,
              //   category: item.category,
              //   subCategory: item.subCategory,
              //   sizing: item.sizing,
              //   mrp: item.mrp,
              //   quantity: 1,
              // })
              // //   console.log(results, 'ooooooooooo')
              // setProductdata(results)
              // setistrue(true)
            }
          } else {
            console.log('NO ACCOUNT')
          }
        },
        error => {
          console.log('error while GETTING', error.message)
        },
      )
    })
  }

  const getDeal = () => {
    db.transaction(txn => {
      txn.executeSql(
        'Select * from All_Deal',
        [],
        (tx, res) => {
          let len = res.rows.length
          if (len > 0) {
            let results = []
            // console.log(res.rows.item(0), 'kkkkkkkkkkkk')

            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              results.push(item)
              // setAllDeal(results)
              setDealData(results)
              // console.log(results, 'kkkkkkkkkkkk')
            }
          }
        },
        error => {
          console.log('error while GETTING' + error.message)
        },
      )
    })
  }

  const getAccount = async () => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM account where createdBy is "${profile}"`,
        [],
        (tx, results) => {
          //ORDER BY id DESC
          var temp1 = []
          for (let i = 0; i < results.rows.length; ++i) {
            temp1.push(results.rows.item(i))
          }
          // console.log(temp1, 'qwsxcvfgbhn')
          setAccountData(temp1)
          let temp = []
          temp1?.map((item, index) => {
            temp.push({
              id: index,
              item: item.accountName,
              accountId: item.accountId,
            })
          })
          setFilteredAcc(temp)
        },
      )
    })
  }

  const getContact = async () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM contacts',
        [],
        (tx, results) => {
          //ORDER BY id DESC
          var temp1 = []
          for (let i = 0; i < results.rows.length; ++i) {
            temp1.push(results.rows.item(i))
          }
          // console.log(temp1, 'wwwwwwwwwwwmm')
          setContactData(temp1)
          let temp = []
          temp1?.map((item, index) => {
            if (item?.contactName != '') {
              temp.push({
                id: index,
                item: item.contactName,
                contactId: item.contactId,
                contactNumber:item.phoneNo
              })
            }
          })
          setFilteredContact(temp)
        },
      )
    })
  }

  const filterProduct = () => {
    let temp = []
    productList?.map(item => {
      temp.push({
        quotationItemId: '',
        productId: item.productId,
        productName: item.item,
        category: item.category,
        subCategory: item.subCategory,
        sizing: item.sizing,
        mrp: item.mrp,
        qty: item.quantity,
        sku: item.sku,
        total: item.mrp * item.quantity,
        quotationId: item.quotationId,
        createdBy: profile,
        createdDate: Date.now(),
        updatedBy: profile,
        updatedDate: Date.now(),
        type: '',
        productInventoryId: '',
      })
    })
    setFilteredProduct(temp)
  }

  // const filterAccountForDropdown = () => {
  //   let temp = []
  //   accountData?.map((item, index) => {
  //     temp.push({ id: index, item: item.accountName })
  //   })
  //   setFilteredAcc(temp)
  // }

  // const filterContactForDropdown = () => {
  //   let temp = []
  //   contactData?.map((item, index) => {
  //     if (item?.firstName != '') {
  //       temp.push({ id: index, item: item.firstName })
  //     }
  //   })
  //   setFilteredContact(temp)
  // }

  const addUser = values => {
    console.log('insile add user', values)
    console.log('products', filteredProduct)

    db.transaction(txn => {
      txn.executeSql(
        // 'INSERT INTO quotation (quotationId,title,dealName,expiryDate,owner,quotationItem,stage,notes,discountedPercentage,taxPercentage,totalTax,subTotal,total,accountName,accountId,contactId,createdBy,createdDate,updatedDate,updatedBy,mobileDeviceId,mobileId,offer,paymentList) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        // [
        //   '',
        //   values.title,
        //   values.dealName,
        //   values.expiryDate,
        //   values.owner,
        //   JSON.stringify(filteredProduct),
        //   values.stage,
        //   values.notes,
        //   disPrice || 0,
        //   '18%',
        //   GSTPrice,
        //   subtotalPrice,
        //   totalPrice,
        //   accountName.item,
        //   accountName.accountId,
        //   contactName.contactId,
        //   profile,
        //   Date.now(),
        //   Date.now(),
        //   profile,
        //   mobileDeviceId,
        //   mobileId,
        //   (disPrice / 100) * subtotalPrice,
        //   JSON.stringify(paymentList),
        // ],
        'INSERT INTO  quotation (quotationId,companyId,contactId,firstName,lastName,phoneNo,quotationNo,category,expiryDate,subTotal,taxPercentage,totalTax,total,paymentMethod,status,notes,storeId,storeName,accountId,accountName,createdBy,updatedBy,createdDate,updatedDate,discountedPrice,discountedPercentage,offer,sub,paymentType,fullpaymentType,paylaterType,title,dealName,owner,stage,quotationitem)VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
              [
                '',
                '',
                contactName.contactId,
                '',
                "",
                contactName.contactNumber,
                '',
                '',
                values.expiryDate,
                subtotalPrice,
                '18%',
                GSTPrice,
                totalPrice,
                i.paymentMethod,
                '',
                values.notes,
                '',
                '',
                accountName.accountId,
                accountName.item,
                profile,
                '',
                Date.now(),
                '',
                '',
                disPrice || 0,
                (disPrice / 100) * subtotalPrice,
                '',
                '',
                '',
                '',
                values.title,
                values.dealName,
                values.owner,
                values.stage,
               JSON.stringify(filteredProduct),
              ],
        (txn, res) => {
          Alert.alert(
            'Success',
            'Quote added successfully',
            [
              {
                text: 'Ok',
                onPress: () => navigation.navigate('Quote'),
              },
            ],
            { cancelable: false },
          )
          //  getCustomer();
        },
        error => {
          console.log('error while INSERTING in quotation' + error.message)
        },
      )
    })
  }
// console.log("account name",accountName);
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
                sku: item.sku,
              })
              //   console.log(results, 'ooooooooooo')
              setProductdata(results)
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

  // console.log("product data", productData);
  const getSelectedProduct = values => {
    // console.log("productssss", values)
    setProduct(values.item)
    setProductList(values)
    // console.log('itemsaaaaaaaa', values)
  }

  const SubCounter = item => {
    const counter = productList.map(val => {
      if (item.id === val.id) {
        return { ...val, quantity: val.quantity - 1 }
      } else {
        return val
      }
    })
    setProductList(counter)
  }

  const AddCounter = item => {
    const counter = productList.map(val => {
      if (item.id === val.id) {
        return { ...val, quantity: val.quantity + 1 }
      } else {
        return val
      }
    })
    setProductList(counter)
  }

  const deleteProductList = item => {
    // console.log(item, 'kkkkkkkkk')
    let tempList = productList
    productList?.map(data => {
      if (data.id === item.id) {
        let temp = productList.indexOf(item)
        // console.log(temp, 'bbbbbb')
        // if (temp > -1) {
        //   // only splice array when item is found
        //   return productList.splice(temp, 1) // 2nd parameter means remove one item only
        // }
        tempList.splice(temp, 1)
        // console.log(tempList, 'zzzzzzzz')

        return (
          setProductList(tempList), setReRender(!reRender), setPaymentList([])
        )
      }
    })
  }

  const getAccountName = values => {
    setAccountName(values)
  }

  const getContactName = values => {
    // console.log(values, 'iiiiiiiiiiiii')
    setContactName(values)
  }

  useEffect(() => {
    // createTablesUser()
    getProducts()
    getOwner()
    DeviceInfo.getAndroidId().then(androidId => {
      setMobileDeviceId(androidId)
    })
    DeviceInfo.getDevice().then(device => {
      setMobileId(device)
    })
  }, [])

  useEffect(() => {
    getDeal()
    getAccount()
    // filterAccountForDropdown()
    getContact()
    // filterContactForDropdown()
  }, [])

  const [afterDiscountPrice, setAfterDiscountPrice] = useState()
  const [remainingPrice, setRemainingPrice] = useState()

  const [disPrice, setDisPrice] = useState(0)

  useEffect(() => {
    const arr =
      productList.length > 0
        ? productList.map(ele => {
            return ele.quantity * ele.mrp
          })
        : []
    const newprice = arr.reduce((prev, current) => {
      return prev + current
    }, 0)

    setsubTotalPrice(newprice)
    setAfterDiscountPrice(newprice - (disPrice / 100) * newprice)
    setGSTPrice(((newprice - (disPrice / 100) * newprice) * 18) / 100)
    setTotalPrice(
      (
        newprice -
        (disPrice / 100) * newprice +
        ((newprice - (disPrice / 100) * newprice) * 18) / 100
      ).toFixed(2),
    )
    setRemainingPrice(
      (
        newprice -
        (disPrice / 100) * newprice +
        ((newprice - (disPrice / 100) * newprice) * 18) / 100
      ).toFixed(2),
    )
    filterProduct()
    // dispatch(
    //   getProductPrice({
    //     productALlPrice: { subtotalPrice, totalPrice, GSTPrice },
    //   }),
    // )
  }, [productList, reRender, disPrice])

  const [payment, setPayment] = useState()
  const [amount, setAmount] = useState()
  const [dueDate, setDueDate] = useState()
  const [paymentList, setPaymentList] = useState([])
  const [showCal, setShowCal] = useState(false)
  const [disabled, setDisabled] = useState(false)

  const addPayment = values => {
    // console.log(paymentList, 'ertyuiuyghbbbbbbbbb')
    let temp = {
      id: paymentList.length,
      payment: payment,
      amount: amount,
      dueDate: values.dueDate,
    }
    // console.log(paymentList, 'ooppopopopooo')
    // console.log(
    //   Number(amount) +
    //     Number((Number(remainingPrice) - Number(amount)).toFixed(2)),
    //   'yyyyuuyuuy',
    // )
    // console.log(
    //   Number(amount),
    //   (Number(remainingPrice) - Number(amount)).toFixed(2),
    //   'yyyyuuyuuy',
    // )
    if (payment && amount && values.dueDate) {
      if (paymentList.length < 5 && remainingPrice >= amount) {
        if (paymentList.length === 4 && amount != remainingPrice) {
          alert(`Please enter remaining Rs.${remainingPrice}`)
        } else {
          //if remaining price is less than 1
          if (Number(remainingPrice) - Number(amount) < 1) {
            temp.amount =
              Number(amount) +
              Number((Number(remainingPrice) - Number(amount)).toFixed(2))
            // setRemainingPrice(0)
          }
          paymentList.push(temp)
          setRemainingPrice(
            remainingPrice - amount < 1 ? 0 : remainingPrice - amount,
          )
          // console.log(remainingPrice - amount, 'qazxswedcvfr')
          setPayment(null)
          setAmount(null)
          // setDueDate('')
          values.dueDate = null
        }
      } else {
        if (paymentList.length >= 5) {
          setDisabled(true)
          alert('You can only add 5 fields')
        } else if (subtotalPrice === 0) {
          alert('Please select a product')
        } else {
          alert('Please enter correct amount')
        }
      }
    } else {
      alert('Enter all fields!')
    }

    // console.log(paymentList, 'aszxcd')
  }

  const [disableUpdate, setDisableUpdate] = useState(false)
  useEffect(() => {
    // console.log(remainingPrice, 'tyyty')
    remainingPrice == 0 ? setDisableUpdate(false) : setDisableUpdate(true)
  }, [remainingPrice])

  return (
    // <TouchableOpacity onPress={() => refRBSheet.current.open()}>
    // <View
    //   style={{
    //     flex: 1,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     position: 'absolute',
    //     backgroundColor: 'white',
    //     height: 70,
    //     bottom: -20,
    //     width: '100%',
    //     borderRadius: 40,
    //   }}
    // >
    //  <View
    //     style={{
    //       backgroundColor: 'gray',
    //       width: 40,
    //       height: 5,
    //       borderRadius: 7,
    //       marginBottom: 30,
    //     }}
    //   ></View>
    // <TouchableOpacity
    //               style={{ marginBottom: 30 }}
    //               onPress={() => refRBSheet.current.open()}
    //           >
    //               <Text>Tap to Open</Text>
    //           </TouchableOpacity>
    // <Button title="OPEN BOTTOM SHEET" onPress={() => refRBSheet.current.open()} />
    // <RBSheet
    //   ref={refRBSheet}
    //   closeOnDragDown={true}
    //   closeOnPressMask={false}
    //   customStyles={{
    //     container: {
    //       height: '60%',
    //     },
    //     wrapper: {
    //       backgroundColor: 'transparent',
    //     },
    //     draggableIcon: {
    //       backgroundColor: '#000',
    //     },
    //   }}
    // >

    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* {console.log(filteredProduct, 'qqqqqq')} */}
      <ScrollView
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'always'}
      >
        {/* <View style={[styles.card, { borderRadius: 5, marginLeft: 0 }]}> */}
        <Formik
          initialValues={{
            title: '',
            dealName: '',
            expiryDate: '',
            // accountName: accountName,
            // contactName: contactName,
            dueDate: '',
            owner: '',
            quotationItem: [],
            stage: '',
            notes: '',
            openDate: new Date(Date.now()),
            openDueDate: new Date(Date.now()),
          }}
          // validationSchema={validationSchema}
          onSubmit={values => addUser(values)}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <React.Fragment>
              {showFrom && (
                <View>
                  <DateTimePicker
                    testID="dateTimePicker"
                    timeZoneOffsetInMinutes={0}
                    value={values.openDate}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    selected={values.expiryDate}
                    onBlur={(date, event) => console.log('dateee', date, event)}
                    onChange={val => {
                      values.expiryDate = new Date(val.nativeEvent.timestamp)
                        .toISOString()
                        .slice(0, 10)
                      setShowFrom(false)
                      setDOJ(new Date(val.nativeEvent.timestamp))
                    }}
                  />
                </View>
              )}
              {/* {console.log(showCal, 'yyyyyyyyy')} */}
              {showCal && (
                <View>
                  <DateTimePicker
                    testID="dateTimePicker"
                    timeZoneOffsetInMinutes={0}
                    value={values.openDueDate}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    selected={values.dueDate}
                    onBlur={(date, event) => console.log('dateee', date, event)}
                    onChange={val => {
                      (values.dueDate = new Date(val.nativeEvent.timestamp)
                        .toISOString()
                        .slice(0, 10)),
                        setShowCal(false)
                      setDOJ(new Date(val.nativeEvent.timestamp))
                    }}
                  />
                </View>
              )}

              <View style={styles.card}>
                <View style={styles.input}>
                  <FloatingLabelInput
                    placeholder="Client"
                    label={'Quatation Title'}
                    containerStyles={styles.dropdown}
                    placeholderTextColor="grey"
                    paddingHorizontal={10}
                    paddingTop={5}
                    value={values.title}
                    onChangeText={handleChange('title')}
                  />
                  {errors.title && touched.title && (
                    <Text style={styles.error}>{errors.title}</Text>
                  )}
                </View>
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                  <View style={styles.pickerInputRow}>
                    <Picker
                      style={{
                        color: '#43628e',
                        placeholder: 'accountStatus',
                        display: 'flex',
                      }}
                      selectedValue={values.dealName}
                      onValueChange={handleChange('dealName')}
                    >
                      <Picker.Item
                        label=" Select Deal"
                        value=""
                        style={{ fontSize: 14 }}
                      />
                      {dealData
                        ? dealData?.map(item => {
                            // console.log(item, 'vvvvvvvvvvvvv')
                            return (
                              // <View>
                              //   {console.log(item, 'azxcvb')}
                              <Picker.Item
                                label={item.dealName}
                                value={item.dealName}
                                style={{ fontSize: 14 }}
                              />
                              // </View>
                            )
                          })
                        : null}
                    </Picker>

                    {errors.dealName && touched.dealName && (
                      <Text style={styles.error}>{errors.dealName}</Text>
                    )}
                  </View>
                  <View style={styles.pickerInputRow1}>
                    <FloatingLabelInput
                      placeholder="Expiry date"
                      label={'Expiry Date'}
                      containerStyles={styles.dropdown}
                      placeholderTextColor="grey"
                      paddingHorizontal={10}
                      paddingTop={5}
                      value={values.expiryDate}
                      // onChangeText={handleChange('expiryDate')}
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
                    {errors.expiryDate && touched.expiryDate && (
                      <Text style={styles.error}>{errors.expiryDate}</Text>
                    )}
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: 7,
                    width: '90%',
                    // alignItems: 'center',
                  }}
                >
                  <View
                    style={{
                      marginTop: 15,
                      marginLeft: 12,
                      borderColor: 'grey',
                      borderRadius: 4,
                      width: '47%',
                    }}
                  >
                    {/* <Picker style={{ color: '#43628e', placeholder: 'Status', display: 'flex' }}
                                                // selectedValue={values.status}
                                                // onValueChange={(value, itemIndex) => console.log(value)}
                                                >
                                                    <Picker.Item label="Account" value="" style={{ fontSize: 14 }} />
                                                    <Picker.Item label="Active" value="Active" style={{ fontSize: 14 }} />
                                                    <Picker.Item label="Inactive" value="Inactive" style={{ fontSize: 14 }} />
                                                </Picker> */}
                    {/* <SelectList
                          placeholder="Select Account"
                          searchPlaceholder="Search Owner"
                          setSelected={setSelected}
                          data={dataNew}
                          onSelect={() => console.log('ss', selected)}
                          boxStyles={{ backgroundColor: '#f1f5f7' }}
                        /> */}
                    {/* <View style={{ width: 300, marginTop: 10 }}> */}
                    <View>
                      <MultiSelect
                        onSelect={getAccountName}
                        single
                        label="Select Account"
                        K_OPTIONS={filteredAcc}
                      />
                      {errors.accountName && touched.accountName && (
                        <Text style={styles.error}>{errors.accountName}</Text>
                      )}
                    </View>
                    {/* </View> */}
                  </View>
                  <View style={{ position: 'absolute' }}></View>
                  <View
                    style={{
                      marginTop: 15,
                      marginLeft: 12,
                      borderColor: 'grey',
                      borderRadius: 4,
                      width: '47%',
                    }}
                  >
                    {/* <Picker style={{ color: '#43628e', placeholder: 'Status', display: 'flex' }}
                                                // selectedValue={values.status}
                                                // onValueChange={(value, itemIndex) => console.log(value)}
                                                >
                                                    <Picker.Item label="Contact" value="" style={{ fontSize: 14 }} />
                                                    <Picker.Item label="Active" value="Active" style={{ fontSize: 14 }} />
                                                    <Picker.Item label="Inactive" value="Inactive" style={{ fontSize: 14 }} />
                                                </Picker> */}
                    {/* <SelectList
                          placeholder="Select Contact"
                          searchPlaceholder="Search Owner"
                          setSelected={setSelected}
                          data={dataNew}
                          onSelect={() => console.log('ss', selected)}
                          boxStyles={{ backgroundColor: '#f1f5f7' }}
                        /> */}

                    <MultiSelect
                      onSelect={getContactName}
                      single
                      label="Select Contact"
                      K_OPTIONS={filteredContact}
                    />
                    {errors.contactName && touched.contactName && (
                      <Text style={styles.error}>{errors.contactName}</Text>
                    )}
                  </View>
                </View>
                <ScrollView nestedScrollEnabled={true}>
                  <View style={{ flexDirection: 'row' }}>
                    <View
                      style={{
                        marginTop: 15,
                        width: 320,
                        borderColor: 'grey',
                        borderRadius: 4,
                        marginLeft: 18,
                      }}
                    >
                      <MultiSelect
                        onSelect={getSelectedProduct}
                        multiple
                        label="Product"
                        K_OPTIONS={productData}
                      />
                      {/* {alert(JSON.stringify(errors))} */}
                      {errors.quotationItem && touched.quotationItem && (
                        <Text style={styles.error}>{errors.quotationItem}</Text>
                      )}
                      {/* <AddProductDropdown /> */}
                      {/* <MultiSelect onSelect={getSelectedProduct} multiple label='Product' K_OPTIONS={productData} /> */}
                    </View>
                  </View>
                </ScrollView>
                {/* {console.log(productList, 'aaaaaaaaaaaaa')} */}
                {productList ? (
                  <View
                    style={{
                      marginLeft: 15,
                      width: 325,
                      maxHeight: 250,
                      // marginTop: 20,
                    }}
                  >
                    <FlatList
                      nestedScrollEnabled={true}
                      contentContainerStyle={{ paddingBottom: 10 }}
                      data={productList}
                      extraData={reRender}
                      gap={10}
                      renderItem={({ item }) => {
                        return (
                          <View
                            style={[
                              styles.cardproduct,
                              { alignItems: 'center' },
                            ]}
                          >
                            <View style={{ width: '40%' }}>
                              <Text
                                style={{
                                  fontSize: 16,
                                  color: '#263238',
                                  marginTop: 5,
                                }}
                              >
                                {item.item}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 14,
                                  color: '#263238',
                                  paddingBottom: 10,
                                  marginTop: 5,
                                }}
                              >
                                {item.sizing}
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
                                        backgroundColor: '#00b8ce',
                                        position: 'relative',
                                      }}
                                      image={require('../../../../MD/assets/icon/ic_minus.png')}
                                      imageStyle={{
                                        tintColor: 'white',
                                        width: 20,
                                        height: 20,
                                      }}
                                      onPress={() => SubCounter(item)}
                                    />
                                    <Text
                                      style={{
                                        width: 25,
                                        textAlign: 'center',
                                        fontSize: 14,
                                        color: '#000',
                                      }}
                                    >
                                      {item.quantity}
                                    </Text>
                                    <FloatingButton
                                      size={20}
                                      style={{
                                        backgroundColor: '#00b8ce',
                                        position: 'relative',
                                      }}
                                      image={require('../../../../MD/assets/icon/ic_plus.png')}
                                      imageStyle={{
                                        tintColor: 'white',
                                        width: 20,
                                        height: 20,
                                      }}
                                      onPress={() => AddCounter(item)}
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
                                  ₹{item.mrp * item.quantity}
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

                <View style={{ flexDirection: 'row' }}>
                  <View style={styles.pickerInputRow}>
                    <Picker
                      style={{
                        color: '#43628e',
                        placeholder: 'Status',
                        display: 'flex',
                      }}
                      selectedValue={values.owner}
                      onValueChange={handleChange('owner')}
                    >
                      <Picker.Item
                        label="Owner"
                        value=""
                        style={{ fontSize: 14 }}
                      />
                      <Picker.Item
                        label="Karen"
                        value="Karen"
                        style={{ fontSize: 14 }}
                      />
                      <Picker.Item
                        label="Julio"
                        value="Julio"
                        style={{ fontSize: 14 }}
                      />
                      <Picker.Item
                        label="Brandon"
                        value="Brandon"
                        style={{ fontSize: 14 }}
                      />
                    </Picker>
                    {errors.owner && touched.owner && (
                      <Text style={styles.error}>{errors.owner}</Text>
                    )}
                  </View>

                  <View style={styles.pickerInputRow1}>
                    <Picker
                      style={{
                        color: '#43628e',
                        placeholder: 'Status',
                        display: 'flex',
                      }}
                      selectedValue={values.stage}
                      onValueChange={handleChange('stage')}
                    >
                      <Picker.Item
                        label="Stage"
                        value=""
                        style={{ fontSize: 16 }}
                      />
                      <Picker.Item label="Draft" value="Draft" />
                      <Picker.Item label="Shared" value="Shared" />
                      <Picker.Item label="Accepted" value="Accepted" />
                      <Picker.Item label="Rejected" value="Rejected" />
                      <Picker.Item
                        label="Changed & Shared"
                        value="Changed & Shared"
                      />
                    </Picker>
                    {errors.stage && touched.stage && (
                      <Text style={styles.error}>{errors.stage}</Text>
                    )}
                  </View>
                </View>

                <View style={styles.input}>
                  <FloatingLabelInput
                    placeholder="notes"
                    label={'Purchase Terms'}
                    containerStyles={styles.dropdown}
                    placeholderTextColor="grey"
                    paddingHorizontal={10}
                    paddingTop={5}
                    value={values.notes}
                    onChangeText={handleChange('notes')}
                  />
                  {errors.notes && touched.notes && (
                    <Text style={styles.error}>{errors.notes}</Text>
                  )}
                </View>

                <View style={[styles.input, { width: '30%' }]}>
                  <FloatingLabelInput
                    placeholder="Products"
                    label={'Discount %'}
                    containerStyles={styles.dropdown}
                    placeholderTextColor="grey"
                    paddingHorizontal={10}
                    paddingTop={5}
                    value={disPrice}
                    onChangeText={e => setDisPrice(e)}
                    keyboardType="numeric"
                    maxLength={3}
                  />
                  {/* {errors.discountedPercentage &&
                    touched.discountedPercentage && (
                      <Text style={styles.error}>
                        {errors.discountedPercentage}
                      </Text>
                    )} */}
                </View>

                {showDiscount === false ? (
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
                    <View style={{ marginTop: '1%' }}></View>
                    <TouchableOpacity
                      onPress={() => setShowDiscount(!showDiscount)}
                      style={{ marginRight: -10 }}
                    >
                      <Icon
                        name={'add-sharp'}
                        solid
                        color={'black'}
                        size={40}
                      />
                    </TouchableOpacity>
                  </View>
                ) : (
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
                    <View style={{ marginTop: '1%' }}></View>
                    <TouchableOpacity
                      onPress={() => setShowDiscount(!showDiscount)}
                      style={{ marginRight: -10 }}
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
                          ₹{subtotalPrice}
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
                          ₹{' '}
                          {disPrice > 100
                            ? 0
                            : (disPrice / 100) * subtotalPrice}
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
                          GST :
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
                          ₹ {GSTPrice}
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
                      style={{
                        fontSize: 15,
                        color: 'black',
                        fontWeight: 'bold',
                      }}
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
                      style={{
                        fontSize: 15,
                        color: 'black',
                        fontWeight: 'bold',
                      }}
                    >
                      ₹ {totalPrice}
                    </Text>
                  </View>
                </View>

                <View
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
                  <Switch
                    trackColor={{ false: 'gray', true: '#00b8ce' }}
                    thumbColor={switchValue ? '#f4f3f4' : '#f4f3f4'}
                    style={{ marginHorizontal: 5 }}
                    onValueChange={value => setSwitchValue(value)}
                    value={switchValue}
                  />
                </View>
                {switchValue && (
                  <View>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={[styles.pickerInputRow]}>
                        <FloatingLabelInput
                          placeholder="Products"
                          label={'Payment'}
                          containerStyles={styles.dropdown}
                          placeholderTextColor="grey"
                          paddingHorizontal={10}
                          paddingTop={5}
                          value={payment}
                          onChangeText={e => setPayment(e)}
                        />
                      </View>
                      <View style={[styles.pickerInputRow1]}>
                        <FloatingLabelInput
                          placeholder="Products"
                          label={'Amount'}
                          containerStyles={styles.dropdown}
                          placeholderTextColor="grey"
                          paddingHorizontal={10}
                          paddingTop={5}
                          value={amount}
                          onChangeText={e => setAmount(e)}
                        />
                      </View>
                    </View>
                    <View
                      style={[styles.pickerInputRow, { marginBottom: '3%' }]}
                    >
                      <FloatingLabelInput
                        placeholder="Products"
                        label={'Due Date'}
                        containerStyles={styles.dropdown}
                        placeholderTextColor="grey"
                        paddingHorizontal={10}
                        paddingTop={5}
                        value={values.dueDate}
                        // onChangeText={e => setDueDate(e)}
                      />
                      <TouchableOpacity onPress={() => setShowCal(true)}>
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
                      {/* {errors.dueDate && touched.dueDate && (
                        <Text style={styles.errorDate}>{errors.dueDate}</Text>
                      )} */}
                    </View>
                    <View
                      style={{
                        marginHorizontal: '5%',
                        marginTop: '0%',
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
                        Add Payment{' '}
                      </Text>
                      <TouchableOpacity
                        onPress={() => addPayment(values)}
                        disabled={disabled}
                      >
                        <Icon
                          name={'add-circle-outline'}
                          color="#00b8ce"
                          solid
                          size={25}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                <View style={{ marginHorizontal: 20, marginTop: 5 }}>
                  <FlatList
                    data={paymentList}
                    renderItem={({ item }) => {
                      return (
                        <View
                          style={{
                            width: '100%',
                            flexDirection: 'row',
                            backgroundColor: '#00b8ce',
                            paddingVertical: 15,
                            paddingHorizontal: 10,
                            marginTop: 10,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <View style={{ width: '40%' }}>
                            <Text
                              style={{
                                color: '#fff',
                                fontSize: 15,
                                fontWeight: '500',
                              }}
                            >
                              {item.payment}
                            </Text>
                          </View>
                          <View style={{ width: '30%' }}>
                            <Text
                              style={{
                                color: '#fff',
                                fontSize: 15,
                                fontWeight: '500',
                              }}
                            >
                              {item.amount}
                            </Text>
                          </View>
                          <View style={{ width: '30%' }}>
                            <Text
                              style={{
                                color: '#fff',
                                fontSize: 15,
                                fontWeight: '500',
                              }}
                            >
                              {item.dueDate}
                            </Text>
                          </View>
                        </View>
                      )
                    }}
                  />
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: -5,
                    display: 'flex',
                  }}
                >
                  <View style={[styles.button, { marginLeft: '20%' }]}>
                    {/* {console.log(disableUpdate, 'tyuioi')} */}
                    <TouchableOpacity
                      style={styles.buttonCancel}
                      onPress={handleSubmit}
                      disabled={disableUpdate}
                    >
                      <Text style={styles.texSub}>Create</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={[styles.button, { marginRight: '20%' }]}>
                    <TouchableOpacity
                      style={[
                        styles.buttonCancel,
                        { backgroundColor: '#f1f5f7' },
                      ]}
                      onPress={() => navigation.navigate('Quote')}
                    >
                      <Text style={styles.textCancel}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </React.Fragment>
          )}
        </Formik>
        {/* </View> */}
      </ScrollView>
    </View>

    // </RBSheet>
    // </View>
    // </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // paddingHorizontal: 10
  },
  button: {
    width: 100,
    marginBottom: 30,
    // marginHorizontal: '10%'
  },
  buttonCancel: {
    alignItems: 'center',
    backgroundColor: '#00b8ce',
    borderRadius: 4,
    marginTop: 20,
    height: 40,
  },
  datePickerStyle: {
    height: 50,
    width: 300,
    backgroundColor: '#f1f5f7',
    borderColor: 'gray',
    borderWidth: 0.5,
    marginTop: 25,
    borderRadius: 10,
    marginLeft: 6,
    marginBottom: 5,
  },

  txt: {
    color: '#43628e',
    marginLeft: 14,
    fontSize: 15,
  },
  txt1: {
    color: 'black',
    marginLeft: 14,
    fontSize: 16,
    top: 8,
  },
  card: {
    // margin: 10,
    color: '#000',
    paddingHorizontal: 10,
    backgroundColor: 'white',
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    borderRadius: 4,
    // alignItems:'center'
  },
  pickerInput: {
    height: 50,
    width: '90%',
    marginTop: 15,
    backgroundColor: '#f1f5f7',
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 0.5,
    borderColor: 'gray',
    color: '#000000',
    //   marginLeft: 12,
    marginRight: 5,
    marginHorizontal: '5%',
  },
  pickerInputRow: {
    height: 50,
    width: '42.5%',
    marginTop: 15,
    backgroundColor: '#f1f5f7',
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 0.5,
    borderColor: 'gray',
    color: '#000000',
    //   marginLeft: 12,
    marginRight: 5,
    // marginHorizontal: '2.5%'
    marginLeft: '5%',
  },
  pickerInputRow1: {
    height: 50,
    width: '42.5%',
    marginTop: 15,
    backgroundColor: '#f1f5f7',
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 0.5,
    borderColor: 'gray',
    color: '#000000',
    //   marginLeft: 12,
    // marginRight: 5,
    // marginHorizontal: '2.5%'
    // marginLeft:'5%',
    marginLeft: '2.5%',
  },
  input: {
    height: 50,
    width: '88.5%',
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 2,
    fontSize: 16,
    color: '#000000',
    paddingTop: 0.5,
    // marginLeft: 12,
    marginRight: 5,
    fontWeight: 200,
    marginHorizontal: '5%',
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    backgroundColor: '#f1f5f7',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    color: '#000',
    // marginBottom: -20,
    width: 300,
  },
  error: { color: 'red' },

  main: {
    alignItems: 'center',
    marginTop: 30,
    marginLeft: '0.4%',
  },
  submit: {
    width: 100,
    height: 60,
    marginTop: 5,
    marginBottom: 20,
    marginHorizontal: 45,
  },
  cancel: {
    width: 100,
    height: 60,
    marginTop: 5,
    marginBottom: 20,
  },
  texSub: {
    color: '#fff',
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  textCancel: {
    color: '#000000',
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginHorizontal: 25,
    marginTop: 20,
  },
  cardproduct: {
    margin: 4,
    color: '#000',
    paddingHorizontal: 10,
    backgroundColor: '#c0ebf0',
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    borderRadius: 4,
    flex: 1,
    flexDirection: 'row',
    display: 'flex',
  },
})

export default PullOverAddQuote
