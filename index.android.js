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
                <View style={styles.container}>
                    <LoginScreen navigator={navigationOperations}/>
                </View>
            );
        }
        else if (route.name === 'main') {
            return (
                <View style={styles.container}>
                    <MainScreen navigator={navigationOperations}/>
                </View>
            );
        }
        else if (route.name === 'user') {
            return (
                <View style={styles.container}>
                    <UserScreen/>
                </View>
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
    },
    title: {
        fontSize: 20,
        marginBottom: 8,
        textAlign: 'center'
    },
    button: {
        backgroundColor: '#0DF',
        height: 36
    },
    buttonText: {}
});

AppRegistry.registerComponent('RNApp', () => RNApp);
