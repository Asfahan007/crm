import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { Dropdown } from 'react-native-element-dropdown'
import { useState } from 'react'
import { useEffect } from 'react'
import { openDatabase } from 'react-native-sqlite-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { FloatingLabelInput } from 'react-native-floating-label-input';

const validationSchema = Yup.object().shape({
    dateOfAttendence: Yup.string().required('Date  is required').label('Date of Attendence'),
    timein: Yup.string().required('In Time is required').label('timein'),
    timeout: Yup.string().required('Out Time is required').label('timeout'),
});

const db = openDatabase({
    name: "customer_database",
})

const UpdateAttendance = ({ navigation, route }) => {
    const [timePickerOut, setTimePickerOut] = useState(false);
    const [showFrom, setShowFrom] = useState(false);
    const [timePickerIn, setTimePickerIn] = useState(false);

    const EditTheEmployee = (values) => {
        console.log(route.params.params.id, "values")
        db.transaction(tx => {
            tx.executeSql(
                'UPDATE attendence_info  SET employeeName=?, timein=?,timeout=?,dateOfAttendence=? WHERE id=?',
                [values.employeeName,values.employeeName,values.timein, values.timeout, values.dateOfAttendence, route.params.params.id],
                (tx, results) => {
                    console.log('Resultssssssss', results)
                    if (results.rowsAffected > 0) {
                        Alert.alert(
                            'Success',
                            'User updated successfully',
                            [
                                {
                                    text: 'Ok',
                                    onPress: () => navigation.navigate('Attendence Detail', { id: route.params.params.id }),

                                },
                            ],
                            { cancelable: false },
                        )
                    } else error(err)
                },
            )
        }

        )
    }

    return (
    <Formik
        initialValues={{ employeeName: route.params.params.employeeName, dateOfAttendence: route.params.params.dateOfAttendence, timein: route.params.params.timein, timeout: route.params.params.timeout, openDate: new Date(Date.now()) }}
        validationSchema={validationSchema}
        onSubmit={values => EditTheEmployee(values)}>
        {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
        }) => (

            <React.Fragment>
                {showFrom && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        timeZoneOffsetInMinutes={0}
                        value={values.openDate}
                        mode='date'
                        is24Hour={true}
                        display="default"
                        selected={values.dateOfAttendence}
                        onBlur={(date, event) => console.log("dateee", date, event)}
                        onChange={val => {
                            console.log("val", val.nativeEvent.timestamp);
                            values.dateOfAttendence = new Date(val.nativeEvent.timestamp).toISOString().slice(0, 10)
                            setShowFrom(false)
                        }}
                    />
                )}
                {timePickerIn && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        timeZoneOffsetInMinutes={0}
                        value={values.openDate}
                        mode='time'
                        is24Hour={true}
                        display="default"
                        selected={values.timein}
                        onBlur={(date, event) => console.log("dateee", date, event)}
                        onChange={val => {
                            console.log("val", val.nativeEvent.timestamp);
                            values.timein = new Date(val.nativeEvent.timestamp).toISOString().slice(11, 19)
                            setTimePickerIn(false)
                        }}
                    />
                )}

                {timePickerOut && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        timeZoneOffsetInMinutes={0}
                        value={values.openDate}
                        mode='time'
                        is24Hour={true}
                        display="default"
                        selected={values.timeout}
                        onBlur={(date, event) => console.log("dateee", date, event)}
                        onChange={val => {
                            console.log("val", val.nativeEvent.timestamp);
                            values.timeout = new Date(val.nativeEvent.timestamp).toISOString().slice(11, 19)
                            setTimePickerOut(false)
                        }}
                    />
                )}

                <View style={styles.card}>
                    <View style={styles.container}>
                        <FloatingLabelInput
                            containerStyles={styles.dropdown}
                            placeholder="Full name"
                            placeholderTextColor="grey"
                            paddingHorizontal={10}
                            paddingTop={5}
                            value={values.employeeName}
                        />

                        <View style={styles.dateStyle}>
                            <View><Text style={[styles.txt1]}>Date</Text></View>

                            <TouchableOpacity onPress={() => setShowFrom(!showFrom)} style={{
                                flex: 1,
                                marginRight: 5,
                                borderBottomWidth: 1,
                                borderBottomColor: '#E0E0E0',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'row',
                                marginTop: -20

                            }}>
                                <View style={{ flex: 1, top: 8 }}>

                                    <Text style={[styles.txt]}>{values.dateOfAttendence}</Text>
                                </View>
                                <TouchableOpacity onPress={() => setShowFrom(!showFrom)}>
                                    <View style={{ alignSelf: 'flex-end', marginRight: 5 }}>
                                        <Icon name={'calendar'} solid size={30} />
                                    </View>
                                </TouchableOpacity>
                            </TouchableOpacity>
                            {errors.dateOfAttendence && touched.dateOfAttendence && (
                                <Text style={styles.errorDate}>{errors.dateOfAttendence}</Text>
                            )}

                        </View>
                        <View style={styles.datePickerStyle}>
                            <View><Text style={[styles.txt1]}>In-Time</Text></View>

                            <TouchableOpacity onPress={() => setTimePickerIn(!timePickerIn)} style={{
                                flex: 1,
                                marginRight: 5,
                                borderBottomWidth: 1,
                                borderBottomColor: '#E0E0E0',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'row',
                                marginTop: -20

                            }}>
                                <View style={{ flex: 1, top: 8 }}>
                                    <Text style={[styles.txt]}>{values.timein}</Text>
                                </View>
                                <TouchableOpacity onPress={() => setTimePickerIn(!timePickerIn)}>
                                    <View style={{ alignSelf: 'flex-end', marginRight: 5 }}>
                                        <Icon name={'time'} solid size={30} />
                                    </View>
                                </TouchableOpacity>
                            </TouchableOpacity>
                            {errors.timein && touched.timein && (
                                <Text style={styles.errorDate}>{errors.timein}</Text>
                            )}

                        </View>

                        <View style={styles.datePickerStyle}>
                            <View><Text style={[styles.txt1]}>Out-Time</Text></View>

                            <TouchableOpacity onPress={() => setTimePickerOut(!timePickerOut)} style={{
                                flex: 1,
                                marginRight: 5,
                                borderBottomWidth: 1,
                                borderBottomColor: '#E0E0E0',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'row',
                                marginTop: -20

                            }}>
                                <View style={{ flex: 1, top: 8 }}>

                                    <Text style={[styles.txt]}>{values.timeout}</Text>
                                </View>
                                <TouchableOpacity onPress={() => setTimePickerOut(!timePickerOut)}>
                                    <View style={{ alignSelf: 'flex-end', marginRight: 5 }}>
                                        <Icon name={'time'} solid size={30} />
                                    </View>
                                </TouchableOpacity>
                            </TouchableOpacity>
                            {errors.timeout && touched.timeout && (
                                <Text style={styles.errorDate}>{errors.timeout}</Text>
                            )}

                        </View>
                        <View style={styles.submit}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={handleSubmit}

                            >
                                <Text style={styles.texSub}>Update</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.cancel}>
                            <TouchableOpacity
                                style={styles.buttoncancel}
                                onPress={() => navigation.navigate('Attendence List')}
                            >
                                <Text style={styles.textCancel}>Cancel</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </React.Fragment>
        )}
    </Formik>
    )
}


