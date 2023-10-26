import React, { useState } from 'react'
import { useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Dropdown, MultiSelect } from 'react-native-element-dropdown'
import { openDatabase } from 'react-native-sqlite-storage'
import { useIsFocused } from '@react-navigation/native'
import ProductAddField from './ProductAddField'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { selectProduct } from '../../Store/ProductContainer'
import { store } from '../../Store'
const db = openDatabase({
  name: 'customer_database',
})

const ProductDropdown = ({ navigation, route }) => {
  const dispatch = useDispatch()
  const [value, setValue] = useState(null)
  const [product, setProduct] = useState(null)
  const [productArr, setProductArr] = useState([])
  const [sizing, setSizing] = useState(null)
  const [mrp, setMrp] = useState(null)

  const [isFocus, setIsFocus] = useState(false)
  const isFocussed = useIsFocused()
  
  const [data, setData] = useState([])

  const listOfProducts = useSelector(state => state.productDetails.productList)

  const selectPro = label => {
    setData(label)
    setProduct(label.productName)
  }

  return (
    <>
      <View style={styles.container}>
         {/* <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: '#00b8ce' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={productArr}
          search
          maxHeight={300}
          // itemContainerStyle={styles.item}
          itemTextStyle={styles.text}
          labelField="productName"
          valueField="value"
          placeholder={!isFocus ? 'Select Product' : 'Select Product'}
          searchPlaceholder="Search..."
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(label)=>selectPro(label)}
          
        />  */}
         
        <View
        style={{ width: '30%',
        marginLeft:'35%',
        // marginTop: 15,
        }}>
        <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Product List',{source:productArr})}>
          <Text style={{ color: '#fff' }}>Add</Text>
          <Text style={{ color: '#fff' }}>Product</Text>
        </TouchableOpacity>
        </View>
      </View>
      {/* {(productList=="undefined")? null:(
          <ProductAddField source={productList} />
      ) } */}
      { 
        listOfProducts=="undefined"?null:
        <ProductAddField source={listOfProducts}/>
      }
    </>
  )
}

export default ProductDropdown

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
    color: '#000',
    display: 'flex',
    flexDirection: 'row',
    // justifyContent:'space-between'
  },
  dropdown: {
    height: 50,
    width: "80%",
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    color: '#000',
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
    color: '#000',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#000',
  },

  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: '#000',
  },

  text: {
    color: '#000',
  },
  button: {
    width: 100,
    alignItems: 'center',
    alignSelf: 'center',
    display: 'flex',
    backgroundColor: '#00b8ce',
    paddingVertical: 5,
    borderRadius: 4,
    height: 49,
    marginRight: 10,
  },
})
