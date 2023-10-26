import { StyleSheet, Text, View, FlatList, TouchableOpacity, Dimensions, Image, ActivityIndicator } from 'react-native'
import React from 'react'
import { openDatabase } from 'react-native-sqlite-storage'
import { useEffect } from 'react'
import { useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native'
import { useLayoutEffect } from 'react'
import { TextInput } from 'react-native-gesture-handler'

import { searchOption, listCardContainer, screenWidth } from '../../../../Containers/CustomComponents/Style'
import AddButton from '../../../../Containers/CustomComponents/AddButton'
import ListCard from '../../../../Containers/CustomComponents/ListCard'
import ListWrapper from '../../../../Containers/CustomComponents/ListWrapper';
import { textColor, appColor, whiteTextColor } from '../../../../Containers/CustomComponents/Image'


import { useMemo } from 'react'
import { gettingCompanyData } from '@/Containers/CustomComponents/GetTable'
import { store } from '@/Store'

const db = openDatabase({
  name: 'customer_database',
})

const Company = ({ navigation }) => {
  const [show, setShow] = useState(false);
  const [allCompanyData, setAllCompanyData] = useState()
  const [inputValue, setinputValue] = useState('')
  const [loading, setLoading] = useState(true)

  const isFocussed = useIsFocused();

  const filteredSuggestions = useMemo(
    () =>
      allCompanyData?.filter(
        suggestion =>
          suggestion?.companyName
            ?.toLowerCase()
            .indexOf(inputValue?.toLowerCase()) > -1,
      ),
    [inputValue, allCompanyData],
  )
  const showSeachBar = () => {
    setinputValue("")
    setShow(!show)
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: show ? null : undefined,
      headerRight: () => (
        !show &&
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
      headerTitle: show ? () => (
        <View style={{ flexDirection: 'row' }}>
          <View style={{ alignSelf: 'center' }}>
            <TouchableOpacity onPress={() => setShow(!show)}>
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
        'Companies'
      ),
    });
  }, [navigation, show, inputValue])

  const getCompanyData = async () => {
    const { data } = await gettingCompanyData()
    setAllCompanyData(data)
    data ? setLoading(false) : setLoading(true)
  }

  useEffect(() => {
    getCompanyData()
  }, [isFocussed])

  const RenderCompany = ({ data }) => {
    return (
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity
          style={{}}
          onPress={() => navigation.navigate('Company Details', { companyId: data?.companyId, mobileCompanyId: data?.mobileCompanyId })}
        >
          <View style={[listCardContainer, { flexDirection: 'row', alignItems: 'center' }]}>
            <View style={{ flex: 1 }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: { textColor },
                    fontWeight: '500',
                    marginBottom: 7.5,
                  }}
                >
                  {data?.companyName}
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
                  <Icon
                    name={'mail-sharp'}
                    color={textColor}
                    solid size={13}
                  />
                </View>
                <View >
                  <Text
                    style={{
                      fontSize: 16,
                      color: { textColor },
                    }}
                  >
                    {data?.email}
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
      <View style={{ flex: 1 }}>
        {loading ? (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <ActivityIndicator size='large' />
          </View>
        ) :
          <View style={{ flex: 1 }}>
            {filteredSuggestions?.length > 0 ?
              <FlatList
                data={inputValue ? filteredSuggestions : allCompanyData}
                gap={10}
                renderItem={({ item }) => <RenderCompany data={item} />}
                key={cats => cats.ids}
              />
              : <View style={{ alignItems: 'center' }}>
                <Text style={{ marginTop: 5 }}>No Data Found</Text>
              </View>
            }
          </View>}
      </View>
      {/* <AddButton navigation={navigation} screenName={"Add Company"} /> */}
    </ListWrapper>
  )
}

export default Company

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
    marginTop: 15,
  }
})