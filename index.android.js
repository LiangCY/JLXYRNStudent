'use strict';

var React = require('react-native');
var {
    AppRegistry,
    StyleSheet,
    Image,
    Navigator,
    BackAndroid,
    } = React;

var TimerMixin = require('react-timer-mixin');

var LoginScreen = require('./LoginScreen');
var MainScreen = require('./MainScreen');
var UserScreen = require('./UserScreen');
var EventScreen = require('./EventScreen');
var LessonScreen = require('./LessonScreen');
var TeacherScreen = require('./TeacherScreen');
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
    mixins: [TimerMixin],
    getInitialState: function () {
        return {
            splashed: false
        };
    },
    componentDidMount: function () {
        this.setTimeout(() => {
            this.setState({splashed: true});
        }, 2000);
    },
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
                <EventScreen event={route.event} navigator={navigationOperations}/>
            );
        }
        else if (route.name === 'lesson') {
            return (
                <LessonScreen lessonId={route.lessonId} navigator={navigationOperations}/>
            );
        }
        else if (route.name === 'teacher') {
            return (
                <TeacherScreen teacherId={route.teacherId} navigator={navigationOperations}/>
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
        if (this.state.splashed) {
            var initialRoute = {name: 'login'};
            return (
                <Navigator
                    configureScene={(route) => Navigator.SceneConfigs.FadeAndroid}
                    initialRoute={initialRoute}
                    renderScene={this.RouteMapper}
                />
            );
        } else {
            return (
                <Image
                    style={styles.cover}
                    source={require('image!splash')}/>
            );
        }
    }
});

var styles = StyleSheet.create({
    cover: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: Image.resizeMode.cover
    }
});

AppRegistry.registerComponent('RNApp', () => RNApp);
