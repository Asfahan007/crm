import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native'
import React from 'react'
import { Formik } from 'formik'
import { FloatingLabelInput } from 'react-native-floating-label-input'
import { Picker } from '@react-native-picker/picker'
import { openDatabase } from 'react-native-sqlite-storage'
import { useEffect, useLayoutEffect } from 'react'
import * as Yup from 'yup'
import {
  cancelButton,
  cancelText,
  cardContainer,
  errorMessage,
  floatingLabelContainer,
  floatingLabelContainerInternal,
  pickerInputContainer,
  placeholderTextColor,
  pickerItem,
  saveAndCancel,
  saveButton,
  saveText,
} from '../../Containers/CustomComponents/Style'
import SaveAndCancelButton from '../../Containers/CustomComponents/SaveAndCancelButton'
import CardWrapper from '../../Containers/CustomComponents/CardWrapper'
// import EditAccount from './EditAccount'
import { now } from 'moment'
import { store } from '../../Store'
// import { checkPluginState } from 'react-native-reanimated/lib/reanimated2/core'

const db = openDatabase({
  name: 'customer_database',
})

const AddProduct = ({ navigation, route }) => {
  const editProduct = route?.params?.params
  console.log('company route zzzzzzzzzzzzzzzzzzzz', route)
  let sku = (Date.now() % 100000000).toString()

  const validationSchema = Yup.object({
    productName: Yup.string()
      .min(2, 'Too Short!')
      .max(30, 'Too Long!')
      .required('Product Name is Required'),

    productDescription: Yup.string().required(
      'Product Description is Required',
    ),
    brandName: Yup.string()
      .min(2, 'Too Short!')
      .max(30, 'Too Long!')
      .required('Brand Name is Required'),

    status: Yup.string().required('Status is Required'),
    category: Yup.string().required('Category is Required'),
    subCategory: Yup.string().required('Sub category is Required'),
    sizing: Yup.string().required('Size is Required'),
    mrp: Yup.number().required('Mrp is Required'),
    // quantity: Yup.string().required('Quantity is Required'),
    // sku: Yup.string().required('Sku is Required'),

  })
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: editProduct ? 'Edit Product' : 'Add Product',
    })
  }, [])

  const handleSubmit = values => {
    console.log('payload', [
      {
        "productId": "",
        "productName": values?.productName || "",
        "productDescription": values?.productDescription || "",
        "sku": sku,
        "category": values?.category || "",
        "brandName": values?.brandName || "",
        "subCategory": values?.subCategory || "",
        "mrp": values?.mrp || "",
        "qty": null,
        "sellingprice": values?.mrp || "",
        "discountedPrice": "",
        "discountedPercentage": "",
        "status": values?.status || "",
        "sizing": values?.sizing || "",
        "taxApplicable": "",
        "taxPercentable": "",
        "createdBy": store.getState().auth.profile.name || "",
        "updatedBy": "",
        "createdDate": "",
        "updatedDate": "",
        "companyId": "",
        "storeId": store.getState().auth.storeId || ""
      }
    ])

    fetch(
      `https://apps.trisysit.com/posbackendapi/api/product/saveOrUpdate/1`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer' + store.getState().auth.token,
        },
        body: JSON.stringify(
          [
            {
              "productId": "",
              "productName": values?.productName || "",
              "productDescription": values?.productDescription || "",
              "sku": sku,
              "category": values?.category || "",
              "brandName": values?.brandName || "",
              "subCategory": values?.subCategory || "",
              "mrp": values?.mrp || "",
              "qty": null,
              "sellingprice": values?.mrp || "",
              "discountedPrice": "",
              "discountedPercentage": "",
              "status": values?.status || "",
              "sizing": values?.sizing || "",
              "taxApplicable": "",
              "taxPercentable": "",
              "createdBy": store.getState().auth.profile.name || "",
              "updatedBy": "",
              "createdDate": "",
              "updatedDate": "",
              "companyId": "",
              "storeId": store.getState().auth.storeId || ""
            }
          ]
        ),
      },
    )
      .then(response => response.json())
      .then(result => {
        console.log('iiiiiiiii', result)
        result.data?.forEach(i => {
          db.transaction(txn => {
            txn.executeSql(
              'INSERT INTO product_info (productId,productName,productDescription,brandName,category,subCategory,sizing,mrp,quantity,status,sku) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
              [
                i.productId,
                i.productName,
                i.productDescription,
                i.brandName,
                i.category,
                i.subCategory,
                i.sizing,
                i.mrp,
                i.quantity,
                i.status,
                i.sku,
              ],
              (txn, res) => {
                console.log('INSERTED INTO TABLE', res)
                Alert.alert(
                  'Success',
                  'Product added successfully',
                  [
                    {
                      text: 'Ok',
                      onPress: () => navigation.navigate('Product Inventory'),
                    },
                  ],
                  { cancelable: false },
                )
              },
              error => {
                console.log('error is', error)
              },
            )
          })
        })
      })
      .catch(error => console.log('errorrr', error))
    // db.transaction(function (txn) {
    //   editProduct
    //     ? txn.executeSql(
    //       'UPDATE product_info SET productName=?,productDescription=?,brandName=?,category=?,subCategory=?,sizing=?,mrp=?,quantity=?,status=?,sku=? WHERE productId=?',
    //       [
    //         values.productName,
    //         values.productDescription,
    //         values.brandName,
    //         values.category,
    //         values.subCategory,
    //         values.sizing,
    //         values.mrp,
    //         values.quantity,
    //         values.productId,
    //         values.status,
    //         values.sku,
    //       ],
    //       (txn, results) => {
    //         console.log('updateeeeed', results)
    //         // console.log(object)
    //         if (results.rowsAffected > 0) {
    //           Alert.alert(
    //             'Success',
    //             'Product updated successfully',
    //             [
    //               {
    //                 text: 'Ok',
    //                 onPress: () =>
    //                   navigation.navigate('Product Inventory', { id: editProduct.id }),
    //               },
    //             ],
    //             { cancelable: false },
    //           )
    //         } else alert('Updation Failed')
    //       },
    //     )
    //     : txn.executeSql(
    //       'INSERT INTO product_info (productId,productName,productDescription,brandName,category,subCategory,sizing,mrp,quantity,status,sku) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
    //       [
    //         values?.productId || "",
    //         values.productName,
    //         values.productDescription,
    //         values.brandName,
    //         values.category,
    //         values.subCategory,
    //         values.sizing,
    //         values.mrp,
    //         values.quantity,
    //         values.status,
    //         values.sku,
    //       ],
    //       (txn, res) => {
    //         console.log('INSERTED INTO TABLE', res)
    //         Alert.alert(
    //           'Success',
    //           'Product added successfully',
    //           [
    //             {
    //               text: 'Ok',
    //               onPress: () => navigation.navigate('Product Inventory'),
    //             },
    //           ],
    //           { cancelable: false },
    //         )
    //       },
    //       error => {
    //         console.log('error is', error)
    //       },
    //     )
    // })
  }

  return (
    <CardWrapper>
      <Formik
        initialValues={{
          productName: editProduct?.productName || '',
          productDescription: editProduct?.productDescription || '',
          brandName: editProduct?.brandName || '',
          category: editProduct?.category || '',
          subCategory: editProduct?.subCategory || '',
          sizing: editProduct?.sizing || '',
          mrp: editProduct?.mrp || '',
          quantity: editProduct?.quantity || '',
          status: editProduct?.status || '',
        }}
        validationSchema={validationSchema}
        onSubmit={values => handleSubmit(values)}
      >
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
              <TextInput
                style={floatingLabelContainerInternal}
                onChangeText={handleChange('productName')}
                value={values.companyName}
                placeholderTextColor={placeholderTextColor}
                placeholder="Product Name"
              />
              {errors.productName && touched.productName && (
                <Text style={errorMessage}>{errors.productName}</Text>
              )}
            </View>

            <View style={floatingLabelContainer}>
              <TextInput
                style={floatingLabelContainerInternal}
                onChangeText={handleChange('productDescription')}
                value={values.companyDescription}
                placeholderTextColor={placeholderTextColor}
                placeholder="Product Description"
              />
              {errors.productDescription && touched.productDescription && (
                <Text style={errorMessage}>{errors.productDescription}</Text>
              )}
            </View>

            {/* <View style={floatingLabelContainer}>

              <TextInput
                style={floatingLabelContainerInternal}
                onChangeText={handleChange('sku')}
                keyboardType="numeric"
                value={values.sku}
                placeholderTextColor={placeholderTextColor}
                placeholder="Sku"
              />
              {errors.sku && touched.sku && (
                <Text style={errorMessage}>{errors.sku}</Text>
              )}
            </View> */}

            <View style={floatingLabelContainer}>
              <TextInput
                style={[floatingLabelContainerInternal, { backgroundColor: '#F0F0F0', color: '#49658c' }]}
                onChangeText={handleChange('sku')}
                placeholderTextColor={placeholderTextColor}
                value={sku}
                editable={false}
              />
            </View>

            <View style={floatingLabelContainer}>
              <TextInput
                style={floatingLabelContainerInternal}
                onChangeText={handleChange('brandName')}
                value={values.companyDescription}
                placeholderTextColor={placeholderTextColor}
                placeholder="Brand Name"
              />
              {errors.brandName && touched.brandName && (
                <Text style={errorMessage}>{errors.brandName}</Text>
              )}
            </View>

            <View style={floatingLabelContainer}>
              <TextInput
                style={floatingLabelContainerInternal}
                onChangeText={handleChange('category')}
                value={values.companyDescription}
                placeholderTextColor={placeholderTextColor}
                placeholder="Category"
              />
              {errors.category && touched.category && (
                <Text style={errorMessage}>{errors.category}</Text>
              )}
            </View>

            <View style={floatingLabelContainer}>
              <TextInput
                style={floatingLabelContainerInternal}
                onChangeText={handleChange('subCategory')}
                value={values.subCategory}
                placeholderTextColor={placeholderTextColor}
                placeholder="Sub Category"
              />
              {errors.subCategory && touched.subCategory && (
                <Text style={errorMessage}>{errors.subCategory}</Text>
              )}
            </View>

            <View style={floatingLabelContainer}>

              <TextInput
                style={floatingLabelContainerInternal}
                onChangeText={handleChange('sizing')}
                //   keyboardType="numeric"
                value={values.sizing}
                placeholderTextColor={placeholderTextColor}
                placeholder="Sizing"
              />
              {errors.sizing && touched.sizing && (
                <Text style={errorMessage}>{errors.sizing}</Text>
              )}
            </View>

            <View style={floatingLabelContainer}>
              <TextInput
                style={floatingLabelContainerInternal}
                onChangeText={handleChange('mrp')}
                keyboardType="numeric"
                value={values.mrp}
                placeholderTextColor={placeholderTextColor}
                placeholder="Mrp"
              />
              {errors.mrp && touched.mrp && (
                <Text style={errorMessage}>{errors.mrp}</Text>
              )}
            </View>

            <View style={pickerInputContainer}>
              <Picker
                style={{
                  bottom: 3.5,
                  display: 'flex',
                }}
                selectedValue={values.status}
                onValueChange={handleChange('status')}
              >
                <Picker.Item label="Status" value="" style={pickerItem} />
                <Picker.Item label="Active" value="Active" style={pickerItem} />
                <Picker.Item
                  label="Inactive"
                  value="Inactive"
                  style={pickerItem}
                />
              </Picker>
              {errors.status && touched.status && (
                <Text style={errorMessage}>{errors.status}</Text>
              )}
            </View>

            <SaveAndCancelButton
              handleSubmit={handleSubmit}
              saveTitle={editProduct ? 'Update' : 'Create'}
              navigation={navigation}
              screenName="Product Inventory"
            />
          </View>
        )}
      </Formik>
    </CardWrapper>
  )
}

export default AddProduct
