import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import CardWrapper from '../CustomComponents/CardWrapper'
import { homeCardContainer } from '../CustomComponents/Style'

const AdminHome = ({ navigation }) => {
    return (
        <CardWrapper>
            <TouchableOpacity onPress={() => navigation.navigate("Stores")}
                style={homeCardContainer}>
                <Text style={{ fontSize: 17, color: 'black', fontWeight: 'bold' }}>Stores</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Teritory List")}
                style={homeCardContainer}>
                <Text style={{ fontSize: 17, color: 'black', fontWeight: 'bold' }}>Territory</Text>
            </TouchableOpacity>
        </CardWrapper>
    )
}
export default AdminHome