export default UpdateAttendance

const styles = StyleSheet.create({
    card: {
        margin: 4,
        paddingHorizontal: 20,
        paddingBottom: 10,
        backgroundColor: 'white',
        elevation: 3,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        borderRadius: 4,
    }, dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        color: '#000',
        marginTop: 12,
        backgroundColor: "#f1f5f7",
        marginBottom: 20
    }, datePickerStyle: {
        height: 50,
        width: 330,
        backgroundColor: '#f1f5f7',
        borderColor: "grey",
        borderWidth: 0.5,
        marginTop: 15,
        borderRadius: 10,
        marginBottom: 5
    }, txt: {
        color: 'black',
        marginLeft: 14,
        fontSize: 16
    },
    error: {
        color: "red",
        marginTop: -10
    }, errorDate: {
        color: "red",
        top: 20
    }, container: {
        marginHorizontal: 4,
    }, dateStyle: {
        height: 50,
        width: 330,
        backgroundColor: '#f1f5f7',
        borderColor: "grey",
        borderWidth: 0.5,
        marginTop: 3,
        borderRadius: 10,
        marginBottom: 5
    }, button: {
        width: 100,
        alignItems: 'center',
        alignSelf: 'center',
        display: 'flex',
        backgroundColor: '#00b8ce',
        borderRadius: 4,
        height: 40,
        marginRight: 12,
        marginTop: -4,
        marginBottom: 10

    },
    textCancel: {
        backcolor: "#000",
        textAlign: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    submit: {
        width: 100,
        marginTop: 35,
        marginLeft: 55
    },
    cancel: {
        width: 100,
        marginTop: -50,
        marginLeft: 180
    },
    buttoncancel: {
        alignItems: "center",
        backgroundColor: '#f1f5f7',
        borderRadius: 4,
        height: 40,
        marginBottom: 10

    }, texSub: {
        color: "#fff",
        textAlign: 'center',
        justifyContent: 'center',
        marginTop: 10
    }, txt1: {
        color: '#43628e',
        marginLeft: 14,
        fontSize: 16
    }
})