'use strict';

var React = require('react-native');
var {
    AppRegistry,
    StyleSheet,
    View,
    Navigator,
    BackAndroid,
    Text,
    } = React;

var LoginScreen = require('./LoginScreen');
var MainScreen = require('./MainScreen');
var UserScreen = require('./UserScreen');
var TaskScreen = require('./TaskScreen');
var ResourceScreen = require('./ResourceScreen');
var MessageEditor = require('./MessageEditor');
var MessageScreen = require('./MessageScreen');

var _navigator;
BackAndroid.addEventListener('hardwareBackPress', () => {
    if (_navigator && _navigator.getCurrentRoutes().length > 1) {
        _navigator.pop();
        return true;
    }
    return false;
});

var RNApp = React.createClass({
    RouteMapper: function (route, navigationOperations) {
        _navigator = navigationOperations;
        if (route.name === 'login') {
            return (
                <LoginScreen navigator={navigationOperations}/>
            );
        }
        else if (route.name === 'main') {
            return (
                <MainScreen menu={route.menu} navigator={navigationOperations}/>
            );
        }
        else if (route.name === 'user') {
            return (
                <UserScreen/>
            );
        }
        else if (route.name === 'event') {
            return (
                <View style={styles.container}>
                    <Text>
                        {route.event.date}
                    </Text>
                </View>
            );
        }
        else if (route.name === 'task') {
            return (
                <TaskScreen taskId={route.taskId} navigator={navigationOperations}/>
            );
        }
        else if (route.name === 'resource') {
            return (
                <ResourceScreen resourceId={route.resourceId} navigator={navigationOperations}/>
            );
        }
        else if (route.name === 'message') {
            return (
                <MessageScreen messageId={route.messageId} navigator={navigationOperations}/>
            );
        }
        else if (route.name === 'edit_message') {
            return (
                <MessageEditor navigator={navigationOperations}/>
            );
        }
    },
    render: function () {
        var initialRoute = {name: 'login'};
        return (
            <Navigator
                configureScene={(route) => Navigator.SceneConfigs.FadeAndroid}
                initialRoute={initialRoute}
                renderScene={this.RouteMapper}
            />
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    }
});

AppRegistry.registerComponent('RNApp', () => RNApp);
