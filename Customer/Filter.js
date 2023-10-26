import React, { useContext, useState } from 'react';
import { useRef } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, Modal, Alert, StyleSheet, style } from 'react-native';
import { openDatabase } from 'react-native-sqlite-storage'
import { Picker } from '@react-native-picker/picker';
import { useEffect } from 'react';
import { Dropdown } from 'react-native-element-dropdown'
import { textColor } from '../../Containers/CustomComponents/Image'



const db = openDatabase({
  name: "customer_database",
})
const Filter = ({ navigation }) => {
  var arr = []
  const [filter, setFilter] = useState([]);
  const [value, setValue] = useState(null)
  const [filterStatus, setFilterStatus] = useState("");
  const [dropDown, setDropDown] = useState([]);
  const [active, setActive] = useState("");
  const [ispress, setIspress] = useState(false);
  const [ispress2, setIspress2] = useState(false);
  const [isFocus, setIsFocus] = useState(false)
  const [storeName, setStoreName] = useState(false)



  const Active = () => {
    setActive("Active");
    setIspress(true)
    setIspress2(false)
  }

  const InActive = () => {
    setActive("Inactive");
    setIspress2(true)
    setIspress(false)
  }
  useEffect(() => {
    getStoreName()
  }, [])

  const getStoreName = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'select distinct storeName from customer_info',
        [],
        (tx, results) => {
          var len = results.rows.length;
          if (len > 0) {
            arr[0] = { "storeName": "" }
            let j = 1;
            for (let i = 0; i < len; i++) {
              arr[j] = results.rows.item(i)
              j++;
            }
            setDropDown(arr);

          } else {
            error();
          }
        }

      );

    })
  };


  const Filtering = () => {
    if (active && filterStatus) {
      db.transaction((tx) => {
        tx.executeSql(
          'select * from customer_info where storeName = ? and customerStatus = ?',
          [filterStatus, active],
          (tx, results) => {
            var len = results.rows.length;
            if (len > 0) {
              for (let i = 0; i < len; i++) {
                arr[i] = results.rows.item(i)
              }
              { (arr.length != 0) ? navigation.navigate("Customer List", { data: arr }) : null }
            } else {
              error();
            }
          }
        );
      });

    }
    if (filterStatus && !active) {
      db.transaction((tx) => {
        tx.executeSql(
          'select * from customer_info where storeName = ?',
          [filterStatus],
          (tx, results) => {
            var len = results.rows.length;
            if (len > 0) {
              for (let i = 0; i < len; i++) {
                arr[i] = results.rows.item(i)
              }
              { (arr.length != 0) ? navigation.navigate("Customer List", { data: arr }) : null }
            } else {
              error();
            }
          }
        );
      });
    }
    if (active && !filterStatus) {
      db.transaction((tx) => {
        tx.executeSql(
          'select * from customer_info where customerStatus = ?',
          [active],
          (tx, results) => {
            var len = results.rows.length;
            if (len > 0) {
              for (let i = 0; i < len; i++) {
                arr[i] = results.rows.item(i)
              }
              { (arr.length != 0) ? navigation.navigate("Customer List", { data: arr }) : null }
            } else {
              error();
            }
          }

        );

      });

    }
  }
  const styles = {
    container: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: 10
    },
    buttonactive: {
      alignItems: "center",
      backgroundColor: ispress ? "#00b8ce" : '#f1f5f7',
      padding: 10,
      width: 100,
      height: 50,
      marginTop: 25,
      marginLeft: 30,
      borderRadius: 4
    },
    buttonInactive: {
      alignItems: "center",
      backgroundColor: ispress2 ? "#00b8ce" : '#f1f5f7',
      padding: 10,
      height: 50,
      width: 100,
      marginLeft: 205,
      marginTop: -50,
      borderRadius: 4
    },
    buttons: {
      alignItems: "center",
      backgroundColor: "#00b8ce",
      width: 100,
      height: 40,
      position: 'relative',
      marginLeft: 130,
      borderRadius: 4,
      marginBottom: 10
    }, card: {
      margin: 10,
      color: '#000',
      paddingHorizontal: 10,
      paddingBottom: 10,
      backgroundColor: 'white',
      elevation: 3,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      borderRadius: 4,
    }, text: {
      color: "grey",
      fontSize: 16,
      marginTop: 4
    }, dropdown: {
      height: 50,
      borderColor: 'gray',
      borderWidth: 0.5,
      borderRadius: 8,
      paddingHorizontal: 8,
      color: '#000',
      marginTop: 30,
      backgroundColor: "#f1f5f7",
      marginBottom: 20,
      width: 280,
      marginLeft: 26

      //   backgroundColor:'grey'
    }, placeholderStyle: {
      fontSize: 16,
      color: 'black',
    }, texSub: {
      color: "#fff",
      textAlign: 'center',
      justifyContent: 'center',
      marginTop: 10
    }

  }

  return (
    <>
      <View style={styles.card}>
        <View><Text style={{ color: {textColor}, marginLeft: 30, top: 15, fontSize: 16 }}>Select Status</Text></View>
        <View>< TouchableOpacity onPress={() => Active()}
          style={styles.buttonactive}
        >
          <Text style={styles.text}>Active</Text>
        </TouchableOpacity></View>
        <View>
          <TouchableOpacity id='inActive' onPress={() => InActive()}
            style={styles.buttonInactive}
          >
            <Text style={styles.text}>Inactive</Text>
          </TouchableOpacity>
        </View>

        <View>
          <View><Text style={{ color: {textColor}, marginLeft: 30, top: 20, fontSize: 16 }}>Select Store Name</Text></View>

          <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: '#00b8ce' }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            data={dropDown}
            search
            maxHeight={300}
            containerStyle={styles.item}
            itemContainerStyle={styles.item}
            itemTextStyle={styles.text}
            labelField="storeName"
            valueField="value"
            value={value}
            placeholder={!isFocus ? 'Select Store Name' : 'storeName'}
            searchPlaceholder="Search..."
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setValue(item.value)
              setStoreName(item.storeName)

              setFilterStatus(item.storeName)
              setIsFocus(false)
            }}
          /></View>
        <TouchableOpacity
          style={styles.buttons}
          onPress={Filtering}
        >
          <Text style={styles.texSub}>Filter</Text>
        </TouchableOpacity>


      </View>



    </>
  )
};
export default Filter


