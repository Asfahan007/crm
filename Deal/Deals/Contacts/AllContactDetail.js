import React, { useContext, useRef, useEffect } from 'react'
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native'
import MaterialSnackbar from '../../../../MD/components/MaterialSnackbar'
import { useLayoutEffect } from 'react'
import { useState } from 'react'
import { openDatabase } from 'react-native-sqlite-storage'
import Icon from 'react-native-vector-icons/Ionicons'
import { useIsFocused } from '@react-navigation/native'
import NotesAllContact from './NotesAllContact'
import ActivityAllContact from './ActivityAllContact'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import HeaderNavbar from '../../../../Containers/CustomComponents/HeaderNavbar'
import ListWrapper from '../../../../Containers/CustomComponents/ListWrapper'
import { listCardContainer } from '../../../../Containers/CustomComponents/Style'
import {
  appColor,
  linkedDataColor,
  textColor,
} from '../../../../Containers/CustomComponents/Image'
import { findUserByUsername } from '@/Containers/CustomComponents/UsernameTable'
import { store } from '@/Store'
import { BackHandler } from 'react-native'

const db = openDatabase({
  name: 'customer_database',
})

function AllContactDetail({ navigation, route }) {
  const isFocused = useIsFocused()
  const snackbarRef = useRef(null)
  const [activeTab, setActiveTab] = useState('Details')
  const [show, setShow] = useState('Details')
  const [listData, setListData] = useState([])
  const [allContact, setAllContact] = useState([])
  const [contactDetail, setContactDetail] = useState([])
  const [contactAssociatedAcount, setContactAssociatedAccount] = useState([])
  const userName = findUserByUsername(contactDetail[0]?.contactOwner)
  const [deal_Contact, setDeal_Contact] = useState([])
  const [reRender, setRerender] = useState(0)
  const [associatedDealName, setAssociatedDealName] = useState([])

  console.log('contact route', route)

  const removeAssociatedDeal = data => {
    Alert.alert(
      'Please Confirm!',
      'Do you really want to remove this Contact?',
      [
        { text: 'Yes', onPress: () => removeDeal(data) },
        { text: 'No', onPress: () => console.log('Cancel Pressed!') },
      ],
      { cancelable: false },
    )
  }

  function handleBackButtonClick() {
    navigation.navigate("Contact List")
    return true;
  }

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
    };
  }, []);
  const removeDeal = data => {
    console.log(data?.dealContactId, 'ddddddddddddd')
    console.log(
      `https://apps.trisysit.com/posbackendapi/api/syncDeal/deleteContact/${data?.dealContactId}`,
      'jjjjjjjjjjjjj',
    )
    store.getState().online.isOnline
      ? fetch(
        `https://apps.trisysit.com/posbackendapi/api/syncDeal/deleteContact/${data?.dealContactId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer' + store.getState().auth.token,
          },
        },
      )
        .then(response => {
          console.log('responseeeee', response?.status)
          if (response?.status == 200) {
            db.transaction(tx => {
              tx.executeSql(
                'delete from deal_contact WHERE dealContactId=?',
                [data?.dealContactId],
                (tx, results) => {
                  setRerender(reRender + 1)
                  // if (results.rowsAffected > 0) {
                  console.log('delete deal_contact', results)
                  // }
                },
                error => {
                  console.log('error while updating ' + error.message)
                },
              )
            })
          } else {
            Alert.alert(
              'Error',
              'Network error',
              [
                {
                  text: 'Ok',
                },
              ],
              { cancelable: false },
            )
          }
        })
        .catch(error => console.log('errorrr', console.log(error)))
      : console.log('dataaaaaaaaaa', data)
    db.transaction(tx => {
      data?.dealContactId
        ? tx.executeSql(
          'UPDATE deal_contact SET isOnline=? WHERE dealContactId=?',
          [false, data?.dealContactId],
          (tx, results) => {
            console.log('associate  dealContact made offline', results)
          },
        )
        : tx.executeSql(
          'delete from deal_contact WHERE mobileDealContactId=?',
          [data?.mobileDealContactId],
          (tx, results) => {
            console.log('associate contact deleted', results)
            setOpenMenuId(null)
            setShowHamberger(!showHamberger)
          },
          error => {
            console.log('error while updating ' + error.message)
          },
        )
    })
  }

  // const getDeal_Contact = () => {
  //   db.transaction(txn => {
  //     route?.params?.contactId?
  //     txn.executeSql(
  //       'select * from deal_contact where contactId =? and isOnline="1"',
  //       [route?.params?.contactId],
  //       (tx, res) => {
  //         let results = []
  //         let len = res.rows.length
  //         if (len > 0) {
  //           for (let i = 0; i < len; i++) {
  //             let item = res.rows.item(i)
  //             results.push(item)
  //           }
  //         }
  //         setDeal_Contact(results)
  //       },
  //       error => {
  //         console.log('error', error)
  //       },
  //     ):
  //     txn.executeSql(
  //       'SELECT * from deal_contact where mobileContactId= ?',
  //       [route?.params?.mobileContactId],
  //       (txn, res) => {
  //         const results = Array.from({ length: res.rows.length }, (_, i) =>
  //           res.rows.item(i),
  //         )
  //         setDeal_Contact(results)
  //       },
  //       error => {
  //         console.log('error', error)
  //       },
  //     )

  //   })
  // }
  // console.log('deals in contact', deal_Contact)

  const getAssociatedDealData = () => {
    let query = 'select * from deal_contact where '
    let condition = route?.params?.contactId ? 'contactId =?' : 'mobileContactId= ?'
    let data = route?.params?.contactId || route?.params?.mobileContactId
    db.transaction(txn => {
      txn.executeSql(
        query + condition,
        [data],
        (tx, res) => {
          const results = Array.from({ length: res.rows.length }, (_, i) =>
            res.rows.item(i),
          )
          console.log("result of getAssociatedDealData", results, route?.params?.contactId, route?.params?.mobileContactId)
          setAssociatedDealName(results)
        },
        error => {
          console.log('error while GETTING' + error.message)
        },
      )
    })
  }
  console.log('deals in account', associatedDealName)

  const getContactsData = async () => {
    await db.transaction(txn => {
      txn.executeSql(
        'SELECT * from contacts where contactId = ? or mobileContactId=?',
        [route?.params?.contactId, route?.params?.mobileContactId],
        (tx, res) => {
          const results = Array.from({ length: res.rows.length }, (_, i) =>
            res.rows.item(i),
          )
          setContactDetail(results)
        },
        error => {
          console.log('error while GETTING', error.message)
        },
      )
    })
  }
  console.log('first', contactDetail)

  const getAssociatedContactsData = async () => {
    await db.transaction(txn => {
      txn.executeSql(
        'SELECT * from account where accountId = ? or mobileAccountId=?',
        [contactDetail[0]?.accountId, contactDetail[0]?.mobileAccountId],
        (tx, res) => {
          const results = Array.from({ length: res.rows.length }, (_, i) =>
            res.rows.item(i),
          )
          setContactAssociatedAccount(results)
        },
        error => {
          console.log(
            'error SELECT * from contacts where accountId = ? or mobileAccountId',
            error.message,
          )
        },
      )
    })
  }

  useEffect(() => {
    getAssociatedContactsData()
  }, [contactDetail])

  useEffect(() => {
    getAssociatedDealData()
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions({
      // headerLeft: () => (
      //   <TouchableOpacity onPress={() => navigation.navigate('AllContact')}>
      //     <View style={{ marginHorizontal: 10 }}>
      //       <Icon name="arrow-back" size={25} color="#fff" />
      //     </View>
      //   </TouchableOpacity>
      // ),
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          {activeTab === 'Details' ? (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Add All Contacts', {
                  contactData: contactDetail,
                  accountData: contactAssociatedAcount,
                })
              }
            >
              <View style={{ alignSelf: 'flex-end', marginRight: 10 }}>
                <Icon name={'create-outline'} color="#fff" solid size={25} />
              </View>
            </TouchableOpacity>
          ) : null}
        </View>
      ),
      title: <Text>{contactDetail[0]?.contactName}</Text>,
    })
  }, [navigation, activeTab, contactAssociatedAcount, contactDetail])

  const getAccount = async () => {
    await db.transaction(tx => {
      tx.executeSql('SELECT * FROM account', [], (tx, results) => {
        var temp = []
        for (let i = 0; i < results.rows.length; ++i) {
          let item = results.rows.item(i)
          //   console.log("item",item);
          temp.push({
            email: item.email,
            state: item.state,
            addressLine2: item.addressLine1,
            addressLine1: item.addressLine2,
            pinCode: item.pinCode,
            accountStatus: item.accountStatus,
            country: item.country,
            website: item.website,
            item: item.accountName,
            city: item.city,
            accountType: item.accountType,
            accountDescription: item.accountDescription,
            accountId: item.accountId,
            accountName: item.accountName,
          })
        }
        setListData(temp)
      })
    })
  }

  const getDeal = async () => {
    await db.transaction(txn => {
      txn.executeSql(
        'SELECT * from All_Deal',
        [],
        (tx, res) => {
          let len = res.rows.length
          if (len > 0) {
            let results = []
            let filterResult
            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              //   console.log("deal details",JSON.parse(item.dealContact));
              results.push(JSON.parse(item.dealContact))
            }
            filterResult = results.filter(e => e.length > 0)
            setAllContact(filterResult)
          }
        },
        error => {
          console.log('error while GETTING +', error.message)
        },
      )
    })
  }

  useEffect(() => {
    getAccount()
    getDeal()
    getContactsData()
    // getDeal_Contact()
  }, [reRender, isFocused])

  const PairList = props => {
    return (
      <View style={{ marginVertical: 2.5 }}>
        <View>
          <Text style={{ fontSize: 16, color: textColor, fontWeight: 'bold' }}>
            {props.first}
          </Text>
        </View>
        <View>
          <Text style={{ fontSize: 16, color: textColor }}>{props.second}</Text>
        </View>
      </View>
    )
  }

  return (
    <ListWrapper>
      {console.log('globalDealContact', contactDetail)}
      <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
        <HeaderNavbar
          text="Details"
          btnColor="#00b8ce"
          textColor="white"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          navigation={navigation}
          setShow={setShow}
        />
        <HeaderNavbar
          text="Notes"
          btnColor="white"
          textColor={textColor}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          navigation={navigation}
          setShow={setShow}
        />
        <HeaderNavbar
          text="Activities"
          btnColor="white"
          textColor={textColor}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          navigation={navigation}
          setShow={setShow}
        />
      </View>
      {show === 'Details' ? (
        <ScrollView>
          <View style={{ alignItems: 'center' }}>
            <View style={listCardContainer}>
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <View style={{ flex: 0.7 }}>
                  <PairList
                    first={'Job Title'}
                    second={contactDetail[0]?.jobTitle}
                  />
                  <PairList first={'Email'} second={contactDetail[0]?.email} />
                  <PairList
                    first={'Owner'}
                    second={
                      // contactOwner || contactDetail[0]?.contactOwner
                      userName?.name || 'NA'
                    }
                  />
                </View>
                <View style={{ flex: 0.4 }}>
                  <PairList
                    first={'Mobile No'}
                    second={contactDetail[0]?.phoneNo}
                  />
                </View>
              </View>
            </View>

            <View
              style={[
                listCardContainer,
                {
                  marginLeft: 0,
                  marginRight: 0,
                  padding: 0,
                },
              ]}
            >
              <View
                style={{
                  borderBottomColor: 'gray',
                }}
              >
                {associatedDealName.length > 0 ? (
                  <>
                    <View
                      style={{
                        borderBottomWidth: 0.7,
                        borderColor: 'grey',
                        padding: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          color: textColor,
                          lineHeight: 20,
                          fontWeight: 'bold',
                        }}
                      >
                        Deals
                      </Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: 'white',
                        paddingHorizontal: 10,
                      }}
                    >
                      {associatedDealName.map((data, id) => {
                        return (
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              // borderBottomWidth: id > dealName?.length - 2 ? 0 : 0.5,
                              borderBottomWidth: 0.5,
                              borderBottomColor: 'grey',
                              paddingVertical: 10,
                            }}
                          >
                            <View>
                              <TouchableOpacity
                                onPress={() =>
                                  navigation.navigate('Deal Detail', {
                                    dealId: data?.dealId,
                                    mobileDealId: data?.mobileDealId,
                                  })
                                }
                              >
                                <Text
                                  style={{
                                    fontSize: 16,
                                    color: linkedDataColor,
                                    fontWeight: 'bold',
                                  }}
                                >
                                  {data?.dealName}
                                </Text>
                              </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                              onPress={() => removeAssociatedDeal(data)}
                            >
                              <View style={{ alignSelf: 'flex-start' }}>
                                <MaterialCommunityIcons
                                  name={'delete-outline'}
                                  color={appColor}
                                  solid
                                  size={22}
                                />
                              </View>
                            </TouchableOpacity>
                          </View>
                        )
                      })}
                    </View>
                  </>
                ) : (
                  <Text style={{ fontSize: 16, color: textColor, padding: 10 }}>
                    No Deals added
                  </Text>
                )}
              </View>
            </View>

            <View
              style={[
                listCardContainer,
                {
                  marginLeft: 0,
                  marginRight: 0,
                  padding: 0,
                },
              ]}
            >
              <View
                style={{
                  borderBottomColor: 'gray',
                }}
              >
                {contactAssociatedAcount?.length > 0 ? (
                  <>
                    <View
                      style={{
                        borderBottomWidth: 0.7,
                        borderColor: 'grey',
                        padding: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          color: textColor,
                          lineHeight: 20,
                          fontWeight: 'bold',
                        }}
                      >
                        Account
                      </Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: 'white',
                        paddingHorizontal: 10,
                      }}
                    >
                      {contactAssociatedAcount?.map((data, id) => {
                        return (
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              // borderBottomWidth: id > accountData?.length - 2 ? 0 : 0.5,
                              borderBottomWidth: 0.5,
                              borderBottomColor: 'grey',
                              paddingVertical: 10,
                            }}
                          >
                            <View>
                              <TouchableOpacity
                                onPress={() =>
                                  navigation.navigate('Account Detail', {
                                    accountId: data.accountId,
                                    mobileAccountId: data.mobileAccountId,
                                  })
                                }
                              >
                                <Text
                                  style={{
                                    fontSize: 16,
                                    color: linkedDataColor,
                                    fontWeight: 'bold',
                                  }}
                                >
                                  {data?.accountName}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        )
                      })}
                    </View>
                  </>
                ) : (
                  <Text style={{ fontSize: 16, color: textColor, padding: 10 }}>
                    No Account added
                  </Text>
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      ) : show === 'Notes' ? (
        <NotesAllContact
          navigation={navigation}
          route={contactDetail[0]}
          dealName={associatedDealName}
        />
      ) : show === 'Activities' ? (
        <ActivityAllContact navigation={navigation} header={contactDetail[0]} />
      ) : (
        <MyComponent datas={route.params} />
      )}

      {/* {show === "Notes" ? <NotesAllContact header={route.params}/> : null}
                {show === "Activities" ? <ActivityAllContact navigation={navigation} /> : null} */}
      <MaterialSnackbar ref={snackbarRef} />
    </ListWrapper>
  )
}

export default AllContactDetail
