import React, { useContext, useRef, useState } from 'react'
import {
  Dimensions,
  ScrollView,
  Image,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ToastAndroid,
} from 'react-native'
import { PageContext } from '../../Containers/MDContainer'
import FloatingButton from '../../MD/components/FloatingButton'
import { useDispatch } from 'react-redux'
import { getProduct } from '../../Store/ProductContainer'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

const screenWidth = Dimensions.get('window').width

function ProductAddField({ source }) {
  const mapss = new Map(Object.entries(JSON.parse(JSON.stringify(source))))
console.log('source',source)
  const dispatch = useDispatch()

  const incrementItems = ele => {
    // console.log("incremt",ele);
    let result = [...source]
    const newarr = result.map(e => {
      if (e.sizing == ele.sizing) {
        return { ...e, quantity: e.quantity + 1 }
        // console.log("incre",e);
      }
      return e
    })
    dispatch(getProduct({ productList: newarr }))
  }

  const decrementItems = ele => {
    let result = [...source]
    const newarr = result.map(e => {
      if (e.sizing == ele.sizing) {
        return { ...e, quantity: e.quantity - 1 }
      }
      return e
    })
    dispatch(getProduct({ productList: newarr.filter(e=>e.quantity!=0) }))
  }

  const removeItems = ele => {
    ToastAndroid.show('Item deleted ', ToastAndroid.SHORT)
    let result = [...source]
    let res = result.filter(element => element.sizing != ele.sizing)
    dispatch(getProduct({ productList: res }))
  }

  const results = []
  {
    mapss.forEach(ele => {
      results.push(
        <View>
          {/* <View style={styles.main}></View> */}
          <View style={styles.body}>
            <View style={{ flex: 1, padding: 15 }}>
              <View style={{flexDirection:'row',justifyContent:'space-between'}}>
              <Text style={{ fontSize: 14, color: '#263238' }}>
                {ele.productName}
              </Text>
              <Text style={{ fontSize: 14, color: '#616161' }}>
                {ele.sizing}
              </Text>
              </View>
              <View style={styles.counter}>
                <FloatingButton
                  size={30}
                  style={styles.floatingButton}
                  image={require('../../MD/assets/icon/ic_minus.png')}
                  imageStyle={{ tintColor: 'white', width: 20, height: 20 }}
                  onPress={() => decrementItems(ele)}
                />
                <Text style={styles.item}>{ele.quantity}</Text>
                <FloatingButton
                  size={30}
                  style={styles.floatingButton}
                  image={require('../../MD/assets/icon/ic_plus.png')}
                  imageStyle={{ tintColor: 'white', width: 20, height: 20 }}
                  onPress={() => incrementItems(ele)}
                />

                <FontAwesome5
                  name="trash"
                  size={25}
                  color="grey"
                  onPress={() => removeItems(ele)}
                  style={{ left: 15 }}
                />
              </View>
              <Text style={styles.price}>
              {'\u20B9'} {ele.mrp * ele.quantity}
              </Text>
            </View>
          </View>
        </View>,
      )
    })
  }
  return <View>{results}</View>
}

export default ProductAddField
const styles = StyleSheet.create({
  main: {
    backgroundColor: 'white',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    borderRadius: 3,
    elevation: 3,
  },
  body: {
    // width: screenWidth,
    // flexDirection: 'row',
    // backgroundColor: 'white',
    // borderTopWidth: 0.5,
    // borderTopColor: '#e0e0e0',
   marginLeft:15,
   marginRight:-60,
   marginVertical:5,
   borderWidth:2,
   borderColor:'transparent',
    padding:2,
    backgroundColor: 'white',
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 3,
    borderRadius: 6,
    // display: 'flex',
    // flexDirection: 'row',
    // justifyContent:'space-between'
  },
  floatingButton: {
    backgroundColor: '#00b8ce',
    position: 'relative',
  },
  price: {
    fontSize: 14,
    color: '#000',
    position: 'absolute',
    bottom: 20,
    right: 15,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  item: {
    width: 50,
    textAlign: 'center',
    fontSize: 18,
    color: '#000',
  },
})
