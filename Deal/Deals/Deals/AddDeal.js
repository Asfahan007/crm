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
import FloatingButton from '../../../../MD/components/FloatingButton'

import { Formik } from 'formik'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import { openDatabase } from 'react-native-sqlite-storage'
import * as Yup from 'yup'
import { store } from '../../../../Store'
import { useDispatch } from 'react-redux'
import { Picker } from '@react-native-picker/picker'
import DeviceInfo from 'react-native-device-info'
import DateTimePicker from '@react-native-community/datetimepicker'
import RBSheet from 'react-native-raw-bottom-sheet'
import { useRef } from 'react'
import MultiSelect from './MultiSelect'
import {
  cardContainer,
  errorMessage,
  floatingLabelContainer,
  floatingLabelContainerInternal,
  multiSelectOptions,
  pickerInputContainer,
  pickerItem,
  pickerItem2,
  placeholderTextColor,
  screenWidth,
} from '../../../../Containers/CustomComponents/Style'
import SaveAndCancelButton from '../../../../Containers/CustomComponents/SaveAndCancelButton'
import CardWrapper from '../../../../Containers/CustomComponents/CardWrapper'
import { hasProduct } from '../../../../Containers/IsAvailable/IsAvailable'
import { useLayoutEffect } from 'react'
import { getProductGlobal } from '../../../../Containers/CustomComponents/GetProduct'
import { getUsers } from '@/Containers/CustomComponents/UsernameTable'
import generateUUID from '@/Containers/CustomComponents/GetUUID'
import { useIsFocused } from '@react-navigation/native'

const db = openDatabase({
  name: 'customer_database',
})
const currentDate = new Date(Date.now()).toISOString()
  .slice(0, 10)
