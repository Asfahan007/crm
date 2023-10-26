import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  Dimensions,
} from 'react-native'
import React, { useEffect, useRef, useState, useLayoutEffect } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
// import MyDeals from './MyDeals'
import { ScrollView } from 'react-native-gesture-handler'
import FloatingButton from '../../../../MD/components/FloatingButton'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { store } from '../../../../Store'
import { textColor } from '../../../../Containers/CustomComponents/Image'
const MyDeals = ({ navigation, data }) => {
  const height = Dimensions.get('window').height
  const width = Dimensions.get('window').width
  const [activeTab, setActiveTab] = useState('All Deals')
  const [show, setShow] = useState('All Deals')
  // const [show, setShow] = useState('')

  const profile = store.getState().auth.profile.name

  const RenderDeals = e => {
    return (
      <>
      {console.log("first", e.data, profile)}
        {e.data?.dealOwner === profile && (
           <View style={[styles.card]}>
           <View>
             <Text
               style={{
                 fontSize: 16,
                 color: textColor,
                 fontWeight: '500',
                 lineHeight: 20,
                 marginBottom: 10,
               }}
             >
               {e.data?.dealName}
             </Text>
 
             <View
               style={{
                 flexDirection: 'row',
                 justifyContent: 'space-between',
                 marginBottom: 10
               }}
             >
               <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                 <View>
                   <Text
                     style={{ fontSize: 14, color: textColor}}
                   >
                     {e.data?.dealStage}
                   </Text>
                 </View>
                 <View>
                   <Text
                     style={{
                       fontSize: 14,
                       color: '#fff',
                       paddingLeft: 5,
                       paddingRight: 5,
                       backgroundColor: e.data?.priority == 'High' ? "red" : e.data?.priority == 'Medium' ? "#ff9c3a" : "#68ce39",
                       borderRadius: 2,
                       marginLeft: 5,
                     }}
                   >
                     {e.data?.priority}
                   </Text>
                 </View>
               </View>
               <View
                 style={{
                   flexDirection: 'row',
                   width: '34%',
                   alignItems: 'center',
                 }}
               >
                 <View
                   style={{ color: 'black', lineHeight: 18, marginRight: 5 }}
                 >
                   <FontAwesome5
                     name={'calendar-check'}
                     solid
                     color="#000"
                     size={13}
                   />
                 </View>
                 <View>
                   <Text
                     style={{ fontSize: 14, color:textColor, lineHeight: 18 }}
                   >
                     {''}
                     {e.data?.closeDate?.slice(0, 10)}
                   </Text>
                 </View>
               </View>
             </View>
             <View
               style={{
                 flexDirection: 'row',
                 justifyContent: 'space-between',
                 // marginRight: 35,
               }}
             >
               <View style={{ flexDirection: 'row' }}>
                 {e.data?.icon == 'call-sharp' ? (
                   <Icon name={e.data?.icon} color="#000" solid size={16} />
                 ) : (
                   <FontAwesome5
                     name={'people-carry'}
                     solid
                     color="#000"
                     size={13}
                   />
                 )}
                 <Text
                   style={{ fontSize: 14, color: textColor, lineHeight: 18 }}
                 >
                   {' '}
                   {e.data?.dealAmount}
                 </Text>
               </View>
               <View
                 style={{
                   color: 'black',
                   lineHeight: 18,
                   marginBottom: 0,
                   // marginRight: 35,
                   flexDirection: 'row',
                   alignItems: 'center',
                   width: '34%'
                 }}
               >
                 <Icon name={'md-person-sharp'} color="#000" solid size={16} />
 
                 <Text
                   style={{
                     fontSize: 14,
                     color: textColor,
                     lineHeight: 18,
                     marginLeft: 3
                   }}
                 >
                   {e.data?.dealOwner?.slice(0, 7)}
                 </Text>
               </View>
             </View>
           </View>
 
           <View style={{ position: 'absolute', right: 5, top: 30 }}>
             <View>
               <TouchableOpacity
                 style={{ justifyContent: 'center' }}
                 onPress={() => navigation.navigate('Deal Detail', e.data)}
               >
                 <View style={styles.arrowbutton}>
                   <Image
                     style={{
                       width: 20,
                       height: 20,
                       tintColor: '#00b8ce',
                       alignItems: 'center',
                       justifyContent: 'flex-end',
                     }}
                     source={require('../../../../Assets/Images/ic_chevron_right.png')}
                   />
                 </View>
               </TouchableOpacity>
             </View>
           </View>
         </View>
        )}
      </>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <View>
        <FlatList
          contentContainerStyle={{ paddingBottom: 10 }}
          data={data}
          // gap={10}
          renderItem={({ item }) => <RenderDeals data={item} />}
        // key={cats => cats.ids}
        />
        <View
          style={{
            position: 'absolute',
            paddingTop: height - 250,
            paddingLeft: width - 80,
          }}
        >
          {/* <TouchableOpacity
            style={styles.addButton}
            // onPress={() => navigation.navigate('Add Deal')}
          >
            <Image
              style={{ width: 18, height: 18, tintColor: '#FFF' }}
              source={require('@/MD/assets/chip/ic_plus.png')}
            />
          </TouchableOpacity> */}
        </View>
      </View>
    </View>
  )
}

export default MyDeals

const styles = StyleSheet.create({
  addButton: {
    height: 55,
    width: 55,
    backgroundColor: '#00b8ce',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },
  arrowbutton: {
    height: 35,
    width: 35,
    alignItems: 'center',
    // justifyContent: 'center',
    marginTop: 15,
  },
  card: {
    backgroundColor: 'white',
    marginHorizontal: 10,
    marginTop: 4,
    marginBottom: 0,
    padding: 10,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
  },
})
