import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import React, {
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
  useMemo,
} from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import MyQuote from './MyQuote'
import PullOverAddQuote from './PullOverAddQuote'
import { useIsFocused } from '@react-navigation/native'
import { openDatabase } from 'react-native-sqlite-storage'
import Shared from './Shared'
import { store } from '../../../../Store'
import { useSelector } from 'react-redux'
import NetInfo from '@react-native-community/netinfo'
import {
  searchOption,
  screenWidth,
  listCardContainer,
} from '../../../../Containers/CustomComponents/Style'
import AddButton from '../../../../Containers/CustomComponents/AddButton'
import HeaderNavbar from '../../../../Containers/CustomComponents/HeaderNavbar'
import ListWrapper from '../../../../Containers/CustomComponents/ListWrapper'
import {
  whiteTextColor,
  textColor,
  appColor,
} from '../../../../Containers/CustomComponents/Image'
import { gettingQuotationData } from '@/Containers/CustomComponents/GetTable'
const db = openDatabase({
  name: 'customer_database',
})

const Quote = ({ navigation }) => {
  const height = Dimensions.get('window').height
  const width = Dimensions.get('window').width
  const [activeTab, setActiveTab] = useState('All Quotes')
  const [show, setShow] = useState('All Quotes')
  const [quoteData, setQuoteData] = useState([])
  const isFocused = useIsFocused()
  const [inputValue, setinputValue] = useState('')

  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [filteredData, setFilteredData] = useState([])
  const [online, setOnline] = useState(false)
  const profile = store.getState().auth.profile.name
  const storeSync = useSelector(state => state.SyncLength.storetable)
  const customerSync = useSelector(state => state.SyncLength.customertable)
  const dealSync = useSelector(state => state.SyncLength.allDealTable)
  const accountSync = useSelector(state => state.SyncLength.accountTable)
  const contactSync = useSelector(state => state.SyncLength.contactTable)
  const isFocus = useIsFocused()
  const [allQuoteData, setAllQuoteData] = useState()
  const [myQuoteData, setMyQuoteData] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // set user to online
    NetInfo.addEventListener(state => {
      if (state.isConnected) {
        // console.log('user is connected')
        setOnline(true)
      }
    })
    // return () => unsubscribe()
  }, [])

  const onChange = text => {
    setSearch(text)
    let temp = quoteData.filter(item => item.createdBy === profile)
    let temp2 = quoteData.filter(
      item => item.createdBy === profile && item.owner === item.createdBy,
    )
    if (text.length === 0) {
      // data.createdBy === profile
      if (show === 'All Quotes') {
        setFilteredData(quoteData)
      } else if (show === 'My Quotes') {
        setFilteredData(temp)
      } else {
        setFilteredData(temp2)
      }
    } else {
      if (show === 'All Quotes') {
        let filteredData = quoteData?.filter(
          data =>
            data?.title?.toLowerCase()?.includes(text?.toLowerCase()) ||
            data?.dealName?.toLowerCase()?.includes(text?.toLowerCase()) ||
            data?.expiryDate?.toLowerCase()?.includes(text?.toLowerCase()),
        )
        setFilteredData([...filteredData])
      } else if (show === 'My Quotes') {
        let filteredData = temp?.filter(
          data =>
            data?.title?.toLowerCase()?.includes(text?.toLowerCase()) ||
            data?.dealName?.toLowerCase()?.includes(text?.toLowerCase()) ||
            data?.expiryDate?.toLowerCase()?.includes(text?.toLowerCase()),
        )
        setFilteredData([...filteredData])
      } else {
        let filteredData = temp2?.filter(
          data =>
            data?.title?.toLowerCase()?.includes(text?.toLowerCase()) ||
            data?.dealName?.toLowerCase()?.includes(text?.toLowerCase()) ||
            data?.expiryDate?.toLowerCase()?.includes(text?.toLowerCase()),
        )
        setFilteredData([...filteredData])
      }
    }
  }

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => (
  //       <View style={{ flexDirection: 'row', alignItems: 'center' }}>
  //         <View style={{ alignSelf: 'flex-end', marginRight: 10 }}>
  //           <TouchableOpacity
  //             onPress={() => {
  //               setShowSearch(!showSearch)
  //             }}
  //           >
  //             <Icon name={'md-search-outline'} color="#fff" solid size={25} />
  //           </TouchableOpacity>
  //         </View>

  //       </View>
  //     ),
  //   })
  // }, [showSearch])

  const filteredSuggestions = useMemo(
    () =>
      show === 'All Quotes'
        ? allQuoteData?.filter(
            suggestion =>
              suggestion.title
                ?.toLowerCase()
                .indexOf(inputValue?.toLowerCase()) > -1,
          )
        : myQuoteData?.filter(
            suggestion =>
              suggestion.title
                ?.toLowerCase()
                .indexOf(inputValue?.toLowerCase()) > -1,
          ),
    [inputValue, allQuoteData, myQuoteData, show],
  )
  // const filteredSuggestions = useMemo(
  //   () =>
  //     quoteData.filter(
  //       suggestion =>
  //         suggestion.title?.toLowerCase().indexOf(inputValue?.toLowerCase()) >
  //         -1,
  //     ),
  //   [inputValue, quoteData],
  // )
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
                <TouchableOpacity onPress={() => setShowSearch(!showSearch)}>
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
        : `Quotes`,
    })
  }, [navigation, showSearch, inputValue])

  useEffect(() => {
    getQuoteData()
  }, [isFocused])

  const getQuoteData = async () => {
    const {data} = await gettingQuotationData()
    setAllQuoteData(data)
    data ? setLoading(false) : setLoading(true)
  }
  console.log('quooooote', allQuoteData)

  useEffect(() => {
    let myData = allQuoteData?.filter(
      item => item?.createdBy === store.getState().auth.profile.name,
    )
    setMyQuoteData(myData)
  }, [allQuoteData])

  const RenderQuote = ({ data }) => {
         

    return (
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity
          style={{}}
          onPress={() =>
            navigation.navigate('Quote Detail', {
              quotationId: data.quotationId,
              mobileQuotationId: data.mobileQuotationId,
            })
          }
        >
          <View style={[listCardContainer, { flexDirection: 'row', alignItems: 'center' }]}>
            <View style={{ flex: 1 }}>
              <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                color: { textColor },
                fontWeight: '500',
                lineHeight: 20,
                marginBottom: 5,
              }}
            >
              {/* {data.title} */}
              {data?.title.length > 35
                ? data?.title.substring(0, 30) + '...'
                : data?.title}
            </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 5,
              }}
            >
              <View style={{ marginRight: 2 }}>
                <Text
                  style={{
                    fontSize: 15,
                    color: { textColor },
                    fontWeight: 'bold',
                  }}
                >
                  Deal:
                </Text>
              </View>
              <View>
                <Text style={{ fontSize: 15, color: { textColor } }}>
                  {data.dealName.length > 30
                    ? data.dealName.substring(0, 27) + '...'
                    : data.dealName}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ marginRight: 2 }}>
                <Text
                  style={{
                    fontSize: 15,
                    color: { textColor },
                    fontWeight: 'bold',
                  }}
                >
                  Expiring{' '}
                </Text>
              </View>
              <View>
                <Icon name={'calendar-sharp'} solid size={20} color={'black'} />
              </View>
              <View>
                <Text style={{ fontSize: 15, color: { textColor } }}>
                  {' '}
                  {data?.expiryDate?.slice(0, 10) || 'NA'}
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
          text="All Quotes"
          btnColor="#00b8ce"
          textColor="white"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          navigation={navigation}
          setShow={setShow}
        />
        <HeaderNavbar
          text="My Quotes"
          btnColor="white"
          textColor={textColor}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          navigation={navigation}
          setShow={setShow}
        />
      </View>
      <View style={{ flex: 1 }}>
        {loading ? (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            {filteredSuggestions?.length > 0 ? (
              <FlatList
                data={
                  inputValue
                    ? filteredSuggestions
                    : show === 'All Quotes'
                    ? allQuoteData
                    : myQuoteData
                }
                gap={10}
                renderItem={({ item }) => <RenderQuote data={item} />}
                key={cats => cats.ids}
              />
            ) : (
              <View style={{ alignItems: 'center' }}>
                <Text style={{ marginTop: 5 }}>No Data Found</Text>
              </View>
            )}
          </View>
        )}
      </View>
      <AddButton navigation={navigation} screenName={'Add Quote'} />
    </ListWrapper>
  )

  // const getQuatation = () => {
  //   db.transaction(txn => {
  //     db.transaction(tx => {
  //       tx.executeSql(
  //         'SELECT * FROM quotation order by id DESC',
  //         [],
  //         (tx, results) => {
  //           var tempArr = []
  //           for (let i = 0; i < results.rows.length; ++i) {
  //             tempArr.push(results.rows.item(i))
  //           }
  //           console.log(tempArr, 'eeeeee')
  //           setQuoteData(tempArr)
  //           setFilteredData(tempArr)
  //         },
  //       )
  //     })
  //   })
  // }
  // useEffect(() => {
  //   getQuatation()
  // }, [isFocused])

  // return (
  //   <ListWrapper>
  //     <View
  //       style={{ flexDirection: 'row', alignSelf: 'center', marginBottom: 5 }}
  //     >
  //       <HeaderNavbar
  //         text="All Quotes"
  //         btnColor="#00b8ce"
  //         textColor="white"
  //         activeTab={activeTab}
  //         setActiveTab={setActiveTab}
  //         navigation={navigation}
  //         setShow={setShow}
  //       />
  //       <HeaderNavbar
  //         text="My Quotes"
  //         btnColor="white"
  //         textColor={textColor}
  //         activeTab={activeTab}
  //         setActiveTab={setActiveTab}
  //         navigation={navigation}
  //         setShow={setShow}
  //       />
  //       {/* <HeaderNavbar
  //         text="Shared"
  //         btnColor="white"
  //         textColor={textColor}
  //         activeTab={activeTab}
  //         setActiveTab={setActiveTab}
  //         navigation={navigation}
  //         setShow={setShow}
  //       /> */}
  //     </View>
  //     {/* {showSearch ? (
  //       <View
  //         style={searchOption}
  //       >
  //         <TextInput
  //           value={search}
  //           color={textColor}
  //           onChangeText={onChange}
  //           placeholder="Search"
  //           placeholderTextColor="black"
  //           style={{
  //             paddingHorizontal: 10,
  //             borderRadius: 4,
  //             fontSize: 20,
  //           }}
  //         />
  //       </View>
  //     ) : null} */}
  //     {/* <View
  //       style={{ zIndex: 1, position: 'absolute', width: '100%', bottom: -10 }}
  //     >
  //       <PullOverAddQuote navigation={navigation} />
  //     </View> */}
  //     <ScrollView nestedScrollEnabled={true}>
  //       {show === 'All Quotes' ? (
  //         <View style={{ flex: 1, marginTop: 5 }}>
  //           {console.log('aaya', quoteData)}
  //           {filteredSuggestions.map(data => {
  //             return (
  //               <View style={[styles.card]}>
  //                 <TouchableOpacity
  //                   style={{
  //                     flexDirection: 'row',
  //                     alignItems: 'center',
  //                     justifyContent: 'space-between',
  //                   }}
  //                   onPress={() => navigation.navigate('Quote Detail', { quotationId: data?.quotationId })}
  //                 >
  //                   <View>
  //                     <Text
  //                       style={{
  //                         fontSize: 16,
  //                         color: { textColor },
  //                         fontWeight: '500',
  //                         lineHeight: 20,
  //                         marginBottom: 5,
  //                       }}
  //                     >
  //                       {/* {data.title} */}
  //                       {data?.title.length > 35 ? data?.title.substring(0, 30) + "..." : data?.title}
  //                     </Text>
  //                     <View
  //                       style={{
  //                         flexDirection: 'row',
  //                         alignItems: 'center',
  //                         marginBottom: 5,
  //                       }}
  //                     >
  //                       <View style={{ marginRight: 2 }}>
  //                         <Text
  //                           style={{
  //                             fontSize: 15,
  //                             color: { textColor },
  //                             fontWeight: 'bold',
  //                           }}
  //                         >
  //                           Deal:
  //                         </Text>
  //                       </View>
  //                       <View>
  //                         <Text style={{ fontSize: 15, color: { textColor } }}>
  //                           {data.dealName.length > 30 ? data.dealName.substring(0, 27) + "..." : data.dealName}
  //                         </Text>
  //                       </View>
  //                     </View>
  //                     <View
  //                       style={{ flexDirection: 'row', alignItems: 'center' }}
  //                     >
  //                       <View style={{ marginRight: 2 }}>
  //                         <Text
  //                           style={{
  //                             fontSize: 15,
  //                             color: { textColor },
  //                             fontWeight: 'bold',
  //                           }}
  //                         >
  //                           Expiring{' '}
  //                         </Text>
  //                       </View>
  //                       <View>
  //                         <Icon
  //                           name={'calendar-sharp'}
  //                           solid
  //                           size={20}
  //                           color={'black'}
  //                         />
  //                       </View>
  //                       <View>
  //                         <Text style={{ fontSize: 15, color: { textColor } }}>
  //                           {' '}
  //                           {data?.expiryDate?.slice(0, 10) || "NA"}
  //                         </Text>
  //                       </View>
  //                     </View>
  //                   </View>

  //                   {/* <View style={styles.arrowbutton}>
  //                     <Image
  //                       style={{
  //                         width: 20,
  //                         height: 20,
  //                         tintColor: appColor,
  //                       }}
  //                       source={require('../../../../Assets/Images/ic_chevron_right.png')}
  //                     />
  //                   </View> */}
  //                 </TouchableOpacity>
  //               </View>
  //             )
  //           })}
  //         </View>
  //       ) : show === 'My Quotes' ? (
  //         <MyQuote navigation={navigation} quoteData={filteredSuggestions} />)

  //         : (
  //           <Shared navigation={navigation} quoteData={filteredData} />
  //         )
  //       }
  //     </ScrollView>

  //     <AddButton navigation={navigation} screenName={"Add Quote"} />

  //   </ListWrapper>
  // )
}

export default Quote

const styles = StyleSheet.create({
  addButton: {
    height: 55,
    width: 55,
    backgroundColor: '#00b8ce',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  arrowbutton: {
    height: 35,
    width: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'white',
    marginHorizontal: 10,
    // marginTop: 5,
    marginBottom: 10,
    padding: 15,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
  },
})
