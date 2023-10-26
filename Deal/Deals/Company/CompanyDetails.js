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
  UIManager
} from 'react-native'
import React from 'react'
import { useContext, useEffect, useRef, useState } from 'react'
import MaterialSnackbar from '../../../../MD/components/MaterialSnackbar'
import { PageContext } from '../../../../Containers/MDContainer'
import { openDatabase } from 'react-native-sqlite-storage'
import { useLayoutEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native'
import ListWrapper from '../../../../Containers/CustomComponents/ListWrapper';
import { cardContainer, listCardContainer } from '../../../../Containers/CustomComponents/Style';
import { linkedDataColor, noDataColor, textColor } from '../../../../Containers/CustomComponents/Image'



const db = openDatabase({
  name: "customer_database",
})


const CompanyDetails = ({ route, navigation }) => {
  const isFocussed = useIsFocused();
  console.log('company detail route', route)
  const idd = route?.params?.companyId
  const snackbarRef = useRef(null)
  const [companyDetail, setCompanyDetail] = useState([])
  const [companyAssociatedAccount, setCompanyAssociatedAccount] = useState('')


  useLayoutEffect(() => {
    navigation.setOptions({
      // headerRight: () => (
      //   <View style={{ flexDirection: 'row' }}>
      //     <TouchableOpacity onPress={() => navigation.navigate("Add Company", companyDetail[0])} >
      //       <View style={{ alignSelf: 'flex-end', marginRight: 10 }}>
      //         <Icon name={'create-outline'} color="#fff" solid size={25} />
      //       </View>
      //     </TouchableOpacity>
      //   </View>
      // ),
      title: <Text>{companyDetail[0]?.companyName}</Text>
    });
  }, [navigation, isFocussed, companyDetail]);

  useEffect(() => {
    getAccountData()
  }, [navigation])

  useEffect(() => {
    getCompanyById()
  }, [isFocussed, navigation])

  const getCompanyById = async () => {
    await db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM company_info where companyId = ?',
        [route?.params?.companyId],
        (txn, res) => {
          const results = Array.from({ length: res.rows.length }, (_, i) => res.rows.item(i));
          setCompanyDetail(results)
        },
        error => {
          console.log('error select * from account WHERE accountId =? or mobileAccountId=?' + error.message)
        },
      );
    });
  }

  const getAccountData = () => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * FROM account where companyId = ?',
        [route?.params?.companyId],
        (tx, res) => {
          const results = Array.from({ length: res.rows.length }, (_, i) => res.rows.item(i));
          setCompanyAssociatedAccount(results)
        },
        error => {
          console.log('error SELECT * from contacts where accountId = ? or mobileAccountId', error.message)
        },
      )
    })
  }

  return (
    <ListWrapper>
      {console.log("company details", companyDetail)}
      <ScrollView>
        <View style={{ alignItems: 'center' }}>
          <View style={listCardContainer}>
            <Text
              style={{
                fontSize: 16,
                color: textColor,
                lineHeight: 20,
                marginBottom: 1,
                fontWeight: 'bold',
              }}
            >
              Company Description
            </Text>
            <Text style={{ fontSize: 16, color: textColor }}>
              {companyDetail[0]?.companyDescription}
            </Text>
          </View>

          <View style={listCardContainer}>
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: 'gray',
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: textColor,
                  lineHeight: 20,
                  marginBottom: 1,
                  fontWeight: 'bold',
                }}
              >
                Address
              </Text>
              {companyDetail[0]?.addressLine1 ?
                <Text
                  style={{ fontSize: 16, color: textColor, marginBottom: 10 }}
                >
                  {companyDetail[0]?.addressLine1}, {companyDetail[0]?.addressLine2},{' '}
                  {companyDetail[0]?.city}, {companyDetail[0]?.state}, {companyDetail[0]?.country},{' '}
                  {companyDetail[0]?.pinCode}
                </Text>
                :
                <Text
                  style={{ fontSize: 16, color: noDataColor, marginBottom: 10 }}
                >
                  Not added
                </Text>
              }
            </View>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      color: textColor,
                      marginBottom: 1,
                      fontWeight: 'bold',
                    }}
                  >
                    Website
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: textColor,
                      lineHeight: 20,
                      marginBottom: 10,
                    }}
                  >
                    {companyDetail[0]?.website}
                  </Text>
                </View>
                <View style={{ width: 112 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: textColor,
                      fontWeight: 'bold',
                      marginBottom: 1,
                    }}
                  >
                    Status
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: textColor,
                      lineHeight: 20,
                      marginBottom: 10,
                    }}
                  >
                    {companyDetail[0]?.companyStatus}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      color: textColor,
                      marginBottom: 1,
                      fontWeight: 'bold',
                    }}
                  >
                    Email
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: textColor,
                      lineHeight: 20,
                      marginBottom: 10,
                    }}
                  >
                    {companyDetail[0]?.email}
                  </Text>
                </View>
                <View style={{ width: 112 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: textColor,
                      fontWeight: 'bold',
                      marginBottom: 1,
                    }}
                  >
                    Owner
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: textColor,
                      lineHeight: 20,
                      marginBottom: 10,
                    }}
                  >
                    Admin CRM
                  </Text>
                </View>


              </View>
            </View>
          </View>

          <View style={[listCardContainer, {
            marginLeft: 0,
            marginRight: 0,
            padding: 0
          }]}>
            <View
              style={{
                borderBottomColor: 'gray',
              }}
            >
              {companyAssociatedAccount.length > 0 ? (
                <>
                  <View style={{
                    borderBottomWidth: 0.7,
                    borderColor: 'grey',
                    padding: 10
                  }}>
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
                  <View style={{
                    backgroundColor: 'white',
                    paddingHorizontal: 10
                  }}>
                    {
                      companyAssociatedAccount.map((data, id) => {
                        return (
                          <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            // borderBottomWidth: id > companyAssociatedAccount?.length - 2 ? 0 : 0.5,
                            borderBottomWidth: 0.5,
                            borderBottomColor: 'grey',
                            paddingVertical: 10
                          }}>
                            <View>
                              <TouchableOpacity
                                onPress={() =>
                                  navigation.navigate('Account Detail', { accountId: data.accountId ,mobileAccountId:data.mobileAccountId})
                                }
                              >
                                <Text
                                  style={{
                                    fontSize: 16,
                                    color: linkedDataColor,
                                    fontWeight: 'bold'
                                  }}
                                >
                                  {data?.accountName}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        )
                      })
                    }
                  </View>
                </>
              ) : (
                <Text style={{ fontSize: 16, color: textColor, padding: 10 }}>
                  No Accounts added
                </Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      <MaterialSnackbar ref={snackbarRef} />

    </ListWrapper>
  )
}

export default CompanyDetails