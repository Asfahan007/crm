import React, { useContext, useRef, useEffect } from 'react'
import {
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  TextInput,
  FlatList,
  Alert,
  Animated,
  Dimensions,
  SafeAreaView,
} from 'react-native'
import MaterialSnackbar from '../../../../MD/components/MaterialSnackbar'
import { PageContext } from '../../../../Containers/MDContainer'
import { useLayoutEffect } from 'react'
import { useState } from 'react'
import { openDatabase } from 'react-native-sqlite-storage'
import Icon from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useIsFocused } from '@react-navigation/native'
import { BackHandler } from 'react-native'
import { MyComponent } from '../../../../Containers/Deal/Deals/Deal Details/DealDetails'
import HeaderNavbar from '../../../../Containers/CustomComponents/HeaderNavbar'
import ListWrapper from '../../../../Containers/CustomComponents/ListWrapper'
import {
  listCardContainer,
  screenWidth,
} from '../../../../Containers/CustomComponents/Style'
import {
  appColor,
  highlightedColor,
  linkedDataColor,
  textColor,
  whiteTextColor,
} from '../../../../Containers/CustomComponents/Image'
import { findUserByUsername } from '@/Containers/CustomComponents/UsernameTable'
import { Checkbox, Menu, Provider } from 'react-native-paper'
import { store } from '@/Store'
import AddActivity from './AddActivity'
import parseTimestampToIST from '@/Containers/CustomComponents/UTCtoIST'
import { HEADER_BUTTON_HEIGHT, NOTE_INPUT_HEIGHT } from '@/Constants/Constants'
import { getNotesData } from '@/Containers/CustomComponents/GetNotes'
import { findContactByContactId } from '@/Containers/CustomComponents/GetTable'
import generateUUID from '@/Containers/CustomComponents/GetUUID'

const db = openDatabase({
  name: 'customer_database',
  ContactActiDetail,
})
const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width

