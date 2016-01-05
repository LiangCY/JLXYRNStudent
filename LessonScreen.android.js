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
    } = React;

var Constants = require('./Constants');
var MessagesList = require('./MessagesList');

var LessonScreen = React.createClass({
    getInitialState() {
        return {
            lesson: null
        };
    },
    componentDidMount: function () {
        this.fetchLesson(this.props.lessonId);
    },
    fetchLesson: function (lessonId) {
        var self = this;
        fetch(Constants.URL_LESSON + lessonId, {
            credentials: 'same-origin'
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
                <View key={teacher._id} style={styles.teacherItem}>
                    <Image style={styles.avatar}
                           source={{uri:Constants.URL_PREFIX+'/avatar/'+teacher._id}}/>
                    <Text style={styles.teacherName}>{teacher.name}</Text>
                </View>
            );
        });
        var plans = lesson.plan.map(function (item) {
            switch (item.day) {
                case 1:
                    var day = '周一';
                    break;
                case 2:
                    day = '周二';
                    break;
                case 3:
                    day = '周三';
                    break;
                case 4:
                    day = '周四';
                    break;
                case 5:
                    day = '周五';
                    break;
                case 6:
                    day = '周六';
                    break;
                case 7:
                    day = '周日';
                    break;
            }
            var period = item.start + ' - ' + (item.start + item.period) + '节';
            return (
                <View key={item._id} style={styles.planRow}>
                    <Text style={styles.time}>{day + ' ' + period}</Text>
                    <Text style={styles.classroom}>{item.classroom}</Text>
                </View>
            );
        });
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
        flexDirection: 'column'
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
    }
});

module.exports = LessonScreen;