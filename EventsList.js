'use strict';

var React = require('react-native');

var {
    ListView,
    StyleSheet,
    PullToRefreshViewAndroid,
    Image,
    Text,
    View,
    TouchableNativeFeedback,
    } = React;

var Constants = require('./Constants');

var EventsList = React.createClass({
    getInitialState() {
        var dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });
        return {
            isRefreshing: false,
            loaded: 0,
            dataSource: dataSource,
            isLoadingMore: false,
            hasMore: false
        };
    },
    componentDidMount: function () {
        this.fetchEvents();
    },
    fetchEvents: function () {
        if (this.state.isRefreshing) {
            return;
        }
        this.setState({isRefreshing: true});
        var self = this;
        fetch(Constants.URL_EVENTS, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: 10
            }),
            credentials: 'same-origin'
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
            if (json.error == 0) {
                self.setState({
                    isRefreshing: false,
                    loaded: json.events.length,
                    dataSource: self.state.dataSource.cloneWithRows(json.events),
                    hasMore: json.hasMore
                });
            } else {
                ToastAndroid.show(json.message, ToastAndroid.SHORT);
            }
        }).catch(function (e) {
            ToastAndroid.show(e.message, ToastAndroid.SHORT);
        });
    },
    fetchMoreEvents: function () {
        if (this.state.isRefreshing || this.state.isLoadingMore || !this.state.hasMore) {
            return;
        }
        this.setState({isLoadingMore: true});
        var self = this;
        fetch(Constants.URL_MORE_EVENTS, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type: 10,
                count: this.state.loaded
            }),
            credentials: 'same-origin'
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
            if (json.error == 0) {
                self.setState({
                    isLoadingMore: false,
                    loaded: json.events.length,
                    dataSource: self.state.dataSource.cloneWithRows(json.events),
                    hasMore: json.hasMore
                });
            } else {
                ToastAndroid.show(json.message, ToastAndroid.SHORT);
            }
        }).catch(function (e) {
            ToastAndroid.show(e.message, ToastAndroid.SHORT);
        });
    },
    renderRow: function (event) {
        return (
            <TouchableNativeFeedback
                onPress={()=>this.selectEvent(event)}
                background={TouchableNativeFeedback.Ripple()}>
                <View style={styles.row}>
                    <Image
                        style={styles.avatar}
                        source={{uri:'http://114.212.113.228/avatar/'+event.userId}}/>
                    <View style={styles.column}>
                        <View style={styles.extra}>
                            <Text
                                style={styles.author}>
                                {(event.username)}
                            </Text>
                            <Text
                                style={styles.date}>
                                {(event.date)}
                            </Text>
                        </View>
                        <Text
                            style={styles.content}>
                            {(event.content).replace(/<\/?[^>]+>/g, '').replace(/&nbsp;/g, ' ')}
                        </Text>
                    </View>
                </View>
            </TouchableNativeFeedback>
        );
    },
    selectEvent: function (event) {
        this.props.navigator.push({
            name: 'event',
            event: event
        });
    },
    render() {
        return (
            <PullToRefreshViewAndroid
                style={styles.layout}
                refreshing={this.state.isRefreshing}
                onRefresh={this._onRefresh}
                colors={['#3F51B5', '#FF4081']}>
                <ListView
                    style={styles.list}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    onEndReached={this.fetchMoreEvents}
                    onEndReachedThreshold={160}/>
            </PullToRefreshViewAndroid>
        );
    },

    _onRefresh() {
        this.fetchEvents();
    }
});

var styles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 12,
        marginLeft: 8,
        marginRight: 8,
        marginVertical: 5,
        borderColor: '#dddddd',
        borderStyle: null,
        borderWidth: 0.5,
        borderRadius: 2
    },
    avatar: {
        height: 48,
        width: 48,
        marginRight: 16,
        borderRadius: 4
    },
    column: {
        flex: 1,
        flexDirection: 'column'
    },
    extra: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    author: {
        fontSize: 17,
        color: '#222'
    },
    date: {
        fontSize: 15,
        marginLeft: 12
    },
    content: {
        fontSize: 16,
        marginTop: 4
    },
    layout: {
        flex: 1
    },
    list: {
        backgroundColor: '#DADADA'
    }
});

module.exports = EventsList;