function ContactActiDetail({ navigation, route }) {
  console.log('contact activity details', route)
  const editActivityData = route?.params?.route?.params
  console.log(editActivityData, 'edit')
  const deal = route?.params?.deal
  console.log(deal, 'dealllllllllll')
  const header = route?.params?.header
  const snackbarRef = useRef(null)
  const [activityData, setActivityData] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [editActivityRoute, setEditActivityRoute] = useState([])
  const [add, setAdd] = useState(0)
  const [noteData, setNoteData] = useState([])
  const [formattedNoteData, setFormattedNoteData] = useState([])
  const [text, setText] = useState('')
  const [dealName, setDealName] = useState([])
  const isFocused = useIsFocused()

  const editActivity = data => {
    navigation.navigate('Add Activity Contact', {
      editActivityData: data,
      deal: deal,
      header:header
    })
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: activityData[0]?.title || 'NA',
    })
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={{ marginHorizontal: 10 }}>
            <Icon name="arrow-back" size={25} color="#fff" />
          </View>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => {
              editActivity(activityData)
            }}
          >
            <View style={{ alignSelf: 'flex-end', marginRight: 10 }}>
              <Icon name={'create-outline'} color="#fff" solid size={25} />
            </View>
          </TouchableOpacity>
        </View>
      ),
    })
  }, [activityData, modalVisible, navigation])

  const getActivityDetails = async () => {
    await db.transaction(txn => {
      txn.executeSql(
        'SELECT * from activity_info where calendarId=? or mobileCalendarId = ?',
        [route?.params?.activityId, route?.params?.mobileActivityId],
        (tx, res) => {
          console.log('resssssssssssssss', res)
          let len = res.rows.length
          console.log('len', len)
          if (len > 0) {
            let results = []
            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              results.push(item)
            }
            setActivityData(results)
          }
        },
        error => {
          console.log('error while GETTING', error.message)
        },
      )
    })
  }
  console.log('ffffffff', activityData)

  useEffect(() => {
    getActivityDetails()
  }, [modalVisible, navigation, isFocused])

  function DetailSection({ title, data, color }) {
    return (
      <View
        style={{
          backgroundColor: appColor,
          display: 'flex',
          alignItems: 'flex-start',
          paddingVertical: 5,
          paddingHorizontal: 15,
          justifyContent: 'flex-start',
          flexDirection: 'row',
        }}
      >
        <Text
          style={{
            color: whiteTextColor,
            fontSize: 17,
            fontWeight: '600',
            textAlign: 'left',
          }}
        >
          {title} :
        </Text>
        <Text
          style={{
            color: color,
            fontSize: 17,
            fontWeight: '600',
            marginLeft: 5,
            textAlign: 'left',
          }}
        >
          {data}
        </Text>
      </View>
    )
  }

  const callNotes = () => {
    if (text != '') {
      sendNotes()
      setText('')
    }
  }

  const sendNotes = () => {
    console.log('note payload', [
      {
        "noteId": '',
        "name": 'gudu',
        "owner": store.getState().auth.profile.name,
        "status": '',
        "createDate": '',
        "createdBy": '',
        "updateDate": '',
        "updatedBy": store.getState().auth.firstName || '',
        "refId": activityData[0].calendarId,
        "mobileRefId": activityData[0].mobileCalendarId,
        "refType": activityData[0].category,
        "description": text,
        "companyId": route?.params?.header?.companyId || '',
      },
    ])
    store.getState().online.isOnline
      ? fetch(
        `https://apps.trisysit.com/posbackendapi/api/syncNote/saveNotes/1`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer' + store.getState().auth.token,
          },
          body: JSON.stringify([
            {
              noteId: '',
              name: 'Bariya',
              owner: store.getState().auth.profile.name,
              status: '',
              createDate: '',
              createdBy: '',
              updateDate: '',
              updatedBy: store.getState().auth.firstName || '',
              refId: activityData[0].calendarId,
              mobileRefId: activityData[0].mobileCalendarId,
              refType: activityData[0].category,
              description: text,
              companyId: route?.params?.header?.companyId || '',
            },
          ]),
        },
      )
        .then(response => response.json())
        .then(result => {
          console.log('result', result)
          result.data?.forEach(i => {
            db.transaction(tx => {
              tx.executeSql(
                'INSERT OR REPLACE INTO note_info (mobileNoteId,noteId,companyId,name,owner,status,createDate,createdBy,updateDate ,updatedBy,refId,mobileRefId,description,refType,isOnline) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                [
                  i?.mobileNoteId || generateUUID(),
                  i?.noteId,
                  i?.companyId,
                  i?.name,
                  i?.owner,
                  i?.status,
                  i?.createDate,
                  i?.createdBy,
                  i?.updateDate,
                  i?.updatedBy,
                  i?.refId,
                  i?.mobileRefId,
                  i?.description,
                  i?.refType,
                  true,
                ],
                (tx, results) => {
                  console.log('Note data', results)
                  setAdd(add + 1)
                },
                error => {
                  console.log('error while Note company ' + error.message)
                },
              )
            })
          })
        })
        .catch(error => console.log('errorrr', error))
      : db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO note_info (mobileNoteId,companyId,name,owner,status,createDate,createdBy ,updateDate ,updatedBy,refId,description,refType,mobileRefId,isOnline) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
          [
            generateUUID(),
            route?.params?.header?.companyId,
            'Bariya',
            store.getState().auth.profile.name,
            'ACTIVE',
            new Date(
              Date.UTC(
                new Date().getUTCFullYear(),
                new Date().getUTCMonth(),
                new Date().getUTCDate(),
                new Date().getUTCHours(),
                new Date().getUTCMinutes(),
                new Date().getUTCSeconds(),
              ),
            ).toISOString(),
            store.getState().auth.profile.name,
            new Date(
              Date.UTC(
                new Date().getUTCFullYear(),
                new Date().getUTCMonth(),
                new Date().getUTCDate(),
                new Date().getUTCHours(),
                new Date().getUTCMinutes(),
                new Date().getUTCSeconds(),
              ),
            ).toISOString(),
            store.getState().auth.profile.name,
          activityData[0].calendarId ||
            generateUUID(),
            text,
            activityData[0].category,
            activityData[0].mobileCalendarId ||
            generateUUID(),
            false,
          ],
          (tx, results) => {
            console.log('Note data offline', results)
            setAdd(add + 1)
          },
          error => {
            console.log('error while Note company ' + error.message)
          },
        )
      })
  }

  const getNote = async () => {
    const id = route?.params?.activityId
      ? route?.params?.activityId
      : route?.params?.mobileActivityId
    await db.transaction(txn => {
      txn.executeSql(
        'SELECT * FROM note_info where refId=?',
        [id],
        (txn, res) => {
          let results = []
          let len = res.rows.length
          console.log('len', len)
          if (len > 0) {
            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              results.push(item)
            }
            setNoteData(results)
          }
        },
        error => {
          console.log('error while INSERTING note' + error.message)
        },
      )
    })
  }

  console.log(noteData, 'notedataaaaaaaaaa')
  useEffect(() => {
    getNote()
  }, [add, isFocused])

  useEffect(() => {
    const sortedArr = noteData?.sort((a, b) =>
      a.createDate.localeCompare(b.createDate),
    )
    const seenDates = {}
    const modifiedArr = sortedArr.reduce((acc, obj) => {
      const date = obj.createDate?.slice(0, 10)
      if (date !== null) {
        if (date in seenDates) {
          obj.matchedCreateDate = null
        } else {
          seenDates[date] = true
          obj.matchedCreateDate = obj.createDate?.slice(0, 10)
        }
      }
      acc.push(obj)
      return acc
    }, [])
    setFormattedNoteData(modifiedArr)
  }, [noteData])

  const ownerName = findUserByUsername(
    activityData[0]?.owner || 'admin_crm@trisysit.com',
  )
  console.log(ownerName.name, 'ownerrrrrrrr')
  const getDealName = async () => {
    await db.transaction(txn => {
      txn.executeSql(
        'SELECT * FROM ALL_Deal where dealId=?',
        [activityData[0]?.dealId],
        (txn, res) => {
          let results = []
          let len = res.rows.length
          console.log('activity data with length', len)
          if (len > 0) {
            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              results.push(item)
            }
            setDealName(results)
          }
        },
        error => {
          console.log('error while INSERTING note' + error.message)
        },
      )
    })
  }

  console.log(dealName, 'dealnameeeeeeee')
  useEffect(() => {
    getDealName()
  }, [activityData])

  return (
    <>
      <ListWrapper>
        <Provider>
          {console.log('formattedNoteData', formattedNoteData)}
          {console.log('activity data with dealName', activityData, dealName)}
          <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
            <View
              style={{
                flex: 1,
              }}
            >
              <DetailSection
                title="Category"
                data={activityData[0]?.category || 'NA'}
                color={highlightedColor}
              />
              <DetailSection
                title="Priority"
                data={activityData[0]?.priority || "NA"} color={activityData[0]?.priority =='High' ? "red" :activityData[0]?.priority =='Medium'? "orange":"green"}
              />
              <DetailSection
                title="Owner"
                data={ownerName?.name}
                color={highlightedColor}
              />
            </View>
            <View style={{ flex: 1 }}>
              <DetailSection
                title="Date"
                data={activityData[0]?.startDate?.slice(0, 10) || 'NA '}
                color={highlightedColor}
              />
              <DetailSection
                title="Time"
                data={activityData[0]?.activityTime?.slice(0, 5)}
                color={highlightedColor}
              />
              <DetailSection
                title="Deal"
                data={dealName[0]?.dealName || 'NA'}
                color={highlightedColor}
              />
            </View>
          </View>

          <SafeAreaView style={{ flex: 1, display: 'flex' }}>
            <View
              style={{
                display: 'flex',
                height:
                  windowHeight -
                  (HEADER_BUTTON_HEIGHT + NOTE_INPUT_HEIGHT + 145),
              }}
            >
              <View
                style={{
                  flex: 1,
                  width: windowWidth,
                  alignItems: 'center',
                  height: '100%',
                  marginBottom: 10,
                }}
              >
                <View
                  style={{
                    width: '100%',
                    position: 'absolute',
                    bottom: 0,
                    height: '100%',
                  }}
                >
                  <FlatList
                    data={formattedNoteData}
                    renderItem={({ item }) => {
                      const ownerName = findUserByUsername(item?.owner)
                      const time = String(
                        new Date(Number(parseTimestampToIST(item?.createDate))),
                      ).slice(16, 21)
                      return (
                        <View
                          style={{
                            marginBottom: 0,
                            alignItems: 'center',
                          }}
                        >
                          {item?.matchedCreateDate && (
                            <View
                              style={{
                                // padding: 5,
                                height: 30,
                                width: 100,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#e8e8e8',
                                borderRadius: 20,
                                marginTop: 10,
                              }}
                            >
                              <Text style={{ fontSize: 14, fontWeight: '400' }}>
                                {/* {item.createDate.slice(0, 10)} */}
                                {item?.matchedCreateDate}
                              </Text>
                            </View>
                          )}
                          <View
                            style={{
                              marginTop: 10,
                              backgroundColor: 'white',
                              height: 'auto',
                              borderRadius: 15,
                              width: windowWidth - 30,
                              paddingHorizontal: 15,
                              paddingVertical: 5,
                            }}
                          >
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              }}
                            >
                              <Text
                                style={{
                                  color:  textColor ,
                                  marginVertical: 4,
                                  fontSize: 14,
                                }}
                              >
                                {ownerName?.name ? ownerName?.name : 'Admin'}
                              </Text>
                              {item?.refType == 'Call' ? (
                                <MaterialCommunityIcons
                                  name={'phone-outline'}
                                  color={textColor}
                                  solid
                                  size={20}
                                />
                              ) : item?.refType == 'Meeting' ? (
                                <MaterialCommunityIcons
                                  name={'account-multiple-check-outline'}
                                  color={textColor}
                                  solid
                                  size={20}
                                />
                              ) : item?.refType == 'Event' ? (
                                <MaterialCommunityIcons
                                  name={'calendar-clock-outline'}
                                  color={textColor}
                                  solid
                                  size={20}
                                />
                              ) : null}
                            </View>
                            <View>
                              <Text
                                style={{
                                  color: textColor ,
                                  fontSize: 14,
                                  marginBottom: 10,
                                }}
                              >
                                {item?.description}
                              </Text>
                            </View>
                            <View
                              style={{
                                right: 15,
                                position: 'absolute',
                                bottom: 5,
                              }}
                            >
                              <Text
                                style={{ color: textColor , fontSize: 12 }}
                              >
                                {time}
                              </Text>
                            </View>
                          </View>
                        </View>
                      )
                    }}
                  />
                </View>
              </View>
            </View>
            {/* {modalVisible && (
                            <AddDealActivity
                                navigation={navigation}
                                setModalVisible={setModalVisible}
                                modalVisible={modalVisible}
                                editActivityRoute={editActivityRoute}
                                setEditActivityRoute={setEditActivityRoute}
                                header={route?.params?.header}
                                contact={route?.params?.contact}
                            />
                        )} */}

            <View style={styles.bottomView}>
              <View>
                <TextInput
                  placeholder="Notes"
                  onChangeText={newText => setText(newText)}
                  marginLeft={10}
                  style={styles.textarea}
                  value={text}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  position: 'absolute',
                  right: 10,
                  justifyContent: 'center',
                }}
              >
                <TouchableOpacity onPress={() => callNotes()}>
                  <MaterialCommunityIcons
                    name={'send-circle'}
                    color={textColor}
                    solid
                    size={35}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>

          <MaterialSnackbar ref={snackbarRef} />
        </Provider>
      </ListWrapper>
    </>
  )
}
const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomView: {
    width: '100%',
    height: NOTE_INPUT_HEIGHT,
    backgroundColor: 'white',
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 0,
    borderTopColor: 'grey',
    borderTopWidth: 0.5,
  },
  textStyle: {
    color: '#fff',
    fontSize: 18,
  },
  textarea: {
    marginLeft: 10,
    width: windowWidth - 60,
  },
})

export default ContactActiDetail
