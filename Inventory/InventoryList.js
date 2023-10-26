import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    TextInput,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    ScrollView
} from 'react-native'
import React, { useEffect, useRef, useState, useLayoutEffect } from 'react'
import { useIsFocused } from '@react-navigation/native'
import { openDatabase } from 'react-native-sqlite-storage'
import AddNewInventory from './AddNewInventory';
import AddButton from '../CustomComponents/AddButton';
import ListWrapper from '../CustomComponents/ListWrapper';
import ListCard2 from '../CustomComponents/ListCard2';
import ListCardContainer from '../CustomComponents/ListCardContainer';
import { store } from '../../Store';
import Icon from 'react-native-vector-icons/Ionicons'
import { gettingInventoryData } from '../CustomComponents/GetTable';
import { useMemo } from 'react';
import { whiteTextColor } from '../CustomComponents/Image';
import { screenWidth } from '../CustomComponents/Style';
import { listCardContainer } from '../CustomComponents/Style';
import { textColor } from '../../Containers/CustomComponents/Image'


const db = openDatabase({
    name: 'customer_database',
})

const InventoryList = ({ navigation }) => {
    const isFocused = useIsFocused();
    const [inventoryData, setInventoryData] = useState([])
    const [showSearch, setShowSearch] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [loading, setLoading] = useState(true)

    const filteredSuggestions = useMemo(
        () =>
            inventoryData?.filter(
                suggestion =>
                    suggestion?.productName
                        ?.toLowerCase()
                        .indexOf(inputValue?.toLowerCase()) > -1
                    ||
                    suggestion?.category
                        ?.toLowerCase()
                        .indexOf(inputValue?.toLowerCase()) > -1,
            ),
        [inputValue, inventoryData],
    )


    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: showSearch ? null : undefined,
            headerRight: () => (
                !showSearch &&
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        display: 'flex',
                    }}
                >
                    <View style={{ alignSelf: 'flex-end', marginRight: 10 }}>
                        <TouchableOpacity onPress={() => showSeachBar()}>
                            <Icon name={'md-search-outline'} color="#fff" solid size={25} />
                        </TouchableOpacity>
                    </View>
                </View>
            ),
            headerTitle: showSearch ? () => (
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ alignSelf: 'center' }}>
                        <TouchableOpacity onPress={() => setShowSearch(!showSearch)}>
                            <Icon name={'arrow-back'} color="#fff" solid size={25} />
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        borderColor: whiteTextColor,
                        borderBottomWidth: 1,
                        width: screenWidth / 1.25,
                        marginHorizontal: 10,
                        marginBottom: 5,
                        justifyContent: 'space-between'
                    }}>
                        <View>
                            <TextInput
                                value={inputValue}
                                color={whiteTextColor}
                                onChangeText={(text) => setInputValue(text)}
                                placeholder="Search"
                                placeholderTextColor={whiteTextColor}
                                style={{
                                    paddingHorizontal: 10,
                                    fontSize: 20,
                                    marginBottom: -5,
                                    width: screenWidth / 1.5
                                }}
                            />
                        </View>
                        <View style={{ alignSelf: 'flex-end', marginRight: 10 }}>
                            <TouchableOpacity onPress={() => setInputValue("")}>
                                <Icon name={'close'} color="#fff" solid size={25} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ) : (
                `Inventory`
            ),
        });
    }, [navigation, showSearch, inputValue])

    const showSeachBar = () => {
        setInputValue("")
        setShowSearch(!showSearch)
    }

    const getInventory = async () => {
        const { data } = await gettingInventoryData()
        setInventoryData(data)
        data ? setLoading(false) : setLoading(true)
    }


    useEffect(() => {
        getInventory()
    }, [isFocused])

    const RenderInventory = ({ data }) => {
        return (
            <ListCard2 firstTitle="Product Name" firstHeading={data.productName} secondTitle="Quantity" secondHeading={data.qty || "1"} thirdTitle="Price/Unit"  thirdHeading= {` ${data.mrp}`} fourthTitle="Date" fourthHeading={data?.createdDate?.slice(0, 10) || 'NA'}
                navigation={navigation} screenName="Inventory Details" dataPass={{productInventoryId: data?.productInventoryId, mobileProductInventoryId: data?.mobileProductInventoryId }} />
           
            )
    }

    return (
        <ListWrapper>
            <View style={{ flex: 1 }}>
                {console.log("inventory", inventoryData)}
                {loading ? (
                    <View
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                    >
                        <ActivityIndicator size='large' />
                    </View>
                ) :
                    <View style={{ flex: 1 }}>
                        {filteredSuggestions?.length > 0 ?
                            <FlatList
                                data={inputValue ? filteredSuggestions : inventoryData}
                                gap={10}
                                renderItem={({ item }) => <RenderInventory data={item} />}
                                key={cats => cats.ids}
                            />
                            : <View style={{ alignItems: 'center' }}>
                                <Text style={{ marginTop: 5 }}>No Data Found</Text>
                            </View>
                        }
                    </View>}
            </View>
            <AddButton navigation={navigation} screenName={"Add Inventory"} />
        </ListWrapper>
    )
}

export default InventoryList

