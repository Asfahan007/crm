import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Dimensions,
  } from 'react-native'
  import React from 'react'
  import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
  import { useState } from 'react'
  import { useDispatch, useSelector } from 'react-redux'
  import { getCustomerData } from '../../Store/CustomerStore'
  import { useEffect } from 'react'
import { getProduct } from '../../Store/ProductContainer'
  
const screenWidth = Dimensions.get('window').width

  export default function CustomProductList({data}) {
  const dispatch = useDispatch()
  const listOfProducts = useSelector(state => state.productDetails.productList)
    const [search, setsearch] = useState('')
    const [show, setshow] = useState(false)
    const [customer, setcustomer] = useState([])
    const filterList = data => {
      return data.filter(
        listItem =>
          listItem.productName.toLowerCase().includes(search.toLowerCase()) ||
          listItem.sizing.toLowerCase().includes(search.toLowerCase()),
      )
    }
  
    // console.log('listitem', productList)
    const selectCustomer = listItem => {
    //   setcustomer(listItem.customerName)
    //   dispatch(getCustomerData({ customerData: listItem }))
    dispatch(getProduct({ productList: [...listOfProducts,listItem] }))
      setshow(false)
    }
    return (
      <View style={styles.containers}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            // backgroundColor:'blue'
          }}
        >
          <View style={[styles.searchBar,{}]}>
            <TextInput
              onChangeText={search => setsearch(search)}
              placeholder="Select Product"
              onFocus={() => setshow(true)}
              onBlur={() => setshow(false)}
              value={customer}
              />
          </View>
              {/* {customer.length === 0 ? ( */}
                <FontAwesome5
                  name="search"
                  size={25}
                  color="grey"
                  style={{position: 'absolute',marginLeft:300 }}
                />
              {/* ) : null} */}
        </View>
        {show ? (
          <ScrollView
            keyboardShouldPersistTaps="handled"
            style={{
              height: screenWidth-100,
              borderWidth: 1,
              marginTop: 5,
              borderRadius: 4,
              paddingRight: 10,
            }}
            nestedScrollEnabled={true}
          >
            {filterList(data).map((listItem, index) => {
            //   console.log("hii",listItem.)
              return(
              <TouchableOpacity onPress={() => selectCustomer(listItem)}>
                <Item key={index} customerName={listItem.productName} customerMobile={listItem.sizing} />
              </TouchableOpacity>)
            })}
          </ScrollView>
        ) : null}
      </View>
    )
  }
  
  const Item = props => {
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          marginBottom: 15,
          justifyContent: 'space-between',
          marginTop: 10,
        }}
      >
        <Text style={[styles.text, { marginLeft: 10 }]}>{props.customerName} ({10})</Text>
        <Text style={[styles.text, { marginRight: 10 }]}>{props.customerMobile}</Text>
      </View>
    )
  }
  
  const styles = StyleSheet.create({
    // container: {
    //   backgroundColor: 'white',
    //   alignItems: 'center',
    //   height: 90,
    //   margin: 10,
    //   width: '70%',
    // },
    text: {
      color: 'black',
      fontSize: 15,
    },
    containers: {
      // backgroundColor: 'green',
      padding:10,
      marginRight:10,
      marginBottom:10,
      marginTop:-20
   
    },
    searchBar: {
      borderColor: 'grey',
      borderWidth: 1,
      borderRadius: 10,
      // fontSize: 24,
      // margin: 2,
      width: screenWidth-30,
      // height: 50,
      // backgroundColor: 'white',
    },
    card: {
      // marginTop: 20,
  
      // color: '#000',
      // // width: '149%',
      marginBottom: 20,
      // paddingHorizontal: 10,
      // paddingBottom: 10,
      padding:15,
      backgroundColor: 'white',
      elevation: 2,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      borderRadius: 6,
      display: 'flex',
      flexDirection: 'row',
      justifyContent:'space-between'
    },
    mobileText: {
      color: 'black',
      fontSize: 16,
      fontWeight:'500'
      // marginTop: 10,
    },
    mobileNum: {
      color: 'black',
      fontSize: 16,
      fontWeight:'500'
    },
  })
  