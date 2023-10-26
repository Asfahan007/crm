import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { openDatabase } from 'react-native-sqlite-storage';
import DeviceInfo from 'react-native-device-info'
import { store } from '../../../../Store';
import { useDispatch } from 'react-redux';
import { updateSyncLength } from '../../../../Store/SyncLengthStore'



const db = openDatabase({
  name: 'customer_database',
})

export default function FinalSubmit({ navigation, route }) {
  console.log("routes", route);
  const [mobileId, setMobileId] = useState()
  const [deviceId, setDeviceId] = useState()
  const [date, setDate] = useState(Date.now().toString())
  const dispatch = useDispatch()


  let customerDataLength = store.getState().SyncLength.customerData
  let storeDataLength = store.getState().SyncLength.storeData
  let saleDataLength = store.getState().SyncLength.saleData
  let customerNotifictaion = store.getState().SyncLength.customertable
  let storeNotifictaion = store.getState().SyncLength.storetable
  let saleNotifictaion = store.getState().SyncLength.saletable

  useEffect(() => {
    createContactTable()
  }, [])

  useEffect(() => {
    DeviceInfo.getAndroidId()
      .then(androidId => {
        setMobileId(androidId)
      })
    DeviceInfo.getDevice().then((device) => {
      setDeviceId(device)
    });
  }, [])

  const createContactTable = () => {
    db.transaction(txn => {
      txn.executeSql(
        'CREATE TABLE IF NOT EXISTS contacts_info (id INTEGER PRIMARY KEY AUTOINCREMENT,contactId varchar(255),firstName varchar(255),lastName varchar(255),status varchar(255),source varchar(255),contactUnworked varchar(255),createdDate varchar(30),updatedDate datetime,sessions varchar(255),phoneNo varchar(255),contactOwner varchar(255),eventRevenue varchar(255),lastActivityDate varchar(255),ownerAssignedDate varchar(255),becameOpportunityDate varchar(255),createdBy varchar(255),contactStage varchar(255),timeFirstSeen varchar(255),jobTitle varchar(255),emailDomain varchar(255),email varchar(255),associatedCompanyId varchar(255),associatedCompany varchar(255),hierarchyId varchar(255),accountName varchar(255),mobileDeviceId VARCHAR(20),mobileId VARCHAR(20),accountIdRef varchar(255))',
        [],
        () => {
          console.log("TABLE CREATED SUCCESSFULLY")
        },
        error => {
          console.log("error while creating" + error.message)
        }
      )
    })
  }

  const addContactValues = (values) => {
    console.log("insile add contact", values.name);
    db.transaction(txn => {
      console.log("hiii");
      txn.executeSql(
        'INSERT INTO contacts_info (firstName,email,jobTitle,phoneNo,createdDate,mobileDeviceId,mobileId,contactId) VALUES (?,?,?,?,?,?,?,?)',
        [values.name, values.email, values.jobTitle, values.phone, date, mobileId, deviceId, ""],
        (txn, res) => {
          Alert.alert(
            'Success',
            'User added successfully',
            [
              {
                text: 'Ok',
                onPress: () => navigation.navigate("AllContact")
              },
            ],
            { cancelable: false },
          )
        },
        error => {
          console.log("error while INSERTING " + error.message)
        }
      )
    })
  }

  return (
    <ScrollView style={{ marginBottom: 10, marginTop: 1 }}>
      <Image
        source={{ uri: route.params.pic }}
        style={{ width: 400, height: 500 }}
      />
      <View style={[styles.card]}>
        <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'space-between' }}>
          <Text style={{ color: 'black', fontWeight: 'bold', }}>Full Name :</Text>
          <Text style={{ color: 'black', }}>{route.params.values.name}</Text>
        </View>
      </View>

      <View style={[styles.card]}>
        <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'space-between' }}>
          <Text style={{ color: 'black', fontWeight: 'bold', }}>Phone Number :</Text>
          <Text style={{ color: 'black', marginLeft: 100 }}>{route.params.values.phone}</Text>
        </View>
      </View>

      <View style={[styles.card]}>
        <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'space-between' }}>
          <Text style={{ color: 'black', fontWeight: 'bold', }}>Email Id :</Text>
          <Text style={{ color: 'black', marginLeft: 100 }}>{route.params.values.email}</Text>
        </View>
      </View>

      <View style={[styles.card]}>
        <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'space-between' }}>
          <Text style={{ color: 'black', fontWeight: 'bold', }}>Job Title :</Text>
          <Text style={{ color: 'black', marginLeft: 100 }}>{route.params.values.jobTitle}</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginLeft: 80, marginRight: 80 }}>
        <View style={{ backgroundColor: '#f1f5f7', height: 40, width: 90, justifyContent: 'center', alignItems: 'center', borderWidth: 0.8, borderRadius: 5 }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}

          >
            <Text style={{}}>Back</Text>
          </TouchableOpacity>
        </View>
        <View style={{}}>
          <TouchableOpacity
            onPress={() => addContactValues(route.params.values)}
            style={{ backgroundColor: '#00b8ce', height: 40, width: 90, justifyContent: 'center', alignItems: 'center', borderRadius: 5, }}
          >
            <Text style={{ color: 'white' }}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>

  )
}

const styles = StyleSheet.create({
  card: {
    margin: 20,
    color: '#000',
    paddingHorizontal: 10,
    paddingBottom: 20,
    backgroundColor: 'white',
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    borderRadius: 4,
  },
})