var React = require('react-native');

var {
    StyleSheet,
    Image,
    Text,
    View,
    TouchableNativeFeedback,
    ProgressBarAndroid
    } = React;

var ScrollableTabView = require('react-native-scrollable-tab-view');

var Constants = require('./Constants');
var MessagesList = require('./MessagesList');


var MessageScreen = React.createClass({
    getInitialState() {
        return {
            message: null
        };
    },
    componentDidMount: function () {
        //this.fetchMessages();
    },
    //fetchMessages: function () {
    //    if (this.state.isRefreshing) {
    //        return;
    //    }
    //    this.setState({isRefreshing: true});
    //    var self = this;
    //    fetch(Constants.URL_MESSAGES, {
    //        credentials: 'same-origin'
    //    }).then(function (response) {
    //        return response.json()
    //    }).then(function (json) {
    //        console.log(json);
    //        if (json.error == 0) {
    //            self.setState({
    //                isRefreshing: false,
    //                receive: json.receive,
    //                send: json.send
    //            });
    //        } else {
    //            ToastAndroid.show(json.message, ToastAndroid.SHORT);
    //        }
    //    }).catch(function (e) {
    //        ToastAndroid.show(e.message, ToastAndroid.SHORT);
    //    });
    //},
    render: function () {
        if (!this.state.message) {
            return (
                <View style={styles.progressView}>
                    <ProgressBarAndroid styleAttr="Large"/>
                </View>
            );
        }
    }
});

var styles = StyleSheet.create({
    progressView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    }
});

module.exports = MessageScreen;