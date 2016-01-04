var React = require('react-native');

var {
    StyleSheet,
    ToolbarAndroid,
    Text,
    View,
    ProgressBarAndroid,
    ScrollView,
    ToastAndroid,
    TouchableNativeFeedback,
    IntentAndroid,
    } = React;

var Constants = require('./Constants');
var MessagesList = require('./MessagesList');

var ResourceScreen = React.createClass({
    getInitialState() {
        return {
            resource: null
        };
    },
    componentDidMount: function () {
        this.fetchResource(this.props.resourceId);
    },
    fetchResource: function (resourceId) {
        var self = this;
        fetch(Constants.URL_RESOURCE + resourceId, {
            credentials: 'same-origin'
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
            if (json.error == 0) {
                self.setState({
                    resource: json.resource
                });
            } else {
                ToastAndroid.show(json.message, ToastAndroid.SHORT);
            }
        }).catch(function (e) {
            ToastAndroid.show(e.message, ToastAndroid.SHORT);
        });
    },
    downloadFile: function () {
        var url = 'http://114.212.113.228' + this.state.resource.attachmentUrl;
        IntentAndroid.openURL(url);
    },
    render: function () {
        var toolbar = (
            <ToolbarAndroid
                navIcon={require('image!ic_back_white')}
                title='资源'
                titleColor="white"
                style={styles.toolbar}
                onIconClicked={() => this.props.navigator.pop()}/>
        );
        if (!this.state.resource) {
            return (
                <View style={styles.container}>
                    {toolbar}
                    <View style={styles.progressView}>
                        <ProgressBarAndroid styleAttr="Large"/>
                    </View>
                </View>
            );
        }
        var resource = this.state.resource;
        return (
            <View style={styles.container}>
                {toolbar}
                <ScrollView style={styles.scroll}>
                    <View style={styles.resourceView}>
                        <View style={styles.header}>
                            <Text
                                style={styles.title}>
                                {resource.title}
                            </Text>
                            <View style={styles.extra}>
                                <Text
                                    style={styles.lesson}>
                                    {resource.lesson}
                                </Text>
                                <Text
                                    style={styles.date}>
                                    {resource.createAt}
                                </Text>
                            </View>
                        </View>
                        <Text
                            style={styles.description}>
                            {'资源描述'}
                        </Text>
                        <Text
                            style={styles.content}>
                            {resource.description || '无内容'}
                        </Text>
                    </View>
                    <TouchableNativeFeedback
                        onPress={this.downloadFile}
                        background={TouchableNativeFeedback.SelectableBackground()}>
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>下载资源</Text>
                        </View>
                    </TouchableNativeFeedback>
                </ScrollView>
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
    scroll: {
        flex: 1,
        backgroundColor: '#F4F4F4'
    },
    resourceView: {
        flex: 1,
        padding: 16
    },
    avatar: {
        height: 48,
        width: 48,
        marginRight: 12,
        borderRadius: 24
    },
    header: {
        flexDirection: 'column',
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#CCC'
    },
    title: {
        fontSize: 20,
        color: '#202F8F'
    },
    extra: {
        flexDirection: 'row',
        marginTop: 6,
        alignItems: 'center'
    },
    lesson: {
        flex: 1,
        fontSize: 15,
        color: '#555'
    },
    date: {
        color: '#888'
    },
    description: {
        marginTop: 16,
        fontSize: 17,
        color: '#333',
        marginBottom: 8
    },
    content: {
        fontSize: 16
    },
    button: {
        marginVertical: 16,
        marginHorizontal: 16,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 24
    },
    buttonText: {
        color: '#3f51b5',
        fontSize: 18
    }
});

module.exports = ResourceScreen;