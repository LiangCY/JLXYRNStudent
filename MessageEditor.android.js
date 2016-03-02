'use strict';

var React = require('react-native');

var {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    ToolbarAndroid,
    TextInput,
    ListView,
    TouchableNativeFeedback,
    ToastAndroid,
    AsyncStorage,
    } = React;

var Constants = require('./Constants');

var MessageEditor = React.createClass({
    getInitialState() {
        var teachers = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            token: '',
            teachers: teachers,
            isSelecting: false,
            selectedTeacher: null,
            title: '',
            content: '',
            isAdding: false
        };
    },
    componentDidMount: async function () {
        await this.getToken();
        this.fetchTeachers();
    },
    async getToken() {
        var token = await AsyncStorage.getItem(Constants.STORAGE_KEY_TOKEN);
        if (!token) {
            this.props.navigator.immediatelyResetRouteStack([{name: 'login'}]);
        } else {
            this.setState({token: token});
        }
    },
    fetchTeachers: function () {
        var self = this;
        fetch(Constants.URL_TEACHERS, {
            headers: {
                'x-access-token': this.state.token
            }
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
            if (json.error == 0) {
                self.setState({
                    teachers: self.state.teachers.cloneWithRows(json.teachers)
                });
            } else {
                ToastAndroid.show(json.message, ToastAndroid.SHORT);
            }
        }).catch(function (e) {
            ToastAndroid.show(e.message, ToastAndroid.SHORT);
        });
    },
    onActionSelected: function (position) {
        if (position == 0) {
            if (this.state.isAdding) {
                return;
            }
            this.setState({
                isAdding: true
            });
            var self = this;
            fetch(Constants.URL_MESSAGE_ADD, {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'x-access-token': this.state.token
                },
                body: JSON.stringify({
                    toId: this.state.selectedTeacher._id,
                    toName: this.state.selectedTeacher.name,
                    title: this.state.title,
                    content: this.state.content
                })
            }).then(function (response) {
                return response.json()
            }).then(function (json) {
                self.setState({
                    isAdding: false
                });
                if (json.error == 0) {
                    ToastAndroid.show('私信已发送', ToastAndroid.SHORT);
                    self.props.navigator.pop();
                } else {
                    ToastAndroid.show(json.message, ToastAndroid.SHORT);
                }
            }).catch(function (e) {
                self.setState({
                    isAdding: false
                });
                ToastAndroid.show(e.message, ToastAndroid.SHORT);
            });

        }
    },
    selectTeacher: function (teacher) {
        this.setState({
            isSelecting: false,
            selectedTeacher: teacher
        });
    },
    renderRow: function (teacher) {
        return (
            <TouchableNativeFeedback
                onPress={()=>{this.selectTeacher(teacher)}}>
                <View style={styles.teacherRow}>
                    <Image
                        style={styles.avatar}
                        source={{uri:Constants.URL_PREFIX+'/avatar/'+teacher._id}}/>
                    <Text style={styles.teacherText}>
                        {teacher.name + '(' + teacher._id + ')'}
                    </Text>
                </View>
            </TouchableNativeFeedback>
        );
    },
    render() {
        if (this.state.isSelecting || !this.state.selectedTeacher || !this.state.title) {
            var toolbar = (
                <ToolbarAndroid
                    navIcon={require('image!ic_back_white')}
                    title='添加私信'
                    titleColor="white"
                    style={styles.toolbar}
                    onIconClicked={() => this.props.navigator.pop()}/>
            );
        } else {
            var toolbarActions = [
                {title: '发送', icon: require('image!ic_send_white'), show: 'always'}
            ];
            toolbar = (
                <ToolbarAndroid
                    navIcon={require('image!ic_back_white')}
                    title='添加私信'
                    titleColor="white"
                    style={styles.toolbar}
                    onIconClicked={() => this.props.navigator.pop()}
                    actions={toolbarActions}
                    onActionSelected={this.onActionSelected}/>
            );
        }
        if (this.state.isSelecting) {
            return (
                <View style={styles.container}>
                    {toolbar}
                    <ListView
                        dataSource={this.state.teachers}
                        renderRow={this.renderRow}
                    />
                </View>
            );
        }
        return (
            <View style={styles.container}>
                {toolbar}
                <ScrollView style={styles.editor}>
                    <TouchableNativeFeedback
                        background={TouchableNativeFeedback.SelectableBackground()}
                        onPress={()=>{this.setState({isSelecting:true})}}>
                        <View style={styles.selectButton}>
                            <Text style={styles.selectText}>
                                {this.state.selectedTeacher && this.state.selectedTeacher.name || '选择教师'}
                            </Text>
                        </View>
                    </TouchableNativeFeedback>
                    <Text style={styles.label}>标题</Text>
                    <View style={styles.titleView}>
                        <TextInput
                            placeholder="请输入私信标题"
                            style={styles.titleInput}
                            underlineColorAndroid="transparent"
                            onChangeText={(text) => this.setState({title:text})}
                            value={this.state.title}/>
                    </View>
                    <Text style={styles.label}>内容</Text>
                    <View style={styles.contentView}>
                        <TextInput
                            placeholder="请输入私信内容"
                            style={styles.contentInput}
                            multiline={true}
                            textAlign='start'
                            textAlignVertical='top'
                            underlineColorAndroid="transparent"
                            onChangeText={(text) => this.setState({content:text})}
                            value={this.state.content}/>
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
    editor: {
        flex: 1,
        padding: 12
    },
    selectButton: {
        padding: 12,
        borderColor: '#3f51b5',
        borderWidth: 1,
        borderRadius: 4
    },
    selectText: {
        fontSize: 16,
        color: '#555'
    },
    label: {
        marginTop: 16,
        color: '#3f51b5',
        fontSize: 16
    },
    titleView: {
        marginTop: 8,
        padding: 12,
        borderColor: '#CCC',
        borderWidth: 1,
        backgroundColor: 'white'
    },
    titleInput: {
        padding: 0,
        fontSize: 16
    },
    contentView: {
        height: 240,
        marginTop: 8,
        marginBottom: 16,
        padding: 12,
        borderColor: '#CCC',
        borderWidth: 1,
        backgroundColor: 'white'
    },
    contentInput: {
        flex: 1,
        padding: 0,
        fontSize: 16
    },
    teacherRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomColor: '#BBB',
        borderBottomWidth: 1
    },
    avatar: {
        height: 48,
        width: 48,
        marginRight: 12,
        borderRadius: 24
    },
    teacherText: {
        fontSize: 16
    }
});

module.exports = MessageEditor;
