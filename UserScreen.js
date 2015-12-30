'use strict';

var React = require('react-native');
var {
    Image,
    StyleSheet,
    Text,
    View,
    } = React;

var Constants = require('./Constants');

var UserScreen = React.createClass({
    getInitialState: function () {
        return {
            user: null
        };
    },
    componentDidMount: function () {
        this.fetchUser();
    },
    fetchUser: function () {
        var self = this;
        fetch(Constants.URL_USER, {
            credentials: 'same-origin'
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
            if (json.error == 0) {
                console.log(json);
                self.setState({
                    user: json.user
                });
            }
        }).catch(function (e) {

        });
    },
    render: function () {
        if (!this.state.user) {
            return (
                <View style={styles.container}/>
            );
        }
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Image
                        style={styles.avatar}
                        source={{uri:'http://114.212.113.228/avatar/' +this.state.user.id}}
                    />
                    <Text style={styles.name}>
                        {this.state.user.name}
                    </Text>
                </View>
                <View style={styles.content}>
                    <Text style={styles.item}>
                        {'学号：' + this.state.user.id}
                    </Text>
                    <Text style={styles.item}>
                        {'年级：' + this.state.user.year}
                    </Text>
                    <Text style={styles.item}>
                        {'院系：' + this.state.user.school + '级'}
                    </Text>
                    <Text style={styles.item}>
                        {'专业：' + this.state.user.major}
                    </Text>
                </View>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#FAFAFA'
    },
    header: {
        height: 240,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3f51b5'
    },
    avatar: {
        width: 96,
        height: 96,
        borderRadius: 48,
        borderColor: 'white',
        borderWidth: 2
    },
    name: {
        marginTop: 16,
        fontSize: 28,
        color: 'white'
    },
    content: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: 24,
        paddingHorizontal: 16
    },
    item: {
        marginVertical: 8,
        fontSize: 18
    }
});

module.exports = UserScreen;
