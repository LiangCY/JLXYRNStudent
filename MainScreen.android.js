'use strict';

var React = require('react-native');
var {
    StyleSheet,
    View,
    DrawerLayoutAndroid,
    ToolbarAndroid,
    Dimensions,
    Text,
    } = React;


var DRAWER_REF = 'drawer';
var DRAWER_WIDTH_LEFT = 64;

var DrawerMenu = require('./DrawerMenu');
var EventsList = require('./EventsList');

var MainScreen = React.createClass({
    getInitialState: function () {
        return ({
            menu: '微博'
        });
    },
    renderNavigationView: function () {
        return (
            <DrawerMenu
                selected={this.state.menu}
                onSelectItem={this.onSelectItem}
                onPressUser={this.onPressUser}
            />
        );
    },
    onPressUser: function () {
        this.refs[DRAWER_REF].closeDrawer();
        this.props.navigator.push({
            name: 'user'
        });
    },
    onSelectItem: function (menu) {
        this.refs[DRAWER_REF].closeDrawer();
        this.setState({menu: menu});
    },
    render: function () {
        var content;
        if (this.state.menu == '私信') {
            var toolbarActions = [
                {title: '添加', icon: require('image!ic_write_white'), show: 'always'}
            ];
            var toolbar = (
                <ToolbarAndroid
                    navIcon={require('image!ic_menu_white')}
                    title={this.state.menu}
                    titleColor="white"
                    style={styles.toolbar}
                    onIconClicked={() => this.refs[DRAWER_REF].openDrawer()}
                    actions={toolbarActions}/>
            );
        } else {
            toolbar = (
                <ToolbarAndroid
                    navIcon={require('image!ic_menu_white')}
                    title={this.state.menu}
                    titleColor="white"
                    style={styles.toolbar}
                    onIconClicked={() => this.refs[DRAWER_REF].openDrawer()}/>
            );
        }
        switch (this.state.menu) {
            case '微博':
                content = <EventsList navigator={this.props.navigator}/>;
                break;
            case '课程':
                content = <Text>课程</Text>;
                break;
            case '作业':
                content = <Text>作业</Text>;
                break;
            case '资源':
                content = <Text>资源</Text>;
                break;
            case '私信':
                content = <Text>私信</Text>;
                break;
        }
        return (
            <DrawerLayoutAndroid
                ref={DRAWER_REF}
                drawerWidth={Dimensions.get('window').width - DRAWER_WIDTH_LEFT}
                drawerPosition={DrawerLayoutAndroid.positions.Left}
                renderNavigationView={this.renderNavigationView}>
                {toolbar}
                <View style={styles.container}>
                    <View style={{flex: 1}}>
                        {content}
                    </View>
                </View>
            </DrawerLayoutAndroid>
        );
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#FAFAFA'
    },
    toolbar: {
        backgroundColor: '#3f51b5',
        height: 56
    }
});

module.exports = MainScreen;
