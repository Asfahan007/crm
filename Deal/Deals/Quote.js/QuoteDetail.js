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
} from 'react-native'
import MaterialSnackbar from '../../../../MD/components/MaterialSnackbar'
import { useLayoutEffect } from 'react'
import { useState } from 'react'
import { openDatabase } from 'react-native-sqlite-storage'
import Icon from 'react-native-vector-icons/Ionicons'
import Notes from '../Deals/Notes'
import { BackHandler } from 'react-native'
import QuoteAttachments from './QuoteAttachments'
import PullOverEditQuote from './PullOverEditQuote'
import {
  noDataColor,
  textColor,
} from '../../../../Containers/CustomComponents/Image'
import { findUserByUsername } from '@/Containers/CustomComponents/UsernameTable'
import { acc } from 'react-native-reanimated'
import { Directions } from 'react-native-gesture-handler'
const db = openDatabase({
  name: 'customer_database',
})

function QuoteDetail({ navigation, route }) {
  const snackbarRef = useRef(null)
  const [activeTab, setActiveTab] = useState('Details')
  const [show, setShow] = useState('Details')
  const [showEdit, setShowEdit] = useState(false)
  const [accountName, setAccountName] = useState('')
  const [quotationRouteData, setQuotationRouteData] = useState([])
  const [dealIdfromName, setDealIdfromName] = useState([])
  const [reRender, setRerender] = useState(0)

  console.log('routeeeeeeeee quoteeee', route)

  // const quotationItem = JSON.parse(route?.params.quotationItem)

  const quotationItem = []

  const userName = findUserByUsername(quotationRouteData[0]?.owner)

  const [contactName, setContactName] = useState('')
  console.log(contactName, 'contactName')
  function handleBackButtonClick() {
    navigation.navigate('Quote')
    return true
  }

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     // headerLeft: () => (
  //     //   <TouchableOpacity onPress={() => navigation.navigate('Quote')}>
  //     //     <View style={{ marginHorizontal: 10 }}>
  //     //       <Icon name="arrow-back" size={25} color="#fff" />
  //     //     </View>
  //     //   </TouchableOpacity>
  //     // ),
  //     headerRight: () => (
  //       <View style={{ flexDirection: 'row' }}>
  //         {/* <View style={{ alignSelf: 'flex-end', marginRight: 10 }}>
  //           <Icon name={'md-search-outline'} color="#fff" solid size={20} />
  //         </View>  */}
  //         {/* {quotationRouteData.stage === 'Draft' && ( */}
  //         {console.log(quotationRouteData, 'tyuiotyuiozz')}
  //         <TouchableOpacity
  //           onPress={() =>
  //             navigation.navigate('Add Quote', quotationRouteData[0])
  //           }
  //         >
  //           <View style={{ alignSelf: 'flex-end', marginRight: 10 }}>
  //             <Icon name={'create-outline'} color="#fff" solid size={25} />
  //           </View>
  //         </TouchableOpacity>
  //         {/* )} */}
  //         {/* <View style={{ alignSelf: 'flex-end', marginRight: 10 }}>
  //           <Icon
  //             name={'md-ellipsis-vertical-outline'}
  //             color="#fff"
  //             solid
  //             size={20}
  //           />
  //         </View>  */}
  //       </View>
  //     ),
  //     title: <Text>{quotationRouteData[0]?.title}</Text>,
  //   })
  // }, [showEdit, quotationRouteData])
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.navigate('Quote')}>
                <View style={{ marginHorizontal: 10 }}>
                  <Icon name="arrow-back" size={25} color="#fff" />
                </View>
              </TouchableOpacity>
      ),
      headerShown: true,
      title: (
        <View>
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: 17,
              fontWeight: '600',
            }}
          >
          {quotationRouteData[0]?.title}
          </Text>
          <Text
            style={{
              color: '#FFFFFF',
            }}
          >
          {quotationRouteData[0]?.quotationNo|| 'NA'}
          </Text>
        </View>
      ),
    })
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Add Quote', quotationRouteData[0])}
          >
            <View style={{ alignSelf: 'flex-end', marginRight: 10 }}>
                  <Icon name={'create-outline'} color="#fff" solid size={25} />
                </View>
          </TouchableOpacity>
        </View>
      ),
    })
  }, [navigation, showEdit, quotationRouteData])

  const getQuotationInfo = async () => {
    await db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM quotation WHERE quotationId=? or mobileQuotationId=? ',
        [route?.params?.quotationId, route?.params?.mobileQuotationId],
        (tx, res) => {
          const results = Array.from({ length: res.rows.length }, (_, i) =>
            res.rows.item(i),
          )
          setQuotationRouteData(results)
        },
        error => {
          console.log(
            'error select * from quotation WHERE quotationId=? or mobileQuotationId=?' +
              error.message,
          )
        },
      )
    })
  }
  console.log('qqqqqqqqqq', quotationRouteData)
  const getDealIdfromDealName = async () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM All_Deal where dealName=?',
        [quotationRouteData[0]?.dealName],
        (tx, res) => {
          // var temp1 = []
          // for (let i = 0; i < results.rows.length; ++i) {
          //   temp1.push(results.rows.item(i))
          // }
          //          setDealIdfromName(temp1)
          const results = Array.from({ length: res.rows.length }, (_, i) =>
            res.rows.item(i),
          )
          setDealIdfromName(results)
        },
      )
    })
  }
  console.log('sdvjhdcuiwdincc', dealIdfromName)

  console.log('euyvgdcuwevdbchwbdc', quotationRouteData)
  const getContactInfo = async () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM contacts where contactId=? or mobileContactId=?',
        [
          quotationRouteData[0].contactId,
          quotationRouteData[0].mobileContactId,
        ],
        (tx, res) => {
          //   console.log(results, 'contactssss')
          //ORDER BY id DESC
          // var temp1 = []
          // for (let i = 0; i < results.rows.length; ++i) {
          //   temp1.push(results.rows.item(i))
          const results = Array.from({ length: res.rows.length }, (_, i) =>
            res.rows.item(i),
          )
          setContactName(results)
        },
        // let obj = ''
        // obj = temp1[0].firstName + ' ' + temp1[0].lastName

        // setContactName(temp1)
        // setContactData(temp1)
        // let temp = []
        // temp1?.map((item, index) => {
        //   if (item?.firstName != '') {
        //     temp.push({
        //       id: index,
        //       item: item.firstName,
        //       contactId: item.contactId,
        //     })
        //   }
        // })
        // setFilteredContact(temp)
      )
    })
  }
  console.log('edhewuydqbdjwndwd', contactName)
  const getAccount = async () => {
    console.log(quotationRouteData, 'hi')
    await db.transaction(txn => {
      txn.executeSql(
        'SELECT * FROM account WHERE accountName =?',
        [quotationRouteData[0].accountName],
        (tx, res) => {
          let len = res.rows.length
          if (len > 0) {
            let results = []
            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              results.push(item)
            }
            console.log('ssssssssssss', results)
            setAccountName(results)
          }
        },
        error => {
          console.log('error', error)
        },
      )
    })
  }

  console.log('hdfhkdsfdf', accountName)
  useEffect(() => {
    getQuotationInfo()
    setRerender(reRender + 1)
  }, [navigation])

  useEffect(() => {
    getContactInfo()
    getDealIdfromDealName()
    // getAccount()
  }, [quotationRouteData, reRender])

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick)
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      )
    }
  }, [])

  // let paymentList = JSON.parse(quotationRouteData?.paymentList)
  return (
    <View style={{ flex: 1, backgroundColor: '#f1f5f7' }}>
      {console.log('xxxxxxxxxpppppppppp', quotationRouteData)}
      {/* <View style={{ flexDirection: 'row', alignSelf: 'center', }}>
                <HeaderButton text='Details' btnColor='#00b8ce' textColor='white'
                    activeTab={activeTab} setActiveTab={setActiveTab} navigation={navigation} setShow={setShow} />
                <HeaderButton text='Attachments' btnColor='white' textColor='black'
                    activeTab={activeTab} setActiveTab={setActiveTab} navigation={navigation} setShow={setShow} />
            </View>

            {show === "Details" ?
                <> */}
      {/* {showEdit && (
        <View
          style={{
            zIndex: 1,
            position: 'absolute',
            width: '100%',
            bottom: -10,
          }}
        >
          <PullOverEditQuote navigation={navigation} quotationRouteData={quotationRouteData} />
        </View>
      )} */}
      <ScrollView>
        <View style={styles.card}>
          {/* <View style={{ marginBottom: 10 }}>
            <Text
              style={{
                fontSize: 16,
                color: { textColor },
                lineHeight: 20,
                marginBottom: 0,
                fontWeight: 'bold',
              }}
            >
              Deal
            </Text>
            <TouchableOpacity
              onPress={() =>
                // console.log(quotationRouteData,"jjj")
                navigation.navigate('Deal Detail', {
                  dealId: dealIdfromName[0]?.dealId,
                  mobileDealId: dealIdfromName[0]?.mobileDealId,
                })
              }
            >
              <Text
                style={{
                  fontSize: 16,
                  color: { textColor },
                  marginBottom: 1,
                  width: '100%',
                }}
              >
                {quotationRouteData[0]?.dealName || 'NA'}
              </Text>
            </TouchableOpacity>
          </View> */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              display: 'flex',
            }}
          >
            <View style={{ marginBottom: 10 }}>
            <Text
              style={{
                fontSize: 16,
                color: { textColor },
                lineHeight: 20,
                marginBottom: 0,
                fontWeight: 'bold',
              }}
            >
              Deal
            </Text>
            <TouchableOpacity
              onPress={() =>
                // console.log(quotationRouteData,"jjj")
                navigation.navigate('Deal Detail', {
                  dealId: dealIdfromName[0]?.dealId,
                  mobileDealId: dealIdfromName[0]?.mobileDealId,
                })
              }
            >
              <Text
                style={{
                  fontSize: 16,
                  color: { textColor },
                  marginBottom: 1,
                  width: '100%',
                }}
              >
                {quotationRouteData[0]?.dealName || 'NA'}
              </Text>
            </TouchableOpacity>
          </View>
            <View style={{ marginBottom: 10 }}>
                <View style={{ flexDirection: 'row' }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: { textColor },
                    lineHeight: 20,
                    fontWeight: 'bold',
                    marginBottom: 0,
                  }}
                >
                  Expiring{' '}
                </Text>
                <Icon name={'calendar-sharp'} solid size={20} color={'black'} />
              </View>
              <Text
                style={{
                  fontSize: 16,
                  color: { textColor },
                  marginBottom: 1,
                  width: '100%',
                }}
              >
                {quotationRouteData[0]?.expiryDate?.slice(0, 10) || 'NA'}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              display: 'flex',
            }}
          >
            <View style={{ marginBottom: 10 }}>
              {quotationRouteData[0]?.accountName ? (
                <Text
                  style={{
                    fontSize: 16,
                    color: { textColor },
                    lineHeight: 20,
                    marginBottom: 0,
                    fontWeight: 'bold',
                  }}
                >
                  Account
                </Text>
              ) : null}
              {quotationRouteData[0]?.accountName ? (
                <TouchableOpacity
                  onPress={
                    () =>
                      navigation.navigate('Account Detail', {
                        accountId: quotationRouteData[0]?.accountId,
                        mobileAccountId: quotationRouteData[0]?.mobileAccountId,
                      })
                    // alert(quotationRouteData.accountName)
                  }
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: { textColor },
                      marginBottom: 1,
                      width: '100%',
                    }}
                  >
                    {quotationRouteData[0]?.accountName}
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={{ fontSize: 16, color: 'grey', marginTop: 10 }}>
                  No Account added
                </Text>
              )}
            </View>

            <View style={{ marginBottom: 10 }}>
              {/* <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ fontSize: 16, color: 'black', lineHeight: 20, fontWeight: 'bold', marginBottom: 0 }}>Stage </Text>
                                    </View> */}
              <View style={{ flexDirection: 'row' ,flex:1.5 }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: { textColor },
                    lineHeight: 20,
                    fontWeight: 'bold',
                    marginBottom: 0,
                    marginRight:40
                  }}
                >
                  Stage{' '}
                </Text>
               
              </View>
              <Text
                style={{
                  fontSize: 16,
                  color: { textColor },
                  marginBottom: 1,
                  width: '80%',
                }}
              >
              {quotationRouteData[0]?.stage}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              display: 'flex',
            }}
          >
          <View style={{ marginBottom: 0 }}>
            {contactName?.length > 0 ? (
              <Text
                style={{
                  fontSize: 16,
                  color: { textColor },
                  lineHeight: 20,
                  marginBottom: 0,
                  fontWeight: 'bold',
                }}
              >
                Contact
              </Text>
            ) : null}
            {contactName?.length > 0 ? (
              contactName.map(data => {
                return (
                  <TouchableOpacity
                    onPress={() =>
                      // alert(data.contactName)
                      // console.log("hiiiiiiiiiiiiiiiii",data)
                      navigation.navigate('All Contact Detail', data)
                    }
                  >
                    <Text
                      // style={{
                      //   fontSize: 16,
                      //   fontWeight: '450',
                      //   color: { textColor },
                      //   marginTop: 5,
                      // }}
                      style={{
                        fontSize: 16,
                        color: { textColor },
                        marginBottom: 1,
                        width: '100%',
                      }}
                    >
                      {/* {JSON.parse(route?.params?.dealAccounts)[0]?.accountName} */}
                      {data?.contactName}
                    </Text>
                  </TouchableOpacity>
                )
              })
            ) : (
              <Text style={{ fontSize: 16, color: 'grey' }}>
                No Contact added
              </Text>
            )}
          </View>
          
          <View style={{ flexDirection: 'row' , marginTop:10}}>
                <Icon
                  name={'md-person-sharp'}
                  solid
                  size={17}
                  color={'black'}
                />
                <Text
                  style={{
                    fontSize: 16,
                    color: { textColor },
                    lineHeight: 20,
                    marginBottom: 1,
                    marginBottom: 5,
                    marginRight:25,
                   
                  }}
                >
                  {' '}
                  {/* {quotationRouteData[0].createdBy} */}
                  {userName?.name || 'Julio'}
                </Text>
              </View>

          </View>
          
        </View>
        <View style={styles.lastCard}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              display: 'flex',
            }}
          >
            <View style={{ width: '27.5%' }}>
              <Text
                style={{
                  fontSize: 16,
                  color: { textColor },
                  lineHeight: 20,
                  fontWeight: 'bold',
                }}
              >
                Item
              </Text>
            </View>
            <View
              style={{
                alignSelf: 'flex-end',
                width: '20%',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: { textColor },
                  lineHeight: 20,
                  fontWeight: 'bold',
                }}
              >
                Size
              </Text>
            </View>
            <View style={{ alignSelf: 'flex-end' }}>
              <Text
                style={{
                  fontSize: 16,
                  color: { textColor },
                  lineHeight: 20,
                  fontWeight: 'bold',
                  marginLeft: 7,
                }}
              >
                Quantity
              </Text>
            </View>
            <View style={{ alignSelf: 'flex-end' }}>
              <Text
                style={{
                  fontSize: 16,
                  color: { textColor },
                  lineHeight: 20,
                  fontWeight: 'bold',
                }}
              >
                Price
              </Text>
            </View>
          </View>
          {/* {quotationItem?.map(item => { */}
          {quotationRouteData[0] &&
            JSON?.parse(quotationRouteData[0]?.quotationItem)?.map(item => {
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    display: 'flex',
                    marginTop: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: '#C0C0C0',
                  }}
                >
                  <View
                    style={{ marginBottom: 10, width: '40%', marginRight: 2 }}
                  >
                    <Text style={styles.textStyle}>{item?.productName}</Text>
                  </View>
                  <View style={styles.sizeStyle}>
                    <Text style={styles.textStyle}>{item.sizing}</Text>
                  </View>
                  <View
                    style={{
                      alignSelf: 'flex-end',
                      marginBottom: 10,
                      width: '20%',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={styles.textStyle}>{item.qty}</Text>
                  </View>
                  <View
                    style={{
                      alignSelf: 'flex-end',
                      marginBottom: 10,
                      width: '25%',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={styles.textStyle}>₹ {item.total}</Text>
                  </View>
                </View>
              )
            })}
        </View>
        <View style={styles.lastCard}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              display: 'flex',
            }}
          >
            <View style={{}}>
              <Text
                style={{
                  fontSize: 16,
                  color: { textColor },
                  lineHeight: 20,
                  fontWeight: 'bold',
                }}
              >
                Payment Schedule
              </Text>
            </View>
            <View style={{ alignSelf: 'flex-end' }}>
              <Text
                style={{
                  fontSize: 16,
                  color: { textColor },
                  lineHeight: 20,
                  fontWeight: 'bold',
                }}
              >
                Price
              </Text>
            </View>
          </View>
          {/* {paymentList?.map((item, index) => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  display: 'flex',
                  marginTop: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: '#C0C0C0',
                }}
              >
                <View style={{ marginBottom: 10 }}>
                  <Text style={styles.textStyle}>
                    {item?.payment}: {item?.dueDate}
                  </Text>
                </View>

                <View style={{ alignSelf: 'flex-end', marginBottom: 10 }}>
                  <Text style={styles.textStyle}>₹ {item?.amount}</Text>
                </View>
              </View>
            )
          })} */}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              display: 'flex',
              marginTop: 10,
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 16,
                  color: { textColor },
                  lineHeight: 20,
                  fontWeight: 'bold',
                }}
              >
                Sub Total
              </Text>
            </View>
            <View style={{ alignSelf: 'flex-end' }}>
              <Text
                style={{
                  fontSize: 16,
                  color: { textColor },
                  lineHeight: 20,
                  fontWeight: 'bold',
                }}
              >
                ₹ {quotationRouteData[0]?.subTotal || 0}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              display: 'flex',
              marginTop: 10,
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 16,
                  color: { textColor },
                  lineHeight: 20,
                  fontWeight: 'bold',
                }}
              >
                GST({quotationRouteData[0]?.taxPercentage || 0}%)
              </Text>
            </View>
            <View style={{ alignSelf: 'flex-end' }}>
              <Text
                style={{
                  fontSize: 16,
                  color: { textColor },
                  lineHeight: 20,
                  fontWeight: 'bold',
                }}
              >
                ₹ {quotationRouteData[0]?.totalTax || 0}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              display: 'flex',
              marginTop: 10,
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 16,
                  color: { textColor },
                  lineHeight: 20,
                  fontWeight: 'bold',
                }}
              >
                Discount({quotationRouteData[0]?.discountedPercentage || 0}%)
              </Text>
            </View>
            <View style={{ alignSelf: 'flex-end' }}>
              <Text
                style={{
                  fontSize: 16,
                  color: { textColor },
                  lineHeight: 20,
                  fontWeight: 'bold',
                }}
              >
                - ₹ {quotationRouteData[0]?.discountedPrice || 0}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              display: 'flex',
              marginTop: 10,
            }}
          >
            <View style={{ marginBottom: 10 }}>
              <Text
                style={{
                  fontSize: 16,
                  color: { textColor },
                  lineHeight: 20,
                  fontWeight: 'bold',
                }}
              >
                Total
              </Text>
            </View>
            <View style={{ alignSelf: 'flex-end', marginBottom: 10 }}>
              <Text
                style={{
                  fontSize: 16,
                  color: { textColor },
                  lineHeight: 20,
                  fontWeight: 'bold',
                }}
              >
                ₹ {quotationRouteData[0]?.total}
              </Text>
            </View>
          </View>
          <View style={{ marginBottom: 10 }}>
            <Text
              style={{
                fontSize: 16,
                color: { textColor },
                lineHeight: 20,
                marginBottom: 0,
                fontWeight: 'bold',
              }}
            >
              Purchase Terms
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: { textColor },
                marginBottom: 1,
                width: '100%',
              }}
            >
              {quotationRouteData[0]?.notes}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              display: 'flex',
            }}
          >
            {/* <View>
              <Text
                style={{
                  fontSize: 16,
                  color: { textColor },
                  lineHeight: 20,
                  marginBottom: 0,
                  fontWeight: 'bold',
                }}
              >
                Stage
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: { textColor },
                  marginBottom: 1,
                  width: '100%',
                }}
              >
                {quotationRouteData[0]?.stage}
              </Text>
            </View> */}
            {/* <View> */}
              {/* <View style={{ flexDirection: 'row' }}>
                <Icon
                  name={'md-person-sharp'}
                  solid
                  size={17}
                  color={'black'}
                />
                <Text
                  style={{
                    fontSize: 16,
                    color: { textColor },
                    lineHeight: 20,
                    marginBottom: 1,
                    marginBottom: 5,
                  }}
                >
                  {' '}
                  {/* {quotationRouteData[0].createdBy} */}
                  {/* {userName?.name || 'Julio'}
                </Text>
              </View> */} 
            {/* </View> */}
          </View>
        </View>
      </ScrollView>
      {/* </> : null
            } */}

      {show === 'Attachments' ? <QuoteAttachments /> : null}
      <MaterialSnackbar ref={snackbarRef} />
    </View>
  )
}
const headerChange = props => {
  props.setActiveTab(props.text)
  console.log(props)
  props.setShow(props.text)
}
const HeaderButton = props => (
  <TouchableOpacity
    style={{
      borderBottomColor: props.activeTab === props.text ? '#106878' : 'white',
      borderBottomWidth: 5,
      backgroundColor: '#00b8ce',
      paddingVertical: 15,
      paddingHorizontal: 16,
      width: '50%',
      justifyContent: 'center',
      alignItems: 'center',
    }}
    onPress={() => headerChange(props)}
  >
    <Text
      style={{
        color: props.activeTab === props.text ? '#106878' : 'white',
        fontSize: 15,
        fontWeight: '600',
      }}
    >
      {props.text}
    </Text>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
  },
  text: {
    fontSize: 17,
    color: 'black',
    padding: 10,
  },
  btnText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
  },
  btnTextHolder: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.5)',
  },
  Btn: {
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  card: {
    backgroundColor: 'white',
    marginHorizontal: 10,
    marginTop: 10,
    // marginBottom: 10,
    padding: 15,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
  },
  cards: {
    backgroundColor: 'white',
    marginHorizontal: 10,
    marginTop: 10,
    // marginBottom: 10,
    padding: 15,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
  },
  lastCard: {
    backgroundColor: 'white',
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 15,
    padding: 15,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
  },
  dropdown: {
    width: '100%',
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomColor: '#e4e4e4',
    borderBottomWidth: 1,
  },
  heading: {
    fontSize: 16,
    color: '#616161',
    marginLeft: -8,
  },
  cardreturn: {
    margin: 10,
    color: '#000',
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'white',
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    borderRadius: 4,
  },
  invoiceBox: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: 153,
  },
  textarea: {
    color: 'black',
    width: 400,
    fontSize: 16,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#00b8ce',
    borderRadius: 4,
    width: 100,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  note: {
    // marginHorizontal: 0,
    // marginHorizontal: 25,
    position: 'absolute',
    right: 5,
    marginVertical: 4.5,
  },
  input: {
    height: 50,
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
  dropdowns: {
    height: 50,
    borderColor: 'grey',
    backgroundColor: '#f1f5f7',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    color: '#000',
    // marginBottom: -20,
    width: 300,
  },
  pickerInput: {
    height: 50,
    width: 300,
    marginTop: 25,
    backgroundColor: '#f1f5f7',
    borderRadius: 10,
    fontSize: 6,
    borderWidth: 0.5,
    borderColor: '#C0C0C0',
    color: '#000000',
    marginLeft: 12,
    marginRight: 5,
  },
  textStyle: {
    fontSize: 16,
    opacity: 0.6,
  },
  sizeStyle: {
    alignSelf: 'flex-end',
    marginBottom: 10,
    width: '20%',
  },
})

export default QuoteDetail
