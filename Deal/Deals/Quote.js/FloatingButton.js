import * as React from 'react';
import { Text, View, StyleSheet, Dimensions, Image } from 'react-native';

const screen = Dimensions.get('screen');
export default function FloatingButton() {
    return (
        <View style={styles.container}>
            <View style={styles.banner}>
                <View style={styles.profile}>
                    <Image
                        source={{ uri: 'https://i.stack.imgur.com/SXxvF.jpg' }}
                        style={{ width: 100, height: 100, overflow: "hidden" }}
                    />
                </View>
                <View>
                    <Text>hello</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ecf0f1',
        alignItems: 'center',
    },
    banner: {
        backgroundColor: '#00b8ce',
        height: screen.width * 2,
        width: screen.width * 2,
        borderWidth: 5,
        borderColor: 'orange',
        borderRadius: screen.width,
        position: 'absolute',
        bottom: screen.height - screen.height * 0.3,
        alignItems: 'center',
    },
    profile: {
        width: 100,
        height: 100,
        backgroundColor: 'pink',
        position: 'absolute',
        bottom: -50,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: 'white',
        overflow: "hidden"
    },
});