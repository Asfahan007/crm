import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import { FloatingLabelInput } from 'react-native-floating-label-input'
import {
  cancelButton,
  cancelText,
  cardContainer,
  errorMessage,
  floatingLabelContainer,
  floatingLabelContainerInternal,
  multiSelectOptions,
  pickerInputContainer,
  pickerItem,
  pickerItem2,
  placeholderTextColor,
  saveAndCancel,
  saveButton,
  saveText,
  screenHeight,
  screenWidth,
} from '../CustomComponents/Style'
import { store } from '../../Store'
import { openDatabase } from 'react-native-sqlite-storage'
import * as Yup from 'yup'
import { Picker } from '@react-native-picker/picker'
import SaveAndCancelButton from '../CustomComponents/SaveAndCancelButton'
import { hasStore, hasTerritory, hasCompany } from '../IsAvailable/IsAvailable'
import MultiSelect from '../Deal/Deals/Deals/MultiSelect'
import { useLayoutEffect } from 'react'
import { useIsFocused } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { useRef } from 'react'
import DeviceInfo from 'react-native-device-info'
import NetInfo from '@react-native-community/netinfo'
import generateUUID from '@/Containers/CustomComponents/GetUUID'

import CardWrapper from '../CustomComponents/CardWrapper'

const db = openDatabase({
  name: 'customer_database',
})

