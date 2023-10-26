import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import CardWrapper from '../../../Containers/CustomComponents/CardWrapper'
import { homeCardContainer } from '../../../Containers/CustomComponents/Style'

const DealMgmtHome = ({ navigation }) => {
    return (
        <CardWrapper>
            <TouchableOpacity onPress={() => navigation.navigate("AllDeals")}
                style={homeCardContainer}>
                <Text style={{ fontSize: 17, color: 'black', fontWeight: 'bold' }}>Deal</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Account")}
                style={homeCardContainer}>
                <Text style={{ fontSize: 17, color: 'black', fontWeight: 'bold' }}>Account</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("AllContact")}
                style={homeCardContainer}>
                <Text style={{ fontSize: 17, color: 'black', fontWeight: 'bold' }}>Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Quote")}
                style={homeCardContainer}>
                <Text style={{ fontSize: 17, color: 'black', fontWeight: 'bold' }}>Quotation</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Company")}
                style={homeCardContainer}>
                <Text style={{ fontSize: 17, color: 'black', fontWeight: 'bold' }}>Company</Text>
            </TouchableOpacity>
        </CardWrapper>
    )
}
export default DealMgmtHome