import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import CardWrapper from '../CustomComponents/CardWrapper'
import { homeCardContainer } from '../CustomComponents/Style'
import { textColor } from '../../Containers/CustomComponents/Image'


const CustomerMgmt = ({ navigation }) => {

    return (
        <CardWrapper>
            <TouchableOpacity onPress={() => navigation.navigate("Customer List")}
                style={homeCardContainer}>
                <Text style={{ fontSize: 17, color: {textColor}, fontWeight: 'bold' }}>Customer</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Invoice List")}
                style={homeCardContainer}>
                <Text style={{ fontSize: 17, color: {textColor}, fontWeight: 'bold' }}>Invoice</Text>
            </TouchableOpacity>
        </CardWrapper>
    )
}


const styles = StyleSheet.create({

    dropdown: {
        paddingVertical: 30,
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#A3A6C5',
        borderWidth: 1,
        elevation: 10,
        backgroundColor: 'white',
        width: "90%",
    },
})
export default CustomerMgmt