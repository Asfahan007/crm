import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { homeCardContainer } from '../CustomComponents/Style'
import CardWrapper from '../CustomComponents/CardWrapper'
import { textColor } from '../../Containers/CustomComponents/Image'


const InventoryHome = ({ navigation }) => {
    return (
        <CardWrapper>

            <TouchableOpacity onPress={() => navigation.navigate("Inventory List")}
                style={homeCardContainer}>
                <Text style={{ fontSize: 17, color: { textColor }, fontWeight: 'bold' }}>Inventory</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Product Inventory")}
                style={homeCardContainer}>
                <Text style={{ fontSize: 17, color: { textColor }, fontWeight: 'bold' }}>Products</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => navigation.navigate("Return List")}
                style={homeCardContainer}>
                <Text style={{ fontSize: 17, color: { textColor }, fontWeight: 'bold' }}>Return</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("User List")}
                style={homeCardContainer}>
                <Text style={{ fontSize: 17, color: { textColor }, fontWeight: 'bold' }}>Purchase</Text>
            </TouchableOpacity> */}
        </CardWrapper>
    )
}
export default InventoryHome