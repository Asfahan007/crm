import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { screenWidth } from './Style'
import { appColor, highlightedColor, textColor } from './Image'

const HeaderNavbar = (props) => {
    const headerChange = props => {
        props.setActiveTab(props.text)
        console.log(props)
        props.setShow(props.text)
    }
    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity
                style={{
                    borderBottomColor: props.activeTab != props.text ? textColor : 'white',
                    borderBottomWidth: 5,
                    backgroundColor: appColor,
                    paddingVertical: 15,
                    paddingHorizontal: 6,
                    justifyContent: 'center',
                    alignItems: 'center',
                    
                }}
                onPress={() => headerChange(props)}
            >
                <Text
                    style={{
                        color: props.activeTab != props.text ? highlightedColor : 'white',
                        fontSize: 15,
                        fontWeight: '600',
                    }}
                >
                    {props.text}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default HeaderNavbar