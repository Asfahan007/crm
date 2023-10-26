import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import { FloatingLabelInput } from 'react-native-floating-label-input'
import { Picker } from '@react-native-picker/picker'
import { openDatabase } from 'react-native-sqlite-storage'
import { useEffect, useLayoutEffect } from 'react'
import * as Yup from 'yup'
import { Dimensions } from 'react-native'
import { useRef } from 'react'
// import Alert from 'react-native'

// import { ScrollView } from 'react-native-gesture-handler'
import RBSheet from 'react-native-raw-bottom-sheet'
import { useState } from 'react'
import DeviceInfo from 'react-native-device-info'
import { useDispatch, useSelector } from 'react-redux'
import Auth, { signOut } from '../../../../Store/Auth'
import { store } from '../../../../Store'
import SelectList from 'react-native-dropdown-select-list'
import MultiSelect from '../Deals/MultiSelect'
import NetInfo from '@react-native-community/netinfo'
import { updateSyncLength } from '../../../../Store/SyncLengthStore'
import { updateSyncStore } from '../../../../Store/SyncStore'
import { cacheLength } from '../../../../Store/Cache'
import { BG_IMG } from '../../../../Containers/CustomComponents/Image'
import {
  cancelButton,
  cancelText,
  cardContainer,
  errorMessage,
  floatingLabelContainer,
  floatingLabelContainerInternal,
  pickerInputContainer,
  placeholderTextColor,
  pickerItem,
  pickerItem2,
  saveAndCancel,
  saveButton,
  saveText,
} from '../../../../Containers/CustomComponents/Style'
import SaveAndCancelButton from '../../../../Containers/CustomComponents/SaveAndCancelButton'
import CardWrapper from '../../../../Containers/CustomComponents/CardWrapper'
import { now } from 'moment'
import { dropDatabaseAndTables } from '../../../../Containers/Database/DropTable'

const db = openDatabase({
  name: 'customer_database',
})

