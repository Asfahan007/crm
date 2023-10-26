import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Formik } from 'formik';
import { FloatingLabelInput } from 'react-native-floating-label-input';
import { Picker } from '@react-native-picker/picker';
import { set } from 'react-native-reanimated';

export default function OcrDataEdit({navigation,route}) {
  console.log("edittt",route.params);
  const phone=[]
  let email=[];
    return (
    <ScrollView>
      <Formik
        initialValues={{ name: route.params?.data.name, phone:route.params?.data.phone, email: route.params.data.email, jobTitle: route.params.data.jobTitle}}
        // validationSchema={validationSchema}
        onSubmit={values => navigation.navigate("Final Sumbit",{values,pic:route.params.picId})}
        >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.cards}>
           <View style={styles.card}>
            <View style={styles.Picker}>
          <Text style={{color:'black'}}>Full Name</Text>
          </View>
          <FloatingLabelInput
                containerStyles={[styles.dropdown]}
                placeholder="Amount"
                label={'Full Name'}
                placeholderTextColor="grey"
                paddingHorizontal={10}
                paddingTop={5}
                value={values.name}
                onChangeText={handleChange('name')}
                
              />
          </View>

          <View style={styles.card}>
            <View style={styles.Picker}>
          <Text style={{color:'black'}}>Mobile No</Text>
          </View>
          <FloatingLabelInput
                containerStyles={[styles.dropdown]}
                placeholder="Amount"
                label={'Mobile No'}
                placeholderTextColor="grey"
                paddingHorizontal={10}
                paddingTop={5}
                value={values.phone}
                onChangeText={handleChange('phone')}
                
              />
          </View>

          <View style={styles.card}>
            <View style={styles.Picker}>
          <Text style={{color:'black'}}>Email Id</Text>
          </View>
          <FloatingLabelInput
                containerStyles={[styles.dropdown]}
                placeholder="Amount"
                label={'Email Id'}
                placeholderTextColor="grey"
                paddingHorizontal={10}
                paddingTop={5}
                value={values.email}
                onChangeText={handleChange('email')}
                
              />
          </View>

          <View style={styles.card}>
            <View style={styles.Picker}>
          <Text style={{color:'black'}}>Job Title</Text>
          </View>
          <FloatingLabelInput
                containerStyles={[styles.dropdown]}
                placeholder="Amount"
                label={'Job Title'}
                placeholderTextColor="grey"
                paddingHorizontal={10}
                paddingTop={5}
                value={values.jobTitle}
                onChangeText={handleChange('jobTitle')}
                
              />
          </View>
           
          <View style={{flexDirection:'row',justifyContent:'space-around',marginLeft:80,marginRight:80}}>
          <View style={{backgroundColor:'#f1f5f7',height:40,width:90,justifyContent:'center',alignItems:'center',borderWidth:0.8,borderRadius:5}}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}

              >
                <Text style={{}}>Back</Text>
              </TouchableOpacity>
            </View>
          <View style={{}}>
              <TouchableOpacity
                onPress={handleSubmit}
                style={{backgroundColor:'#00b8ce',height:40,width:90,justifyContent:'center',alignItems:'center',borderRadius:5,}}
              >
                <Text style={{color:'white'}}>Next</Text>
              </TouchableOpacity>
            </View>
            </View>
          </View>
        )}
      </Formik>
    </ScrollView>
  )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: 10
    },
    button: {
      alignItems: "center",
      backgroundColor: "#00b8ce",
      borderRadius: 4,
      marginTop: 20,
      height: 40,
    },
    buttonCancel: {
      alignItems: "center",
      backgroundColor: "#f1f5f7",
      borderRadius: 4,
      marginTop: 20,
      height: 40
    },
    card: {
      margin: 20,
      color: '#000',
      paddingHorizontal: 10,
      paddingBottom:20,
      backgroundColor: 'white',
      elevation: 3,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      borderRadius: 4,
    },
    pickerInput: {
        height: 50,
        width: 300,
        marginTop: 10,
        backgroundColor: '#f1f5f7',
        borderRadius: 10,
        fontSize: 16,
        borderWidth: 0.5,
        borderColor: 'gray',
        color: '#000000',
        marginLeft: 12,
        marginRight: 5,
  
    },
    input: {
      height: 50,
      width: 300,
      marginTop: 25,
      backgroundColor: '#fff',
      borderRadius: 2,
      fontSize: 16,
      color: '#000000',
      paddingTop: 0.5,
      marginLeft: 12,
      marginRight: 5,
      fontWeight: 200
  
  },
  dropdown: {
    height: 50,
    marginTop:10,
    borderColor: 'gray',
    backgroundColor: '#f1f5f7',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    color: '#000',
    // marginBottom: -20,
    width: 300
  },
   error: { color: 'red', marginLeft: 25, marginTop: 5, marginBottom: -15 },
  
    main: {
      alignItems: "center",
      marginTop: 30,
      marginLeft: '0.4%',
    },
    submit: {
  
      width: 100, height: 60, marginTop: 5, marginBottom: 20, marginRight: 45
  
    },
    cancel: {
  
      width: 100, height: 60, marginTop: 5, marginBottom: 20, marginHorizontal: 45
  
    },
    texSub: {
      color: "#fff",
      textAlign: 'center',
      justifyContent: 'center',
      marginTop: 10
    },
    textCancel: {
      color: "#000000",
      textAlign: 'center',
      justifyContent: 'center',
      marginTop: 10
    },
    checkboxContainer: {
      flexDirection: "row",
      marginHorizontal: 25,
      marginTop: 20
    },
  Picker:{
    marginTop:10
  },
 
  });