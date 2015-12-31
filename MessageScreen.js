var React = require('react-native');

var {
    StyleSheet,
    ToolbarAndroid,
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
        this.fetchMessage(this.props.messageId);
    },
    fetchMessage: function (messageId) {
        var self = this;
        fetch(Constants.URL_MESSAGE + messageId, {
            credentials: 'same-origin'
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
            console.log(json);
            if (json.error == 0) {
                self.setState({
                    message: json.message
                });
            } else {
                ToastAndroid.show(json.message, ToastAndroid.SHORT);
            }
        }).catch(function (e) {
            ToastAndroid.show(e.message, ToastAndroid.SHORT);
        });
    },
    render: function () {
        if (!this.state.message) {
            return (
                <View style={styles.container}>
                    <ToolbarAndroid
                        navIcon={require('image!ic_back_white')}
                        title='私信'
                        titleColor="white"
                        style={styles.toolbar}
                        onIconClicked={() => this.props.navigator.pop()}/>
                    <View style={styles.progressView}>
                        <ProgressBarAndroid styleAttr="Large"/>
                    </View>
                </View>
            );
        }
        var message = this.state.message;
        return (
            <View style={styles.container}>
                <ToolbarAndroid
                    navIcon={require('image!ic_back_white')}
                    title='私信'
                    titleColor="white"
                    style={styles.toolbar}
                    onIconClicked={() => this.props.navigator.pop()}/>
                <View style={styles.from}>
                    <View style={styles.header}>
                        <Image
                            style={styles.avatar}
                            source={{uri:'http://114.212.113.228/avatar/'+message.fromId}}/>
                        <View style={styles.headerText}>
                            <Text
                                style={styles.title}>
                                {message.title}
                            </Text>
                            <View style={styles.extra}>
                                <Text
                                    style={styles.user}>
                                    {message.from}
                                </Text>
                                <Text
                                    style={styles.date}>
                                    {message.createAt}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <Text
                        style={styles.content}>
                        {message.content || '无内容'}
                    </Text>
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
    progressView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    from: {
        margin: 8,
        padding: 12,
        backgroundColor: 'white'
    },
    header: {
        flexDirection: 'row',
        borderBottomColor: '#CCC',
        borderBottomWidth: 1,
        alignItems: 'center',
        paddingBottom: 12
    },
    avatar: {
        height: 48,
        width: 48,
        marginRight: 12,
        borderRadius: 24
    },
    headerText: {
        flex: 1,
        flexDirection: 'column'
    },
    title: {
        fontSize: 20,
        color: '#3f51b5'
    },
    extra: {
        flexDirection: 'row',
        marginTop: 6
    },
    user: {
        flex: 1,
        fontSize: 15,
        color: '#555'
    },
    date: {
        color: '#99A'
    },
    content: {
        marginTop: 12,
        marginBottom: 8,
        fontSize: 16
    }
});

module.exports = MessageScreen;