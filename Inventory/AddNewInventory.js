import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native'
import React, { useEffect, useState, useLayoutEffect } from 'react'
import { openDatabase } from 'react-native-sqlite-storage'
import { FloatingLabelInput } from 'react-native-floating-label-input'
import { Dropdown } from 'react-native-element-dropdown'
import { useIsFocused } from '@react-navigation/native'
import { ScrollView } from 'react-native-gesture-handler'
import * as Yup from 'yup'
import { Formik } from 'formik'
import RBSheet from 'react-native-raw-bottom-sheet'
import { useRef } from 'react'
import { store } from '../../Store'
import { textColor } from '../../Containers/CustomComponents/Image'
import { hasStore, hasTerritory ,hasCompany} from '../IsAvailable/IsAvailable'

import MultiSelect from '../Deal/Deals/Deals/MultiSelect'
import CardWrapper from '../CustomComponents/CardWrapper'
import {
  cardContainer,
  floatingLabelContainer,
  floatingLabelContainerInternal,
  multiSelectOptions,
  placeholderTextColor,
} from '../CustomComponents/Style'
import SaveAndCancelButton from '../CustomComponents/SaveAndCancelButton'
import generateUUID from '../CustomComponents/GetUUID'

const db = openDatabase({
  name: 'customer_database',
})

