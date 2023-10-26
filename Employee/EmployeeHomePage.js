import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import CardWrapper from '../CustomComponents/CardWrapper'
import { homeCardContainer } from '../CustomComponents/Style'
import { textColor } from '../../Containers/CustomComponents/Image'


const EmployeeHomePage = ({ navigation }) => {

    return (
        <CardWrapper>
            <TouchableOpacity onPress={() => navigation.navigate("Employee List")}
                style={homeCardContainer}>
                <Text style={{ fontSize: 17, color: {textColor}, fontWeight: 'bold' }}>Employee</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Attendence List")}
                style={homeCardContainer}>
                <Text style={{ fontSize: 17, color: {textColor}, fontWeight: 'bold' }}>Attendance</Text>
            </TouchableOpacity>
        </CardWrapper>
    )
}

export default EmployeeHomePage