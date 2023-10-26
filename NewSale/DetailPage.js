import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ToastAndroid,
  BackHandler,
  Alert,
} from 'react-native'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TableProduct from './TableProduct'
import { openDatabase } from 'react-native-sqlite-storage'
import { useEffect } from 'react'
import { useState } from 'react'
import { cartEmpty } from '../../Store/ProductContainer'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { useLayoutEffect } from 'react'

const db = openDatabase({
  name: 'customer_database',
})
const screenWidth = Dimensions.get('window').width

const DetailPage = ({ navigation, route }) => {
  const [currentdate, setcurrentDate] = useState(
    new Date().toISOString().slice(0, 10),
  )
  const [isShow, setisShow] = useState(true)
  const [isEnable, setisEnable] = useState(true)
  const totalPrice = useSelector(state => state.productDetails.productALlPrice)

  const {
    payment,
    fullPayment,
    paymentMethod,
    payLater,
    customerName,
    customerMobile,
    customerId,
    invoiceNumber,
    notes
  } = route.params

  const dispatch = useDispatch()


  function handleBackButtonClick() {
    Alert.alert('', 'Are you sure you want to leave the page?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {
        text: 'YES',
        onPress: () => 
        {
         dispatch(cartEmpty({}))
          navigation.navigate('New Sale')},
      },
    ])
    return true
  }
 
  useEffect(() => {
 
       BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick)
      return ()=>{
    
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick)
      }
  }, [isEnable])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
    })
  }, [])
  useEffect(() => {
    setTimeout(() => {
      setisShow(false)
    }, 3000);
  }, [])
  return (
    <View>
      {isShow ? (
        <View style={{ backgroundColor: '#bbebba', height: '5%' }}>
          <Text
            style={{
              textAlign: 'center',
              fontWeight: '400',
              color: 'black',
              marginTop: 5,
            }}
          >
            {'\u2713'}Bill Generated Successfully
          </Text>
        </View>
      ) : null}
      <ScrollView>
        <View style={styles.card}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text style={styles.text}>Invoice</Text>
            <Text style={[styles.text, { marginLeft: 10, fontWeight: 'bold' }]}>
              {invoiceNumber}
            </Text>
          </View>
          <TouchableOpacity style={[styles.button,{flexDirection:'row',justifyContent:'space-between'}]}>
          <FontAwesome5 name="print" size={20} color="#ffffff" />
            <Text style={{ color: '#fff' ,right:15}}>Print</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.card}>
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: 'black' }}>
              Date :
            </Text>
            <Text style={styles.texttDate}>{currentdate}</Text>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <View>
              <Text style={styles.textto}>From :</Text>
              <Text style={styles.textt}>Bridgestone</Text>
              <Text style={styles.textt}>South Africa</Text>
              <Text style={styles.textt}>contact@bridgestone.co.za</Text>
              <Text style={styles.textt}>8483899289</Text>
            </View>
            <View style={{ display: 'flex', flexDirection: 'column' }}>
              <Text style={styles.textFrom}>To :</Text>
              <Text style={styles.textt}>{customerName}</Text>
              <Text style={styles.textt}>{customerMobile}</Text>
            </View>
          </View>
        </View>
        <View style={[styles.card, { marginBottom: isShow ? 40 : null }]}>
          <Text style={{ marginLeft: 10, marginTop: 5, fontSize: 20 }}>
            Sales
          </Text>
          <View style={styles.table}>
            <TableProduct />
          </View>
          <View style={styles.billing}>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Text style={styles.bill}>Sub total</Text>
              <Text style={styles.billText}>
                {'\u20B9'}
                {totalPrice.subtotalPrice}
              </Text>
            </View>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Text style={styles.bill}>GST(18%)</Text>
              <Text style={styles.billText}>
                {'\u20B9'}
                {totalPrice.GSTPrice}
              </Text>
            </View>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Text style={styles.bill}>Total</Text>
              <Text style={styles.billText}>
                {'\u20B9'}
                {totalPrice.totalPrice}
              </Text>
            </View>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Text style={styles.bill}>Payment Method :</Text>
              <Text style={styles.billText}>{paymentMethod}</Text>
            </View>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Text style={styles.bill}>Payment Type :</Text>
              <Text style={styles.billText}>{payment}</Text>
            </View>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Text style={styles.bill}>Full payment Type :</Text>
              <Text style={styles.billText}>{fullPayment}</Text>
            </View>
            {fullPayment == 'Pay Later' ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text
                  style={{
                    marginTop: 5,
                    color: 'black',
                    fontSize: 16,
                    textAlign: 'left',
                  }}
                >
                  Pay Later Type :
                </Text>
                <Text style={[styles.billText, { width: 200, marginLeft: 55 }]}>
                  {payLater}
                </Text>
              </View>
            ) : null}
            {notes?<View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Text style={styles.bill}>Notes:</Text>
              <Text style={styles.billText}>
              {notes}
              </Text>
            </View>:null}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default DetailPage

const styles = StyleSheet.create({
  card: {
    margin: 10,
    color: '#000',
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: 'white',
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    borderRadius: 4,
  },
  text: {
    color: 'black',
    fontSize: 16,
    marginTop: 20,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#00b8ce',
    padding: 10,
    borderRadius: 4,
    width: 100,
    marginLeft: 245,
    marginTop: -30,
  },
  textto: {
    color: 'black',
    fontSize: 16,
    marginTop: 15,
    fontWeight: 'bold',
  },
  textt: {
    color: 'black',
    fontSize: 16,
    marginTop: 5,
  },
  texttDate: {
    color: 'black',
    fontSize: 16,
    marginLeft: 15,
  },
  textFrom: {
    color: 'black',
    fontSize: 16,
    marginTop: 15,
    fontWeight: 'bold',
  },
  textDate: {
    color: 'black',
    fontSize: 16,
    marginTop: 12,
    fontWeight: 'bold',
  },
  table: {
    backgroundColor: '#f1f5f7',
    fontSize: 16,
    marginTop: 15,
    color: 'black',
  },
  bill: {
    marginTop: 5,
    color: 'black',
    fontSize: 16,
  },
  billText: {
    marginTop: 5,
    color: '#263238',
    fontSize: 16,
    fontWeight: 'bold',
  },
  billing: {
    marginTop: 30,
  },
  buttons: {
    width: 300,
    height: 40,
    marginTop: 5,
    backgroundColor: '#00b8ce',
    padding: 10,
    borderRadius: 4,
    width: 100,
    alignSelf: 'center',
    marginBottom: 40,
  },
})
