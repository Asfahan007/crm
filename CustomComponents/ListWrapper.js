import { View, Image, ScrollView, StyleSheet } from 'react-native'
import React from 'react'
import { screenHeight, screenWidth } from './Style'
import { BG_IMG } from './Image'

const ListWrapper = (props) => {
    return (
        <View style={{ flex: 1 }}>
            <Image
                source={{uri:BG_IMG}}
                style={StyleSheet.absoluteFill}
                blurRadius={120}
                width={screenWidth}
                height={screenHeight}
            />
            {props.children}
        </View>
    )
}

export default ListWrapper