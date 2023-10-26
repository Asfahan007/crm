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
  Animated,
  Modal,
} from 'react-native'
import React, { useEffect, useState, useRef, useLayoutEffect } from 'react'
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
} from '../../../../Containers/CustomComponents/Style'
import { store } from '../../../../Store'
import { openDatabase } from 'react-native-sqlite-storage'
import * as Yup from 'yup'
import { Picker } from '@react-native-picker/picker'
import { hasStore, hasTerritory } from '../../../IsAvailable/IsAvailable'
import CardWrapper from '../../../../Containers/CustomComponents/CardWrapper'
import Icon from 'react-native-vector-icons/Ionicons'
import DateTimePicker from '@react-native-community/datetimepicker'
import { getUsers } from '@/Containers/CustomComponents/UsernameTable'
import { textColor } from '@/Containers/CustomComponents/Image'
import generateUUID from '@/Containers/CustomComponents/GetUUID'

const db = openDatabase({
  name: 'customer_database',
})

const AddActivity = ({ navigation, route }) => {
  console.log('add activity contact route', route)
  const activityRoute = route?.params?.editActivityData
    ? route?.params?.editActivityData[0]
    : []
  console.log('activityyyyyyyyyyy', route?.params?.editActivityData)

  const activityDataRoute = route?.params?.route?.params
  console.log(activityDataRoute, "jiiiiiiiiiiiii")
  let owner = getUsers()
  const [customer, setCustomer] = useState()
  const [allData, setAllData] = useState([])
  const [storeData, setStoreData] = useState([])
  const [territoryValue, setTerritoryValue] = useState('')
  const [storeValue, setStoreValue] = useState('')
  const [showTo, setShowTo] = useState(false)
  const [activityDate, setActivityDate] = useState('')
  const [timePickerIn, setTimePickerIn] = useState(false)

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

  const validationSchema = Yup.object().shape({
    timein: Yup.string().required('Required').label('timein'),
    activityDate: Yup.string().required('Required').label('activityDate'),
  })
  console.log('add route', route)

  const generateActivityId = generateUUID()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: route?.params?.editActivityData ? 'Edit Activity' : 'Add Activity',
    })
  }, [navigation, route?.params?.editActivityData])


  const createActivityTable = () => {
    db.transaction(txn => {
      txn.executeSql(
        'CREATE TABLE IF NOT EXISTS activity_info (id INTEGER PRIMARY KEY AUTOINCREMENT,calendarId VARCHAR(255) ,calendarType VARCHAR(255) ,userId VARCHAR(255) ,projectHistoryId VARCHAR(255) ,title VARCHAR(255),className VARCHAR(255) ,start VARCHAR(255) ,end VARCHAR(255) ,allDay bit(1) ,createdDate datetime ,createdBy VARCHAR(255) ,updatedDate datetime ,updatedBy VARCHAR(255) ,activityDate VARCHAR(255) ,activityTime VARCHAR(255) ,category VARCHAR(255) ,refId VARCHAR(45) ,refName VARCHAR(45) ,status VARCHAR(45) ,owner VARCHAR(45) ,name VARCHAR(45) ,priority VARCHAR(255) ,associateRecords VARCHAR(255) ,dueDate VARCHAR(255) ,reminder VARCHAR(255) ,contactId VARCHAR(255) ,accountId VARCHAR(255) ,dealId VARCHAR(255) ,hierarchyId VARCHAR(255) ,startDate VARCHAR(255) ,endDate VARCHAR(255) ,actualStartDate VARCHAR(255) ,actualEndDate VARCHAR(255) ,activityStatus VARCHAR(255))',
        [],
        () => {
          console.log('ACTIVITY CREATED SUCCESSFULLY')
        },
        error => {
          console.log('error while creating' + error.message)
        },
      )
    })
  }

  const handleSubmit = values => {
    console.log('payload', [
      {
        accountId: null,
        mobileCalendarId: activityRoute?.mobileCalendarId || generateUUID(),
        mobileRefId: route?.params?.header?.mobileContactId || activityDataRoute?.mobileRefId || '',
        activityStatus: 'Newly Assigned',
        activityTime: values?.timein || '',
        actualEndDate: null,
        actualStartDate: values?.activityDate,
        allDay: false,
        associateRecords: null,
        calendarId: activityRoute?.calendarId || '',
        calendarType: null,
        category: values?.category || '',
        className: null,
        companyId: route?.params?.header?.companyId || '',
        contactId: route?.params?.header?.contactId || null,
        createdBy: null,
        createdDate: null,
        dealId: activityRoute?.dealId,
        dueDate: null,
        endDate: null,
        hierarchyId: null,
        name: route?.params?.contactName || activityRoute?.contactName || '',
        owner: values?.owner || '',
        priority: values?.priority,
        projectHistoryId: null,
        refId: route?.params?.header?.contactId || '',
        reminder: activityDate,
        startDate: values?.activityDate,
        status: values?.status,
        title: values?.title || '',
        updatedBy: null,
        updatedDate: null,
        userId: store.getState().auth.profile.name,
        refType: "contact",
      }
    ])

    store.getState().online.isOnline
      ? fetch(
        `https://apps.trisysit.com/posbackendapi/api/syncActivity/saveOrUpdate/1`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer' + store.getState().auth.token,
          },
          body: JSON.stringify([
            {
              accountId: null,
              mobileCalendarId: activityRoute?.mobileCalendarId || generateUUID(),
              mobileRefId: route?.params?.contactId || activityDataRoute?.mobileContactId,
              activityStatus: 'Newly Assigned',
              activityTime: values?.timein || '',
              actualEndDate: null,
              actualStartDate: values?.activityDate,
              allDay: false,
              associateRecords: null,
              calendarId: activityRoute?.calendarId || '',
              calendarType: null,
              category: values?.category || '',
              className: null,
              companyId: route?.params?.header?.companyId || '',
              contactId: route?.params?.header?.contactId || null,
              createdBy: null,
              createdDate: null,
              dealId: activityRoute?.dealId,
              dueDate: null,
              endDate: null,
              hierarchyId: null,
              name: route?.params?.contactName || activityRoute?.contactName || '',
              owner: values?.owner || '',
              priority: values?.priority,
              projectHistoryId: null,
              refId: activityRoute?.refId || route?.params?.header?.contactId || '',
              reminder: activityDate,
              startDate: values?.activityDate,
              status: values.status,
              title: values?.title || '',
              updatedBy: null,
              updatedDate: null,
              userId: store.getState().auth.profile.name,
              refType: "contact",
            },
          ]),
        },
      )
        .then(response => response.json())
        .then(result => {
          console.log('response of activity', result)
          result.data?.forEach(i => {
            db.transaction(tx => {
              tx.executeSql(
                'INSERT OR REPLACE INTO activity_info (mobileCalendarId,calendarId,calendarType ,userId ,projectHistoryId ,title,className ,start ,end ,allDay,createdDate ,createdBy ,updatedDate ,updatedBy ,activityDate ,activityTime ,category ,refId ,refName ,status ,owner ,name ,priority ,associateRecords ,dueDate ,reminder ,contactId ,accountId ,dealId ,hierarchyId ,startDate ,endDate ,actualStartDate ,actualEndDate ,activityStatus,mobileRefId,refType,isOnline,companyId) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                [
                  i?.mobileCalendarId || generateUUID(),
                  i?.calendarId,
                  i?.calendarType,
                  i?.userId,
                  i?.projectHistoryId,
                  i?.title,
                  i?.className,
                  i?.start,
                  i?.end,
                  i?.allDay,
                  i?.createdDate,
                  i?.createdBy,
                  i?.updatedDate,
                  i?.updatedBy,
                  i?.activityDate,
                  i?.activityTime,
                  i?.category,
                  i?.refId,
                  i?.refName,
                  i?.status,
                  i?.owner,
                  i?.name,
                  i?.priority,
                  i?.associateRecords,
                  i?.dueDate,
                  i?.reminder,
                  i?.contactId,
                  i?.accountId,
                  i?.dealId,
                  i?.hierarchyId,
                  i?.startDate,
                  i?.endDate,
                  i?.actualStartDate,
                  i?.actualEndDate,
                  i?.activityStatus,
                  i?.mobileRefId,
                  i?.refType,
                  true,
                  i?.companyId
                ],
                (tx, res) => {
                  console.log("update activity res", res)
                  Alert.alert(
                    'Success',
                    `Activity ${route?.params?.editActivityData?.length > 0 ? "updated" : "added"} successfully`,
                    [
                      {
                        text: 'Ok',
                        onPress: () => navigation.goBack()
                        // onPress: () => navigation.navigate("Contact Activity Detail", { activityId: i?.calendarId })

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
        .catch(error => console.log('errorrr', error))
      :
      db.transaction(tx => {
        tx.executeSql(
          'INSERT OR REPLACE INTO activity_info (mobileCalendarId,calendarType ,userId ,projectHistoryId ,title,className ,start ,end ,allDay,createdDate ,createdBy ,updatedDate ,updatedBy ,activityDate ,activityTime ,category ,refId ,refName ,status ,owner ,name ,priority ,associateRecords ,dueDate ,reminder ,contactId ,accountId ,dealId ,hierarchyId ,startDate ,endDate ,actualStartDate ,actualEndDate ,activityStatus,mobileRefId,refType,isOnline,companyId) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
          [
            activityRoute?.mobileCalendarId || generateActivityId,
            null,
            store.getState().auth.profile?.name,
            null,
            values?.title || '',
            null,
            null,
            null,
            "false",
            "",
            store.getState().auth.profile.name,
            "",
            store.getState().auth.profile.name,
            values?.activityDate,
            values?.timein || '',
            values?.category,
            activityDataRoute?.contactId || route?.params?.header?.contactId || "",
            "",
            values.status,
            values?.owner || '',
            activityDataRoute?.contactId || '',
            values?.priority,
            null,
            null,
            activityDate,
            activityDataRoute?.contactId || '',
            "",
            activityDataRoute?.contactId || '',
            null,
            values?.activityDate,
            null,
            values?.activityDate,
            null,
            "Newly Assigned",
            activityDataRoute?.mobileContactId || '',
            "contact",
            false,
            route?.params?.header?.companyId || '',
          ],
          (tx, res) => {
            console.log("update activity res", res)
            Alert.alert(
              'Success',
              `Activity ${route?.params?.editActivityData?.length > 0 ? "updated" : "added"} offline`,
              [
                {
                  text: 'Ok',
                  // onPress: () => navigation.navigate("Contact Activity Detail", { mobileActivityId: activityRoute?.mobileCalendarId || generateActivityId })
                  onPress: () => navigation.goBack()
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

  return (
    <CardWrapper>
      <Formik
        initialValues={{
          title: activityRoute?.title || '',
          category: activityRoute?.category || '',
          priority: activityRoute?.priority || '',
          owner: activityRoute?.owner || '',
          activityDate: activityRoute?.actualStartDate || '',
          timein: activityRoute?.activityTime || '',
          openDate: new Date(Date.now()),
        }}
        // validationSchema={validationSchema}
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
            {showTo && (
              <DateTimePicker
                testID="dateTimePicker"
                timeZoneOffsetInMinutes={0}
                value={values.openDate}
                minimumDate={new Date(Date.now())}
                mode="date"
                is24Hour={true}
                display="default"
                selected={values.activityDate}
                onBlur={(date, event) => console.log('dateee', date, event)}
                onChange={val => {
                  values.activityDate = new Date(val.nativeEvent.timestamp)
                    .toISOString()
                    .slice(0, 10)
                  setShowTo(false)
                  setActivityDate(val.nativeEvent.timestamp)
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
                  // .slice(0,5)
                  setTimePickerIn(false)
                }}
              />
            )}
            <View style={floatingLabelContainer}>
              <TextInput
                style={floatingLabelContainerInternal}
                onChangeText={handleChange('title')}
                value={values.title}
                placeholderTextColor={placeholderTextColor}
                placeholder="Title"
              />
            </View>
            <View style={pickerInputContainer}>
              <Picker
                style={{ bottom: 5, display: 'flex' }}
                selectedValue={values.category}
                onValueChange={handleChange('category')}
              >
                <Picker.Item
                  style={pickerItem}
                  label="Select Category"
                  value=""
                />
                <Picker.Item style={pickerItem2} label="Call" value="Call" />
                <Picker.Item
                  style={pickerItem2}
                  label="Meeting"
                  value="Meeting"
                />
                <Picker.Item style={pickerItem2} label="Event" value="Event" />
              </Picker>
            </View>
            <View style={pickerInputContainer}>
              <Picker
                style={{ bottom: 5, display: 'flex' }}
                selectedValue={values.priority}
                onValueChange={handleChange('priority')}
              >
                <Picker.Item
                  style={pickerItem}
                  label="Select Priority"
                  value=""
                />
                <Picker.Item style={pickerItem2} label="Low" value="Low" />
                <Picker.Item
                  style={pickerItem2}
                  label="Medium"
                  value="Medium"
                />
                <Picker.Item style={pickerItem2} label="High" value="High" />
              </Picker>
            </View>

            {/* <View
            style={pickerInputContainer}
          >
            <Picker
              style={{ bottom: 3.5,display:'flex' }}
              selectedValue={values.owner}
              onValueChange={handleChange('owner')}
            >
              <Picker.Item label="Select Owner" value="" style={pickerItem} />

              {owner.map((item, index) => (
                <Picker.Item
                  label={item.name}
                  value={item.username}
                  key={index}
                  style={pickerItem2}
                />
              ))}
              <Picker.Item
                                style={pickerItem}
                                label="Select Owner"
                                value=""
                            />
                            <Picker.Item
                                style={pickerItem2}
                                label="Julio"
                                value="Julio"
                            />
                            <Picker.Item
                                style={pickerItem2}
                                label="Karen"
                                value="Karen"
                            />
            </Picker>
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

            <View style={floatingLabelContainer}>
              <TextInput
                style={floatingLabelContainerInternal}
                onChangeText={handleChange('activityDate')}
                value={values.activityDate}
                placeholderTextColor={placeholderTextColor}
                placeholder="Activity Date"
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
              {errors.activityDate && touched.activityDate && (
                <Text style={errorMessage}>{errors.activityDate}</Text>
              )}
            </View>

            <View style={floatingLabelContainer}>
              <TextInput
                style={floatingLabelContainerInternal}
                onChangeText={handleChange('timein')}
                value={values.timein.slice(0, 5)}
                placeholderTextColor={placeholderTextColor}
                placeholder="Time"
              />
              <TouchableOpacity onPress={() => setTimePickerIn(!timePickerIn)}>
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
            <View style={saveAndCancel}>
              <View>
                <TouchableOpacity style={saveButton} onPress={handleSubmit}>
                  <Text style={saveText}>
                    {route?.params?.editActivityData ? 'Update' : 'Add'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  style={cancelButton}
                  onPress={() => navigation.goBack()}
                >
                  <Text style={cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Formik>
    </CardWrapper>
  )
}

export default AddActivity