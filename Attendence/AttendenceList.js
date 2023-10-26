import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
} from 'react-native'
import React, { useMemo } from 'react'
import { useEffect } from 'react'
import { openDatabase } from 'react-native-sqlite-storage'
import { useState } from 'react'
import { useIsFocused } from '@react-navigation/native'
import moment from 'moment'
import { useLayoutEffect } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import AddAttendence from './AddAttendence'
import { searchOption } from '../CustomComponents/Style'
import { screenWidth} from '../CustomComponents/Style'
import AddButton from '../CustomComponents/AddButton'
import ListCard from '../CustomComponents/ListCard'
import ListWrapper from '../CustomComponents/ListWrapper'
import { textColor,whiteTextColor } from '../CustomComponents/Image'
const db = openDatabase({
  name: 'customer_database',
})

const AttendenceList = ({ route, navigation }) => {
  const [attendanceData, setattendanceData] = useState([])
  const [show, setShow] = useState('')
  const [bardata, setBarData] = useState([])
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [inputValue, setinputValue] = useState('')
  const isFocussed = useIsFocused()
  console.log('routeAteen', route)

  const filteredSuggestions = useMemo(
    () =>
      attendanceData.filter(
        suggestion =>
          suggestion.employeeName
            ?.toLowerCase()
            .indexOf(inputValue?.toLowerCase()) > -1,
      ),
    [inputValue, attendanceData],
  )

  function time(timeIn, timeOut) {
    var date1 = new Date()
    var date2 = new Date()
    var time1 = timeIn.split(':')
    var time2 = timeOut.split(':')
    date1.setHours(time1[0], time1[1], time1[2])
    date2.setHours(time2[0], time2[1], time2[2])
    var diffInMilliseconds = date2 - date1
    var diffInHours = diffInMilliseconds / 1000 / 60 / 60
    if (diffInHours >= 8) {
      return 'Present'
    } else {
      return 'Absent'
    }
    // let timein = timeIn
    // let timeout = timeOut
    // let diff = moment(timein, "hh:mm:ss").diff(moment(timeout, "hh:mm:ss"));
    // let x = (moment(diff).utc().toDate().toUTCString()).slice(17, 25);
    // if (x < 5) {
    //     return "absent";
    // } else {
    //     return "present";
    // }
  }

  const getAttendence = () => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * from attendance_info ORDER BY id DESC',
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
            setattendanceData(results)
          }
        },
        error => {
          console.log('error while GETTING', error.message)
        },
      )
    })
  }

  useEffect(() => {
    getAttendence()
  }, [isFocussed])

  const RenderAttendence = ({ data }) => {
    return (
      <ListCard
        firstHeading={data.employeeName}
        secondHeading={data.attendanceDate?.slice(0,10)}
        thirdHeading={data.time}
        navigation={navigation}
        screenName="Attendence Detail"
        dataPass={data}
      />
    )
  }
  const showSeachBar = () => {
    setinputValue("")
    setShowSearch(!showSearch)
}

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerRight: () => (
  //       <View style={{ flexDirection: 'row' }}>
  //         <TouchableOpacity onPress={() => setShow(!show)}>
  //           <View style={{ alignSelf: 'flex-end', marginRight: 10 }}>
  //             <Icon name={'md-search-outline'} color="#fff" solid size={25} />
  //           </View>
  //         </TouchableOpacity>
  //         <TouchableOpacity
  //           onPress={() => navigation.navigate('Filter Attendence')}
  //         >
  //           <View style={{ alignSelf: 'flex-end', marginRight: 10 }}>
  //             <Icon name={'options-outline'} color="#fff" solid size={27} />
  //           </View>
  //         </TouchableOpacity>
  //       </View>
  //     ),
  //   })
  // }, [navigation, show])
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
            <TouchableOpacity onPress={() =>{ setShowSearch(!showSearch) 
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
        `Attendance`
      ),
    });
  }, [navigation, showSearch, inputValue])

  return (
    <ListWrapper>
      {console.log('Attendance lisssssst', attendanceData)}

      <View style={{ flex: 1 }}>
        {show ? (
          <View style={searchOption}>
            <TextInput
              value={inputValue}
              color={textColor}
              onChangeText={text => setinputValue(text)}
              placeholder="Search"
              placeholderTextColor={textColor}
              style={{
                paddingHorizontal: 10,
                borderRadius: 4,
                fontSize: 20,
              }}
            />
          </View>
        ) : null}
        <View>
          {route?.params && (
            <FlatList
              contentContainerStyle={{ paddingBottom: 10 }}
              data={route?.params?.data}
              gap={10}
              renderItem={({ item }) => <RenderAttendence data={item} />}
              key={cats => cats.ids}
            />
          )}
          {filteredSuggestions.length > 0 && !route?.params ? (
            <FlatList
              contentContainerStyle={{ paddingBottom: 10 }}
              data={inputValue ? filteredSuggestions : attendanceData}
              gap={10}
              renderItem={({ item }) => <RenderAttendence data={item} />}
              key={cats => cats.ids}
            />
          ) : (
            <View style={{ alignItems: 'center', marginTop: 10 }}>
              <Text>{route?.params ? '' : 'No Data Found'}</Text>
            </View>
          )}
          {/* <AddAttendence /> */}
        </View>
      </View>
      <AddButton navigation={navigation} screenName={'Add Attendence'} />
    </ListWrapper>
  )
}

export default AttendenceList

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
  },
})
