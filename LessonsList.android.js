'use strict';

var React = require('react-native');

var {
    ListView,
    StyleSheet,
    Text,
    View,
    TouchableNativeFeedback,
    AsyncStorage,
    } = React;

var Constants = require('./Constants');

var EventsList = React.createClass({
    getInitialState() {
        var dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });
        return {
            token: '',
            dataSource: dataSource
        };
    },
    componentDidMount: async function () {
        await this.getToken();
        this.fetchLessons();
    },
    async getToken() {
        var token = await AsyncStorage.getItem(Constants.STORAGE_KEY_TOKEN);
        console.log(token);
        if (!token) {
            this.props.navigator.immediatelyResetRouteStack([{name: 'login'}]);
        } else {
            this.setState({token: token});
        }
    },
    fetchLessons: function () {
        var self = this;
        fetch(Constants.URL_LESSONS, {
            headers: {
                'x-access-token': this.state.token
            }
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
            if (json.error == 0) {
                self.setState({
                    dataSource: self.state.dataSource.cloneWithRows(json.lessons)
                });
            } else {
                ToastAndroid.show(json.message, ToastAndroid.SHORT);
            }
        }).catch(function (e) {
            ToastAndroid.show(e.message, ToastAndroid.SHORT);
        });
    },
    selectLesson: function (lesson) {
        this.props.navigator.push({
            name: 'lesson',
            lessonId: lesson.id
        });
    },
    renderRow: function (lesson) {
        return (
            <TouchableNativeFeedback
                onPress={()=>this.selectLesson(lesson)}
                background={TouchableNativeFeedback.SelectableBackground()}>
                <View style={styles.row}>
                    <Text
                        style={styles.lesson}>
                        {(lesson.courseName)}
                    </Text>
                    <Text
                        style={styles.teachers}>
                        {(lesson.teachers)}
                    </Text>
                </View>
            </TouchableNativeFeedback>
        );
    },
    render() {
        return (
            <ListView
                dataSource={this.state.dataSource}
                renderRow={this.renderRow}/>
        );
    }
});

var styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomColor: '#CCC',
        borderBottomWidth: 0.5
    },
    lesson: {
        flex: 1,
        fontSize: 17,
        color: '#222'
    },
    teachers: {
        fontSize: 15,
        marginLeft: 12
    }
});

module.exports = EventsList;