const AddNewInventory = ({ navigation, route }) => {
  const [allData, setAllData] = useState([])
  const isFocussed = useIsFocused()
  const [dataSubCategory, setdataSubCategory] = useState([])
  const [productSize, setProductSize] = useState([])
  const [showSubCategory, setShowSubCategory] = useState(
    route?.params ? true : false,
  )
  const [showProduct, setShowProduct] = useState(
    route?.params ? true : false,
  )
  const [showSize, setShowSize] = useState(route?.params ? true : false)
  const [productNames, setProductNames] = useState([])
  let editInventory = route?.params
  let loginToken = store.getState().auth.token
  const [storeName, setStoreName] = useState([])
  const [territoryName, setTerritoryName] = useState([])
  const [categoryname, setCategoryname] = useState('')
  const [productName, setProductName] = useState('')
  const [subcategoryName, setSubcategoryName] = useState('')
  const [sizingno, setSizingno] = useState('')
  const [storeData, setStoreData] = useState([])
  const [storeValue, setStoreValue] = useState()
  const [territoryValue, setTerritoryValue] = useState('')
  const [territoryData, setTerritoryData] = useState([])
  const [territoryId, setTerritoryId] = useState()
  const isFocused = useIsFocused()
  const [companyData, setCompanyData] = useState([])
  const [companyId, setCompanyId] = useState()
  const [companyN, setCompanyN] = useState([])

  console.log('add or edit inventory', route)

  const validationSchema = Yup.object().shape({
    // sizing: Yup.string().required('Size is required').label('Store Name'),
    qty: Yup.string().required('Quantity is required').label('Status'),
    mrp: Yup.string().required('Price is required').label('Status'),
    // subCategory: Yup.string()
    //   .required('Sub Category is required')
    //   .label('Store Name'),
    sizing:
      showSize && sizingno
        ? Yup.string().test('isRequired', 'Product Size is required', () => {
          if (sizingno != '') return true
          return false
        })
        : Yup.string().required('Product size is required').label('Store Name'),
    subCategory:
      showSubCategory && subcategoryName
        ? Yup.string().test('isRequired', 'Sub Category is required', () => {
          if (subcategoryName != '') return true
          return false
        })
        : Yup.string().required('Sub Ctegory is required').label('Store Name'),
    // category: Yup.string()
    //   .required('Product Ctegory is required')
    //   .label('Store Name'),
    category: categoryname
      ? Yup.string().test('isRequired', 'Product Category is required', () => {
        if (categoryname != '') return true
        return false
      })
      : Yup.string()
        .required('Product Ctegory is required')
        .label('Store Name'),
    productName:
      showProduct && productName
        ? Yup.string().test('isRequired', 'Product Name is required', () => {
          if (productName != '') return true
          return false
        })
        : Yup.string().required('ProductName is required').label('Store Name'),
  })

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: editInventory ? 'Edit Inventory' : 'Add Inventory',
    })
  }, [])
  const companyEdit = {
    id: route?.params?.companyId,
    item: companyN[0]?.item,
  }
  const getCompanyName = () => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * from company_info WHERE companyId=?',
        [route?.params?.companyId],
        (tx, res) => {
          let len = res.rows.length
          if (len > 0) {
            let results = []
            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              results.push({
                item: item?.companyName,
              })
            }
            setCompanyN(results)
          }
        },
        error => {
          console.log('error while GETTING', error.message)
        },
      )
    })
  }


  console.log('jkjkajskjskajs',companyN)
  const getProductSize = () => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT distinct sizing from product_info where productName=? ORDER BY productId ASC',
        [productName?.item],
        (tx, res) => {
          let len = res.rows.length
          if (len > 0) {
            let results = []

            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              results.push({
                item: item.sizing,
                id: i,
              })
              setProductSize(results)
            }
          }
        },
        error => {
          console.log('error while GETTING', error.message)
        },
      )
    })
  }

  const getProductSubCategory = () => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT distinct subCategory from product_info where category=? ORDER BY productId ASC',
        [categoryname],
        (tx, res) => {
          let len = res.rows.length
          if (len > 0) {
            let results = []

            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              results.push({
                item: item.subCategory.trim(),
                id: i,
              })
              setdataSubCategory(results)
            }
          }
        },
        error => {
          console.log('error while GETTING', error.message)
        },
      )
    })
  }

  const getProductCategory = async () => {
    await db.transaction(txn => {
      txn.executeSql(
        'SELECT distinct category from product_info  ORDER BY productId ASC',
        [],

        (tx, res) => {
          let len = res.rows.length
          if (len > 0) {
            let results = []
            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              results.push({
                item: item.category,
                id: i,
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

  const getProductNames = async () => {
    await db.transaction(txn => {
      txn.executeSql(
        'SELECT * from product_info where subCategory=?',
        [subcategoryName],

        (tx, res) => {
          let len = res.rows.length
          if (len > 0) {
            let results = []

            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              results.push({
                item: item.productName,
                id: item?.productId,
              })
              setProductNames(results)
            }
          }
        },
        error => {
          console.log('error while GETTING', error.message)
        },
      )
    })
  }

  const getSubProduct = value => {
    console.log('sub pro', value)
    setShowSubCategory(true)
    setCategoryname(value.item)
    // setInsertProduct(prev => ({
    //   ...prev,
    //   category: value.item,
    // }))
  }

  const getProduct = value => {
    console.log('sub product', value)
    setShowProduct(true)
     setSubcategoryName(value.item)
    // setInsertProduct(prev => ({
    //   ...prev,
    //   subCategory: value.item,
    // }))
  }
  const getSize = value => {
    console.log('main pro', value)
    setShowSize(true)
    setProductName(value)
    // setInsertProduct(prev => ({
    //   ...prev,
    //   productName: value.item,
    // }))
  }
console.log('shgshjas',productName)
  const selectSize = value => {
    console.log('size', value)
    setSizingno(value.item)
    // setData(value)
    // setInsertProduct(prev => ({
    //   ...prev,
    //   sizing: value.item,
    // }))
  }
  const getCompany = values => {
    console.log('company', values)
    // setCompanyValue(values)
    setCompanyId(values.companyId)
    
  }

  const getTerritoryDropdown = () => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * from territory_info where companyId=? and companyId not in ("")',
        [companyId],
        (tx, res) => {
          let len = res.rows.length
          if (len > 0) {
            let results = []
            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              results.push({
                id: item.id,
                item: item.territoryName,
                territoryId: item.territoryId,
              })
              setTerritoryData(results)
            }
          }
        },
        error => {
          console.log('error while GETTING', error.message)
        },
      )
    })
  }

  const getStoreDropdown = () => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * from store_info WHERE territoryId =? or mobileTerritoryId=?',
        [territoryValue?.territoryId, territoryValue?.mobileTerritoryId],
        (tx, res) => {
          let len = res.rows.length
          let results = []
          if (len > 0) {
            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              results.push({
                ...item,
                id: item.id,
                item: item.storeName
              })
            }
          }
          setStoreData(results)
        },
        error => {
          console.log('error while GETTING', error.message)
        },
      )
    })
  }

  const getTerritory = values => {
    console.log('terri iddddddd', values.territoryId)
    setTerritoryValue(values)
    setTerritoryId(values.territoryId)
  }

  const getStore = values => {
    console.log('store', values)
    setStoreValue(values)
    // setStoreId(values)
  }
  useEffect(() => {
    getCompanyName()
  }, [companyData])
  useEffect(() => {
    getTerritoryDropdown()
  }, [isFocused,companyId])

  useEffect(() => {
    getStoreDropdown()
  }, [territoryId])

  const handleSubmit = values => {
    console.log('inventory payload', [
      {
        productInventoryId: editInventory?.productInventoryId || '',
        mobileProductInventoryId: editInventory?.mobileProductInventoryId || generateUUID(),
        productId: productName?.id || editInventory?.productName ||  '',
        productName: productName?.item || editInventory?.productName || '',
        productDescription: values.productDescription || '',
        sku: editInventory?.sku || Date.now(),
        brandName: values.brandName || '',
        category: categoryname || editInventory?.category || '',
        subCategory: subcategoryName || editInventory?.subCategory || '',
        mrp: values.mrp || '',
        qty: values.qty || '',
        sellingprice: values.sellingprice || '',
        discountedPrice: values.discountedPrice || '',
        status: values.status || '',
        sizing: sizingno || editInventory?.sizing || '',
        taxApplicable: null,
        taxPercentable: null,
        createdBy: '',
        updatedBy: null,
        createdDate: editInventory?.createdDate || '',
        updatedDate: null,
        storeId: storeValue?.storeId || editInventory?.storeId || '',
        mobileStoreId: storeValue?.mobileStoreId || editInventory?.mobileStoreId || '',
        companyId:companyId||editInventory?.companyId|| store.getState().auth.companyId,
      },
    ])
    console.log('values', values)

    store.getState().online.isOnline ?
      fetch(
        `https://apps.trisysit.com/posbackendapi/api/syncProductInventory/saveOrUpdate/1`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer' + loginToken,
          },
          body: JSON.stringify(
            [
              {  

                productInventoryId: editInventory?.productInventoryId || '',
                mobileProductInventoryId: editInventory?.mobileProductInventoryId || generateUUID(),
                productId: productName?.id || editInventory?.productName ||  '',
                productName: productName?.item || editInventory?.productName || '',
                productDescription: values.productDescription || '',
                sku: editInventory?.sku || Date.now(),
                brandName: values.brandName || '',
                category: categoryname || editInventory?.category || '',
                subCategory: subcategoryName || editInventory?.subCategory || '',
                mrp: values.mrp || '',
                qty: values.qty || '',
                sellingprice: values.sellingprice || '',
                discountedPrice: values.discountedPrice || '',
                status: values.status || '',
                sizing: sizingno || editInventory?.sizing || '',
                taxApplicable: null,
                taxPercentable: null,
                createdBy: '',
                updatedBy: null,
                createdDate: editInventory?.createdDate || '',
                updatedDate: null,
                storeId: storeValue?.storeId || editInventory?.storeId || '',
                mobileStoreId: storeValue?.mobileStoreId || editInventory?.mobileStoreId || '',
                companyId:companyId||editInventory?.companyId|| store.getState().auth.companyId,
              },
            ]
          ),
        },
      )
        .then(response => response.json())
        .then(result => {
          console.log('backend inventory response', result)
          result.data?.forEach(i => {
            db.transaction(tx => {
              tx.executeSql(
                'INSERT OR REPLACE INTO inventory_info (mobileProductInventoryId,productInventoryId,productId,productName,productDescription,brandName,category,subCategory,sizing,mrp,qty,status,sku,storeId,createdDate,mobileStoreId,companyId,isOnline) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                [
                  i?.mobileProductInventoryId || generateUUID(),
                  i?.productInventoryId,
                  i?.productId,
                  i?.productName,
                  i?.productDescription,
                  i?.brandName,
                  i?.category,
                  i?.subCategory,
                  i?.sizing,
                  i?.mrp,
                  i?.qty,
                  i?.status,
                  i?.sku,
                  i?.storeId,
                  i?.createdDate,
                  i?.mobileStoreId,
                  i?.companyId,
                  true
                ],
                (txn, res) => {
                  console.log('successfully inserted inventory', res)
                  if (res.rowsAffected > 0) {
                    Alert.alert(
                      'Success',
                      `Inventory ${editInventory ? "updated" : "added"} successfully`,
                      [
                        {
                          text: 'Ok',
                          onPress: () =>
                            navigation.navigate('Inventory List'),
                        },
                      ],
                      { cancelable: false },
                    )
                  }
                },
                error => {
                  console.log('error while INSERTING inventory' + error.message)
                },
              )
            })
          })
        })
        .catch(error => console.log('errorrr', error))
      :
      db.transaction(tx => {
        tx.executeSql(
          'INSERT OR REPLACE INTO inventory_info (mobileProductInventoryId,productInventoryId,productId,productName,productDescription,brandName,category,subCategory,sizing,mrp,qty,status,sku,storeId,createdDate,mobileStoreId,companyId,isOnline) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
          [
            editInventory?.mobileProductInventoryId || generateUUID(),
            editInventory?.productInventoryId,
            productName?.id || editInventory?.productId,
            productName?.item || editInventory?.productName,
            values?.productDescription || editInventory?.productDescription,
            values?.brandName || editInventory?.brandName,
            categoryname || editInventory?.category || '',
            subcategoryName || editInventory?.subCategory || '',
            sizingno || editInventory?.sizing || '',
            values?.mrp,
            values?.qty,
            values?.status,
            editInventory?.sku || Date.now(),
            storeValue?.storeId || editInventory?.storeId || '',
            editInventory?.createdDate || (new Date(Date.UTC((new Date()).getUTCFullYear(), (new Date()).getUTCMonth(),
              (new Date()).getUTCDate(), (new Date()).getUTCHours(),
              (new Date()).getUTCMinutes(), (new Date()).getUTCSeconds()))).toISOString(),
            storeValue?.mobileStoreId || editInventory?.mobileStoreId || '',
            companyId||editInventory?.companyId||store.getState().auth.companyId,
            false
          ],
          (txn, res) => {
            console.log('successfully inserted inventory', res)
            if (res.rowsAffected > 0) {
              Alert.alert(
                'Success',
                `Inventory ${editInventory ? "updated" : "added"} offline`,
                [
                  {
                    text: 'Ok',
                    onPress: () =>
                      navigation.navigate('Inventory List'),
                  },
                ],
                { cancelable: false },
              )
            }
          },
          error => {
            console.log('error while INSERTING inventory' + error.message)
          },
        )
      })
  }

  useEffect(() => {
    getProductCategory()
  }, [])

  useEffect(()=>{
    getProductSubCategory()
  },[categoryname])

  useEffect(()=>{
    getProductNames()
  },[subcategoryName])

  useEffect(()=>{
    getProductSize()
  },[productName])

  

  console.log('sub', dataSubCategory)
  console.log('productname', productName)
  console.log('category', productSize)

  const getStoreName = () => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * from store_info WHERE storeId =? or mobileStoreId=?',
        [route?.params?.storeId, route?.params?.mobileStoreId],
        (txn, res) => {
          let len = res.rows.length
          if (len > 0) {
            let results = []
            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              results.push(item)
            }
            console.log('storrrreee', results)
            setStoreName(results)
          }
        },
        error => {
          console.log('error while GETTING', error.message)
        },
      )
    })
  }

  const getTerritoryName = () => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * from territory_info WHERE territoryId =? or mobileTerritoryId=?',
        [storeName[0]?.territoryId, storeName[0]?.mobileTerritoryId],

        (txn, res) => {
          let len = res.rows.length
          if (len > 0) {
            let results = []
            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              results.push(item)
            }
            setTerritoryName(results)
          }
        },
        error => {
          console.log('error while GETTING', error.message)
        },
      )
    })
  }
  const getCompanyDropdown = () => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * from company_info',
        [],
        (tx, res) => {
          let len = res.rows.length
          if (len > 0) {
            let results = []
            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              results.push({
                ...item,
                id: item.companyId || item?.mobileCompanyId,
                item: item.companyName,
                companyId: item.companyId,
              })
              setCompanyData(results)
            }
          }
        },
        error => {
          console.log('error while GETTING', error.message)
        },
      )
    })
  }

  useEffect(() => {
    getStoreName()
    getCompanyDropdown()
  }, [])

  useEffect(() => {
    getTerritoryName()
  }, [storeName])

  return (
    <CardWrapper>
      {console.log("renturn", storeName, territoryName)}
      <View style={{ alignItems: 'center' }}>
        <Formik
          initialValues={{
            category: editInventory?.category || '',
            subCategory: editInventory?.subCategory || '',
            productName: editInventory?.productName || '',
            sizing: editInventory?.sizing || '',
            qty: editInventory?.qty || '',
            mrp: editInventory?.mrp || '',
            territory: territoryName[0]?.territoryName || "",
            store: storeName[0]?.storeName
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
              <ScrollView nestedScrollEnabled={true}>
              {hasCompany && !store.getState().auth.companyId && (
                <View style={multiSelectOptions}>
                  <MultiSelect
                    onSelect={getCompany}
                    single
                    label={'Select Company'}
                    K_OPTIONS={companyData}
                    selects={companyEdit}
                  />
                 
                </View>
              )}

              {!store.getState().auth.storeId && (
                  <>
                    {hasTerritory && (
                      <View style={multiSelectOptions}>
                        <MultiSelect
                          onSelect={getTerritory}
                          single
                          label={'Select Territory'}
                          K_OPTIONS={territoryData}
                          selects={{
                            id: territoryName[0]?.territoryId,
                            item: territoryName[0]?.territoryName
                          }}
                        />
                        {errors.territory && touched.territory && (
                          <Text style={[errorMessage, { marginBottom: -11 }]}>
                            {errors.territory}
                          </Text>
                        )}
                      </View>
                    )}
                    {!hasTerritory && (
                      <View style={floatingLabelContainer}>
                        <TextInput
                          style={floatingLabelContainerInternal}
                          onChangeText={handleChange('territory')}
                          value={values.territory}
                          placeholderTextColor={placeholderTextColor}
                          placeholder="Territory"
                        />
                        {errors.territory && touched.territory && (
                          <Text style={errorMessage}>{errors.territory}</Text>
                        )}
                      </View>
                    )}
                    {hasStore && (
                      <View style={multiSelectOptions}>
                        <MultiSelect
                          onSelect={getStore}
                          single
                          label={'Select Store'}
                          K_OPTIONS={storeData}
                          selects={{
                            id: storeName[0]?.storeId || storeName[0]?.mobileStoreId,
                            item: storeName[0]?.storeName
                          }}
                        />
                        {errors.store && touched.store && (
                          <Text style={[errorMessage, { marginBottom: -11 }]}>
                            {errors.store}
                          </Text>
                        )}
                      </View>
                    )}
                    {!hasStore && (
                      <View style={floatingLabelContainer}>
                        <TextInput
                          style={floatingLabelContainerInternal}
                          onChangeText={handleChange('store')}
                          value={values.store}
                          placeholder="Store"
                          placeholderTextColor={placeholderTextColor}
                        />
                        {errors.store && touched.store && (
                          <Text style={errorMessage}>{errors.store}</Text>
                        )}
                      </View>
                    )}
                  </>
                )}

                <View style={multiSelectOptions}>
                  <MultiSelect
                    single
                    label={'Select Category'}
                    K_OPTIONS={allData}
                    onSelect={getSubProduct}
                    selects={{
                      id: 0,
                      item: editInventory?.category,
                    }}
                  />

                  {errors.category && touched.category && (
                    <Text style={styles.error}>{errors.category}</Text>
                  )}
                </View>

                {showSubCategory ? (
                  <View style={multiSelectOptions}>
                    <MultiSelect
                      single
                      K_OPTIONS={dataSubCategory}
                      onSelect={getProduct}
                      label={'Select Sub Category'}
                      selects={{
                        id: 1,
                        item: editInventory?.subCategory,
                      }}
                    />
                    {errors.subCategory && touched.subCategory && (
                      <Text style={styles.error}>{errors.subCategory}</Text>
                    )}
                  </View>
                ) : null}

                {showProduct ? (
                  <View style={multiSelectOptions}>
                    <MultiSelect
                      single
                      K_OPTIONS={productNames}
                      onSelect={getSize}
                      label={'Select Product'}
                      selects={{
                        id: 2,
                        item: editInventory?.productName,
                      }}
                    />
                    {errors.productName && touched.productName && (
                      <Text style={styles.error}>{errors.productName}</Text>
                    )}
                  </View>
                ) : null}

                {showSize ? (
                  <View style={multiSelectOptions}>
                    <MultiSelect
                      single
                      K_OPTIONS={productSize}
                      onSelect={selectSize}
                      label={'Select Size'}
                      selects={{
                        id: 3,
                        item: editInventory?.sizing,
                      }}
                    />

                    {errors.sizing && touched.sizing && (
                      <Text style={styles.error}>{errors.sizing}</Text>
                    )}
                  </View>
                ) : null}

                <View style={floatingLabelContainer}>
                  <TextInput
                    style={floatingLabelContainerInternal}
                    onChangeText={handleChange('qty')}
                    placeholderTextColor={placeholderTextColor}
                    value={values.qty}
                    maxLength={10}
                    placeholder="Quantity"
                    keyboardType="numeric"
                  />
                  {errors.qty && touched.qty && (
                    <Text style={styles.error}>{errors.qty}</Text>
                  )}
                </View>

                <View style={floatingLabelContainer}>
                  <TextInput
                    style={floatingLabelContainerInternal}
                    onChangeText={handleChange('mrp')}
                    placeholderTextColor={placeholderTextColor}
                    value={values.mrp}
                    maxLength={10}
                    placeholder="Price(per unit)"
                    keyboardType="numeric"
                  />
                  {errors.mrp && touched.mrp && (
                    <Text style={styles.error}>{errors.mrp}</Text>
                  )}
                </View>
               
                <SaveAndCancelButton
                  handleSubmit={handleSubmit}
                  saveTitle={editInventory ? 'Update' : 'Add'}
                  navigation={navigation}
                  screenName="Inventory List"
                />
              </ScrollView>
            </View>
          )}
        </Formik>
      </View>
    </CardWrapper>
  )
}

