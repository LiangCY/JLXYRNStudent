'use strict';

var React = require('react-native');
var {
    Platform,
    ListView,
    Image,
    StyleSheet,
    Text,
    View,
    TouchableNativeFeedback,
    TouchableHighlight,
    ToastAndroid,
    } = React;

var Constants = require('./Constants');

var DrawerMenu = React.createClass({
    getInitialState: function () {
        var dataSource = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2
        });
        return {
            isLoading: false,
            avatar: 'http://114.212.113.228/img/user.jpg',
            name: '',
            dataSource: dataSource.cloneWithRows([
                {title: '微博', icon: require('image!ic_event'), selected: this.props.selected == '微博'},
                {title: '课程', icon: require('image!ic_lesson'), selected: this.props.selected == '课程'},
                {title: '作业', icon: require('image!ic_homework'), selected: this.props.selected == '作业'},
                {title: '资源', icon: require('image!ic_resource'), selected: this.props.selected == '资源'},
                {title: '私信', icon: require('image!ic_message'), selected: this.props.selected == '私信'}
            ])
        };
    },
    componentDidMount: function () {
        this.fetchUser();
    },
    fetchUser: function () {
        var self = this;
        fetch(Constants.URL_USER_BASIC, {
            credentials: 'same-origin'
        }).then(function (response) {
            return response.json()
        }).then(function (json) {
            if (json.error == 0) {
                self.setState({
                    avatar: 'http://114.212.113.228/avatar/' + json.user.id,
                    name: json.user.name
                });
            } else {
                ToastAndroid.show(json.message, ToastAndroid.SHORT);
            }
        }).catch(function (e) {
            ToastAndroid.show('网络请求失败', ToastAndroid.SHORT);
        });
    },
    pressUser: function () {
        this.props.onPressUser();
    },
    renderHeader: function () {
        var TouchableElement = TouchableHighlight;
        if (Platform.OS === 'android') {
            TouchableElement = TouchableNativeFeedback;
        }
        return (
            <View style={styles.header}>
                <TouchableElement
                    onPress={()=>this.pressUser()}
                    background={TouchableNativeFeedback.Ripple()}>
                    <View style={styles.userInfo}>
                        <Image
                            source={{uri:this.state.avatar}}
                            style={styles.avatar}/>
                        <Text style={styles.name}>
                            {this.state.name}
                        </Text>
                    </View>
                </TouchableElement>
            </View>
        );
    },
    componentWillReceiveProps: function (nextProps) {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows([
                {title: '微博', icon: require('image!ic_event'), selected: nextProps.selected == '微博'},
                {title: '课程', icon: require('image!ic_lesson'), selected: nextProps.selected == '课程'},
                {title: '作业', icon: require('image!ic_homework'), selected: nextProps.selected == '作业'},
                {title: '资源', icon: require('image!ic_resource'), selected: nextProps.selected == '资源'},
                {title: '私信', icon: require('image!ic_message'), selected: nextProps.selected == '私信'}
            ])
        });
    },
    renderRow: function (menu) {
        var TouchableElement = TouchableHighlight;
        if (Platform.OS === 'android') {
            TouchableElement = TouchableNativeFeedback;
        }
        return (
            <View>
                <TouchableElement
                    onPress={() =>this.props.onSelectItem(menu.title)}
                    background={TouchableNativeFeedback.Ripple()}>
                    <View style={menu.selected?styles.menuItemActive:styles.menuItem}>
                        <Image
                            style={styles.menuIcon}
                            source={menu.icon}/>
                        <Text style={styles.menuTitle}>
                            {menu.title}
                        </Text>
                    </View>
                </TouchableElement>
            </View>
        );
    },
    render: function () {
        return (
            <View style={styles.container} {...this.props}>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    showsVerticalScrollIndicator={false}
                    renderHeader={this.renderHeader}
                    style={{flex:1, backgroundColor: 'white'}}
                />
            </View>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA'
    },
    header: {
        flex: 1
    },
    userInfo: {
        flex: 1,
        backgroundColor: '#3f51b5',
        flexDirection: 'row',
        paddingLeft: 16,
        paddingTop: 32,
        paddingBottom: 32,
        alignItems: 'center',
        marginBottom: 12
    },
    avatar: {
        width: 56,
        height: 56,
        marginLeft: 8,
        marginRight: 8,
        borderRadius: 28
    },
    name: {
        fontSize: 16,
        color: 'white',
        marginLeft: 16
    },
    menuItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12
    },
    menuItemActive: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#DDDDDD'
    },
    menuTitle: {
        flex: 1,
        fontSize: 16,
        marginLeft: 16
    },
    menuIcon: {
        marginRight: 12,
        width: 32,
        height: 32
    }
});

module.exports = DrawerMenu;
