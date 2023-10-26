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
  Dimensions,
  Image,
} from 'react-native'
import React, { useEffect, useState, useLayoutEffect } from 'react'
import { openDatabase } from 'react-native-sqlite-storage'
import { Formik } from 'formik'
import { Picker } from '@react-native-picker/picker'
import DeviceInfo from 'react-native-device-info'
import { useDispatch, useSelector } from 'react-redux'
import { store } from '../../../../Store'
import { FloatingLabelInput } from 'react-native-floating-label-input'
import { BackHandler } from 'react-native'
import * as Yup from 'yup'
import { updateSyncLength } from '../../../../Store/SyncLengthStore'
import Icon from 'react-native-vector-icons/Ionicons'
import DateTimePicker from '@react-native-community/datetimepicker'
import DatePicker from 'react-native-date-picker'
import MultiSelects from '../Deals/MultiSelect'
import SelectList from 'react-native-dropdown-select-list'
import RBSheet from 'react-native-raw-bottom-sheet'
import { useRef } from 'react'
import MultiSelect from '../Deals/MultiSelect'
import { useIsFocused } from '@react-navigation/native'
import NetInfo from '@react-native-community/netinfo'
import { updateSyncStore } from '../../../../Store/SyncStore'
import { BG_IMG } from '../../../../Containers/CustomComponents/Image'
import {
  cancelButton,
  cancelText,
  cardContainer,
  errorMessage,
  floatingLabelContainer,
  floatingLabelContainerInternal,
  multiSelectOptions,
  pickerInputContainer,
  placeholderTextColor,
  pickerItem,
  saveAndCancel,
  saveButton,
  saveText,
  pickerItem2,
} from '../../../../Containers/CustomComponents/Style'
import SaveAndCancelButton from '../../../../Containers/CustomComponents/SaveAndCancelButton'
import CardWrapper from '../../../../Containers/CustomComponents/CardWrapper'
import { getUsers } from '@/Containers/CustomComponents/UsernameTable'
import generateUUID from '@/Containers/CustomComponents/GetUUID'
import { gettingAccountData } from '@/Containers/CustomComponents/GetTable'

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const db = openDatabase({
  name: 'customer_database',
})

