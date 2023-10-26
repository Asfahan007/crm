import { View, Image, ScrollView, StyleSheet, Keyboard } from 'react-native'
import React from 'react'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { screenHeight, screenWidth } from './Style'
import { BG_IMG } from './Image'

const CardWrapper = (props) => {
    return (
        <View style={{ flex: 1 }}>
            <Image
                source={{ uri: BG_IMG }}
                style={StyleSheet.absoluteFill}
                blurRadius={120}
                width={screenWidth}
                height={screenHeight}
            />
            <View style={{ alignItems: 'center' }}>
                <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
                    <ScrollView
                        nestedScrollEnabled={true}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps={'always'}
                    >
                        {props.children}
                    </ScrollView>
                </TouchableWithoutFeedback>
            </View>
        </View>
    )
}

export default CardWrapper