import { StyleSheet, Text, View, TouchableOpacity, LayoutAnimation, Platform, UIManager, ScrollView, Image } from 'react-native'
import React from 'react'
import { useState, useEffect } from 'react'
import { openDatabase } from 'react-native-sqlite-storage'
import { useLayoutEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native'
import ListWrapper from '../CustomComponents/ListWrapper';
import { cardContainer, listCardContainer } from '../CustomComponents/Style';
import { useRef } from 'react';
import { textColor } from '../../Containers/CustomComponents/Image'



const db = openDatabase({
    name: "customer_database",
})

const InvoiceDetail = ({ route, navigation }) => {
    console.log("eeeeeeeeee", route)
    const [expandedOrder, setExpandedOrder] = useState(false)
    const [expandedSale, setExpandedSale] = useState(false)
    const [expandedReturn, setExpandedReturn] = useState(false)
    const [invoiceList, setInvoiceList] = useState([])
    const [saleItem, setSaleItem] = useState([])


    const isFocussed = useIsFocused();


    // useLayoutEffect(() => {
    //     navigation.setOptions({
    //         headerRight: () => (
    //             <TouchableOpacity onPress={() => alert(route?.params?.invoiceNo)} >
    //                 <View style={{ alignSelf: 'flex-end', marginRight: 10 }}>
    //                     <Icon name={'create-outline'} color="#fff" solid size={25} />
    //                 </View>
    //             </TouchableOpacity>
    //         ),
    //     });
    // }, [navigation]);

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
            Invoice
          </Text>
              <Text
                style={{
                  color: '#FFFFFF',
                }}
              >
                {route?.params?.invoiceNo || 'NA'} 
              </Text>
            </View>
          ),
        })
       
      }, [navigation,route])
    const getInvoice = () => {
        db.transaction(txn => {
            txn.executeSql(
                `select * from invoice_info`,
                [],
                (tx, res) => {
                    let len = res.rows.length
                    if (len > 0) {
                        let results = []

                        for (let i = 0; i < len; i++) {
                            let item = res.rows.item(i)
                            results.push(item)
                        }
                        setInvoiceList(results)
                    }
                },
                error => {
                    console.log('error while GETTING', error.message)
                },
            )
        })
    }

    const getSalesItem = () => {
        db.transaction(txn => {
            txn.executeSql(
                `select * from sale_item type="Sale" and saleId=?`,
                [],
                (tx, res) => {
                    let len = res.rows.length
                    if (len > 0) {
                        let results = []

                        for (let i = 0; i < len; i++) {
                            let item = res.rows.item(i)
                            results.push(item)
                        }
                        setSaleItem(results)
                    }
                },
                error => {
                    console.log('error while GETTING', error.message)
                },
            )
        })
    }


    const onPressOrder = () => {
        UIManager.setLayoutAnimationEnabledExperimental(true);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedOrder(!expandedOrder)
    };

    const onPressSale = () => {
        UIManager.setLayoutAnimationEnabledExperimental(true);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedSale(!expandedSale)
    };

    const onPressReturn = () => {
        UIManager.setLayoutAnimationEnabledExperimental(true);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedReturn(!expandedReturn)
    };

    useEffect(() => {
        getInvoice()
        getSalesItem()
    }, [isFocussed])

    return (
        <ListWrapper>
            {/* <ScrollView>
                <View style={{ alignItems: 'center' }}>
                    <View style={listCardContainer}>
                        <Text style={{ fontSize: 20, color: {textColor}, justifyContent: 'center', textAlign: 'center' }}>{route?.params?.storeName || 'NA'}</Text>
                        <Text style={{ fontSize: 16, color: {textColor}, justifyContent: 'center', textAlign: 'center' }}>{route?.params?.invoiceNo}</Text>
                        <Text style={{ fontSize: 14, color: {textColor}, justifyContent: 'center', textAlign: 'center' }}>{route?.params?.customerName}</Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 45 }}>
                            <Icon
                                name={'mail-sharp'}
                                color="black"
                                solid
                                size={15}
                            />
                            <Text style={{ flex: 1, fontSize: 16, color: {textColor} }}>{route?.params?.customerEmail || 'NA'}</Text>

                            <View style={{ display: 'flex', flexDirection: 'row' , alignItems:'center'}}>
                                <Icon
                                    name={'call-sharp'}
                                    color="black"
                                    solid
                                    size={15}
                                />
                                <Text style={{ fontSize: 16, color: {textColor} }}>{route?.params?.customerMobile}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={listCardContainer}>
                        <Text style={{ fontSize: 16, color: {textColor}, marginBottom: 10 }}>Status</Text>
                        <Text style={{ fontSize: 16, color: {textColor}, lineHeight: 20 }}>{route?.params?.invoiceStatus}</Text>
                    </View>
                    <View style={listCardContainer}>
                        <TouchableOpacity onPress={onPressOrder}
                            style={styles.dropdown}>
                            <Text style={styles.heading}>Product Details</Text>
                            <Image source={require('../../MD/assets/icon/ic_chevron_right.png')}
                                style={{ width: 15, height: 15, resizeMode: 'contain', tintColor: '#aeaeae', transform: [{ rotate: expandedOrder ? '90deg' : '0deg' }] }} />
                        </TouchableOpacity>
                        <View style={{
                            height: expandedOrder ? null : 0,
                            overflow: 'hidden',
                            borderBottomColor: '#e4e4e4',
                            borderBottomWidth: 1
                        }}>
                            <View style={styles.tableContainer}>
                                <View style={styles.tableRow}>
                                    <Text style={styles.tableHeader}>Product</Text>
                                    <Text style={styles.tableHeader}>Size</Text>
                                    <Text style={styles.tableHeader}>Quantity</Text>
                                    <Text style={styles.tableHeader}>Total</Text>
                                </View>
                                {[
                                    { product: saleItem[0]?.productName, size: saleItem[0]?.sizing, quantity:saleItem[0]?.qty, total:saleItem[0]?.total },
                                    // { product: 'Pants', size: 'M', quantity: 3, total: 75 }
                                ].map((row, index) => (
                                    <View key={index} style={styles.tableRow}>
                                        <Text style={[styles.tableCell, { width: "35%" }]}>{row.product}</Text>
                                        <Text style={[styles.tableCell, { width: "25%" }]}>{row.size}</Text>
                                        <Text style={[styles.tableCell, { width: "25%" }]}>{row.quantity}</Text>
                                        <Text style={[styles.tableCell, { width: "10%", textAlign: 'center' }]}>{row.total}</Text>
                                    </View>
                                ))}
                            </View>
                            <View style={{ display: "flex", alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
                                <Text style={{ fontSize: 14, color: {textColor}, lineHeight: 20, paddingVertical: 10 }}>SubTotal</Text>
                                <Text style={{ fontSize: 14, color: {textColor}, lineHeight: 20, paddingVertical: 10 }}>{route?.params?.subTotal}</Text>
                            </View>
                            <View style={{ display: "flex", alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
                                <Text style={{ fontSize: 14, color: {textColor}, lineHeight: 20, paddingVertical: 10 }}>GST(18%)</Text>
                                <Text style={{ fontSize: 14, color: {textColor}, lineHeight: 20, paddingVertical: 10 }}>{route?.params?.totalTax}</Text>
                            </View>
                            <View style={{ display: "flex", alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' }}>
                                <Text style={{ fontSize: 14, color: {textColor}, lineHeight: 20, paddingVertical: 10 }}>Total</Text>
                                <Text style={{ fontSize: 14, color: {textColor}, lineHeight: 20, paddingVertical: 10 }}>{route?.params?.total}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={onPressSale}
                            style={{
                                width: '100%',
                                paddingVertical: 20,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                // paddingHorizontal: 20,
                                alignItems: 'center',
                            }}>
                            <Text style={styles.heading}>Payment Details</Text>
                            <Image source={require('../../MD/assets/icon/ic_chevron_right.png')}
                                style={{ width: 15, height: 15, resizeMode: 'contain', tintColor: '#aeaeae', transform: [{ rotate: expandedSale ? '90deg' : '0deg' }] }} />
                        </TouchableOpacity>
                        <View style={{
                            height: expandedSale ? null : 0,
                            overflow: 'hidden',
                        }}>
                            <View style={{
                                justifyContent: 'space-between',
                                display: 'flex',
                                flexDirection: 'row'
                            }}>
                                <Text style={{ fontSize: 14, color: {textColor}, lineHeight: 20, paddingVertical: 10, }}>Pay Type </Text>
                                <Text style={{ fontSize: 14, color: {textColor}, lineHeight: 20, paddingVertical: 10, }}>Pay Later </Text>
                            </View>
                            <View style={{
                                justifyContent: 'space-between',
                                display: 'flex',
                                flexDirection: 'row'
                            }}>
                                <Text style={{ fontSize: 14, color: {textColor}, lineHeight: 20, paddingVertical: 10, }}>Last Pay Date </Text>
                                <Text style={{ fontSize: 14, color: {textColor}, lineHeight: 20, paddingVertical: 10, }}>{route?.params?.updateDate} </Text>
                            </View>
                            <View style={{
                                justifyContent: 'space-between',
                                display: 'flex',
                                flexDirection: 'row'
                            }}>
                                <Text style={{ fontSize: 14, color: {textColor}, lineHeight: 20, paddingVertical: 10, }}>Pending Amount </Text>
                                <Text style={{ fontSize: 14, color: {textColor}, lineHeight: 20, paddingVertical: 10, }}>{route?.params?.pendingAmount} </Text>
                            </View>
                            <View style={{
                                justifyContent: 'space-between',
                                display: 'flex',
                                flexDirection: 'row'
                            }}>
                                <Text style={{ fontSize: 14, color: {textColor}, lineHeight: 20, paddingVertical: 10, }}>Received Amount </Text>
                                <Text style={{ fontSize: 14, color: {textColor}, lineHeight: 20, paddingVertical: 10, }}>{route?.params?.receivedAmount} </Text>
                            </View>
                            <View style={{
                                justifyContent: 'space-between',
                                display: 'flex',
                                flexDirection: 'row'
                            }}>
                                <Text style={{ fontSize: 14, color: {textColor}, lineHeight: 20, paddingVertical: 10, }}>Payment Method </Text>
                                <Text style={{ fontSize: 14, color: {textColor}, lineHeight: 20, paddingVertical: 10, }}>{route?.params?.paymentMethod}</Text>
                            </View>
                            <View style={{
                                justifyContent: 'space-between',
                                display: 'flex',
                                flexDirection: 'row'
                            }}>
                                <Text style={{ fontSize: 14, color: {textColor}, lineHeight: 20, paddingVertical: 10, }}>Pay Later Type </Text>
                                <Text style={{ fontSize: 14, color: {textColor}, lineHeight: 20, paddingVertical: 10, }}>{route?.params?.paylaterType || 'NA'}</Text>
                            </View>
                        </View>

                    </View>
                </View>
            </ScrollView> */}

<View style={{ flex: 1, alignItems: 'center' }}>
                <ScrollView>
                    <View style={{ alignItems: 'center' }}>
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
                          Customer Name
                        </Text>
                      </View>
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                      >
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
                            {route?.params?.customerName}
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
                        Total
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          color: { textColor },
                          lineHeight: 20,
                          marginBottom: 10,
                        }}
                      >
                         {route?.params?.total}
                      </Text>
                    </View>
                  </View>

                  <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
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
                    Received Amount
                  </Text> 
                 <Text
                    style={{
                      fontSize: 16,
                      color: { textColor },
                    }}
                  >
                    {route?.params?.receivedAmount}
                  </Text>
                </View> 
                <View style={{ width: "50%", marginRight: 5 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: {textColor},
                      marginBottom: 1,
                      fontWeight: 'bold',
                    }}
                  >
                    Pending Amount
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: {textColor},
                      lineHeight: 20,
                      marginBottom: 10,
                    }}
                  >
                 {route?.params?.pendingAmount}
                  </Text>
                </View> 
                 </View>
                <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
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
                    Paid Amount
                  </Text> 
                 <Text
                    style={{
                      fontSize: 16,
                      color: { textColor },
                    }}
                  >
                    {route?.params?.paidAmount}
                  </Text>
                </View> 
                <View style={{ width: "50%", marginRight: 5 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: {textColor},
                      marginBottom: 1,
                      fontWeight: 'bold',
                    }}
                  >
                    Payment Method
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: {textColor},
                      lineHeight: 20,
                      marginBottom: 10,
                    }}
                  >
                    {route?.params?.paymentMethod}
                  </Text>
                </View> 
                 </View> 
            </View> 
            
              </View>
                        <View style={[listCardContainer, { marginBottom: 10 }]}>
                           
                                

 
                                <View style={{ flexDirection: "row", justifyContent: 'space-between' }}>
                                    <Text style={{ fontSize: 14, color: { textColor }, lineHeight: 20, padding: 15, }}>Store Name:</Text>
                                    <Text style={{ fontSize: 14, color: { textColor }, lineHeight: 20, padding: 15, }}>{route?.params?.storeName}</Text>
                                </View> 

                        </View>

                        <View style={listCardContainer}>
                        <Text style={{  fontWeight: 'bold',fontSize: 16, color: { textColor } }}>Product Details</Text>
                        <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      display: 'flex',
                      marginHorizontal: '5%',
                    //   borderBottomWidth: 1,
                      borderBottomColor: 'gray',
                    }}
                  >
                    <View style={{ marginTop: '5%' }}>
                      <Text
                        style={{
                          fontSize: 15,
                          color: 'black',
                          fontWeight: 'bold',
                        }}
                      >
                        Sub Total :
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginHorizontal: '0%',
                        marginTop: '5%',
                        marginBottom: '5%',
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          color: 'black',
                          fontWeight: 'bold',
                        }}
                      >
                        {' '}
                        {route?.params?.subTotal}
                      </Text>
                    </View>
                  </View>
                        <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      display: 'flex',
                      marginHorizontal: '5%',
                      borderBottomWidth: 1,
                      borderBottomColor: 'gray',
                    }}
                  >
                    <View style={{ marginTop: '1%' }}>
                      <Text
                        style={{
                          fontSize: 15,
                          color: 'black',
                          fontWeight: 'bold',
                        }}
                      >
                        Tax({route.params.taxPercentage}%):
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginHorizontal: '0%',
                        marginTop: '1%',
                        marginBottom: '5%',
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          color: 'black',
                          fontWeight: 'bold',
                        }}
                      >
                        {' '}
                        {+Number(route?.params?.totalTax)?.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      display: 'flex',
                      marginHorizontal: '5%',
                    //   borderBottomWidth: 1,
                      borderBottomColor: 'gray',
                    }}
                  >
                    <View style={{ marginTop: '5%' }}>
                      <Text
                        style={{
                          fontSize: 15,
                          color: 'black',
                          fontWeight: 'bold',
                        }}
                      >
                        Total :
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginHorizontal: '0%',
                        marginTop: '5%',
                        marginBottom: '5%',
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          color: 'black',
                          fontWeight: 'bold',
                        }}
                      >
                        {' '}
                       {/* {Number(route?.params?.total)} +{Number(route?.params?.totalTax)} */}
                       {Number(route?.params?.subTotal) + Number(route?.params?.totalTax)}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      display: 'flex',
                      marginHorizontal: '5%',
                      borderBottomWidth: 1,
                      borderBottomColor: 'gray',
                    }}
                  >
                    <View style={{ marginTop: '1%' }}>
                      <Text
                        style={{
                          fontSize: 15,
                          color: 'black',
                          fontWeight: 'bold',
                        }}
                      >
                        Received Amount:
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginHorizontal: '0%',
                        marginTop: '1%',
                        marginBottom: '5%',
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          color: 'black',
                          fontWeight: 'bold',
                        }}
                      >
                        {}
                        {route?.params?.receivedAmount}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      display: 'flex',
                      marginHorizontal: '5%',
                    //   borderBottomWidth: 1,
                      borderBottomColor: 'gray',
                    }}
                  >
                    <View style={{ marginTop: '5%' }}>
                      <Text
                        style={{
                          fontSize: 15,
                          color: 'black',
                          fontWeight: 'bold',
                        }}
                      >
                        Pending Amount:
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginHorizontal: '0%',
                        marginTop: '5%',
                        marginBottom: '5%',
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          color: 'black',
                          fontWeight: 'bold',
                        }}
                      >
                        {}
                        {route?.params?.pendingAmount}
                      </Text>
                    </View>
                  </View>
                 

              
              </View>
                    </View>
                </ScrollView>
              
            </View>
        </ListWrapper >
    )
}

const styles = StyleSheet.create({
    dropdown: {
        width: '100%',
        paddingVertical: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        // paddingHorizontal: 20,
        alignItems: 'center',
        borderBottomColor: '#e4e4e4',
        borderBottomWidth: 0
    },
    heading: {
        fontSize: 16,
        color: {textColor},
    },
    tableContainer: {
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'space-evenly'
    },
    tableRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // padding: 10,
        paddingVertical: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: 'lightgray'
    },
    tableHeader: {
        fontWeight: 'bold',
    },
    tableCell: {
        paddingVertical: 5,
        color: "#616161"
    }
});

export default InvoiceDetail