const styles = StyleSheet.create({
  card: {
    margin: 4,
    color: { textColor },
    paddingHorizontal: 10,
    backgroundColor: 'white',
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    borderRadius: 4,
  },
  pickerInput: {
    height: 50,
    width: 280,
    marginTop: 15,
    backgroundColor: '#f1f5f7',
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#43628e',
    color: { textColor },
    marginLeft: 5,
    marginRight: 5,
  },
  datePickerStyle: {
    height: 50,
    width: 310,
    backgroundColor: '#f1f5f7',
    borderColor: 'grey',
    borderWidth: 0.5,
    marginTop: 25,
    borderRadius: 10,
    marginLeft: 4,
    marginBottom: 5,
  },
  errorDate: {
    color: 'red',
    top: 20,
  },

  input: {
    height: 50,
    width: 280,
    marginTop: 25,
    backgroundColor: '#f1f5f7',
    borderRadius: 2,
    fontSize: 16,
    color: '#000000',
    paddingTop: 0.5,
    fontWeight: 200,
    marginHorizontal: 25,
  },
  error: {
    color: 'red',
  },

  main: {
    alignItems: 'center',
    marginTop: 30,
    marginLeft: '0.4%',
  },
  container: {
    backgroundColor: 'white',
    padding: 16,
    color: { textColor },
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color: { textColor },
  },
  selectedTextStyle: {
    fontSize: 16,
    color: { textColor },
  },

  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: { textColor },
  },

  text: {
    color: { textColor },
  },
  card: {
    marginTop: 20,
    color: { textColor },
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: 'white',
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    borderRadius: 6,
    display: 'flex',
    flexDirection: 'row',
  },
  mobileText: {
    color: { textColor },
    fontSize: 16,
    marginTop: 10,
  },
  mobileNum: {
    color: '#263238',
    fontSize: 16,
    marginTop: 10,
    paddingHorizontal: 100,
  },
  txt: {
    color: { textColor },
    marginLeft: 14,
    fontSize: 16,
  },
  text: {
    color: { textColor },
    marginLeft: 28,
    top: 10,
    fontSize: 16,
  },
  submit: {
    width: 100,
    marginTop: 35,
    marginLeft: 60,
  },
  buttonCancel: {
    width: 100,
    alignItems: 'center',
    alignSelf: 'center',
    display: 'flex',
    backgroundColor: '#f1f5f7',
    borderRadius: 4,
    height: 40,
    marginRight: 12,
    marginTop: -4,
    marginBottom: 20,
  },
  textCancel: {
    color: { textColor },
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  cancel: {
    width: 100,
    marginTop: -60,
    marginLeft: 185,
  },
  buttonSave: {
    alignItems: 'center',
    backgroundColor: '#00b8ce',
    borderRadius: 4,
    height: 40,
    marginBottom: 20,
  },
  textSave: {
    color: '#fff',
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  dropdown: {
    height: 50,
    borderColor: 'gray',
    backgroundColor: '#f1f5f7',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    color: { textColor },
    // width: 300
  },
})

export default AddNewInventory
