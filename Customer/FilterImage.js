import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'

export default function FilterImage({navigation,onPress}) {
//   console.log(navigation)
    return (
    <View>
 <TouchableOpacity onPress={onPress}><Image
            source={{ uri: 'https://img.icons8.com/ios-glyphs/344/sorting-options.png' }}
            style={{ width: 30, height: 30,right:10,tintColor:'white'  }} />
          </TouchableOpacity>
    </View>
  )
}