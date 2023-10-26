import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Dropdown } from 'react-native-element-dropdown'
import { useState } from 'react'
import { useEffect } from 'react'
import { openDatabase } from 'react-native-sqlite-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';
import { cancelButton, cancelText, cardContainer, floatingLabelContainer, floatingLabelContainerInternal, multiSelectOptions, saveAndCancel, saveButton, saveText } from '../CustomComponents/Style'
import MultiSelect from '../Deal/Deals/Deals/MultiSelect'
import { FloatingLabelInput } from 'react-native-floating-label-input'
import CardWrapper from '../CustomComponents/CardWrapper'

const db = openDatabase({
    name: "customer_database",
})

const FilterAttendence = ({ navigation }) => {
    // const [birthday, setBirthday] = useState('');
    // const [phone, setPhone] = useState('');
    // const [price, setPrice] = useState('');

    // return (
    //     <ScrollView
    //         keyboardShouldPersistTaps="handled"
    //         contentContainerStyle={{
    //             flex: 1,
    //             justifyContent: 'center',
    //             alignItems: 'stretch',
    //             margin: 30,
    //         }}
    //     >
    //         <FloatingLabelInput
    //             label="Birthday"
    //             value={birthday}
    //             mask="99/99/9999"
    //             keyboardType="numeric"
    //             onChangeText={value => setBirthday(value)}
    //         />
    //         <FloatingLabelInput
    //             label="Phone"
    //             value={phone}
    //             mask="(99)99999-9999"
    //             keyboardType="numeric"
    //             onChangeText={value => setPhone(value)}
    //         />
    //         <FloatingLabelInput
    //             label="Price"
    //             value={price}
    //             maskType="currency"
    //             currencyDivider="." // which generates: 9.999.999,99 or 0,99 ...
    //             keyboardType="numeric"
    //             onChangeText={value => setPrice(value)}
    //         />
    //     </ScrollView>
    // )
    var arr = []

    const [value, setValue] = useState(null)
    const [isFocus, setIsFocus] = useState(false)
    const [allData, setAllData] = useState([])
    const [filterStatus, setFilterStatus] = useState("");
    const [fromDate, setFromDate] = useState();
    const [toDate, setToDate] = useState();
    const [show, setShow] = useState(false);
    const [showFrom, setShowFrom] = useState(false);
    const [showTo, setShowTo] = useState(false);
    const [date, setDate] = useState(new Date(Date.now()));
    const [mode, setMode] = useState('date');
    const [modeTo, setModeTo] = useState('date');
    const [modeFrom, setModeFrom] = useState('date');
    const [employeeFilterName, setEmloyeeFilterName] = useState("")

    const showModeFrom = currentModeFrom => {
        setShowFrom(true);
        setModeFrom(currentModeFrom);
    };
    const showModeTo = currentModeTo => {
        setShowTo(true);
        setModeTo(currentModeTo);
    };
    const showDatepickerFrom = () => {
        showModeFrom('date');
    };

    const showDatepickerTo = () => {
        showModeTo('date');
    };

    const getEmployee = values => {
        setEmloyeeFilterName(values.item)
    }

    const getEmployeeDropdown = () => {
        db.transaction(txn => {
            txn.executeSql(
                'SELECT employeeName from attendance_info; ',
                [],

                (tx, res) => {
                    let len = res.rows.length
                    console.log('len', len)
                    if (len > 0) {
                        let results = []

                        for (let i = 0; i < len; i++) {
                            let item = res.rows.item(i)
                            results.push({
                                id: item.id,
                                item: item.employeeName,

                            })
                            setAllData(results)
                        }

                    }
                },
                error => {
                    console.log('error while GETTING', error.message)
                },
            )
        })

    }

    const Filtering = () => {
        if (fromDate && toDate && employeeFilterName) {
            db.transaction((tx) => {
                tx.executeSql(
                    'select * from attendance_info where employeeName = ? and attendanceDate >= ? and attendanceDate <= ?',
                    [employeeFilterName, fromDate, toDate],
                    (tx, results) => {
                        var len = results.rows.length;
                        console.log("length", len)
                        if (len > 0) {
                            console.log("resultfilter", results.rows)
                            for (let i = 0; i < len; i++) {
                                arr[i] = results.rows.item(i)
                            }

                            { (arr.length != 0) ? navigation.navigate("Attendence List", { data: arr }) : null }
                        } else {
                            alert("No data")
                        }
                    }
                );
            });

        } if (fromDate && toDate && !employeeFilterName) {
            console.log("inside fromDate && toDate", fromDate, toDate);
            db.transaction((tx) => {
                tx.executeSql(
                    'select * from attendance_info where attendanceDate >= ? and attendanceDate <= ?',
                    [fromDate, toDate],
                    (tx, results) => {
                        console.log("test date", results)
                        var len = results.rows.length;
                        if (len > 0) {
                            for (let i = 0; i < len; i++) {
                                arr[i] = results.rows.item(i)
                            }
                            { (arr.length != 0) ? navigation.navigate("Attendence List", { data: arr }) : null }
                        } else {
                            alert("No data")
                        }
                    }
                );
            });


        }
        if (employeeFilterName && !fromDate && !toDate) {
            console.log("inside name", employeeFilterName);
            db.transaction((tx) => {
                tx.executeSql(
                    'select * from attendance_info where employeeName = ?',
                    [employeeFilterName],
                    (tx, results) => {
                        console.log("test name", results)
                        var len = results.rows.length;
                        if (len > 0) {
                            for (let i = 0; i < len; i++) {
                                arr[i] = results.rows.item(i)
                            }
                            { (arr.length != 0) ? navigation.navigate("Attendence List", { data: arr }) : null }
                        } else {
                            alert("No data")
                        }
                    }
                );
            });
        }

    }

    useEffect(() => {
        getEmployeeDropdown();
    }, [])

    const onChangeFrom = (event, selectedDate) => {
        const currentDate = selectedDate || fromDate;
        setShow(Platform.OS === 'ios');
        setShowFrom(Platform.OS === 'ios');
        setDate(currentDate);
        setFromDate(selectedDate.toISOString().slice(0, 10))
        console.log("date", selectedDate.toISOString().slice(0, 10));
    };

    const onChangeTo = (event, selectedDate) => {
        const currentDate = selectedDate || toDate;
        setShow(Platform.OS === 'ios');
        setShowTo(Platform.OS === 'ios');
        setDate(currentDate);
        setToDate(selectedDate.toISOString().slice(0, 10))
        console.log("date", selectedDate.toISOString().slice(0, 10));
    };

    return (
        <CardWrapper>
            {showFrom && (
                <DateTimePicker
                    testID="dateTimePicker"
                    timeZoneOffsetInMinutes={0}
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={onChangeFrom}
                    customStyles={{
                        dateInput: {
                            borderLeftWidth: 0,
                            borderRightWidth: 0,
                            borderTopWidth: 0,
                        }
                    }}
                />
            )}
            {showTo && (
                <DateTimePicker
                    testID="dateTimePicker"
                    timeZoneOffsetInMinutes={0}
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={onChangeTo}

                />
            )}

            <View style={cardContainer}>
                {/* <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: '#00b8ce' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                data={allData}
                search
                maxHeight={300}
                containerStyle={styles.item}
                itemContainerStyle={styles.item}
                itemTextStyle={styles.text}
                labelField="employeeName"
                valueField="value"
                placeholder={!isFocus ? 'Select Employee' : filterStatus}
                searchPlaceholder="Search..."
                value={value}
                onFocus={() => setIsFocus(false)}
                onBlur={() => setIsFocus(true)}
                onChange={item => {
                    setValue(item.value)

                    setFilterStatus(item.employeeName)
                    // setIsFocus(false)
                }}
            /> */}
                <View
                    style={multiSelectOptions}
                >
                    <MultiSelect
                        onSelect={getEmployee}
                        single
                        label="Select Employee"
                        K_OPTIONS={allData}
                    />
                </View>
                <View style={floatingLabelContainer}>
                    <FloatingLabelInput
                        containerStyles={floatingLabelContainerInternal}
                        placeholder="From Date"
                        label={'From Date'}
                        placeholderTextColor="grey"
                        paddingHorizontal={10}
                        paddingTop={5}
                        value={fromDate}
                    // onChangeText={handleChange('attendanceDate')}
                    />
                    <TouchableOpacity onPress={showDatepickerFrom}>
                        <View style={{ alignSelf: 'flex-end', marginRight: 10, marginTop: -40 }}>
                            <Icon name={'calendar'} solid size={30} />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={floatingLabelContainer}>
                    <FloatingLabelInput
                        containerStyles={floatingLabelContainerInternal}
                        placeholder="To Date"
                        label={'To Date'}
                        placeholderTextColor="grey"
                        paddingHorizontal={10}
                        paddingTop={5}
                        value={toDate}
                    // onChangeText={handleChange('attendanceDate')}
                    />
                    <TouchableOpacity onPress={showDatepickerTo}>
                        <View style={{ alignSelf: 'flex-end', marginRight: 10, marginTop: -40 }}>
                            <Icon name={'calendar'} solid size={30} />
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={saveAndCancel}>
                    <View>
                        <TouchableOpacity
                            style={saveButton}
                            onPress={Filtering}
                        >
                            <Text style={saveText}>Filter</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity style={cancelButton}
                            onPress={() => navigation.navigate("Attendence List")}
                        >
                            <Text style={cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </CardWrapper>
    )
}

export default FilterAttendence

const styles = StyleSheet.create({
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        color: '#000',
        marginTop: 10,
        backgroundColor: "#f1f5f7",

        //   backgroundColor:'grey'
    }, buttons: {
        alignItems: "center",
        backgroundColor: "#00b8ce",
        padding: 10,
        width: 80,
        position: 'relative',
        marginLeft: 130,
        marginTop: 30,
        borderRadius: 4
    }, card: {
        margin: 10,
        paddingHorizontal: 20,
        paddingBottom: 10,
        backgroundColor: 'white',
        elevation: 3,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        borderRadius: 4,
    }, text: {
        color: "black",
        marginLeft: 28,
        top: 10,
        fontSize: 16
    },
    txt: {
        color: 'black',
        marginLeft: 14,
        fontSize: 16,
        top: 8,
    },
    txt1: {
        color: '#43628e',
        marginLeft: 14,
        fontSize: 16,
    },
    datePickerStyle: {
        height: 50,
        width: "100%",
        backgroundColor: '#f1f5f7',
        borderColor: "grey",
        borderWidth: 0.5,
        marginTop: 25,
        borderRadius: 8,
        marginBottom: 5
    },
    placeholderStyle: {
        color: '#43628e'
    }
})