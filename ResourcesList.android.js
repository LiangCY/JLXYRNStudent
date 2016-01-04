'use strict';

var React = require('react-native');

var {
    ListView,
    StyleSheet,
    PullToRefreshViewAndroid,
    Text,
    View,
    TouchableNativeFeedback,
    ToastAndroid,
    } = React;

var Constants = require('./Constants');

var EventsList = React.createClass({
    getInitialState() {
        var dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });
        return {
            isRefreshing: false,
            dataSource: dataSource
        };
    },
    componentDidMount: function () {
        this.fetchResources();
    },
    fetchResources: function () {
        if (this.state.isRefreshing) {
            return;
        }
        this.setState({isRefreshing: true});
        var self = this;
        fetch(Constants.URL_RESOURCES, {
            credentials: 'same-origin'
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
            if (json.error == 0) {
                self.setState({
                    isRefreshing: false,
                    dataSource: self.state.dataSource.cloneWithRows(json.resources)
                });
            } else {
                self.setState({
                    isRefreshing: false
                });
                ToastAndroid.show(json.message, ToastAndroid.SHORT);
            }
        }).catch(function (e) {
            self.setState({
                isRefreshing: false
            });
            ToastAndroid.show(e.message, ToastAndroid.SHORT);
        });
    },
    renderRow: function (resource) {
        if (resource.status == -1 || resource.status == 0) {
            var status = '未提交';
        } else if (resource.status == 1) {
            status = '未批改';
        } else if (resource.status == 2) {
            status = resource.grade;
        } else if (resource.status == 3) {
            status = '已申请重交';
        } else if (resource.status == 4) {
            status = '可重交';
        }
        return (
            <TouchableNativeFeedback
                onPress={()=>this.selectResource(resource)}
                background={TouchableNativeFeedback.Ripple()}>
                <View style={styles.row}>
                    <View style={styles.column}>
                        <Text
                            style={styles.title}>
                            {resource.title}
                        </Text>
                        <Text
                            style={styles.lesson}>
                            {resource.lesson}
                        </Text>
                    </View>
                </View>
            </TouchableNativeFeedback>
        );
    },
    selectResource: function (resource) {
        this.props.navigator.push({
            name: 'resource',
            resourceId: resource._id
        });
    },
    render() {
        return (
            <PullToRefreshViewAndroid
                style={styles.layout}
                refreshing={this.state.isRefreshing}
                onRefresh={this.fetchResources}
                colors={['#3F51B5', '#FF4081']}>
                <ListView
                    style={styles.list}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}/>
            </PullToRefreshViewAndroid>
        );
    }
});

var styles = StyleSheet.create({
    layout: {
        flex: 1
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomColor: '#BBB',
        borderBottomWidth: 0.5
    },
    column: {
        flex: 1,
        flexDirection: 'column'
    },
    title: {
        fontSize: 17,
        color: '#222'
    },
    lesson: {
        marginTop: 4,
        fontSize: 15
    }
});

module.exports = EventsList;