import React, { Component } from 'react';
import TabsControl from './../tabsControl/tabsControl';
import reqwest from 'reqwest';
import config from './../../config';

//style
import "../common.css";
import './word.css';
let defaultNum, length, lengthNum;
class Word extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: true,
            defaultNum: 0,
            length: 0,
            lengthNum: 0
        }
    }

    fetch = (params = {}) => {
        var that = this;
        this.setState({ loading: true });
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
            const A = (that.state.data.pinyin || that.state.data.bushou || that.state.data.bihua);
            const B = (that.state.data.hanyi);
            const C = (that.state.data.words || (that.state.data.simwords && that.state.data.simwords.length) || (that.state.data.diffwords && that.state.data.diffwords.length));
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
                if (propname === "拼音" || propname === "部首" || propname === "笔画") {
                    defaultNum = 0;
                } else if (propname === "含义") {
                    defaultNum = 1;
                } else if (propname === "组词" || propname === "近义词" || propname === "反义词") {
                    defaultNum = 2;
                }
            } else if (length === 21) {
                if (propname === "拼音" || propname === "部首" || propname === "笔画") {
                    defaultNum = 0;
                } else {
                    defaultNum = 1;
                }
            } else if (length === 22) {
                if (propname === "拼音" || propname === "部首" || propname === "笔画") {
                    defaultNum = 0;
                } else {
                    defaultNum = 1;
                }
            } else if (length === 23) {
                if (propname === "含义") {
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
        const wordData = this.state.data;
        const words = wordData.words;

        return (
            <div className='main-wrap'>
                <div className='bg'>
                    <img src={require('./../../images/bg.png')} />
                </div>
                <div className='word-wrap'>
                    <img src={require('./../../images/matts.png')} />
                    <span className='word'>{this.props.name}</span>
                </div>
                <div className="teach-small-img">
                    <img src={require('./../../images/img.png')} />
                </div>
                <div className="tab-wrap">
                    <TabsControl defaultNum={this.state.defaultNum} length={this.state.lengthNum}>
                        {wordData.pinyin || wordData.bushou || wordData.bihua ? (<div name="基本信息" className="display-flex-colomn">
                            <span className="display-flex-colomn-title">{this.props.name}</span>
                            <div className="hr"></div>
                            {wordData.pinyin ? (<p className="basic">读音: <span className="basic-content">{wordData.pinyin}</span></p>) : null}
                            {wordData.bushou ? (<p className="basic">部首: <span className="basic-content">{wordData.bushou}</span></p>) : null}
                            {wordData.bihua ? (<p className="basic">笔画: <span className="basic-content">{wordData.bihua}</span></p>) : null}
                        </div>) : null}
                        {wordData.hanyi ? (<div name="基本释义" className="display-flex-colomn">
                            <span className="display-flex-colomn-title">基本释义</span>
                            <div className="hr"></div>
                            <div className="display-flex-colomn-content">{wordData.hanyi}</div>
                        </div>) : null}
                        {wordData.words || wordData.simwords || wordData.diffwords ? (<div name="词语" className="display-flex-colomn">
                            {wordData.words ? (<div className="words-wrap">
                                <span className="display-flex-colomn-title">词语</span>
                                <div className="hr"></div>
                                <div className="display-flex-colomn-content">{wordData.words}</div>
                            </div>) : null}
                            {wordData.simwords && wordData.simwords.length > 0 ? (<div className="words-wrap">
                                <span className="display-flex-colomn-title">近义字</span>
                                <div className="hr"></div>
                                <div className="display-flex-colomn-content">
                                    {wordData.simwords.map((simList, k) => {
                                        if (simList[1] == 1) {
                                            return (
                                                <a style={{ marginRight: '10px' }} key={simList[0]} href={`./?tid=${this.props.tid}&skey=${this.props.skey}&entityname=${simList[0]}&entitytype=汉字&propname=拼音`}>{simList[0]}</a>
                                            )
                                        } else {
                                            return (
                                                <span style={{ marginRight: '10px' }} key={simList[0]}>{simList[0]}</span>
                                            )
                                        }
                                    })}
                                </div>
                            </div>) : null}
                            {wordData.diffwords && wordData.diffwords.length > 0 ? (<div className="words-wrap">
                                <span className="display-flex-colomn-title">反义字</span>
                                <div className="hr"></div>
                                <div className="display-flex-colomn-content">
                                    {wordData.diffwords.map((diffList, k) => {
                                        if (diffList[1] == 1) {
                                            return (
                                                <a style={{ marginRight: '10px' }} key={diffList[0]} href={`./?tid=${this.props.tid}&skey=${this.props.skey}&entityname=${diffList[0]}&entitytype=汉字&propname=拼音`}>{diffList[0]}</a>
                                            )
                                        } else {
                                            return (
                                                <span style={{ marginRight: '10px' }} key={diffList[0]}>{diffList[0]}</span>
                                            )
                                        }
                                    })}
                                </div>
                            </div>) : null}
                        </div>) : null}
                    </TabsControl>
                </div>
            </div>
        )
    }
}

export default Word