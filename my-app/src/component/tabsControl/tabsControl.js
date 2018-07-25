import React, { Component } from 'react';
import ReactDOM from 'react-dom';

//style
import './tabsControl.css'

let notNullChildren = [],
    tabTitleStyle = "",
    tabItemWrap = "",
    tabItem = ""

class TabsControl extends Component {

    constructor() {
        super();
        this.state = {
            currentIndex: 0,
        };
    }

    getQueryString = (name) => {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = decodeURI(window.location.search).substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        } else {
            return null;
        }
    }

    componentWillReceiveProps(nextProps) {
        // console.log("componentWillReceiveProps, nextProps is", nextProps)
        if (this.props.defaultNum !== nextProps.defaultNum) {
            this.setState({
                currentIndex: nextProps.defaultNum
            })
        }

    }

    check_title_index(index) {
        // console.log("check_title_index, this.props.defaultNum is ", this.props.defaultNum)
        return index === this.state.currentIndex ? `${tabTitleStyle} active` : `${tabTitleStyle}`;
    }

    check_item_index(index) {
        return index === this.state.currentIndex ? `${tabItem} show` : `${tabItem}`;
    }

    componentDidMount() {
        const proptype = this.getQueryString("entitytype");
        const propname = this.getQueryString("propname");
    }

    cleanArray = (actual) => {
        var newArray = new Array();
        for (var i = 0; i < actual.length; i++) {
            if (actual[i]) {
                newArray.push(actual[i]);
            }
        }
        return newArray;
    }


    render() {
        notNullChildren = this.cleanArray(this.props.children);
        if (notNullChildren.length == 3) {
            tabTitleStyle = "tab-title-3";
            tabItemWrap = "tab-item-wrap";
            tabItem = "tab-item"
        } else if (notNullChildren.length == 2) {
            tabTitleStyle = "tab-title-2";
            tabItemWrap = "tab-item-wrap";
            tabItem = "tab-item"
        } else if (notNullChildren.length == 1) {
            tabTitleStyle = "tab-title-1";
            tabItemWrap = "tab-item-wrap-1";
            tabItem = "tab-item-1"
        }

        return (
            <div style={{ width: '100%' }}>
                {/*动态生成Tab导航*/}
                <div className='tab-title-wrap'>
                    {React.Children.map(notNullChildren, (element, index) => {
                        return (
                            /*箭头函数没有自己的this，这里的this继承自外围作用域，即组件本身*/
                            <div onClick={() => { this.setState({ currentIndex: index }) }} className={this.check_title_index(index)}>
                                <span className="title-txt">{element && element.props.name}</span>
                            </div>
                        );
                    })}
                </div>
                {/*Tab内容区域*/}
                <div className={tabItemWrap}>
                    {React.Children.map(notNullChildren, (element, index) => {
                        return (
                            <div className={this.check_item_index(index)}>{element}</div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default TabsControl;

