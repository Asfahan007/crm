import { View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { addButton, screenHeight } from './Style'

const AddButton = (props) => {
    return (
        <View
        style={{
          position: 'absolute',
          top: screenHeight - 200,
          right: 10
        }}
      >
        <TouchableOpacity
          style={addButton}
          onPress={() => props.navigation.navigate(props.screenName)}
        >
          <Image
            style={{ width: 18, height: 18, tintColor: '#FFF' }}
            source={require('../../MD/assets/chip/ic_plus.png')}
          />
        </TouchableOpacity>
      </View>
    )
}

export default AddButton