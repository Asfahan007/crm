import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  Dimensions,ScrollView
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
import { listCardContainer, screenWidth, searchOption } from '../CustomComponents/Style'
import ListWrapper from '../CustomComponents/ListWrapper'
import AddButton from '../CustomComponents/AddButton'
import ListCard2 from '../CustomComponents/ListCard2'
import { appColor, textColor, whiteTextColor } from '../CustomComponents/Image'

const db = openDatabase({
  name: 'customer_database',
})


const InvoiceList = ({ route, navigation }) => {
  const height = Dimensions.get('window').height
  const width = Dimensions.get('window').width
  const isFocussed = useIsFocused()
  const [fullData, setFullData] = useState([])
  const [show, setShow] = useState(false)
  const [backendData, setBackendData] = useState([])
  const [inputValue, setinputValue] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  const filteredSuggestions = useMemo(
    () => fullData.filter((suggestion) => suggestion.invoiceNo?.toLowerCase().indexOf(inputValue?.toLowerCase()) > -1 || suggestion.customerName?.toLowerCase().indexOf(inputValue?.toLowerCase()) > -1),
    [inputValue, fullData]
  )

  useEffect(() => {
    getInvoiceList()
  }, [isFocussed])

  const showSeachBar = () => {
    setinputValue("")
    setShowSearch(!showSearch)
  }
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: showSearch ? null : undefined,
      headerRight: () => (
        !showSearch &&
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
      headerTitle: showSearch ? () => (
        <View style={{ flexDirection: 'row' }}>
          <View style={{ alignSelf: 'center' }}>
            <TouchableOpacity onPress={() => setShowSearch(!showSearch)}>
              <Icon name={'arrow-back'} color="#fff" solid size={25} />
            </TouchableOpacity>
          </View>
          <View style={{
            flexDirection: 'row',
            borderColor: whiteTextColor,
            borderBottomWidth: 1,
            width: screenWidth / 1.25,
            marginHorizontal: 10,
            marginBottom: 5,
            justifyContent: 'space-between'
          }}>
            <View>
              <TextInput
                value={inputValue}
                color={whiteTextColor}
                onChangeText={(text) => setinputValue(text)}
                placeholder="Search"
                placeholderTextColor={whiteTextColor}
                style={{
                  paddingHorizontal: 10,
                  fontSize: 20,
                  marginBottom: -5,
                  width: screenWidth / 1.5
                }}
              />
            </View>
            <View style={{ alignSelf: 'flex-end', marginRight: 10 }}>
              <TouchableOpacity onPress={() => setinputValue("")}>
                <Icon name={'close'} color="#fff" solid size={25} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        `Invoice List`
      ),
    });
  }, [navigation, showSearch, inputValue])

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => (
  //       <View
  //         style={{
  //           flexDirection: 'row',
  //           alignItems: 'center',
  //           display: 'flex',
  //         }}
  //       >
  //         <View style={{ alignSelf: 'flex-end', marginRight: 10 }}>
  //           <TouchableOpacity onPress={() => setShow(!show)}>
  //             <Icon name={'md-search-outline'} color="#fff" solid size={25} />
  //           </TouchableOpacity>
  //         </View>
  //       </View>
  //     ),
  //   })
  // }, [navigation, show])

  const getInvoiceList = () => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * from invoice_info ORDER BY id DESC',
        [],
        (tx, res) => {
          let len = res.rows.length
          console.log('len of invoice', len)
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

  console.log(fullData, "fullData")

  const RenderCustomer = ({ data }) => {
    return (
      
      <ListCard2 firstTitle="Invoice No" firstHeading={data.invoiceNo} secondTitle="Customer Name" secondHeading={data.customerName || 'NA' } thirdTitle="Total"  thirdHeading= {data?.total} fourthTitle="Pending Amount" fourthHeading={data?.pendingAmount || 'NA'}
      navigation={navigation} screenName="Invoice Detail" dataPass={data} />

    )
  }

  return (
    <ListWrapper>
      <View style={{ flex: 1 }}>
      {show ? (
          <View style={searchOption}>
            <TextInput
              value={inputValue}
              color={textColor}
              onChangeText={text => setinputValue(text)}
              placeholder="Search"
              placeholderTextColor="black"
              style={{
                paddingHorizontal: 10,
                borderRadius: 4,
                fontSize: 20,
              }}
            />
          </View>
        ) : null}
        <View>
          {
            filteredSuggestions.length > 0 ?
              <FlatList
                contentContainerStyle={{ paddingBottom: 10 }}
                data={inputValue ? filteredSuggestions : fullData}
                gap={10}
                renderItem={({ item }) => <RenderCustomer data={item} />}
                key={cats => cats.ids}
              /> : <View style={{ alignItems: 'center' }}>
                <Text style={{ marginTop: 5 }}>No Data Found</Text>
              </View>
          }
        </View>
      </View>
    </ListWrapper>

  )
}


export default InvoiceList
