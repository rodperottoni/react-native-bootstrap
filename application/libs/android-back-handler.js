import { DeviceEventEmitter } from 'react-native';
import { Actions } from 'react-native-router-flux';
import _ from 'lodash';

const backPressSubscriptions = [];

// https://github.com/facebook/react-native/issues/3223#issuecomment-355064410
const AndroidBackHandler = {
    start: _.once(() => {
        DeviceEventEmitter.removeAllListeners('hardwareBackPress');
        DeviceEventEmitter.addListener('hardwareBackPress', () => {
            for (let i = backPressSubscriptions.length - 1; i >= 0; i -= 1) {
                if (backPressSubscriptions[i]()) {
                    break;
                }
            }
        });

        backPressSubscriptions.push(AndroidBackHandler.handleHardwareBack);
    }),
    addListener: fn => backPressSubscriptions.push(fn),
    popListener: () => backPressSubscriptions.pop(),
    handleHardwareBack: () => {
        console.log(Actions);
        if (Actions.currentParams.androidBackDisabled) {
            return false;
        }

        Actions.pop();
    },
    stop: () => {
        DeviceEventEmitter.removeAllListeners('hardwareBackPress');
    }
};

export default AndroidBackHandler;
