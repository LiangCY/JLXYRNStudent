'use strict';

var React = require('react-native');
var {
    AsyncStorage,
    StyleSheet,
    View,
    TextInput,
    Text,
    TouchableHighlight,
    NavigatorIOS,
    } = React;

var KEY_USER = '@User';

var Constants = require('./Constants');

var LoginContent = React.createClass({
    getInitialState: function () {
        return {
            username: '',
            password: ''
        };
    },
    componentDidMount() {
        this.loadUserInfo().done();
    },
    async loadUserInfo() {
        try {
            var value = await AsyncStorage.getItem(KEY_USER);
            if (value !== null) {
                var userInfo = value.split(':');
                this.setState({
                    username: userInfo[0] ? userInfo[0] : '',
                    password: userInfo[1] ? userInfo[1] : ''
                });
                this.login();
            }
        } catch (error) {
            this.setState({
                username: '',
                password: ''
            });
        }
    },
    login: function () {
        if (this.state.username == '') {
            return;
        }
        if (this.state.password == '') {
            return;
        }
        var username = this.state.username;
        var password = this.state.password;

        console.log(username);

        var self = this;

        fetch(Constants.URL_LOGIN, {    //网络请求
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            }),
            credentials: 'same-origin'
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
            console.log(json);
            if (json.error == 0) {
                self.props.navigator.replace({name: 'user'});
            } else {

            }
        }).catch(function (e) {

        });
    },
    render: function () {
        return (
            <View style={styles.container}>
                <View style={styles.inputView}>
                    <Text style={styles.label}>学号</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => this.setState({username:text})}
                        value={this.state.username}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.inputView}>
                    <Text style={styles.label}>密码</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(text) => this.setState({password:text})}
                        value={this.state.password}
                        secureTextEntry={true}
                    />
                </View>
                <TouchableHighlight
                    onPress={this.login}>
                    <View style={styles.button}>
                        <Text style={styles.buttonText}>登 录</Text>
                    </View>
                </TouchableHighlight>
            </View>

        );
    }
});

var LoginScreen = React.createClass({
    render: function () {
        return (
            <NavigatorIOS
                style={styles.layout}
                barTintColor='#3f51b5'
                translucent={false}
                titleTextColor='white'
                tintColor="white"
                initialRoute={{
                    component: LoginContent,
                    title: '登录'
                }}
            />
        );
    }
});


var styles = StyleSheet.create({
    layout: {
        flex: 1
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: 48,
        paddingHorizontal: 16
    },
    inputView: {
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4
    },
    label: {
        marginLeft: 8,
        color: '#3f51b5',
        fontSize: 16
    },
    input: {
        flex: 1,
        marginLeft: 12,
        marginRight: 12,
        height: 40,
        fontSize: 16
    },
    button: {
        marginTop: 8,
        backgroundColor: '#3f51b5',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        borderRadius: 4
    },
    buttonText: {
        color: 'white',
        fontSize: 16
    }
});

module.exports = LoginScreen;