const AddCompany = ({ navigation, route }) => {
  const editCompany = route?.params
  console.log(editCompany, 'hiiiiiiii')
  const dispatch = useDispatch()

  const [selectOwner, setSelectOwner] = useState('')
  const isOnline = store.getState().online.isOnline

  const validationSchema = Yup.object({
    companyName: Yup.string()
      .min(2, 'Too Short!')
      .max(30, 'Too Long!')
      .required('Company Name is Required'),

    companyDescription: Yup.string().required(
      'Company Description is Required',
    ),
    companyStatus: Yup.string().required('Status is Required'),
    // accountType: Yup.string().required('Required'),
    email: Yup.string()
      .email('Must be a valid user name')
      .max(255)
      .required('Email is required'),

    website: Yup.string().required('Website is Required'),
    addressLine1: Yup.string().required('Required'),
    addressLine2: Yup.string().required('Address is Required'),
    pinCode: Yup.number().required('Pincode is Required'),
    city: Yup.string().required('City is Required'),
    state: Yup.string().required('State is Required'),
    country: Yup.string().required('Country is Required'),
  })
  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: editCompany ? 'Edit Company' : 'Add Company',
    })
  }, [])

  const logoutForToken = async () => {
    await new Promise(resolve =>
      setTimeout(() => resolve(dropDatabaseAndTables()), 0),
    )
    await new Promise(resolve =>
      setTimeout(() => resolve(dispatch(signOut({}))), 1000),
    )
  }

  const handleSubmit = values => {
    console.log('company payload', [
      {
        companyId: editCompany?.companyId || '',
        companyName: values?.companyName || '',
        companyDescription: values?.companyDescription || '',
        companyStatus: values?.companyStatus || '',
        companyType: 'Seller',
        companyCode: '',
        category: '',
        brandName: '',
        panNo: '',
        serviceTaxNumber: '',
        email: values?.email || '',
        website: values?.website || '',
        addressLine1: values?.addressLine1 || '',
        addressLine2: values?.addressLine2 || '',
        pinCode: values?.pinCode || '',
        city: values?.city || '',
        state: values?.state || '',
        country: values?.country || '',
        createdBy: store.getState().auth.profile.name,
        updatedBy: store.getState().auth.profile.name,
        createdDate: Date.now(),
        updatedDate: editCompany ? Date.now() : '',
        clientRelevantPersonVisited: 'yes',
        owner: 'admin_crm@trisysit.com',
      },
    ])
    isOnline
      ? fetch(
          `https://apps.trisysit.com/posbackendapi/api/syncCompany/saveOrUpdate/1`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer' + store.getState().auth.token,
            },
            body: JSON.stringify([
              {
                companyId: editCompany?.companyId || '',
                companyName: values?.companyName || '',
                companyDescription: values?.companyDescription || '',
                companyStatus: values?.companyStatus || '',
                companyType: 'Seller',
                companyCode: '',
                category: '',
                brandName: '',
                panNo: '',
                serviceTaxNumber: '',
                email: values?.email || '',
                website: values?.website || '',
                addressLine1: values?.addressLine1 || '',
                addressLine2: values?.addressLine2 || '',
                pinCode: values?.pinCode || '',
                city: values?.city || '',
                state: values?.state || '',
                country: values?.country || '',
                createdBy: store.getState().auth.profile.name,
                updatedBy: store.getState().auth.profile.name,
                createdDate: Date.now(),
                updatedDate: editCompany ? Date.now() : '',
                clientRelevantPersonVisited: 'yes',
                owner: 'admin_crm@trisysit.com',
              },
            ]),
          },
        )
          .then(response => response.json())
          .then(result => {
            console.log('result company', result)
            if (result.status == 403) {
              Alert.alert(
                'Error',
                'Token Expired!, Log in to continue',
                [
                  {
                    text: 'Ok',
                    onPress: () => logoutForToken(),
                  },
                ],
                { cancelable: false },
              )
            }
            result.data?.forEach(i => {
              db.transaction(tx => {
                editCompany
                  ? tx.executeSql(
                      'UPDATE company_info SET companyName=?,companyDescription=?,companyStatus=?,email=?,website=?,addressLine1=?,addressLine2=?,pinCode=?,city=?,state=?,country=?,isOnline=? where id=?',
                      [
                        i?.companyName,
                        i?.companyDescription,
                        i?.companyStatus,
                        i?.email,
                        i?.website,
                        i?.addressLine1,
                        i?.addressLine2,
                        i?.pinCode,
                        i?.city,
                        i?.state,
                        i?.country,
                        true,
                        editCompany?.id || '',
                      ],
                      (tx, results) => {
                        console.log('result update', results)
                        if (results.rowsAffected > 0) {
                          Alert.alert(
                            'Success',
                            'Company updated successfully',
                            [
                              {
                                text: 'Ok',
                                onPress: () =>
                                  navigation.navigate('Company', {
                                    id: editCompany.id,
                                  }),
                              },
                            ],
                            { cancelable: false },
                          )
                        }
                      },
                      error => {
                        console.log('error while updating ' + error.message)
                      },
                    )
                  : // db.transaction(function (tx) {
                    //   alert(selectOwner,'hi')
                    tx.executeSql(
                      'INSERT INTO company_info (companyId,companyName,companyDescription,companyStatus,email,website,addressLine1,addressLine2,pinCode,city,state,country,isOnline) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
                      [
                        i?.companyId || Date.now(),
                        i?.companyName,
                        i?.companyDescription,
                        i?.companyStatus,
                        i?.email,
                        i?.website,
                        i?.addressLine1,
                        i?.addressLine2,
                        i?.pinCode,
                        i?.city,
                        i?.state,
                        i?.country,
                        true,
                      ],
                      (tx, results) => {
                        console.log(results, 'add Company data incoming')
                        if (results.rowsAffected > 0) {
                          Alert.alert(
                            'Success',
                            'Company added successfully',
                            [
                              {
                                text: 'Ok',
                                onPress: () => navigation.navigate('Company'),
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
            })
          })
          .catch(error => console.log('errorrr', console.log(error)))
      : db.transaction(tx => {
          editCompany
            ? tx.executeSql(
                'UPDATE company_info SET companyName=?,companyDescription=?,companyStatus=?,email=?,website=?,addressLine1=?,addressLine2=?,pinCode=?,city=?,state=?,country=?,isOnline=? where id=?',
                [
                  values?.companyName,
                  values?.companyDescription,
                  values?.companyStatus,
                  values?.email,
                  values?.website,
                  values?.addressLine1,
                  values?.addressLine2,
                  values?.pinCode,
                  values?.city,
                  values?.state,
                  values?.country,
                  false,
                  editCompany?.id || '',
                ],
                (tx, results) => {
                  console.log('result update', results)
                  if (results.rowsAffected > 0) {
                    Alert.alert(
                      'Success',
                      'Company updated offline',
                      [
                        {
                          text: 'Ok',
                          onPress: () =>
                            navigation.navigate('Company', {
                              id: editCompany.id,
                            }),
                        },
                      ],
                      { cancelable: false },
                    )
                  }
                },
                error => {
                  console.log('error while updating ' + error.message)
                },
              )
            : // db.transaction(function (tx) {
              tx.executeSql(
                'INSERT INTO company_info (companyId,companyName,companyDescription,companyStatus,email,website,addressLine1,addressLine2,pinCode,city,state,country,isOnline) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
                [
                  Date.now(),
                  values?.companyName || '',
                  values?.companyDescription || '',
                  values?.companyStatus || '',
                  values?.email || '',
                  values?.website || '',
                  values?.addressLine1 || '',
                  values?.addressLine2 || '',
                  values?.pinCode || '',
                  values?.city || '',
                  values?.state || '',
                  values?.country || '',
                  false,
                ],
                (tx, results) => {
                  console.log(results, 'add Company data incoming')
                  if (results.rowsAffected > 0) {
                    Alert.alert(
                      'Success',
                      'Company added offline',
                      [
                        {
                          text: 'Ok',
                          onPress: () => navigation.navigate('Company'),
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

  console.log(selectOwner, 'Heeeeeeeeeeeee')

  return (
    <CardWrapper>
      {/* {console.log(route.params.params.owner,"owner")} */}
      <Formik
        initialValues={{
          companyName: editCompany?.companyName || '',
          companyDescription: editCompany?.companyDescription || '',
          companyStatus: editCompany?.companyStatus || '',
          email: editCompany?.email || '',
          website: editCompany?.website || '',
          addressLine1: editCompany?.addressLine1 || '',
          addressLine2: editCompany?.addressLine2 || '',
          pinCode: editCompany?.pinCode || '',
          city: editCompany?.city || '',
          state: editCompany?.state || '',
          country: editCompany?.country || '',
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
          // <React.Fragment>
          <View style={cardContainer}>
            <View style={floatingLabelContainer}>
              {/* <FloatingLabelInput
                  containerStyles={floatingLabelContainerInternal}
                  placeholder="Account Name"
                  // labelStyles={{ color: 'red' }}
                  label={'Account Name*'}
                  placeholderTextColor="grey"
                  paddingHorizontal={10}
                  paddingTop={5}
                  value={values.accountName}
                  onChangeText={handleChange('accountName')}
                /> */}
              <TextInput
                style={floatingLabelContainerInternal}
                onChangeText={handleChange('companyName')}
                value={values.companyName}
                placeholderTextColor={placeholderTextColor}
                placeholder="Company Name"
              />
              {errors.companyName && touched.companyName && (
                <Text style={errorMessage}>{errors.companyName}</Text>
              )}
            </View>

            <View style={floatingLabelContainer}>
              {/* <FloatingLabelInput
                  containerStyles={floatingLabelContainerInternal}
                  placeholder="Title"
                  label={'Account Description '}
                  placeholderTextColor="grey"
                  paddingHorizontal={10}
                  paddingTop={5}
                  value={values.accountDescription}
                  onChangeText={handleChange('accountDescription')}
                /> */}
              <TextInput
                style={floatingLabelContainerInternal}
                onChangeText={handleChange('companyDescription')}
                value={values.companyDescription}
                placeholderTextColor={placeholderTextColor}
                placeholder="Company Description"
              />
              {errors.companyDescription && touched.companyDescription && (
                <Text style={errorMessage}>{errors.companyDescription}</Text>
              )}
            </View>

            <View style={pickerInputContainer}>
              <Picker
                style={{
                  bottom: 3.5,
                  display: 'flex',
                }}
                selectedValue={values.companyStatus}
                onValueChange={handleChange('companyStatus')}
              >
                <Picker.Item label="Status" value="" style={pickerItem} />
                <Picker.Item
                  label="ACTIVE"
                  value="ACTIVE"
                  style={pickerItem2}
                />
                <Picker.Item
                  label="INACTIVE"
                  value="INACTIVE"
                  style={pickerItem2}
                />
              </Picker>
              {errors.companyStatus && touched.companyStatus && (
                <Text style={errorMessage}>{errors.companyStatus}</Text>
              )}
            </View>
            {/* <View style={{ width: 300, marginTop: 10 }}>
                        <MultiSelect
                          onSelect={getAccountType}
                          single
                          label="Account Type"
                          K_OPTIONS={data}
                        />
                      </View> */}

            <View style={floatingLabelContainer}>
              {/* <FloatingLabelInput
                  containerStyles={floatingLabelContainerInternal}
                  placeholder="Title"
                  label={'Email '}
                  placeholderTextColor="grey"
                  paddingHorizontal={10}
                  paddingTop={5}
                  value={values.email}
                  onChangeText={handleChange('email')}
                /> */}
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
              {/* <FloatingLabelInput
                  containerStyles={floatingLabelContainerInternal}
                  placeholder="Title"
                  label={'Website '}
                  placeholderTextColor="grey"
                  paddingHorizontal={10}
                  paddingTop={5}
                  value={values.website}
                  onChangeText={handleChange('website')}
                /> */}
              <TextInput
                style={floatingLabelContainerInternal}
                onChangeText={handleChange('website')}
                value={values.website}
                placeholderTextColor={placeholderTextColor}
                placeholder="Website"
              />
              {errors.website && touched.website && (
                <Text style={errorMessage}>{errors.website}</Text>
              )}
            </View>

            <View style={floatingLabelContainer}>
              {/* <FloatingLabelInput
                  containerStyles={floatingLabelContainerInternal}
                  placeholder="Title"
                  label={'Address Line1'}
                  placeholderTextColor="grey"
                  paddingHorizontal={10}
                  paddingTop={5}
                  value={values.addressLine1}
                  onChangeText={handleChange('addressLine1')}
                /> */}
              <TextInput
                style={floatingLabelContainerInternal}
                onChangeText={handleChange('addressLine1')}
                value={values.addressLine1}
                placeholderTextColor={placeholderTextColor}
                placeholder="Address Line1"
              />
              {errors.addressLine1 && touched.addressLine1 && (
                <Text style={errorMessage}>{errors.addressLine1}</Text>
              )}
            </View>

            <View style={floatingLabelContainer}>
              {/* <FloatingLabelInput
                  containerStyles={floatingLabelContainerInternal}
                  placeholder="Title"
                  label={'Address Line2'}
                  placeholderTextColor="grey"
                  paddingHorizontal={10}
                  paddingTop={5}
                  value={values.addressLine2}
                  onChangeText={handleChange('addressLine2')}
                /> */}
              <TextInput
                style={floatingLabelContainerInternal}
                onChangeText={handleChange('addressLine2')}
                value={values.addressLine2}
                placeholderTextColor={placeholderTextColor}
                placeholder="Address Line2"
              />
              {errors.addressLine2 && touched.addressLine2 && (
                <Text style={errorMessage}>{errors.addressLine2}</Text>
              )}
            </View>

            <View style={floatingLabelContainer}>
              {/* <FloatingLabelInput
                  containerStyles={floatingLabelContainerInternal}
                  keyboardType="numeric"
                  placeholder="Title"
                  label={'Pin Code'}
                  placeholderTextColor="grey"
                  paddingHorizontal={10}
                  paddingTop={5}
                  value={values.pinCode}
                  onChangeText={handleChange('pinCode')}
                /> */}
              <TextInput
                style={floatingLabelContainerInternal}
                onChangeText={handleChange('pinCode')}
                keyboardType="numeric"
                maxLength={6}
                value={values.pinCode}
                placeholderTextColor={placeholderTextColor}
                placeholder="Pin Code"
              />
              {errors.pinCode && touched.pinCode && (
                <Text style={errorMessage}>{errors.pinCode}</Text>
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
                onChangeText={handleChange('country')}
                value={values.country}
                placeholderTextColor={placeholderTextColor}
                placeholder="Country"
              />
              {errors.country && touched.country && (
                <Text style={errorMessage}>{errors.country}</Text>
              )}
            </View>

            {/* <View style={pickerInputContainer}>
              <Picker 
                selectedValue={selectOwner}

                onValueChange={(item)=>(

                  setSelectOwner(item)
                )}
                dropdownIconColor="grey"
                
              >
                <Picker.Item
                  label="Select Owner"
                  value=""
                  style={pickerItem}
                />
                {
                owner.map((item,index)=>(
                <Picker.Item label={item.item} value={item.username} style={pickerItem} />
              ))}
              </Picker>
              {errors.contactOwner && touched.contactOwner && (
                <Text style={errorMessage}>{errors.contactOwner}</Text>
              )}
            </View> */}

            <SaveAndCancelButton
              handleSubmit={handleSubmit}
              saveTitle={editCompany ? 'Update' : 'Add'}
              navigation={navigation}
              screenName="Company"
            />
          </View>
          // </React.Fragment>
        )}
      </Formik>
    </CardWrapper>
  )
}

export default AddCompany
