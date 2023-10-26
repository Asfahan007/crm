import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { cancelButton, cancelText, saveAndCancel, saveButton, saveText } from './Style'

const SaveAndCancelButton = (props) => {
    return (
        <View style={saveAndCancel}>
            <View>
                <TouchableOpacity
                    style={saveButton}
                    onPress={props.handleSubmit}
                >
                    <Text style={saveText}>{props.saveTitle}</Text>
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity style={cancelButton}
                    // onPress={() => props.navigation.navigate(props.screenName, props.dataPass)}
                    onPress={() => props.navigation.goBack()}
                >
                    <Text style={cancelText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default SaveAndCancelButton