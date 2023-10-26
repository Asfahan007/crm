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
  ActivityIndicator,
  FlatList,
  Platform,
  UIManager,
} from 'react-native'
import MaterialSnackbar from '../../MD/components/MaterialSnackbar'
import { PageContext } from '../../Containers/MDContainer'
import { useLayoutEffect } from 'react'
import { useState } from 'react'
import { openDatabase } from 'react-native-sqlite-storage'
import Icon from 'react-native-vector-icons/Ionicons'
import { useIsFocused } from '@react-navigation/native'
import { BG_IMG } from '../CustomComponents/Image'
import ListWrapper from '../CustomComponents/ListWrapper'
import { listCardContainer, screenWidth } from '../CustomComponents/Style'
import NetInfo from '@react-native-community/netinfo'
import {
  textColor,
  whiteTextColor,
  highlightedColor,
  appColor,
} from '../../Containers/CustomComponents/Image'
import HeaderNavbar from '../../Containers/CustomComponents/HeaderNavbar'
import { Checkbox, Menu, Provider } from 'react-native-paper'

import { BackHandler } from 'react-native'

const db = openDatabase({
  name: 'customer_database',
})

function CustomerListDetail({ route, navigation }) {
  const isFocussed = useIsFocused()
  const [show, setShow] = useState(false)
  const [cus, setCus] = useState([])
  const [fullData, setFullData] = useState([])
  const [product, setProduct] = useState([])
  const [customerData, setCustomerData] = useState([])
  const [activeTab, setActiveTab] = useState('Purchases')


  function handleBackButtonClick() {
    navigation.navigate('Customer List')
    return true
  }
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick)
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      )
    }
  }, [])

  const getCustomerById = async () => {
    console.log(
      'route of customer detail',
      route?.params?.data?.customerId,
      route?.params?.data?.mobileCustomerId,
    )
    await db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM customer_info WHERE customerId =? or mobileCustomerId=?',
        [
          route?.params?.data?.customerId,
          route?.params?.data?.mobileCustomerId,
        ],
        (tx, res) => {
          // var len = results.rows.length;
          // if (len > 0) {
          const results = Array.from({ length: res.rows.length }, (_, i) =>
            res.rows.item(i),
          )
          setCustomerData(results[0])
          // } else {
          //   updateAllStates('', '', '', '');
        },
        error => {
          console.log(
            'error SELECT * FROM customer_info WHERE customerId =? or mobileCustomerId=?' +
            error.message,
          )
        },
      )
    })
  }
  console.log('bbbbb', show)

  useEffect(() => {
    getCustomerById()
  }, [isFocussed])

  const getInvoice = async () => {
    await db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM sale WHERE customerId =? and customerId not in ("") or mobileCustomerId=? ',
        [route?.params?.data?.customerId, route?.params?.data?.mobileCustomerId],
        (tx, res) => {
          const results = Array.from({ length: res.rows.length }, (_, i) =>
            res.rows.item(i),
          )
          setCus(results)
        },
        error => {
          console.log(
            'error SELECT * FROM sale WHERE customerId =? or mobileCustomerId=?' +
            error.message,
          )
        },
      )
    })
  }

  const getSaleList = () => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * from sale where type ="Return" and  customerId =? and customerId not in ("")',
        [route?.params?.data?.customerId],
        (tx, res) => {
          let len = res.rows.length
          console.log('len', len)
          if (len > 0) {
            let results = []
            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              results.push(item)
            }
            setFullData(results)
          }
        },
        error => {
          console.log('error while GETTING', error.message)
        },
      )
    })
  }

  useEffect(() => {
    getSaleList()
  }, [isFocussed])

  const getProduct = () => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT sale.*,sale.saleId,sale.mobileSaleId,sale.customerName,sale.invoiceNo,sale.invoiceDate,sale.total,sale_item.productName from sale INNER JOIN sale_item  on sale.saleId = sale_item.saleId or sale.mobileSaleId = sale_item.mobileSaleId where sale.type="Sale" and customerId=? and customerId not in ("")',
        [route.params.data.customerId],
        (tx, res) => {
          let len = res.rows.length
          console.log('len', len)
          if (len > 0) {
            let results = []
            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              results.push(item)
            }
            setProduct(results)
          }
        },
        error => {
          console.log('error while GETTING', error.message)
        },
      )
    })
  }
 
  useEffect(() => {
    getInvoice()
    getProduct()
  }, [isFocussed])

  useLayoutEffect(() => {
    navigation.setOptions({
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
            {customerData?.customerName || 'NA'}
          </Text>
          <Text
            style={{
              color: '#FFFFFF',
            }}
          >
            {customerData?.customerMobile || 'NA'} | {customerData.storeName}
          </Text>
        </View>
      ),
    })
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Add Customer', route)}
          >
            <View style={{ alignSelf: 'flex-end', marginRight: 10 }}>
              <Icon name={'create-outline'} color="#fff" solid size={25} />
            </View>
          </TouchableOpacity>
        </View>
      ),
    })
  }, [show, navigation, activeTab, cus, customerData])

  const RenderCustomer = ({ data }) => {
    return (
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Sales Detail', data)}
        >

          <View style={listCardContainer}>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginRight: 10,
                }}
              >
                <View>
                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={{
                        fontSize: 16,
                        color: { textColor },
                        marginBottom: 1,
                        fontWeight: 'bold',
                        marginRight: 3,
                      }}
                    >
                      Invoice No
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {/* {activityDate[0]?.activityDate && (
                        <View style={{ marginRight: 4 }}>
                          <FontAwesome5
                            name={'calendar-check'}
                            solid
                            color="#000"
                            size={16}
                          />
                        </View>
                      )} */}
                    <View>
                      {/* <Text
                          style={{
                            fontSize: 16,
                            color: activityDate[0]?.activityDate
                              ? { textColor }
                              : 'grey',
                            marginBottom: 1,
                          }}
                        >
                          {activityDate[0]?.activityDate || 'No Activity'}
                        </Text> */}
                      <Text
                        style={{
                          fontSize: 16,
                          color: { textColor },
                          lineHeight: 20,
                          marginBottom: 10,
                        }}
                      >
                        {data?.invoiceNo}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={{ width: '50%' }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: { textColor },
                      marginBottom: 1,
                      fontWeight: 'bold',
                    }}
                  >
                    Invoice Date
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: { textColor },
                      lineHeight: 20,
                      marginBottom: 10,
                    }}
                  >
                    {data?.invoiceDate.slice(0, 10)}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <View style={{}}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: { textColor },
                      fontWeight: 'bold',
                      marginBottom: 1,
                    }}
                  >
                    Product Name
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: { textColor },
                    }}
                  >
                    {data?.productName.slice(0, 10)}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '50%',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: { textColor },
                      marginBottom: 1,
                      fontWeight: 'bold',
                    }}
                  >
                    Total
                  </Text>

                  <Text
                    style={{
                      fontSize: 16,
                      color: { textColor },
                      lineHeight: 20,
                      marginLeft: 3,
                    }}
                  >
                    {/* {dealDetailRoute[0]?.dealOwner.split('_')[0]} */}
                    {data?.total}
                  </Text>
                </View>
              </View>
            </View>

          </View>
        </TouchableOpacity>
      </View>
    )
  }

  const Return = ({ data }) => {
    return (
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Return Detail', data)}
        >

          <View style={listCardContainer}>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginRight: 10,
                }}
              >
                <View>
                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={{
                        fontSize: 16,
                        color: { textColor },
                        marginBottom: 1,
                        fontWeight: 'bold',
                        marginRight: 3,
                      }}
                    >
                      Invoice No
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {/* {activityDate[0]?.activityDate && (
                        <View style={{ marginRight: 4 }}>
                          <FontAwesome5
                            name={'calendar-check'}
                            solid
                            color="#000"
                            size={16}
                          />
                        </View>
                      )} */}
                    <View>
                      {/* <Text
                          style={{
                            fontSize: 16,
                            color: activityDate[0]?.activityDate
                              ? { textColor }
                              : 'grey',
                            marginBottom: 1,
                          }}
                        >
                          {activityDate[0]?.activityDate || 'No Activity'}
                        </Text> */}
                      <Text
                        style={{
                          fontSize: 16,
                          color: { textColor },
                          lineHeight: 20,
                          marginBottom: 10,
                        }}
                      >
                        {data?.invoiceNo}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={{ width: '50%' }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: { textColor },
                      marginBottom: 1,
                      fontWeight: 'bold',
                    }}
                  >
                    Invoice Date
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: { textColor },
                      lineHeight: 20,
                      marginBottom: 10,
                    }}
                  >
                    {data?.invoiceDate.slice(0, 10)}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <View style={{}}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: { textColor },
                      fontWeight: 'bold',
                      marginBottom: 1,
                    }}
                  >
                    Product Name
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: { textColor },
                    }}
                  >
                    Turanza
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '50%',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: { textColor },
                      marginBottom: 1,
                      fontWeight: 'bold',
                    }}
                  >
                    Total
                  </Text>

                  <Text
                    style={{
                      fontSize: 16,
                      color: { textColor },
                      lineHeight: 20,
                      marginLeft: 3,
                    }}
                  >
                    {/* {dealDetailRoute[0]?.dealOwner.split('_')[0]} */}
                    {data?.total}
                  </Text>
                </View>
              </View>
            </View>

          </View>
        </TouchableOpacity>
      </View>
    )
  }
  return (
    <ListWrapper>
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          width: screenWidth,
        }}
      >
        <HeaderNavbar
          text="Purchases"
          btnColor="#00b8ce"
          textColor="white"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          navigation={navigation}
          setShow={setShow}
        />
        <HeaderNavbar
          text="Return"
          btnColor="white"
          textColor={textColor}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          navigation={navigation}
          setShow={setShow}
        />
      </View>
      {activeTab === 'Purchases' ? (
        <View style={{ flex: 1 }}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}></View>

          <View style={{ flex: 1 }}>
            <FlatList
              data={product}
              gap={10}
              renderItem={({ item }) => <RenderCustomer data={item} />}
              key={cats => cats.ids}
            />
          </View>
        </View>
      )
        : activeTab === 'Return' ? (
          <View style={{ flex: 1 }}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}></View>

            <View style={{ flex: 1 }}>
              <FlatList
                data={fullData}
                // data={hardcode}
                gap={10}
                renderItem={({ item }) => <Return data={item} />}
                key={cats => cats.ids}
              />
            </View>
          </View>
        ) : null}

    </ListWrapper>
  )
}


export default CustomerListDetail
