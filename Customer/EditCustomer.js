import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { openDatabase } from 'react-native-sqlite-storage';
import { Formik } from 'formik';
import { Picker } from '@react-native-picker/picker';
import DeviceInfo from 'react-native-device-info';
import { useDispatch } from 'react-redux'
import { store } from '@/Store';
import { FloatingLabelInput } from 'react-native-floating-label-input';
import { BackHandler } from "react-native";
import * as Yup from 'yup';
import { updateSyncLength } from '@/Store/SyncLengthStore';
import { BG_IMG } from '../CustomComponents/Image';
import { cancelButton, cancelText, cardContainer, errorMessage, floatingLabelContainer, floatingLabelContainerInternal, pickerInputContainer, pickerItem, saveAndCancel, saveButton, saveText } from '../CustomComponents/Style';
import SaveAndCancelButton from '../CustomComponents/SaveAndCancelButton';

const db = openDatabase({
  name: "customer_database",
})

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const validationSchema = Yup.object().shape({

  name: Yup.string().min(2, 'Name must be 2 letters')
    .matches(/[^\s*].*[^\s*]/g, 'This field cannot contain only blankspaces').required('Name is required').label('Name'),
  phone: Yup.string()
    .required('A phone number is required')
    .matches(phoneRegExp, 'Phone number is not valid')
    .min(10, "Too short, phone number must be 10 digit")
    .max(10, "Too long, phone number must be 10 digit"),
  store: Yup.string().matches(/^\S*$/, "Name without spaces").required('Store name is required').label('Store Name'),
  status: Yup.string().required('Status is required').label('Status'),
  territory: Yup.string().required('Territory is required').label('Status'),
  payType: Yup.string().required('Pay type is required').label('Status'),
});
const EditCustomer = ({ route, navigation }) => {
  const [mobileId, setMobileId] = useState()
  const [mobileDeviceId, setMobileDeviceId] = useState()
  const [date, setDate] = useState(Date.now().toString())

  // variable for length of remaining data for sync and also for notification at top when sync is required
  let customerDataLength = store.getState().SyncLength.customerData
  let storeDataLength = store.getState().SyncLength.storeData
  let saleDataLength = store.getState().SyncLength.saleData
  let customerNotifictaion = store.getState().SyncLength.customertable
  let storeNotifictaion = store.getState().SyncLength.storetable
  let saleNotifictaion = store.getState().SyncLength.saletable

  const dispatch = useDispatch()

  let username = store.getState().auth.profile.name

  const editCustomer = (values) => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE customer_info SET customerId=?,customerName=?,customerMobile=?,customerStatus=?,storeName=?, updatedAt=?, mobileDeviceId=?, mobileId=? WHERE id=?',
        [route.params.params.customerId, values.name, values.phone, values.status, values.store, date, mobileDeviceId, mobileId, route.params.params.id],
        (tx, results) => {
          dispatch(
            updateSyncLength({
              customertable: 1,
              customerData: 1,
              storetable: storeNotifictaion,
              saletable: saleNotifictaion,
              storeData: storeDataLength,
              saleData: saleDataLength
            }))
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'Customer updated successfully',
              [
                {
                  text: 'Ok',
                  onPress: () => navigation.navigate('Customer Detail', { id: route.params.params.id }),
                },
              ],
              { cancelable: false },
            )
          } else error(err)
        },
      )
    })
  }
  useEffect(() => {
    // createTables();
    DeviceInfo.getAndroidId()
      .then(androidId => {
        setMobileDeviceId(androidId)
      })
    DeviceInfo.getDevice().then((device) => {
      setMobileId(device)
    });
  }, [])

  function handleBackButtonClick() {
    navigation.navigate("Customer List")
    return true;
  }

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Image
        source={{ uri: BG_IMG }}
        style={StyleSheet.absoluteFill}
        blurRadius={80}
      />
      <View style={{ flex: 1, alignItems: 'center' }}>
        <ScrollView keyboardShouldPersistTaps={true}>
          <Formik
            initialValues={{ name: route.params.params.customerName, phone: route.params.params.customerMobile, store: route.params.params.storeName, status: route.params.params.customerStatus, territory: 'demo', payType: 'demo' }}
            validationSchema={validationSchema}
            onSubmit={values => editCustomer(values)}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View style={cardContainer}>
                <View style={floatingLabelContainer}>
                  <FloatingLabelInput
                    containerStyles={floatingLabelContainerInternal}
                    placeholder="Name"
                    label={'Name'}
                    placeholderTextColor="grey"
                    paddingHorizontal={10}
                    paddingTop={5}
                    value={values.name}
                    onChangeText={handleChange('name')}
                  />
                  {errors.name && touched.name && (
                    <Text style={errorMessage}>{errors.name}</Text>
                  )}
                </View>
                <View style={pickerInputContainer}>
                  <FloatingLabelInput
                    containerStyles={floatingLabelContainerInternal}
                    placeholder="phone"
                    label={'Mobile'}
                    keyboardType='numeric'
                    maxLength={10}
                    placeholderTextColor="grey"
                    paddingHorizontal={10}
                    paddingTop={5}
                    maxLength={10}
                    keyboardType="numeric"
                    value={values.phone}
                    onChangeText={handleChange('phone')}
                  />
                  {errors.phone && touched.phone && (
                    <Text style={errorMessage}>{errors.phone}</Text>
                  )}
                </View>
                <View style={pickerInputContainer}>
                  <FloatingLabelInput
                    containerStyles={floatingLabelContainerInternal}
                    placeholder="'Store name"
                    label={'Store'}
                    placeholderTextColor="grey"
                    paddingHorizontal={10}
                    paddingTop={5}
                    value={values.store}
                    onChangeText={handleChange('store')}
                  />
                  {errors.store && touched.store && (
                    <Text style={errorMessage}>{errors.store}</Text>
                  )}
                </View>
                <View style={floatingLabelContainer}>
                  <FloatingLabelInput
                    containerStyles={floatingLabelContainerInternal}
                    placeholder="territory"
                    label={'Territory'}
                    placeholderTextColor="grey"
                    paddingHorizontal={10}
                    paddingTop={5}
                    value={values.territory}
                    onChangeText={handleChange('territory')}
                  />
                  {errors.territory && touched.territory && (
                    <Text style={errorMessage}>{errors.territory}</Text>
                  )}
                </View>
                <View style={floatingLabelContainer}>
                  <FloatingLabelInput
                    containerStyles={floatingLabelContainerInternal}
                    placeholder="payType"
                    label={'Pay Type'}
                    placeholderTextColor="grey"
                    paddingHorizontal={10}
                    paddingTop={5}
                    value={values.payType}
                    onChangeText={handleChange('payType')}
                  />
                  {errors.payType && touched.payType && (
                    <Text style={errorMessage}>{errors.payType}</Text>
                  )}
                </View>
                <View style={pickerInputContainer}>
                  <Picker style={{ bottom: 3.5 }}
                    selectedValue={values.status}
                    onValueChange={handleChange('status')}
                  >
                    {/* <Picker.Item label="Status" value="" /> */}
                    <Picker.Item style={pickerItem} label="Active" value="Active" />
                    <Picker.Item style={pickerItem} label="Inactive" value="Inactive" />
                  </Picker>

                  {errors.status && touched.status && (
                    <Text style={errorMessage}>{errors.status}</Text>
                  )}
                </View>
                <SaveAndCancelButton handleSubmit={handleSubmit} saveTitle={"Update"} navigation={navigation} screenName="Customer Detail" dataPass={route.params.params.id} />
              </View>
            )}
          </Formik>
        </ScrollView>
      </View>
    </View>
  );
};

export default EditCustomer;





