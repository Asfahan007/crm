import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput,Alert } from 'react-native'
import React from 'react'
import { useLayoutEffect } from 'react'
import { useState } from 'react'
import { screenWidth, searchOption } from '../CustomComponents/Style'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { store } from '@/Store'
import { getNotificationData } from '../CustomComponents/GetNotification'
import { useEffect } from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import { appColor, textColor, whiteTextColor } from '../CustomComponents/Image'
import { useMemo } from 'react'
import { openDatabase } from 'react-native-sqlite-storage'
import Swipeable from 'react-native-gesture-handler/Swipeable';


const db = openDatabase({
    name: 'customer_database',
  })
  
const NotificationScreen = ({ route, navigation }) => {
    const [notifications, setNotifications] = useState([]);
    const [notificationLength, setNotificationLength] = useState(0)
    const [show, setShow] = useState(false)
    const [inputValue, setinputValue] = useState('')
  const [showHamberger, setShowHamberger] = useState(false)


    const fetchData = async () => {
        try {
            const { response, filteredLength } = await getNotificationData();
            setNotifications(response)
            setNotificationLength(filteredLength)
        } catch (error) {
            console.log("error in getting data", error)
        }
    };

    const filteredSuggestions = useMemo(
        () => notifications.filter((suggestion) => JSON.parse(suggestion?.notificationData)?.title?.toLowerCase().indexOf(inputValue?.toLowerCase()) > -1 || JSON.parse(suggestion?.notificationData)?.message?.toLowerCase().indexOf(inputValue?.toLowerCase()) > -1),
        [inputValue, notifications]
    )

    useEffect(() => {
        fetchData();
    
    }, [navigation])

    const removeNotification = (item) => {
        Alert.alert(
          'Please Confirm!',
          `Do you really want to remove notification`,
          [
            { text: 'Yes', onPress: () => removeNoti(item) },
            { text: 'No', onPress: () => setShowHamberger(!showHamberger) },
          ],
          { cancelable: false },
        )
      }
    
      const removeNoti = (item) => {
        console.log(`https://apps.trisysit.com/posbackendapi/api/deleteNotification/${item?.notificationId}`,"jjjjjjjjjjjjj")
        fetch(
          `https://apps.trisysit.com/posbackendapi/api/deleteNotification/${item?.notificationId}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer' + store.getState().auth.token,
            },
          },
        )
          .then(response => {
            response?.status == 200
              ? fetchData()
              : Alert.alert(
                  'Error',
                  'Network error',
                  [
                    {
                      text: 'Ok',
                    },
                  ],
                  { cancelable: false },
                )
          })
          .catch(error => console.log('errorrr', console.log(error)))
      }

    
      const [note, setNote] = useState([
        {
          title: 'Follow Up',
          author: 'Julio',
        },
      ])
    const showSeachBar = () => {
        setinputValue("")
        setShow(!show)
    }
    

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: show ? null : undefined,
            headerRight: () => (
                !show &&
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
            headerTitle: show ? () => (
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ alignSelf: 'center' }}>
                        <TouchableOpacity onPress={() => setShow(!show)}>
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
                                onChangeText={(text) => setinputValue(text)}
                                placeholder="Search"
                                placeholderTextColor={whiteTextColor}
                                style={{
                                    paddingHorizontal: 10,
                                    fontSize: 20,
                                    marginBottom: -5,
                                    width:screenWidth/1.5
                                }}
                            />
                        </View>
                        <View style={{ alignSelf: 'flex-end', marginRight: 10 }}>
                            <TouchableOpacity onPress={() => setinputValue("")}>
                                <Icon name={'close'} color="#fff" solid size={25} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ) : (
                `Notifications(${notificationLength})`
            ),
        });
    }, [navigation, notificationLength, show, inputValue])

    const navigateToNotificationDetail = async (item, index) => {
        await fetch(
            `https://apps.trisysit.com/posbackendapi/api//notificationMarkasRead/${item?.notificationId}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer' + store.getState().auth.token,
                },
                body: {}
            },
        )
        fetchData()

        if (item?.notificationSource === "Contact") {
            navigation.navigate("All Contact Detail", { contactId: item?.sourceId })
        }
        if (item?.notificationSource === "Account") {
            // alert(item.notificationSource)
            navigation.navigate("Account Detail", { accountId: item?.sourceId })
        }
        if (item?.notificationSource === "Quotation") {
            navigation.navigate("Quote Detail", { quotationId: item?.sourceId })
        }
        if (item?.notificationSource === "Deal") {
            navigation.navigate("Deal Detail", { dealId: item?.sourceId })
            // alert(item.notificationSource)
        }
        if (item?.notificationSource === "Company") {
            navigation.navigate("Company Details", { companyId: item?.sourceId })
            
           
        }
    }

    const RenderNotification = ({ item, index }) => (
        <Swipeable>
        <TouchableOpacity onPress={() => navigateToNotificationDetail(item)}>
            <View style={[styles.notification, {
                backgroundColor: item?.isRead === "false" ? '#d9d9d9' : "white"
            }]}>
                <View style={styles.logoContainer}>
                    <MaterialCommunityIcons name={item?.notificationSource === "Contact" ? 'contacts-outline' : item?.notificationSource === "Account" ? 'account-outline' : item?.notificationSource === "Deal" ? 'handshake-outline' : item?.notificationSource === "Quotation" ? 'file-document-edit-outline' : 'home-city-outline'} color="black" solid size={25} />
                </View>
                <View style={styles.notificationDetails}>
                    <Text style={styles.notificationTitle}>{(JSON?.parse(item?.notificationData))?.title || "NA"}</Text>
                    <Text style={styles.notificationSubtitle}>{(JSON?.parse(item?.notificationData))?.message || "NA"}</Text>
                </View>

               
                <Text style={styles.notificationTime}>{item.time}</Text>
                 <View>
                                  <TouchableOpacity
                                    onPress={() => removeNotification(item)}
                                  >
                                    <View style={{ alignSelf: 'flex-start',marginTop:10 }}>
                                      <MaterialCommunityIcons
                                        name={'delete-outline'}
                                        color={appColor}
                                        solid
                                        size={22}
                                      />
                                    </View>
                                  </TouchableOpacity>
                                </View>
            </View>
           
        </TouchableOpacity>
        </Swipeable>
    );

    return (
        <View style={styles.container}>
            {
                filteredSuggestions.length > 0 ?
                    <FlatList
                        contentContainerStyle={{ paddingBottom: 10 }}
                        data={filteredSuggestions}
                        gap={10}
                        renderItem={({ item }) => <RenderNotification item={item} />}
                        // keyExtractor={(_item, index) => 'key' + index}
                        // contentContainerStyle={styles.notificationList}
                        key={cats => cats.ids}
                    /> : <View style={{ alignItems: 'center' }}>
                        <Text style={{ marginTop: 5 }}>No Data Found</Text>
                    </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 1,
    },
    notificationList: {
        width: '90%',
    },
    notification: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        marginBottom: 1,
        width: screenWidth,
    },
    logoContainer: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        flex: 1,
        resizeMode: 'contain',
    },
    notificationDetails: {
        flex: 1,
        marginRight: 10,
    },
    notificationTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    notificationSubtitle: {
        fontSize: 14,
    },
    notificationTime: {
        fontSize: 12,
        color: '#666',
        position: 'absolute',
        top: 12,
        right: 10,
        alignSelf: 'flex-start',
    },
})

export default NotificationScreen