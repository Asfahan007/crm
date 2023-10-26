import { storageImageUrl } from '../../MD/tools/Helpers'
import { store } from '../../Store'
import { getProduct } from '../../Store/ProductContainer'
import React, { useState } from 'react'
import { useLayoutEffect } from 'react'
import { useEffect } from 'react'
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  LayoutAnimation,
  UIManager,
  ActivityIndicator,
  Dimensions,
} from 'react-native'
import { openDatabase } from 'react-native-sqlite-storage'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { useDispatch } from 'react-redux'
import { writeFile, readFile } from 'react-native-fs'
import { DownloadDirectoryPath } from 'react-native-fs'
import XLSX from 'xlsx'
import NoItem from '../NoItem'
import AddButton from '../../Containers/CustomComponents/AddButton';

import NativePermissionsAndroid from 'react-native/Libraries/PermissionsAndroid/NativePermissionsAndroid'
import { textColor } from '../CustomComponents/Image'
const db = openDatabase({
  name: 'customer_database',
})
const screenWidth = Dimensions.get('window').width

const ProductInventory = ({ navigation }) => {
  const [expandedOrder, setExpandedOrder] = useState(false)
  const [expandedsubcategory, setExpandedsubcategory] = useState(false)
  const [storeCategory, setstorecategory] = useState('')
  const [expandCategory, setexpandCategory] = useState(false)
  const [storeSubcategory, setstoreSubcategory] = useState('')
  const [expandsubCategory, setexpandsubCategory] = useState(false)
  const [storeProduct, setstoreProduct] = useState('')
  const [expandProduct, setexpandproduct] = useState(false)
  const [allData, setAllData] = useState([])
  const [category, setCategory] = useState([])
  const [subCategory, setSubCategory] = useState([])
  const [productName, setProductName] = useState([])
  const [visible, setVisible] = useState(false)
  const [onlineData, setOnlineData] = useState([])
  const [productWithsize, setProductwithsize] = useState([])
  const [productList, setProductList] = useState([])
  const [productData, setProductData] = useState([])
  const [productArr, setProductArr] = useState([])
  const [show, setShow] = useState(false)
  const [fetching, setfetching] = useState(false)
  let loginToken = store.getState().auth.token
  const exportDataToExcel = () => {
    let sample_data_to_export = [
      {
        id: '1',
        na: 'isharia',
      },
    ]
    let wb = XLSX.utils.book_new()
    let ws = XLSX.utils.json_to_sheet(sample_data_to_export)
    XLSX.utils.book_append_sheet(wb, ws, 'Users')
    const wbout = XLSX.write(wb, { type: 'binary', bookType: 'xlsx' })

    writeFile(DownloadDirectoryPath + 'sample.csv', wbout, 'ascii')
      .then(res => {
        alert('exported')
      })
      .catch(e => {
        console.log('error write')
      })
  }

  const dispatch = useDispatch()

  const createTables = () => {
    db.transaction(txn => {
      txn.executeSql(
        'CREATE TABLE IF NOT EXISTS product_info (id INTEGER PRIMARY KEY AUTOINCREMENT,productId VARCHAR(20),productName VARCHAR(30),productDescription VARCHAR(20),brandName VARCHAR(20),category VARCHAR(20),subCategory VARCHAR(20),sizing VARCHAR(20),mrp VARCHAR(20),quantity VARCHAR(20),status VARCHAR(20),sku VARCHAR(200))',
        [],
        () => {
          console.log('TABLE CREATED SUCCESSFULLY')
        },
        error => {
          console.log('error while creating' + error.message)
        },
      )
    })
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Products',
    })
  }, [navigation])

  const getProducts = () => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * from product_info ORDER BY productId ASC',
        [],

        (tx, res) => {
          let len = res.rows.length
          if (len > 0) {
            let results = []

            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              results.push({
                productId: item.productId,
                productName: item.productName,
                productDescription: item.productDescription,
                brandName: item.brandName,
                category: item.category,
                subCategory: item.subCategory,
                sizing: item.sizing,
                mrp: item.mrp,
                quantity: item.quantity,
                status: item.status,
                sku: item.sku,
              })
              console.log(results, 'wwwwwooopp')
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
  console.log('alldata from local', allData)
  const getCategory = () => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT distinct category from product_info',
        [],

        (tx, res) => {
          let len = res.rows.length
          console.log('len', len)
          if (len > 0) {
            let results = []

            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              results.push({
                product: item.category,
              })
            }
            setCategory(results)
          }
        },
        error => {
          console.log('error while GETTING', error.message)
        },
      )
    })
  }

  const getsubCategory = () => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT distinct subCategory,category from product_info',
        [],

        (tx, res) => {
          let len = res.rows.length
          if (len > 0) {
            let results = []

            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              results.push({
                product: item.subCategory,
                category: item.category,
              })
            }
            setSubCategory(results)
          }
        },
        error => {
          console.log('error while GETTING', error.message)
        },
      )
    })
  }

  const getProductName = () => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT distinct productName,subCategory from product_info',
        [],

        (tx, res) => {
          let len = res.rows.length
          if (len > 0) {
            let results = []

            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              results.push({
                productName: item.productName,
                category: item.subCategory,
              })
            }
            setProductName(results)
          }
        },
        error => {
          console.log('error while GETTING', error.message)
        },
      )
    })
  }

  const getProductSize = () => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * from product_info',
        [],

        (tx, res) => {
          let len = res.rows.length
          if (len > 0) {
            let results = []

            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              results.push({
                productId: item.productId,
                productName: item.productName,
                productDescription: item.productDescription,
                brandName: item.brandName,
                category: item.category,
                subCategory: item.subCategory,
                productSize: item.sizing,
                ProductPrice: item.mrp,
                // checked: false,
                quantity: 0,
                status: item.status,
                sku: item.sku,
              })
            }
            setProductwithsize(results)
          }
        },
        error => {
          console.log('error while GETTING', error.message)
        },
      )
    })
  }

  let arr = []

  // const productAPi = () => {
  //   pdtData.forEach(element => {
  //     console.log('forEach', element)
  //     arr.push(element)
  //   })
  //   setProductData(arr)
  // }
  console.log('sizeof', productWithsize)
  const Item = () => {
    return category.map(item => {
      return (
        <View
          style={{
            backgroundColor: 'white',
            elevation: 3,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
          }}
        >
          <TouchableOpacity
            onPress={() => openCategory(item.product)}
            style={styles.dropdown}
          >
            <Text
              style={{ fontSize: 16, color: {textColor}, fontWeight: 'bold' }}
              key={item.name}
            >
              {item.product}
            </Text>
            <Image
              source={require('../../MD/assets/icon/ic_chevron_right.png')}
              style={{
                width: 15,
                height: 15,
                resizeMode: 'contain',
                tintColor: '#aeaeae',
                transform: [{ rotate: expandedOrder ? '90deg' : '0deg' }],
              }}
            />
          </TouchableOpacity>

          {storeCategory == item.product && expandCategory
            ? subCategory
              .filter(e => e.category == item.product)
              .map((items, index) => {
                return (
                  <View
                    style={{
                      overflow: 'hidden',
                      backgroundColor: '#ABABAB',
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => openSubCategory(items.product)}
                      style={styles.dropdown}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                        key={index}
                      >
                        {items.product}
                      </Text>
                      <Image
                        source={require('../../MD/assets/icon/ic_chevron_right.png')}
                        style={{
                          width: 15,
                          height: 15,
                          resizeMode: 'contain',
                          tintColor: '#aeaeae',
                          transform: [
                            {
                              rotate: expandedsubcategory ? '90deg' : '0deg',
                            },
                          ],
                        }}
                      />
                    </TouchableOpacity>
                    {storeSubcategory == items.product && expandsubCategory
                      ? productName
                        .filter(pro => items.product == pro.category)
                        .map((ele, index) => {
                          return (
                            <View style={{ backgroundColor: 'white' }}>
                              <TouchableOpacity
                                onPress={() => openProduct(ele.productName)}
                                style={styles.dropdown}
                              >
                                <Text
                                  style={{
                                    fontSize: 15,
                                    color: {textColor},
                                    fontWeight: 'bold',
                                  }}
                                  key={index}
                                >
                                  {ele.productName}
                                </Text>
                                <Image
                                  source={require('../../MD/assets/icon/ic_chevron_right.png')}
                                  style={{
                                    width: 15,
                                    height: 15,
                                    resizeMode: 'contain',
                                    tintColor: '#aeaeae',
                                    transform: [
                                      {
                                        rotate: expandedsubcategory
                                          ? '90deg'
                                          : '0deg',
                                      },
                                    ],
                                  }}
                                />
                              </TouchableOpacity>
                              {storeSubcategory == items.product &&
                                expandsubCategory
                                ? productWithsize
                                  .filter(
                                    pro =>
                                      ele.productName == pro.productName,
                                  )
                                  .map((ele, index) => {
                                    return (
                                      <View
                                        style={{
                                          backgroundColor: 'white',
                                        }}
                                      >
                                        <TouchableOpacity
                                          // onPress={() =>
                                          //   // onCheck(ele, index)
                                          // }
                                          style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent:
                                              'space-between',
                                          }}
                                        >
                                          <Text
                                            style={{
                                              fontSize: 15,
                                              color: {textColor},
                                              lineHeight: 20,
                                              padding: 15,
                                            }}
                                            key={index}
                                          >
                                            {ele.productSize}
                                          </Text>

                                          <View
                                            style={{
                                              // top: 8,
                                              flexDirection: 'row',
                                              marginRight: 10,
                                            }}
                                          >
                                            <Text
                                              style={{
                                                fontSize: 15,
                                                color:{textColor},
                                                lineHeight: 20,
                                                padding: 15,
                                              }}
                                              key={index}
                                            >
                                              {ele.status}
                                            </Text>
                                            <View
                                              style={{
                                                height: 25,
                                                width: 25,
                                                borderColor: '#d9d9d9',
                                                // backgroundColor:
                                                //   ele.checked
                                                //     ? '#00b8ce'
                                                //     : 'white',
                                                // borderRadius: 5,
                                                // borderWidth: 1,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                              }}
                                            >
                                              {/* {ele.status} */}
                                              {/* {ele.checked && (
                                                      <Image
                                                        style={{
                                                          width: 15,
                                                          height: 15,
                                                          tintColor: '#FFF',
                                                        }}
                                                        source={require('@/MD/assets/icon/ic_check.png')}
                                                      />
                                                    )} */}
                                            </View>
                                          </View>
                                        </TouchableOpacity>
                                      </View>
                                    )
                                  })
                                : null}
                            </View>
                          )
                        })
                      : null}
                  </View>
                )
              })
            : null}
        </View>
      )
    })
  }
  // const onCheck = (x, y) => {
  //   console.log('new arr', x)
  //   let arr = [...productWithsize]
  //   for (let i = 0; i < arr.length; i++) {
  //     if (
  //       arr[i].productSize == x.productSize &&
  //       arr[i].productName == x.productName
  //     ) {
  //       arr[i].checked = !arr[i].checked
  //       arr[i].quantity = 1
  //     }
  //   }
  //   arr.filter(element => element.productSize == x.productSize)
  //   setProductwithsize([...arr])
  //   const result = arr.filter(arr => arr.checked === true)
  //   setProductList([...result])
  // }
  const dispatchingProducts = () => {
    console.log('disaptch,', productList)
    dispatch(getProduct({ productList: productList }))
    navigation.goBack()
  }
  //for excel
  const exportXls = async () => {
    try {
      let isPermitedExternalStorage = await NativePermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      )
      if (!isPermitedExternalStorage) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage permission needed',
            buttonNeutral: 'Ask me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        )
        if (granted === PermissionsAndroid.REESULTS.GRANTED) {
          exportDataToExcel()
          console.log('permission granted')
        } else {
          console.log('denied')
        }
      } else {
        exportDataToExcel()
      }
    } catch (e) {
      console.log('rror')
      return
    }
  }

  const openCategory = element => {
    UIManager.setLayoutAnimationEnabledExperimental(true)
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setExpandedOrder(!expandedOrder)
    if (element == ' ') setexpandCategory(expandCategory)
    else if (element) {
      setstorecategory(element)
      setexpandCategory(!expandCategory)
    } else setexpandCategory(expandCategory)
  }

  const openSubCategory = element => {
    UIManager.setLayoutAnimationEnabledExperimental(true)
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setExpandedsubcategory(!expandedsubcategory)
    if (element == ' ') setexpandsubCategory(expandsubCategory)
    else if (element) {
      setstoreSubcategory(element)
      setexpandsubCategory(!expandsubCategory)
    } else setexpandsubCategory(!expandsubCategory)
  }

  const openProduct = element => {
    UIManager.setLayoutAnimationEnabledExperimental(true)
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    // setExpandedsubcategory(!expandedsubcategory)
    if (element == ' ') setexpandproduct(expandProduct)
    else if (element) {
      setstoreProduct(element)
      setexpandproduct(!expandProduct)
    } else setexpandproduct(!expandProduct)
  }

  const getProductApi = () => {
    var myHeaders = new Headers()
    myHeaders.append('Authorization', 'Bearer' + loginToken)
    myHeaders.append('Content-Type', 'application/json')

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      body: '',
      redirect: 'follow',
    }

    fetch(
      'https://apps.trisysit.com/posbackendapi/api/product/list',
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        let resData = result.data
        console.log('result of product list', resData)
        setProductArr(resData)
      })
      .catch(error => console.log('fetcherror', error))
  }

  const insertvalue = () => {
    productArr?.forEach(i => {
      let flag = 0
      allData
        ?.filter(e => e.productId == i.productId)
        .forEach(j => {
          flag = 1
          // console.log('update', j)
          if (j.productId == i.productId) {
            flag = 1
            db.transaction(tx => {
              tx.executeSql(
                'UPDATE product_info SET productName=?,productDescription=?,brandName=?,category=?,subCategory=?,sizing=?,mrp=?,quantity=?,status=?,sku=? WHERE productId=?',
                [
                  i.productName,
                  i.productDescription,
                  i.brandName,
                  i.category,
                  i.subCategory,
                  i.sizing,
                  i.mrp,
                  i.quantity,
                  i.productId,
                  i.status,
                  i.sku,
                ],
                (tx, results) => {
                  if (results.rowsAffected > 0) {
                    console.log('successfully updated product')
                  } else {
                    error('error', err)
                  }
                },
              )
            })
          }
        })
      if (flag == 0) {
        console.log('insert')
        // console.log( "check",productArr.filter(e=>allData.filter(x=>e.productId==x.productId)))
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
              console.log('successfully inserted product', res)
            },
            error => {
              console.log('error while INSERTING Product' + error.message)
            },
          )
        })
      }
      setfetching(true)
    })
  }
  // console.log('productArr in listpage', productArr)

  useEffect(() => {
    // createTables()
    // addProducts();
    getProductApi()
    getProducts()
    getsubCategory()
    getCategory()
    getProductName()
    getProductSize()
    console.log('allllllllll', allData)
  }, [fetching]
  )

  // useEffect(() => {
  //   insertvalue()
  //   console.log('allData inside combine', productArr)
  // }, [show])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          {/* <TouchableOpacity onPress={() => setShow(!show)}>
            <FontAwesome5
              name="undo"
              size={20}
              style={{ right: 20 }}
              color="#ffffff"
            />
          </TouchableOpacity> */}
          {/* <TouchableOpacity onPress={() => exportXls()}>
         <FontAwesome5
              name="print"
              size={20}
              style={{ right: 10}}
              color="#ffffff"
            /></TouchableOpacity>  */}
          {/* <AddButton navigation={navigation} screenName={"Add Product"} /> */}

        </View>
      ),
    })
  }, [navigation, show])

  return (
    <>
      {/* <ScrollView>
      <View style={{ flex: 1 }}>
        {category? Item():<ActivityIndicator color="#0000ff"/>}
      </View>
    </ScrollView> */}
      {/* <Button onPress={dispatching}>Ok</Button> */}
      {category.length != 0 && subCategory.length != 0 ? (
        <>
          <ScrollView>{Item()}</ScrollView>
          {/* <MaterialButton
          title="Add Item"
          style={styles.materialButton}
          buttonPress={dispatchingProducts}
        /> */}
        </>
      ) : (
        <View style={{ flex: 1, backgroundColor: '#bdc8c7' }}>
          <View style={{ flex: 1, justifyContent:'center', alignItems:'center' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16}}>
              Syncing
            </Text>
            {/* <Text style={{ fontWeight: 'bold', fontSize: 16, marginTop: 79 }}>
              Click on sync
            </Text> */}

              <ActivityIndicator
                color="#00b8ce"
                size={'large'}
                style={{ overflow: 'visible' }}
              />

            <Image
              style={{
                height: 340,
                position: 'absolute',
                bottom: -20,
                left: 0,
                right: 0,
              }}
              source={{
                uri: storageImageUrl('no_item', 'no_item_5_img_1.png'),
              }}
            />
          </View>
        </View>
      )}
      <AddButton navigation={navigation} screenName={"Add Product"} />
    </>
  )
}
export default ProductInventory
const styles = StyleSheet.create({
  dropdown: {
    width: '100%',
    paddingVertical: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
    borderColor: '#e4e4e4',
    borderWidth: 0.5,
  },
  materialButton: {
    width: screenWidth - 20,
    alignSelf: 'center',
    height: 50,
    marginBottom: 10,
    marginTop: 10,
    backgroundColor: '#00b8ce',
  },
})
