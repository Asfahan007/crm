import { View, Text, Image, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { BG_IMG } from './Image'
import { Formik } from 'formik'
import { FloatingLabelInput } from 'react-native-floating-label-input';
import { cancelButton, cancelText, cardContainer, errorMessage, floatingLabelContainer, floatingLabelContainerInternal, pickerInputContainer, pickerItem, saveAndCancel, saveButton, saveText } from './Style';
import { store } from '../../Store';
import { openDatabase } from 'react-native-sqlite-storage';
import * as Yup from 'yup';
import { Picker } from '@react-native-picker/picker';

const db = openDatabase({
    name: "customer_database",
})

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const validationSchema = Yup.object().shape({

    name: Yup.string().min(2, 'Name must be 2 letters')
        .matches(/[^\s*].*[^\s*]/g, 'This field cannot contain only blankspaces').required('Name is required').label('Name'),
    phone: Yup.string()
        .required('Mobile number is required')
        .matches(phoneRegExp, 'Phone number is not valid')
        .min(10, "Too short, phone number must be 10 digit")
        .max(10, "Too long, phone number must be 10 digit"),
    store: Yup.string().matches(/^\S*$/, "Name without spaces").required('Store name is required').label('Store Name'),
    status: Yup.string().required('Status is required').label('Status'),
    territory: Yup.string().required('Territory is required').label('Status'),
    payType: Yup.string().required('Pay type is required').label('Status'),
});

const AddContactCustom = ({ navigation }) => {
    let username = store.getState().auth.profile.name

    const addCustomers = (values) => {
        // let flag = 0
        // for (let i = 0; i < customer?.length; i++) {
        //     if (customer[i].customerMobile === values.phone) {
        //         flag = 1
        //         break;
        //     }
        //     else {
        //         flag = 0
        //     }
        // }
        // if (flag === 1) {
        //     Alert.alert(
        //         'Error',
        //         'Mobile number already registered',
        //         [
        //             {
        //                 text: 'Ok',
        //             },
        //         ],
        //         { cancelable: false },
        //     )
        // } else {
        return new Promise((resolve, reject) => {
            db.transaction(txn => {
                txn.executeSql(
                    'INSERT INTO customer_info (customerName,customerMobile,customerStatus,storeName,userName) VALUES (?,?,?,?,?)',
                    [values.name, values.phone, values.status, values.store, username],
                    (txn, res) => {
                        Alert.alert(
                            'Success',
                            'Customer added successfully',
                            [
                                {
                                    text: 'Ok',
                                    onPress: () => navigation.navigate('BottomSheetDemo'),
                                },
                            ],
                            { cancelable: true },
                        )

                    },
                    error => {
                        console.log("error while INSERTING " + error.message)
                    }
                )
            }, (error) => {
                reject(error);
            }, () => {
                resolve();
            });
        })
        // }

    }
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
                        initialValues={{ name: '', phone: '', store: '', status: '', territory: '', payType: '' }}
                        validationSchema={validationSchema}
                        onSubmit={values => addCustomers(values)}>
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
                                <View style={floatingLabelContainer}>
                                    <FloatingLabelInput
                                        containerStyles={floatingLabelContainerInternal}
                                        placeholder="phone"
                                        label={'Mobile'}
                                        keyboardType='numeric'
                                        maxLength={10}
                                        placeholderTextColor="grey"
                                        paddingHorizontal={10}
                                        paddingTop={5}
                                        value={values.phone}
                                        onChangeText={handleChange('phone')}
                                    />
                                    {errors.phone && touched.phone && (
                                        <Text style={errorMessage}>{errors.phone}</Text>
                                    )}
                                </View>
                                <View style={floatingLabelContainer}>
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
                                        <Picker.Item style={pickerItem} label="Select Status" value="" />
                                        <Picker.Item style={pickerItem} label="Active" value="Active" />
                                        <Picker.Item style={pickerItem} label="Inactive" value="Inactive" />
                                    </Picker>
                                    {errors.status && touched.status && (
                                        <Text style={errorMessage}>{errors.status}</Text>
                                    )}
                                </View>
                                <View style={saveAndCancel}>
                                    <View>
                                        <TouchableOpacity
                                            style={saveButton}
                                            onPress={handleSubmit}
                                        >
                                            <Text style={saveText}>Save</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View>
                                        <TouchableOpacity style={cancelButton}
                                            onPress={() => navigation.navigate("BottomSheetDemo")}
                                        >
                                            <Text style={cancelText}>Cancel</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                        )}
                    </Formik>
                </ScrollView>
            </View>
        </View>
    )
}

export default AddContactCustom