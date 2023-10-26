import React, { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Button, TouchableOpacity, Text, TextInput, View, StyleSheet, ImageBackground, ActivityIndicator, Alert } from 'react-native'
// import MaterialButton from '@/MD/components/MaterialButton'
// import MaterialInput from '@/MD/components/MaterialInput'
import MaterialCheckBox from '../../MD/components/MaterialCheckBox'
import { storageImageUrl } from '@/MD/tools/Helpers'
import MaterialSnackbar from '../../MD/components/MaterialSnackbar'
import { useTranslation } from 'react-i18next'
import { signIn } from '../../Store/Auth'
import { Formik } from 'formik'
import axios from 'axios'
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react'
import { store } from '@/Store'

let margin = 20

function LoginContainer({ navigation }) {
  const snackbarRef = useRef(null)
  const { t } = useTranslation()
  const [username, setUsername] = useState("");
  const [role, setRole] = useState(null);
  const [token, setToken] = useState("");
  const [mobileDeviceFCMToken, setMobileDeviceFCMToken] = useState()
  const [isLoader, setisLoader] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    messaging().getToken(firebase.app().options.messagingSenderId)
      .then(x => setMobileDeviceFCMToken(x))
      .catch(e => console.log(e));
  }, []);

  // const getData = (values) => {
  //   console.log("values",values);
  //   var myHeaders = new Headers();
  //   myHeaders.append("Content-Type", "application/json");

  //   let profile = {
  //     name: values.usernames,
  //     role: role,
  //     // token:token,
  //   }
  //   var raw = JSON.stringify({
  //     username: values.usernames,
  //     password: values.passwords,
  //     // token: values.token,
  //   });

  //   var requestOptions = {
  //     method: 'POST',
  //     headers: myHeaders,
  //     body: raw,
  //     redirect: 'follow'
  //   };

  //   fetch("https://apps.trisysit.com/posbackendapi/login", requestOptions)
  //     .then(response =>response.json())
  //     .then((result) => {
  //       console.log("values2",result.token==undefined);
  //       if(result.token==undefined)
  //       {
  //         setisLoader(false)
  //         Alert.alert("Invalid credentials!",
  //         'Please Enter Valid Credentials',
  //         [
  //           {
  //             text: 'Ok',
  //           },
  //         ],
  //         { cancelable: false },
  //       )
  //       }
  //       else{
  //         setisLoader(false)
  //         setUsername(result.username)
  //         setToken(result.token)
  //         setRole(result.userRole)
  //         dispatch(signIn({ profile, isLoggedIn: result.username ? true : false, token: result.token ? result.token : null, role: result.userRole ? result.userRole : null }))

  //       }

  //     })
  //     .catch(error => {
  //       console.log('error', error)
  //       setisLoader(false)
  //       Alert.alert("Invalid credentials!",
  //         'Please Enter Valid Credentials',
  //         [
  //           {
  //             text: 'Ok',
  //           },
  //         ],
  //         { cancelable: false },
  //       )
  //     }
  //     );

  // }

  const handleLogin = (values) => {
    let profile = {
      name: values.usernames,
      role: role,
    }
    var raw = JSON.stringify({
      username: values.usernames,
      password: values.passwords,
      mobileDeviceId: mobileDeviceFCMToken
    });

    console.log("payload login", raw)

    const headers = {
      'content-type': 'application/json'
    }

    axios.post("https://apps.trisysit.com/posbackendapi/login", raw, { headers: headers })
      .then(e => {
        console.log("login response", raw, e)
        let token = e.data.token;
        if (token == undefined) {
          setisLoader(false)
          Alert.alert("Network Error!",
            'Try again after sometime',
            [
              {
                text: 'Ok',
              },
            ],
            { cancelable: false },
          )
        }
        else {
          setisLoader(false)
          setUsername(e.data.username)
          setToken(token)
          setRole(e.data.userRole)
          dispatch(signIn({ profile, isLoggedIn: true, token: token, role: e.data.userRole, firstName: e.data.firstName, lastName: e.data.lastName, storeId: e.data.storeId, companyId: e.data.companyId }))
        }
      })
      .catch((e) => {
        console.log(e)
        setisLoader(false)
        Alert.alert("Invalid credentials!",
          'Please Enter Valid Credentials',
          [
            {
              text: 'Ok',
            },
          ],
          { cancelable: false },
        )
      })
  }

  const onSubmit = (values) => {
    console.log(values.passwords == "")
    if (values.usernames == "" && values.passwords == "") {
      Alert.alert("Fields Are Empty",
        'Please Enter Username and Password',
        [
          {
            text: 'Ok',
          },
        ],
        { cancelable: false },
      )

    }
    else if (values.usernames == "") {
      Alert.alert("Username is empty",
        'Please Enter Your Username',
        [
          {
            text: 'Ok',
          },
        ],
        { cancelable: false },
      )

    }
    else if (values.passwords == "") {
      Alert.alert("Password is empty",
        'Please Enter Your Password',
        [
          {
            text: 'Ok',
          },
        ],
        { cancelable: false },
      )
    }
    else {
      setisLoader(true)
      handleLogin(values)
    }
    // console.log("empty");
    // getData(values)
  }

  return (
    <>
      {console.log("signout", store.getState().auth.role)}
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ImageBackground source={require("../../Assets/Images/unnamed.jpg")} style={{ height: '100%' }}>
          <View
            style={{
              marginHorizontal: 10,
              backgroundColor: 'transparent',
              margin: margin,
              top: 200,
              justifyContent: 'center',
              elevation: 5,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.9
            }}
          >
            <View style={{
              width: 86,
              height: 86,
              alignSelf: 'center',
              marginTop: -60,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#00b8ce',
              borderRadius: 50,
            }}>
              <Text style={{ color: '#ffffff', fontSize: 24 }}>CRM</Text>
            </View>
            <View style={{ padding: margin, }}>
              <Formik
                initialValues={{ usernames: '', passwords: '' }}
                onSubmit={values => onSubmit(values)}
              >
                {({ handleChange, handleBlur, handleSubmit, values }) => (
                  <>
                    <TextInput
                      placeholder={t('auth.username')}
                      placeholderTextColor="grey"
                      onChangeText={handleChange('usernames')}
                      onBlur={handleBlur('usernames')}
                      value={values.usernames}
                      style={[
                        {
                          height: 44,
                          padding: 10,
                          marginTop: 10,
                          backgroundColor: '#f1f5f7',
                          borderWidth: 0,
                          borderColor: 'white',
                          color: '#000000',
                          borderRadius: 10,
                        },
                      ]}
                    />
                    <TextInput
                      placeholder={t('auth.password')}
                      placeholderTextColor="grey"
                      onChangeText={handleChange('passwords')}
                      onBlur={handleBlur('passwords')}
                      value={values.passwords}
                      secureTextEntry={true}
                      style={[
                        {
                          height: 44,
                          padding: 10,
                          marginTop: 10,
                          backgroundColor: '#f1f5f7',
                          borderWidth: 0,
                          borderColor: 'white',
                          color: '#000000',
                          borderRadius: 10

                        },
                      ]}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: 20,
                        marginBottom: 40,
                      }}
                    >
                      <MaterialCheckBox title="Remember me" color={'#ffffff'} />
                      <TouchableOpacity
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        onPress={() =>
                          snackbarRef.current.ShowSnackBarFunction(
                            'forgot password clicked',
                          )
                        }
                      >
                        <Text
                          style={{
                            fontSize: 14,
                            textAlign: 'center',
                            color: '#ffffff',
                          }}
                        >
                          Forgot Password ?
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.loginButton} onPress={handleSubmit} disabled={isLoader}>
                      {isLoader ? <ActivityIndicator size='large' color="white" /> : <Text style={{ color: "#fff", fontSize: 17 }}>{t('auth.login')}</Text>}
                    </TouchableOpacity>

                  </>
                )}
              </Formik>
            </View>
          </View>
        </ImageBackground>
      </View>
      <MaterialSnackbar ref={snackbarRef} />
    </>
  )
}

const styles = StyleSheet.create({

  loginButton: {
    alignItems: "center",
    backgroundColor: "#00b8ce",
    padding: 12,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    borderRadius: 10,
  },

});


export default LoginContainer
