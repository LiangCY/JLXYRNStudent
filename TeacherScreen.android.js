var React = require('react-native');

var {
    StyleSheet,
    ToolbarAndroid,
    Text,
    Image,
    View,
    ProgressBarAndroid,
    ScrollView,
    ToastAndroid,
    TouchableNativeFeedback,
    } = React;

var Constants = require('./Constants');
var MessagesList = require('./MessagesList');

var TeacherScreen = React.createClass({
    getInitialState() {
        return {
            teacher: null,
            isLoading: false
        };
    },
    componentDidMount: function () {
        this.fetchTeacher(this.props.teacherId);
    },
    fetchTeacher: function (teacherId) {
        var self = this;
        fetch(Constants.URL_TEACHER + teacherId, {
            credentials: 'same-origin'
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
            if (json.error == 0) {
                self.setState({
                    teacher: json.teacher
                });
            } else {
                ToastAndroid.show(json.message, ToastAndroid.SHORT);
            }
        }).catch(function (e) {
            ToastAndroid.show(e.message, ToastAndroid.SHORT);
        });
    },
    followTeacher: function () {
        var teacher = this.state.teacher;
        this.setState({
            isLoading: true
        });
        var self = this;
        if (teacher.isFollowing) {
            fetch(Constants.URL_FOLLOW + '?action=cancel&teacherId=' + teacher._id, {
                credentials: 'same-origin'
            }).then(function (response) {
                return response.json()
            }).then(function (json) {
                if (json.error == 0) {
                    ToastAndroid.show('已取消关注', ToastAndroid.SHORT);
                    teacher.isFollowing = false;
                    self.setState({
                        teacher: teacher,
                        isLoading: false
                    })
                } else {
                    self.setState({
                        isLoading: false
                    });
                    ToastAndroid.show(json.message, ToastAndroid.SHORT);
                }
            }).catch(function (e) {
                self.setState({
                    isLoading: false
                });
                ToastAndroid.show(e.message, ToastAndroid.SHORT);
            });
        } else {
            fetch(Constants.URL_FOLLOW + '?action=follow&teacherId=' + teacher._id, {
                credentials: 'same-origin'
            }).then(function (response) {
                return response.json()
            }).then(function (json) {
                if (json.error == 0) {
                    ToastAndroid.show('已关注' + teacher.name, ToastAndroid.SHORT);
                    teacher.isFollowing = true;
                    self.setState({
                        teacher: teacher,
                        isLoading: false
                    })
                } else {
                    self.setState({
                        isLoading: false
                    });
                    ToastAndroid.show(json.message, ToastAndroid.SHORT);
                }
            }).catch(function (e) {
                self.setState({
                    isLoading: false
                });
                ToastAndroid.show(e.message, ToastAndroid.SHORT);
            });
        }
    },
    render: function () {
        var toolbar = (
            <ToolbarAndroid
                navIcon={require('image!ic_back_white')}
                title='教师'
                titleColor="white"
                style={styles.toolbar}
                onIconClicked={() => this.props.navigator.pop()}/>
        );
        if (!this.state.teacher) {
            return (
                <View style={styles.container}>
                    {toolbar}
                    <View style={styles.progressView}>
                        <ProgressBarAndroid styleAttr="Large"/>
                    </View>
                </View>
            );
        }
        var teacher = this.state.teacher;
        if (teacher.isFollowing) {
            var button = (
                <TouchableNativeFeedback
                    onPress={this.followTeacher}
                    background={TouchableNativeFeedback.SelectableBackground()}>
                    <View style={styles.buttonCancel}>
                        <Text style={styles.buttonTextCancel}>
                            {'取消关注'}
                        </Text>
                    </View>
                </TouchableNativeFeedback>
            );
        } else {
            button = (
                <TouchableNativeFeedback
                    onPress={this.followTeacher}
                    background={TouchableNativeFeedback.SelectableBackground()}>
                    <View style={styles.buttonFollow}>
                        <Text style={styles.buttonTextFollow}>
                            {'关注'}
                        </Text>
                    </View>
                </TouchableNativeFeedback>
            );
        }
        return (
            <View style={styles.container}>
                {toolbar}
                <ScrollView style={styles.scroll}>
                    <View style={styles.teacherView}>
                        <View style={styles.header}>
                            <Image style={styles.avatar}
                                   source={{uri:Constants.URL_PREFIX+'/avatar/'+teacher._id}}/>
                            <View style={styles.headerContent}>
                                <Text
                                    style={styles.title}>
                                    {teacher.name}
                                </Text>
                                <Text
                                    style={styles.subTitle}>
                                    {teacher._id}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.rowTitle}>{'院系'}</Text>
                            <Text style={styles.rowContent}>{teacher.school}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.rowTitle}>{'课程'}</Text>
                            <Text style={styles.rowContent}>{teacher.lessons.join('、')}</Text>
                        </View>
                        {button}
                    </View>
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
    teacherView: {
        flex: 1,
        padding: 16
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#CCC'
    },
    avatar: {
        height: 64,
        width: 64,
        borderRadius: 32
    },
    headerContent: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 16
    },
    title: {
        fontSize: 20,
        color: '#333'
    },
    subTitle: {
        marginTop: 4,
        fontSize: 15
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#CCC'
    },
    rowTitle: {
        fontSize: 16,
        color: '#333'
    },
    rowContent: {
        marginLeft: 34,
        fontSize: 16
    },
    buttonFollow: {
        marginTop: 24,
        backgroundColor: '#3f51b5',
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 24
    },
    buttonCancel: {
        marginTop: 24,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 24
    },
    buttonTextFollow: {
        color: 'white',
        fontSize: 18
    },
    buttonTextCancel: {
        color: '#3f51b5',
        fontSize: 18
    }
});

module.exports = TeacherScreen;