const AddAllContact = ({ navigation, route }) => {
  const [mobileId, setMobileId] = useState()
  const [deviceId, setDeviceId] = useState()
  const [date, setDate] = useState(Date.now().toString())
  const [selectedAccountId, setSelectedAccountId] = useState('')
  const [selectedMobileAccountId, setSelectedMobileAccountId] = useState('')
  const [companyId, setCompanyId] = useState(route?.params?.contactData[0]?.companyId||store.getState().auth.companyId||'')
  const [companyValue, setCompanyValue] = useState()
  const [accountData, setaccountData] = useState([])
  const [accountsData, setAccountsData] = useState([])
  const editContact = route?.params?.contactData[0]
  let loginToken = store.getState().auth.token
  const profile = store.getState().auth.profile.name
  const [selectowner, setSelectowner] = useState('')
  const owner = getUsers()
  const isFocused = useIsFocused()
  const [companyN, setCompanyN] = useState([])

  const isOnline = store.getState().online.isOnline
  const generateMobileContactId = generateUUID()
  console.log('add all contact route', route)
  useEffect(() => {
    getCompanyDropdown()
  }, [isFocused])
  const [companyData, setCompanyData] = useState([])
 

  const validationSchema = Yup.object().shape({
    contactName: Yup.string().required('Full Name is required'),
    phoneNo: Yup.string()
      .required(' Mobile number is required')
      .matches(phoneRegExp, 'Mobile number is not valid')
      .min(10, 'Too short, mobile number must be 10 digit')
      .max(10, 'Too long, mobile number must be 10 digit'),
    // contactOwner: Yup.string().required('Owner Name is required'),
    jobTitle: Yup.string().required('JobTitle is required'),
    // contactStage: Yup.string().required('Life Cycle Stage is required'),
    email: Yup.string()
      .email('Must be a valid Email')
      .max(255)
      .required('Email is required'),

    // accountName: selectedMobileAccountId
    //   ? Yup.string().test('isRequired', 'Account name is required', () => {
    //     if (selectedAccountId || selectedMobileAccountId != '') return true
    //     return false
    //   })
    //   : Yup.string()
    //     .matches(/\S/, 'Name without spaces')
    //     .required('Account name is required')
    //     .label('Account Name'),
    // accountName: Yup.string().required('Account Name is required'),
    // accountName: accountName
    //   ? Yup.string().test('isRequired', 'Required', () => {
    //     if (accountType != '') return true
    //     return false
    //   })
    //   : Yup.string()
    //     .matches(/^\S*$/, 'Name without spaces')
    //     .required('Required'),
  })

  const accountEdit = {
    id: route?.params?.accountData[0]?.accountId,
    item: route?.params?.accountData[0]?.accountName,
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: route?.params?.contactData[0] ? 'Edit Contact' : 'Add Contact',
    })
  }, [route?.params?.contactData[0]])

  const getAccount = values => {
    console.log('values of account', values)
    setSelectedAccountId(values?.id)
    setSelectedMobileAccountId(values?.mobileAccountId)
    // setCompanyId(values?.companyId)
  }

  const getDataOfAccount = async () => {
    const { data } = await gettingAccountData()
    setaccountData(data)
  }

  const getTheAccountsData = () => {
    db.transaction(txn => {
      !store.getState().auth.companyId ?
        txn.executeSql(
          'SELECT * from account where companyId=?  and companyId not in ("")',
          [companyId],
          (tx, res) => {
            console.log('aayaaaa')
            let len = res.rows.length
            if (len > 0) {
              let results = []
              for (let i = 0; i < len; i++) {
                let item = res.rows.item(i)
                results.push({
                  id: item?.accountId,
                  item: item?.accountName,
                  mobileAccountId: item?.mobileAccountId,
                })
              }
              setAccountsData(results)
            }
          },
          error => {
            console.log('error while GETTING', error.message)
          },
        )
        :
        txn.executeSql(
          'SELECT * from account where companyId=? and companyId not in ("")',
          [store.getState().auth.companyId],
          (tx, res) => {
            console.log('aayaaaa')
            let len = res.rows.length
            if (len > 0) {
              let results = []
              for (let i = 0; i < len; i++) {
                let item = res.rows.item(i)
                results.push({
                  id: item?.accountId,
                  item: item?.accountName,
                  mobileAccountId: item?.mobileAccountId,
                })
              }
              setAccountsData(results)
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
        [route?.params?.contactData[0]?.companyId],
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
  console.log('iiuuuuuuuuuuuuiiiiiiiiii', companyN)
  useEffect(() => {
    getDataOfAccount(), getUsers()
  }, [])
  useEffect(() => {
    getTheAccountsData()
  }, [companyId])
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
    getCompanyName()
  }, [route?.params?.contactData[0]],isFocused)

  const companyEdit = {
    id: route?.params?.contactData[0]?.companyId,
    item: companyN[0]?.item,
  }

  const handleSubmit = values => {
    console.log('inside add contact', [
      {
        mobileContactId: editContact?.mobileContactId || generateMobileContactId,
        contactId: editContact?.contactId || '',
        status: values.status || '',
        contactName: values.contactName || '',
        source: values.source || '',
        contactUnworked: values.contactUnworked || '',
        createdDate: date || '',
        updatedDate: values.updatedDate || '',
        sessions: values.sessions || '',
        phoneNo: values.phoneNo || '',
        contactOwner: values.contactOwner || '',
        eventRevenue: values.eventRevenue || '',
        lastActivityDate: null,
        ownerAssignedDate: null,
        becameOpportunityDate: null,
        createdBy: profile || '',
        contactStage: values.contactStage || '',
        timeFirstSeen: values.timeFirstSeen || '',
        jobTitle: values.jobTitle || '',
        emailDomain: values.emailDomain || '',
        email: values.email || '',
        associatedCompanyId: values.associatedCompanyId || '',
        associatedCompany: values.associatedCompany || '',
        hierarchyId: values.hierarchyId || '',
        accountId:
          selectedAccountId || route?.params?.accountData[0]?.accountId || "",
        companyId: companyId || route?.params?.contactData[0]?.companyId || store.getState().auth.companyId || "",
      },
    ])
    console.log('offilne insert state', isOnline)
    isOnline
      ? fetch(
        `https://apps.trisysit.com/posbackendapi/api/syncContact/saveOrUpdate/1`,
        // ${cacheState}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer' + loginToken,
          },
          body: JSON.stringify([
            {
              mobileContactId: editContact?.mobileContactId || generateUUID(),
              contactId: editContact?.contactId || '',
              status: values.status || '',
              contactName: values.contactName || '',
              source: values.source || '',
              contactUnworked: values.contactUnworked || '',
              createdDate: date || '',
              updatedDate: values.updatedDate || '',
              sessions: values.sessions || '',
              phoneNo: values.phoneNo || '',
              contactOwner: values.contactOwner || '',
              eventRevenue: values.eventRevenue || '',
              lastActivityDate: null,
              ownerAssignedDate: null,
              becameOpportunityDate: null,
              createdBy: profile || '',
              contactStage: values.contactStage || '',
              timeFirstSeen: values.timeFirstSeen || '',
              jobTitle: values.jobTitle || '',
              emailDomain: values.emailDomain || '',
              email: values.email || '',
              associatedCompanyId: values.associatedCompanyId || '',
              associatedCompany: values.associatedCompany || '',
              hierarchyId: values.hierarchyId || '',
              accountId:
                selectedAccountId || route?.params?.accountData[0]?.accountId || "",
              companyId: companyId || route?.params?.contactData[0]?.companyId || store.getState().auth.companyId || "",
            }
          ]),
        },
      )
        .then(response => response.json())
        .then(result => {
          console.log('add contact backend result', result)
          result.data?.forEach(i => {
            db.transaction(txn => {
              txn.executeSql(
                'INSERT OR REPLACE INTO contacts (mobileContactId,contactId,status,contactName,source,contactUnworked,createdDate,updatedDate,sessions,phoneNo,contactOwner,eventRevenue,lastActivityDate,ownerAssignedDate,becameOpportunityDate,createdBy,contactStage,timeFirstSeen,jobTitle,emailDomain,email,associatedCompanyId,associatedCompany,hierarchyId,accountId,mobileAccountId,companyId,isOnline) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                [
                  i?.mobileContactId,
                  i?.contactId,
                  i?.status,
                  i?.contactName,
                  i?.source,
                  i?.contactUnworked,
                  i?.createdDate,
                  i?.updatedDate,
                  i?.sessions,
                  i?.phoneNo,
                  i?.contactOwner,
                  i?.eventRevenue,
                  i?.lastActivityDate,
                  i?.ownerAssignedDate,
                  i?.becameOpportunityDate,
                  i?.createdBy,
                  i?.contactStage,
                  i?.timeFirstSeen,
                  i?.jobTitle,
                  i?.emailDomain,
                  i?.email,
                  i?.associatedCompanyId,
                  i?.associatedCompany,
                  i?.hierarchyId,
                  i?.accountId,
                  i?.mobileAccountId,
                  i?.companyId,
                  true,
                ],
                (txn, results) => {
                  console.log('Results', results)
                  if (results.rowsAffected > 0) {
                    Alert.alert(
                      'Success',
                      `Contact ${editContact ? 'updated' : 'added'
                      } successfully`,
                      [
                        {
                          text: 'Ok',
                          onPress: () => navigation.navigate('AllContact'),
                          // onPress: () => navigation.navigate('All Contact Detail', { contactId: i?.contactId, mobileContactId: i?.mobileContactId })
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
        .catch(error => console.log('errorrr', error))
      : db.transaction(txn => {
        console.log('offilne insert')
        txn.executeSql(
          'INSERT OR REPLACE INTO contacts (mobileContactId,contactId,status,contactName,source,contactUnworked,createdDate,updatedDate,sessions,phoneNo,contactOwner,eventRevenue,lastActivityDate,ownerAssignedDate,becameOpportunityDate,createdBy,contactStage,timeFirstSeen,jobTitle,emailDomain,email,associatedCompanyId,associatedCompany,hierarchyId,accountId,mobileAccountId,companyId,isOnline) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
          [
            editContact?.mobileContactId || generateMobileContactId,
            editContact?.contactId || '',
            values?.status || '',
            values?.contactName || '',
            '',
            '',
            date,
            date,
            '',
            values?.phoneNo || '',
            values?.contactOwner || '',
            '',
            null,
            null,
            null,
            profile,
            '',
            '',
            values?.jobTitle || '',
            '',
            values?.email || '',
            '',
            '',
            '',
            selectedAccountId || route?.params?.accountData[0]?.accountId,
            selectedMobileAccountId ||
            route?.params?.accountData[0]?.mobileAccountId,
            companyId || route?.params?.contactData[0]?.companyId,
            false,
          ],
          (txn, results) => {
            console.log('Results', results)
            if (results.rowsAffected > 0) {
              Alert.alert(
                'Success',
                `Contact ${editContact ? 'updated' : 'added'}  offline`,
                [
                  {
                    text: 'Ok',
                    onPress: () => navigation.navigate('AllContact'),
                    // onPress: () => navigation.navigate('All Contact Detail', { mobileContactId: route?.params?.contactData[0]?.mobileContactId||generateMobileContactId })
                  },
                ],
                { cancelable: false },
              )
            } else alert('Updation Failed')
          },
          (txn, error) => {
            console.log('Error', error)
            alert('Error while inserting data')
          },
        )
      })
  }
  const getCo = values => {
    console.log('valuessss', values)
    setCompanyValue(values.item)
    setCompanyId(values.id)
  }

  return (
    <CardWrapper>
      {console.log(
        'owneerrrrrrrrr',
        route?.params?.route?.params?.contactOwner,
      )}
      <Formik
        initialValues={{
          contactName: editContact?.contactName || '',
          // accountName: route?.params?.accountData[0]?.accountName || '',
          companyName: editContact?.companyName || '',
          email: editContact?.email || '',
          contactOwner: editContact?.contactOwner || '',
          jobTitle: editContact?.jobTitle || '',
          phoneNo: editContact?.phoneNo || '',
          contactStage: editContact?.contactStage || '',
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
                label={'Full Name'}
                onChangeText={handleChange('contactName')}
                value={values.contactName}
                placeholderTextColor={placeholderTextColor}
                placeholder="Full Name"
              />
              {errors.contactName && touched.contactName && (
                <Text style={errorMessage}>{errors.contactName}</Text>
              )}
            </View>
            <View style={floatingLabelContainer}>
              <TextInput
                style={floatingLabelContainerInternal}
                onChangeText={handleChange('email')}
                value={values.email}
                placeholderTextColor={placeholderTextColor}
                placeholder="Email"
              />
              {errors.email && touched.email && (
                <Text style={errorMessage}>{errors.email}</Text>
              )}
            </View>

            <View style={floatingLabelContainer}>
              <TextInput
                style={floatingLabelContainerInternal}
                onChangeText={handleChange('phoneNo')}
                value={values.phoneNo}
                maxLength={10}
                keyboardType="numeric"
                placeholderTextColor={placeholderTextColor}
                placeholder="Mobile No"
              />
              {errors.phoneNo && touched.phoneNo && (
                <Text style={errorMessage}>{errors.phoneNo}</Text>
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
            <View style={[multiSelectOptions]}>
              <MultiSelect
                onSelect={getAccount}
                single
                label={'Associate Account'}
                K_OPTIONS={accountsData}
                selects={accountEdit}
              />
              {errors.accountName && touched.accountName && (
                <Text style={errorMessage}>{errors.accountName}</Text>
              )}
            </View>

            <View style={pickerInputContainer}>
              <Picker
                style={{
                  bottom: 3.5,
                  display: 'flex',
                }}
                selectedValue={values?.contactOwner}
                // selectedValue={selectowner}
                // onValueChange={(name, index) => setSelectowner(name)}
                onValueChange={handleChange('contactOwner')}
              >
                <Picker.Item
                  label={'Select Owner'}
                  value=""
                  style={pickerItem}
                />
                {console.log('selecccct', selectowner)}
                {console.log(editContact?.selectowner, 'nameeeeeeeeeeee')}

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
            {/* <View style={pickerInputContainer}>
              <Picker style={{
                bottom: 3.5,
                display: 'flex',
              }}
                selectedValue={values.contactOwner}
                onValueChange={handleChange('contactOwner')}
                dropdownIconColor="grey"
              >
                <Picker.Item
                  label="Select Owner"
                  value=""
                  style={pickerItem}
                />
                <Picker.Item label="Karen" value="Karen" style={pickerItem2} />
                <Picker.Item label="Julio" value="Julio" style={pickerItem2} />
              </Picker>
              {errors.contactOwner && touched.contactOwner && (
                <Text style={errorMessage}>{errors.contactOwner}</Text>
              )}
            </View> */}

            <View style={floatingLabelContainer}>
              <TextInput
                style={floatingLabelContainerInternal}
                onChangeText={handleChange('jobTitle')}
                value={values.jobTitle}
                placeholderTextColor={placeholderTextColor}
                placeholder="Job Title"
              />
              {errors.jobTitle && touched.jobTitle && (
                <Text style={errorMessage}>{errors.jobTitle}</Text>
              )}
            </View>

            {/* <View style={styles.pickerInput}>
              <Picker
                style={{
                  color: '#43628e',
                  placeholder: 'Lifecycle Stage',
                  display: 'flex',
                }}
                selectedValue={values.contactStage}
                onValueChange={handleChange('contactStage')}
              >
                <Picker.Item
                  label="Select Lifecycle Stage"
                  value=""
                    style={pickerItem}
                />
                <Picker.Item
                  label="Subscriber"
                  value="Subscriber"
                    style={pickerItem}
                />
                <Picker.Item
                  label="Unsubscriber"
                  value="Unsubscriber"
                    style={pickerItem}
                />
              </Picker>
            </View>
            {errors.contactStage && touched.contactStage && (
              <Text style={errorMessage}>{errors.contactStage}</Text>
            )} */}
            <SaveAndCancelButton
              handleSubmit={handleSubmit}
              saveTitle={editContact ? 'Update' : 'Add'}
              navigation={navigation}
              screenName="AllContact"
            />
          </View>
        )}
      </Formik>
    </CardWrapper>
  )
}

export default AddAllContact
