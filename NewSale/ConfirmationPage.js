import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import React, { useCallback, useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import TableProduct from './TableProduct'
import { useDispatch, useSelector } from 'react-redux'
// import { cartEmpty } from '/../../Store/ProductContainer'
import { openDatabase } from 'react-native-sqlite-storage'
import { useEffect } from 'react'

const db = openDatabase({
  name: 'customer_database',
})

const screenWidth = Dimensions.get('window').width
const paymentData = [
  { id: '1', title: 'Full Payment',},
]

const fullPaymentData = [
  { id: '1', title: 'Pay Now'},
  { id: '2', title: 'Pay Later'},

]
const paymentMethodData=[
  { id: '1', title: 'Cash'},
  { id: '2', title: 'Cheque'},
  { id: '3', title: 'Debit Card'},
  { id: '4', title: 'Credit Card'},
  { id: '5', title: 'Online'},
  { id: '6', title: 'Wallet'},
]

let today = new Date();
var date30 = new Date(new Date().setDate(today.getDate() + 30));
var date60 = new Date(new Date().setDate(today.getDate() + 60));
var date90 = new Date(new Date().setDate(today.getDate() + 90));

const payLaterData=[
  { id: '1', title: 'Pay in 30 days'+" "+ date30},
  { id: '2', title: 'Pay in 60 days'+"  "+date60},
  { id: '3', title: 'Pay in 90 days'+" "+date90},
]
const ConfirmationPage = ({ navigation,route} ) => {

  const dispatch=useDispatch();
  const totalPrice=useSelector(state=>state.productDetails.productALlPrice)
  const productList = useSelector(state => state.productDetails.productList)
  const customer=useSelector(state=>state.customerDetails.customerData)
  const [payment, setPayment] = useState('')
  const [fullPayment, setFullPayment] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [payLater, setPayLater] = useState('')
  const [currentdate, setcurrentDate] = useState(
    new Date().toISOString().slice(0, 10),
  )
  const [invoiceNumber,setinvoicenumber]=useState()
  const [saleid, setsaleid] = useState()
  const [alldata,setalldata]=useState([]);
  const[isactive,setisactive]=useState(false)

  const getinvoice=()=>{
    const date = new Date()
    setinvoicenumber (Number(
      date.getDate() +
        '' +
        date.getMonth() +
        '' +
        date.getFullYear() +
        '' +
        Math.floor(Math.random() * 10000),
    ))
  }
useEffect(() => {
  getinvoice()
}, [])
console.log("invoice",invoiceNumber);
  useEffect(() => {
    createSaleTable()
    createSaleItemTable()
  }, [])
  const createSaleTable = () => {
    db.transaction(txn => {
      txn.executeSql(
        'CREATE TABLE IF NOT EXISTS sale (saleid INTEGER PRIMARY KEY AUTOINCREMENT,customerId VARCHAR(20),customerName VARCHAR(30),customerMobile VARCHAR(20),customerEmail VARCHAR(20),invoiceNo VARCHAR(20),category VARCHAR(20),invoiceDate VARCHAR(20),subTotal VARCHAR(20),taxPercentage VARCHAR(20),totalTax VARCHAR(20),total VARCHAR(20),paymentMethod VARCHAR(20),status VARCHAR(20),notes VARCHAR(20),storeId VARCHAR(20),StoreName VARCHAR(20),accountId VARCHAR(20),createdBy VARCHAR(20),updatedBy VARCHAR(20),createdDate VARCHAR(20),updatedDate VARCHAR(20),type VARCHAR(20),discountedPrice VARCHAR(20),discountedPercentage VARCHAR(20),offer VARCHAR(20),sub VARCHAR(20),paymentType VARCHAR(20),fullpaymentType VARCHAR(20),paylaterType VARCHAR(20))',
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
  const createSaleItemTable = () => {
    db.transaction(txn => {
      txn.executeSql(
        'CREATE TABLE IF NOT EXISTS sale_item (saleItemid INTEGER PRIMARY KEY AUTOINCREMENT ,saleid varchar(30),productId varchar(30),productName varchar(30),category varchar(30),subCategory varchar(30),sizing varchar(30),mrp varchar(30),qty varchar(30),quantityPostReturn varchar(30),sku varchar(30),total varchar(30),storeId varchar(30),accountId varchar(30),createdBy varchar(30),updatedBy varchar(30),createdDate varchar(30),updatedDate varchar(30),type varchar(30),productInventoryId varchar(30))',
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
  const insertvalueinSale = async()  => {
    await db.transaction(txn => {
      txn.executeSql(
        'INSERT INTO sale (customerId,customerName,customerMobile,customerEmail,invoiceNo,subTotal,taxPercentage,totalTax,total,paymentMethod,createdDate,paymentType,fullpaymentType,paylaterType,invoiceDate) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [
          route.params.source.customer_id,
          route.params.source.customer_name,
          route.params.source.mobile,
          'bridgestone@tyres.com',
          invoiceNumber,
          totalPrice.subtotalPrice,
          '18%',
          totalPrice.GSTPrice,
          totalPrice.totalPrice,
          paymentMethod,
          currentdate,
          payment,
          fullPayment,
          payLater,
          currentdate,
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
  const getSaleDEtails = async () => {
    await db.transaction(txn => {
      txn.executeSql(
        `SELECT * FROM sale ORDER BY saleid DESC`,
        [],
        (tx, res) => {
          let len = res.rows.length
          if (len > 0) {
            let item = res.rows.item(0)
            setsaleid(item.saleid)
          }
        },
        error => {
          console.log('error while GETTING', error.message)
        },
      )
    })
  }
  const insertinSaleItemTable = () => {
    productList.map(e => {
      db.transaction(txn => {
        txn.executeSql(
          'INSERT INTO sale_item (productId,productName,category,subCategory,sizing,mrp,qty,total,saleId,createdDate,type) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
          [
            e.productId,
            e.productName,
            e.category,
            e.subCategory,
            e.productSize,
            e.ProductPrice,
            e.quantity,
            (e.ProductPrice * e.quantity),
            saleid,
            currentdate,
            'sale',
          ],
          (txn, res) => {
            console.log('successfully inserted product', res)
          },
          error => {
            console.log('error while INSERTING Product' + error.message)
          },
        )
      })
    })
  }
  const getsellproducts = async() => {
  await  db.transaction(txn => {
      txn.executeSql(
        `SELECT * FROM sale_item`,
        [],
        (tx, res) => {
          let len = res.rows.length
          if (len > 0) {
            let results = []
            for (let i = 0; i < len; i++) {
              let item = res.rows.item(i)
              // console.log('items',item)
              results.push(item.productId);
              setalldata(results)
            }
            console.log(alldata.length);
          }
        },
        error => {
          console.log('error while GETTING', error.message)
        },
      )
    })
  }
  useEffect(() => {
    if (saleid != undefined) {
      insertinSaleItemTable()
      navigation.navigate("Detail Page",{customerName:route.params.source.customer_name,customerMobile:route.params.source.mobile,customerId:route.params.source.customer_id,payment:payment,fullPayment:fullPayment,paymentMethod:paymentMethod,payLater:payLater,invoiceNumber,notes:route.params.source.notes})
    }
    console.log("alldtaa",saleid);

  }, [saleid])


  const generateBill=()=>{
    
    if(payment!=''&&(fullPayment=='Pay Now'|| (fullPayment=='Pay Later'&& payLater!==""))&&paymentMethod!==''){
      setisactive(true)
      insertvalueinSale()
    getSaleDEtails()
    getsellproducts();
    // console.log("alldtaa",saleid);
    setTimeout(() => {
      setisactive(false)
    }, 1000);
    }
      else  {
        alert("Please select relevant field")
        // setisactive(false)
      }
  }
  const onItemPress = title => {
    switch (title) {
      case 'Full Payment Type':
        return alert("hi payment")
      case 'Payment Method':
        return navigation.navigate('Product List')
      }
    }
  return (
    <>
      <ScrollView>
      <View>
        <View style={styles.card}>
        {/* <View style={{flexDirection:'row' ,justifyContent:'space-between'}}>
        <Text style={styles.bill}>Name</Text>
          <Text style={styles.billText}>{customer.customer_name}</Text>
         </View>
         <View style={{flexDirection:'row' ,justifyContent:'space-between'}}>
        <Text style={styles.bill}>Mobile</Text>
          <Text style={styles.billText}>{customer.mobile}</Text>
         </View> */}
         {/* <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text style={styles.bill}>Invoice</Text>
            <Text style={[styles.billText, { marginLeft: 10, fontWeight: 'bold' }]}>
              6377383939
            </Text>
          </View> */}
         <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
         <View style={{ display: 'flex', flexDirection: 'column' }}>
              <Text style={styles.bill}>To :</Text>
              <Text style={styles.billText}>{customer.customer_name}</Text>
              <Text style={styles.billText}>{customer.mobile}</Text>
            </View>
            <View style={{ flexDirection: 'column', marginTop: 10,alignItems:'flex-start' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: 'black' }}>
              Details :
            </Text>
            <Text style={styles.billText}>Invoice {invoiceNumber}</Text>
            <Text style={styles.billText}>Date {currentdate}</Text>
          </View>
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.table}>
            <TableProduct/>
          </View>
        </View>
      </View>
      <View style={styles.pricing}>
          <PricingSection title="SubTotal :" price={totalPrice.subtotalPrice} symbol={'\u20B9'}/>
          <PricingSection title="GST(18%) :" price={totalPrice.GSTPrice} symbol={'\u20B9'}/>
          <PricingSection title="Total :" price={totalPrice.totalPrice} symbol={'\u20B9'}/>
        </View>
        <View style={styles.offer}>
          <Text style={styles.offerText}>
            Payment Type
          </Text>
     </View> 
        <View style={styles.offer}>
          {paymentData.map(dt => (
            <OfferItem
              key={dt.title}
              data={dt}
              selected={payment === dt.title}
              onItemPress={() => setPayment(dt.title)}
            />
          ))}
        </View>
        <View style={styles.offer}>
          <Text style={styles.offerText}>
             Full Payment Type
          </Text>
        </View>
        <View style={styles.offer}>
          {fullPaymentData.map(dt => (
            <OfferItem
              key={dt.title}
              data={dt}
              selected={fullPayment === dt.title}
              onItemPress={() => setFullPayment(dt.title)}
            />
          ))}
          {(fullPayment=="Pay Later")?(
          <View>
             <View style={styles.later}>
          <Text style={styles.offerText}>
              Pay Later Type
          </Text>
          {payLaterData.map(dt => (
          <OfferItem
              key={dt.title}
              data={dt}
              selected={payLater === dt.title}
              onItemPress={() => setPayLater(dt.title)}
            />
          ))}
            </View>
        </View>
            ):null}
        </View>
        <View style={styles.offer}>
          <Text style={styles.offerText}>
              Payment Method
          </Text>
     </View> 
        <View style={styles.offer}>
          {paymentMethodData.map(dt => (
            <OfferItem
              key={dt.title}
              data={dt}
              selected={paymentMethod === dt.title}
              onItemPress={() => setPaymentMethod(dt.title)}
            />
          ))}
        </View>
      <View style={styles.view}>
        <View style={styles.cancelbuttons}>
          <TouchableOpacity onPress={()=>navigation.goBack()}>
            <Text style={styles.textCancel}>X  Cancel</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.billbuttons}>
          <TouchableOpacity onPress={()=>generateBill()} disabled={isactive}>
            <Text style={styles.textCancel}>{'\u2713'} Generate Bill</Text>
          </TouchableOpacity>
      </View>
    </View>
    </ScrollView>
    </>
  )
}
function OfferItem({ data, onItemPress, selected }) {
  const onSelect = useCallback(
    ( title) => {
      onMenuPress(title)
    },
    [selected],
  )
  return (
    <TouchableOpacity onPress={onItemPress} style={styles.offerSection}>
      <View style={styles.offerSectionData}>
        {selected && (
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: '#00b8ce',
            }}
          />
        )}
      </View>
      <Text  onPress={onItemPress}style={{ fontSize: 14, color: '#263238', flex: 1, marginLeft: 20 }}>
    {data.title}
      </Text>
      <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#263238' }}>
        {data.price}
      </Text>
    </TouchableOpacity>
  )
}
function PricingSection({ title, price,symbol }) {
  return (
    <View style={styles.pricingSection}>
      <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#263238' }}>
        {title} 
      </Text>
      <Text style={{ fontSize: 17, color: '#000' }}>{symbol}{price}</Text>
    </View>
  )
}

export default ConfirmationPage

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
  },
  text: {
    color: 'black',
    fontSize: 16,
    marginTop: 10,
  },
  table: {
    backgroundColor: '#f1f5f7',
    fontSize: 16,
    marginTop: 25,
    color: 'black',
  },
  bill: {
    marginTop: 5,
    color: '#263238',
    fontSize: 16,
    fontWeight:'bold'

  },
  billText: {
    marginTop: 5,
    color: '#263238',
    fontSize: 16,
  },
  billing: {
    marginTop: 30,
  },
  view: {
    flexDirection: 'row',
    justifyContent:'space-around',
    
  },
  cancelbuttons: {
    width: '30%',
    height: 40,
    backgroundColor: '#00b8ce',
    borderRadius: 4,
    marginTop:15,
    justifyContent:'center',
    marginBottom:20,
    marginLeft:50
  },
  textCancel: {
    color: '#fff',
    textAlign: 'center',
    // justifyContent: 'center',
  },
  billbuttons: {
    width: '30%',
    height: 40,
    backgroundColor: '#00b8ce',
    borderRadius: 4,
    marginTop:15,
    justifyContent:'center',
    marginBottom:20,
    marginRight:50

  },
  pricing: {
    backgroundColor: 'white',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
    margin:10,
  },
  pricingSection: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: '#e0e0e0',
  },
  offer: {
    backgroundColor: 'white',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
    marginLeft:10,
    marginRight:10,
  },
  offerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#263238',
    margin: 10,
  },
  offerSection: {
    width: '100%',
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: '#e0e0e0',
  },
  offerSectionData: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#f1f5f7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'black',
    fontSize: 15,
    marginTop: 15,
  },
})
