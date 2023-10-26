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
import React, { useEffect, useRef, useState, useLayoutEffect } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import MyAccount from '../Account/MyAccount'
import { store } from '../../../../Store'
import MultiSelect from '../Deals/MultiSelect'
import { appColor } from '@/Containers/CustomComponents/Image'

const Shared = ({ navigation, quoteData }) => {
  const height = Dimensions.get('window').height
  const width = Dimensions.get('window').width
  const [activeTab, setActiveTab] = useState('All Quotes')
  const [show, setShow] = useState('All Quotes')

  const profile = store.getState().auth.profile.name

  const listData = [
    {
      quoteTitle: 'Gupta Electronics - 100 TV',
      deal: 'Gupta Electronics 100 TV by end of July',
      expiryDate: '2023-07-01',
    },
  ]
  return (
    <View>
      {quoteData.map(data => {
        return (
          data.createdBy === profile &&
          data.owner === data.createdBy && (
            <View style={[styles.card]}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                onPress={() => navigation.navigate('Quote Detail', data)}
              >
                <View>
                  {/* <Text style={{ fontSize:14, color: '#616161', marginBottom: 10 }}>Deal</Text> */}
                  <Text
                    style={{
                      fontSize: 16,
                      color: 'black',
                      fontWeight: '500',
                      lineHeight: 20,
                      marginBottom: 5,
                    }}
                  >
                    {data.title}
                  </Text>
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
                          color: 'black',
                          fontWeight: 'bold',
                        }}
                      >
                        Deal:
                      </Text>
                    </View>
                    <View>
                      <Text style={{ fontSize: 15, color: 'black' }}>
                        {data.dealName}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                  >
                    <View style={{ marginRight: 2 }}>
                      <Text
                        style={{
                          fontSize: 15,
                          color: 'black',
                          fontWeight: 'bold',
                        }}
                      >
                        Expiring{' '}
                      </Text>
                    </View>
                    <View>
                      <Icon
                        name={'calendar-sharp'}
                        solid
                        size={20}
                        color={'black'}
                      />
                    </View>
                    <View>
                      <Text style={{ fontSize: 15, color: 'black' }}>
                        {' '}
                        {data?.expiryDate?.slice(0, 10) || "NA"}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.arrowbutton}>
                  <Image
                    style={{
                      width: 20,
                      height: 20,
                      tintColor: appColor,
                    }}
                    source={require('../../../../Assets/Images/ic_chevron_right.png')}
                  />
                </View>
              </TouchableOpacity>
            </View>
          )
        )
      })}
    </View>
  )
}
export default Shared

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
    // marginTop: 15,
  },
  card: {
    backgroundColor: 'white',
    marginHorizontal: 10,
    marginTop: 5,
    marginBottom: 10,
    padding: 15,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
  },
})
