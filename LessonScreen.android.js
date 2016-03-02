'use strict';

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
    AsyncStorage,
    } = React;

var Constants = require('./Constants');
var MessagesList = require('./MessagesList');

var LessonScreen = React.createClass({
    getInitialState() {
        return {
            token: '',
            lesson: null
        };
    },
    componentDidMount: async function () {
        await this.getToken();
        this.fetchLesson(this.props.lessonId);
    },
    async getToken() {
        var token = await AsyncStorage.getItem(Constants.STORAGE_KEY_TOKEN);
        if (!token) {
            this.props.navigator.immediatelyResetRouteStack([{name: 'login'}]);
        } else {
            this.setState({token: token});
        }
    },
    fetchLesson: function (lessonId) {
        var self = this;
        fetch(Constants.URL_LESSON + lessonId, {
            headers: {
                'x-access-token': this.state.token
            }
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
            if (json.error == 0) {
                self.setState({
                    lesson: json.lesson
                });
            } else {
                ToastAndroid.show(json.message, ToastAndroid.SHORT);
            }
        }).catch(function (e) {
            ToastAndroid.show(e.message, ToastAndroid.SHORT);
        });
    },
    selectTeacher: function (teacher) {
        this.props.navigator.push({
            name: 'teacher',
            teacherId: teacher._id
        });
    },
    render: function () {
        var toolbar = (
            <ToolbarAndroid
                navIcon={require('image!ic_back_white')}
                title='课程'
                titleColor="white"
                style={styles.toolbar}
                onIconClicked={() => this.props.navigator.pop()}/>
        );
        if (!this.state.lesson) {
            return (
                <View style={styles.container}>
                    {toolbar}
                    <View style={styles.progressView}>
                        <ProgressBarAndroid styleAttr="Large"/>
                    </View>
                </View>
            );
        }
        var lesson = this.state.lesson;
        var teachers = lesson.teachers.map(function (teacher) {
            return (
                <TouchableNativeFeedback
                    key={teacher._id}
                    onPress={()=>this.selectTeacher(teacher)}
                    background={TouchableNativeFeedback.SelectableBackground()}>
                    <View style={styles.teacherItem}>
                        <Image style={styles.avatar}
                               source={{uri:Constants.URL_PREFIX+'/avatar/'+teacher._id}}/>
                        <Text style={styles.teacherName}>{teacher.name}</Text>
                    </View>
                </TouchableNativeFeedback>
            );
        }.bind(this));
        lesson.plan.sort(function (a, b) {
            return a.day - b.day;
        });
        var days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
        var plans = lesson.plan.map(function (item) {
            var day = days[item.day - 1];
            var period = item.start + ' - ' + (item.start + item.period - 1) + '节';
            return (
                <View key={item._id} style={styles.planRow}>
                    <Text style={styles.time}>{day + ' ' + period}</Text>
                    <Text style={styles.classroom}>{item.classroom}</Text>
                </View>
            );
        });
        var score = lesson.score;
        var exam = score.exam;
        if (!exam) {
            var examStyle = styles.scoreContent;
        } else if (exam >= 60) {
            examStyle = styles.scoreContentPass;
        } else {
            examStyle = styles.scoreContentNotPass;
        }
        var midterm = score.midterm;
        if (!midterm) {
            var midtermStyle = styles.scoreContent;
        } else if (midterm >= 60) {
            midtermStyle = styles.scoreContentPass;
        } else {
            midtermStyle = styles.scoreContentNotPass;
        }
        var final = score.final;
        if (!final) {
            var finalStyle = styles.scoreContent;
        } else if (final >= 60) {
            finalStyle = styles.scoreContentPass;
        } else {
            finalStyle = styles.scoreContentNotPass;
        }
        var scores = (
            <View style={styles.scoreView}>
                <View key={'exam'} style={styles.scoreRow}>
                    <Text style={styles.scoreTitle}>{'测验成绩'}</Text>
                    <Text style={examStyle}>{lesson.score.exam || '未发布'}</Text>
                </View>
                <View key={'midterm'} style={styles.scoreRow}>
                    <Text style={styles.scoreTitle}>{'期中成绩'}</Text>
                    <Text style={midtermStyle}>{lesson.score.midterm || '未发布'}</Text>
                </View>
                <View key={'final'} style={styles.scoreRow}>
                    <Text style={styles.scoreTitle}>{'期末成绩'}</Text>
                    <Text style={finalStyle}>{lesson.score.final || '未发布'}</Text>
                </View>
            </View>
        );
        return (
            <View style={styles.container}>
                {toolbar}
                <ScrollView style={styles.scroll}>
                    <View style={styles.lessonView}>
                        <View style={styles.header}>
                            <Text
                                style={styles.title}>
                                {lesson.courseName}
                            </Text>
                            <Text
                                style={styles.subTitle}>
                                {lesson.term + ' - ' + (lesson.term + 1) + ' 第' + lesson.half + '学期'}
                            </Text>
                        </View>
                        <Text
                            style={styles.sectionTitle}>
                            {'任课教师'}
                        </Text>
                        <View style={styles.teacherRow}>
                            {teachers}
                        </View>
                        <Text
                            style={styles.sectionTitle}>
                            {'上课安排'}
                        </Text>
                        <View style={styles.planView}>
                            {plans}
                        </View>
                        <Text
                            style={styles.sectionTitle}>
                            {'课程成绩'}
                        </Text>
                        {scores}
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
    lessonView: {
        flex: 1,
        padding: 16
    },
    header: {
        flexDirection: 'column',
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#CCC'
    },
    title: {
        fontSize: 20,
        color: '#333'
    },
    subTitle: {
        marginTop: 4,
        fontSize: 15
    },
    sectionTitle: {
        marginTop: 16,
        fontSize: 17,
        color: '#333',
        marginBottom: 12
    },
    teacherRow: {
        flexDirection: 'row',
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#CCC'
    },
    teacherItem: {
        flexDirection: 'column',
        alignItems: 'center',
        marginRight: 16
    },
    avatar: {
        height: 48,
        width: 48,
        borderRadius: 24
    },
    teacherName: {
        marginTop: 6
    },
    planView: {
        flexDirection: 'column',
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#CCC'
    },
    planRow: {
        flexDirection: 'row',
        marginBottom: 4
    },
    time: {
        marginRight: 24,
        fontSize: 16
    },
    classroom: {
        flex: 1,
        fontSize: 16
    },
    scoreView: {
        flexDirection: 'column',
        marginBottom: 12
    },
    scoreRow: {
        flexDirection: 'row',
        marginBottom: 4
    },
    scoreTitle: {
        marginRight: 24,
        fontSize: 16
    },
    scoreContent: {
        flex: 1,
        fontSize: 16,
        color: '#AAA'
    },
    scoreContentPass: {
        flex: 1,
        fontSize: 16,
        color: '#22CD36'
    },
    scoreContentNotPass: {
        flex: 1,
        fontSize: 16,
        color: 'red'
    }
});

module.exports = LessonScreen;