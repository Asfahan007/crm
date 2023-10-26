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
} from 'react-native'
import React, { useEffect, useState } from 'react'
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
import CardWrapper from '../../../../Containers/CustomComponents/CardWrapper'

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('Full Name is required'),
  mobileNumber: Yup.string()
    .required(' Phone number is required')
    .matches(phoneRegExp, 'Phone number is not valid')
    .min(10, 'Too short, phone number must be 10 digit')
    .max(10, 'Too long, phone number must be 10 digit'),
  owner: Yup.string().required('Owner Name is required'),
  jobTitle: Yup.string().required('JobTitle is required'),
  lifecycleStage: Yup.string().required('Life Cycle Stage is required'),
  email: Yup.string()
    .email('Must be a valid user name')
    .max(255)
    .required('Email is required'),
})

const db = openDatabase({
  name: 'customer_database',
})
const screenWidth = Dimensions.get('window').width

const AddAllContact = ({ navigation, route, fetched }) => {
  const [showFrom, setShowFrom] = useState(false)
  const [mobileId, setMobileId] = useState()
  const [deviceId, setDeviceId] = useState()
  const [date, setDate] = useState(Date.now().toString())
  const [open, setOpen] = useState(false)
  const [products, setproducts] = useState()
  const [selected, setSelected] = useState('')
  const [accountName, setAccountName] = useState()
  const [accountData, setaccountData] = useState([])

  const refRBSheet = useRef()
  const isFocused = useIsFocused()
  const dispatch = useDispatch()

  let customerDataLength = store.getState().SyncLength.customerData
  let storeDataLength = store.getState().SyncLength.storeData
  let saleDataLength = store.getState().SyncLength.saleData
  let customerNotifictaion = store.getState().SyncLength.customertable
  let storeNotifictaion = store.getState().SyncLength.storetable
  let saleNotifictaion = store.getState().SyncLength.saletable
  let contactDataLength = store.getState().SyncLength.contactData
  let contactNotification = store.getState().SyncLength.contactTable

  const storeSync = useSelector(state => state.SyncLength.storetable)
  const customerSync = useSelector(state => state.SyncLength.customertable)
  const dealSync = useSelector(state => state.SyncLength.allDealTable)
  const accountSync = useSelector(state => state.SyncLength.accountTable)
  const contactSync = useSelector(state => state.SyncLength.contactTable)

  // console.log("length",customerDataLength,contactDataLength,contactNotification);
  const account = [
    { id: 1, item: 'Bridgestone' },
    { id: 2, item: 'MRF' },
  ]

  useEffect(() => {
    createContactTable()
  }, [])
  useEffect(() => {
    getDataOfAccount()
  }, [])

  useEffect(() => {
    DeviceInfo.getAndroidId().then(androidId => {
      setMobileId(androidId)
    })
    DeviceInfo.getDevice().then(device => {
      setDeviceId(device)
    })
  }, [])

  const createContactTable = () => {
    db.transaction(txn => {
      txn.executeSql(
        'CREATE TABLE IF NOT EXISTS contacts_info (id INTEGER PRIMARY KEY AUTOINCREMENT,contactId varchar(255),firstName varchar(255),lastName varchar(255),status varchar(255),source varchar(255),contactUnworked varchar(255),createdDate varchar(30),updatedDate datetime,sessions varchar(255),phoneNo varchar(255),contactOwner varchar(255),eventRevenue varchar(255),lastActivityDate varchar(255),ownerAssignedDate varchar(255),becameOpportunityDate varchar(255),createdBy varchar(255),contactStage varchar(255),timeFirstSeen varchar(255),jobTitle varchar(255),emailDomain varchar(255),email varchar(255),associatedCompanyId varchar(255),associatedCompany varchar(255),hierarchyId varchar(255),accountIdRef varchar(255),mobileDeviceId VARCHAR(20),mobileId VARCHAR(20))',
        [],
        () => {
          console.log('TABLE CREATED SUCCESSFULLY')
        },
        error => {
          console.log('error while creating' + error.message)
        },
      )
    })
  }

  const getAccount = values => {
    console.log('values', values.id)
    setAccountName(values.id)
  }

  const getDataOfAccount = async () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM account_info ORDER BY id DESC',
        [],
        (tx, results) => {
          //ORDER BY id DESC
          let temp = []
          for (let i = 0; i < results.rows.length; ++i) {
            let items = results.rows.item(i)
            // console.log(items);
            if (results.rows.item(i).accountName) {
              temp.push({
                accountCode: items.accountCode,
                accountDescription: items.accountDescription,
                id: items.accountId,
                item: items.accountName,
                accountStatus: items.accountStatus,
                accountType: items.accountType,
                addressLine1: items.addressLine1,
                addressLine2: items.addressLine2,
                brandName: items.brandName,
                category: items.category,
                city: items.city,
                companyType: items.companyType,
                country: items.country,
                email: items.email,
              })
            }
          }
          setaccountData(temp)
        },
      )
    })
  }
  // console.log('account data', fetched(true))



  const addContactValues = values => {
    console.log('insile add contact', values)
    console.log('account', accountName)
    values && accountName && db.transaction(txn => {
      txn.executeSql(
        'INSERT INTO contacts_info (firstName,lastName,email,contactOwner,jobTitle,phoneNo,contactStage,createdDate,mobileDeviceId,mobileId,accountIdRef,contactId) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
        [
          values.firstName,
          values.lastName,
          values.email,
          values.owner,
          values.jobTitle,
          values.mobileNumber,
          values.lifecycleStage,
          date,
          mobileId,
          deviceId,
          accountName,
          ""
        ],
        (txn, results) => {
          if (results.rowsAffected > 0) {
            console.log("dispatching");
            dispatch(
              updateSyncLength({
                contactTable: 1,
                contactData: 1,
                customertable: customerNotifictaion,
                customerData: customerDataLength,
                storetable: storeNotifictaion,
                saletable: saleNotifictaion,
                storeData: storeDataLength,
                saleData: saleDataLength,
              }),
            )
            Alert.alert(
              'Success',
              'Contact added successfully',
            )
          } else
            Alert.alert(
              'Error',
              'Failed to Add data',
            )
        },
        error => {
          console.log('error while INSERTING ' + error.message)
        },
      )
    })
  }
  const handleSubmit = (values) => {
    return (
      addContactValues(values),
      refRBSheet.current.close(),
      // navigation.navigate("AllContact"),
      fetched(true)
    )
  }

  return (
    <CardWrapper>
      <ScrollView nestedScrollEnabled={true}>
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            owner: '',
            jobTitle: '',
            mobileNumber: '',
            lifecycleStage: '',
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
            <View style={styles.card}>
              <View style={styles.input}>
                <FloatingLabelInput
                  placeholder="First Name"
                  label={'Full Name '}
                  placeholderTextColor="red"
                  paddingHorizontal={10}
                  paddingTop={5}
                  value={values.firstName}
                  onChangeText={handleChange('firstName')}
                  containerStyles={[styles.dropdown]}
                />
              </View>

              {errors.firstName && touched.firstName && (
                <Text style={styles.error}>{errors.firstName}</Text>
              )}
              <View
                style={{
                  marginTop: 25,
                  width: 300,
                  marginLeft: 12,
                  borderColor: 'grey',
                  borderRadius: 4,
                }}
              >
                <MultiSelect
                  onSelect={getAccount}
                  single
                  label="Select Accounts"
                  K_OPTIONS={accountData}
                />
              </View>
              {(accountName ? null :
                <Text style={styles.error}>Must choose Acccount</Text>
              )}
              <View style={styles.input}>
                <FloatingLabelInput
                  containerStyles={styles.dropdown}
                  placeholder="Email"
                  label={'Email'}
                  placeholderTextColor="grey"
                  paddingHorizontal={10}
                  paddingTop={5}
                  value={values.email}
                  onChangeText={handleChange('email')}
                />
              </View>
              {errors.email && touched.email && (
                <Text style={styles.error}>{errors.email}</Text>
              )}
              {/* <View style={{marginTop:25,width:300,marginLeft:12,borderColor:"grey",borderRadius:4}}>
              
            <SelectList placeholder='Select Owner'searchPlaceholder="Search Owner" setSelected={setSelected} data={data} onSelect={() => console.log("ss",selected)} boxStyles={{backgroundColor:'#f1f5f7'}}/>
            </View> */}
              <View style={styles.pickerInput}>
                <Picker
                  style={{
                    color: '#43628e',
                    // placeholder: 'Status',
                    // display: 'flex',
                    // padding:3,
                    // backgroundColor:'red'
                    // borderWidth:10
                    // borderColor:'red'
                  }}
                  selectedValue={values.owner}
                  onValueChange={handleChange('owner')}
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
              </View>

              {errors.owner && touched.owner && (
                <Text style={styles.error}>{errors.owner}</Text>
              )}

              <View style={styles.input}>
                <FloatingLabelInput
                  containerStyles={styles.dropdown}
                  placeholder="Job Title"
                  label={'Job Title'}
                  placeholderTextColor="grey"
                  paddingHorizontal={10}
                  paddingTop={5}
                  value={values.jobTitle}
                  onChangeText={handleChange('jobTitle')}
                />
              </View>
              {errors.jobTitle && touched.jobTitle && (
                <Text style={styles.error}>{errors.jobTitle}</Text>
              )}
              <View style={styles.input}>
                <FloatingLabelInput
                  containerStyles={styles.dropdown}
                  placeholder="Mobile No"
                  label={'Mobile No'}
                  placeholderTextColor="grey"
                  paddingHorizontal={10}
                  paddingTop={5}
                  value={values.mobileNumber}
                  onChangeText={handleChange('mobileNumber')}
                />
              </View>
              {errors.mobileNumber && touched.mobileNumber && (
                <Text style={styles.error}>{errors.mobileNumber}</Text>
              )}
              <View style={styles.pickerInput}>
                <Picker
                  style={{
                    color: '#43628e',
                    placeholder: 'Lifecycle Stage',
                    display: 'flex',
                  }}
                  selectedValue={values.lifecycleStage}
                  onValueChange={handleChange('lifecycleStage')}
                >
                  <Picker.Item
                    label="Select Lifecycle Stage"
                    value=""
                    style={{ fontSize: 14 }}
                  />
                  <Picker.Item
                    label="Subscriber"
                    value="Subscriber"
                    style={{ fontSize: 14 }}
                  />
                  <Picker.Item
                    label="Unsubscriber"
                    value="Unsubscriber"
                    style={{ fontSize: 14 }}
                  />
                </Picker>
              </View>
              {errors.lifecycleStage && touched.lifecycleStage && (
                <Text style={styles.error}>{errors.lifecycleStage}</Text>
              )}

              <View style={styles.submit}>
                <TouchableOpacity
                  style={styles.buttonCancel}
                  onPress={handleSubmit}
                >
                  <Text style={styles.textCancel}>Create</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.cancel}>
                <TouchableOpacity
                  style={styles.buttonSave}
                  onPress={() => refRBSheet.current.close()}
                >
                  <Text style={styles.textSave}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </CardWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  card: {
    margin: 15,
    color: '#000',
    paddingHorizontal: 10,
    backgroundColor: 'white',
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    borderRadius: 4,
  },
  pickerInput: {
    height: 45,
    width: 300,
    marginTop: 25,
    backgroundColor: '#f1f5f7',
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    paddingLeft: 10,
    borderColor: 'gray',
    color: '#000000',
    marginLeft: 12,
    marginRight: 5,
    // marginHorizontal: 25
  },

  input: {
    height: 45,
    width: 300,
    marginTop: 25,
    backgroundColor: '#fff',
    borderRadius: 2,
    fontSize: 16,
    color: '#000000',
    paddingTop: 0.5,
    marginLeft: 12,
    marginRight: 5,
    fontWeight: 200,
  },
  dropdown: {
    height: 45,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    // paddingHorizontal: 15,
    paddingLeft: 15,
    color: '#000',
    backgroundColor: '#f1f5f7',
    // marginTop: 10
    //   width:320,
  },
  error: {
    color: 'red',
    marginLeft: 25,
    marginTop: 5,
    marginBottom: -15,
  },

  main: {
    alignItems: 'center',
    marginTop: 30,
    marginLeft: '0.4%',
  },
  submit: {
    width: 100,
    marginTop: 35,
    marginLeft: 60,
  },
  buttonCancel: {
    width: 100,
    alignItems: 'center',
    alignSelf: 'center',
    display: 'flex',
    //   backgroundColor: '#f1f5f7',
    backgroundColor: '#00b8ce',

    borderRadius: 4,
    height: 40,
    marginRight: 12,
    marginTop: -4,
    marginBottom: 20,
  },
  textCancel: {
    color: '#fff',
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  cancel: {
    width: 100,
    marginTop: -60,
    marginLeft: 185,
  },
  buttonSave: {
    alignItems: 'center',
    backgroundColor: '#f1f5f7',

    borderRadius: 4,
    height: 40,
    marginBottom: 20,
  },
  textSave: {
    color: 'black',
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
})

export default AddAllContact
