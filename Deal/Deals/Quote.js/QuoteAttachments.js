import { View, Text } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
const QuoteAttachments = () => {
    return (
        <View style={{
            flexDirection: 'row', backgroundColor: 'white', margin: 10, justifyContent: "space-between", display: 'flex', marginBottom: 15,
            padding: 15,
            elevation: 3,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
        }}>
            <View style={{ flexDirection: 'row' }}>
                <View>
                    <Icon name={'attach-sharp'} color="black" solid size={20} />
                </View>
                <View style={{}}>
                    <Text>Product Details</Text>
                </View>
            </View>
            <View style={{ alignSelf: 'flex-end', }}>
                <Icon name={'eye-sharp'} color="black" solid size={20} />
            </View>
        </View>
    )
}

export default QuoteAttachments