'use strict';

var React = require('react-native');
var {
    Image,
    StyleSheet,
    Text,
    View,
    AsyncStorage,
    } = React;

var Constants = require('./Constants');

var UserScreen = React.createClass({
    getInitialState: function () {
        return {
            token: '',
            user: null
        };
    },
    componentDidMount: async function () {
        await this.getToken();
        this.fetchUser();
    },
    async getToken() {
        var token = await AsyncStorage.getItem(Constants.STORAGE_KEY_TOKEN);
        if (!token) {
            this.props.navigator.immediatelyResetRouteStack([{name: 'login'}]);
        } else {
            this.setState({token: token});
        }
    },
    fetchUser: function () {
        var self = this;
        fetch(Constants.URL_USER, {
            headers: {
                'x-access-token': this.state.token
            }
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
            if (json.error == 0) {
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
                        source={{uri:Constants.URL_PREFIX+'/avatar/' +this.state.user.id}}
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
                        {'年级：' + this.state.user.year + '级'}
                    </Text>
                    <Text style={styles.item}>
                        {'院系：' + this.state.user.school}
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
