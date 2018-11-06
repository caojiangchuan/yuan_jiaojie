import React, { Component } from 'react';
import TabsControl from './../tabsControl/tabsControl';
import config from './../../config';

//style
import "../common.css";
import './chengyu.css';
let defaultNum, length, lengthNum;
const historyLength = window.history.length;
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
            const A = (that.state.data.pinyin || that.state.data.hanyi || that.state.data.chuzi || that.state.data.zaoju);
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
            if (propname === "造句") {
                window.location.href = "#zaojuAnchor"
            }
            if (length === 3) {
                if (propname === "拼音" || propname === "含义" || propname === "出处" || propname === "造句") {
                    defaultNum = 0;
                } else if (propname === "反义词") {
                    defaultNum = 1;
                } else if (propname === "近义词") {
                    defaultNum = 2;
                }
            } else if (length === 21) {
                if (propname === "拼音" || propname === "含义" || propname === "出处" || propname === "造句") {
                    defaultNum = 0;
                } else {
                    defaultNum = 1;
                }
            } else if (length === 22) {
                if (propname === "拼音" || propname === "含义" || propname === "出处" || propname === "造句") {
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
        this.forceUpdate();
    }

    goBack = () => {
        if (document.referrer) {
            window.history.back();
        }
    }

    renderHanyi = () => {
        const chengyuData = this.state.data;
        if (chengyuData.hanyi) {
            if (chengyuData.hanyi.length === 1) {
                return (
                    <p className="chengyu-basic">
                        <a>含义:</a>
                        <span className="chengyu-basic-content">{chengyuData.hanyi}</span>
                    </p>)
            } else if (chengyuData.hanyi.length > 1) {
                return (<div className="chengyu-basic  chengyu-more-hanyi">
                    <p style={{ whiteSpace: 'nowrap' }}>
                        <a>含义:</a>
                    </p>
                    <div>
                        {chengyuData.hanyi.map((hanyiValue, hanyiKey) => {
                            return <p className="chengyu-basic-content">
                                <span className="hanyi-num">{hanyiKey + 1}</span>{hanyiValue}</p>
                        })}
                    </div>
                </div>)
            }
        } else {
            return null;
        }
    }

    renderZaoju = () => {
        const chengyuData = this.state.data;
        if (chengyuData.zaoju) {
            if (chengyuData.zaoju.length === 1) {
                return (
                    <p id="zaojuAnchor" className="chengyu-basic">
                        <a href="#zaojuAnchor">造句:</a>
                        <span className="chengyu-basic-content">{chengyuData.zaoju}</span>
                    </p>)
            } else if (chengyuData.zaoju.length > 1) {
                return (<div className="chengyu-basic  chengyu-more-zaoju">
                    <p id="zaojuAnchor" style={{ whiteSpace: 'nowrap' }}>
                        <a href="#zaojuAnchor">造句:</a>
                    </p>
                    <div>
                        {chengyuData.zaoju.map((zaojuValue, zaojuKey) => {
                            return <p className="chengyu-basic-content">
                                <span className="zaoju-num">{zaojuKey + 1}</span>{zaojuValue}</p>
                        })}
                    </div>
                </div>)
            }
        } else {
            return null;
        }
    }


    render() {
        const chengyuData = this.state.data;
        const chengyu = chengyuData.words;

        // console.log("chengyuData.pinyin is", chengyuData.pinyin);
        // console.log("this.props.name is: ", this.props.name.split(""));
        // console.log("chengyuData.pinyin is", chengyuData.pinyin && chengyuData.pinyin[0].split(" "));

        let chengyuPinyin = chengyuData.pinyin && chengyuData.pinyin[0].split(" ");
        console.log("chengyuData.words.length is: ", this.props.name.length);

        return (
            <div className='main-wrap'>
                <div className='bg'>
                    <img src={require('../../images/bg.png')} />
                </div>
                {document.referrer ? (<div className='back' onClick={this.goBack} >
                    <img src={require('./../../images/back.png')} />
                </div>) : null}
                <div className='left-wrap'>
                    <img src={require('./../../images/left-bg.png')} />
                    <div className='matts'>
                        <img src={require('./../../images/matts.png')} />
                        {this.props.name.length > 4 ? (<div className='chengyu'>
                            <span className="chengyu-ciyu-more">
                                {this.props.name.split("").map((chengyuword, chengyuwordK) => {
                                    return <span>{chengyuword}</span>
                                })}
                            </span>
                        </div>) : (
                                <div className='chengyu'>
                                    <span className="chengyu-ciyu">
                                        {this.props.name.split("").map((chengyuword, chengyuwordK) => {
                                            return <span>{chengyuword}</span>
                                        })}
                                    </span>
                                    <span className="chengyu-pinyin">
                                        {chengyuPinyin && chengyuPinyin.map((chengyupinyin, chengyupinyinK) => {
                                            return <span>{chengyupinyin}</span>
                                        })}
                                    </span>
                                </div>
                            )}
                    </div>
                </div>
                <div className="tab-wrap">
                    <TabsControl defaultNum={this.state.defaultNum} length={this.state.lengthNum}>
                        {chengyuData.pinyin || chengyuData.hanyi || chengyuData.chuzi || chengyuData.zaoju ? (<div name="基本信息" className="display-flex-colomn-chengyu">
                            {chengyuData.pinyin ? (<p className="chengyu-basic">拼音: <span className="basic-content chengyu-basic-content">{chengyuData.pinyin}</span></p>) : null}
                            {this.renderHanyi()}
                            {/* {chengyuData.hanyi ? (<p className="chengyu-basic">含义: <span className="basic-content chengyu-basic-content">{chengyuData.hanyi}</span></p>) : null} */}
                            {chengyuData.chuzi ? (<p className="chengyu-basic">出自: <span className="basic-content chengyu-basic-content">{chengyuData.chuzi}</span></p>) : null}
                            {this.renderZaoju()}
                        </div>) : null}
                        {chengyuData.diffwords && chengyuData.diffwords.length > 0 ? (<div name="反义词" className="display-flex-colomn">
                            <div className="display-flex-colomn-content-chengyu chengyu-item">
                                <div className="chengyu-item-in">
                                    {chengyuData.diffwords.map((diffList, k) => {
                                        if (diffList[1] == 1) {
                                            return (
                                                <a className="chengyu-cizu-in" key={diffList[0]} href={`./?tid=${this.props.tid}&skey=${this.props.skey}&entityname=${diffList[0]}&entitytype=成语&propname=拼音`}>{diffList[0]}</a>
                                            )
                                        } else {
                                            return (
                                                <a className="chengyu-cizu" key={diffList[0]}>{diffList[0]}</a>
                                            )
                                        }
                                    })}
                                </div>
                            </div>
                        </div>) : null}
                        {chengyuData.simwords && chengyuData.simwords.length > 0 ? (<div name="近义词" className="display-flex-colomn">
                            <div className="display-flex-colomn-content-chengyu chengyu-item">
                                <div className="chengyu-item-in">
                                    {chengyuData.simwords.map((diffList, k) => {
                                        if (diffList[1] == 1) {
                                            return (
                                                <a className="chengyu-cizu-in" key={diffList[0]} href={`./?tid=${this.props.tid}&skey=${this.props.skey}&entityname=${diffList[0]}&entitytype=成语&propname=拼音`}>{diffList[0]}</a>
                                            )
                                        } else {
                                            return (
                                                <a className="chengyu-cizu" key={diffList[0]}>{diffList[0]}</a>
                                            )
                                        }
                                    })}
                                </div>
                            </div>
                        </div>) : null}
                    </TabsControl>
                </div>

            </div>
        )
    }
}

export default Chengyu