const AddCustomer = ({ navigation, route, fetched }) => {
  const [storeData, setStoreData] = useState([])
  const [storeId, setStoreId] = useState()
  const [storeValue, setStoreValue] = useState('')

  const [companyData, setCompanyData] = useState([])
  const [companyId, setCompanyId] = useState(route?.params?.params?.data?.companyId||'')
  const [companyN, setCompanyN] = useState([])

  const [companyValue, setCompanyValue] = useState('')

  const [territoryValue, setTerritoryValue] = useState('')
  const [territoryData, setTerritoryData] = useState([])
  const [territoryId, setTerritoryId] = useState()
  const generateMobileCustomerId = generateUUID()
  const isFocused = useIsFocused()
  const isOnline = store.getState().online.isOnline
  console.log('customer rote', route)
  let editData = route?.params?.params?.data
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

  let loginToken = store.getState().auth.token
  const role = store.getState().auth.role
  const profile = store.getState().auth.profile.name

  const validationSchema = Yup.object().shape({
    customerName: Yup.string()
      .min(2, 'Name must be 2 letters')
      .matches(/[^\s*].*[^\s*]/g, 'This field cannot contain only blankspaces')
      .required('Name is required')
      .label('Name'),
    customerMobile: Yup.string()
      .required('Mobile number is required')
      .matches(phoneRegExp, 'Phone number is not valid')
      .min(10, 'Too short, phone number must be 10 digit')
      .max(10, 'Too long, phone number must be 10 digit'),
    store: !store.getState().auth.storeId
      ? hasStore && storeValue
        ? Yup.string().test('isRequired', 'Store is required', () => {
            if (storeValue != '') return true
            return false
          })
        : Yup.string()
            .matches(/\S/, 'Name without spaces')
            .required('Store name is required')
            .label('Store Name')
      : null,
    customerStatus: Yup.string()
      .required('Status is required')
      .label('Select Status'),
    territory: !store.getState().auth.storeId
      ? hasTerritory && territoryValue
        ? Yup.string().test('isRequired', 'Territory is required', () => {
            if (territoryValue != '') return true
            return false
          })
        : Yup.string().required('Territory is required').label('Territory')
      : null,
    company: !store.getState().auth.companyId
      ? hasCompany && companyValue
        ? Yup.string().test('isRequired', 'Company is required', () => {
            if (companyValue != '') return true
            return false
          })
        : Yup.string().required('Company is required').label('Company')
      : null,
    // payType: Yup.string().required('Pay type is required').label('Pay Type'),
  })

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: editData ? 'Edit Customer' : 'Add Customer',
    })
  }, [navigation, editData])

  useEffect(() => {
    getCompanyDropdown()
  }, [])
  useEffect(() => {
    getCompanyName()
  }, [companyData])

  useEffect(() => {
    getStoreDropdown()
  }, [territoryId])

  const getCompanyDropdown = () => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * from company_info',
        [],
        (tx, res) => {
          let len = res.rows.length
          if (len > 0) {
            let results = []
            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              results.push({
                ...item,
                id: item.companyId || item?.mobileCompanyId,
                item: item.companyName,
                companyId: item.companyId,
              })
              setCompanyData(results)
            }
          }
        },
        error => {
          console.log('error while GETTING', error.message)
        },
      )
    })
  }

  const getCompanyName = () => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * from company_info WHERE companyId=?',
        [route?.params?.params?.data?.companyId],
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

  console.log(companyData, 'commmmmmmm')
  const getTerritoryDropdown = () => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * from territory_info where companyId=? and companyId not in ("")',
        [companyId],
        (tx, res) => {
          let len = res.rows.length
          if (len > 0) {
            let results = []
            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              results.push({
                ...item,
                id: item.territoryId || item?.mobileTerritoryId,
                item: item.territoryName,
                territoryId: item.territoryId,
              })
              setTerritoryData(results)
            }
          }
        },
        error => {
          console.log('error while GETTING', error.message)
        },
      )
    })
  }

  const getStoreDropdown = () => {
    console.log(
      "   'SELECT * from store_info WHERE territoryId=?'",
      territoryValue?.territoryId,
    )
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * from store_info WHERE territoryId=? or mobileTerritoryId=?',
        [territoryValue?.territoryId, territoryValue?.mobileTerritoryId],

        (tx, res) => {
          let len = res.rows.length
          let results = []
          if (len > 0) {
            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              results.push({
                ...item,
                id: item.storeId || item?.mobileStoreId,
                item: item.storeName,
                storeId: item.storeId,
              })
            }
          }
          setStoreData(results)
        },
        error => {
          console.log('error while GETTING', error.message)
        },
      )
    })
  }
  console.log(storeData, 'storeeeeeeeee')

  const getCompany = values => {
    console.log('company selected', values)
    setCompanyValue(values)
    setCompanyId(values.companyId)
  }
  useEffect(() => {
    getTerritoryDropdown()
  }, [companyId])

  const getTerritory = values => {
    console.log('territoryvaaaaal', values)
    setTerritoryValue(values)
    setTerritoryId(values.territoryId)
  }
  // console.log('terri', territoryId)
  const companyEdit = {
    id: route?.params?.params?.data?.companyId,
    item: companyN[0]?.item,
  }

  const getStore = values => {
    console.log('store', values)
    setStoreValue(values)
    setStoreId(values.storeId)
  }
  console.log('store', storeId)
  const territoryEdit = {
    id: route?.params?.params?.data?.territoryId,
    item: route?.params?.params?.data?.territoryName,
  }
  const storeEdit = {
    id: route?.params?.params?.data?.storeId,
    item: route?.params?.params?.data?.storeName,
  }

  const handleSubmit = values => {
    console.log('inside', [
      {
        customerId: editData?.customerId || '',
        companyId:
          companyId || editData?.companyId || store.getState().auth.companyId,
        customerName: values.customerName || '',
        customerMobile: values.customerMobile || '',
        customerStatus: values?.customerStatus || '',
        storeId:
          storeValue?.storeId || route?.params?.params?.data?.storeId || '',
        storeName: values.store || storeValue?.storeName,
        accountId: null,
        createdBy: profile || '',
        updatedBy: '',
        updatedDate: values?.updatedDate || '',
        createdDate: Date.now(),
        territoryId:
          territoryValue?.territoryId ||
          route?.params?.params?.data?.territoryId ||
          '',
        territoryName: values.territory || territoryValue?.territoryName,
        payType: values.payType || '',
        mobileTerritoryId: territoryValue?.mobileTerritoryId || null,
        mobileStoreId: storeValue?.mobileStoreId || null,
        mobileCustomerId:
          route?.params?.params?.data?.mobileCustomerId || generateUUID(),
      },
    ])
    isOnline
      ? fetch(
          `https://apps.trisysit.com/posbackendapi/api/syncCustomer/saveOrUpdate/1`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer' + loginToken,
            },
            body: JSON.stringify([
              {
                customerId: editData?.customerId || '',
                companyId:
                  companyId ||
                  editData?.companyId ||
                  store.getState().auth.companyId,
                customerName: values.customerName || '',
                customerMobile: values.customerMobile || '',
                customerStatus:
                  route?.params?.params?.customerStatus ||
                  values.customerStatus ||
                  '',
                storeId:
                  storeValue?.storeId ||
                  route?.params?.params?.data?.storeId ||
                  '',
                storeName: values.store || storeValue?.storeName,
                accountId: null,
                createdBy: profile || '',
                updatedBy: '',
                updatedDate: values?.updatedDate || '',
                createdDate: Date.now(),
                territoryId:
                  territoryValue?.territoryId ||
                  route?.params?.params?.data?.territoryId ||
                  '',
                territoryName:
                  values.territory || territoryValue?.territoryName,
                payType: values.payType || '',
                mobileTerritoryId: territoryValue?.mobileTerritoryId || null,
                mobileStoreId: storeValue?.mobileStoreId || null,
                mobileCustomerId:
                  route?.params?.params?.data?.mobileCustomerId ||
                  generateUUID(),
              },
            ]),
          },
        )
          .then(response => response.json())
          .then(result => {
            console.log('iiiiiiiii', result)
            result.data?.forEach(i => {
              db.transaction(txn => {
                txn.executeSql(
                  'INSERT OR REPLACE INTO customer_info (mobileCustomerId,mobileStoreId,mobileTerritoryId,customerId,customerName,customerMobile,customerStatus,storeName,territoryName,payType,storeId,territoryId,companyId,isOnline) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                  [
                    i?.mobileCustomerId,
                    i?.mobileStoreId,
                    i?.mobileTerritoryId,
                    route?.params?.params?.customerId || i?.customerId,
                    i?.customerName,
                    i?.customerMobile,
                    i?.customerStatus,
                    storeValue?.storeName || i?.storeName,
                    territoryValue?.territoryName || i?.territoryName,
                    i?.payType,
                    i?.storeId,
                    i?.territoryId,
                    i?.companyId,
                    true,
                  ],
                  (txn, results) => {
                    console.log('Results', results.rowsAffected)
                    if (results.rowsAffected > 0) {
                      Alert.alert(
                        'Success',
                        `Customer ${
                          route?.params?.params ? 'updated' : 'added'
                        } successfully`,
                        [
                          {
                            text: 'Ok',
                            onPress: () => navigation.navigate('Customer List'),
                            // onPress: () =>
                            //   navigation.navigate('Customer Detail', {
                            //     customerId: i?.customerId,
                            //     mobileCustomerId: i?.mobileCustomerId,
                            //   }),
                          },
                        ],
                        { cancelable: false },
                      )
                    } else alert('Updation Failed')
                  },
                )
              })
            })
          })
          .catch(error => console.log('errorrr catcccch', error))
      : db.transaction(function (txn) {
          txn.executeSql(
            'INSERT OR REPLACE INTO customer_info (mobileCustomerId,mobileStoreId,mobileTerritoryId,customerId,customerName,customerMobile,customerStatus,storeName,territoryName,payType,storeId,territoryId,isOnline,companyId) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
            [
              editData?.mobileCustomerId || generateMobileCustomerId,
              storeValue?.mobileStoreId,
              territoryValue?.mobileTerritoryId,
              editData?.customerId || null,
              values.customerName || '',
              values.customerMobile || '',
              values.customerStatus || '',
              storeValue?.storeName || values.store,
              territoryValue?.territoryName || values.territory,
              values.payType || '',
              route?.params?.params?.storeId || storeValue?.storeId,
              route?.params?.params?.territoryId ||
                territoryValue?.territoryId ||
                '',
              false,
              companyId ||
                editData?.companyId ||
                store.getState().auth.companyId,
            ],

            (txn, results) => {
              console.log('Results', results.rowsAffected)
              if (results.rowsAffected > 0) {
                Alert.alert(
                  'Success',
                  `Customer ${editData ? 'updated' : 'added'} offline`,
                  [
                    {
                      text: 'Ok',
                      onPress: () => navigation.navigate('Customer List'),
                      // onPress: () =>
                      //   navigation.navigate('Customer Detail', {
                      //     mobileCustomerId:
                      //       route?.params?.params?.data?.mobileCustomerId ||
                      //       generateMobileCustomerId,
                      //   }),
                    },
                  ],
                  { cancelable: false },
                )
              }
            },
            error => {
              console.log('error while adding', error.message)
            },
          )
        })
  }
  return (
    <CardWrapper>
      {console.log('ddddddd', editData)}
      {console.log('territoryDataaaaas', territoryData)}
      {console.log('storeeeeeee', storeData)}

      <View style={{ alignItems: 'center' }}>
        <Formik
          initialValues={{
            customerName: editData?.customerName || '',
            customerMobile: editData?.customerMobile || '',
            store: editData?.storeName || '',
            territory: editData?.territoryName || '',
            customerStatus: editData?.customerStatus || '',
            payType: editData?.payType || '',
            company: companyN[0]?.item ||route?.params?.params?.data?.companyId|| '',
          }}
          validationSchema={validationSchema}
          onSubmit={values => handleSubmit(values)}
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
              <View style={floatingLabelContainer}>
                <TextInput
                  style={floatingLabelContainerInternal}
                  onChangeText={handleChange('customerName')}
                  value={values.customerName}
                  placeholderTextColor={placeholderTextColor}
                  placeholder="Name"
                />
                {errors.customerName && touched.customerName && (
                  <Text style={errorMessage}>{errors.customerName}</Text>
                )}
              </View>
              <View style={floatingLabelContainer}>
                <TextInput
                  style={floatingLabelContainerInternal}
                  onChangeText={handleChange('customerMobile')}
                  placeholderTextColor={placeholderTextColor}
                  value={values.customerMobile}
                  maxLength={10}
                  keyboardType="numeric"
                  placeholder="Mobile"
                />
                {errors.customerMobile && touched.customerMobile && (
                  <Text style={errorMessage}>{errors.customerMobile}</Text>
                )}
              </View>

              {store.getState().auth.role === 'Store'}
              {hasCompany && !store.getState().auth.companyId && (
                <View style={multiSelectOptions}>
                  <MultiSelect
                    onSelect={getCompany}
                    single
                    label={'Select Company'}
                    K_OPTIONS={companyData}
                    selects={companyEdit}
                  />
                  {errors.company && touched.company && (
                    <Text style={[errorMessage, { marginBottom: -11 }]}>
                      {errors.company}
                    </Text>
                  )}
                </View>
              )}

              {!store.getState().auth.storeId && (
                <>
                  {hasTerritory && (
                    <View style={multiSelectOptions}>
                      <MultiSelect
                        onSelect={getTerritory}
                        single
                        label={'Select Territory'}
                        K_OPTIONS={territoryData}
                        selects={territoryEdit}
                      />
                      {errors.territory && touched.territory && (
                        <Text style={[errorMessage, { marginBottom: -11 }]}>
                          {errors.territory}
                        </Text>
                      )}
                    </View>
                  )}
                  {!hasTerritory && (
                    <View style={floatingLabelContainer}>
                      <TextInput
                        style={floatingLabelContainerInternal}
                        onChangeText={handleChange('territory')}
                        value={values.territory}
                        placeholderTextColor={placeholderTextColor}
                        placeholder="Territory"
                      />
                      {errors.territory && touched.territory && (
                        <Text style={errorMessage}>{errors.territory}</Text>
                      )}
                    </View>
                  )}
                  {hasStore && (
                    <View style={multiSelectOptions}>
                      <MultiSelect
                        onSelect={getStore}
                        single
                        label={'Select Store'}
                        K_OPTIONS={storeData}
                        selects={storeEdit}
                      />
                      {errors.store && touched.store && (
                        <Text style={[errorMessage, { marginBottom: -11 }]}>
                          {errors.store}
                        </Text>
                      )}
                    </View>
                  )}
                  {!hasStore && (
                    <View style={floatingLabelContainer}>
                      <TextInput
                        style={floatingLabelContainerInternal}
                        onChangeText={handleChange('store')}
                        value={values.store}
                        placeholder="Store"
                        placeholderTextColor={placeholderTextColor}
                      />
                      {errors.store && touched.store && (
                        <Text style={errorMessage}>{errors.store}</Text>
                      )}
                    </View>
                  )}
                </>
              )}
              {/* <View style={floatingLabelContainer}>
                <TextInput
                  style={floatingLabelContainerInternal}
                  onChangeText={handleChange('payType')}
                  value={values.payType}
                  placeholderTextColor={placeholderTextColor}
                  placeholder="Pay Type"
                />
                {errors.payType && touched.payType && (
                  <Text style={errorMessage}>{errors.payType}</Text>
                )}
              </View> */}
              <View style={pickerInputContainer}>
                <Picker
                  style={{
                    bottom: 3.5,
                    display: 'flex',
                  }}
                  selectedValue={values.customerStatus}
                  onValueChange={handleChange('customerStatus')}
                  // onPress={alert("yhuji")}
                >
                  <Picker.Item
                    style={pickerItem}
                    label="Select Status"
                    value=""
                  />
                  <Picker.Item
                    style={pickerItem2}
                    label="ACTIVE"
                    value="ACTIVE"
                  />
                  <Picker.Item
                    style={pickerItem2}
                    label="INACTIVE"
                    value="INACTIVE"
                  />
                </Picker>
                {errors.customerStatus && touched.customerStatus && (
                  <Text style={errorMessage}>{errors.customerStatus}</Text>
                )}
              </View>

              <SaveAndCancelButton
                handleSubmit={handleSubmit}
                saveTitle={editData ? 'Update' : 'Add'}
                navigation={navigation}
                screenName="Customer List"
              />
            </View>
          )}
        </Formik>
      </View>
    </CardWrapper>
  )
}

export default AddCustomer
