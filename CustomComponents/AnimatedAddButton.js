import { navigationRef } from '../../Navigators/utils';
import * as React from 'react';
import { View, Animated, TouchableWithoutFeedback, Easing } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { appColor } from './Image';

export default function AnimatedAddButton(props) {

    const [expanded, setExpanded] = React.useState(false);
    const animationHeight = React.useRef(new Animated.Value(2)).current;

    const toggleExpansion = () => {
        setExpanded(!expanded);
    };

    React.useEffect(() => {
        if (expanded) {
            Animated.timing(animationHeight, {
                duration: 500,
                toValue: 130,
                easing: Easing.bounce
            }).start();
        }
        else {
            Animated.timing(animationHeight, {
                duration: 200,
                toValue: 50,
                easing: Easing.linear
            }).start();
        }
    }, [expanded]);

    return (
        <View style={{
            position: 'absolute',
            bottom: props.bottom,
            right: 0,
        }}>

            <Animated.View style={[{
                width: animationHeight, height: 60, flexDirection: 'row', borderTopLeftRadius: 20,
                borderBottomLeftRadius: 20, alignItems: 'center', overflow: 'hidden',
                borderColor: '#999',
                borderWidth: 0.5,
                backgroundColor: '#FFF',
                elevation: 4
            }]}>
                <TouchableOpacity
                    onPress={() => {
                        toggleExpansion();
                    }}
                    style={{ paddingLeft: 20, width: 50, height: 55, justifyContent: 'center' }}
                >
                    <FontAwesome5 name={expanded ? 'chevron-right' : 'chevron-left'}
                        color="#808080"
                        size={20}
                        style={{}}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => props.navigation.navigate(props.screenName)}
                    style={{ marginLeft: 17 }}
                >
                    <FontAwesome5 name={'plus'}
                        color={appColor}
                        size={35}
                    // style={{ marginLeft: 20 }}
                    />
                </TouchableOpacity>
            </Animated.View>
        </View >
    );
}

