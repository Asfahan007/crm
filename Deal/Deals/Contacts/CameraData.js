import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Formik } from 'formik';
import { FloatingLabelInput } from 'react-native-floating-label-input';
import { Picker } from '@react-native-picker/picker';
import { set } from 'react-native-reanimated';

export default function CameraData({navigation,route}) {
  console.log("toute",route);
  let mobile=[]
  let alldata=[];
  const data=[]
  const[maindata,setmaindata]=useState(alldata)
  const [phone,setphone]=useState(mobile)
  let [email,setemail]=useState()

  useEffect(() => {
    filteringData()
    modifyData()
    // onlyData()
  }, [])
const filteringData=async()=>{
  await route.params.result.map((e)=>{
    alldata.push(e.text.split("\n").toString());
  })
}
console.log("hi",maindata);

const modifyData=()=>{
  alldata.map(e=>{
    if(e.match(/\d/g))
       {
       var numb = e.match(/\d/g);
       numb = numb.join("")
       mobile.push(numb)
       console.log("number",mobile);
    
        }
        if(e.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi))
        {
          let emails=e.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi)
          setemail(emails)
        }
    })
  
}
const onlyData=()=>{
   alldata.filter((e)=>{
      if(!(e.match(/\d/g) || e.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi)))
     { data.push(e.split('').join(''))
      }
      })
      
}

//  const fliteredData= route.params.filter((e)=>{
//   if(!(e.text.match(/\d/g) || e.text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi)))
//   return e
//   })
// route.params.map(e=>{
//    if(e.text.match(/\d/g))
//    {
//    var numb = e.text.match(/\d/g);
//    if(numb.length==10)
//   { numb = numb.join("")
//    phone.push(numb)}
//    else
//   { 
//     let temp=numb
//     var lengths=temp.length
//     let result=[]
//     if(temp.length>10)
//        {var first = temp.slice(0,11).join("");
//     var second= temp.slice(11,lengths).join("")
//     result.push({first,second})
   
// phone.push(first,second)}
// }
//     }
// })
// console.log("phne",data[7].match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi));
// route.params.map(e=>{
//     if(e.text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi))
//     {
    
//         email.push(e.text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi))
//     }
// })



    return (
    <ScrollView>
      <Formik
        // initialValues={{ name: fliteredData[0]?.text, phone: phone[0], email: email[0]?.toString(), jobTitle: fliteredData[3]?.text}}
        initialValues={{ name:'', phone:'', email:'', jobTitle:''}}
        // validationSchema={validationSchema}
        onSubmit={values => navigation.navigate("OcrDataEdit",{data:values,picId:route.params.other})}
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
          <View style={styles.pickerInput}>
            <Picker style={{ color: '#43628e', placeholder:"phone", display: 'flex', bottom: 6 }}
              selectedValue={values.name}
              onValueChange={handleChange('name')}
              
            >
              {maindata.map(x =>
                <Picker.Item label={x} value={x} />)}
              
            </Picker>
          </View>
          </View>
           
          <View style={styles.card}>
            <View style={styles.Picker}>
          <Text>Mobile No</Text>
          </View>
          <View style={styles.pickerInput}>
            <Picker style={{ color: '#43628e', placeholder:"phone", display: 'flex', bottom: 6 }}
              selectedValue={values.phone}
              onValueChange={handleChange('phone')}
              
            >
              {phone?.map(x =>
                <Picker.Item label={x} value={x} />)}
            </Picker>
          </View>
         </View>

         <View style={styles.card}>
          <View style={styles.Picker}>
          <Text>Email Id</Text>
          </View>
             <View style={styles.pickerInput}>
            <Picker style={{ color: '#43628e',display: 'flex', bottom: 6 }}
              selectedValue={values.email}
              onValueChange={handleChange('email')}
            >
              {email?.map(x =>
                <Picker.Item label={x} value={x} />)}
            </Picker>
          </View>
                </View>

                <View style={styles.card}>
          <View style={styles.Picker}>
          <Text>Job Title</Text>
          </View>

          <View style={styles.pickerInput}>
            <Picker style={{ color: '#43628e', placeholder:"email", display: 'flex', bottom: 6 }}
              selectedValue={values.jobTitle}
              onValueChange={handleChange('jobTitle')}
            >
              {maindata.map(x =>
                <Picker.Item label={x} value={x} />)}
            </Picker>
          </View>
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