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
  Image,
} from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import { useState, useEffect } from 'react'
import { Formik } from 'formik'
import DatePicker from 'react-native-date-picker'
import { FloatingLabelInput } from 'react-native-floating-label-input'
import {
  FlatList,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler'
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
import {
  cardContainer,
  errorMessage,
  floatingLabelContainer,
  floatingLabelContainerInternal,
  floatingLabelContainerInternalRow,
  floatingLabelContainerRow,
  multiSelectOptions,
  multiSelectOptionsRow,
  pickerInputContainerRow,
  pickerInputContainer,
  pickerItem,
  pickerItem2,
  placeholderTextColor,
  screenWidth,
} from '../../../../Containers/CustomComponents/Style'
import SaveAndCancelButton from '../../../../Containers/CustomComponents/SaveAndCancelButton'
import CardWrapper from '../../../../Containers/CustomComponents/CardWrapper'
import { hasProduct } from '../../../../Containers/IsAvailable/IsAvailable'
import { getProductGlobal } from '../../../../Containers/CustomComponents/GetProduct'
import { useLayoutEffect } from 'react'
import {
  appColor,
  textColor,
} from '../../../../Containers/CustomComponents/Image'
import { getUsers } from '@/Containers/CustomComponents/UsernameTable'
import generateUUID from '@/Containers/CustomComponents/GetUUID'
import { useIsFocused } from '@react-navigation/native'

const db = openDatabase({
  name: 'customer_database',
})

function AddQuote({ navigation, route }) {
  const quoteData = route?.params
  console.log('add/edit quote route', route)
  const [showDiscount, setShowDiscount] = useState(false)
  const [showFrom, setShowFrom] = useState(false)
  const [switchValue, setSwitchValue] = useState(false)
  const [product, setProduct] = useState(false)
  const [productDataGlobal, setProductDataGlobal] = useState([])
  const [qty, setQty] = useState('')
  const [addItem, setAddItem] = useState({
    item: '',
    sizing: '',
    mrp: '',
    quantity: 0,
  })
  const isOnline = store.getState().online.isOnline
  const [accountName, setAccountName] = useState([])
  const [dealName, setDealName] = useState('')
  const [mobileDealsId, setMobileDealsId] = useState('')
  const [dealIds, setDealIds] = useState([])

  const [ownerName, setOwnerName] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactData, setContactData] = useState([])
  const [contactnames, setContactNames] = useState([])
  const [dealsId, setDealsId] = useState('')


  const [productList, setProductList] = useState([])
  const [productListEdit, setProductListEdit] = useState(
    quoteData ? JSON.parse(quoteData?.quotationItem) : [],
  )
  const [reRender, setReRender] = useState(false)

  const [subtotalPrice, setsubTotalPrice] = useState(0)
  const [GSTPrice, setGSTPrice] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const [selectedMobileAccountId, setSelectedMobileAccountId] = useState('')
  const [selectedMobileContactId, setSelectedMobileContactId] = useState('')

  const [dealData, setDealData] = useState([])
  const [filteredAcc, setFilteredAcc] = useState([])
  const [filteredProduct, setFilteredProduct] = useState([])
  const [filteredContact, setFilteredContact] = useState([])

  const [afterDiscountPrice, setAfterDiscountPrice] = useState()
  const [remainingPrice, setRemainingPrice] = useState()

  const [companyData, setCompanyData] = useState([])
  const [companyValue, setCompanyValue] = useState()
  const [companyName, setCompanyName] = useState('')
  const [companyN, setCompanyN] = useState([])
  const [companyId, setCompanyId] = useState(store.getState().auth.companyId)

  const [payment, setPayment] = useState()
  const [amount, setAmount] = useState()
  const [paymentList, setPaymentList] = useState([])
  const [showCal, setShowCal] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [disPrice, setDisPrice] = useState(route?.params?.discountedPercentage || 0)
  const dataNew = [
    { id: '1', item: 'Karen' },
    { id: '2', item: 'Julio' },
    { id: '3', item: 'Brendon' },
    { id: '4', item: 'John' },
  ]
  const profile = store.getState().auth.profile.name
  let loginToken = store.getState().auth.token
  const K_OPTIONS = [
    { id: 1, item: 'Alenza', size: '4 x 4' },
    { id: 2, item: 'BridgeStone', size: '4 x 4' },
    { id: 3, item: 'Firestone', size: '4 x 4' },
  ]

  const [selectowner, setSelectowner] = useState('')
  const generateQuotationId = generateUUID()

  // const [contacts, setContacts] = useState(
  //   route?.params?.contactId
  //     ? contactData.map(v => ({
  //         item: v.contactName,
  //         id: v.contactId,
  //       }))
  //     : [],
  // )
  // const [contacts, setContacts] = useState(


  //   contactnames.map(v => ({
  //     ...v,
  //     id: v.id || v.mobileContactId,
  //     item: v.item,
  //   })),
  // )
  const contacts = {
    id: contactnames[0]?.id || contactData[0]?.id, item: contactnames[0]?.item || contactData[0]?.item,
  }

  console.log('dddddddddddddddddLLLLLLLLLLLLLLL', dealsId)
  console.log('ghghghghghg', contacts)
  const owner = getUsers()
  const isFocused = useIsFocused()

  // const ownerData = [
  //   { id: 1, item: 'Karen', userName: 'karen_crm@trisysit.com' },
  //   { id: 2, item: 'Brandon', userName: 'brandon_crm@trisysit.com' },
  // ]

  const dealEdit = {
    id: route?.params?.quotationId,
    item: route?.params?.dealName,
  }
  const currentDate = new Date(Date.now()).toISOString()
    .slice(0, 10)

  useEffect(() => {
    getCompanyDropdown()
  }, [isFocused])
  useEffect(() => {
    getCompanyName()
  }, [companyData])

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .required('Title is required')
      .min(2, 'Too short, title must be of 2 charecters'),
    // dealName: dealName
    //   ? Yup.string().test('isRequired', 'Is required', () => {
    //     if (dealName != '') return true
    //     return false
    //   })
    //   : Yup.string().required('Deal is required'),
    // expiryDate: Yup.string().required('Date is required'),
    expiryDate: Yup.mixed().test(
      'Exp Close date must not be earlier than current date',
      (value) => {
        if (currentDate <= value)
          return true
      },
    ),
    // accountName: Yup.string().required('Account Name is required'),
    // contactName: Yup.string().required('Contact Name is required'),
    // owner: Yup.string().required('Owner is required'),
    // quotationItem: Yup.array().of(Yup.object()).required('required'),
    stage: Yup.string().required('Stage is required'),
    notes: Yup.string().required('Purchase Term is required'),
   
    // discountedPercentage: Yup.number()
    //     .min(0, 'Discount can not be less than 0')
    //     .max(100, 'Discount can not be more than 100'),
  })
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: route?.params ? 'Edit Quote' : 'Add Quote',
    })
  }, [route?.params])

  useEffect(() => {
    getContactNames()
  }, [quoteData])

  const companyEdit = {
    id: route?.params?.companyId,
    item: companyN[0]?.item,
  }

  const getselectedProducts = () => {
    let temp = []
    console.log("productListEdit", productListEdit)
    productListEdit?.map((item, index) => {
      temp.push({
        ...item,
        id: index,
        item: item.productName,
        quantity: Number(item.qty),
      })
    })
    setProductList(temp)
  }

  const getDeal = () => {
    db.transaction(txn => {
      txn.executeSql(
        'Select * from All_Deal where companyId=?',
        [companyId],
        (tx, res) => {
          let len = res.rows.length
          if (len > 0) {
            let results = []
            // console.log(res.rows.item(0), 'kkkkkkkkkkkk')

            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              results.push({
                ...item,
                id: item.dealId,
                item: item.dealName,
              })
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
  console.log('deaaaDaaaaataaa', dealData)

  const getContactNames = () => {
    db.transaction(txn => {
      txn.executeSql(
        'Select * from deal_contact WHERE dealId=? or mobileDealId=?',
        [dealsId, mobileDealsId],
        (tx, res) => {
          let len = res.rows.length
          if (len > 0) {
            let results = []

            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              results.push({
                ...item,
                id: item.contactId,
                item: item.contactName,
                mobileContactId: item.mobileContactId,
              })
              setContactData(results)
            }
          }
        },
        error => {
          console.log('error while GETTING' + error.message)
        },
      )
    })
  }
  const getContacts = () => {
    console.log('gkgkgkgkg', route?.params?.contactId, route?.params?.mobileContactId)
    db.transaction(txn => {
      txn.executeSql(
        'Select * from deal_contact WHERE  mobileContactId=? and mobileContactId not in ("") or contactId=?',
        [route?.params?.mobileContactId, route?.params?.contactId],
        (tx, res) => {
          let len = res.rows.length
          if (len > 0) {
            let results = []

            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              results.push({
                id: item.contactId,
                item: item.contactName,
                mobileContactId: item.mobileContactId,
              })
              setContactNames(results)
            }
          }
        },
        error => {
          console.log('error while GETTING' + error.message)
        },
      )
    })
  }
  console.log('wfwdy', contactData)
  console.log('eeeeeeeeeeeeeeeeeeeeeee', contactnames)

  const getAccountName = () => {
    db.transaction(txn => {
      txn.executeSql(
        'Select * from deal_account WHERE dealId=?  or mobileDealId=?',
        [dealsId, mobileDealsId],
        (tx, res) => {
          let len = res.rows.length
          if (len > 0) {
            let results = []

            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              results.push({
                ...item,
                id: item.accountId,
                item: item.accountName,
                mobileAccountId: item.mobileAccountId,
              })
              setAccountName(results)
              console.log('kjkjkjkjkjkjkjkj', results)
            }
          }
        },
        error => {
          console.log('error while GETTING' + error.message)
        },
      )
    })
  }
  console.log('name of the account', accountName)
  const getDealIds = () => {
    db.transaction(txn => {
      txn.executeSql(
        'Select * from All_Deal WHERE dealName=?',
        [route?.params?.dealName],
        (tx, res) => {
          let len = res.rows.length
          if (len > 0) {
            let results = []

            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              results.push({
                dealId: item.dealId,
                mobileDealId: item.mobileDealId,
                dealOwner: item.dealOwner,
              })
              setDealsId(results[0].dealId)
              setMobileDealsId(results[0].mobileDealId)
              setDealIds(results)
            }
          }
        },
        error => {
          console.log('error while GETTING' + error.message)
        },
      )
    })
  }

  useEffect(() => {
    getDealIds()
  }, [])
  console.log('llllllllllllllll', dealIds[0]?.dealOwner)
  // const getAccount = async () => {
  //     db.transaction(tx => {
  //         tx.executeSql(
  //             `SELECT * FROM account where createdBy is "${profile}"`,
  //             [],
  //             (tx, results) => {
  //                 //ORDER BY id DESC
  //                 var temp1 = []
  //                 for (let i = 0; i < results.rows.length; ++i) {
  //                     temp1.push(results.rows.item(i))
  //                 }
  //                 // console.log(temp1, 'qwsxcvfgbhn')
  //                 setAccountData(temp1)
  //                 let temp = []
  //                 temp1?.map((item, index) => {
  //                     temp.push({
  //                         id: index,
  //                         item: item.accountName,
  //                         accountId: item.accountId,
  //                     })
  //                 })
  //                 setFilteredAcc(temp)
  //             },
  //         )
  //     })
  // }

  // const getContact = async () => {
  //     db.transaction(tx => {
  //         tx.executeSql(
  //             'SELECT * FROM contacts',
  //             [],
  //             (tx, results) => {
  //                 //ORDER BY id DESC
  //                 var temp1 = []
  //                 for (let i = 0; i < results.rows.length; ++i) {
  //                     temp1.push(results.rows.item(i))
  //                 }
  //                 // console.log(temp1, 'wwwwwwwwwwwmm')
  //                 setContactData(temp1)
  //                 let temp = []
  //                 temp1?.map((item, index) => {
  //                     if (item?.contactName != '') {
  //                         temp.push({
  //                             id: index,
  //                             item: item.contactName,
  //                             contactId: item.contactId,
  //                             contactNumber: item.phoneNo
  //                         })
  //                     }
  //                 })
  //                 setFilteredContact(temp)
  //             },
  //         )
  //     })
  // }
  const getCompanyName = () => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * from company_info WHERE companyId=?',
        [route?.params?.companyId],
        (tx, res) => {
          let len = res.rows.length
          if (len > 0) {
            let results = []
            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              results.push({
                item: item?.companyName,
              })
            }
            setCompanyN(results)
          }
        },
        error => {
          console.log('error while GETTING', error.message)
        },
      )
    })
  }
  console.log('comNameeee', companyN[0])

  const getCompanyDropdown = () => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * from company_info ORDER BY companyName',
        [],
        (tx, res) => {
          console.log('aayaaaa')
          let len = res.rows.length
          if (len > 0) {
            let results = []
            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              results.push({
                id: item?.companyId,
                item: item?.companyName,
              })
            }
            setCompanyData(results)
          }
        },
        error => {
          console.log('error while GETTING', error.message)
        },
      )
    })
  }

  useEffect(() => {
    let matchCompany = companyData?.filter(function (obj) {
      return obj.id === route?.params?.companyId
    })[0]?.item
    setCompanyName(matchCompany)
  }, [companyData])

  const filterProduct = () => {
    let temp = []
    productList?.map(item => {
      temp.push({
        mobileQuotationItemId:
          item?.mobileQuotationItemId || generateUUID() || '',
        quotationItemId: item?.quotationItemId || '',
        productId: item.productId || '',
        productName: item?.productName,
        category: item.category || '',
        subCategory: item.subCategory || '',
        sizing: item.sizing || '',
        mrp: item.mrp || '',
        qty: item.quantity,
        sku: item.sku,
        total: item.mrp * item.quantity,
        quotationId: item.quotationId,
        createdBy: profile,
        createdDate: Date.now(),
        updatedBy: profile,
        updatedDate: Date.now(),
        type: item?.type || '',
        productInventoryId: item?.productInventoryId || '',
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
    console.log('Valuuuuuues', values)
    console.log('add quote payload', [
      {
        quotationId: quoteData?.quotationId || '',
        offer: quoteData?.offer || disPrice,
        sub: '',
        contactId: quoteData?.contactId || contactData[0]?.id || '',
        firstName: quoteData?.firstName || contactData[0]?.item || '',
        lastName: '',
        phoneNo: quoteData?.phoneNo || '8768790877',
        accountId: accountName[0]?.id || quoteData?.accountId || '',
        accountName: accountName[0]?.item || quoteData?.accountName || '',
        title: values.title || quoteData?.title || '',
        dealName: dealName || quoteData?.dealName || '',
        owner: values.owner || quoteData?.owner || ownerName || '',
        stage: values.stage || quoteData?.stage || '',
        quotationNo:
          quoteData?.quotationNo ||
          Math.floor(10000000000 + Math.random() * 10000000000),
        expiryDate: values.expiryDate || '',
        subTotal: subtotalPrice || quoteData?.subTotal || '',
        finalPrice: quoteData?.total || totalPrice,
        discountedPrice:
          disPrice > 100
            ? 0
            : (disPrice / 100) * subtotalPrice || quoteData?.discountedPrice,
        discountedPercentage: disPrice || quoteData?.discountedPercentage || '',
        taxPercentage: '18',
        totalTax: quoteData?.totalTax || GSTPrice,
        total: totalPrice || quoteData?.total,
        paymentMethod: '',
        paymentType: '',
        notes: values.notes || quoteData?.notes || '',
        createdBy: profile || '',
        createdDate: '',
        updatedBy: '',
        updatedDate: '',
        storeId: '',
        storeName: '',
        storeEmail: '',
        storeAddress: '',
        city: '',
        state: '',
        zipCode: '',
        storePhone: '',
        storeContactName: contactName.contactNumber || '',
        storeStatus: '',
        category: '',
        subCategory: '',
        sku: '',
        productName: '',
        sizing: '',
        quotationItemId: '',
        productId: '',
        mrp: '',
        qty: '',
        fullpaymentType: '',
        paylaterType: '',
        status: '',
        quotationItem: filteredProduct || '',
        mobileAccountId:
          accountName[0].mobileAccountId || route?.params?.mobileAccountId,
        mobileContactId:
          contactName?.mobileContactId ||
          route?.params?.mobileContactId,
        companyId: companyId || route?.params?.companyId || store.getState().auth.companyId || '',
      },
    ])
    isOnline
      ? fetch(
        `https://apps.trisysit.com/posbackendapi/api/syncQuotation/processQuotation/1`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer' + loginToken,
          },
          body: JSON.stringify([
            {
              quotationId: quoteData?.quotationId || '',
              offer: quoteData?.offer || disPrice,
              sub: '',
              contactId: quoteData?.contactId || contactData[0]?.id || '',
              firstName: quoteData?.firstName || contactData[0]?.item || '',
              lastName: '',
              phoneNo: quoteData?.phoneNo || '8768790877',
              accountId: accountName[0]?.id || quoteData?.accountId || '',
              accountName:
                accountName[0]?.item || quoteData?.accountName || '',
              title: values.title || quoteData?.title || '',
              dealName: dealName || quoteData?.dealName || '',
              owner: values.owner || quoteData?.owner || ownerName || '',
              stage: values.stage || quoteData?.stage || '',
              quotationNo:
                quoteData?.quotationNo ||
                Math.floor(10000000000 + Math.random() * 10000000000),
              expiryDate: values.expiryDate || '',
              subTotal: subtotalPrice || quoteData?.subTotal || '',
              finalPrice: quoteData?.total || totalPrice,
              discountedPrice:
                disPrice > 100
                  ? 0
                  : (disPrice / 100) * subtotalPrice ||
                  quoteData?.discountedPrice,
              discountedPercentage:
                disPrice || quoteData?.discountedPercentage || '',
              taxPercentage: '18',
              totalTax: quoteData?.totalTax || GSTPrice,
              total: totalPrice || quoteData?.total,
              paymentMethod: '',
              paymentType: '',
              notes: values.notes || quoteData?.notes || '',
              createdBy: profile || '',
              createdDate: '',
              updatedBy: '',
              updatedDate: '',
              storeId: '',
              storeName: '',
              storeEmail: '',
              storeAddress: '',
              city: '',
              state: '',
              zipCode: '',
              storePhone: '',
              storeContactName: contactName.contactNumber || '',
              storeStatus: '',
              category: '',
              subCategory: '',
              sku: '',
              productName: '',
              sizing: '',
              quotationItemId: '',
              productId: '',
              mrp: '',
              qty: '',
              fullpaymentType: '',
              paylaterType: '',
              status: '',
              quotationItem: filteredProduct || '',
              mobileAccountId:
                accountName[0].mobileAccountId || route?.params?.mobileAccountId,
              mobileContactId:
                contactName?.mobileContactId ||
                route?.params?.mobileContactId,
              companyId:
                companyId || route?.params?.companyId || '',
            },
          ]),
        },
      )
        .then(response => response.json())
        .then(result => {
          console.log('add quote result', result)
          result.data?.forEach(i => {
            db.transaction(txn => {
              txn.executeSql(
                'INSERT OR REPLACE INTO  quotation (mobileQuotationId,quotationId,companyId,contactId,firstName,lastName,phoneNo,quotationNo,category,expiryDate,subTotal,taxPercentage,totalTax,total,paymentMethod,status,notes,storeId,storeName,accountId,accountName,createdBy,updatedBy,createdDate,updatedDate,discountedPrice,discountedPercentage,offer,sub,paymentType,fullpaymentType,paylaterType,title,dealName,owner,stage,isOnline,quotationItem,mobileAccountId,mobileContactId)VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                [
                  quoteData?.mobileQuotationId || i?.mobileQuotationId,
                  i?.quotationId,
                  i?.companyId,
                  i?.contactId,
                  i?.firstName,
                  i?.lastName,
                  i?.phoneNo,
                  i?.quotationNo,
                  i?.category,
                  i?.expiryDate,
                  i?.subTotal,
                  i?.taxPercentage,
                  i?.totalTax,
                  i?.total,
                  i?.paymentMethod,
                  i?.status,
                  i?.notes,
                  i?.storeId,
                  i?.storeName,
                  i?.accountId,
                  i?.accountName,
                  i?.createdBy,
                  i?.updatedBy,
                  i?.createdDate,
                  i?.updatedDate,
                  i?.discountedPrice,
                  disPrice || i?.discountedPercentage,
                  i?.offer,
                  i?.sub,
                  i?.paymentType,
                  i?.fullpaymentType,
                  i?.paylaterType,
                  i?.title,
                  i?.dealName,
                  i?.owner,
                  i?.stage,
                  true,
                  JSON.stringify(i?.quotationItem),
                  i?.mobileAccountId,
                  i?.mobileContactId,
                ],
                (txn, results) => {
                  console.log(results, 'all quotation data incoming')
                  Alert.alert(
                    'Success',
                    `Quote ${quoteData ? 'updated' : 'added'} successfully`,
                    [
                      {
                        text: 'Ok',
                        onPress: () => navigation.navigate('Quote'),
                      },
                    ],
                    { cancelable: false },
                  )
                },
                error => {
                  console.log('error while INSERTING ' + error.message)
                },
              )
            })
          })
        })

        .catch(error => console.log('errorrr', console.log(error)))
      : db.transaction(txn => {
        console.log('come offline', isOnline)

        // quoteData
        //   ? txn.executeSql(
        //       'UPDATE quotation SET companyId=?,contactId=?,firstName=?,lastName=?,phoneNo=?,quotationNo=?,category=?,expiryDate=?,subTotal=?,taxPercentage=?,totalTax=?,total=?,paymentMethod=?,status=?,notes=?,storeId=?,storeName=?,accountId=?,accountName=?,createdBy=?,updatedBy=?,createdDate=?,updatedDate=?,discountedPrice=?,discountedPercentage=?,offer=?,sub=?,paymentType=?,fullpaymentType=?,paylaterType=?,title=?,dealName=?,owner=?,stage=?,isOnline=?,quotationItem=? where id=?',
        //       [
        //         values?.companyId || '',
        //         quoteData?.contactId || contactName?.contactId || '',
        //         values?.firstName || '',
        //         values?.lastName || '',
        //         values?.phoneNo || '',
        //         values?.quotationNo ||
        //           Math.floor(10000000000 + Math.random() * 10000000000),
        //         values?.category || '',
        //         values?.expiryDate || '',
        //         values?.subTotal || subtotalPrice || '',
        //         values.taxPercentage || '',
        //         values?.totalTax || GSTPrice,
        //         values?.total || totalPrice,
        //         values?.paymentMethod || '',
        //         values?.status || '',
        //         values?.notes || '',
        //         values?.storeId || '',
        //         values?.storeName || '',
        //         values?.accountId || accountName.accountId || '',
        //         values?.accountName,
        //         values?.createdBy || profile || '',
        //         values?.updatedBy || '',
        //         values?.createdDate || '',
        //         values?.updatedDate || '',
        //         values?.discountedPrice,
        //         values.discountedPercentage || '',
        //         values.offer || '',
        //         values?.sub || '',
        //         values?.paymentType || '',
        //         values?.fullpaymentType || '',
        //         values?.paylaterType || '',
        //         values?.title || '',
        //         values?.dealName || dealName || '',
        //         values?.owner || '',
        //         values?.stage || '',
        //         false,
        //         JSON.stringify(i?.quotationItem),
        //         quoteData?.id,
        //       ],

        //       (txn, res) => {
        //         Alert.alert(
        //           'Success',
        //           'Quote updated offline',
        //           [
        //             {
        //               text: 'Ok',
        //               onPress: () => navigation.push('Quote'),
        //             },
        //           ],
        //           { cancelable: false },
        //         )
        //       },
        //       error => {
        //         console.log('error while INSERTINGggssss ' + error.message)
        //       },
        //     )
        txn.executeSql(
          'INSERT OR REPLACE INTO quotation (mobileQuotationId,companyId,contactId,firstName,lastName,phoneNo,quotationNo,category,expiryDate,subTotal,taxPercentage,totalTax,total,paymentMethod,status,notes,storeId,storeName,accountId,accountName,createdBy,updatedBy,createdDate,updatedDate,discountedPrice,discountedPercentage,offer,sub,paymentType,fullpaymentType,paylaterType,title,dealName,owner,stage,isOnline,quotationItem,mobileAccountId,mobileContactId)VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
          [
            quoteData?.mobileQuotationId || generateQuotationId,
            companyId || values?.companyId || route?.params?.companyId||'',
            contactData[0]?.id || quoteData?.contactId || '',
            quoteData?.firstName || contactData[0]?.item || '',
            '',
            quoteData?.phoneNo || '8768790877',
            quoteData?.quotationNo ||
            Math.floor(10000000000 + Math.random() * 10000000000),
            values?.category || '',
            values?.expiryDate || '',
            subtotalPrice || quoteData?.subTotal || '',
            '18',
            GSTPrice || quoteData?.totalTax,
            totalPrice || quoteData?.total,
            values?.paymentMethod || '',
            values?.status || '',
            values?.notes || quoteData?.notes || '',
            values?.storeId || '',
            values?.storeName || '',
            accountName[0]?.id || values?.accountId || '',
            accountName[0]?.item || quoteData?.accountName || '',
            values?.createdBy || profile || '',
            values?.updatedBy || '',
            values?.createdDate || '',
            values?.updatedDate || '',
            disPrice > 100
              ? 0
              : (disPrice / 100) * subtotalPrice ||
              quoteData?.discountedPrice ||
              values?.discountedPrice,
            disPrice ||
            quoteData?.discountedPercentage ||
            values?.discountedPercentage,
            quoteData?.offer || disPrice,
            values?.sub || '',
            values?.paymentType || '',
            values?.fullpaymentType || '',
            values?.paylaterType || '',
            values.title || quoteData?.title || '',
            dealName || quoteData?.dealName || '',
            values.owner || quoteData?.owner || ownerName || '',
            values.stage || quoteData?.stage || '',
            false,
            JSON?.stringify(filteredProduct) || '',
            accountName[0]?.mobileAccountId || route?.params?.mobileAccountId,
            contactName?.mobileContactId || route?.params?.mobileContactId,
          ],
          (txn, results) => {
            console.log(results, 'all quotation data incoming')
            Alert.alert(
              'Success',
              `Quote ${quoteData ? 'updated' : 'added'} offline`,
              [
                {
                  text: 'Ok',
                  onPress: () => navigation.navigate('Quote'),
                },
              ],
              { cancelable: false },
            )
          },
          error => {
            console.log('error while INSERTING ' + error.message)
          },
        )
      })
  }

  // console.log("product data", productData);
  const getSelectedProduct = values => {
    console.log('productssss', values)
    setProduct(values.item)
    setProductList([...productList, values[values?.length - 1]])
    // console.log('itemsaaaaaaaa', values)
  }

  const SubCounter = item => {
    const counter = productList.map(val => {
      if (item.id === val.id && val.quantity >= 2) {
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

        return (
          setProductList(tempList), setReRender(!reRender), setPaymentList([])
        )
      }
    })
  }

  const getDealName = values => {
    console.log('valuessssssssssssss for deal', values)
    setDealName(values.dealName)
    setOwnerName(values.dealOwner)
    setDealsId(values.dealId)
    setMobileDealsId(values.mobileDealId)
    // setFilteredAcc(
    //   JSON.parse(values.dealAccounts)?.map(v => ({
    //     id: v.accountId,
    //     item: v.accountName,
    //     mobileAccountId: v.mobileAccountId,
    //   })),
    // )
    // setFilteredContact(
    //   JSON.parse(values.dealContact)?.map(v => ({
    //     id: v.contactId,
    //     item: v.contactName,
    //     mobileContactId: v.mobileContactId,
    //   })),
    // )
  }
  // const getAccountName = values => {
  //   console.log('acooooounnnnnnntttNammme', values)
  //   setAccountName(values)
  //   setSelectedMobileAccountId(values?.mobileAccountId)
  // }
  const getContactName = values => {
    console.log('coooooooonttt', values)
    setContactName(values)
    setSelectedMobileContactId(values[0]?.mobileContactId)
    // setContacts(values)
  }
  const accountEdit = {
    id: accountName[0]?.id || route?.params?.accountId,
    item: accountName[0]?.item || route?.params?.accountName,
  }
  useEffect(() => {
    // createTablesUser()
    getContacts()
    getselectedProducts()
  }, [route?.params, productListEdit])

  useEffect(() => {
    let abc = contactnames.map(v => ({
      ...v,
      id: v.id || v.mobileContactId,
      item: v.item,
    }))

    // setContacts(abc)
  }, [contactnames])

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProductGlobal()
      setProductDataGlobal(data)
    }
    fetchData()
  }, [])

  useEffect(() => {
    getDeal()
    // getAccount()
    // filterAccountForDropdown()
    // getContact()
    // filterContactForDropdown()
  }, [companyId])
  useEffect(() => {
    getAccountName()
    getContactNames()
  }, [mobileDealsId])

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
  }, [productList, reRender, disPrice, productListEdit])

  const addPayment = values => {
    let temp = {
      id: paymentList.length,
      payment: payment,
      amount: amount,
      dueDate: values.dueDate,
    }

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
  }

  const [disableUpdate, setDisableUpdate] = useState(false)
  useEffect(() => {
    remainingPrice == 0 ? setDisableUpdate(false) : setDisableUpdate(true)
  }, [remainingPrice])

  const addItems = () => {
    if (
      addItem.item === '' ||
      addItem.sizing === '' ||
      addItem.mrp === '' ||
      addItem.quantity == 0
    ) {
      Alert.alert(
        'Required',
        'Please add all fields',
        [
          {
            text: 'Ok',
          },
        ],
        { cancelable: false },
      )
    } else {
      setProductList([...productList, addItem])
      setAddItem({
        item: '',
        sizing: '',
        mrp: '',
        quantity: '',
      })
    }
  }
  const getCo = values => {
    console.log('valuessss', values)
    setCompanyValue(values.item)
    setCompanyId(values.id)
  }

  return (
    <CardWrapper>
      {console.log('contact/acc list selected', accountName, contactName)}
      <Formik
        initialValues={{
          title: quoteData?.title || '',
          companyId: quoteData?.companyId || '',
          dealName: quoteData?.dealName || '',
          expiryDate: quoteData?.expiryDate?.slice(0, 10) || '',
          accountName: quoteData?.accountName || accountName[0]?.item,
          // contactName: contactName,
          discountedPrice: quoteData?.discountedPrice || '',
          disPrice: quoteData?.discountedPercentage || '',
          dueDate: quoteData?.dueDate?.slice(0, 10) || '',
          owner: quoteData?.owner || '',
          // quotationItem: [],
          stage: quoteData?.stage || '',
          notes: quoteData?.notes || '',
          openDate: new Date(Date.now()),
          openDueDate: new Date(Date.now()),
        }}
        validationSchema={validationSchema}
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
          <View style={cardContainer}>
            {showFrom && (
              <View>
                <DateTimePicker
                  testID="dateTimePicker"
                  timeZoneOffsetInMinutes={0}
                  value={values.openDate}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  minimumDate={new Date(Date.now())}
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
                    ; (values.dueDate = new Date(val.nativeEvent.timestamp)
                      .toISOString()
                      .slice(0, 10)),
                      setShowCal(false)
                    setDOJ(new Date(val.nativeEvent.timestamp))
                  }}
                />
              </View>
            )}

            <View style={floatingLabelContainer}>
              {/* <FloatingLabelInput
                                containerStyles={floatingLabelContainerInternal}
                                placeholder="Client"
                                label={'Quatation Title'}
                                placeholderTextColor="grey"
                                paddingHorizontal={10}
                                paddingTop={5}
                                value={values.title}
                                onChangeText={handleChange('title')}
                            /> */}
              <TextInput
                style={floatingLabelContainerInternal}
                onChangeText={handleChange('title')}
                placeholderTextColor={placeholderTextColor}
                value={values.title}
                placeholder="Quotation Title"
              />
              {errors.title && touched.title && (
                <Text style={errorMessage}>{errors.title}</Text>
              )}
            </View>
            {!store.getState().auth.companyId &&
              <View style={multiSelectOptions}>
                <MultiSelect
                  onSelect={getCo}
                  single
                  label={'Select Company'}
                  K_OPTIONS={companyData}
                  selects={companyEdit}
                />
                {errors.companyName && touched.companyName && (
                  <Text style={[errorMessage, { marginBottom: -11 }]}>
                    {errors.companyName}
                  </Text>
                )}
              </View>
            }
            <View style={{ flexDirection: 'row' }}>
              <View style={multiSelectOptionsRow}>
                <MultiSelect
                  onSelect={getDealName}
                  single
                  label="Select Deal"
                  K_OPTIONS={dealData}
                  selects={dealEdit}
                />
                {errors.dealName && touched.dealName && (
                  <Text style={errorMessage}>{errors.dealName}</Text>
                )}
              </View>
              {/* <View style={pickerInputContainerRow}>
                                <Picker
                                    style={{ bottom: 3.5 }}
                                    selectedValue={values.dealName}
                                    onValueChange={handleChange('dealName')}
                                >
                                    <Picker.Item
                                        label=" Select Deal"
                                        value=""
                                        style={pickerItem}
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
                                                    style={pickerItem}
                                                />
                                                // </View>
                                            )
                                        })
                                        : null}
                                </Picker>

                                {errors.dealName && touched.dealName && (
                                    <Text style={errorMessage}>{errors.dealName}</Text>
                                )}
                            </View> */}
              <View style={floatingLabelContainerRow}>
                {/* <FloatingLabelInput
                                    containerStyles={floatingLabelContainerInternal}
                                    placeholder="Expiry date"
                                    label={'Expiry Date'}
                                    placeholderTextColor="grey"
                                    paddingHorizontal={10}
                                    paddingTop={5}
                                    value={values.expiryDate}
                                // onChangeText={handleChange('expiryDate')}
                                /> */}
                <TextInput
                  style={floatingLabelContainerInternalRow}
                  onChangeText={handleChange('expiryDate')}
                  placeholderTextColor={placeholderTextColor}
                  value={values.expiryDate}
                  placeholder="Expiry Date"
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
                  <Text style={errorMessage}>{errors.expiryDate}</Text>
                )}
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
              }}
            >
              {/* <Picker style={{ color: '#43628e', placeholder: 'Status', display: 'flex' }}
                                                  // selectedValue={values.status}
                                                  // onValueChange={(value, itemIndex) => console.log(value)}
                                                  >
                                                      <Picker.Item label="Account" value=""style={pickerItem} />
                                                      <Picker.Item label="Active" value="Active"style={pickerItem} />
                                                      <Picker.Item label="Inactive" value="Inactive"style={pickerItem} />
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
              <View style={multiSelectOptionsRow}>
                <MultiSelect
                  onSelect={getAccountName}
                  single
                  label={'Account'}
                  // K_OPTIONS={filteredAcc}
                  K_OPTIONS={accountName}
                  selects={accountEdit}
                />
                {errors.accountName && touched.accountName && (
                  <Text style={errorMessage}>{errors.accountName}</Text>
                )}
              </View>
              <View style={multiSelectOptionsRow}>
                {/* <Picker style={{ color: '#43628e', placeholder: 'Status', display: 'flex' }}
                                                  // selectedValue={values.status}
                                                  // onValueChange={(value, itemIndex) => console.log(value)}
                                                  >
                                                      <Picker.Item label="Contact" value=""style={pickerItem} />
                                                      <Picker.Item label="Active" value="Active"style={pickerItem} />
                                                      <Picker.Item label="Inactive" value="Inactive"style={pickerItem} />
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
                  label={'Contact'}
                  // K_OPTIONS={filteredContact}
                  K_OPTIONS={contactData}
                  selects={contacts}
                />
                {errors.contactName && touched.contactName && (
                  <Text style={errorMessage}>{errors.contactName}</Text>
                )}
              </View>
            </View>
            {!hasProduct && (
              <View>
                <View style={{ flexDirection: 'row' }}>
                  <View style={floatingLabelContainerRow}>
                    {/* <FloatingLabelInput
                                            containerStyles={floatingLabelContainerInternal}
                                            placeholder="Itwm"
                                            label={'Item'}
                                            placeholderTextColor="grey"
                                            paddingHorizontal={10}
                                            paddingTop={5}
                                            value={addItem.item}
                                            onChangeText={e => setAddItem(prev => ({
                                                ...prev,
                                                item: e,
                                            }))}
                                        /> */}
                    <TextInput
                      style={floatingLabelContainerInternalRow}
                      placeholderTextColor={placeholderTextColor}
                      value={addItem.item}
                      onChangeText={e =>
                        setAddItem(prev => ({
                          ...prev,
                          item: e,
                        }))
                      }
                      placeholder="Item"
                    />
                    {/* {errors.title && touched.title && (
                                            <Text style={errorMessage}>{errors.title}</Text>
                                        )} */}
                  </View>
                  <View style={floatingLabelContainerRow}>
                    {/* <FloatingLabelInput
                                            containerStyles={floatingLabelContainerInternal}
                                            placeholder="Size"
                                            label={'Size'}
                                            placeholderTextColor="grey"
                                            paddingHorizontal={10}
                                            paddingTop={5}
                                            value={addItem.sizing}
                                            onChangeText={e => setAddItem(prev => ({
                                                ...prev,
                                                sizing: e,
                                            }))}
                                        /> */}
                    <TextInput
                      style={floatingLabelContainerInternalRow}
                      placeholderTextColor={placeholderTextColor}
                      value={addItem.sizing}
                      onChangeText={e =>
                        setAddItem(prev => ({
                          ...prev,
                          sizing: e,
                        }))
                      }
                      placeholder="Size"
                    />
                    {/* {errors.title && touched.title && (
                                            <Text style={errorMessage}>{errors.title}</Text>
                                        )} */}
                  </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <View style={floatingLabelContainerRow}>
                    {/* <FloatingLabelInput
                                            containerStyles={floatingLabelContainerInternal}
                                            placeholder="Quatity"
                                            label={'Quatity'}
                                            placeholderTextColor="grey"
                                            paddingHorizontal={10}
                                            keyboardType='numeric'
                                            maxLength={6}
                                            paddingTop={5}
                                            value={addItem.quantity}
                                            onChangeText={e => setAddItem(prev => ({
                                                ...prev,
                                                quantity: parseInt(e),
                                            }))}
                                        /> */}
                    <TextInput
                      style={floatingLabelContainerInternalRow}
                      placeholderTextColor={placeholderTextColor}
                      value={addItem.quantity}
                      onChangeText={e =>
                        setAddItem(prev => ({
                          ...prev,
                          quantity: parseInt(e),
                        }))
                      }
                      placeholder="Quantity"
                      keyboardType="numeric"
                    />
                    {/* {errors.title && touched.title && (
                                            <Text style={errorMessage}>{errors.title}</Text>
                                        )} */}
                  </View>
                  <View style={floatingLabelContainerRow}>
                    {/* <FloatingLabelInput
                                            containerStyles={floatingLabelContainerInternal}
                                            placeholder="Price"
                                            label={'Price'}
                                            placeholderTextColor="grey"
                                            paddingHorizontal={10}
                                            keyboardType='numeric'
                                            paddingTop={5}
                                            value={addItem.mrp}
                                            onChangeText={e => setAddItem(prev => ({
                                                ...prev,
                                                mrp: e,
                                            }))}
                                        /> */}
                    <TextInput
                      style={floatingLabelContainerInternalRow}
                      placeholderTextColor={placeholderTextColor}
                      value={addItem.mrp}
                      onChangeText={e =>
                        setAddItem(prev => ({
                          ...prev,
                          mrp: e,
                        }))
                      }
                      placeholder="Price"
                      keyboardType="numeric"
                    />
                    {/* {errors.title && touched.title && (
                                            <Text style={errorMessage}>{errors.title}</Text>
                                        )} */}
                  </View>
                </View>
                <View>
                  <TouchableOpacity
                    style={[
                      styles.buttonQuote,
                      { marginBottom: productList ? 0 : 10 },
                    ]}
                    onPress={() => addItems()}
                  >
                    <Text style={styles.textCancel}>Add Item</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {hasProduct && (
              <ScrollView nestedScrollEnabled={true}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={multiSelectOptions}>
                    <MultiSelect
                      onSelect={getSelectedProduct}
                      multiple
                      label="Product"
                      K_OPTIONS={productDataGlobal}
                      selects={productList}
                    />
                    {/* {alert(JSON.stringify(errors))} */}
                    {/* {errors.quotationItem && touched.quotationItem && (
                                            <Text style={errorMessage}>{errors.quotationItem}</Text>
                                        )} */}
                    {/* <AddProductDropdown /> */}
                    {/* <MultiSelect onSelect={getSelectedProduct} multiple label='Product' K_OPTIONS={productData} /> */}
                  </View>
                </View>
              </ScrollView>
            )}
            {console.log(productList, 'bbbaaaaaaaaaaaaaaaa')}
            {productList?.length > 0 ? (
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
                  data={productList}
                  extraData={reRender}
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
                              color: { textColor },
                              marginTop: 5,
                            }}
                          >
                            {item.item}
                          </Text>
                          <Text
                            style={{
                              fontSize: 14,
                              color: { textColor },
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
                                    backgroundColor: '#899499',
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
                                    backgroundColor: '#899499',
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

            {/* negative margin will delete if product comes into picture */}
            {/* <View style={{ flexDirection: 'row', marginTop: -15 }}> */}
            {/* <View style={pickerInputContainerRow}>
                                <Picker
                                    style={{ bottom: 3.5 }}
                                    selectedValue={ownerName || values.owner}
                                    onValueChange={handleChange('owner')}
                                >
                                    <Picker.Item
                                        label="Owner"
                                        value=""
                                        style={pickerItem}
                                    />
                                    <Picker.Item
                                        label="Karen"
                                        value="Karen"
                                        style={pickerItem2}
                                    />
                                    <Picker.Item
                                        label="Julio"
                                        value="Julio"
                                        style={pickerItem2}
                                    />
                                    <Picker.Item
                                        label="Brandon"
                                        value="Brandon"
                                        style={pickerItem2}
                                    />
                                </Picker>
                                {errors.owner && touched.owner && (
                                    <Text style={errorMessage}>{errors.owner}</Text>
                                )}
                            </View> */}
            <View style={pickerInputContainer}>
              <Picker
                style={{
                  bottom: 3.5,
                  display: 'flex',
                }}
                // selectedValue={selectowner}
                // onValueChange={(name, index) => setSelectowner(name)}
                selectedValue={values?.owner}
                onValueChange={handleChange('owner')}
              >
                <Picker.Item label="Select Owner" value="" style={pickerItem} />
                {console.log('selecccct', selectowner)}

                {owner.map((name, index) => (
                  <Picker.Item
                    label={name.name}
                    value={name.username}
                    key={index}
                    style={pickerItem2}
                  />
                ))}
              </Picker>
            </View>

            <View style={pickerInputContainerRow}>
              <Picker
                style={{ bottom: 3.5 }}
                selectedValue={values.stage}
                onValueChange={handleChange('stage')}
              >
                <Picker.Item label="Stage" value="" style={pickerItem} />
                <Picker.Item style={pickerItem2} label="Draft" value="Draft" />
                <Picker.Item
                  style={pickerItem2}
                  label="Shared"
                  value="Shared"
                />
                <Picker.Item
                  style={pickerItem2}
                  label="Accepted"
                  value="Accepted"
                />
                <Picker.Item
                  style={pickerItem2}
                  label="Rejected"
                  value="Rejected"
                />
                <Picker.Item
                  style={pickerItem2}
                  label="Changed & Shared"
                  value="Changed & Shared"
                />
              </Picker>
              {errors.stage && touched.stage && (
                <Text style={errorMessage}>{errors.stage}</Text>
              )}
            </View>
            {/* </View> */}

            <View style={floatingLabelContainer}>
              {/* <FloatingLabelInput
                                containerStyles={floatingLabelContainerInternal}
                                placeholder="notes"
                                label={'Purchase Terms'}
                                placeholderTextColor="grey"
                                paddingHorizontal={10}
                                paddingTop={5}
                                value={values.notes}
                                onChangeText={handleChange('notes')}
                            /> */}
              <TextInput
                style={floatingLabelContainerInternal}
                placeholderTextColor={placeholderTextColor}
                value={values.notes}
                onChangeText={handleChange('notes')}
                placeholder="Purchase Terms"
              />
              {errors.notes && touched.notes && (
                <Text style={errorMessage}>{errors.notes}</Text>
              )}
            </View>

            <View style={[floatingLabelContainerRow, { width: '40%' }]}>
              {/* <FloatingLabelInput
                                containerStyles={floatingLabelContainerInternal}
                                placeholder="Products"
                                label={'Discount %'}
                                placeholderTextColor="grey"
                                paddingHorizontal={10}
                                paddingTop={5}
                                value={disPrice}
                                onChangeText={e => setDisPrice(e)}
                                keyboardType="numeric"
                                maxLength={3}
                            /> */}
              <TextInput
                style={floatingLabelContainerInternalRow}
                placeholderTextColor={placeholderTextColor}
                value={disPrice}
                onChangeText={e => setDisPrice(e)}
                // onChangeText={handleChange('disPrice')}
                keyboardType="numeric"
                placeholder="Discount %"
              />
              {/* {errors.discountedPercentage &&
                      touched.discountedPercentage && (
                        <Text style={errorMessage}>
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
                  <Icon name={'add-sharp'} solid color={'black'} size={40} />
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
                  <Icon name={'remove-sharp'} solid color={'black'} size={40} />
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
                      ₹ {disPrice > 100 ? 0 : (disPrice / 100) * subtotalPrice}
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
                      GST(18.0%) :
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

            <TouchableWithoutFeedback
              onPress={() => setSwitchValue(!switchValue)}
            >
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
                  trackColor={{ false: 'gray', true: '#263238' }}
                  thumbColor={switchValue ? '#f4f3f4' : '#f4f3f4'}
                  style={{ marginHorizontal: 5 }}
                  onValueChange={() => setSwitchValue(!switchValue)}
                  value={switchValue}
                />
              </View>
            </TouchableWithoutFeedback>
            {switchValue && (
              <View>
                <View style={{ flexDirection: 'row' }}>
                  <View style={floatingLabelContainerRow}>
                    {/* <FloatingLabelInput
                                            containerStyles={floatingLabelContainerInternal}
                                            placeholder="Products"
                                            label={'Payment'}
                                            placeholderTextColor="grey"
                                            paddingHorizontal={10}
                                            paddingTop={5}
                                            value={payment}
                                            onChangeText={e => setPayment(e)}
                                        /> */}
                    <TextInput
                      style={floatingLabelContainerInternalRow}
                      placeholderTextColor={placeholderTextColor}
                      value={payment}
                      onChangeText={e => setPayment(e)}
                      placeholder="Payment"
                    />
                  </View>
                  <View style={floatingLabelContainerRow}>
                    {/* <FloatingLabelInput
                                            containerStyles={floatingLabelContainerInternal}
                                            placeholder="Products"
                                            label={'Amount'}
                                            placeholderTextColor="grey"
                                            paddingHorizontal={10}
                                            paddingTop={5}
                                            value={amount}
                                            onChangeText={e => setAmount(e)}
                                        /> */}
                    <TextInput
                      style={floatingLabelContainerInternalRow}
                      placeholderTextColor={placeholderTextColor}
                      value={amount}
                      onChangeText={e => setAmount(e)}
                      placeholder="Products"
                    />
                  </View>
                </View>
                <View
                  style={[
                    floatingLabelContainerRow,
                    { width: '50%', marginBottom: 5 },
                  ]}
                >
                  {/* <FloatingLabelInput
                                        containerStyles={floatingLabelContainerInternal}
                                        placeholder="Products"
                                        label={'Due Date'}
                                        placeholderTextColor="grey"
                                        paddingHorizontal={10}
                                        paddingTop={5}
                                        value={values.dueDate}
                                    // onChangeText={e => setDueDate(e)}
                                    /> */}
                  <TextInput
                    style={floatingLabelContainerInternalRow}
                    onChangeText={handleChange('dueDate')}
                    placeholderTextColor={placeholderTextColor}
                    value={values.dueDate}
                    placeholder="Due Date"
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
                </View>
                <View
                  style={{
                    marginHorizontal: '5%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: -5,
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
                      color={appColor}
                      solid
                      size={25}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <View style={{ marginHorizontal: 10, marginTop: 5 }}>
              <FlatList
                data={paymentList}
                renderItem={({ item }) => {
                  return (
                    <View
                      style={{
                        width: screenWidth - 70,
                        flexDirection: 'row',
                        backgroundColor: '#00b8ce',
                        paddingVertical: 10,
                        paddingHorizontal: 10,
                        marginTop: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 3,
                        borderRadius: 10,
                      }}
                    >
                      <View style={{ flex: 1 }}>
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
                      <View style={{ flex: 1 }}>
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
                      <View style={{ flex: 1 }}>
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

            <SaveAndCancelButton
              handleSubmit={handleSubmit}
              saveTitle={route?.params ? 'Update' : 'Add'}
              navigation={navigation}
              screenName="Quote"
            />
          </View>
        )}
      </Formik>
    </CardWrapper>
  )
}

const styles = StyleSheet.create({
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
  buttonQuote: {
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
  textCancel: {
    color: '#fff',
  },
})

export default AddQuote
