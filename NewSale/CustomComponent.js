import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native'
import React from 'react'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCustomerData } from '../../Store/CustomerStore'
import { useEffect } from 'react'
import CustomProductList from './CustomProductList'

const screenWidth = Dimensions.get('window').width

export default function CustomComponent({data,productdata,onClick}) {
  const dispatch = useDispatch()
  const customerData = useSelector(state => state.customerDetails.customerData)
  const [search, setsearch] = useState('')
  const [show, setshow] = useState(false)
  const [isshow, setisshow] = useState(false)
  const [customer, setcustomer] = useState([])
  const[isopen,setisopen]=useState(false)
  const filterList = data => {
    return data.filter(
      listItem =>
        listItem.customerName.toLowerCase().includes(search.toLowerCase()) ||
        listItem.customerMobile.toLowerCase().includes(search.toLowerCase()),
    )
  }

  // console.log('listitem', filterList)
  const selectCustomer = listItem => {
    setcustomer(listItem.customerName)
    onClick(listItem);
    dispatch(getCustomerData({ customerData: listItem }))
    setshow(false)
    setisshow(false)
  }
  return (
    <View style={styles.containers}>
      {customerData && isshow===false? (
        <View style={styles.card}>
          <Text style={styles.mobileText}>{customerData.customerName}</Text>
          <Text style={styles.mobileNum}>{customerData.customerMobile}</Text>
         <TouchableOpacity onPress={()=>setisshow(true)}><Text style={[styles.mobileNum,{color:'blue'}]}>Change</Text></TouchableOpacity> 
        </View>
      ) : null}
    {isshow?  <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          // backgroundColor:'blue'
        }}
      >
        <View style={[styles.searchBar]}>
          <TextInput
            onChangeText={search => setsearch(...search,search)}
            placeholder="Select Customer"
            onFocus={() => setshow(true)}
            onBlur={() => setshow(false)}
            value={show?null:customer}
            
            />
        </View>
              <FontAwesome5
                name="search"
                size={25}
                color="grey"
                style={{position: 'absolute',marginLeft:320 }}
              />
      </View>:null}
      {show ? (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={{
            height: screenWidth-100,
            borderWidth: 1,
            marginTop: 5,
            borderRadius: 4,
            paddingRight: 10,
            marginLeft:10
          }}
          nestedScrollEnabled={true}
        >
          {filterList(data).map((listItem, index) => {
            // console.log("hii",listItem.customerName)
            return(
            <TouchableOpacity onPress={() => selectCustomer(listItem)}>
              <Item key={index} customerName={listItem.customerName} customerMobile={listItem.customerMobile} />
            </TouchableOpacity>)
          })}
        </ScrollView>
      ) : null}
      {/* <TouchableOpacity onPress={()=>setisopen(true)} style={{display:'flex',flexDirection:'row',justifyContent:'space-around',marginBottom:20}}>
        <Text>Add Products</Text>
        <Image
              source={require('@/MD/assets/icon/ic_chevron_right.png')}
              style={{
                width: 15,
                height: 15,
                resizeMode: 'contain',
                tintColor: '#aeaeae',
                // transform: [{ rotate: expandedOrder ? '90deg' : '0deg' }],
              }}
            />
        </TouchableOpacity>
      {isopen?<CustomProductList data={productdata}/>:null} */}
      {isshow?null:<CustomProductList data={productdata}/>}
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
      <Text style={[styles.text, { marginLeft: 10 }]}>{props.customerName}</Text>
      <Text style={[styles.text, { marginRight: 10 }]}>{props.customerMobile}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    alignItems: 'center',
    height: 90,
    margin: 10,
    width: '70%',
  },
  text: {
    color: 'black',
    fontSize: 18,
  },
  containers: {
    // backgroundColor: 'green',
    // padding:10,
    // marginRight:10
    // paddingRight:-10
    // alignItems: 'center',
    // height: '100%',
  },
  searchBar: {
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 10,
    width: screenWidth-30,
    marginLeft:15,
    // marginRight:-,
    marginTop:10,
    marginBottom:15
  },
  card: {
    marginBottom: 20,
    marginVertical:10,
    // marginHorizontal:10,
    marginRight:20,
    marginLeft:10,
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
