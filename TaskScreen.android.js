var React = require('react-native');

var {
    StyleSheet,
    ToolbarAndroid,
    Text,
    View,
    ProgressBarAndroid,
    ScrollView,
    ToastAndroid,
    IntentAndroid,
    } = React;

var HTMLView = require('react-native-htmlview');

var Constants = require('./Constants');
var MessagesList = require('./MessagesList');

var TaskScreen = React.createClass({
    getInitialState() {
        return {
            task: null
        };
    },
    componentDidMount: function () {
        this.fetchTask(this.props.taskId);
    },
    fetchTask: function (taskId) {
        var self = this;
        fetch(Constants.URL_TASK + taskId, {
            credentials: 'same-origin'
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
            if (json.error == 0) {
                self.setState({
                    task: json.task
                });
            } else {
                ToastAndroid.show(json.message, ToastAndroid.SHORT);
            }
        }).catch(function (e) {
            ToastAndroid.show(e.message, ToastAndroid.SHORT);
        });
    },
    render: function () {
        var toolbar = (
            <ToolbarAndroid
                navIcon={require('image!ic_back_white')}
                title='作业'
                titleColor="white"
                style={styles.toolbar}
                onIconClicked={() => this.props.navigator.pop()}/>
        );
        if (!this.state.task) {
            return (
                <View style={styles.container}>
                    {toolbar}
                    <View style={styles.progressView}>
                        <ProgressBarAndroid styleAttr="Large"/>
                    </View>
                </View>
            );
        }
        var task = this.state.task;
        if (task.homework) {
            var homework = task.homework;
            if (homework.status == 0) {
                var status = '未提交';
                var statusStyle = styles.statusNotSubmit
            } else if (homework.status == 1) {
                status = '未批改';
                statusStyle = styles.statusNotGrade
            } else if (homework.status == 2) {
                status = homework.grade + (homework.remark ? ' (' + homework.remark + ')' : '');
                statusStyle = parseInt(status) >= 60 ? styles.statusPass : styles.statusNotPass;
            } else if (homework.status == 3) {
                status = '已申请重交';
                statusStyle = styles.statusAskForRedo
            } else if (homework.status == 4) {
                status = '可重交';
                statusStyle = styles.statusRedo
            }
            var homeworkView = (
                <View style={styles.homeworkView}>
                    <View style={styles.homeworkContent}>
                        <Text style={styles.contentTitle}>{homework.title}</Text>
                        <HTMLView
                            style={styles.html}
                            onLinkPress={(url) => IntentAndroid.openURL(url)}
                            value={homework.content||'无内容'}/>
                    </View>
                    <Text style={statusStyle}>{status}</Text>
                </View>
            );
        } else {
            homeworkView = (
                <View style={styles.homeworkView}>
                    <Text style={styles.statusNotSubmit}>{'未提交'}</Text>
                </View>
            );
        }
        return (
            <View style={styles.container}>
                {toolbar}
                <ScrollView style={styles.scroll}>
                    <Text
                        style={styles.sectionTitle}>
                        {'作业要求'}
                    </Text>
                    <View style={styles.taskView}>
                        <View style={styles.header}>
                            <Text
                                style={styles.title}>
                                {task.taskTitle}
                            </Text>
                            <View style={styles.extra}>
                                <Text
                                    style={styles.lesson}>
                                    {task.lesson}
                                </Text>
                                <Text
                                    style={styles.date}>
                                    {task.deadline + '截止'}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.content}>
                            <Text
                                style={styles.contentTitle}>
                                {'具体要求'}
                            </Text>
                            <HTMLView
                                style={styles.html}
                                onLinkPress={(url) => IntentAndroid.openURL(url)}
                                value={task.taskContent||'无具体要求'}/>
                        </View>
                    </View>
                    <Text
                        style={styles.sectionTitle}>
                        {'我的作业'}
                    </Text>
                    {homeworkView}
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
        backgroundColor: '#E8E8E8',
        padding: 12
    },
    sectionTitle: {
        marginTop: 8,
        marginHorizontal: 8,
        fontSize: 16
    },
    taskView: {
        flex: 1,
        marginTop: 12,
        marginBottom: 8,
        padding: 16,
        backgroundColor: 'white'
    },
    header: {
        flexDirection: 'column',
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#CCC'
    },
    title: {
        fontSize: 18,
        color: 'black'
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
    content: {
        marginTop: 16,
        paddingBottom: 12
    },
    contentTitle: {
        fontSize: 17,
        color: '#555',
        marginBottom: 8
    },
    homeworkView: {
        flex: 1,
        marginTop: 12,
        padding: 16,
        backgroundColor: 'white',
        marginBottom: 24
    },
    homeworkContent: {
        flexDirection: 'column',
        paddingBottom: 12,
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#CCC'
    },
    statusNotSubmit: {
        color: '#3f51b5',
        fontSize: 16
    },
    statusNotGrade: {
        color: '#888',
        fontSize: 16
    },
    statusPass: {
        color: '#4EAC39',
        fontSize: 18
    },
    statusNotPass: {
        color: '#C14C44',
        fontSize: 18
    },
    statusAskForRedo: {
        color: '#FF8C1A',
        fontSize: 16
    },
    statusRedo: {
        color: '#3939AC',
        fontSize: 16
    },
    html: {}
});

module.exports = TaskScreen;