import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  Dimensions,
} from 'react-native'
import React, {
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
  useMemo,
} from 'react'
import AddCustomer from './AddEditCustomer'
import { openDatabase } from 'react-native-sqlite-storage'
import { useIsFocused } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Ionicons'
import { BackHandler } from 'react-native'
import { store } from '../../Store'
import { listCardContainer, searchOption } from '../CustomComponents/Style'
import ListWrapper from '../CustomComponents/ListWrapper'
import AddButton from '../CustomComponents/AddButton'
import ListCard from '../CustomComponents/ListCard'
import {
  textColor,
  whiteTextColor,
} from '../../Containers/CustomComponents/Image'
import { screenWidth } from '../CustomComponents/Style'

const db = openDatabase({
  name: 'customer_database',
})

const CustomerDetail = ({ route, navigation }) => {
  const height = Dimensions.get('window').height
  const width = Dimensions.get('window').width
  const isFocussed = useIsFocused()
  const [allData, setAllData] = useState([])
  const [fullData, setFullData] = useState([])
  const [show, setShow] = useState(false)
  const [backendData, setBackendData] = useState([])
  const [inputValue, setinputValue] = useState('')
  const [cache, setCache] = useState()
  const [showSearch, setShowSearch] = useState(false)

  let loginToken = store.getState().auth.token

  const filteredSuggestions = useMemo(
    () =>
      allData.filter(
        suggestion =>
          suggestion.customerName
            ?.toLowerCase()
            .indexOf(inputValue?.toLowerCase()) > -1 ||
          suggestion.customerMobile
            ?.toLowerCase()
            .indexOf(inputValue?.toLowerCase()) > -1,
      ),
    [inputValue, allData],
  )

  const getCustomer = () => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * from customer_info ORDER BY rowid DESC',
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
  console.log('alllllllllllllllllll', allData)
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
    navigation.navigate('Menu')
    return true
  }

  useEffect(() => {
    getCustomer()
    // GetSearchCustomers()
    deleteNullData()
  }, [isFocussed])

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick)
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      )
    }
  }, [])

  const showSeachBar = () => {
    setinputValue('')
    setShowSearch(!showSearch)
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: showSearch ? null : undefined,
      headerRight: () =>
        !showSearch && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              display: 'flex',
            }}
          >
            <View style={{ alignSelf: 'flex-end', marginRight: 10 }}>
              <TouchableOpacity onPress={() => showSeachBar()}>
                <Icon name={'md-search-outline'} color="#fff" solid size={25} />
              </TouchableOpacity>
            </View>
          </View>
        ),
      headerTitle: showSearch
        ? () => (
          <View style={{ flexDirection: 'row' }}>
            <View style={{ alignSelf: 'center' }}>
              <TouchableOpacity
                onPress={() => {
                  setShowSearch(!showSearch)
                  setinputValue('')
                }}
              >
                <Icon name={'arrow-back'} color="#fff" solid size={25} />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                borderColor: whiteTextColor,
                borderBottomWidth: 1,
                width: screenWidth / 1.25,
                marginHorizontal: 10,
                marginBottom: 5,
                justifyContent: 'space-between',
              }}
            >
              <View>
                <TextInput
                  value={inputValue}
                  color={whiteTextColor}
                  onChangeText={text => setinputValue(text)}
                  placeholder="Search"
                  placeholderTextColor={whiteTextColor}
                  style={{
                    paddingHorizontal: 10,
                    fontSize: 20,
                    marginBottom: -5,
                    width: screenWidth / 1.5,
                  }}
                />
              </View>
              <View style={{ alignSelf: 'flex-end', marginRight: 10 }}>
                <TouchableOpacity onPress={() => setinputValue('')}>
                  <Icon name={'close'} color="#fff" solid size={25} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )
        : 'Customers',
    })
  }, [navigation, showSearch, inputValue])

  const RenderCustomer = ({ data }) => {
    return (
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Customer Detail', { data })}
        >
          <View
            style={[
              listCardContainer,
              { alignItems: 'center', flexDirection: 'row' },
            ]}
          >
            <View
              style={{
                backgroundColor: '#C5C6D0',
                height: 50,
                marginRight: 10,
                borderRadius: 100,
                alignItems: 'center',
                justifyContent: 'center',
                width: 50,
              }}
            >
              <Text style={{ color: 'black', fontSize: 25, fontWeight: '600' }}>
                {/* {data.priority == 'High' ? "H" : data.priority == 'Medium' ? "M" : "L"} */}
                {data.customerName?.slice(0, 1)}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      // color: '#2e2e2e',
                      color: '#263238',
                      fontWeight: '500',
                      lineHeight: 20,
                      marginBottom: 10,
                    }}
                  >
                    {data.customerName}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 3,
                  }}
                >
                  <View>
                    <Text style={{ fontSize: 14, color: textColor }}>
                      {/* {data?.dealStage} */}
                      {data.customerMobile}
                    </Text>
                  </View>
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
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {filteredSuggestions.length > 0 ? (
            <FlatList
              contentContainerStyle={{ paddingBottom: 10 }}
              data={inputValue ? filteredSuggestions : allData}
              gap={10}
              renderItem={({ item }) => <RenderCustomer data={item} />}
              key={cats => cats.ids}
            />
          ) : (
            <View style={{ alignItems: 'center' }}>
              <Text style={{ marginTop: 5 }}>No Data Found</Text>
            </View>
          )}
        </View>
      </View>
      <AddButton navigation={navigation} screenName={'Add Customer'} />
    </ListWrapper>
  )
}

export default CustomerDetail
