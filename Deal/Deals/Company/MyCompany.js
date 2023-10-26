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
  } from 'react-native'
  import React, { useEffect, useRef, useState, useLayoutEffect } from 'react'
  import Icon from 'react-native-vector-icons/Ionicons'
  import { store } from '../../../../Store'
  import { listCardContainer } from '../../../../Containers/CustomComponents/Style'
import { textColor } from '../../../../Containers/CustomComponents/Image'

  
  const MyCompany = ({ navigation, listData }) => {
    const height = Dimensions.get('window').height
    const width = Dimensions.get('window').width
    const [activeTab, setActiveTab] = useState('All Accounts')
    const [show, setShow] = useState('All Accounts')
  
    const profile = store.getState().auth.profile.name
  
    return (
      <View style={{ flex: 1}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {listData.map(data => {
            return (
              data.createdBy === profile && (
                <View style={{ alignItems: 'center' }}>
                  <View style={[listCardContainer, { flexDirection: 'row', alignItems: 'center', flex:0 }]}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontSize: 16,
                            color: {textColor},
                            fontWeight: '500',
                            marginBottom: 7.5,
                          }}
                        >
                          {data.companyName}
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          alignItems: 'center'
                        }}
                      >
                        <View style={{ marginRight: 2, marginTop: 2.5 }}>
                          <Icon
                            name={'md-globe-sharp'}
                            color={textColor}
                            solid
                            size={13}
                          />
                        </View>
                        <View >
                          <Text
                            style={{
                              fontSize: 16,
                              color: {textColor},
                            }}
                          >
                            {data.website}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={{ flex: 0.1 }}>
                      <View>
                        <TouchableOpacity
                          style={{}}
                          onPress={() => navigation.navigate('Company Details', {data})}
                        >
                          <View>
                            <Image
                              style={{
                                width: 20,
                                height: 20,
                                tintColor: '#00b8ce',
                              }}
                              source={require('../../../../Assets/Images/ic_chevron_right.png')}
                            />
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              )
            )
          })}
        </ScrollView>
      </View>
    )
  }
  const styles = StyleSheet.create({
    noData: {
      // display: 'flex',
      // flex: 1,
      // justifyContent: 'center',
      // alignItems: 'center',
    },
    nodataText: {
      fontSize: 150,
      color: '#000',
    },
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
      // justifyContent: 'center',
      // marginTop: 15,
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
  export default MyCompany
  