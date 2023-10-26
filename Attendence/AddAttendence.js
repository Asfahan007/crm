import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from 'react-native'
import React from 'react'
import { Dropdown } from 'react-native-element-dropdown'
import NetInfo from '@react-native-community/netinfo'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { useEffect } from 'react'
import { useLayoutEffect } from 'react'
import { openDatabase } from 'react-native-sqlite-storage'
import Icon from 'react-native-vector-icons/Ionicons'
import DateTimePicker from '@react-native-community/datetimepicker'
import * as Yup from 'yup'
import { Formik } from 'formik'
import RBSheet from 'react-native-raw-bottom-sheet'
import { store } from '../../Store'

import { useRef } from 'react'
import { BG_IMG } from '../CustomComponents/Image'
import {
  cardContainer,
  errorMessage,
  floatingLabelContainer,
  floatingLabelContainerInternal,
  placeholderTextColor,
  multiSelectOptions,
} from '../CustomComponents/Style'
import MultiSelect from '../Deal/Deals/Deals/MultiSelect'
import { FloatingLabelInput } from 'react-native-floating-label-input'
import SaveAndCancelButton from '../CustomComponents/SaveAndCancelButton'
import CardWrapper from '../CustomComponents/CardWrapper'
import { hasEmployee } from '../IsAvailable/IsAvailable'

const db = openDatabase({
  name: 'customer_database',
})

