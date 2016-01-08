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

var TasksList = React.createClass({
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
        this.fetchTasks();
    },
    fetchTasks: function () {
        if (this.state.isRefreshing) {
            return;
        }
        this.setState({isRefreshing: true});
        var self = this;
        fetch(Constants.URL_TASKS, {
            credentials: 'same-origin'
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
            if (json.error == 0) {
                self.setState({
                    isRefreshing: false,
                    dataSource: self.state.dataSource.cloneWithRows(json.tasks)
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
    renderRow: function (task) {
        if (task.status == -1 || task.status == 0) {
            var status = '未提交';
            var statusStyle = styles.statusNotSubmit
        } else if (task.status == 1) {
            status = '未批改';
            statusStyle = styles.statusNotGrade
        } else if (task.status == 2) {
            status = task.grade;
            statusStyle = parseInt(status) >= 60 ? styles.statusPass : styles.statusNotPass;
        } else if (task.status == 3) {
            status = '已申请重交';
            statusStyle = styles.statusAskForRedo
        } else if (task.status == 4) {
            status = '可重交';
            statusStyle = styles.statusRedo
        }
        return (
            <TouchableNativeFeedback
                onPress={()=>this.selectTask(task)}
                background={TouchableNativeFeedback.SelectableBackground()}>
                <View style={styles.row}>
                    <View style={styles.column}>
                        <Text
                            style={styles.title}>
                            {task.taskTitle}
                        </Text>
                        <Text
                            style={styles.lesson}>
                            {task.lesson}
                        </Text>
                        <Text
                            style={styles.deadline}>
                            {task.deadline ? task.deadline + '截止' : ''}
                        </Text>
                    </View>
                    <Text style={statusStyle}>
                        {status}
                    </Text>
                </View>
            </TouchableNativeFeedback>
        );
    },
    selectTask: function (task) {
        this.props.navigator.push({
            name: 'task',
            taskId: task.taskId
        });
    },
    render() {
        return (
            <PullToRefreshViewAndroid
                style={styles.layout}
                refreshing={this.state.isRefreshing}
                onRefresh={this.fetchTasks}
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
        alignItems: 'center',
        backgroundColor: 'white',
        paddingVertical: 10,
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
    },
    deadline: {
        marginTop: 2,
        fontSize: 15
    },
    statusNotSubmit: {
        color: '#3f51b5',
        fontSize: 17
    },
    statusNotGrade: {
        color: '#888',
        fontSize: 17
    },
    statusPass: {
        color: '#4EAC39',
        fontSize: 22
    },
    statusNotPass: {
        color: '#C14C44',
        fontSize: 22
    },
    statusAskForRedo: {
        color: '#FF8C1A',
        fontSize: 17
    },
    statusRedo: {
        color: '#3939AC',
        fontSize: 17
    }
});

module.exports = TasksList;
