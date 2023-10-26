import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Table, Row, Rows, TableWrapper } from 'react-native-table-component'
import { useSelector } from 'react-redux'

const TableProduct = () => {
  const [product_name, setProduct_name] = useState([])
  const productList = useSelector(state => state.productDetails.productList)
  let product_array = []
  useEffect(() => {
    productList.map((e,index) => {
        let arr=[`${e.productName}`,`${e.productSize}`,`${'\u20B9'+e.ProductPrice}`,`${e.quantity}`,`${'\u20B9'+e.quantity*e.ProductPrice}`]
        product_array.push(arr)
      })
    setProduct_name(product_array)
  }, [])

  const header = ['Product Name', 'Sizing', 'Price', 'Quantity','Total']

  return (
    <View>
      <Table>
        <TableWrapper style={styles.wrapper} >
          <Row style={styles.head} data={header} textStyle={styles.headerText} />
          <Rows style={styles.body} data={product_name} textStyle={styles.bodyText} />
        </TableWrapper>
      </Table>
    </View>
  )
}
export default TableProduct
const styles = StyleSheet.create({
  head: { height: 35, backgroundColor: '#f1f5f7' },
  body: { height: 35, backgroundColor: '#f1f5f7',marginBottom:10, },
  headerText: { color: '#263238', textAlign: 'center' ,fontWeight:'bold'},
  bodyText: { color: '#263238', textAlign: 'center', },

})
