import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
  Easing
} from 'react-native'
import React, { useEffect, useRef, useState, useLayoutEffect, useMemo } from 'react'
import { openDatabase } from 'react-native-sqlite-storage'
import { useIsFocused } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Ionicons';
import { BackHandler } from "react-native";
import AnimatedAddButton from '../../../../Containers/CustomComponents/AnimatedAddButton'
import { BG_IMG } from '../../../../Containers/CustomComponents/Image';

const db = openDatabase({
  name: 'customer_database',
})

const SPACING = 20;
const AVATAR_SIZE = 85;
const ITEM_SIZE = AVATAR_SIZE + SPACING * 2 / 3

const BottomsheetDemo = ({ route, navigation }) => {
  const scrollY = React.useRef(new Animated.Value(0)).current
  const height = Dimensions.get('window').height;
  const width = Dimensions.get('window').width;

  var filteredData = route.params != undefined ? route.params.data : []
  const isFocussed = useIsFocused();
  const [allData, setAllData] = useState([])
  const [inputValue, setinputValue] = useState('')
  const [show, setShow] = useState(false);

  const filteredSuggestions = useMemo(
    () => allData.filter((suggestion) => suggestion.customerName.toLowerCase().indexOf(inputValue?.toLowerCase()) > -1 || suggestion.customerMobile.toLowerCase().indexOf(inputValue?.toLowerCase()) > -1),
    [inputValue, allData]
  )

  const getCustomer = () => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * from customer_info ORDER BY id DESC',
        [],
        (tx, res) => {
          let len = res.rows.length
          console.log('len', len)
          if (len > 0) {
            let results = []
            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              results.push(item)
            }
            setAllData(results)
          }
        },
        error => {
          console.log('error while GETTING', error.message)
        },
      )
    })
  }


  //delete the rows with customerName null and accept backend response
  const deleteNullData = () => {
    db.transaction(txn => {
      txn.executeSql(
        'delete from customer_info where customerName is "";',
        [],
        (tx, res) => {
          // console.log("table row deleted with customerName null", res);
        },
        error => {
          // console.log('error while deleting row', error.message)
        },
      )
    })
  }

  function handleBackButtonClick() {
    navigation.navigate("Menu")
    return true;
  }

  useEffect(() => {
    getCustomer()
    // GetSearchCustomers()
    deleteNullData()
  }, [isFocussed])

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
    };
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            display: 'flex',
          }}
        >
          <View style={{ alignSelf: 'flex-end', marginRight: 10 }}>
            <TouchableOpacity onPress={() => setShow(!show)}>
              <Icon name={'md-search-outline'} color="#fff" solid size={25} />
            </TouchableOpacity>
          </View>
          <View style={{ alignSelf: 'flex-end', marginRight: 10 }}>
            <TouchableOpacity onPress={() => navigation.navigate('Filter')}>
              <Icon name={'options-outline'} color="white" solid size={26} />
            </TouchableOpacity>
          </View>
        </View>
      ),
    })
  }, [navigation, show])


  return (
    <>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <Image
          source={{ uri: BG_IMG }}
          style={StyleSheet.absoluteFill}
          blurRadius={80}
        />
        {show ? (
          <View
            style={styles.searchBox}
          >
            <TextInput
              value={inputValue}
              color='black'
              onChangeText={(text) => setinputValue(text)}
              placeholder="Search"
              placeholderTextColor='black'
              style={{
                paddingHorizontal: 7.5,
                borderRadius: 4,
                fontSize: 20,
              }}
            />
          </View>) : null}
        {filteredSuggestions.length > 0 ?
          <Animated.FlatList
            data={inputValue ? filteredSuggestions : allData}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
            contentContainerStyle={{
              paddingHorizontal: SPACING / 2,
              paddingVertical: SPACING / 3,
              // paddingTop:StatusBar.currentHeight || 42 
            }}
            keyExtractor={item => item.key}
            renderItem={({ item, index }) => {
              const inputRange = [
                -1,
                0,
                ITEM_SIZE * index,
                ITEM_SIZE * (index + 2)
              ]
              const scale = scrollY.interpolate({
                inputRange,
                outputRange: [1, 1, 1, 0]
              })
              return <Animated.View style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', transform: [{ scale }] }}>
                <Animated.View style={[styles.card, styles.elevation]}>
                  <View style={{ paddingHorizontal: SPACING / 4 }}>
                    <Text style={{ fontSize: 18, fontWeight: '500' }}>{item.customerName}</Text>
                    <Text style={{ fontSize: 16, opacity: .7 }}>{item.customerMobile}</Text>
                    <Text style={{ fontSize: 14, opacity: .5 }}>{item.storeName}</Text>
                  </View>
                </Animated.View>
                <TouchableOpacity onPress={() => {
                  navigation.navigate("Customer Detail", item)
                }} style={{ justifyContent: 'center', alignItems: 'center', marginLeft: 5 }}>
                  <Icon name={'eye-outline'}
                    // color="white"
                    size={25}
                    style={{ height: 30, width: 35, backgroundColor: 'white', borderRadius: 50, paddingLeft: 5, paddingTop: 2 }}
                  />
                </TouchableOpacity>
              </Animated.View>
            }}
            showsVerticalScrollIndicator={false}
          /> : <View style={{flex:1, justifyContent:'center', alignItems:"center"}}><Text>No Data found</Text></View>}
      </View>
      <View style={{
        position: 'absolute', paddingTop: height - 100, width: "100%",
        borderRadius: 40
      }}>
        {/* <TouchableOpacity
          style={styles.addButton}

          onPress={() => navigation.navigate('Add Customer')}
        >
          <Image
            style={{ width: 18, height: 18, tintColor: '#FFF' }}
            source={require('../../../../MD/assets/chip/ic_plus.png')}
          />
        </TouchableOpacity> */}
        {/* <AddCustomer /> */}
        <AnimatedAddButton navigation={navigation} screenName="Add Contact Custom" bottom={40} />
        {/* <View style={{
          position: 'absolute',
          bottom: 105,
          right: 0,
        }}>
          <TouchableWithoutFeedback
            onPress={() => {
              toggleExpansion();
            }}
          >
            <Animated.View style={[{
              width: animationHeight, height: 60, flexDirection: 'row', borderTopLeftRadius: 20,
              borderBottomLeftRadius: 20, alignItems: 'center', overflow: 'hidden',
              borderColor: '#999',
              borderWidth: 0.5,
              backgroundColor: '#FFF',
              elevation: 4
            }]}>
              <FontAwesome5 name={expanded ? 'chevron-right' : 'chevron-left'}
                color="#808080"
                size={20}
                style={{ left: 20, position:'absolute' }}
              />
              <TouchableOpacity onPress={() => navigation.navigate('Add Customer')}>
                <FontAwesome5 name={'plus'}
                  color="#1db8cf"
                  size={35}
                  style={{ marginLeft: 30 }}
                />
              </TouchableOpacity>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View> */}
      </View>

    </>
  )
}
const styles = StyleSheet.create({
  addButton: {
    height: 55,
    width: 55,
    backgroundColor: '#00b8ce',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    position: 'absolute',
    bottom: 60,
    right: 20
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: SPACING / 2.5,
    width: '90%',
    marginVertical: SPACING / 3,
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: AVATAR_SIZE
  },
  elevation: {
    elevation: 20,
    shadowColor: '#000',
  },
  searchBox: {
    backgroundColor: '#fff',
    padding: 5,
    marginVertical: 5,
    borderRadius: 10,
    borderColor: '#00b8ce',
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginTop: 15,
    elevation: 20,
    shadowColor: '#000',
  }
})

export default BottomsheetDemo;

