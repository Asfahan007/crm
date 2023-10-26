import { View, Text, TouchableOpacity, Image, Keyboard } from 'react-native'
import React from 'react'
import { listCardContainer } from './Style'
import { appColor } from './Image'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { textColor } from './Image'
const ListCardContainer = (props) => {
  return (
    <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }} >
      <TouchableOpacity
        style={{}}
        onPress={() => props.navigation.navigate(props.screenName, props.dataPass)}
      >
        <View style={{ alignItems: 'center' }}>
          <View style={[listCardContainer, { flexDirection: 'row', alignItems: 'center' }]}>
            <View style={{ flex: 1.0 }}>
              <View style={{ flexDirection: 'row', flex: 1 }}>
                <View style={{ flex: 0.5 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#263238',
                      fontWeight: '500',
                      marginBottom: 2.5,
                    }}
                  >
                    {props?.firstHeading}
                  </Text>
                </View>
                <View style={{ flex: 0.4, flexDirection: "row", alignItems: 'center' }}>
                  {props?.firstHeadingRowIcon &&
                    <View style={{ marginRight: 5 }}>
                      <Icon
                        name={props.firstHeadingRowIcon}
                        solid
                        size={10}
                        color={'black'}
                      />
                    </View>}
                  <View>
                    <Text
                      style={{
                        fontSize: 16,
                        color: '#263238',
                        fontWeight: '500',
                        marginBottom: 2.5,
                      }}
                    >
                      {props?.firstHeadingRow}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{ flexDirection: 'row', flex: 1 }}>
                <View style={{ flex: 0.5 }}>
                  <Text
                    style={{
                      fontSize: 14, color: { textColor }
                    }}
                  >
                    {props?.secondHeading}
                  </Text>
                </View>
                <View style={{ flex: 0.4, flexDirection: "row", alignItems: 'center' }}>
                  <View style={{ marginRight: 5 }}>
                    <Icon
                      name={props.secondHeadingRowIcon}
                      solid
                      size={15}
                      color={'black'}
                    />
                  </View>
                  <View>
                    <Text
                      style={{
                        fontSize: 14, color: { textColor }
                      }}
                    >
                      {props.secondHeadingRow}
                    </Text>
                  </View>
                </View>
              </View>
              {props.thirdHeading &&
                <View style={{ flexDirection: 'row', flex: 1 }}>
                  <View style={{ flex: props.thirdHeadingRow ? 0.5 : 1.5 }}>
                    <Text
                      style={{
                        fontSize: 14, color: { textColor }
                      }}
                    >
                      {props.thirdHeading}
                    </Text>
                  </View>
                  <View style={{ flex: 0.5, flexDirection: "row", alignItems: 'center' }}>
                    {props.thirdHeadingRowIcon &&
                      <View style={{ marginRight: 5 }}>
                        {props.tagName == "FontAwesome" ?
                          <FontAwesome
                            name={props.thirdHeadingRowIcon}
                            solid
                            size={15}
                            color={'black'}
                          /> : <Icon
                            name={props.thirdHeadingRowIcon}
                            solid
                            size={15}
                            color={'black'}
                          />}
                      </View>}
                    <View>
                      <Text
                        style={{
                          fontSize: 14, color: { textColor }
                        }}
                      >
                        {props.thirdHeadingRow}
                      </Text>
                    </View>
                  </View>
                </View>}

              {props.fourthHeading &&
                <View style={{ flexDirection: 'row', flex: 1 }}>
                  <View style={{ flex: 0.5 }}>
                    <Text
                      style={{
                        fontSize: 14, color: { textColor }
                      }}
                    >
                      {props.fourthHeading}
                    </Text>
                  </View>
                  <View style={{ flex: 0.4, flexDirection: "row", alignItems: 'center' }}>
                    {props.fourthHeadingRowIcon &&
                      <View style={{ marginRight: 5 }}>
                        <Icon
                          name={props.fourthHeadingRowIcon}
                          solid
                          size={15}
                          color={'black'}
                        />
                      </View>}
                    <View>
                      <Text
                        style={{
                          fontSize: 14, color: { textColor }
                        }}
                      >
                        {props.fourthHeadingRow}
                      </Text>
                    </View>
                  </View>
                </View>}

              {props.fifthHeading &&
                <View style={{ flexDirection: 'row', flex: 1 }}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 14, color: { textColor }
                      }}
                    >
                      {props.fifthHeading}
                    </Text>
                  </View>
                </View>}
            </View>
            <View style={{ flex: 0.1 }}>
              {props.detailIcon == false ? null :
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
                </View>}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </TouchableWithoutFeedback>
  )
}

export default ListCardContainer