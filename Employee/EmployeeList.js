import { StyleSheet, Text, View, FlatList, TouchableOpacity,ActivityIndicator, Dimensions, Image } from 'react-native'
import React from 'react'
import { openDatabase } from 'react-native-sqlite-storage'
import { useEffect } from 'react'
import { useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native'
import { useLayoutEffect } from 'react'
import { TextInput } from 'react-native-gesture-handler'
import { screenWidth} from '../CustomComponents/Style'

import AddButton from '../CustomComponents/AddButton'
import ListCard from '../CustomComponents/ListCard'
import ListWrapper from '../CustomComponents/ListWrapper'
import { useMemo } from 'react'
import { textColor,whiteTextColor } from '../../Containers/CustomComponents/Image'
import { gettingEmployeeData } from '../CustomComponents/GetTable'


const db = openDatabase({
    name: 'customer_database',
})

const EmployeeList = ({ navigation }) => {
  const [allData, setAllData] = useState([])
  const [loading, setLoading] = useState(true)
  const [showSearch, setShowSearch] = useState(false)
  const [inputValue, setinputValue] = useState('')

    const isFocussed = useIsFocused();

    const filteredSuggestions = useMemo(
        () =>
            allData.filter(
                suggestion =>
                    suggestion.employeeName
                        ?.toLowerCase()
                        .indexOf(inputValue?.toLowerCase()) > -1,
            ),
        [inputValue, allData],
    )


    // const getEmployee = () => {
    //     db.transaction(txn => {
    //         txn.executeSql(
    //             'SELECT * from employee_info  ORDER BY id DESC',
    //             [],
    //             (tx, res) => {
    //                 let len = res.rows.length
    //                 if (len > 0) {
    //                     let results = []

    //                     for (let i = 0; i < len; i++) {
    //                         let item = res.rows.item(i)
    //                         results.push(item)
    //                     }
    //                     setAllData(results)
    //                 }
    //             },
    //             error => {
    //                 console.log('error while GETTING', error.message)
    //             },
    //         )
    //     })

    // }

    const getEmployee = async () => {
        const { data } = await gettingEmployeeData()
        setAllData(data)
        data ? setLoading(false) : setLoading(true)
      }
    useEffect(() => {
        getEmployee()
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
                <TouchableOpacity onPress={() => { setShowSearch(!showSearch) 
              setinputValue('')}}>
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
            `Employee`
          ),
        });
      }, [navigation, showSearch, inputValue])

    const RenderEmployee = ({ data }) => {
        return (
            <ListCard firstHeading={data.employeeName} secondHeading={data.employeeMobile} thirdHeading={data.employeeStatus} navigation={navigation} screenName="Employee Details" dataPass={data} />
        )
    }


    return (
        <ListWrapper>
        {console.log("store data", allData)}
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
                  data={inputValue ? filteredSuggestions : allData}
                  gap={10}
                  renderItem={({ item }) => <RenderEmployee data={item} />}
                  key={cats => cats.ids}
                />
                : <View style={{ alignItems: 'center' }}>
                  <Text style={{ marginTop: 5 }}>No Data Found</Text>
                </View>
              }
            </View>}
        </View>
        <AddButton navigation={navigation} screenName={"Add Employee"} />
  
      </ListWrapper>
    )
}

export default EmployeeList