import { View, Text, TouchableOpacity, Image, Keyboard } from 'react-native'
import React from 'react'
import { listCardContainer } from './Style'
import { appColor } from './Image'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { textColor } from '../CustomComponents/Image'


const ListCard = (props) => {
  return (
    <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }} >
      <TouchableOpacity
        style={{}}
        onPress={() => props.navigation.navigate(props.screenName, props.dataPass)}
      >
        <View style={{ alignItems: 'center' }}>
          <View style={[listCardContainer, { flexDirection: 'row', alignItems: 'center' }]}>
            <View style={{ flex: 1 }}>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#263238',
                    fontWeight: '500',
                    marginBottom: 2.5,
                  }}
                >
                  {props.firstHeading}
                </Text>
              </View>
              <View >
                <Text
                  style={{
                    fontSize: 14, color: { textColor }
                  }}
                >
                  {props.secondHeading}
                </Text>
              </View>
              {props.thirdHeading &&
                <View >
                  <Text
                    style={{
                      fontSize: 14, color: { textColor }
                    }}
                  >
                    {props.thirdHeading}
                  </Text>
                </View>}

            </View>
            {props.benefit &&
              <View style={{ flex: 1 }}>
                <View >
                  <Text
                    style={{
                      fontSize: 14, color: { textColor }
                    }}
                  >
                    {props.benefit}
                  </Text>
                </View>
              </View>}
            {/* {!props.benefit &&
              <View style={{ flex: 0.1 }}>
                <View>
                  <TouchableOpacity
                    style={{}}
                    onPress={() => props.navigation.navigate(props.screenName, props.dataPass)}
                  >
                    <View>
                      <Image
                        style={{
                          width: 20,
                          height: 20,
                          tintColor: appColor,
                        }}
                        source={require('../../Assets/Images/ic_chevron_right.png')}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            } */}
          </View>
        </View>
      </TouchableOpacity>
    </TouchableWithoutFeedback>
  )
}

export default ListCard