const validationSchema = Yup.object().shape({
  dealDescription: Yup.string()
    .required('Deal Description is required')
    .label('Deal Description'),
  // dealOwner: Yup.string().required('Owner is required').label('dealOwner'),
  // dealStage: Yup.string().required('Stage is required'),
  dealName: Yup.string().required('Deal Name is required').label('Deal name'),
  dealType: Yup.string().required('Type is required').label(''),

  dealAmount: Yup.string().required('Amount is required').label('Amount'),
  closeDate: Yup.mixed().test(
    'isSmaller',
    'Exp Close date must not be earlier than current date',
    (value) => {
      if (currentDate <= value)
        return true
    },
  ),

})
function AddDeal({ navigation, route }) {
  let editDealProps = route?.params?.dealPayload
  console.log('add deal route', route)
  const isFocused = useIsFocused()

  const [showFrom, setShowFrom] = useState(false)
  const [show, setShow] = useState(false)
  const [producting, setProducting] = useState([])
  const [reRender, setReRender] = useState(false)
  const [productList, setProductList] = useState([])
  const [productDataGlobal, setProductDataGlobal] = useState([])
  const [accounts, setAccounts] = useState(
    route?.params?.deal_Account ? route?.params?.deal_Account : [],
  )
  const [contacts, setContacts] = useState(
    route?.params?.deal_Contact
      ? route?.params?.deal_Contact.map(v => ({
        ...v,
        item: v?.contactName,
        id: v?.contactId || v?.mobileContactId,
      }))
      : [],
  )
  const [dealStageName, setDealStageName] = useState()
  const [selectowner, setSelectowner] = useState('')
  const [companyId, setCompanyId] = useState(route?.params?.dealPayload?.companyId || store.getState().auth.companyId)
  const [companyN, setCompanyN] = useState([])
  const [companyData, setCompanyData] = useState([])
  const [companyValue, setCompanyValue] = useState()
  const [companyName, setCompanyName] = useState('')
  const owner = getUsers()
  const [accountData, setAccountData] = useState([])
  const [companyIdOfAcount, setCompanyIdOfAccount] = useState('')
  const [showAssociatedAccount, setShowAssociatedAccount] = useState(true)
  const [showAssociatedContact, setShowAssociatedContact] = useState(true)
  const [contactData, setContactData] = useState(
    route?.params?.deal_Contact
      ? route?.params?.deal_Contact.map(v => ({
        ...v,
        item: v?.contactName,
        id: v?.contactId,
      }))
      : [],
  )

  const [addItem, setAddItem] = useState({
    item: '',
    sizing: '',
    mrp: '',
    quantity: 0,
  })
  let loginToken = store.getState().auth.token
  const generateDealId = generateUUID()
  const isOnline = store.getState().online.isOnline

  let dealStage = [
    { id: 0, item: 'Concept Discussion' },
    { id: 1, item: 'Requirements Capture' },
    { id: 2, item: 'Early Feasibility' },
    { id: 3, item: 'Full Feasibility Simulation' },
    { id: 4, item: 'RFQ' },
    { id: 5, item: 'Nomination' },
  ]

  const profile = store.getState().auth.profile.name

  const stageEdit = {
    id: editDealProps?.dealId,
    item: editDealProps?.dealStage,
  }
  // const accountEdit = {
  //   id: editDealProps?.dealId || '',
  //   item: editDealProps?.dealAccounts
  //     ? JSON?.parse(editDealProps?.dealAccounts)[0]?.accountName
  //     : '',
  // }
  const accountEdit = route?.params?.deal_Contact
    ? route?.params?.deal_Account.map(v => ({
      ...v,
      item: v?.accountName,
      id: v?.accountId,
    }))[0]
    : {}

  useEffect(() => {
    if (dealStageName === 'RFQ') {
      setShow(true)
    } else {
      setShow(false)
    }
  }, [dealStageName])

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProductGlobal()
      setProductDataGlobal(data)
    }
    fetchData()
  }, [])

  const dates = new Date()

  let dealId = Number(
    dates.getDate() + '' + dates.getTime() + '' + Math.floor(Math.random()),
  )

  useEffect(() => {
    getCompanyDropdown()
  }, [isFocused])

  useEffect(() => {
    getCompanyName()
  }, [companyData])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: editDealProps ? 'Edit Deal' : 'Add Deal',
    })
  }, [editDealProps])

  useEffect(() => {
    getDataOfAccount()
  }, [])

  useEffect(() => {
    getDataOfContact()
  }, [accounts])

  console.log('contact list', contactData)

  const AddDealProduct = values => {
    let productId = []
    console.log('valuesss', producting)
    producting.map(i => {
      productId.push({
        productId: i.productId,
        quantity: i.quantity,
        netprice: i.quantity * i.mrp,
        price: i.mrp,
        productName: i.item,
      })
      //productId.push(i.quantity)
    })
    console.log('productttttiii', productId)

    for (const data of productId) {
      db.transaction(txn => {
        txn.executeSql(
          'INSERT INTO deal_product (deal_product_id,deal_id,deal_name,product_id,product_name,quantity) VALUES (?,?,?,?,?,?)',
          [
            null,
            dealId,
            values.dealName,
            data.productId,
            data.productName,
            data.quantity,
          ],
          (txn, res) => {
            // Alert.alert(
            //   'Success',
            //   'CONTACT deal added successfully',
            //   [
            //     {
            //       text: 'Ok',
            //     },
            //   ],
            //   { cancelable: false },
            // )
            // AddDealContact()
          },
          error => {
            console.log('error while INSERTING ' + error.message)
          },
        )
      })
    }
  }

  // console.log(producting, "producting")
  // console.log(productData, "productData")
  // let productId = []

  // producting.map((i) => {
  //   productId.push({ "productId": i.productId, "quantity": i.quantity, "netprice": i.quantity * i.mrp, "price": i.mrp, "productName": i.item, "sizing": i.sizing })
  //   // productId.push(i.quantity)

  // })
  // console.log("productttttiii", productId);

  // for (const data of productId) {

  const counterButton = (item, acc) => {
    const counter = productList.map(val => {
      if (item.id === val.id) {
        return { ...val, quantity: val.quantity + acc }
      } else {
        return val
      }
    })
    const filterData = counter.filter(e => e.quantity != 0)
    setProductList(filterData)
  }

  const deleteProductList = item => {
    let tempList = producting
    productList?.map(data => {
      if (data.id === item.id) {
        let temp = productList.indexOf(item)
        tempList.splice(temp, 1)
        return setProductList(tempList), setReRender(!reRender)
      }
    })
  }

  const getContact = values => {
    let result = []
    values?.map(e => {
      result.push({ ...e, contactName: e.item })
    })
    setContacts(result)
  }
  const getAccount = values => {
    console.log("getAccount", values)
    // let arr = []
    // arr.push(values)
    setShowAssociatedContact(false)
    setAccounts([values])
    console.log('account details', accounts)
    setCompanyIdOfAccount(values?.companyId)
    setCompanyId(values.companyId)
    setContacts([])
    setTimeout(() => {
      setShowAssociatedContact(true)
    }, 0);
  }

  const getStage = value => {
    setDealStageName(value.item)
  }


  const getDataOfContact = async () => {
    await db.transaction(txn => {
      txn.executeSql(
        `SELECT * from contacts where accountId = ? or mobileAccountId=?`,
        [accounts[0].accountId, accounts[0]?.mobileAccountId],
        (tx, res) => {
          let len = res.rows.length
          console.log('length of accountId = ? or mobileAccountId=?', len)
          if (len > 0) {
            let results = []
            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              results.push({
                id: item.contactId ? item.contactId : item.mobileContactId,
                contactId: item.contactId,
                item: item.contactName,
                dealContactId: '',
                quantity: '',
                contactName: item.firstName,
                phoneNo: item.phoneNo,
                mobileContactId: item.mobileContactId,
              })
              setContactData(results)
            }
          }
        },
        error => {
          console.log('error while GETTING', error.message)
        },
      )
    })
  }

  const getDataOfAccount = async () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM account where companyId=? ORDER BY accountName',
        [companyId],
        (tx, results) => {
          let temp = []
          for (let i = 0; i < results.rows.length; ++i) {
            let items = results.rows.item(i)
            if (results.rows.item(i).accountName) {
              temp.push({
                id: items.accountId,
                item: items.accountName,
                dealAccountId: '',
                accountName: items.accountName,
                accountId: items.accountId,
                quantity: '',
                companyId: items.companyId,
                mobileAccountId: items.mobileAccountId,
              })
            }
          }
          setAccountData(temp)
        },
      )
    })
  }
  console.log(accountData, "ggggggggggg")
  const getCompanyName = () => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * from company_info WHERE companyId=?',
        [route?.params?.dealPayload?.companyId],
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
      return obj.id === route?.params?.dealPayload?.companyId
    })[0]?.item
    setCompanyName(matchCompany)
  }, [companyData])

  const companyEdit = {
    id: route?.params?.dealPayload?.companyId,
    item: companyN[0]?.item,
  }

  useEffect(() => {
    getDataOfAccount()
  }, [companyId])

  const addItems = () => {
    setProductList([...productList, addItem])
    setAddItem({
      item: '',
      sizing: '',
      mrp: '',
      quantity: '',
    })
  }

  const allfunctions = values => {
    console.log('aaayaaa deal', editDealProps?.companyId)
    console.log('add deal payload', [
      {
        mobileDealId: editDealProps?.mobileDealId || generateDealId,
        dealId: editDealProps?.dealId || '',
        // companyId: accounts[0].companyId || editDealProps?.companyId || '',
        annualContractValue: '',
        updatedDate: null,
        pipeline: '',
        nextStep: '',
        closeDate: values?.closeDate || editDealProps?.closeDate,
        dealType: values.dealType || editDealProps?.dealType,
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
        dealStage: dealStageName || editDealProps?.dealStage || '',
        dealStatus:
          values?.dealStatus || editDealProps?.dealStatus || '',
        createdbyUser: profile || '',
        noOfAssociatedContacts: '',
        amount: values?.dealAmount,
        totalContractValue: '',
        probability: '',
        dealName: values?.dealName || editDealProps?.dealName || '',
        dealAmount:
          values?.dealAmount || editDealProps?.dealAmount || '',
        priority: values?.priority || editDealProps?.priority || '',
        monthlyRecurringRevenue: '',
        dealDescription:
          values?.dealDescription ||
          editDealProps?.dealDescription ||
          '',
        amountInCompanyCurrency: '',
        hierarchyId: '',
        noOfSalesActiviy: '',
        associatedCompanyId: '',
        associatedCompany: '',
        associatedContactId: '',
        associatedContact: '',
        companyId: companyId || route?.params?.dealPayload?.companyId || '',
        dealAccounts:
          accounts?.map(v => ({
            ...v,
            dealName: values?.dealName,
            dealId: editDealProps?.dealId || null,
            quantity: '0',
          })) ||
          JSON.parse(editDealProps?.dealAccounts)?.map(v => ({
            ...v,
            quantity: '0',
          })),

        dealContact:
          contacts?.map(v => ({
            ...v,
            dealName: values?.dealName,
            quantity: '0',
            dealId: editDealProps?.dealId || null,
            contactPhoneNo: v.phoneNo || v?.contactPhoneNo,
          })) || JSON.parse(editDealProps?.dealContact),
        // dealProduct: productList?.map(v => ({
        //   ...v, dealName: values?.dealName, dealProductId: "", dealId: "", productName: v.item, productId: v.productId || Math.floor((1 + Math.random()) * 0x10000)
        //     .toString(16)
        //     .substring(1)
        // })) || JSON.parse(editDealProps?.dealProduct),
        dealProduct: [],
        dealDetail: {
          dealDetailId: '',
          dealId: null,
          initiationDate: '',
          calendarYearofStart: '',
          qtr: '',
          companyCommercialLead: '',
          nominatedCompanyLead: '',
          mainStatus: 'ACTIVE',
          market: 'Rail',
          originofEnquiry: '',
          internalProgRef: '',
          regionEngineering: '',
          region_Manufacture: '',
          customer: '',
          oEM: '',
          visitedITL: '',
          clientLead: '',
          clientEmail: '',
          platform: '',
          genre: '',
          programmeName: '',
          infoLinks: '',
          partConsolidation: '',
          weightReduction: '',
          springbackAndDimeCompanyBDonalTolerance: '',
          materialStrength: '',
          ductilityCrashProperties: '',
          formabilityDesignRadii: '',
          pieceCostReduction: '',
          capexToolingSaving: '',
          recycledMaterialCircularity: '',
          materialbeingreplaced: '',
          competitorifknown: '',
          noofPartsBaseline: '',
          noofPartsUpperPotential: '',
          partFormingComplexity: '',
          partManufacturingComplexity: '',
          partTypes_GeneralDescriptions: '',
          upperStructure: '',
          closures: '',
          batteryChargerBox: '',
          seats: '',
          chassis: '',
          wingFairingStructures: '',
          nacelleEngineCoverLipSkin: '',
          autoBoltOns: '',
          materialGroup: '',
          specificGrade: '',
          thickness: '',
          hDQ_D: '',
          tWR: '',
          recyclePotential: '',
          alloyInfluencer: '',
          materialSupplier: '',
          runningChangepotential: '',
          sOPYear: '2021',
          sOaMonth: '',
          peakVolumesLowerBaselinek: '',
          peakVolumesUpperk: '',
          estLifetimeVolumes: '',
          sourcingDecisionTiming: '',
          estValueperSet: '',
          lowerEstTierTurnover: '',
          upperEstTierTurnover: '',
          incomeEst: '',
          royalty: '',
          lowerRoyaltyEM: '',
          lowerEstRoyaltyEM: '',
          chance: 'H',
          avgPartValue: '',
          engineeringServicesaotn: '',
          tooling: '',
          potentialChannelPartner: '',
          progressLevel: '',
          dateofLastClientContact: '',
          reasonForLossorLapse: '',
          whatWouldHaveMadeItBetter: '',
          strategiBRaPkiPg: '',
          engServicesPotential: '',
          other: '',
        },
      },
    ])
    isOnline
      ? fetch(
        `https://apps.trisysit.com/posbackendapi/api/syncDeal/processDeal/1`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer' + loginToken,
          },
          body: JSON.stringify([
            {
              mobileDealId: editDealProps?.mobileDealId || generateDealId,
              dealId: editDealProps?.dealId || '',
              // companyId: accounts[0].companyId || editDealProps?.companyId || '',
              annualContractValue: '',
              updatedDate: null,
              pipeline: '',
              nextStep: '',
              closeDate: values?.closeDate || editDealProps?.closeDate,
              dealType: values.dealType || editDealProps?.dealType,
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
              dealStage: dealStageName || editDealProps?.dealStage || '',
              dealStatus:
                values?.dealStatus || editDealProps?.dealStatus || '',
              createdbyUser: profile || '',
              noOfAssociatedContacts: '',
              amount: values?.dealAmount,
              totalContractValue: '',
              probability: '',
              dealName: values?.dealName || editDealProps?.dealName || '',
              dealAmount:
                values?.dealAmount || editDealProps?.dealAmount || '',
              priority: values?.priority || editDealProps?.priority || '',
              monthlyRecurringRevenue: '',
              dealDescription:
                values?.dealDescription ||
                editDealProps?.dealDescription ||
                '',
              amountInCompanyCurrency: '',
              hierarchyId: '',
              noOfSalesActiviy: '',
              associatedCompanyId: '',
              associatedCompany: '',
              associatedContactId: '',
              associatedContact: '',
              companyId: companyId || route?.params?.dealPayload?.companyId || store.getState().auth.companyId,
              dealAccounts:
                accounts?.map(v => ({
                  ...v,
                  dealName: values?.dealName,
                  dealId: editDealProps?.dealId || null,
                  quantity: '0',
                })) ||
                JSON.parse(editDealProps?.dealAccounts)?.map(v => ({
                  ...v,
                  quantity: '0',
                })),

              dealContact:
                contacts?.map(v => ({
                  ...v,
                  dealName: values?.dealName,
                  quantity: '0',
                  dealId: editDealProps?.dealId || null,
                  contactPhoneNo: v.phoneNo || v?.contactPhoneNo,
                })) || JSON.parse(editDealProps?.dealContact),

              // dealProduct: productList?.map(v => ({
              //   ...v, dealName: values?.dealName, dealProductId: "", dealId: "", productName: v.item, productId: v.productId || Math.floor((1 + Math.random()) * 0x10000)
              //     .toString(16)
              //     .substring(1)
              // })) || JSON.parse(editDealProps?.dealProduct),
              dealProduct: [],
              dealDetail: {
                dealDetailId: '',
                dealId: null,
                initiationDate: '',
                calendarYearofStart: '',
                qtr: '',
                companyCommercialLead: '',
                nominatedCompanyLead: '',
                mainStatus: 'ACTIVE',
                market: 'Rail',
                originofEnquiry: '',
                internalProgRef: '',
                regionEngineering: '',
                region_Manufacture: '',
                customer: '',
                oEM: '',
                visitedITL: '',
                clientLead: '',
                clientEmail: '',
                platform: '',
                genre: '',
                programmeName: '',
                infoLinks: '',
                partConsolidation: '',
                weightReduction: '',
                springbackAndDimeCompanyBDonalTolerance: '',
                materialStrength: '',
                ductilityCrashProperties: '',
                formabilityDesignRadii: '',
                pieceCostReduction: '',
                capexToolingSaving: '',
                recycledMaterialCircularity: '',
                materialbeingreplaced: '',
                competitorifknown: '',
                noofPartsBaseline: '',
                noofPartsUpperPotential: '',
                partFormingComplexity: '',
                partManufacturingComplexity: '',
                partTypes_GeneralDescriptions: '',
                upperStructure: '',
                closures: '',
                batteryChargerBox: '',
                seats: '',
                chassis: '',
                wingFairingStructures: '',
                nacelleEngineCoverLipSkin: '',
                autoBoltOns: '',
                materialGroup: '',
                specificGrade: '',
                thickness: '',
                hDQ_D: '',
                tWR: '',
                recyclePotential: '',
                alloyInfluencer: '',
                materialSupplier: '',
                runningChangepotential: '',
                sOPYear: '2021',
                sOaMonth: '',
                peakVolumesLowerBaselinek: '',
                peakVolumesUpperk: '',
                estLifetimeVolumes: '',
                sourcingDecisionTiming: '',
                estValueperSet: '',
                lowerEstTierTurnover: '',
                upperEstTierTurnover: '',
                incomeEst: '',
                royalty: '',
                lowerRoyaltyEM: '',
                lowerEstRoyaltyEM: '',
                chance: 'H',
                avgPartValue: '',
                engineeringServicesaotn: '',
                tooling: '',
                potentialChannelPartner: '',
                progressLevel: '',
                dateofLastClientContact: '',
                reasonForLossorLapse: '',
                whatWouldHaveMadeItBetter: '',
                strategiBRaPkiPg: '',
                engServicesPotential: '',
                other: '',
              },
            },
          ]),
        },
      )
        .then(response => response.json())
        .then(result => {
          console.log('result deal', result)
          if (result?.data?.length > 0) {
            db.transaction(tx => {
              tx.executeSql(
                'delete from deal_contact WHERE dealId=?',
                [editDealProps?.dealId],
                (tx, results) => {
                  console.log(
                    'delete from deal_contact WHERE dealId=?',
                    results,
                  )
                },
                error => {
                  console.log('error while updating ' + error.message)
                },
              )
              tx.executeSql(
                'delete from deal_account WHERE dealId=?',
                [editDealProps?.dealId],
                (tx, results) => {
                  console.log(
                    'delete from deal_account WHERE dealId=?',
                    results,
                  )
                },
                error => {
                  console.log('error while updating ' + error.message)
                },
              )
            })
          }
          result.data?.forEach(i => {
            db.transaction(function (tx) {
              tx.executeSql(
                'INSERT OR REPLACE INTO All_Deal (mobileDealId,dealId,dealName,dealDescription,dealOwner,dealStage,dealAmount,closeDate,priority,createdDate, dealType, dealAccounts, dealContact,dealDetail,dealProduct,createdbyUser,isOnline,companyId)VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                [
                  i?.mobileDealId,
                  i.dealId,
                  i.dealName,
                  i.dealDescription,
                  i.dealOwner,
                  i.dealStage,
                  i.dealAmount,
                  i.closeDate,
                  i.priority,
                  i.createdDate,
                  i.dealType,
                  JSON.stringify(i.dealAccounts),
                  JSON.stringify(i.dealContact),
                  JSON.stringify(i.dealDetail),
                  JSON.stringify(i.dealProduct),
                  profile,
                  true,
                  i?.companyId
                  // , JSON.stringify(producting.map(v => ({ ...v, dealName: values?.dealName })))
                ],
                (tx, results) => {
                  if (results.rowsAffected > 0) {
                    Alert.alert(
                      'Success',
                      `Deal ${editDealProps ? 'updated' : 'added'
                      } successfully`,
                      [
                        {
                          text: 'Ok',
                          onPress: () => navigation.navigate('AllDeals'),
                          // onPress: () =>
                          //   navigation.navigate('Deal Detail', {
                          //     dealId: i?.dealId,
                          //     mobileDealId: i?.mobileDealId,
                          //   }),
                        },
                      ],
                      { cancelable: false },
                    )
                  }
                },
                error => {
                  console.log('error while INSERTING ' + error.message)
                },
              )

              {
                i?.dealAccounts?.map(v =>
                  tx.executeSql(
                    'INSERT INTO deal_account (mobiledealAccountId,mobileAccountId,mobileDealId,dealAccountId,accountId,accountName,dealId, dealName,quantity,isOnline) VALUES (?,?,?,?,?,?,?,?,?,?)',
                    [
                      v.mobiledealAccountId || generateUUID(),
                      v.mobileAccountId || '',
                      i?.mobileDealId || generateUUID(),
                      v.dealAccountId || '',
                      v.accountId || '',
                      v.accountName || '',
                      i.dealId,
                      v.dealName || '',
                      '0',
                      true,
                    ],
                    (tx, results) => {
                      console.log('dealAccounts added', results)
                    },
                    error => {
                      console.log(
                        'error while updating account ' + error.message,
                      )
                    },
                  ),
                )
              }
              {
                i?.dealContact?.map(v =>
                  tx.executeSql(
                    'INSERT INTO deal_contact (mobileDealContactId,mobileContactId,mobileDealId,dealContactId,contactId,contactName,dealId, dealName,contactPhoneNo,quantity,isOnline) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
                    [
                      v.mobileDealContactId || generateUUID(),
                      v.mobileContactId || '',
                      i?.mobileDealId || generateUUID(),
                      v.dealContactId || '',
                      v.contactId || '',
                      v.contactName || '',
                      i.dealId,
                      v.dealName || '',
                      v.contactPhoneNo || '',
                      '0',
                      true,
                    ],
                    (tx, results) => {
                      console.log('dealContact added', results)
                    },
                    error => {
                      console.log(
                        'error while updating dealContact added ' +
                        error.message,
                      )
                    },
                  ),
                )
              }
            })
          })
        })
        .catch(error => console.log('errorrr', console.log(error)))
      : db.transaction(tx => {
        console.log('offline')
        tx.executeSql(
          'delete from deal_contact WHERE mobileDealId=?',
          [editDealProps?.mobileDealId],
          (tx, results) => {
            console.log(
              'delete from deal_contact WHERE mobileDealId=?',
              results,
            )
          },
          error => {
            console.log('error while updating ' + error.message)
          },
        )
        tx.executeSql(
          'delete from deal_account WHERE mobileDealId=?',
          [editDealProps?.mobileDealId],
          (tx, results) => {
            console.log(
              'delete from deal_account WHERE mobileDealId=?',
              results,
            )
          },
          error => {
            console.log('error while updating ' + error.message)
          },
        )
        tx.executeSql(
          'INSERT OR REPLACE INTO  All_Deal (mobileDealId,dealId,dealName,dealDescription,dealOwner,dealStage,dealAmount,closeDate,priority,createdDate, dealType, dealAccounts, dealContact,createdbyUser,isOnline,companyId)VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
          [
            editDealProps?.mobileDealId || generateDealId,
            null,
            values?.dealName || '',
            values?.dealDescription || '',
            values?.dealOwner || '',
            dealStageName || editDealProps?.dealStage || '',
            values?.dealAmount || '',
            values?.closeDate || '',
            values?.priority || '',
            values?.createdDate || '',
            values?.dealType || '',
            JSON.stringify(
              accounts?.map(v => ({
                ...v,
                dealName: values?.dealName,
                dealId: null,
                quantity: '0',
              })),
            ) ||
            JSON.stringify(
              JSON.parse(editDealProps?.dealAccounts)?.map(v => ({
                ...v,
                quantity: '0',
              })),
            ),
            JSON.stringify(
              contacts?.map(v => ({
                ...v,
                dealName: values?.dealName,
                quantity: '0',
                dealId: null,
                contactPhoneNo: v.phoneNo || v?.contactPhoneNo,
              })),
            ) || JSON.stringify(JSON.parse(editDealProps?.dealContact)),
            profile,
            false,
            companyId || route?.params?.dealPayload?.companyId || store.getState().auth.companyId,
            // , JSON.stringify(producting.map(v => ({ ...v, dealName: values?.dealName })))
          ],
          (tx, results) => {
            console.log(results, [
              editDealProps?.mobileDealId || generateDealId,
              null,
              values?.dealName || '',
              values?.dealDescription || '',
              values?.dealOwner || '',
              dealStageName || editDealProps?.dealStage || '',
              values?.dealAmount || '',
              values?.closeDate || '',
              values?.priority || '',
              values?.createdDate || '',
              values?.dealType || '',
              JSON.stringify(
                accounts?.map(v => ({
                  ...v,
                  dealName: values?.dealName,
                  dealId: null,
                  quantity: '0',
                })),
              ) ||
              JSON.stringify(
                JSON.parse(editDealProps?.dealAccounts)?.map(v => ({
                  ...v,
                  quantity: '0',
                })),
              ),
              JSON.stringify(
                contacts?.map(v => ({
                  ...v,
                  dealName: values?.dealName,
                  quantity: '0',
                  dealId: null,
                  contactPhoneNo: v.phoneNo || v?.contactPhoneNo,
                })),
              ) || JSON.stringify(JSON.parse(editDealProps?.dealContact)),
              profile,
              false,
              companyId || route?.params?.dealPayload?.companyId || store.getState().auth.companyId,
              // , JSON.stringify(producting.map(v => ({ ...v, dealName: values?.dealName })))
            ], 'add deal data incoming offline')
            if (results.rowsAffected > 0) {
              {
                accounts?.map(v =>
                  tx.executeSql(
                    'INSERT OR REPLACE INTO deal_account (mobiledealAccountId,mobileAccountId,mobileDealId,dealAccountId,accountId,accountName,dealId, dealName,quantity) VALUES (?,?,?,?,?,?,?,?,?)',
                    [
                      v.mobiledealAccountId || generateUUID(),
                      v.mobileAccountId || '',
                      editDealProps?.mobileDealId || generateDealId,
                      v.dealAccountId || '',
                      v.accountId || '',
                      v.accountName || '',
                      editDealProps?.dealId || null,
                      values?.dealName || '',
                      '0',
                    ],
                    (tx, results) => {
                      console.log('dealAccounts added', results)
                    },
                    error => {
                      console.log(
                        'error while updating account ' + error.message,
                      )
                    },
                  ),
                )
              }
              {
                contacts?.map(v =>
                  tx.executeSql(
                    'INSERT OR REPLACE INTO deal_contact (mobileDealContactId,mobileContactId,mobileDealId,dealContactId,contactId,contactName,dealId, dealName,contactPhoneNo,quantity) VALUES (?,?,?,?,?,?,?,?,?,?)',
                    [
                      v.mobileDealContactId || generateUUID(),
                      v.mobileContactId || '',
                      editDealProps?.mobileDealId || generateDealId,
                      v.dealContactId || '',
                      v.contactId || '',
                      v.contactName || '',
                      editDealProps?.dealId || null,
                      values?.dealName || '',
                      v.phoneNo || v?.contactPhoneNo,
                      '0',
                    ],
                    (tx, results) => {
                      console.log('dealContact added', results)
                    },
                    error => {
                      console.log(
                        'error while updating dealContact added ' +
                        error.message,
                      )
                    },
                  ),
                )
              }
              Alert.alert(
                'Success',
                `Deal ${editDealProps ? 'updated' : 'added'} offline`,
                [
                  {
                    text: 'Ok',
                    onPress: () => navigation.navigate('AllDeals'),
                    // onPress: () =>
                    //   navigation.navigate('Deal Detail', {
                    //     mobileDealId:
                    //       editDealProps?.mobileDealId || generateDealId,
                    //   }),
                  },
                ],
                { cancelable: false },
              )
            }
          },
          error => {
            console.log('error while INSERTING ' + error.message)
          },
        )
      })
  }

  const getSelectedProduct = values => {
    setProductList(values)
  }
  const getCo = values => {
    console.log('valuessss', values)
    setShowAssociatedAccount(false)
    setShowAssociatedContact(false)
    setAccounts([])
    setContacts([])
    setCompanyValue(values.item)
    setCompanyId(values.id)
    setTimeout(() => {
      setShowAssociatedAccount(true)
      setShowAssociatedContact(true)
    }, 0);
  }

  return (
    <CardWrapper>
      {console.log('contact ka adata', accounts, contacts)}
      <Formik
        initialValues={{
          dealName: editDealProps?.dealName || '',
          dealDescription: editDealProps?.dealDescription || '',
          dealOwner: editDealProps?.dealOwner || '',
          dealStage: editDealProps?.dealStage || '',
          dealAmount: editDealProps?.dealAmount || '',
          dealType: editDealProps?.dealType || '',
          priority: editDealProps?.priority || '',
          closeDate: editDealProps?.closeDate?.slice(0, 10) || '',
          openDate: new Date(Date.now()),
        }}
        validationSchema={validationSchema}
        onSubmit={values => allfunctions(values)}
      >
        {({ handleChange, handleSubmit, values, errors, touched }) => (
          <View style={cardContainer}>
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
                  values.closeDate = new Date(val.nativeEvent.timestamp)
                    .toISOString()
                    .slice(0, 10)
                  setShowFrom(false)
                }}
              />
            )}

            <View style={floatingLabelContainer}>
              <TextInput
                style={floatingLabelContainerInternal}
                placeholderTextColor={placeholderTextColor}
                value={values.dealName}
                onChangeText={handleChange('dealName')}
                placeholder="Deal Name"
              />
              {errors.dealName && touched.dealName && (
                <Text style={errorMessage}>{errors.dealName}</Text>
              )}
            </View>

            <View style={floatingLabelContainer}>
              <TextInput
                style={floatingLabelContainerInternal}
                onChangeText={handleChange('dealDescription')}
                placeholderTextColor={placeholderTextColor}
                value={values.dealDescription}
                placeholder="Deal Description"
              />
              {errors.dealDescription && touched.dealDescription && (
                <Text style={errorMessage}>{errors.dealDescription}</Text>
              )}
            </View>
            <View style={pickerInputContainer}>
              <Picker
                style={{
                  bottom: 3.5,
                  display: 'flex',
                }}
                selectedValue={values.dealType}
                onValueChange={handleChange('dealType')}
                dropdownIconColor="grey"
              >
                <Picker.Item label="Deal Type" value="" style={pickerItem} />

                <Picker.Item
                  label="Aerospace"
                  value="Aerospace"
                  style={pickerItem2}
                />
                <Picker.Item
                  label="Automotive"
                  value="Automotive"
                  style={pickerItem2}
                />
                <Picker.Item
                  label="Consumer"
                  value="Consumer"
                  style={pickerItem2}
                />
                <Picker.Item label="Rail" value="Rail" style={pickerItem2} />
                <Picker.Item label="Sales" value="Sales" style={pickerItem2} />
                <Picker.Item label="Truck" value="Truck" style={pickerItem2} />
                <Picker.Item label="Other" value="Other" style={pickerItem2} />
              </Picker>
              {errors.dealType && touched.dealType && (
                <Text style={errorMessage}>{errors.dealType}</Text>
              )}
            </View>
            {/* <View style={pickerInputContainer}>
              <Picker style={{
                bottom: 3.5,
                display: 'flex',
              }}
                selectedValue={values.dealOwner}
                onValueChange={handleChange('dealOwner')}
                dropdownIconColor="grey"
              >
                <Picker.Item
                  label="Owner *"
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
              </Picker>
              {errors.dealOwner && touched.dealOwner && (
                <Text style={errorMessage}>{errors.dealOwner}</Text>
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
                selectedValue={values?.dealOwner}
                onValueChange={handleChange('dealOwner')}
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
            <View style={multiSelectOptions}>
              <MultiSelect
                onSelect={getStage}
                single
                label={'Stage'}
                K_OPTIONS={dealStage}
                selects={stageEdit}
              />
            </View>
            {errors.dealStage && touched.dealStage && (
              <Text style={errorMessage}>{errors.dealStage}</Text>
            )}

            {/* {show ? (
              <View>
                <View>
                  <TouchableOpacity
                    style={styles.buttonQuote}
                    onPress={() => navigation.navigate('Add Quote')}
                  >
                    <Text style={styles.textCancel}>Add Quote</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null} */}
            <View style={floatingLabelContainer}>
              <TextInput
                style={floatingLabelContainerInternal}
                onChangeText={handleChange('dealAmount')}
                placeholderTextColor={placeholderTextColor}
                value={values.dealAmount}
                placeholder="Amount"
              />
              {errors.dealAmount && touched.dealAmount && (
                <Text style={errorMessage}>{errors.dealAmount}</Text>
              )}
            </View>

            <View style={floatingLabelContainer}>
              <TextInput
                style={floatingLabelContainerInternal}
                onChangeText={handleChange('closeDate')}
                placeholderTextColor={placeholderTextColor}
                value={values.closeDate}
                placeholder="Exp Close Date"
              />
              <TouchableOpacity onPress={() => setShowFrom(!showFrom)}>
                <View
                  style={{
                    alignSelf: 'flex-end',
                    marginRight: 10,
                    marginTop: -40,
                  }}
                >
                  <Icon name={'calendar'} solid size={30} />
                </View>
              </TouchableOpacity>
              {errors.closeDate && touched.closeDate && (
                <Text style={errorMessage}>{errors.closeDate}</Text>
              )}
            </View>
            {/* {!hasProduct &&
              <View>
                <View style={{ flexDirection: 'row', display: 'flex', flex: 1 }}>
                  <View style={floatingLabelContainerRow}>
                    <TextInput
                      style={floatingLabelContainerInternalRow}
                      onChangeText={e => setAddItem(prev => ({
                        ...prev,
                        item: e,
                      }))}
                      placeholderTextColor={placeholderTextColor}
                      value={addItem.item}
                      placeholder="Item"
                    />
                    {errors.title && touched.title && (
                      <Text style={errorMessage}>{errors.title}</Text>
                    )}
                  </View>
                  <View style={floatingLabelContainerRow}>
                    <TextInput
                      style={floatingLabelContainerInternalRow}
                      placeholderTextColor={placeholderTextColor}
                      value={addItem.sizing}
                      onChangeText={e => setAddItem(prev => ({
                        ...prev,
                        sizing: e,
                      }))}
                      placeholder="Size"
                    />
                    {errors.title && touched.title && (
                      <Text style={errorMessage}>{errors.title}</Text>
                    )}
                  </View>
                </View>
                <View style={{ flexDirection: 'row', flex: 1 }}>
                  <View style={floatingLabelContainerRow}>
                    <TextInput
                      style={floatingLabelContainerInternalRow}
                      placeholderTextColor={placeholderTextColor}
                      value={addItem.quantity}
                      onChangeText={e => setAddItem(prev => ({
                        ...prev,
                        quantity: parseInt(e),
                      }))}
                      placeholder="Quantity"
                      keyboardType="numeric"
                    />
                    {errors.title && touched.title && (
                      <Text style={errorMessage}>{errors.title}</Text>
                    )}
                  </View>
                  <View style={floatingLabelContainerRow}>
                    <TextInput
                      style={floatingLabelContainerInternalRow}
                      placeholderTextColor={placeholderTextColor}
                      value={addItem.mrp}
                      onChangeText={e => setAddItem(prev => ({
                        ...prev,
                        mrp: e,
                      }))}
                      placeholder="Price"
                      keyboardType="numeric"
                    />
                    {errors.title && touched.title && (
                      <Text style={errorMessage}>{errors.title}</Text>
                    )}
                  </View>
                </View>
                <View>
                  <TouchableOpacity
                    style={[styles.buttonQuote, { marginBottom: productList ? 0 : 10 }]}
                    onPress={() => addItems()}
                  >
                    <Text style={styles.textCancel}>Add Item</Text>
                  </TouchableOpacity>
                </View>
              </View>
            }
            {hasProduct &&
              <ScrollView nestedScrollEnabled={true}>
                <View
                  style={[multiSelectOptions]}
                >
                  <MultiSelect
                    onSelect={getSelectedProduct}
                    multiple
                    label="Product"
                    K_OPTIONS={productDataGlobal}
                  />
                  {errors.quotationItem && touched.quotationItem && (
                    <Text style={errorMessage}>{errors.quotationItem}</Text>
                  )}
                </View>
              </ScrollView>} */}
            {productList?.length > 0 && (
              <View
                style={{
                  width: screenWidth - 70,
                  marginHorizontal: 10,
                  marginTop: 5,
                }}
              >
                <FlatList
                  nestedScrollEnabled={true}
                  contentContainerStyle={{ paddingBottom: 0 }}
                  data={productList}
                  extraData={reRender}
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
                                  onPress={() => counterButton(item, -1)}
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
                                  onPress={() => counterButton(item, 1)}
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
            )}

            <View style={pickerInputContainer}>
              <Picker
                style={{
                  bottom: 3.5,
                  display: 'flex',
                }}
                selectedValue={values.priority}
                onValueChange={handleChange('priority')}
                dropdownIconColor="grey"
              >
                <Picker.Item label="Priority" value="" style={pickerItem} />
                <Picker.Item label="High" value="High" style={pickerItem2} />
                <Picker.Item
                  label="Medium"
                  value="Medium"
                  style={pickerItem2}
                />
                <Picker.Item label="Low" value="Low" style={pickerItem2} />
              </Picker>
              {errors.storeContactName && touched.storeContactName && (
                <Text style={errorMessage}>{errors.storeContactName}</Text>
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
            {showAssociatedAccount &&
              <View style={multiSelectOptions}>
                {/* {console.log(accounts, 'dfghjkkkkkk')} */}
                <MultiSelect
                  onSelect={getAccount}
                  single
                  label={'Associate Account'}
                  selects={{
                    id: accounts[0]?.accountId || accounts[0]?.mobileAccountId,
                    item: accounts[0]?.accountName
                  }}
                  K_OPTIONS={accountData}
                />
                {errors.storeStatus && touched.storeStatus && (
                  <Text style={errorMessage}>{errors.storeStatus}</Text>
                )}
              </View>
            }
            {showAssociatedContact &&
              <View style={multiSelectOptions}>
                <MultiSelect
                  onSelect={getContact}
                  multiple
                  label="Associate Contact"
                  K_OPTIONS={contactData}
                  selects={editDealProps ? contacts : ''}
                // selects={contactEdit}
                />
                {errors.storeStatus && touched.storeStatus && (
                  <Text style={errorMessage}>{errors.storeStatus}</Text>
                )}
              </View>
            }
            <SaveAndCancelButton
              handleSubmit={handleSubmit}
              saveTitle={editDealProps ? 'Update' : 'Add'}
              navigation={navigation}
            // screenName={editDealProps ? 'Deal Detail' : 'AllDeals'}
            // dataPass={route.params}
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
    backgroundColor: '#c0ebf0',
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
    backgroundColor: '#00b8ce',
    borderRadius: 4,
    height: 40,
    marginTop: 10,
  },
  textCancel: {
    color: '#fff',
  },
})

export default AddDeal