const AddAttendence = ({ navigation, route }) => {
  const [allData, setAllData] = useState([])
  const [employeeValue, setEmloyeeValue] = useState('')
  const [showFrom, setShowFrom] = useState(false)
  const profile = store.getState().auth.profile.name
  const [date, setDate] = useState(Date.now().toString())

  let loginToken = store.getState().auth.token
  const [timePickerIn, setTimePickerIn] = useState(false)
  const [timePickerOut, setTimePickerOut] = useState(false)
  const editAttendence = route?.params?.params
  console.log('eeeeeeeeeeAttendance', route)
  const [online, setOnline] = useState(false)

  const refRBSheet = useRef()
  const currentDate = new Date(Date.now()).toISOString()
  .slice(0, 10)
  const validationSchema = Yup.object().shape({
    // employeeName: hasEmployee
    //   ? Yup.string().test('isRequired', 'Employee name is required', () => {
    //       if (employeeValue != '') return true
    //       return false
    //     })
    //   : Yup.string()
    //       .required('Employee name is required')
    //       .label('Employee Name'),
    // dateOfAttendence: Yup.string()
    //   .required('Date  is required')
    //   .label('Date of Attendence'),
      dateOfAttendence:Yup.mixed().test(
        'Date is invalid',
        (value) => {
          if (currentDate == value)
            return true
        },
      ),
    timein: Yup.string().required('In Time is required').label('timein'),
    timeout: Yup.string()
      .required('Out Time is required')
      .test(
        'isSmaller',
        'Out time must be greater than in-time',
        (value, testContext) => {
          if (testContext.parent.timein > value) return false
          return true
        },
      ),
  })

  const getEmployeeDropdown = () => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * from employee_info; ',
        [],

        (tx, res) => {
          let len = res.rows.length
          if (len > 0) {
            let results = []
            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              results.push({
                id: item.employeeId,
                item: item.employeeName,
              })
              setAllData(results)
            }
          }
        },
        error => {
          console.log('error while GETTING', error.message)
        },
      )
    })
  }

  console.log(allData,"heeeeeee")
  const dispatch = useDispatch()

  const loadAttendanceTable = () => {
    db.transaction(txn => {
      txn.executeSql('SELECT * FROM attendance_info', [], (txn, res) => {
        let len = res.rows.length
        console.log(len, 'zzzzzzzzzzzz')
        if (len > 0) {
          dispatch(
            cacheLength({
              cache: 1,
              cacheAttendance: store.getState().Cache.cacheAttendance,
            }),
          )
        } else {
          dispatch(
            cacheLength({
              cache: 0,
              cacheAttendance: store.getState().Cache.cacheAttendance,
            }),
          )
        }
      })
    })
  }
  useEffect(() => {
    loadAttendanceTable()
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        setOnline(true)
      } else {
        setOnline(false)
      }
    })
    return () => unsubscribe()
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: editAttendence ? 'Edit Attendance' : 'Add Attendance',
    })
  }, [])

  const handleSubmit = values => {
    console.log('payload attendance', [
      {
        attendanceId: editAttendence?.attendanceId || '',
        employeeId: employeeValue?.id || '',
        companyId: values.companyId || '',
        employeeName: employeeValue?.item || values.employeeName,
        attendanceDate: values.dateOfAttendence,
        presentAbsent: values.presentAbsent || '',
        hoursPresent: values.hoursPresent || '',
        inTime: values.timein,
        outTime: values.timeout,
        totalworkinghours: values.totalworkinghours || '',
        createdBy: profile || '',
        updatedBy: profile || '',
        createdDate: date || '',
        updatedDate: date || '',
      },
    ])
    console.log('Hi attendance values', values)
    fetch(
      `https://apps.trisysit.com/posbackendapi/api/syncAttendance/saveOrUpdate/1`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer' + store.getState().auth.token,
        },
        body: JSON.stringify([
          {
            attendanceId: editAttendence?.attendanceId || '',
            employeeId: employeeValue?.id || '',
            companyId: values.companyId || '',
            employeeName: employeeValue?.item || values.employeeName,
            attendanceDate: values.dateOfAttendence,
            presentAbsent: values.presentAbsent || '',
            hoursPresent: values.hoursPresent || '',
            inTime: values.timein,
            outTime: values.timeout,
            totalworkinghours: values.totalworkinghours || '',
            createdBy: profile || '',
            updatedBy: profile || '',
            createdDate: date || '',
            updatedDate: date || '',
          },
        ]),
      },
    )
      .then(response => response.json())
      .then(result => {
        console.log('iiiiiiiii', result)
        result.data?.forEach(i => {
          db.transaction(txn => {
            editAttendence
              ? txn.executeSql(
                  'UPDATE attendance_info SET attendanceId=?,employeeId=?,companyId=?,employeeName=?,attendanceDate=?,presentAbsent=?,hoursPresent=?,inTime=?,outTime=?,totalworkinghours=?,createdBy=?,updatedBy=?,createdDate=?,updatedDate=? WHERE id=?',
                  [
                    i.attendanceId,
                    route?.params?.params?.employeeId || i?.employeeId,
                    i.companyId,
                    i.employeeName,
                    i.attendanceDate,
                    i.presentAbsent,
                    i.hoursPresent,
                    i.inTime,
                    i.outTime,
                    i.totalworkinghours,
                    i.createdBy,
                    i.updatedBy,
                    i?.createdDate,
                    i?.updatedDate,
                    editAttendence?.id || '',
                  ],
                  (txn, results) => {
                    if (results.rowsAffected > 0) {
                      Alert.alert(
                        'Success',
                        'Attendance updated successfully',
                        [
                          {
                            text: 'Ok',
                            onPress: () =>
                              navigation.navigate('Attendence List'),
                          },
                        ],
                        { cancelable: false },
                      )
                    } else console.log(err)
                  },
                )
              : txn.executeSql(
                  'INSERT INTO attendance_info (attendanceId,employeeId,companyId,employeeName,attendanceDate,presentAbsent,hoursPresent,inTime,outTime,totalworkinghours,createdBy,updatedBy,createdDate,updatedDate) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                  [
                    i?.attendanceId || '',
                    employeeValue?.id,
                    i.companyId,
                    i.employeeName,
                    i.attendanceDate,
                    i.presentAbsent,
                    i.hoursPresent,
                    i.inTime,
                    i.outTime,
                    i.totalworkinghours,
                    i.createdBy,
                    i.updatedBy,
                    i?.createdDate,
                    i?.updatedDate,
                  ],
                  (txn, results) => {
                    console.log('Results', results)
                    if (results.rowsAffected > 0) {
                      Alert.alert(
                        'Added',
                        'Attendance Added successfully',
                        [
                          {
                            text: 'Ok',
                            onPress: () =>
                              navigation.navigate('Attendence List'),
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
      .catch(error => console.log('errorrr', error))
    // db.transaction(function (txn) {
    //     editAttendence
    //       ? txn.executeSql(
    //           'UPDATE attendance_info SET employeeName=?, inTime=?,outTime=?,attendanceDate=? WHERE id=?',
    //           [
    //             values.employeeName,
    //             values.timein,
    //             values.timeout,
    //             values.dateOfAttendence,
    //             route?.params?.params?.id,
    //           ],
    //           (txn, results) => {
    //             console.log('updateeeeed', results)
    //             console.log(object)
    //             if (results.rowsAffected > 0) {
    //               Alert.alert(
    //                 'Success',
    //                 'Attendance updated successfully',
    //                 [
    //                   {
    //                     text: 'Ok',
    //                     onPress: () => navigation.navigate('Attendance List'),
    //                   },
    //                 ],
    //                 { cancelable: false },
    //               )
    //             } else alert('Updation Failed')
    //           },
    //         )
    //       : txn.executeSql(
    //           'INSERT INTO attendance_info (employeeName,attendanceDate,inTime,outTime) VALUES (?,?,?,?)',
    //           [
    //             employeeValue || values.employeeName,
    //             values.dateOfAttendence,
    //             values.timein,
    //             values.timeout,
    //           ],
    //           (txn, results) => {
    //             if (results.rowsAffected > 0) {
    //               console.log('dispatching')

    //               Alert.alert('Success', 'Attendance added successfully')
    //             } else Alert.alert('Error', 'Failed to Add data')
    //           },
    //           error => {
    //             console.log('error while INSERTING ' + error.message)
    //           },
    //         )
    //   })

    // fetched(true)
  }

  useEffect(() => {
    getEmployeeDropdown()
  }, [])

  const getEmployee = values => {
    console.log("first",values)
    setEmloyeeValue(values)
    
  }

  const employeeEdit = {
    id: route?.params?.params?.employeeId,
    item: route?.params?.params?.employeeName,
  }

  return (
    <CardWrapper>
      <Formik
        initialValues={{
          employeeName: editAttendence?.employeeName || '',
          dateOfAttendence: editAttendence?.attendanceDate.slice(0,10) || '',
          timein: editAttendence?.inTime || '',
          timeout: editAttendence?.outTime || '',
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
          <React.Fragment>
            {showFrom && (
              <DateTimePicker
                testID="dateTimePicker"
                timeZoneOffsetInMinutes={0}
                value={values.openDate}
                mode="date"
                maximumDate={new Date(Date.now())}
                minimumDate={new Date(Date.now())}
                is24Hour={true}
                display="default"
                selected={values.dateOfAttendence}
                onChange={val => {
                  values.dateOfAttendence = new Date(val.nativeEvent.timestamp)
                    .toISOString()
                    .slice(0, 10)
                  setShowFrom(false)
                }}
              />
            )}
            {timePickerIn && (
              <DateTimePicker
                testID="dateTimePicker"
                timeZoneOffsetInMinutes={0}
                value={values.openDate}
                mode="time"
                display="default"
             
                // is24Hour={true}
                selected={values.timein}
                // onBlur={(date, event) => console.log("dateee", date, event)}
                onChange={val => {
                  values.timein = new Date(val.nativeEvent.timestamp)
                    .toISOString()
                    .slice(11, 19)
                  setTimePickerIn(false)
                }}
              />
            )}

            {timePickerOut && (
              <DateTimePicker
                testID="dateTimePicker"
                timeZoneOffsetInMinutes={0}
                value={values.openDate}
                mode="time"
                // is24Hour={true}
                display="default"
                selected={values.timeout}
                // onBlur={(date, event) => console.log("dateee", date, event)}
                onChange={val => {
                  values.timeout = new Date(val.nativeEvent.timestamp)
                    .toISOString()
                    .slice(11, 19)
                  setTimePickerOut(false)
                }}
              />
            )}

            <View style={cardContainer}>
              {hasEmployee && (
                <View style={multiSelectOptions}>
                  <MultiSelect
                    onSelect={getEmployee}
                    single
                    label={'Select Employee'}
                    K_OPTIONS={allData}
                    selects={employeeEdit}
                  />
                  {errors.employeeName && touched.employeeName && (
                    <Text style={[errorMessage, { marginBottom: -11 }]}>
                      {errors.employeeName}
                    </Text>
                  )}
                </View>
              )}
              {!hasEmployee && (
                <View style={floatingLabelContainer}>
                  <TextInput
                    style={floatingLabelContainerInternal}
                    onChangeText={handleChange('employeeName')}
                    value={values.employeeName}
                    placeholderTextColor={placeholderTextColor}
                    placeholder="Employee Name"
                  />
                  {errors.employeeName && touched.employeeName && (
                    <Text style={errorMessage}>{errors.employeeName}</Text>
                  )}
                </View>
              )}

              {/* <View style={floatingLabelContainer}> */}
              {/* <FloatingLabelInput
                  containerStyles={floatingLabelContainerInternal}
                  placeholder="Date"
                  label={'Date *'}
                  placeholderTextColor="grey"
                  paddingHorizontal={10}
                  paddingTop={5}
                  value={values.dateOfAttendence}
                  onChangeText={handleChange('dateOfAttendence')}
                /> */}
              <View style={floatingLabelContainer}>
                <TextInput
                  style={floatingLabelContainerInternal}
                  onChangeText={handleChange('dateOfAttendence')}
                  value={values.dateOfAttendence}
                  placeholderTextColor={placeholderTextColor}
                  placeholder="Date *"
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
                {errors.dateOfAttendence && touched.dateOfAttendence && (
                  <Text style={errorMessage}>{errors.dateOfAttendence}</Text>
                )}
              </View>
              <View style={floatingLabelContainer}>
                <TextInput
                  style={floatingLabelContainerInternal}
                  onChangeText={handleChange('timein')}
                  value={values.timein}
                  placeholderTextColor={placeholderTextColor}
                  placeholder="Time-In"
                />
                <TouchableOpacity
                  onPress={() => setTimePickerIn(!timePickerIn)}
                >
                  <View
                    style={{
                      alignSelf: 'flex-end',
                      marginRight: 10,
                      marginTop: -40,
                    }}
                  >
                    <Icon name={'time'} solid size={30} />
                  </View>
                </TouchableOpacity>
                {errors.timein && touched.timein && (
                  <Text style={errorMessage}>{errors.timein}</Text>
                )}
              </View>
              {/* <View style={floatingLabelContainer}>
                <FloatingLabelInput
                  containerStyles={floatingLabelContainerInternal}
                  placeholder="Date"
                  label={'Time-Out'}
                  placeholderTextColor="grey"
                  paddingHorizontal={10}
                  paddingTop={5}
                  value={values.timeout}
                  onChangeText={handleChange('timeout')}
                /> */}
              <View style={floatingLabelContainer}>
                <TextInput
                  style={floatingLabelContainerInternal}
                  onChangeText={handleChange('timeout')}
                  value={values.timeout}
                  placeholderTextColor={placeholderTextColor}
                  placeholder="Time-Out"
                />
                <TouchableOpacity
                  onPress={() => setTimePickerOut(!timePickerOut)}
                >
                  <View
                    style={{
                      alignSelf: 'flex-end',
                      marginRight: 10,
                      marginTop: -40,
                    }}
                  >
                    <Icon name={'time'} solid size={30} />
                  </View>
                </TouchableOpacity>
                {errors.timeout && touched.timeout && (
                  <Text style={errorMessage}>{errors.timeout}</Text>
                )}
              </View>

              <SaveAndCancelButton
                handleSubmit={handleSubmit}
                saveTitle={editAttendence ? 'Update' : 'Save'}
                navigation={navigation}
                screenName="Attendence List"
              />
            </View>
          </React.Fragment>
        )}
      </Formik>
    </CardWrapper>
  )
}

export default AddAttendence
