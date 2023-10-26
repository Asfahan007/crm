import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { useState, useEffect } from 'react'
import { openDatabase } from 'react-native-sqlite-storage'
import { useLayoutEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { cardContainer } from '../CustomComponents/Style';
import ListWrapper from '../CustomComponents/ListWrapper';
import { textColor } from '../../Containers/CustomComponents/Image'

const db = openDatabase({
    name: "customer_database",
})

const InventoryDetails = ({ route, navigation }) => {
    const idd = route.params.id
    { console.log('inventory details', route) }
    const [inventoryDetail, setInventoryDetail] = useState([])

    useEffect(() => {
        getInventoryById()
    }, [])

    const getInventoryById = async () => {
        await db.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM inventory_info where productInventoryId = ? or mobileProductInventoryId=?',
                [route?.params?.productInventoryId, route?.params?.mobileProductInventoryId],
                (txn, res) => {
                    const results = Array.from({ length: res.rows.length }, (_, i) =>
                        res.rows.item(i),
                    )
                    setInventoryDetail(results)
                },
                error => {
                    console.log(
                        'error select * from account productInventoryId = ? or mobileProductInventoryId=?' +
                        error.message,
                    )
                },
            );
        });
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate("Add Inventory", inventoryDetail[0])} >
                    <View style={{ alignSelf: 'flex-end', marginRight: 10 }}>
                        <Icon name={'create-outline'} color="#fff" solid size={25} />
                    </View>
                </TouchableOpacity>
            ),
        });
    }, [navigation, inventoryDetail]);

    return (
        <ListWrapper>
            {console.log("inventory details", inventoryDetail)}
            <View style={[cardContainer, { marginHorizontal: 10, padding: 10 }]}>
                <Text style={{ fontSize: 20, color: { textColor }, marginTop: 10 }}>Product Category : {inventoryDetail[0]?.category}</Text>
                <Text style={{ fontSize: 16, color: { textColor }, marginTop: 10 }}>SubCategory : {inventoryDetail[0]?.subCategory}</Text>
                <Text style={{ fontSize: 16, color: { textColor }, marginTop: 10 }}>Product : {inventoryDetail[0]?.productName}</Text>
                <Text style={{ fontSize: 16, color: { textColor }, marginTop: 10 }}>Size : {inventoryDetail[0]?.sizing}</Text>
                <Text style={{ fontSize: 16, color: { textColor }, marginTop: 10 }}>Quantity : {inventoryDetail[0]?.qty}</Text>
                <Text style={{ fontSize: 16, color: { textColor }, marginTop: 10 }}>Price : {inventoryDetail[0]?.mrp}</Text>
            </View>
        </ListWrapper>
    )
}

export default InventoryDetails
