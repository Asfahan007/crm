import { View, Text, TouchableOpacity, Image, Keyboard } from 'react-native'
import React from 'react'
import { listCardContainer } from './Style'
import { appColor } from './Image'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { textColor } from '../CustomComponents/Image'


const ListCard2 = (props) => {
  return (
    <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }} >
      <TouchableOpacity
        style={{}}
        onPress={() => props.navigation.navigate(props.screenName, props.dataPass)}
      >
        <View style={{ alignItems: 'center' }}>
          <View style={[listCardContainer, { flexDirection: 'row', alignItems: 'center' }]}>
             <View style={{ flex: 1 }}>
              <View style={{ flex: 1 }}>
                
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginRight: 10,
                    }}
                  >
                    <View>
                      <View style={{ flexDirection: 'row' }}>
                        <Text
                          style={{
                            fontSize: 16,
                            color:textColor,
                            marginBottom: 1,
                            fontWeight: 'bold',
                            marginRight: 3,
                          }}
                        >
                          {props.firstTitle}
                        </Text>
                      </View>
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center', width: '70%' }}
                      >
                       
                        <View  style={{ }}>
                        <Text
                    style={{
                      fontSize: 16,
                      color:textColor,
                    }}
                  >
                    {props.firstHeading}
                  </Text>
                        </View>
                      </View>
                    </View>
                    <View style={{ width: '40%' }}>
                      <Text
                        style={{
                          fontSize: 16,
                          color:textColor,
                          marginBottom: 1,
                          fontWeight: 'bold',
                        }}
                      >
                        {props.secondTitle}
                      </Text>
                      <Text
                        style={{
                           
                          fontSize: 16,
                          color:textColor,
                          lineHeight: 20,
                          marginBottom: 10,
                        }}
                      >
                          {props.secondHeading}
                      </Text>
                    </View>
                  </View>

                  <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 10,
                }}
              >
                <View style={{}}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: textColor,
                      fontWeight: 'bold',
                      marginBottom: 1,
                    }}
                  >
                     {props.thirdTitle}
                  </Text> 
                 <Text
                    style={{
                      fontSize: 16,
                      color:textColor,
                    }}
                  >
                    {props.thirdHeading}
                  </Text>
                </View> 
                <View style={{ width: "40%", marginRight: 5 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color:textColor,
                      marginBottom: 1,
                      fontWeight: 'bold',
                    }}
                  >
                    {props.fourthTitle}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      color:textColor,
                      lineHeight: 20,
                      marginBottom: 10,
                    }}
                  >
             {props.fourthHeading}
                  </Text>
                </View> 
                 </View>
              
            </View> 
            {/* <View style={styles.cards}>
            <View style={{}}>
              <Table>
                <ScrollView nestedScrollEnabled={true}>
                  <TableWrapper style={styles.wrapper}>
                    <Row
                      style={styles.head}
                      data={header}
                      textStyle={styles.headerText}
                    />
                    <Rows
                      style={styles.body}
                      data={product_name}
                      textStyle={styles.bodyText}
                    />
                  </TableWrapper>
                </ScrollView>
              </Table>
            </View>
          </View> */}
             
                 </View></View>  
          </View>
        </View>
      </TouchableOpacity>
    </TouchableWithoutFeedback>
  )
}

export default ListCard2