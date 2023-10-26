import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native'
import React from 'react'
import { useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import {
  addButton,
  listCardContainer
} from '../../../../Containers/CustomComponents/Style'
import { useEffect } from 'react'
import { openDatabase } from 'react-native-sqlite-storage'
// import AddDealActivity from './AddDealActivity'
import { textColor } from '../../../../Containers/CustomComponents/Image'
import { findUserByUsername } from '@/Containers/CustomComponents/UsernameTable'
import { useIsFocused } from '@react-navigation/native'

const screenWidth = Dimensions.get('window').width

const db = openDatabase({
  name: 'customer_database',
})

export default function Activities({ navigation, header, route }) {
  const activityRoute = route?.params
  const [activityData, setActivityData] = useState([])
  const [activityDataPast, setActivityDataPast] = useState([])
  const isFocused = useIsFocused()

  const loadActivityTable = () => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * from activity_info where refId=?',
        [header?.contactId],
        (txn, res) => {
          let len = res.rows.length
          console.log('len', len)
          if (len > 0) {
            let results = []
            let resultPast = []
            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              results.push(item)
            }
            setActivityData(results)
          }
        },
        error => {
          console.log('error while GETTING', error.message)
        },
      )
    })
  }

  useEffect(() => {
    loadActivityTable()
  }, [isFocused])

  const RenderActivity = ({ data }) => {
    let formattedDate = new Date(data?.startDate)?.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
    const date = new Date('2022-01-01 ' + data?.activityTime)
    const options = { hour: '2-digit', minute: '2-digit', hour12: true }
    const time = date.toLocaleTimeString([], options)
    // const datePredict = new Date(data?.startDate)
    // const now = new Date()
    const userName = findUserByUsername(data?.owner)
    // const dealName = dealName.find(u => u.dealId === data?.dealId);
    return (
      <View style={{ alignItems: 'center' }}>
        {/* <TouchableOpacity onPress={() => editActivity(data)}> */}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Contact Activity Detail', {
              mobileActivityId: data?.mobileCalendarId,
              header: header,
              activityId: data?.calendarId,
            })
          }
        >
          <View
            style={[
              listCardContainer,
              { alignItems: 'center', flexDirection: 'row' },
            ]}
          >
            <View
              style={{
                flex: 0.15,
                backgroundColor:
                  data.priority == 'High'
                    ? 'red'
                    : data.priority == 'Medium'
                    ? '#ff9c3a'
                    : '#68ce39',
                height: 45,
                marginRight: 10,
                borderRadius: 50,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: 'white', fontSize: 25, fontWeight: '600' }}>
                {data.priority == 'High'
                  ? 'H'
                  : data.priority == 'Medium'
                  ? 'M'
                  : 'L'}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <View style={{ flex: activityRoute?.dealName ? 1 : 2 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: textColor ,
                      fontWeight: '400',
                      lineHeight: 20,
                      marginBottom: 10,
                    }}
                  >
                    {/* {data?.title.length > 20 ? data?.title.substring(0, 20) + "..." : data?.title} */}
                    {data?.title.length > 15 && activityRoute?.dealName
                      ? data?.title.substring(0, 15) + '...'
                      : data?.title.substring(0, 30)}
                  </Text>
                </View>
                <View
                  style={{
                    flex: activityRoute?.dealName ? 1 : 0,
                    alignItems: 'flex-end',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: textColor ,
                    }}
                  >
                    {activityRoute?.dealName || 'NA'}
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
                    flex: 2,
                  }}
                >
                  <View>
                    <Text style={{ fontSize: 14, color: textColor  }}>
                      {formattedDate.slice(0, 6)} {time}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1.3,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      color: textColor ,
                      lineHeight: 18,
                    }}
                  >
                    {data?.category}
                  </Text>
                </View>
                <View style={{ flex: 0.9, alignItems: 'flex-end' }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: textColor ,
                      lineHeight: 18,
                    }}
                  >
                    {userName?.name || 'Karen'}
                    {/* {data.owner?.slice(0, 5)} */}
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
    <>
      {console.log('merged data of activity', activityData)}
      <View style={{ marginBottom: 60 }}>
        <View>
          <FlatList
            data={activityData}
            gap={10}
            renderItem={({ item }) => <RenderActivity data={item} />}
          />
        </View>
      </View>

      <View
        style={{
          position: 'absolute',
          bottom: 20,
          right: 10,
        }}
      >
        <TouchableOpacity
          style={addButton}
          onPress={() =>
            navigation.navigate('Add Activity Contact', { header:header })
          }
          // onPress={() => setModalVisible(!modalVisible)}
        >
          <Image
            style={{ width: 18, height: 18, tintColor: '#FFF' }}
            source={require('../../../../MD/assets/chip/ic_plus.png')}
          />
        </TouchableOpacity>
      </View>
    </>
  )
}