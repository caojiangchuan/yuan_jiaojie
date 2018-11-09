import React, { Component } from 'react';
import TabsControl from './../tabsControl/tabsControl';
import reqwest from 'reqwest';
import config from './../../config';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
// import browserHistory from 'react-router';

//style
import "../common.css";
import './terms.css';

let defaultNum, length, lengthNum;

const historyLength = window.history.length;
class Terms extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: true,
            length: length,
            lengthNum: lengthNum,
            defaultNum: defaultNum
        };
        this.goBack = this.goBack.bind(this);
    }

    goBack = () => {
        if (document.referrer) {
            window.history.back();
        }
    }

    fetch = (params = {}) => {
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
            const A = (that.state.data.pinyin || that.state.data.hanyi || that.state.data.zaoju);
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
                if (propname === "拼音" || propname === "含义" || propname === "造句") {
                    defaultNum = 0;
                } else if (propname === "反义词") {
                    defaultNum = 1;
                } else if (propname === "近义词") {
                    defaultNum = 2;
                }
            } else if (length === 21) {
                if (propname === "拼音" || propname === "含义" || propname === "造句") {
                    defaultNum = 0;
                } else {
                    defaultNum = 1;
                }
            } else if (length === 22) {
                if (propname === "拼音" || propname === "含义" || propname === "造句") {
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

    renderHanyi = () => {
        const termsData = this.state.data;
        if (termsData.hanyi) {
            if (termsData.hanyi.length === 1) {
                return (
                    <p className="terms-basic">含义:
                         <span className="terms-basic-content">{termsData.hanyi}</span>
                    </p>)
            } else if (termsData.hanyi.length > 1) {
                return (<div className="terms-basic terms-more-hanyi">
                    <p style={{ whiteSpace: 'nowrap', minWidth: '50px' }}>
                        <a>含义:</a>
                    </p>
                    <div>
                        {termsData.hanyi.map((hanyiValue, hanyiKey) => {
                            return <p className="terms-basic-content">
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
        const termsData = this.state.data;
        if (termsData.zaoju) {
            if (termsData.zaoju.length === 1) {
                return (
                    <p id="zaojuAnchor" className="terms-basic">
                        <a href="#zaojuAnchor">造句:</a>
                        <span className="terms-basic-content">{termsData.zaoju}</span>
                    </p>)
            } else if (termsData.zaoju.length > 1) {
                return (<div className="terms-basic terms-more-zaoju">
                    <p id="zaojuAnchor" style={{ whiteSpace: 'nowrap', minWidth: '50px' }}>
                        <a href="#zaojuAnchor">造句:</a>
                    </p>
                    <div>
                        {termsData.zaoju.map((hanyiValue, hanyiKey) => {
                            return <p className="terms-basic-content">
                                <span className="zaoju-num">{hanyiKey + 1}</span>{hanyiValue}</p>
                        })}
                    </div>
                </div>)
            }
        } else {
            return null;
        }
    }



    render() {
        const termsData = this.state.data;
        const terms = termsData.words;

        let termsPinyin = termsData.pinyin && termsData.pinyin[0].split(" ");
        // console.log("this.props.name.split() length is:", this.props.name.split("").length);

        return (
            <div className='main-wrap'>
                <div className='bg'>
                    <img src={require('./../../images/bg.png')} />
                </div>
                {document.referrer ? (<div className='back' onClick={this.goBack} >
                    <img src={require('./../../images/back.png')} />
                </div>) : null}
                <div className='left-wrap'>
                    <img src={require('./../../images/left-bg.png')} />
                    <div className='matts'>
                        <img src={require('./../../images/matts.png')} />
                        {this.props.name.split("").length > 2 ? (<div className='terms'>
                            <span className="terms-ciyu">
                                {this.props.name.split("").map((termsword, termswordK) => {
                                    return <span className="terms-ciyu-zi">{termsword}</span>
                                })}
                            </span>
                            <p className="terms-pinyin">
                                {termsPinyin && termsPinyin.map((termspinyin, termspinyinK) => {
                                    return <span>{termspinyin}</span>
                                })}
                            </p>
                        </div>) : (
                                <div className='terms-2'>
                                    <span className="terms-ciyu">
                                        {this.props.name.split("").map((termsword, termswordK) => {
                                            return <span className="terms-ciyu-zi-2">{termsword}</span>
                                        })}
                                    </span>
                                    <p className="terms-pinyin-2">
                                        {termsPinyin && termsPinyin.map((termspinyin, termspinyinK) => {
                                            return <span>{termspinyin}</span>
                                        })}
                                    </p>
                                </div>
                            )}

                    </div>
                </div>
                <div className="tab-wrap">
                    <TabsControl defaultNum={this.state.defaultNum} length={this.state.lengthNum}>
                        {termsData.pinyin || termsData.hanyi || termsData.zaoju ? (<div name="基本信息" className="display-flex-colomn-terms">
                            {termsData.pinyin ? (<p className="terms-basic">拼音: <span className="terms-basic-content">{termsData.pinyin}</span></p>) : null}
                            {/* {termsData.hanyi ? (<p className="terms-basic">含义:
                                <span className="terms-basic-content">{termsData.hanyi}</span>
                            </p>) : null} */}
                            {this.renderHanyi()}
                            {this.renderZaoju()}
                            {/* {termsData.hanyi ? (
                                <div className="condisplay-flex-colomn-tent terms-shiyi">
                                    {termsData.hanyi}
                                </div>) : null} */}

                        </div>) : null}
                        {termsData.diffwords && termsData.diffwords.length > 0 ? (<div name="反义词" className="display-flex-colomn">
                            <div className="display-flex-colomn-content-terms terms-item">
                                <div className="terms-item-in">
                                    {termsData.diffwords.map((diffList, k) => {
                                        if (diffList[1] == 1) {
                                            return (
                                                <a className="terms-cizu-in" key={diffList[0]} href={`./?tid=${this.props.tid}&skey=${this.props.skey}&entityname=${diffList[0]}&entitytype=词语&propname=拼音`}>{diffList[0]}</a>
                                            )
                                        } else {
                                            return (
                                                <a className="terms-cizu" key={diffList[0]}>{diffList[0]}</a>
                                            )
                                        }
                                    })}
                                </div>
                            </div>
                        </div>) : null}
                        {termsData.simwords && termsData.simwords.length > 0 ? (<div name="近义词" className="display-flex-colomn">
                            <div className="display-flex-colomn-content-terms terms-item">
                                <div className="terms-item-in">
                                    {termsData.simwords.map((simList, k) => {
                                        if (simList[1] == 1) {
                                            return (
                                                <a className="terms-cizu-in" key={simList[0]} href={`./?tid=${this.props.tid}&skey=${this.props.skey}&entityname=${simList[0]}&entitytype=词语&propname=拼音`}>{simList[0]}</a>
                                            )
                                        } else {
                                            return (
                                                <span className="terms-cizu" key={simList[0]}>{simList[0]}</span>
                                            )
                                        }
                                    })}
                                </div>
                            </div>
                        </div>) : null}
                    </TabsControl>
                </div>
            </div >
        )
    }
}

export default Terms