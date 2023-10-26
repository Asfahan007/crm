import React, { useRef } from 'react';
import { useDispatch } from 'react-redux'
import { Button, ImageBackground, Text, TextInput, View } from "react-native";
import MaterialButton from '../../MD/components/MaterialButton';
import MaterialInput from '../../MD/components/MaterialInput';
import { storageImageUrl } from '../../MD/tools/Helpers';
import MaterialSnackbar from '../../MD/components/MaterialSnackbar';
import { useTranslation } from 'react-i18next'
import { signIn } from '../../Store/Auth'
import { Formik } from 'formik';
import { textColor } from '../../Containers/CustomComponents/Image'


let margin = 20;

function CustomerContainer() {
    const snackbarRef = useRef(null);
    const { t } = useTranslation()

    const dispatch = useDispatch()

    const onSubmit = (values) => {
        snackbarRef.current.ShowSnackBarFunction('Logged In Successfully!'+JSON.stringify(values));
        console.log('Logged In Successfully!'+JSON.stringify(values));
        let profile = {
            name: 'Jithendra Reddy',
            role: "STORE_CLERK",
            mobile: '9030920590'
        }
        let token = 'thisisasampletokenstring';
        dispatch(signIn({ profile, isLoggedIn: true, token }))
    }

    return (
        <ImageBackground source={{ uri: storageImageUrl('signup_login', 'login_register_2_960.jpg') }}
            style={{ flex: 1, backgroundColor: 'gray' }}>
            <View style={{ flex: 1, marginHorizontal: 10, justifyContent: 'center', paddingBottom: margin }}>
                <View style={{ padding: margin, backgroundColor: 'white' }}>
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
                                    placeholder={t('auth.username')}
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
                                        borderColor: 'white',
                                        color: {textColor}
                                    }]}
                                />

                                <TextInput
                                    placeholder={t('auth.password')}
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
                                        color: {textColor}
                                    }]}
                                />
                                <View style={{ marginTop: 20 }}>
                                    <Button onPress={handleSubmit} color="#00b8ce" title={t('auth.login')} />
                                </View>
                            </>
                        )}

                    </Formik>
                </View>

            </View>
            <MaterialSnackbar ref={snackbarRef} />
        </ImageBackground>
    );
}

export default CustomerContainer;