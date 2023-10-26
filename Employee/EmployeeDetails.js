import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import React from 'react'
import { useEffect, useRef, useState } from 'react'
import MaterialSnackbar from '../../MD/components/MaterialSnackbar'
import { openDatabase } from 'react-native-sqlite-storage'
import { useLayoutEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native'
import ListWrapper from '../CustomComponents/ListWrapper';
import { listCardContainer } from '../CustomComponents/Style';
import { textColor } from '../../Containers/CustomComponents/Image'
import { BackHandler } from 'react-native'

const db = openDatabase({
  name: "customer_database",
})

const EmployeeDetails = ({ route, navigation }) => {
  const isFocussed = useIsFocused();
  const snackbarRef = useRef(null)
  const [data, setData] = useState([])

  useEffect(() => {
    getEmployeeById()
  }, [isFocussed])

  const getEmployeeById = async () => {
    await db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM employee_info where employeeId = ? or mobileEmployeeId=?',
        [route?.params?.employeeId, route?.params?.mobileEmployeeId],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            let res = results.rows.item(0);
            setData(res)
          } else {
            updateAllStates('', '', '', '');
          }
        }
      );
    });
  }

  console.log(data, "hhhhhhhhhh")

  // const getStoreById = async () => {
  //   await db.transaction((tx) => {
  //     tx.executeSql(
  //       'SELECT * FROM store_info where storeId = ? or mobileStored=?',
  //       [data[0]?.storeId, data[0]?.mobileStored],
  //       (txn, res) => {
  //         const results = Array.from({ length: res.rows.length }, (_, i) =>
  //           res.rows.item(i),
  //         )
  //         setStoreDetail(results)
  //       },
  //       error => {
  //         console.log(
  //           "SELECT * FROM store_info where storeId = ? or mobileStored=?" +
  //           error.message,
  //         )
  //       },
  //     );
  //   });
  // }
  // console.log(storeDetail,"ddddddddddddd")

  // useEffect(() => {
  //   getStoreById()
  // }, [data])

  function handleBackButtonClick() {
    navigation.navigate("Employee List")
    return true;
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate("Add Employee", route)} >
          <View style={{ alignSelf: 'flex-end', marginRight: 10 }}>
            <Icon name={'create-outline'} color="#fff" solid size={25} />
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
    };
  }, []);


  return (
    <ListWrapper>
      <ScrollView>
        <View style={{ alignItems: 'center' }}>
          <View style={listCardContainer}>
            <Text
              style={{
                fontSize: 20,
                color: { textColor },
                justifyContent: 'center',
                textAlign: 'center',
                marginTop: 10,
              }}
            >
              {data.employeeName}
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 45 }}>
              <Icon
                name={'mail-sharp'}
                color={textColor}
                solid
                size={15}
              />
              <Text style={{ flex: 1, fontSize: 16, color: { textColor } }}> {data.employeeEmail}
              </Text>

              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  name={'call-sharp'}
                  color={textColor}
                  solid
                  size={15}
                />
                <Text style={{ fontSize: 16, color: { textColor } }}> {data.employeeMobile}
                </Text>
              </View>
            </View>
          </View>

          <View style={listCardContainer}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: { textColor }, marginBottom: 10 }}>
              Status
            </Text>
            <Text style={{ fontSize: 16, color: { textColor }, lineHeight: 20 }}>
              {data.employeeStatus}
            </Text>
          </View>

          <View style={listCardContainer}>
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
                      color: { textColor },
                      marginBottom: 1,
                      fontWeight: 'bold',
                    }}
                  >
                    Address
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: { textColor },
                      lineHeight: 20,
                      marginBottom: 10,
                    }}
                  >
                    {data?.addressLIne1}
                  </Text>
                </View>
                <View style={{ width: 112 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: { textColor },
                      fontWeight: 'bold',
                      marginBottom: 1,
                    }}
                  >
                    City
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: { textColor },
                      lineHeight: 20,
                      marginBottom: 10,
                    }}
                  >
                    {data?.city}
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
                      color: { textColor },
                      marginBottom: 1,
                      fontWeight: 'bold',
                    }}
                  >
                    Zip Code
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: { textColor },
                      lineHeight: 20,
                      marginBottom: 10,
                    }}
                  >
                    {data?.zipcode}
                  </Text>
                </View>

                <View style={{ width: 112 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: { textColor },
                      marginBottom: 1,
                      fontWeight: 'bold',
                    }}
                  >
                    State
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: { textColor },
                      lineHeight: 20,
                      marginBottom: 10,
                    }}
                  >
                    {data?.state}
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
                      color: { textColor },
                      marginBottom: 1,
                      fontWeight: 'bold',
                    }}
                  >
                    Store Name
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: { textColor },
                      lineHeight: 20,
                      marginBottom: 10,
                    }}
                  >
                    {data?.storeName}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={listCardContainer}>
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
                      color: { textColor },
                      marginBottom: 1,
                      fontWeight: 'bold',
                    }}
                  >
                    Service Commission
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: { textColor },
                      lineHeight: 20,
                      marginBottom: 10,
                    }}
                  >
                    {data?.employeeServiceCommission}
                  </Text>
                </View>
                <View style={{ width: 112 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: { textColor },
                      fontWeight: 'bold',
                      marginBottom: 1,
                    }}
                  >
                    Salary
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: { textColor },
                      lineHeight: 20,
                      marginBottom: 10,
                    }}
                  >
                    {data?.employeeSalary}
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
                      color: { textColor },
                      marginBottom: 1,
                      fontWeight: 'bold',
                    }}
                  >
                    Product Commission
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: { textColor },
                      lineHeight: 20,
                      marginBottom: 10,
                    }}
                  >
                    {data?.employeeProductCommission}
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      color: { textColor },
                      marginBottom: 1,
                      fontWeight: 'bold',
                    }}
                  >
                    Variable Salary
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color: { textColor },
                      lineHeight: 20,
                      marginBottom: 10,
                    }}
                  >
                    {data?.employeeVariableSalary}
                  </Text>
                </View>

              </View>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    color: { textColor },
                    marginBottom: 1,
                    fontWeight: 'bold',
                  }}
                >
                  Yearly Allowable Leave
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: { textColor },
                    lineHeight: 20,
                    marginBottom: 10,
                  }}
                >
                  {data?.yearlyAllowableLeave}
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    color: { textColor },
                    marginBottom: 1,
                    fontWeight: 'bold',
                  }}
                >
                  Leave Balance
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: { textColor },
                    lineHeight: 20,
                    marginBottom: 10,
                  }}
                >
                  {data?.availableLeaveBalance}
                </Text>
              </View>
            </View>
          </View>

        </View>
      </ScrollView>
      <MaterialSnackbar ref={snackbarRef} />

    </ListWrapper>
  )
}

export default EmployeeDetails