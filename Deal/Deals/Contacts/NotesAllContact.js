import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native'
import React, { useEffect } from 'react'
import parseTimestampToIST from '@/Containers/CustomComponents/UTCtoIST'
import Icon from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Dimensions } from 'react-native'
import { useState } from 'react'
import { openDatabase } from 'react-native-sqlite-storage'
import {
  NOTE_INPUT_HEIGHT,
  HEADER_BUTTON_HEIGHT,
} from '../../../../Constants/Constants'
import DeviceInfo from 'react-native-device-info'
import { store } from '../../../../Store'
import generateUUID from '@/Containers/CustomComponents/GetUUID'
import { findMatchedActivity, findMatchedNote } from '@/Containers/CustomComponents/GetTable'

import { textColor, highlightedColor } from '../../../../Containers/CustomComponents/Image'
// import { textColor } from '../../../../Containers/CustomComponents/Image';
import { Item } from 'react-native-paper/lib/typescript/components/Drawer/Drawer'
import { findUserByUsername } from '@/Containers/CustomComponents/UsernameTable'
const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width

const db = openDatabase({
  name: 'customer_database',
})

const NotesAllContact = ({ navigation, route }) => {
  console.log('Notes All Contact routee', route)
  const [text, setText] = useState('')
  const [add, setAdd] = useState(0)
  const [noteData, setNoteData] = useState([])
  const [count, setCount] = useState(0)
  const [activityId, setActivityId] = useState([])
  const [activityData, setActivityData] = useState([])
  const [formattedNoteData, setFormattedNoteData] = useState([])

  const showBill = () => {
    if (text != '') {
      AddNote()
      setText('')
    }
  }

  const AddNote = () => {
    console.log("payload", [
      {
        noteId: '',
        name: store.getState().auth.firstName,
        owner: store.getState().auth.profile.name,
        status: '',
        createDate: '',
        createdBy: '',
        updateDate: '',
        updatedBy: store.getState().auth.firstName || '',
        refId: route?.contactId,
        mobileRefId: route?.mobileContactId,
        refType: 'contact',
        description: text,
        companyId: route?.companyId,
      },
    ])
    store.getState().online.isOnline ?
      fetch(`https://apps.trisysit.com/posbackendapi/api/syncNote/saveNotes/1`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer' + store.getState().auth.token,
        },
        body: JSON.stringify([
          {
            noteId: '',
            name: store.getState().auth.firstName,
            owner: store.getState().auth.profile.name,
            status: '',
            createDate: '',
            createdBy: '',
            updateDate: '',
            updatedBy: store.getState().auth.firstName || '',
            refId: route?.contactId,
            mobileRefId: route?.mobileContactId,
            refType: 'contact',
            description: text,
            companyId: route?.companyId,
          },
        ]),
      })
        .then(response => response.json())
        .then(result => {
          console.log('response of shipment', result)
          result.data?.forEach(i => {
            db.transaction(tx => {
              tx.executeSql(
                'INSERT OR REPLACE INTO note_info (mobileNoteId,noteId,companyId,name,owner,status,createDate,createdBy ,updateDate ,updatedBy,refId,mobileRefId,description,refType,isOnline) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
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
                  true
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
      : db.transaction(txn => {
        txn.executeSql(
          'INSERT INTO note_info (mobileNoteId,companyId,name,owner,status,createDate,createdBy ,updateDate ,updatedBy,description,refType,refId,mobileRefId,isOnline) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
          [
            generateUUID(),
            route?.companyId,
            findUserByUsername(store.getState().auth.profile.name)?.name,
            store.getState().auth.profile.name,
            "ACTIVE",
            (new Date(Date.UTC((new Date()).getUTCFullYear(), (new Date()).getUTCMonth(),
              (new Date()).getUTCDate(), (new Date()).getUTCHours(),
              (new Date()).getUTCMinutes(), (new Date()).getUTCSeconds()))).toISOString(),
            store.getState().auth.profile.name,
            (new Date(Date.UTC((new Date()).getUTCFullYear(), (new Date()).getUTCMonth(),
              (new Date()).getUTCDate(), (new Date()).getUTCHours(),
              (new Date()).getUTCMinutes(), (new Date()).getUTCSeconds()))).toISOString(),
            store.getState().auth.profile.name,
            text,
            "Deal",
            route?.contactId || "",
            route?.mobileContactId || "",
            false
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
    const matchedNote = await findMatchedNote(route?.contactId, route?.mobileContactId)
    setNoteData(matchedNote)
  }

  const getActivityId = async () => {
    const matchedActivityId = await findMatchedActivity(route?.contactId, route?.mobileContactId)
    setActivityId(matchedActivityId)
  }

  const getActivityNote = async () => {
    try {
      let noteFromActivity = []
      await Promise.all(
        activityId?.map(v =>
          new Promise((resolve, reject) => {
            db.transaction(txn => {
              txn.executeSql(
                'SELECT * FROM note_info where refId=?',
                [v?.calendarId],
                (txn, res) => {
                  let len = res.rows.length
                  console.log('len', len)
                  if (len > 0) {
                    for (let i = 0; i < len; i++) {
                      let item = res.rows.item(i)
                      noteFromActivity.push(item)
                    }
                  }
                  resolve()
                },
                error => reject('error while INSERTING note' + error.message),
              )
            })
          })
        )
      )
      setActivityData(noteFromActivity)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getNote();
    getActivityId()
  }, [add])

  useEffect(() => {
    getActivityNote()
  }, [activityId])

  useEffect(() => {
    let combinedData = [...noteData, ...activityData]
    const sortedArr = combinedData?.sort((a, b) => a.createDate.localeCompare(b.createDate),)
    const seenDates = {}
    const modifiedArr = sortedArr.reduce((acc, obj) => {
      const date = obj.createDate?.slice(0, 10);
      if (date !== null) {
        if (date in seenDates) {
          obj.matchedCreateDate = null;
        } else {
          seenDates[date] = true;
          obj.matchedCreateDate = obj.createDate?.slice(0, 10);
        }
      }
      acc.push(obj);
      return acc;
    }, []);
    setFormattedNoteData(modifiedArr)
  }, [activityData])

  // const getContacts = async () => {
  //   await db.transaction(txn => {
  //     let results = []
  //     {
  //       dealName.forEach(e => {
  //         txn.executeSql(
  //           'SELECT * FROM note_info  where refId=?',
  //           [e?.deal_id],
  //           (txn, res) => {
  //             let len = res.rows.length
  //             if (len > 0) {
  //               for (let i = 0; i < len; i++) {
  //                 let item = res.rows.item(i)
  //                 console.log(item)
  //                 results.push(item)
  //                 // results.push({
  //                 //   ...item,
  //                 //   createDate: new Date(Number(item.createDate)).toLocaleDateString(),
  //                 //   time: new Date(Number(item.createDate)).toLocaleTimeString().slice(0, 5)
  //                 // })
  //               }
  //               setNoteData(results)
  //             }
  //           },
  //           error => {
  //             console.log('error while GETTING', error.message)
  //           },
  //         )
  //       })
  //     }
  //     txn.executeSql(
  //       'SELECT * FROM note_info  where refId=?',
  //       [route?.params?.contactId],
  //       (txn, res) => {
  //         let len = res.rows.length
  //         if (len > 0) {
  //           for (let i = 0; i < len; i++) {
  //             let item = res.rows.item(i)
  //             console.log('note-Item', item)
  //             results.push(item)
  //             {
  //               console.log('notesInContact', results)
  //             }
  //           }
  //           setNoteData(results)
  //         }
  //       },
  //       error => {
  //         console.log('error while GETTING', error.message)
  //       },
  //     )
  //   })
  // }

  // let previousDate = ''

  // useEffect(() => {
  //   const result = noteData?.filter(item => {
  //     let match = false;
  //     item?.contactId?.forEach(contact => {
  //       if (contact?.contactId === route?.params?.contactId) {
  //         match = true;
  //         return;
  //       }
  //     });
  //     return match;
  //   });
  //   setNoteFilterData(result)
  // }, [noteData])

  // useEffect(() => {
  // createContactNotesTable();
  // if (count < 3) {
  // setCount(count + 1)
  // }
  // getContacts()
  // }, [add])

  return (
    <SafeAreaView style={{ flex: 1, display: 'flex' }}>
      {console.log('notefilterData', formattedNoteData)}
      <View
        style={{
          display: 'flex',
          height:
            windowHeight - (HEADER_BUTTON_HEIGHT + NOTE_INPUT_HEIGHT + 120),
        }}
      >
        <View
          style={{
            flex: 1,
            width: windowWidth,
            alignItems: 'center',
            height: '100%',
            // position: 'relative',
            marginBottom: 10
          }}
        >
          <View
            style={{
              width: '100%',
              position: 'absolute',
              // bottom: 0,
              height: '100%',
            }}
          >
            <FlatList
              // inverted={true}
              // invertStickyHeaders={true}
              data={formattedNoteData}
              // style={{ transform: [{ scaleY: -1 }] }}
              renderItem={({ item }) => {
                // console.log("jjj",item)
                const ownerName = findUserByUsername(item?.owner)
                const time = String(new Date((Number(parseTimestampToIST(item?.createDate))))).slice(16, 21)
                const activityTitle = activityId?.filter(v => v.calendarId === item?.refId)
                console.log("created date in contact notes", item?.createDate, time)
                // if (item?.createDate?.slice(0, 10) !== previousDate) {
                //   previousDate = item?.createDate?.slice(0, 10);
                //   console.log("issue", item.createDate)
                return (
                  <View
                    style={{
                      marginBottom: 0,
                      alignItems: 'center',
                    }}
                  >
                    {item?.matchedCreateDate &&
                      <View
                        style={{
                          // padding: 5,
                          height: 30,
                          width: 100,
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#e8e8e8',
                          borderRadius: 20,
                          marginTop: 10
                        }}
                      >
                        <Text style={{ fontSize: 14, fontWeight: '400' }}>
                          {/* {item.createDate.slice(0, 10)} */}
                          {item?.matchedCreateDate}
                        </Text>
                      </View>
                    }
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
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row' }}>
                          <Text
                            style={{
                              color: textColor,
                              marginVertical: 4,
                              fontSize: 14,
                              fontWeight: '400'
                            }}
                          >
                            {ownerName?.name || "Admin"}
                          </Text>
                          <TouchableOpacity onPress={
                            () => navigation.navigate("Contact Activity Detail", { activityId: activityTitle[0]?.calendarId })
                          }>
                            <Text
                              style={{
                                color: highlightedColor,
                                marginVertical: 4,
                                fontSize: 14,
                                marginLeft: 10
                              }}
                            >
                              {activityTitle[0]?.title || ""}
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          {item?.refType == "Call" ?
                            <MaterialCommunityIcons
                              name={'phone-outline'}
                              color={textColor}
                              solid
                              size={20}
                            /> : item?.refType == "Meeting" ?
                              <MaterialCommunityIcons
                                name={'account-multiple-check-outline'}
                                color={textColor}
                                solid
                                size={20}
                              /> : item?.refType == "Event" ? <MaterialCommunityIcons
                                name={'calendar-clock-outline'}
                                color={textColor}
                                solid
                                size={20}
                              /> : null}

                          <Text
                            style={{
                              color: activityTitle[0]?.priority == "High" ? "red" : activityTitle[0]?.priority == "Low" ? "green" : activityTitle[0]?.priority == "Medium" ? "orange" : null,
                              fontSize: 14,
                              marginLeft: 10,
                              fontWeight: '500'
                            }}
                          >
                            {activityTitle[0]?.priority == "High" ? "H" : activityTitle[0]?.priority == "Low" ? "L" : activityTitle[0]?.priority == "Medium" ? "M" : null}
                          </Text>
                        </View>
                      </View>
                      <View>
                        <Text
                          style={{
                            color: { textColor },
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
                        <Text style={{ color: { textColor }, fontSize: 12 }}>
                          {/* {item.time} */}
                          {/* {item.createDate.slice(11, 16)} */}
                          {time}
                        </Text>
                      </View>
                    </View>
                  </View>
                )
                // } 

              }}
            />
          </View>
        </View>
      </View>

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
          {/* <View style={{ marginHorizontal: 5 }}>
                        <Icon name={'attach'} color="grey" solid size={20} />
                    </View>
                    <View style={{ marginHorizontal: 5 }}>
                        <Icon name={'camera-outline'} color="grey" solid size={20} />
                    </View> */}
          <TouchableOpacity onPress={() => showBill()}>
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
export default NotesAllContact
