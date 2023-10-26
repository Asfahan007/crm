import React, { useRef } from 'react';
import { useDispatch } from 'react-redux'
import { Button, ImageBackground, Text, TextInput, View } from "react-native";
import MaterialButton from '@/MD/components/MaterialButton';
import MaterialInput from '@/MD/components/MaterialInput';
import { storageImageUrl } from '@/MD/tools/Helpers';
import MaterialSnackbar from '@/MD/components/MaterialSnackbar';
import { useTranslation } from 'react-i18next'
import { signIn } from '@/Store/Auth'
import { Formik } from 'formik';

let margin = 20;

function ChangePassword({navigation}) {
    const snackbarRef = useRef(null);
    const { t } = useTranslation()

    const dispatch = useDispatch()

    const onSubmit = (values) => {
        alert("Password saved succesfully")
    }

    return (
        <ImageBackground style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ flex: 1, marginHorizontal: 10, justifyContent: 'center', paddingBottom: margin }}>
            
                <View style={{ padding: margin,  }}>
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
                        <Text style={{ color: '#ffffff', fontSize: 24 }}>POS</Text>
                    </View>
                    <Formik
                        initialValues={{ username: '', password: '' }}
                        onSubmit={values => onSubmit(values)}
                    >

                        {({ handleChange, handleBlur, handleSubmit, values }) => (
                            <>

                                <TextInput
                                    placeholder={t('Old Password')}
                                    placeholderTextColor="#000"
                                    onChangeText={handleChange('username')}
                                    onBlur={handleBlur('username')}
                                    value={values.username}
                                    style={[{
                                        height: 44,
                                        padding: 10,
                                        marginTop: 10,
                                        backgroundColor: '#f1f5f7',
                                        borderWidth: 0,
                                        borderColor: 'grey',
                                        color: '#000000'
                                    }]}
                                />

                                <TextInput
                                    placeholder={t('New Password')}
                                    placeholderTextColor="#000"
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    value={values.password}
                                    secureTextEntry={true}
                                    style={[{
                                        height: 44,
                                        padding: 10,
                                        marginTop: 10,
                                        backgroundColor: '#f1f5f7',
                                        borderWidth: 0,
                                        borderColor: 'white',
                                        color: '#000000'
                                    }]}
                                />
                                <TextInput
                                    placeholder={t('Confirm New Password')}
                                    placeholderTextColor="#000"
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    // value={values.password}
                                    secureTextEntry={true}
                                    style={[{
                                        height: 44,
                                        padding: 10,
                                        marginTop: 10,
                                        backgroundColor: '#f1f5f7',
                                        borderWidth: 0,
                                        borderColor: 'white',
                                        color: '#000000'
                                    }]}
                                />
                                <View style={{ marginTop: 20 }}>
                                    <Button onPress={handleSubmit} color="#00b8ce" title={t('Submit')} />
                                </View>
                                {/* <View style={{ marginTop: 20 }}>
                                    <Button onPress={()=>navigation.navigate('UserProfile')} color="#00b8ce" title={t('profile')} />
                                </View>
                                <View style={{ marginTop: 20 }}>
                                    <Button onPress={()=>navigation.navigate('HomePage')} color="#00b8ce" title={t('Home Page')} />
                                </View> */}
                            </>
                        )}

                    </Formik>
                </View>

            </View>
            <MaterialSnackbar ref={snackbarRef} />
        </ImageBackground>
    );
}

export default ChangePassword;