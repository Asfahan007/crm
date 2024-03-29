import React, { Component } from "react";

import { View, Dimensions, Text } from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";
// import Icon from "react-native-vector-icons/Ionicons";
import * as Animatable from "react-native-animatable";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

console.disableYellowBox = true;

const Barcode = ({ navigation }) => {
    function onSuccess(e) {
        console.log("sku number", e.data)
        let temp = e.data
        navigation.navigate('New Sale', { sku: temp, reRenderBarcode: Date.now() })
    }

    function makeSlideOutTranslation(translationType, fromValue) {
        return {
            from: {
                [translationType]: SCREEN_WIDTH * -0.18
            },
            to: {
                [translationType]: fromValue
            }
        };
    }

    return (
        <QRCodeScanner
            showMarker
            onRead={onSuccess}
            cameraStyle={{ height: SCREEN_HEIGHT }}
            customMarker={
                <View style={styles.rectangleContainer}>
                    <View style={styles.topOverlay}>
                        <Text style={{ fontSize: 30, color: "white" }}>
                            QR CODE SCANNER
                        </Text>
                    </View>

                    <View style={{ flexDirection: "row" }}>
                        <View style={styles.leftAndRightOverlay} />
                        <View style={styles.rectangle}>
                            {/* <Icon
                                name="ios-qr-scanner"
                                size={SCREEN_WIDTH * 0.73}
                                color={iconScanColor}
                            /> */}
                            <Animatable.View
                                style={styles.scanBar}
                                direction="alternate-reverse"
                                iterationCount="infinite"
                                duration={1700}
                                easing="linear"
                                animation={makeSlideOutTranslation(
                                    "translateY",
                                    SCREEN_WIDTH * 0.2
                                )}
                            />
                        </View>

                        <View style={styles.leftAndRightOverlay} />
                    </View>

                    <View style={styles.bottomOverlay} />
                </View>
            }
        />
    );
}

const overlayColor = "rgba(0,0,0,0.5)"; // this gives us a black color with a 50% transparency

const rectDimensions = SCREEN_WIDTH * 0.65; // this is equivalent to 255 from a 393 device width
const rectBorderWidth = SCREEN_WIDTH * 0.005; // this is equivalent to 2 from a 393 device width
const rectBorderColor = "red";

const scanBarWidth = SCREEN_WIDTH * 0.46; // this is equivalent to 180 from a 393 device width
const scanBarHeight = SCREEN_WIDTH * 0.0025; //this is equivalent to 1 from a 393 device width
const scanBarColor = "#22ff00";

const iconScanColor = "blue";

export default Barcode

const styles = {
    rectangleContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent"
    },

    rectangle: {
        height: rectDimensions,
        width: rectDimensions,
        borderWidth: rectBorderWidth,
        borderColor: rectBorderColor,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent"
    },

    topOverlay: {
        flex: 1,
        height: SCREEN_WIDTH,
        width: SCREEN_WIDTH,
        backgroundColor: overlayColor,
        justifyContent: "center",
        alignItems: "center"
    },

    bottomOverlay: {
        flex: 1,
        height: SCREEN_WIDTH,
        width: SCREEN_WIDTH,
        backgroundColor: overlayColor,
        paddingBottom: SCREEN_WIDTH * 0.25
    },

    leftAndRightOverlay: {
        height: SCREEN_WIDTH * 0.65,
        width: SCREEN_WIDTH,
        backgroundColor: overlayColor
    },

    scanBar: {
        width: scanBarWidth,
        height: scanBarHeight,
        backgroundColor: scanBarColor
    }
};