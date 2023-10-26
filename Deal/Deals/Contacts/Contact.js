import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { textColor } from '../../../../Containers/CustomComponents/Image'
const Contact = ({ navigation }) => {
    return (
        <View style={{ alignItems: "center" }}>
            <TouchableOpacity onPress={() => navigation.navigate("AllContact")}
                style={styles.dropdown}>
                <Text style={{ fontSize: 17, color: textColor, fontWeight: 'bold' }}>All Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("MyContact")}
                style={styles.dropdown}>
                <Text style={{ fontSize: 17, color: textColor, fontWeight: 'bold' }}>My Contact</Text>
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({

    dropdown: {
        paddingVertical: 40,
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#e4e4e4',
        borderWidth: 2,
        width: "90%",
    },
})
export default Contact