'use strict';

var React = require('react-native');

var {
    StyleSheet,
    Text,
    View,
    ToolbarAndroid,
    TextInput,
    Dimensions,
    } = React;

const DropDown = require('react-native-dropdown');
const {
    Select,
    Option,
    OptionList,
    updatePosition
    } = DropDown;

var Constants = require('./Constants');

var MessageEditor = React.createClass({
    getInitialState() {
        return {
            teachers: [],
            selectedTeacher: '',
            canada: ''
        };
    },
    componentDidMount: function () {
        updatePosition(this.refs['SELECT']);
        updatePosition(this.refs['OPTIONLIST']);
        this.fetchTeachers();
    },
    fetchTeachers: function () {
        var self = this;
        fetch(Constants.URL_TEACHERS, {
            credentials: 'same-origin'
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
            if (json.error == 0) {
                console.log(json);
                self.setState({
                    teachers: json.teachers
                });
            } else {
                ToastAndroid.show(json.message, ToastAndroid.SHORT);
            }
        }).catch(function (e) {
            ToastAndroid.show(e.message, ToastAndroid.SHORT);
        });
    },
    _getOptionList() {
        return this.refs['OPTIONLIST'];
    },
    selectTeacher(teacher) {
        this.setState({
            selectedTeacher: teacher
        });
    },
    onActionSelected: function (position) {
        if (position == 0) {
            // TODO
            this.props.navigator.pop();
        }
    },
    render() {
        var toolbarActions = [
            {title: '发送', icon: require('image!ic_send_white'), show: 'always'}
        ];
        var options = this.state.teachers.map(function (teacher, i) {
            return <Option key={i}>{teacher.name + '(' + teacher._id + ')'}</Option>
        });
        var width = Dimensions.get('window').width - 40;
        return (
            <View style={styles.container}>
                <ToolbarAndroid
                    navIcon={require('image!ic_back_white')}
                    title='添加私信'
                    titleColor="white"
                    style={styles.toolbar}
                    onIconClicked={() => this.props.navigator.pop()}
                    actions={toolbarActions}
                    onActionSelected={this.onActionSelected}/>
                <View style={styles.editor}>
                    <Select
                        width={width}
                        ref="SELECT"
                        optionListRef={this._getOptionList}
                        defaultValue="选择收信人"
                        onSelect={this.selectTeacher}>
                        {options}
                    </Select>
                    <OptionList ref="OPTIONLIST"/>
                </View>
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
        padding: 16
    }
});

module.exports = MessageEditor;
