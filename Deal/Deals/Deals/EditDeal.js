import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Keyboard,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { openDatabase } from 'react-native-sqlite-storage'
import { Formik } from 'formik'
import { cancelButton, cancelText, cardContainer, errorMessage, floatingLabelContainer, floatingLabelContainerInternal, multiSelectOptions, pickerInputContainer, pickerItem, saveAndCancel, saveButton, saveText } from '../../../../Containers/CustomComponents/Style'
import { Picker } from '@react-native-picker/picker'
import DeviceInfo from 'react-native-device-info'
import { useDispatch } from 'react-redux'
import { store } from '../../../../Store'
import { FloatingLabelInput } from 'react-native-floating-label-input'
import FloatingButton from "../../../../MD/components/FloatingButton";

import { BackHandler } from 'react-native'
import * as Yup from 'yup'
import { updateSyncLength } from '../../../../Store/SyncLengthStore'
import Icon from 'react-native-vector-icons/Ionicons'
import DateTimePicker from '@react-native-community/datetimepicker'
import DatePicker from 'react-native-date-picker'
// import MultiSelects from './MultiSelect'
import MultiSelect from './MultiSelect'
import NetInfo from '@react-native-community/netinfo'
import SelectList from 'react-native-dropdown-select-list'
import CardWrapper from '../../../../Containers/CustomComponents/CardWrapper'
import SaveAndCancelButton from '../../../../Containers/CustomComponents/SaveAndCancelButton'

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const validationSchema = Yup.object().shape({
  storeName: Yup.string().required('Name is required').label('Name'),
  storePhone: Yup.string()
    .required('A phone number is required')
    .matches(phoneRegExp, 'Phone number is not valid')
    .min(10, 'Too short, phone number must be 10 digit')
    .max(10, 'Too long, phone number must be 10 digit'),
  storeCity: Yup.string().required('City is required').label('City'),
  storeState: Yup.string().required('State is required').label('State'),
  storeZipCode: Yup.string().required('Pin Code is required').label('Zip Code'),
  storeEmail: Yup.string()
    .email('Must be a valid user name')
    .max(255)
    .required('User name is required')
    .label('Email'),
  storeAddress: Yup.string().required('Address is required').label('Address'),
  storeContactName: Yup.string()
    .required('Contact Name is required')
    .label('Contact name'),
  storeStatus: Yup.string().required('Status is required').label('Status'),
})

const db = openDatabase({
  name: 'customer_database',
})

