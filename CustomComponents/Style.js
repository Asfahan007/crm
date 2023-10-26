import { Dimensions } from "react-native"
import { appColor } from "./Image"

export const screenHeight = Dimensions.get("window").height
export const screenWidth = Dimensions.get("window").width

export const cardContainer = {
    color: '#000',
    paddingHorizontal: 10,
    backgroundColor: 'white',
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    borderRadius: 7.5,
    marginTop: 15,
    marginBottom: 15,
}

export const floatingLabelContainer = {
    height: 50,
    width: Dimensions.get("screen").width - 50,
    marginTop: 15,
    paddingHorizontal: 10,
}

export const floatingLabelContainerRow = {
    height: 50,
    marginTop: 15,
    paddingHorizontal: 10,
    // marginHorizontal: 10,
    flex: 1,
}

export const pickerInputContainer = {
    height: 50,
    width: Dimensions.get("screen").width - 70,
    marginTop: 15,
    backgroundColor: '#faffff',
    borderRadius: 7.5,
    borderWidth: 1,
    borderColor: 'gray',
    color: '#000000',
    marginHorizontal: 10,
}

export const pickerInputContainerRow = {
    height: 50,
    marginTop: 15,
    backgroundColor: '#faffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'grey',
    color: '#000000',
    flex: 1,
    marginHorizontal: 10
}

export const pickerItem = {
    fontSize: 14,
    color: '#49658c',
}
export const pickerItem2 = {
    fontSize: 14,
    color: 'black',
}

export const floatingLabelContainerInternal = {
    height: 50,
    borderColor: 'grey',
    backgroundColor: '#faffff',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    color: '#000',
    width: Dimensions.get("screen").width - 70,
    fontSize: 14,
}

export const floatingLabelContainerInternalRow = {
    height: 50,
    borderColor: 'grey',
    backgroundColor: '#faffff',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    color: '#000',
    fontSize: 14,
}

export const placeholderTextColor = "#49658c"

export const saveAndCancel = {
    flexDirection: 'row',
    marginVertical: 20,
    justifyContent: 'center',
    alignItems: 'center'
}

export const cancelButton = {
    width: 100,
    backgroundColor: '#f1f5f7',
    alignItems: 'center',
    marginHorizontal: 10,
    height: 40,
    justifyContent: 'center'
}

export const cancelText = {
    color: '#000'
}

export const saveButton = {
    width: 100,
    backgroundColor: appColor,
    alignItems: 'center',
    marginHorizontal: 10,
    height: 40,
    justifyContent: 'center'
}

export const saveText = {
    color: '#fff'
}

export const errorMessage = {
    color: 'red',
    fontSize: 10
}

export const multiSelectOptions = {
    marginTop: 7,
    width: Dimensions.get("screen").width - 50,
    // marginLeft: 12,
    borderColor: 'grey',
    borderRadius: 4,
    paddingHorizontal: 10,
}

export const multiSelectOptionsRow = {
    marginTop: 7,
    marginHorizontal: 10,
    borderColor: 'grey',
    borderRadius: 4,
    flex: 1
}

export const searchOption = {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 10,
    borderColor: appColor,
    backgroundColor: '#fff',
    borderWidth: 0.38,
    width: screenWidth - 20,
    marginHorizontal: 10,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    marginTop:10
}

export const addButton = {
    height: 55,
    width: 55,
    backgroundColor: appColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
}

export const checkboxContainer = {
    flexDirection: "row",
    marginHorizontal: 10,
    marginTop: 20
}

export const listCardContainer = {
    color: '#000',
    backgroundColor: 'white',
    marginTop:10,
    padding: 10,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    width: screenWidth - 20,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 3,
    marginBottom:2.5
}

export const homeCardContainer = {
    color: '#000',
    backgroundColor: 'white',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderRadius: 7.5,
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 5,
    marginRight: 5,
    width: screenWidth - 30,
    alignItems: 'center',
    paddingVertical: 30,
    borderColor: 'grey',
    borderWidth: 0.5
}


