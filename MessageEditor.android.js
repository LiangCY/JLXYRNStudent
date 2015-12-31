'use strict';

var React = require('react-native');

var {
    StyleSheet,
    Image,
    Text,
    View,
    TouchableNativeFeedback,
    ToolbarAndroid,
    } = React;

var Constants = require('./Constants');

var MessageEditor = React.createClass({
    getInitialState() {
        return {};
    },
    componentDidMount: function () {
    },
    sendMessage: function () {
        this.props.navigator.pop();
    },
    render() {
        return (
            <View style={styles.container}>
                <ToolbarAndroid
                    navIcon={require('image!ic_back_white')}
                    title='添加私信'
                    titleColor="white"
                    style={styles.toolbar}
                    onIconClicked={() => this.props.navigator.pop()}/>
                <View style={styles.editor}>
                    <TouchableNativeFeedback
                        background={TouchableNativeFeedback.Ripple()}
                        onPress={()=>this.sendMessage()}>
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>发送</Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    toolbar: {
        backgroundColor: '#3f51b5',
        height: 56
    },
    editor: {
        padding: 16
    },
    button: {
        height: 48,
        backgroundColor: '#3f51b5',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        color: 'white',
        fontSize: 18
    }
});

module.exports = MessageEditor;