const EditDeal = ({ navigation, route }) => {
  const [showFrom, setShowFrom] = useState(false)
  const [date, setDate] = useState(Date.now().toString())
  const [open, setOpen] = useState(false)
  const [products, setproducts] = useState()
  const [selected, setSelected] = useState([{ key: '1', value: 'karen (93331234567)' }]);
  const [productData, setProductdata] = useState([])
  const [editData, setEditData] = useState([])
  const [bardata, setBarData] = useState([])
  const [owners, setOwners] = useState()
  const [dealStageName, setDealStageName] = useState()
  const [dealContact, setDealContact] = useState([])
  const [dealAccount, setDealAccount] = useState()
  const [reRender, setReRender] = useState(false)
  const [contactDatas, setContactDatas] = useState([])
  const [online, setOnline] = useState(false)
  const [contactDataSelected, setContactDataSelected] = useState([{
    id: '47121eff-45fd-4bb3-85a6-719bcacf2446',
    contactId: '47121eff-45fd-4bb3-85a6-719bcacf2446',
    item: 'james bond',
    dealContactId: '',
    quantity: '',
    dealName: 'Bridgestone tyre sell'
  },
  {
    id: '0c4582c4-70d1-4041-9249-73c0d138c7cc',
    contactId: '0c4582c4-70d1-4041-9249-73c0d138c7cc',
    item: 'john doe',
    dealContactId: '',
    quantity: '',
    dealName: 'Bridgestone tyre sell'
  }])
  const [accountDatas, setAccountDatas] = useState([])
  const [contacts, setContacts] = useState(JSON.parse(route.params.params?.dealContact).map(v => ({
    ...v,
    contactName: v.contactName,
    item: v.contactName,
    id: v.contactId
  })))
  const [accounts, setAccounts] = useState([])
  const [producting, setProducting] = useState([])
  const [editedProducts, setEditedProducts] = useState(route.params.editedProduct_name)
  const getProductOnSelect = values => {
    console.log(values, "values")
    var data1 = values
    setProducting(values)
  }
  console.log("in route edit", route);
  const routez = route.params.editData
  const editRoute = route.params.params
  const datacontact = route.params.contacts
  const dataaccount = route.params.accountData
  let loginToken = store.getState().auth.token
  console.log("ppppppppppp", contacts)


  // console.log("roucontactDatate", datacontact)


  // const Owner = route.params.deal_owner;
  // console.log("Owner", Owner)

  // const contact = route.params.contact_name
  // console.log(contact, "contact")

  // const account = route.params.accountId
  // console.log(account, "account")

  // const dealStages = route.params.dealStage

  useEffect(() => {
    // getProduct()
    // GetProductDetail()
    getDataOfContact()
    getDataOfAccount()
  }, [])

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        setOnline(true)
      } else {
        setOnline(false)
      }
    })
    return () => unsubscribe()
  }, [])

  const getDataOfAccount = async () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM account ORDER BY id DESC',
        [],
        (tx, results) => {
          //ORDER BY id DESC
          let temp = []
          for (let i = 0; i < results.rows.length; ++i) {
            let items = results.rows.item(i)
            // console.log(items);
            if (results.rows.item(i).accountName) {
              temp.push({
                // accountCode: items.accountCode,
                // accountDescription: items.accountDescription,
                id: items.accountId,
                item: items.accountName,
                dealAccountId: '',
                // dealId: dealId,
                accountName: items.accountName,
                accountId: items.accountId,
                quantity: ''
                // accountStatus: items.accountStatus,
                // accountType: items.accountType,
                // addressLine1: items.addressLine1,
                // addressLine2: items.addressLine2,
                // brandName: items.brandName,
                // category: items.category,
                // city: items.city,
                // companyType: items.companyType,
                // country: items.country,
                // email: items.email,
              })
            }
          }
          setAccountDatas(temp)
        },
      )
    })
  }

  const getProduct = async () => {
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
                id: item.productId,
                item: item.productName,
                productDescription: item.productDescription,
                brandName: item.brandName,
                category: item.category,
                subCategory: item.subCategory,
                sizing: item.sizing,
                mrp: item.mrp,
                quantity: 1,
              })
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

  // useEffect(() => {
  //   let a = JSON.stringify(contacts.map(v => ({ ...v, dealName: values.dealName })))
  //   console.log("stringify", a);
  // }, [contacts])


  const editAll_Deal = (values) => {

    console.log([
      {
        dealId: editRoute.dealId || "",
        annualContractValue: '',
        updatedDate: null,
        pipeline: '',
        nextStep: '',
        closeDate: values.closeDate || "",
        dealType: values.dealType || 'NA',
        noOfTimesContacted: '',
        noOfSalesActivity: '',
        sourceType: '',
        forecastAmount: '',
        mediumOfLastMeeting: '',
        createdDate: null,
        lostReason: '',
        annualReccuringRevenue: '',
        dealOwner: values.dealOwner || '',
        lastActivityDate: '',
        nextActivityDate: '',
        ownerAssignedDate: '',
        dealStage: values.dealStage || '',
        dealStatus: values.dealStatus || '',
        createdbyUser: '',
        noOfAssociatedContacts: '',
        amount: values.amount || "",
        totalContractValue: '',
        probability: '',
        dealName: values.dealName || '',
        dealAmount: values.amount || '',
        priority: values.priority || '',
        monthlyRecurringRevenue: '',
        dealDescription: values.dealDescription || '',
        amountInCompanyCurrency: '',
        hierarchyId: '',
        noOfSalesActiviy: '',
        associatedCompanyId: '',
        associatedCompany: '',
        associatedContactId: '',
        associatedContact: '',

        dealAccounts:
          accounts.map(v => ({
            ...v,
            dealName: values.dealName,
            dealId: '',
            quantity: "0",
          })),

        dealContact:
          contacts.map(v => ({
            contactName: v.contactName,
            item: v.contactName,
            dealContactId: v.dealContactId || "",
            id: v.id,
            contactId: v.id,
            quantity: "0",
            dealName: values.dealName
          })),

        dealProduct: [],
      },
    ])
    online ?
      fetch(
        `https://apps.trisysit.com/posbackendapi/api/syncDeal/processDeal/1`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer' + loginToken,
          },
          body: JSON.stringify(
            [
              {
                dealId: editRoute.dealId || "",
                annualContractValue: '',
                updatedDate: null,
                pipeline: '',
                nextStep: '',
                closeDate: values.closeDate || "",
                dealType: values.dealType || 'NA',
                noOfTimesContacted: '',
                noOfSalesActivity: '',
                sourceType: '',
                forecastAmount: '',
                mediumOfLastMeeting: '',
                createdDate: null,
                lostReason: '',
                annualReccuringRevenue: '',
                dealOwner: values.dealOwner || '',
                lastActivityDate: '',
                nextActivityDate: '',
                ownerAssignedDate: '',
                dealStage: values.dealStage || '',
                dealStatus: values.dealStatus || '',
                createdbyUser: '',
                noOfAssociatedContacts: '',
                amount: values.amount || "",
                totalContractValue: '',
                probability: '',
                dealName: values.dealName || '',
                dealAmount: values.amount || '',
                priority: values.priority || '',
                monthlyRecurringRevenue: '',
                dealDescription: values.dealDescription || '',
                amountInCompanyCurrency: '',
                hierarchyId: '',
                noOfSalesActiviy: '',
                associatedCompanyId: '',
                associatedCompany: '',
                associatedContactId: '',
                associatedContact: '',
                dealDetails: {
                  dealDetailId: "",
                  dealId: "",
                  initiationDate: "null",
                  calendarYearofStart: "",
                  qtr: "",
                  companyCommercialLead: "",
                  nominatedCompanyLead: "",
                  mainStatus: "",
                  market: "",
                  originofEnquiry: "",
                  internalProgRef: "",
                  regionEngineering: "",
                  region_Manufacture: "",
                  customer: "",
                  oEM: "",
                  visitedITL: "",
                  clientLead: "",
                  clientEmail: "",
                  platform: "",
                  genre: "",
                  programmeName: "",
                  infoLinks: "",
                  partConsolidation: "",
                  weightReduction: "",
                  springbackAndDimeCompanyBDonalTolerance: "",
                  materialStrength: "",
                  ductilityCrashProperties: "",
                  formabilityDesignRadii: "",
                  pieceCostReduction: "",
                  capexToolingSaving: "",
                  recycledMaterialCircularity: "",
                  materialbeingreplaced: "",
                  competitorifknown: "",
                  noofPartsBaseline: "",
                  noofPartsUpperPotential: "",
                  partFormingComplexity: "",
                  partManufacturingComplexity: "",
                  partTypes_GeneralDescriptions: "",
                  upperStructure: "",
                  closures: "",
                  batteryChargerBox: "",
                  seats: "",
                  chassis: "",
                  wingFairingStructures: "",
                  nacelleEngineCoverLipSkin: "",
                  autoBoltOns: "",
                  materialGroup: "",
                  specificGrade: "",
                  thickness: "",
                  hDQ_D: "",
                  tWR: "",
                  recyclePotential: "",
                  alloyInfluencer: "",
                  materialSupplier: "",
                  runningChangepotential: "",
                  sOPYear: "",
                  sOaMonth: "",
                  peakVolumesLowerBaselinek: "",
                  peakVolumesUpperk: "",
                  estLifetimeVolumes: "",
                  sourcingDecisionTiming: "",
                  estValueperSet: "",
                  lowerEstTierTurnover: "",
                  upperEstTierTurnover: "",
                  incomeEst: "",
                  royalty: "",
                  lowerRoyaltyEM: "",
                  lowerEstRoyaltyEM: "",
                  chance: "",
                  avgPartValue: "",
                  engineeringServicesaotn: "",
                  tooling: "",
                  potentialChannelPartner: "",
                  progressLevel: "",
                  dateofLastClientContact: "",
                  reasonForLossorLapse: "",
                  whatWouldHaveMadeItBetter: "",
                  strategiBRaPkiPg: "",
                  engServicesPotential: "",
                  other: ""
                },
                dealAccounts:
                  accounts.map(v => ({
                    ...v,
                    dealName: values.dealName,
                    dealId: '',
                    quantity: "0",
                  })),

                dealContact:
                  contacts.map(v => ({
                    contactName: v.contactName,
                    item: v.contactName,
                    dealContactId: v.dealContactId || "",
                    id: v.id,
                    contactId: v.id,
                    quantity: "0",
                    dealName: values.dealName
                  })),

                dealProduct: [],
              },
            ]
          )
        },
      )
        .then(response => response.json())
        .then(result => {
          result?.data?.length > 0 ?
            result.data?.forEach(i => {
              db.transaction(tx => {
                tx.executeSql(
                  'UPDATE All_Deal SET dealName=?,dealDescription=?,dealOwner=?,dealStage=?,dealAmount=?, closeDate=?, priority=?, updatedDate=?, dealContact=? WHERE dealId=?',
                  [i.dealName, i.dealDescription, i.dealOwner, i.dealStage, i.amount, i.closeDate, i.priority, Date.now(), JSON.stringify(i.dealContact), editRoute.dealId],
                  (tx, results) => {
                    console.log("result", results);
                    if (results.rowsAffected > 0) {
                      Alert.alert(
                        'Success',
                        'Deal updated successfully',
                        [
                          {
                            text: 'Ok',
                            onPress: () => navigation.navigate('AllDeals'),
                          },
                        ],
                        { cancelable: false },
                      )
                    }
                  }, error => {
                    console.log('error while updating ' + error.message)
                  },
                )
              })
            })
            :
            db.transaction(tx => {
              tx.executeSql(
                'UPDATE All_Deal SET dealName=?,dealDescription=?,dealOwner=?,dealStage=?,dealAmount=?, closeDate=?, priority=?, updatedDate=?, dealContact=? WHERE dealId=?',
                [values.dealName, values.dealDescription, values.dealOwner, values.dealStage, values.amount, values.closeDate, values.priority, Date.now(), JSON.stringify(
                  contacts.map(v => ({
                    contactName: v.contactName,
                    item: v.contactName,
                    dealContactId: v.dealContactId || "",
                    id: v.id,
                    contactId: v.id,
                    quantity: "0",
                    dealName: values.dealName
                  })),
                ), editRoute.dealId],
                (tx, results) => {
                  console.log("result", results);
                  if (results.rowsAffected > 0) {
                    Alert.alert(
                      '500',
                      'Deal updated locally',
                      [
                        {
                          text: 'Ok',
                          onPress: () => navigation.navigate('AllDeals'),
                        },
                      ],
                      { cancelable: false },
                    )
                  }
                }, error => {
                  console.log('error while updating ' + error.message)
                },
              )
            })
        }).then(() => {
          Alert.alert(
            'Success',
            'Deal updated successfully',
            [
              {
                text: 'Ok',
                onPress: () => navigation.navigate('AllDeals'),
              },
            ],
            { cancelable: false },
          )
        })
        .catch(error => console.log("errorrr", error))
      :
      db.transaction(tx => {
        tx.executeSql(
          'UPDATE All_Deal SET dealName=?,dealDescription=?,dealOwner=?,dealStage=?,dealAmount=?, closeDate=?, priority=?, updatedDate=?, dealContact=? WHERE dealId=?',
          [values.dealName, values.dealDescription, values.dealOwner, values.dealStage, values.amount, values.closeDate, values.priority, Date.now(), JSON.stringify(
            contacts.map(v => ({
              contactName: v.contactName,
              item: v.contactName,
              dealContactId: v.dealContactId || "",
              id: v.id,
              contactId: v.id,
              quantity: "0",
              dealName: values.dealName
            })),
          ), editRoute.dealId],
          (tx, results) => {
            console.log("result", results);
            if (results.rowsAffected > 0) {
              Alert.alert(
                'Success',
                'Deal updated successfully',
                [
                  {
                    text: 'Ok',
                    onPress: () => navigation.navigate('AllDeals'),
                  },
                ],
                { cancelable: false },
              )
            }
          }, error => {
            console.log('error while updating ' + error.message)
          },
        )
      })
  }

  const deleteProduct = () => {
    db.transaction(txn => {
      txn.executeSql(
        'DELETE FROM deal_product WHERE deal_id=?',
        [routez.deal_id],
        () => {
          console.log('product deleted SUCCESSFULLY')
        },
        error => {
          console.log('error while creating' + error.message)
        },
      )
    })
  }

  const editdealProduct = (values, item) => {

    deleteProduct();
    let dbproductId = []

    console.log("bardata", bardata)
    bardata.map((i) => {
      dbproductId.push({ "productName": i.productName, "quantity": i.quantity, "productId": i.productId })
      //productId.push(i.quantity)

    })

    let newproductId = []
    products.map((i) => {
      newproductId.push({ "productName": i.item, "quantity": i.quantity, "productId": i.id })
      //productId.push(i.quantity)

    })

    // let productId = []
    const productId = dbproductId.concat(newproductId);



    console.log(productId, "vvvvvvvvvv")


    for (const data of productId) {
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO deal_product (deal_product_id,deal_id,deal_name,product_id,product_name,quantity) VALUES (?,?,?,?,?,?)',
          [null, editRoute.deal_id, values.dealName, data.productId, data.productName, data.quantity],
          (tx, results) => {

            // if (results.rowsAffected > 0) {
            //   Alert.alert(
            //     'Success',
            //     'deal  products details updated successfully',
            //     [
            //       {
            //         text: 'Ok',
            //       },
            //     ],
            //     { cancelable: false },
            //   )
            // }
          },
        )
      })
    }
  }






  // const GetProductDetail = () => {
  //   console.log("firstrrr,", routez.params)
  //   db.transaction(txn => {
  //     txn.executeSql(
  //       'SELECT product_info.productId,product_info.productName,product_info.sizing,product_info.mrp,deal_product.quantity FROM product_info INNER JOIN deal_product ON product_info.productId = deal_product.product_id WHERE deal_id = ?',
  //       [routez.deal_id],

  //       (tx, res) => {
  //         let len = res.rows.length
  //         if (len > 0) {
  //           let results = []

  //           for (let i = 0; i < len; i++) {
  //             let item = res.rows.item(i)
  //             results.push({
  //               productName: item.productName,
  //               quantity: item.quantity,
  //               price: item.mrp,
  //               netprice: item.netprice,
  //               sizing: item.sizing,
  //               productId: item.productId

  //             })
  //             setBarData(results)
  //           }

  //         }
  //       },
  //       error => {
  //         console.log('error while GETTING + error.message')
  //       },
  //     )
  //   })
  // }
  console.log(bardata, "zzzzzzzzzzzz")

  // const EditDeal = (values, item) => {

  //   let productId = []

  //   console.log("valuesss", bardata)
  //   bardata.map((i) => {
  //     productId.push({ "productName": i.productName, "quantity": i.quantity, "netprice": i.quantity * i.price, "price": i.price, "sizing": i.sizing, "productId": i.productId })
  //     //productId.push(i.quantity)

  //   })

  //   products.map((i) => {
  //     productId.push({ "productName": i.item, "quantity": i.quantity, "netprice": i.quantity * i.mrp, "price": i.mrp, "sizing": i.sizing, "productId": i.id })
  //     //productId.push(i.quantity)

  //   })

  //   console.log("productttttiii", productId);

  //   for (const data of productId) {
  //     db.transaction(tx => {
  //       tx.executeSql(
  //         'UPDATE All_Deal SET dealName=?,dealDescription=?,dealOwner=?,dealStage=?,dealAmount=?,closeDate=?,priority=?,contactId=?,accountId=?,quantity=?,price=?,netprice=?,productName=?,sizing=? WHERE dealName=?',
  //         [values.dealName, values.dealDescription, values.dealOwner, values.dealStage, values.amount, date, values.priority, values.contactId, values.accountId, data.quantity, data.price, data.netprice, data.productName, data.sizing, route.params.dealName],
  //         (tx, results) => {
  //           dispatch(
  //             updateSyncLength({
  //               customertable: 1,
  //               customerData: 1,
  //               storetable: storeNotifictaion,
  //               saletable: saleNotifictaion,
  //               storeData: storeDataLength,
  //               saleData: saleDataLength
  //             }))
  //           if (results.rowsAffected > 0) {
  //             Alert.alert(
  //               'Success',
  //               'Customer updated successfully',
  //               [
  //                 {
  //                   text: 'Ok',
  //                   onPress: () => navigation.navigate('Customer Detail', { id: route.params.params.id }),
  //                 },
  //               ],
  //               { cancelable: false },
  //             )
  //           } else error(err)
  //         },
  //       )
  //     })
  //   }
  // }

  let dealStage = [{ id: 1, item: 'Prospect' },
  { id: 1, item: 'Appointment' },
  { id: 2, item: 'Opportunity' },
  { id: 3, item: 'Proposal' },
  { id: 4, item: 'Negotiation' },
  { id: 5, item: 'Contact Sent' },
  { id: 6, item: 'Closed won' },
  { id: 7, item: 'Closed Lost' },
  ]




  function handleBackButtonClick() {
    navigation.navigate('')
    return true
  }
  const getProducts = (values) => {
    console.log("values", values);

    setproducts(values)
  }
  console.log("items", products);

  const getAccount = values => {
    console.log("first", values)
    let arr = []
    arr.push(values)

    setAccounts(arr)
  }


  const getContact = values => {
    console.log('jjjjj', values)
    let result = []
    values?.map(e => {
      result.push({ ...e, contactName: e.item })
    })
    console.log(result, 'oooooooooo')
    setContacts(result)

    // let resultName = []
    // values?.map((e) => {
    //   resultName.push(e.item)
    // })
    // setContactsName(resultName)
    // console.log('valuesget cont', result)
  }

  console.log("dealContact", contacts)

  // const getAccount = values => {
  //   console.log("first", values.id)
  //   let arr = []
  //   arr.push(values.id)

  //   setAccounts(arr)
  // }

  const getStage = (value) => {
    setDealStageName(value.item)
  }
  console.log("dealStageName", dealStageName)



  const adddealData = (values) => {
    console.log(values.dealName);
    console.log(products);

  }
  const AddProductCounter = (item) => {
    console.log(item, "itemmmmmmmmmmmmmmmmm");
    const counter = products.map((val) => {
      if (item.id === val.id) {
        return { ...val, quantity: JSON.parse(val.quantity) + 1 }
      }
      else {
        return val
      }
    }
    )
    setproducts(counter)
  }
  const AddBarCounter = (item) => {
    console.log(item, "itemmmmmmmmmmmmmmmmm");
    const counter = bardata.map((val) => {
      if (item.id === val.id) {
        return { ...val, quantity: JSON.parse(val.quantity) + 1 }
      }
      else {
        return val
      }
    }
    )
    setBarData(counter)
  }

  const SubCounter = (item) => {

    const counter = bardata.map((val) => {
      if (item.id === val.id) {
        return { ...val, quantity: val.quantity - 1, }
      }
      else {
        return val
      }
    }
    )
    setBarData(counter)
  }

  console.log(date, "date")

  const deleteProductList = item => {
    console.log(item, 'kkkkkkkkk')
    let tempList = bardata
    bardata?.map(data => {
      if (data.id === item.id) {
        let temp = bardata.indexOf(item)
        console.log(temp, 'bbbbbb')
        // if (temp > -1) {
        //   // only splice array when item is found
        //   return productList.splice(temp, 1) // 2nd parameter means remove one item only
        // }
        tempList.splice(temp, 1)
        console.log(tempList, 'zzzzzzzz')

        return setBarData(tempList), setReRender(!reRender)
      }
    })
  }


  const deleteList = item => {
    console.log(item, 'kkkkkkkkk')
    let tempList = products
    products?.map(data => {
      if (data.id === item.id) {
        let temp = products.indexOf(item)
        console.log(temp, 'bbbbbb')
        // if (temp > -1) {
        //   // only splice array when item is found
        //   return productList.splice(temp, 1) // 2nd parameter means remove one item only
        // }
        tempList.splice(temp, 1)
        console.log(tempList, 'zzzzzzzz')

        return setproducts(tempList), setReRender(!reRender)
      }
    })
  }


  const getDataOfContact = async () => {
    await db.transaction(txn => {
      txn.executeSql(
        'SELECT * from contacts ORDER BY id ASC',
        [],

        (tx, res) => {
          let len = res.rows.length
          if (len > 0) {
            let results = []

            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              // console.log("hi",item);
              results.push({
                id: item.contactId,
                item: item.contactName,
                email: item.email,
                owner: item.contactOwner,
                jobTitle: item.jobTitle,
                mobile: item.phoneNo,
                stage: item.contactStage,
                date: item.createdDate,
                //  accountName:item.accountName,
                accountIdRef: item.accountIdRef
              })
              setContactDatas(results)
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

  // const getDataOfAccount = async () => {
  //   db.transaction(tx => {
  //     tx.executeSql(
  //       'SELECT * FROM account_info ORDER BY id DESC',
  //       [],
  //       (tx, results) => {
  //         //ORDER BY id DESC
  //         let temp = []
  //         for (let i = 0; i < results.rows.length; ++i) {
  //           let items = results.rows.item(i)
  //           // console.log(items);
  //           if (results.rows.item(i).accountName) {
  //             temp.push({
  //               accountCode: items.accountCode,
  //               accountDescription: items.accountDescription,
  //               id: items.accountId,
  //               item: items.accountName,
  //               accountStatus: items.accountStatus,
  //               accountType: items.accountType,
  //               addressLine1: items.addressLine1,
  //               addressLine2: items.addressLine2,
  //               brandName: items.brandName,
  //               category: items.category,
  //               city: items.city,
  //               companyType: items.companyType,
  //               country: items.country,
  //               email: items.email,
  //             })
  //           }
  //         }
  //         setAccountDatas(temp)
  //       },
  //     )
  //   })
  // }

  const deleteContact = () => {
    db.transaction(txn => {
      txn.executeSql(
        'DELETE FROM deal_contact WHERE deal_id=?',
        [routez.deal_id],
        () => {
          console.log('product deleted SUCCESSFULLY')
        },
        error => {
          console.log('error while creating' + error.message)
        },
      )
    })
  }

  const EditDealContact = (values) => {
    deleteContact()
    contacts.map((e) => {
      db.transaction(txn => {
        txn.executeSql(
          'INSERT INTO deal_contact (deal_contact_id,contact_id,contact_name ,deal_id,deal_name,quantity) VALUES (?,?,?,?,?,?)',
          [null, e.id, e.item, routez.deal_id, values.dealName, null],
          (txn, res) => {
            Alert.alert(
              'Success',
              'All deal details updated successfully',
              [
                {
                  text: 'Ok',
                  onPress: () => navigation.navigate('AllDeals'),

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
    )
  }




  const EditDealAccount = (values) => {
    console.log(accounts, "azzzzzzzzzz")
    db.transaction(txn => {
      txn.executeSql(
        'UPDATE deal_account SET deal_account_id=?,account_id=?,deal_id=?,deal_name=?,quantity=? WHERE deal_id=?',
        [null, accounts, routez.deal_id, values.dealName, null, routez.deal_id],
        (txn, res) => {
          console.log(res, "qazxzzzzzzzzzzzzzz")
          Alert.alert(
            'Success',
            'All deal details updated successfully',
            [
              {
                text: 'Ok',
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

  const allfunctions = (values) => {
    editAll_Deal(values)
    // editdealProduct(values)
    // EditDealContact(values)
    // EditDealAccount(values)
  }


  console.log(contactDatas, "contactDatas")
  console.log("bardata", products);
  return (
    <CardWrapper>
      <ScrollView nestedScrollEnabled={true}>
        <Formik
          initialValues={{
            dealName: editRoute.dealName,
            dealDescription: editRoute.dealDescription,
            dealOwner: editRoute.dealOwner,
            dealStage: editRoute.dealStage,
            amount: editRoute.dealAmount,
            priority: editRoute.priority,
            closeDate: editRoute.closeDate,
            // contactId: "",
            // accountId: "",

            associatedWithContacts: 'Sushant gupta, Rajiv Agarwal',
            associatedWithRecords: 'Gupta Electronics',
            openDate: new Date(Date.now()),

          }}
          // validationSchema={validationSchema}
          onSubmit={values => allfunctions(values)}

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
              {/* <View style={styles.input}> */}

              {showFrom && (
                <DateTimePicker
                  testID="dateTimePicker"
                  timeZoneOffsetInMinutes={0}
                  value={values.openDate}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  selected={values.closeDate}
                  minimumDate={new Date(Date.now())}
                  onChange={val => {
                    values.closeDate = new Date(
                      val.nativeEvent.timestamp).toDateString().slice(3, 15)
                    setShowFrom(false)
                    setDate(values.closeDate)
                  }}
                />

              )}
              <View style={floatingLabelContainer}>
                <FloatingLabelInput
                  placeholder="Deal Name"
                  label={'Deal name *'}
                  placeholderTextColor="red"
                  paddingHorizontal={10}
                  paddingTop={5}
                  value={values.dealName}
                  onChangeText={handleChange('dealName')}
                  containerStyles={floatingLabelContainerInternal}
                />
                {/* </View> */}
              </View>
              <View>
                <FlatList
                  nestedScrollEnabled={true}
                  contentContainerStyle={{ paddingBottom: 10 }}
                  data={products}
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
                                    width: 15,
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
                                  onPress={() => AddProductCounter(item)}
                                />
                              </View>
                            </View>
                          </View>
                          <View
                            style={{
                              alignSelf: 'center',
                              width: '25%',
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
                          <View style={{ position: 'absolute', right: 10 }}>
                            <TouchableOpacity
                              onPress={() => {
                                deleteList(item)
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
              <View>
                <FlatList
                  nestedScrollEnabled={true}
                  contentContainerStyle={{ paddingBottom: 10 }}
                  data={bardata}
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
                            {item.productName}
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
                                    width: 15,
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
                                  onPress={() => AddBarCounter(item)}
                                />
                              </View>
                            </View>
                          </View>
                          <View
                            style={{
                              alignSelf: 'center',
                              width: '25%',
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
                              ₹{item.price * item.quantity}
                            </Text>
                          </View>
                          <View style={{ position: 'absolute', right: 10 }}>
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
              <View style={floatingLabelContainer}>
                <FloatingLabelInput
                  containerStyles={floatingLabelContainerInternal}
                  placeholder="Deal Description"
                  label={'Deal Description'}
                  placeholderTextColor="grey"
                  paddingHorizontal={10}
                  paddingTop={5}
                  value={values.dealDescription}
                  onChangeText={handleChange('dealDescription')}
                />
              </View>
              {errors.storeCity && touched.storeCity && (
                <Text style={styles.error}>{errors.storeCity}</Text>
              )}
              <View style={pickerInputContainer}>
                <Picker style={{ bottom: 3.5 }}
                  selectedValue={values.dealOwner}
                  onValueChange={handleChange('dealOwner')}
                  dropdownIconColor="grey"
                >
                  <Picker.Item
                    label="Select Owner *"
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
                </Picker>

                {errors.dealOwner && touched.dealOwner && (
                  <Text style={styles.error}>{errors.dealOwner}</Text>
                )}
              </View>
              <View
                style={multiSelectOptions}
              >
                <MultiSelect
                  onSelect={getStage}
                  single
                  label={values.dealStage}
                  K_OPTIONS={dealStage}
                />
              </View>
              {errors.dealStage && touched.dealStage && (
                <Text style={styles.error}>{errors.dealStage}</Text>
              )}
              <View style={floatingLabelContainer}>
                <FloatingLabelInput
                  containerStyles={floatingLabelContainerInternal}
                  placeholder="Amount"
                  label={'\u20B9 Amount *'}
                  placeholderTextColor="grey"
                  paddingHorizontal={10}
                  paddingTop={5}
                  value={values.amount}
                  onChangeText={handleChange('amount')}

                />

                {errors.storeEmail && touched.storeEmail && (
                  <Text style={styles.error}>{errors.storeEmail}</Text>
                )}
              </View>
              {/* <TouchableOpacity onPress={()=>setShowFrom(true)} onBlur={()=>setShowFrom(false)}> */}
              {/* <View style={styles.datePickerStyle}>
              <View>
                <Text style={styles.txt1}>Exp Close Date</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowFrom(!showFrom)}
                style={{
                  flex: 1,
                  marginRight: 5,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginTop: -20,
                }}
              >
                <View style={{ flex: 1, top: 8 }}>
                  <Text style={errorMessage}>{values?.closeDate?.slice(0, 10)}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setShowFrom(!showFrom)}
                >
                  <View
                    style={{ alignSelf: 'flex-end', marginRight: 5 }}
                  >
                    <Icon name={'calendar'} solid size={30} />
                  </View>
                </TouchableOpacity>
              </TouchableOpacity>
              {errors.closeDate && touched.closeDate && (
                <Text style={styles.errorDate}>{errors.closeDate}</Text>
              )}
            </View> */}
              <View style={floatingLabelContainer}>
                <FloatingLabelInput
                  containerStyles={floatingLabelContainerInternal}
                  placeholder="Exp Close Date"
                  label={'Exp Close Date *'}
                  placeholderTextColor="grey"
                  paddingHorizontal={10}
                  paddingTop={5}
                  value={values.closeDate}
                  onChangeText={handleChange('closeDate')}
                />
                <TouchableOpacity onPress={() => setShowFrom(!showFrom)}>
                  <View style={{ alignSelf: 'flex-end', marginRight: 10, marginTop: -40 }}>
                    <Icon name={'calendar'} solid size={30} />
                  </View>
                </TouchableOpacity>
                {errors.closeDate && touched.closeDate && (
                  <Text style={errorMessage}>{errors.closeDate}</Text>
                )}
              </View>

              <View style={pickerInputContainer}>
                <Picker style={{ bottom: 3.5 }}
                  selectedValue={values.priority}
                  onValueChange={handleChange('priority')}
                  dropdownIconColor="grey"
                >
                  <Picker.Item label="Select Priority" value="" style={pickerItem} />
                  <Picker.Item label="High" value="High" style={pickerItem} />
                  <Picker.Item label="Medium" value="Medium" style={pickerItem} />
                </Picker>

                {errors.storeContactName && touched.storeContactName && (
                  <Text style={styles.error}>{errors.storeContactName}</Text>
                )}
              </View>

              <View style={multiSelectOptions}>

                {/* <SelectList placeholder='Select Contact' searchPlaceholder="Search Contacts" setSelected={setSelected} data={contacts} onSelect={() => setSelected(selected)} boxStyles={{backgroundColor:'#f1f5f7'}}/> */}

                <MultiSelect onSelect={getAccount} single label={JSON.parse(route.params.params.dealAccounts)[0].accountName} K_OPTIONS={accountDatas} />
                {errors.storeStatus && touched.storeStatus && (
                  <Text style={errorMessage}>{errors.storeStatus}</Text>
                )}
              </View>
              <View style={multiSelectOptions}>

                {/* <SelectList placeholder='Select Contact' searchPlaceholder="Search Contacts" setSelected={setSelected} data={contacts} onSelect={() => setSelected(selected)} boxStyles={{backgroundColor:'#f1f5f7'}}/> */}
                <MultiSelect onSelect={getContact} multiple label={values.contactId} K_OPTIONS={contactDatas} selects={contacts} />


                {errors.storeStatus && touched.storeStatus && (
                  <Text style={styles.error}>{errors.storeStatus}</Text>
                )}

              </View>

              <SaveAndCancelButton handleSubmit={handleSubmit} saveTitle={"Update"} navigation={navigation} screenName="AllDeals" />

            </View>
          )}
        </Formik>
      </ScrollView>
    </CardWrapper>
  )
}

const styles = StyleSheet.create({

  buttonQuote: {
    width: 320,
    alignItems: 'center',
    marginLeft: 12,
    marginRight: 5,
    backgroundColor: '#00b8ce',
    borderRadius: 4,
    height: 40,
    marginTop: 10,
    marginBottom: -7,
  },
  textCancel: {
    color: '#fff',
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

})

export default EditDeal
