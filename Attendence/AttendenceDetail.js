import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { useState, useEffect } from 'react'
import { openDatabase } from 'react-native-sqlite-storage'
import moment from 'moment'
import { useLayoutEffect } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import { useIsFocused } from '@react-navigation/native'
import ListWrapper from '../CustomComponents/ListWrapper'
import { cardContainer } from '../CustomComponents/Style'
import { textColor } from '../CustomComponents/Image'
const db = openDatabase({
  name: 'customer_database',
})

const AttendenceDetail = ({ route, navigation }) => {
  const idd = route?.params?.id
  const [data, setData] = useState(' ')
  const [diff, setDiff] = useState('')

  const isFocussed = useIsFocused()
  var hours

  const time = () => {
    let timein = data.inTime
    let timeout = data.outTime
    let diff = moment(timeout, 'HH:mm:ss').diff(moment(timein, 'HH:mm:ss'))
    let x = moment.utc(diff).format('HH:mm:ss')
    setDiff(x)
    hours = x
  }
  const getAttendenceById = async () => {
    await db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM attendance_info where id = ?',
        [idd],
        (tx, results) => {
          var len = results.rows.length
          if (len > 0) {
            let res = results.rows.item(0)
            setData(res)
          } else {
            updateAllStates('', '', '', '');
          }
        },
      )
    })
  }

  useEffect(() => {
    getAttendenceById()
  }, [isFocussed])

  useEffect(() => {
    time()
  })
  useLayoutEffect(() => {
    console.log('idddd', idd)
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('Add Attendence', route)}
        >
          <View style={{ alignSelf: 'flex-end', marginRight: 10 }}>
            <Icon name={'create-outline'} color="#fff" solid size={25} />
          </View>
        </TouchableOpacity>
      ),
      title: <Text>{route?.params.employeeName}</Text>,
    })
  }, [navigation])

  return (
    <ListWrapper>
      <View style={[cardContainer, { marginHorizontal: 10, padding: 10 }]}>
        <Text style={{ fontSize: 20, color: {textColor} }}>
          Employee Name : {data.employeeName}
        </Text>
        <Text style={{ fontSize: 16, color: {textColor}, marginTop: 10 }}>
          Date Of Attendance : {data.attendanceDate?.slice(0,10)}
        </Text>
        <Text style={{ fontSize: 16, color: {textColor}, marginTop: 10 }}>
          Time In : {data.inTime}
        </Text>
        <Text style={{ fontSize: 16, color: {textColor}, marginTop: 10 }}>
          Time Out : {data.outTime}
        </Text>
        <Text style={{ fontSize: 16, color: {textColor}, marginTop: 10 }}>
          Hours : {diff}
        </Text>
      </View>
    </ListWrapper>
  )
}

export default AttendenceDetail

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 5,
    padding: 15,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
  },
})
