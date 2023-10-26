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
import { openDatabase } from 'react-native-sqlite-storage'
import { useIsFocused } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'
import { store } from '../../../../Store'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {
  listCardContainer,
  screenWidth,
  searchOption,
} from '../../../../Containers/CustomComponents/Style'
import AddButton from '../../../../Containers/CustomComponents/AddButton'
import HeaderNavbar from '../../../../Containers/CustomComponents/HeaderNavbar'
import ListWrapper from '../../../../Containers/CustomComponents/ListWrapper'
import { textColor, appColor, whiteTextColor } from '../../../../Containers/CustomComponents/Image'
import { gettingContactData } from '@/Containers/CustomComponents/GetTable'
const db = openDatabase({
  name: 'customer_database',
})

const AllContact = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Contacts')
  const [show, setShow] = useState('Contacts')
  const [shows, setShows] = useState(false)
  const [allContactData, setAllContactData] = useState([])
  const [myContactData, setMyContactData] = useState([])
  const isFocused = useIsFocused()
  const [inputValue, setinputValue] = useState('')
  const [loading, setLoading] = useState(true)

  const filteredSuggestions = useMemo(
    () =>
      show == "Contacts" ?
        allContactData?.filter(
          suggestion =>
            suggestion.contactName
              .toLowerCase()
              .indexOf(inputValue?.toLowerCase()) > -1 ||
            suggestion.phoneNo.toLowerCase().indexOf(inputValue?.toLowerCase()) >
            -1,
        ) :
        myContactData?.filter(
          suggestion =>
            suggestion.contactName
              .toLowerCase()
              .indexOf(inputValue?.toLowerCase()) > -1 ||
            suggestion.phoneNo.toLowerCase().indexOf(inputValue?.toLowerCase()) >
            -1,
        ),
    [inputValue, allContactData, myContactData, show],
  )

  const showSeachBar = () => {
    setinputValue("")
    setShows(!shows)
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: shows ? null : undefined,
      headerRight: () => (
        !shows &&
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
      headerTitle: shows ? () => (
        <View style={{ flexDirection: 'row' }}>
          <View style={{ alignSelf: 'center' }}>
            <TouchableOpacity onPress={() => setShows(!shows)}>
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
        'Contacts'
      ),
    });
  }, [navigation, shows, inputValue])

  useEffect(() => {
    getContactData()
  }, [isFocused])


  const getContactData = async () => {
    const { data } = await gettingContactData()
    setAllContactData(data)
    data ? setLoading(false) : setLoading(true)
  }

  useEffect(() => {
    let myData = allContactData?.filter(item => item?.createdBy === store.getState().auth.profile.name)
    setMyContactData(myData)
  }, [allContactData])

  const RenderContacts = ({ data }) => {
    return (
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity
          style={{}}
          onPress={() => navigation.navigate('All Contact Detail', { contactId: data?.contactId, mobileContactId: data?.mobileContactId })}
        >
          <View
            style={[
              listCardContainer,
              { flexDirection: 'row', alignItems: 'center' },
            ]}
          >
            <View style={{ flex: 1 }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: textColor,
                    fontWeight: '500',
                    marginBottom: 7.5,
                  }}
                >
                  {data?.contactName}
                </Text>
              </View>

              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <View style={{ marginRight: 2, marginTop: 2.5 }}>
                  <Icon name={'mail-sharp'} color="black" solid size={13} />
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      color: textColor,
                    }}
                  >
                    {data?.email?.length > 20
                      ? data?.email.substring(0, 15) + '...'
                      : data?.email}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ flex: 0.6 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 29,
                }}
              >
                <View style={{ marginRight: 2, marginTop: 2.5 }}>
                  <Icon name={'call-sharp'} color="#000" solid size={13} />
                </View>
                <View>
                  <Text style={{ fontSize: 16, color: textColor }}>
                    {data?.phoneNo}
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
      {console.log("all contact data", allContactData)}
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          width: screenWidth,
        }}
      >
        <HeaderNavbar
          text="Contacts"
          btnColor="#00b8ce"
          textColor="white"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          navigation={navigation}
          setShow={setShow}
        />
        <HeaderNavbar
          text="Group"
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
        ) :
          <View style={{ flex: 1 }}>
            {filteredSuggestions.length > 0 ? (
              <FlatList
                contentContainerStyle={{ paddingBottom: 50 }}
                data={inputValue ? filteredSuggestions : show === 'Contacts' ? allContactData : myContactData}
                extraData={allContactData}
                gap={10}
                renderItem={({ item }) => <RenderContacts data={item} />}
              />
            ) : (
              <View style={{ alignItems: 'center' }}>
                <Text style={{ marginTop: 5 }}>No Data Found</Text>
              </View>
            )}
          </View>
        }
      </View>
      <AddButton navigation={navigation} screenName={'Add Contacts'} />
    </ListWrapper>
  )
}


export default AllContact