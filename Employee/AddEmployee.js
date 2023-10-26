import {
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native'
import React, { useLayoutEffect } from 'react'
import { Formik } from 'formik'
import { FloatingLabelInput } from 'react-native-floating-label-input'
import { Picker } from '@react-native-picker/picker'
import { ScrollView } from 'react-native-gesture-handler'
import { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import Icon from 'react-native-vector-icons/Ionicons'
import { openDatabase } from 'react-native-sqlite-storage'
import { useEffect, useRef } from 'react'
import { navigate } from '../../Navigators/utils'
import * as Yup from 'yup'
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
} from '../CustomComponents/Style'
import { now } from 'moment'

import SaveAndCancelButton from '../CustomComponents/SaveAndCancelButton'
import CardWrapper from '../CustomComponents/CardWrapper'
import { hasStore, hasTerritory, hasCompany } from '../IsAvailable/IsAvailable'
import MultiSelect from '../Deal/Deals/Deals/MultiSelect'
import { useIsFocused } from '@react-navigation/native'
import DeviceInfo from 'react-native-device-info'
import NetInfo from '@react-native-community/netinfo'
import { store } from '../../Store'

import { useDispatch, useSelector } from 'react-redux'
import generateUUID from '../CustomComponents/GetUUID'

const db = openDatabase({
  name: 'customer_database',
})

const AddEmployee = ({ navigation, route }) => {
  const [showFrom, setShowFrom] = useState(false)
  const [mobileId, setMobileId] = useState()
  const [deviceId, setDeviceId] = useState()
  const [showTo, setShowTo] = useState(false)
  const [DOJ, setDOJ] = useState(false)
  const [DOL, setDOL] = useState(false)
  const [generateMobileEmployeeId, setGenerateMobileEmployeeId] = useState(
    generateUUID(),
  )

  const [storeData, setStoreData] = useState([])
  const [storeValue, setStoreValue] = useState('')
  const [storeId, setStoreId] = useState()
  const [date, setDate] = useState(Date.now().toString())

  const [territoryData, setTerritoryData] = useState([])
  const [territoryN, setTerritoryN] = useState([])

  const [territoryID, setTerritoryID] = useState([])
  const [territoryValue, setTerritoryValue] = useState( territoryN[0]||[])

  const [territoryId, setTerritoryId] = useState( territoryN[0]?.territoryId||'')

  const isFocused = useIsFocused()
  const [companyData, setCompanyData] = useState([])
  const [companyId, setCompanyId] = useState(route?.params?.params?.companyId ||
    store.getState().auth.companyId ||
    '')
  const [companyN, setCompanyN] = useState([])

  let editEmployee = route?.params?.params
  console.log('erererererere', editEmployee)
  const storeEdit = { id: editEmployee?.storeId, item: editEmployee?.storeName }
  console.log('hhhhhhhh', route)
  const loginToken = store.getState().auth.token
  const role = store.getState().auth.role
  const profile = store.getState().auth.profile.name

  const [online, setOnline] = useState(false)

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
  const validationSchema = Yup.object().shape({
    employeeName: Yup.string().required('Name is required').label('Name'),
    storeName:
      hasStore && storeValue
        ? Yup.string().test('isRequired', 'Store is required', () => {
          if (storeValue != '') return true
          return false
        })
        : Yup.string()
          // .matches(/^\S*$/, 'Name without spaces')
          .required('Store name is required')
          .label('Store'),
    employeeEmail: Yup.string()
      .email('Must be a valid user Email')
      .max(255)
      .required('Email is required')
      .label('Email'),
    employeeMobile: Yup.string()
      .required('Mobile number is required')
      .matches(phoneRegExp, 'Phone number is not valid')
      .min(10, 'Too short, phone number must be 10 digit')
      .max(10, 'Too long, phone number must be 10 digit'),
    employeeStatus: Yup.string().required('Status is required').label('Status'),
    dateofJoining: Yup.string()
      .required('Date of Joining is required')
      .label('Date of Joining'),
    dateofLeaving: Yup.string()
      // .required('Date of leaving is required')
      .label('Date of Leaving'),
    addressLIne1: Yup.string().required('Address is required').label('Address'),
    state: Yup.string().required('State name is required').label('State'),
    city: Yup.string().required('City name is required').label('City'),
    zipcode: Yup.string()
      .required('Zipcode is required')
      .matches(phoneRegExp, 'Zipcode is not valid')
      .min(6, 'Too short, phone number must be 10 digit')
      .max(6, 'Too long, phone number must be 10 digit'),

    employeeServiceCommission: Yup.string()
      .required('Service Commision is required')
      .label('Service Commision'),
    employeeProductCommission: Yup.string()
      .required('Product Commision is required')
      .label('Product Commision'),
    employeeSalary: Yup.string().required('Salary is required').label('Salary'),
    employeeVariableSalary: Yup.string()
      .required('Variable Salary is required')
      .label('Variable Salary'),
    // employeeYearlyAllowanceLeave: Yup.number()
    //   .required('Yearly Allowance Leave is required')
    //   .label('Yearly Allowance Leave'),
    //   yearlyAllowableLeave: Yup.string()
    //     .required('Yearly Allowance Leave is required')
    //     .label('Yearly Allowance Leave'),
    //   availableLeaveBalance: Yup.mixed().test(
    //     'isSmaller',
    //     'Employee Leave Balance must be less than Yearly Allowable Leave',
    //     (values, testContext) => {
    //       if (testContext.parent.yearlyAllowableLeave >= values) return true
    //       return false
    //  }),
    yearlyAllowableLeave: Yup.string()
      .required('Yearly Allowance Leave is required')
      .label('Yearly Allowance Leave'),
    availableLeaveBalance: Yup.number().test(
      'isSmaller',
      'Employee Leave Balance must be less than Yearly Allowable Leave',
      (value, context) => {
        const { yearlyAllowableLeave } = context.parent
        return value < yearlyAllowableLeave
      },
    ),
  })
  const companyEdit = {
    id: route?.params?.params?.companyId,
    item: companyN[0]?.item,
  }
  const territoryEdit = {
    id: territoryN[0]?.territoryId,
    item: territoryN[0]?.territoryName,
  }
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: editEmployee ? 'Edit Employee' : 'Add Employee',
    })
  }, [editEmployee])
  const getCompanyName = () => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * from company_info WHERE companyId=?',
        [route?.params?.params?.companyId],
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
  const getTerritoryID = () => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * from store_info WHERE storeId=?',
        [route?.params?.params?.storeId],
        (tx, res) => {
          let len = res.rows.length
          if (len > 0) {
            let results = []
            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              results.push({
                id: item?.territoryId,
              })
            }
            setTerritoryID(results)
          }
        },
        error => {
          console.log('error while GETTING', error.message)
        },
      )
    })
  }

  const getTerritoryName = () => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * from territory_info WHERE territoryId=?',
        [territoryID[0]?.id],
        (tx, res) => {
          let len = res.rows.length
          if (len > 0) {
            let results = []
            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              results.push({
                territoryName: item?.territoryName,
                territoryId: item?.territoryId,
                mobileTerritoryId:item?.mobileTerritoryId,
              })
            }
            setTerritoryN(results)
          }
        },
        error => {
          console.log('error while GETTING', error.message)
        },
      )
    })
  }

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
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * from store_info where territoryId=? or mobileTerritoryId=?; ',
        [territoryValue?.territoryId, territoryValue?.mobileTerritoryId],

        (tx, res) => {
          let len = res.rows.length
          if (len > 0) {
            let results = []
            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              results.push({
                item: item.storeName,
                storeId: item.storeId,
              })
              setStoreData(results)
            }
          }
        },
        error => {
          console.log('error while GETTING', error.message)
        },
      )
    })
  }

  console.log('fffffffff', territoryN)
  useEffect(() => {
    getCompanyDropdown()
  }, [])

  const getCompany = values => {
    console.log('company', values)
    // setCompanyValue(values)
    setCompanyId(values.companyId)
  }
  useEffect(() => {
    getTerritoryDropdown()
  }, [isFocused, companyId])
  const getTerritory = values => {
    console.log('territoryvaaaaal', values)
    setTerritoryValue(values)
    setTerritoryId(values.territoryId)
  }
  // const territoryEdit = {
  //   id: territoryValue?.territoryId,
  //   item: territoryValue?.territoryName,
  // }
  useEffect(() => {
    getStoreDropdown()
  }, [isFocused,territoryId,territoryN])

  const getStore = values => {
    console.log('StoreeeeeValueee', values)
    setStoreValue(values)
  }

  useEffect(() => {
    DeviceInfo.getAndroidId().then(androidId => {
      setMobileId(androidId)
    })
    DeviceInfo.getDevice().then(device => {
      setDeviceId(device)
    })
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
  useEffect(() => {
    getCompanyName()
  }, [companyData])
  useEffect(() => {
    getTerritoryID()
  }, [storeData])
  useEffect(() => {
    getTerritoryName()
  }, [territoryID])

  const handleSubmit = values => {
    // const [dateJoin, setDateJoin] = useState(new Date(values.dateofJoining))

    console.log('cosole', values)
    console.log('inside', [
      {
        employeeId: editEmployee?.employeeId || generateMobileEmployeeId || '',
        employeeName: editEmployee?.employeeName || values?.employeeName || '',
        employeeDescription:
          editEmployee?.employeeDescription ||
          values?.employeeDescription ||
          '',
        employeeEmail:
          editEmployee?.employeeEmail || values?.employeeEmail || '',
        employeeMobile:
          editEmployee?.employeeMobile || values?.employeeMobile || '',
        employeeImage: null,
        employeeStatus:
          editEmployee?.employeeStatus || values.employeeStatus || '',
        dateofJoining:
          editEmployee?.dateofJoining || values.dateofJoining || '',
        dateofLeaving:
          editEmployee?.dateofLeaving || values.dateofLeaving || '',
        addressLIne1: editEmployee?.addressLIne1 || values.addressLIne1 || '',
        addressLine2: null,
        city: editEmployee?.city || values.city || '',
        state: editEmployee?.state || values.state || '',
        zipcode: editEmployee?.zipcode || values.zipcode || '',
        employeeServiceCommission:
          editEmployee?.employeeServiceCommission ||
          values.employeeServiceCommission ||
          '',
        employeeProductCommission:
          editEmployee?.employeeProductCommission ||
          values.employeeProductCommission ||
          '',
        createdBy: profile || '',
        updatedBy: null,
        createdDate: date || '',
        updatedDate: null,
        employeeSalary:
          editEmployee?.employeeSalary || values.employeeSalary || '',
        employeeVariableSalary:
          editEmployee?.employeeVariableSalary ||
          values.employeeVariableSalary ||
          '',
        workScheduleJson: null,
        yearlyAllowableLeave:
          editEmployee?.yearlyAllowableLeave ||
          values.yearlyAllowableLeave ||
          '',
        availableLeaveBalance:
          editEmployee?.availableLeaveBalance ||
          values.availableLeaveBalance ||
          '',
        storeId:
          storeValue?.storeId ||
          editEmployee?.storeId ||
          store.getState().auth.storeId,
        accountId: null,
        storeName: storeValue?.item || values.storeName || '',
        companyId:
          companyId ||
          route?.params?.params?.companyId ||
          store.getState().auth.companyId ||
          '',
        mobileStoreId: null,
        mobileEmployeeId: null,
      },
    ])

    // console.log('Hi Val', values)
    store.getState().online.isOnline
      ? fetch(
        `https://apps.trisysit.com/posbackendapi/api/syncEmployee/saveOrUpdate/1`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer' + loginToken,
          },
          body: JSON.stringify([
            {
              employeeId:
                editEmployee?.employeeId || generateMobileEmployeeId || '',
              employeeName: values?.employeeName || '',
              employeeDescription: values?.employeeDescription || '',
              employeeEmail: values?.employeeEmail || '',
              employeeMobile: values?.employeeMobile || '',
              employeeImage: null,
              employeeStatus: values.employeeStatus || '',
              dateofJoining: values.dateofJoining || '',
              dateofLeaving: values.dateofLeaving || null,
              addressLIne1: values.addressLIne1 || '',
              addressLine2: null,
              city: values.city || '',
              state: values.state || '',
              zipcode: values.zipcode || '',
              employeeServiceCommission:
                values.employeeServiceCommission || '',
              employeeProductCommission:
                values.employeeProductCommission || '',
              createdBy: profile || '',
              updatedBy: null,
              createdDate: date || '',
              updatedDate: null,
              employeeSalary: values.employeeSalary || '',
              employeeVariableSalary: values.employeeVariableSalary || '',
              workScheduleJson: null,
              yearlyAllowableLeave: values.yearlyAllowableLeave || '',
              availableLeaveBalance: values.availableLeaveBalance || '',
              storeId:
                storeValue?.storeId ||
                editEmployee?.storeId ||
                store.getState().auth.storeId,
              accountId: null,
              storeName: storeValue?.item || values.storeName || '',
              companyId:
                companyId ||
                route?.params?.params?.companyId ||
                store.getState().auth.companyId ||
                '',
              mobileStoreId: null,
              mobileEmployeeId: null,
            },
          ]),
        },
      )
        .then(response => response.json())
        .then(result => {
          console.log('iiiiiiiii', result)
          result.data?.forEach(i => {
            db.transaction(txn => {
              // console.log(editEmployee,"yyyyyyyyyyy")
              txn.executeSql(
                'INSERT OR REPLACE INTO employee_info(mobileEmployeeId,employeeId,storeName,storeId,employeeName,employeeMobile,city,state,zipcode,employeeServiceCommission,employeeProductCommission,employeeSalary,employeeVariableSalary,yearlyAllowableLeave,availableLeaveBalance,dateofLeaving,employeeStatus,dateofJoining,employeeEmail,addressLIne1,mobileStoreId,isOnline,companyId)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                [
                  route?.params?.params?.mobileEmployeeId ||
                  i.mobileEmployeeId ||
                  generateUUID(),
                  route?.params?.params?.employeeId || i.employeeId,
                  i.storeName,
                  i.storeId,
                  i.employeeName,
                  i.employeeMobile,
                  i.city,
                  i.state,
                  i.zipcode,
                  i.employeeServiceCommission,
                  i.employeeProductCommission,
                  i.employeeSalary,
                  i.employeeVariableSalary,
                  i.yearlyAllowableLeave,
                  i.availableLeaveBalance,
                  i.dateofLeaving,
                  i.employeeStatus,
                  i.dateofJoining,
                  i.employeeEmail,
                  i.addressLIne1,
                  i.mobileStoreId,
                  true,
                  i.companyId,
                  // route?.params?.params?.id
                ],
                (tx, results) => {
                  if (results.rowsAffected > 0) {
                    Alert.alert(
                      'Success',
                      `Employee  ${editEmployee ? 'updated' : 'added'
                      } successfully`,
                      [
                        {
                          text: 'Ok',
                          onPress: () => navigation.navigate('Employee List'),
                          // onPress: () =>
                          //   navigation.navigate('Employee Details', {
                          //     employeeId: i?.employeeId,mobileEmployeeId:i?.mobileEmployeeId
                          //   }),
                        },
                      ],
                      { cancelable: false },
                    )
                  }
                },
                error => {
                  console.log('error while adding store ' + error.message)
                },
              )
            })
          })
        })
        .catch(error => console.log('errorrr', error))
      : db.transaction(tx => {
        tx.executeSql(
          'INSERT OR REPLACE INTO employee_info (mobileEmployeeId,mobileStoreId,employeeId,storeName,employeeName,employeeEmail,employeeMobile,employeeStatus,dateofJoining,dateofLeaving,addressLine1,city,zipcode,employeeServiceCommission,employeeProductCommission,employeeSalary,employeeVariableSalary,yearlyAllowableLeave,availableLeaveBalance,state,storeId,companyId,accountId,isOnline) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
          [
            editEmployee?.mobileEmployeeId || generateMobileEmployeeId,
            values.mobileStoreId,
            editEmployee?.employeeId || null,
            values?.storeName || storeValue?.item,
            values?.employeeName,
            values?.employeeEmail,
            values?.employeeMobile,
            values?.employeeStatus,
            values?.dateofJoining,
            values?.dateofLeaving,
            values?.addressLIne1,
            values?.city,
            values?.zipcode,
            values?.employeeServiceCommission,
            values?.employeeProductCommission,
            values?.employeeSalary,
            values?.employeeVariableSalary,
            values?.yearlyAllowableLeave,
            values?.availableLeaveBalance,
            values?.state,
            storeValue?.storeId || editEmployee?.storeId || '',
            companyId ||
            route?.params?.params?.companyId ||
            values?.companyId ||
            store.getState().auth.companyId ||
            '',
            values?.accountId,
            false,
          ],
          (txn, res) => {
            console.log('Results', res)
            if (res.rowsAffected > 0) {
              Alert.alert(
                'Added',
                `Employee ${editEmployee ? 'updated' : 'added'} offline`,
                [
                  {
                    text: 'Ok',
                    onPress: () => navigation.navigate('Employee List'),
                    // onPress: () => navigation.navigate('Employee Details',{employeeId: editEmployee?.employeeId || null, mobileEmployeeId: editEmployee?.mobileEmployeeId || generateMobileEmployeeId}),
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

  console.log(storeValue?.item, 'Ssssssssssssssss')

  const refRBSheet = useRef()

  return (
    <CardWrapper>
      <Formik
        initialValues={{
          storeName: editEmployee?.storeName || editEmployee?.storeId || '',
          employeeName: editEmployee?.employeeName || '',
          employeeEmail: editEmployee?.employeeEmail || '',
          employeeMobile: editEmployee?.employeeMobile || '',
          employeeStatus: editEmployee?.employeeStatus || '',
          dateofJoining: editEmployee?.dateofJoining || '',
          dateofLeaving: editEmployee?.dateofLeaving || '',
          addressLIne1: editEmployee?.addressLIne1 || '',
          state: editEmployee?.state || '',
          city: editEmployee?.city || '',
          zipcode: editEmployee?.zipcode || '',
          employeeServiceCommission:
            editEmployee?.employeeServiceCommission || '',
          employeeProductCommission:
            editEmployee?.employeeProductCommission || '',
          employeeSalary: editEmployee?.employeeSalary || '',
          employeeVariableSalary: editEmployee?.employeeVariableSalary || '',
          yearlyAllowableLeave: editEmployee?.yearlyAllowableLeave || '',
          availableLeaveBalance: editEmployee?.availableLeaveBalance || '',
          openDate: new Date(Date.now()),
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
              </View>
            )}
            {hasTerritory && !store.getState().auth.storeId && (
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
            {!hasStore && (
              <View style={floatingLabelContainer}>
                <TextInput
                  style={floatingLabelContainerInternal}
                  onChangeText={handleChange('storeName')}
                  value={values.storeName}
                  placeholderTextColor={placeholderTextColor}
                  placeholder="Store"
                />
                {errors.storeName && touched.storeName && (
                  <Text style={errorMessage}>{errors.storeName}</Text>
                )}
              </View>
            )}
            {hasStore && !store.getState().auth.storeId && (
              <View style={multiSelectOptions}>
                <MultiSelect
                  onSelect={getStore}
                  single
                  label={'Select Store'}
                  K_OPTIONS={storeData}
                  selects={storeEdit}
                />
                {errors.storeName && touched.storeName && (
                  <Text style={[errorMessage, { marginBottom: -11 }]}>
                    {errors.storeName}
                  </Text>
                )}
              </View>
            )}
            <View style={floatingLabelContainer}>
              <TextInput
                style={floatingLabelContainerInternal}
                onChangeText={handleChange('employeeName')}
                value={values.employeeName}
                placeholderTextColor={placeholderTextColor}
                placeholder="Name"
              />
              {errors.employeeName && touched.employeeName && (
                <Text style={errorMessage}>{errors.employeeName}</Text>
              )}
            </View>
            <View style={floatingLabelContainer}>
              <TextInput
                style={floatingLabelContainerInternal}
                onChangeText={handleChange('employeeEmail')}
                value={values.employeeEmail}
                placeholderTextColor={placeholderTextColor}
                placeholder="Email"
              />
              {errors.employeeEmail && touched.employeeEmail && (
                <Text style={errorMessage}>{errors.employeeEmail}</Text>
              )}
            </View>
            <View style={floatingLabelContainer}>
              <TextInput
                style={floatingLabelContainerInternal}
                onChangeText={handleChange('employeeMobile')}
                value={values.employeeMobile}
                placeholderTextColor={placeholderTextColor}
                placeholder="Mobile"
                keyboardType="numeric"
                maxLength={10}
              />
              {errors.employeeMobile && touched.employeeMobile && (
                <Text style={errorMessage}>{errors.employeeMobile}</Text>
              )}
            </View>

            <View style={pickerInputContainer}>
              <Picker
                style={{ bottom: 3.5 }}
                selectedValue={values.employeeStatus}
                onValueChange={handleChange('employeeStatus')}
              >
                <Picker.Item
                  style={pickerItem}
                  label={values.employeeStatus || 'Select Status'}
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
              {errors.employeeStatus && touched.employeeStatus && (
                <Text style={[errorMessage, { marginTop: -1.5 }]}>
                  {errors.employeeStatus}
                </Text>
              )}
            </View>

            {/* )} */}
            {/* {!hasStore && (
                <View style={floatingLabelContainer}>
                 <TextInput
                    styles={floatingLabelContainerInternal}
                    placeholder="Store"
                    label={'Store'}
                    placeholderTextColor="grey"
                    paddingHorizontal={10}
                    paddingTop={5}
                    value={values.store}
                    onChangeText={handleChange('store')}
                 />
                  {errors.store && touched.store && (
                    <Text style={errorMessage}>{errors.store}</Text>
                  )}
                </View>
              )} */}
            {showFrom && (
              <DateTimePicker
                testID="dateTimePicker"
                timeZoneOffsetInMinutes={0}
                value={values.openDate}
                mode="date"
                is24Hour={true}
                display="default"
                selected={values.dateofJoining}
                onBlur={(date, event) => console.log('dateee', date, event)}
                onChange={val => {
                  values.dateofJoining = new Date(val.nativeEvent.timestamp)
                    .toISOString()
                    .slice(0, 10)
                  setShowFrom(false)
                  setDOJ(new Date(val.nativeEvent.timestamp))
                }}
              />
            )}
            {/* {showTo && (
              <DateTimePicker
                testID="dateTimePicker"
                timeZoneOffsetInMinutes={0}
                value={values.openDate}
                mode="date"
                is24Hour={true}
                display="default"
                selected={values.dateofLeaving}
                minimumDate={DOJ}
                onBlur={(date, event) => console.log('dateee', date, event)}
                onChange={val => {
                  values.dateofLeaving = new Date(val.nativeEvent.timestamp)
                    .toISOString()
                    .slice(0, 10)
                  setShowTo(false)
                  setDOJ(new Date(val.nativeEvent.timestamp))

                }}
              />
            )} */}
            {showTo && (
              <DateTimePicker
                testID="dateTimePicker"
                timeZoneOffsetInMinutes={0}
                value={values.openDate}
                mode="date"
                is24Hour={true}
                display="default"
                selected={values.dateofLeaving}
                minimumDate={new Date(values.dateofJoining)}
                onBlur={(date, event) => console.log('dateee', date, event)}
                onChange={val => {
                  values.dateofLeaving = new Date(val.nativeEvent.timestamp)
                    .toISOString()
                    .slice(0, 10)
                  setShowTo(false)
                  setDOL(new Date(val.nativeEvent.timestamp))
                }}
              />
            )}
            {/* <View style={floatingLabelContainer}>
                <FloatingLabelInput
                  containerStyles={floatingLabelContainerInternal}
                  label={'Mobile'}
                  paddingHorizontal={10}
                  paddingTop={5}
                  keyboardType="numeric"
                  value={values.employeeMobile}
                  onChangeText={handleChange('employeeMobile')}
                  maxLength={10}
                />
                {errors.employeeMobile && touched.employeeMobile && (
                  <Text style={errorMessage}>{errors.employeeMobile}</Text>
                )}
              </View> */}

            <View style={floatingLabelContainer}>
              <TextInput
                style={floatingLabelContainerInternal}
                onChangeText={handleChange('dateofJoining')}
                value={values.dateofJoining}
                placeholderTextColor={placeholderTextColor}
                placeholder="Date of Joining"
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
              {errors.dateofJoining && touched.dateofJoining && (
                <Text style={errorMessage}>{errors.dateofJoining}</Text>
              )}
            </View>

            <View style={floatingLabelContainer}>
              <TextInput
                style={floatingLabelContainerInternal}
                onChangeText={handleChange('dateofLeaving')}
                value={values.dateofLeaving}
                placeholderTextColor={placeholderTextColor}
                placeholder="Date of Leaving"
              />
              <TouchableOpacity onPress={() => setShowTo(!showTo)}>
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
              {errors.dateofLeaving && touched.dateofLeaving && (
                <Text style={errorMessage}>{errors.dateofLeaving}</Text>
              )}
            </View>

            <View style={floatingLabelContainer}>
              <TextInput
                style={floatingLabelContainerInternal}
                onChangeText={handleChange('addressLIne1')}
                value={values.addressLIne1}
                placeholderTextColor={placeholderTextColor}
                placeholder="Address"
              />
              {errors.addressLIne1 && touched.addressLIne1 && (
                <Text style={errorMessage}>{errors.addressLIne1}</Text>
              )}
            </View>
            <View style={floatingLabelContainer}>
              <TextInput
                style={floatingLabelContainerInternal}
                onChangeText={handleChange('city')}
                value={values.city}
                placeholderTextColor={placeholderTextColor}
                placeholder="City"
              />
              {errors.city && touched.city && (
                <Text style={errorMessage}>{errors.city}</Text>
              )}
            </View>
            <View style={floatingLabelContainer}>
              <TextInput
                style={floatingLabelContainerInternal}
                onChangeText={handleChange('state')}
                value={values.state}
                placeholderTextColor={placeholderTextColor}
                placeholder="State"
              />
              {errors.state && touched.state && (
                <Text style={errorMessage}>{errors.state}</Text>
              )}
            </View>

            <View style={floatingLabelContainer}>
              <TextInput
                style={floatingLabelContainerInternal}
                onChangeText={handleChange('zipcode')}
                value={values.zipcode}
                keyboardType="numeric"
                maxLength={6}
                placeholderTextColor={placeholderTextColor}
                placeholder="Pin code"
              />
              {errors.zipcode && touched.zipcode && (
                <Text style={errorMessage}>{errors.zipcode}</Text>
              )}
            </View>

            <View style={floatingLabelContainer}>
              <TextInput
                style={floatingLabelContainerInternal}
                onChangeText={handleChange('employeeServiceCommission')}
                value={values.employeeServiceCommission}
                keyboardType="numeric"
                maxLength={6}
                placeholderTextColor={placeholderTextColor}
                placeholder="Service Commission"
              />
              {errors.employeeServiceCommission &&
                touched.employeeServiceCommission && (
                  <Text style={errorMessage}>
                    {errors.employeeServiceCommission}
                  </Text>
                )}
            </View>

            <View style={floatingLabelContainer}>
              <TextInput
                style={floatingLabelContainerInternal}
                onChangeText={handleChange('employeeProductCommission')}
                value={values.employeeProductCommission}
                keyboardType="numeric"
                placeholderTextColor={placeholderTextColor}
                placeholder="Product Commission"
              />
              {errors.employeeProductCommission &&
                touched.employeeProductCommission && (
                  <Text style={errorMessage}>
                    {errors.employeeProductCommission}
                  </Text>
                )}
            </View>

            <View style={floatingLabelContainer}>
              <TextInput
                style={floatingLabelContainerInternal}
                onChangeText={handleChange('employeeSalary')}
                value={values.employeeSalary}
                keyboardType="numeric"
                placeholderTextColor={placeholderTextColor}
                placeholder="Salary"
              />
              {errors.employeeSalary && touched.employeeSalary && (
                <Text style={errorMessage}>{errors.employeeSalary}</Text>
              )}
            </View>
            <View style={floatingLabelContainer}>
              <TextInput
                style={floatingLabelContainerInternal}
                onChangeText={handleChange('employeeVariableSalary')}
                value={values.employeeVariableSalary}
                keyboardType="numeric"
                placeholderTextColor={placeholderTextColor}
                placeholder="Variable Salary"
              />
              {errors.employeeVariableSalary &&
                touched.employeeVariableSalary && (
                  <Text style={errorMessage}>
                    {errors.employeeVariableSalary}
                  </Text>
                )}
            </View>
            <View style={floatingLabelContainer}>
              <TextInput
                style={floatingLabelContainerInternal}
                onChangeText={handleChange('yearlyAllowableLeave')}
                value={values.yearlyAllowableLeave}
                keyboardType="numeric"
                placeholderTextColor={placeholderTextColor}
                placeholder="Yearly Allowable Leave"
              />
              {errors.yearlyAllowableLeave && touched.yearlyAllowableLeave && (
                <Text style={errorMessage}>{errors.yearlyAllowableLeave}</Text>
              )}
            </View>
            <View style={floatingLabelContainer}>
              <TextInput
                style={floatingLabelContainerInternal}
                onChangeText={handleChange('availableLeaveBalance')}
                value={values.availableLeaveBalance}
                keyboardType="numeric"
                placeholderTextColor={placeholderTextColor}
                placeholder="Leave Balance"
              />
              {errors.availableLeaveBalance &&
                touched.availableLeaveBalance && (
                  <Text style={errorMessage}>
                    {errors.availableLeaveBalance}
                  </Text>
                )}
            </View>

            <SaveAndCancelButton
              handleSubmit={handleSubmit}
              saveTitle={editEmployee ? 'Update' : 'Add'}
              navigation={navigation}
              screenName="Employee List"
            />
          </View>
        )}
      </Formik>
    </CardWrapper>
  )
}

export default AddEmployee
