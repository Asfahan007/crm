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
import React, { useEffect, useState, useRef } from 'react'
import { Formik } from 'formik'
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
import Icon from 'react-native-vector-icons/Ionicons'
import DateTimePicker from '@react-native-community/datetimepicker'
import { textColor } from '@/Containers/CustomComponents/Image'

const db = openDatabase({
  name: 'customer_database',
})

const AddDealActivity = ({
  navigation,
  setModalVisible,
  modalVisible,
  header,
  contact,
  editActivityRoute,
  setEditActivityRoute,
}) => {
  let username = store.getState().auth.profile.name
  const [territoryValue, setTerritoryValue] = useState('')
  const [showTo, setShowTo] = useState(false)
  const [timePickerIn, setTimePickerIn] = useState(false)
  const [activityDate, setActivityDate] = useState('')

  console.log('AddDealActrivity props', modalVisible, editActivityRoute)
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

  const validationSchema = Yup.object().shape({
    timein: Yup.string().required('Required').label('timein'),
    activityDate: Yup.string().required('Required').label('activityDate'),
  })

  console.log(editActivityRoute, 'cosole')
  // const createActivityTable = () => {
  //     db.transaction(txn => {
  //         txn.executeSql(
  //             'CREATE TABLE IF NOT EXISTS activity_info (id INTEGER PRIMARY KEY AUTOINCREMENT,calendarId VARCHAR(255) ,calendarType VARCHAR(255) ,userId VARCHAR(255) ,projectHistoryId VARCHAR(255) ,title VARCHAR(255),className VARCHAR(255) ,start VARCHAR(255) ,end VARCHAR(255) ,allDay bit(1) ,createdDate datetime ,createdBy VARCHAR(255) ,updatedDate datetime ,updatedBy VARCHAR(255) ,activityDate VARCHAR(255) ,activityTime VARCHAR(255) ,category VARCHAR(255) ,refId VARCHAR(45) ,refName VARCHAR(45) ,status VARCHAR(45) ,owner VARCHAR(45) ,name VARCHAR(45) ,priority VARCHAR(255) ,associateRecords VARCHAR(255) ,dueDate VARCHAR(255) ,reminder VARCHAR(255) ,contactId VARCHAR(255) ,accountId VARCHAR(255) ,dealId VARCHAR(255),dealName VARCHAR(255)  ,hierarchyId VARCHAR(255) ,startDate VARCHAR(255) ,endDate VARCHAR(255) ,actualStartDate VARCHAR(255) ,actualEndDate VARCHAR(255) ,activityStatus VARCHAR(255))',
  //             [],
  //             () => {
  //                 console.log('ACTIVITY CREATED SUCCESSFULLY')
  //             },
  //             error => {
  //                 console.log('error while creating' + error.message)
  //             },
  //         )
  //     })
  // }

  useEffect(() => {
    // createActivityTable()
  }, [])

  const fadeAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: modalVisible ? 0.3 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [fadeAnim, modalVisible])

  const handleSubmit = values => {
    console.log('payload', [
      {
        accountId: null,
        activityStatus: 'Newly Assigned',
        activityTime: values?.timein || '',
        actualEndDate: null,
        actualStartDate: values?.activityDate,
        allDay: false,
        associateRecords: null,
        calendarId: '',
        calendarType: null,
        category: values?.category,
        className: null,
        companyId: '',
        contactId:
          values?.contactOwner || editActivityRoute[0]?.contactId || null,
        // contactId: values?.contactOwner || editActivityRoute[0]?.contactId || contact[0].contactId || null,
        createdBy: null,
        createdDate: null,
        dealId: header?.dealId,
        dueDate: null,
        endDate: null,
        hierarchyId: null,
        name: values.name,
        owner: store?.getState().auth.profile?.name,
        priority: values?.priority,
        projectHistoryId: null,
        refId: header?.dealId,
        reminder: activityDate,
        startDate: values?.activityDate,
        status: values.status,
        title: values?.title || '',
        updatedBy: null,
        updatedDate: null,
        userId: store.getState().auth.profile.name,
      },
    ])
    fetch(
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
            activityStatus: 'Newly Assigned',
            activityTime: values?.timein || '',
            actualEndDate: null,
            actualStartDate: values?.activityDate,
            allDay: false,
            associateRecords: null,
            calendarId: '',
            calendarType: null,
            category: values?.category,
            className: null,
            companyId: '',
            contactId:
              values?.contactOwner || editActivityRoute[0]?.contactId || null,
            createdBy: null,
            createdDate: null,
            dealId: header?.dealId,
            dueDate: null,
            endDate: null,
            hierarchyId: null,
            name: values.name,
            owner: store?.getState().auth.profile?.name,
            priority: values?.priority,
            projectHistoryId: null,
            refId: header?.dealId,
            reminder: activityDate,
            startDate: values?.activityDate,
            status: values.status,
            title: values?.title || '',
            updatedBy: null,
            updatedDate: null,
            userId: store.getState().auth.profile.name,
          },
        ]),
      },
    )
      .then(response => response.json())
      .then(result => {
        console.log('response of activity', result)
        result.data?.forEach(i => {
          db.transaction(tx => {
            editActivityRoute[0]?.calendarId
              ? // alert("hi")
                tx.executeSql(
                  'UPDATE activity_info SET calendarId=?,calendarType =?,userId =?,projectHistoryId =?,title=?,className =?,start =?,end =?,allDay=?,createdDate =?,createdBy =?,updatedDate =?,updatedBy =?,activityDate =?,activityTime =?,category =?,refId =?,refName =?,status =?,owner =?,name =?,priority =?,associateRecords =?,dueDate =?,reminder =?,contactId =?,accountId =?,dealId =?,hierarchyId =?,startDate =?,endDate =?,actualStartDate =?,actualEndDate =?,activityStatus =? where id=?',
                  [
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
                    editActivityRoute[0]?.id,
                  ],
                  (tx, res) => {
                    console.log('update activity res', res)
                    Alert.alert(
                      'Success',
                      'Activity updated successfully',
                      [
                        {
                          text: 'Ok',
                          onPress: () => {
                            setModalVisible(!modalVisible)
                            editActivityRoute[0]?.calendarId
                              ? navigation.push('Activity Detail', {
                                  activityId: i?.calendarId,
                                })
                              : null
                          },
                        },
                      ],
                      { cancelable: false },
                    )
                  },
                  error => {
                    console.log('error while INSERTING ' + error.message)
                  },
                )
              : // alert("insert")
                tx.executeSql(
                  'INSERT INTO activity_info (calendarId,calendarType ,userId ,projectHistoryId ,title,className ,start ,end ,allDay,createdDate ,createdBy ,updatedDate ,updatedBy ,activityDate ,activityTime ,category ,refId ,refName ,status ,owner ,name ,priority ,associateRecords ,dueDate ,reminder ,contactId ,accountId ,dealId ,hierarchyId ,startDate ,endDate ,actualStartDate ,actualEndDate ,activityStatus) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                  [
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
                  ],
                  (tx, results) => {
                    Alert.alert(
                      'Success',
                      'Activity added successfully',
                      [
                        {
                          text: 'Ok',
                          onPress: () => setModalVisible(!modalVisible),
                        },
                      ],
                      { cancelable: false },
                    )
                  },
                  error => {
                    console.log('error while activity add ' + error.message)
                  },
                )
          })
        })
      })
      .catch(error => console.log('errorrr', error))
  }

  const getTerritory = values => {
    setTerritoryValue(values.item)
  }

  const closeModal = () => {
    setEditActivityRoute([])
    setModalVisible(!modalVisible)
  }

  return (
    <Animated.View style={[{ opacity: fadeAnim, marginBottom: 60 }]}>
      <View style={styles.centeredView}>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View>
                <Formik
                  initialValues={{
                    title: editActivityRoute[0]?.title || '',
                    category: editActivityRoute[0]?.category || '',
                    priority: editActivityRoute[0]?.priority || '',
                    owner: editActivityRoute[0]?.owner || '',
                    contactOwner: editActivityRoute[0]?.contactId || '',
                    activityDate: editActivityRoute[0]?.actualStartDate.slice(0,10) || '',
                    timein: editActivityRoute[0]?.activityTime || '',
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
                    <>
                      {showTo && (
                        <DateTimePicker
                          testID="dateTimePicker"
                          timeZoneOffsetInMinutes={0}
                          value={values.openDate}
                          mode="date"
                          is24Hour={true}
                          minimumDate={new Date(Date.now())}
                          display="default"
                          selected={values.activityDate}
                          onBlur={(date, event) =>
                            console.log('dateee', date, event)
                          }
                          onChange={val => {
                            values.activityDate = new Date(
                              val.nativeEvent.timestamp,
                            )
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
                            setTimePickerIn(false)
                          }}
                        />
                      )}
                      <View
                        style={{
                          height: 40,
                          width: Dimensions.get('screen').width - 100,
                          marginTop: 15,
                          paddingHorizontal: 10,
                        }}
                      >
                        <TextInput
                          style={{
                            height: 40,
                            borderColor: 'grey',
                            backgroundColor: '#faffff',
                            borderWidth: 1,
                            borderRadius: 8,
                            paddingHorizontal: 16,
                            color: '#000',
                            width: Dimensions.get('screen').width - 120,
                            fontSize: 14,
                          }}
                          onChangeText={handleChange('title')}
                          value={values.title}
                          placeholderTextColor={placeholderTextColor}
                          placeholder="Title"
                        />
                      </View>
                      <View
                        style={{
                          height: 40,
                          width: Dimensions.get('screen').width - 120,
                          marginTop: 15,
                          backgroundColor: '#faffff',
                          borderRadius: 7.5,
                          borderWidth: 1,
                          borderColor: 'gray',
                          color: '#000000',
                          marginHorizontal: 10,
                        }}
                      >
                        <Picker
                          style={{ bottom: 5 }}
                          selectedValue={values.category}
                          onValueChange={handleChange('category')}
                        >
                          <Picker.Item
                            style={pickerItem}
                            label="Select Category"
                            value=""
                          />
                          <Picker.Item
                            style={pickerItem2}
                            label="Meeting"
                            value="Meeting"
                          />
                          <Picker.Item
                            style={pickerItem2}
                            label="Call"
                            value="Call"
                          />
                          <Picker.Item
                            style={pickerItem2}
                            label="Event"
                            value="Event"
                          />
                        </Picker>
                      </View>
                      <View
                        style={{
                          height: 40,
                          width: Dimensions.get('screen').width - 120,
                          marginTop: 15,
                          backgroundColor: '#faffff',
                          borderRadius: 7.5,
                          borderWidth: 1,
                          borderColor: 'gray',
                          color: '#000000',
                          marginHorizontal: 10,
                        }}
                      >
                        <Picker
                          style={{ bottom: 5 }}
                          selectedValue={values.priority}
                          onValueChange={handleChange('priority')}
                        >
                          <Picker.Item
                            style={pickerItem}
                            label="Select Priority"
                            value=""
                          />
                          <Picker.Item
                            style={pickerItem2}
                            label="Medium"
                            value="Medium"
                          />
                          <Picker.Item
                            style={pickerItem2}
                            label="Low"
                            value="Low"
                          />
                          <Picker.Item
                            style={pickerItem2}
                            label="High"
                            value="High"
                          />
                        </Picker>
                      </View>
                      {contact?.length > 0 && (
                        <View
                          style={{
                            height: 40,
                            width: Dimensions.get('screen').width - 120,
                            marginTop: 15,
                            backgroundColor: '#faffff',
                            borderRadius: 7.5,
                            borderWidth: 1,
                            borderColor: 'gray',
                            color: '#000000',
                            marginHorizontal: 10,
                          }}
                        >
                          <Picker
                            style={{ bottom: 5 }}
                            selectedValue={values.contactOwner}
                            onValueChange={handleChange('contactOwner')}
                          >
                            {contact?.length > 0 ? (
                              contact.map(e => {
                                return (
                                  <Picker.Item
                                    style={pickerItem2}
                                    label={e?.contactName}
                                    value={e?.contactId}
                                  />
                                )
                              })
                            ) : (
                              <Picker.Item
                                style={pickerItem}
                                label="Select Contact"
                                value=""
                              />
                            )}
                          </Picker>
                        </View>
                      )}
                      <View
                        style={{
                          height: 40,
                          width: Dimensions.get('screen').width - 100,
                          marginTop: 15,
                          paddingHorizontal: 10,
                        }}
                      >
                        <TextInput
                          style={{
                            height: 40,
                            borderColor: 'grey',
                            backgroundColor: '#faffff',
                            borderWidth: 1,
                            borderRadius: 8,
                            paddingHorizontal: 16,
                            color: '#000',
                            width: Dimensions.get('screen').width - 120,
                            fontSize: 14,
                          }}
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
                              marginTop: -37,
                            }}
                          >
                            <Icon name={'calendar'} solid size={30} />
                          </View>
                        </TouchableOpacity>
                        {errors.activityDate && touched.activityDate && (
                          <Text style={errorMessage}>
                            {errors.activityDate}
                          </Text>
                        )}
                      </View>

                      <View
                        style={{
                          height: 40,
                          width: Dimensions.get('screen').width - 100,
                          marginTop: 15,
                          paddingHorizontal: 10,
                        }}
                      >
                        <TextInput
                          style={{
                            height: 40,
                            borderColor: 'grey',
                            backgroundColor: '#faffff',
                            borderWidth: 1,
                            borderRadius: 8,
                            paddingHorizontal: 16,
                            color: '#000',
                            width: Dimensions.get('screen').width - 120,
                            fontSize: 14,
                          }}
                          onChangeText={handleChange('timein')}
                          value={values.timein}
                          placeholderTextColor={placeholderTextColor}
                          placeholder="Time"
                        />
                        <TouchableOpacity
                          onPress={() => setTimePickerIn(!timePickerIn)}
                        >
                          <View
                            style={{
                              alignSelf: 'flex-end',
                              marginRight: 10,
                              marginTop: -37,
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
                          <TouchableOpacity
                            style={saveButton}
                            onPress={handleSubmit}
                          >
                            <Text style={saveText}>
                              {' '}
                              {editActivityRoute ? 'Update' : 'Add'}
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <View>
                          <TouchableOpacity
                            style={cancelButton}
                            onPress={() => closeModal()}
                          >
                            <Text style={cancelText}>Cancel</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </>
                  )}
                </Formik>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 10,
    // padding: 15,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    width: screenWidth - 20,
  },
  highlightCard: {
    backgroundColor: 'white',
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 10,
    // padding: 15,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    borderWidth: 1,
    borderColor: 'red',
  },

  dropdown: {
    height: 45,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 0,
    // paddingHorizontal: 15,
    paddingLeft: 15,
    color: '#000',
    backgroundColor: '#f1f5f7',
  },
  submit: {
    margin: 5,
    alignItems: 'center',
  },
  buttonCancel: {
    backgroundColor: '#00b8ce',
    borderRadius: 0,
    height: screenWidth - 350,
    width: screenWidth - 280,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    height: 55,
    width: 55,
    backgroundColor: '#00b8ce',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 0,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: textColor,
    shadowOffset: {
      width: 150,
      height: 100,
    },
    shadowOpacity: 2,
    shadowRadius: 300,
    elevation: 50,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalVisible: {
    backgroundColor: 'grey',
    flex: 1,
    opacity: 0.5,
  },
  modalVisibleFalse: {
    flex: 1,
  },
})

export default AddDealActivity
