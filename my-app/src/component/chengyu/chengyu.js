import React, { Component } from 'react';
import TabsControl from './../tabsControl/tabsControl';
import config from './../../config';

//style
import "../common.css";
import './chengyu.css';
let defaultNum, length, lengthNum;
class Chengyu extends Component {

    state = {
        data: [],
        loading: true,
        defaultNum: 0,
        length: 0,
        lengthNum: 0
    }

    fetch = (params = {}) => {
        console.log("this props is: ", this.props);
        console.log('params:', params);
        var that = this;
        fetch(`${config.host}:${config.port}/hanyu/search?tid=${this.props.tid}&skey=${this.props.skey}&entityname=${this.props.name}&entitytype=${this.props.type}&propname=*`).then(function (res) {
            // 请求成功，得到 response 对象，调用 response 对象的 json 方法并返回
            if (res.ok) {
                return res.json();
            } else {
                return res.statusText
            }
        }).then(function (data) {
            // response 对象的 json 方法执行成功，得到结果
            that.setState({
                loading: false,
                data: data,
            });
            const A = (that.state.data.pinyin || that.state.data.hanyi || that.state.data.chuzi);
            const B = (that.state.data.simwords && that.state.data.diffwords.length);
            const C = (that.state.data.simwords && that.state.data.simwords.length);
            if (A && B && C) {
                lengthNum = 3
                length = 3;
            } else if (A && B) {
                lengthNum = 2
                length = 21;
            } else if (A && C) {
                lengthNum = 2
                length = 22;
            } else if (B && C) {
                lengthNum = 2
                length = 23;
            } else if (A || B || C) {
                lengthNum = 1;
                length = 1;
            } else {
                lengthNum = 0;
                length = 0;
            }

            const propname = that.props.propname;
            if (length === 3) {
                if (propname === "拼音" || propname === "含义" || propname === "出处") {
                    defaultNum = 0;
                } else if (propname === "反义词") {
                    defaultNum = 1;
                } else if (propname === "近义词") {
                    defaultNum = 2;
                }
            } else if (length === 21) {
                if (propname === "拼音" || propname === "含义" || propname === "出处") {
                    defaultNum = 0;
                } else {
                    defaultNum = 1;
                }
            } else if (length === 22) {
                if (propname === "拼音" || propname === "含义" || propname === "出处") {
                    defaultNum = 0;
                } else {
                    defaultNum = 1;
                }
            } else if (length === 23) {
                if (propname === "反义词") {
                    defaultNum = 0;
                } else {
                    defaultNum = 1;
                }
            } else if (length === 1) {
                defaultNum = 0;
            }

            that.setState({
                length: length,
                lengthNum: lengthNum,
                defaultNum: defaultNum
            });
        });
    }

    componentDidMount() {
        this.fetch();
    }


    render() {
        const chengyuData = this.state.data;
        const cehngyu = chengyuData.words;
        return (
            <div className='main-wrap'>
                <div className='bg'>
                    <img src={require('../../images/bg.png')} />
                </div>
                <div className="teach-img">
                    <img src={require('../../images/teacher.png')} />
                </div>

                <div className="tab-wrap">
                    <TabsControl defaultNum={this.state.defaultNum} length={this.state.lengthNum}>
                        {chengyuData.pinyin || chengyuData.hanyi || chengyuData.chuzi ? (<div name="基本信息" className="display-flex-colomn">
                            <span className="display-flex-colomn-title">{this.props.name}</span>
                            <div className="hr"></div>
                            {chengyuData.pinyin ? (<p className="basic">拼音: <span className="basic-content">{chengyuData.pinyin}</span></p>) : null}
                            {chengyuData.hanyi ? (<p className="basic">含义: <span className="basic-content">{chengyuData.hanyi}</span></p>) : null}
                            {chengyuData.chuzi ? (<p className="basic">出自: <span className="basic-content">{chengyuData.chuzi}</span></p>) : null}
                        </div>) : null}
                        {chengyuData.diffwords && chengyuData.diffwords.length ? (<div name="反义词" className="display-flex-colomn">
                            <span className="display-flex-colomn-title">反义词</span>
                            <div className="hr"></div>
                            <div className="display-flex-colomn-content words-item">
                                {chengyuData.diffwords.map((diffList, k) => {
                                    if (diffList[1] == 1) {
                                        return (
                                            <a style={{ marginRight: '10px' }} key={diffList[0]} href={`./?tid=${this.props.tid}&skey=${this.props.skey}&entityname=${diffList[0]}&entitytype=成语&propname=拼音`}>{diffList[0]}</a>
                                        )
                                    } else {
                                        return (
                                            <span style={{ marginRight: '10px' }} key={diffList[0]}>{diffList[0]}</span>
                                        )
                                    }
                                })}
                            </div>
                        </div>) : null}
                        {chengyuData.simwords && chengyuData.simwords.length ? (<div name="近义词" className="display-flex-colomn">
                            <span className="display-flex-colomn-title">近义词</span>
                            <div className="hr"></div>
                            <div className="display-flex-colomn-content words-item">
                                {chengyuData.simwords.map((simList, k) => {
                                    if (simList[1] == 1) {
                                        return (
                                            <a style={{ marginRight: '10px' }} key={simList[0]} href={`./?tid=${this.props.tid}&skey=${this.props.skey}&entityname=${simList[0]}&entitytype=成语&propname=拼音`}>{simList[0]}</a>
                                        )
                                    } else {
                                        return (
                                            <span style={{ marginRight: '10px' }} key={simList[0]}>{simList[0]}</span>
                                        )
                                    }
                                })}
                            </div>
                        </div>) : null}
                    </TabsControl>
                </div>

            </div>
        )
    }
}

export default Chengyu