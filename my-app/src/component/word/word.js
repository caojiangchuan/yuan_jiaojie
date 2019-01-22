import React, { Component } from 'react';
import TabsControl from './../tabsControl/tabsControl';
import reqwest from 'reqwest';
import config from './../../config';
import "jsgif";
// import './../../libgif.js';

//style
import "../common.css";
import './word.css';
let defaultNum, length, lengthNum;
let pinyinArray = [];
let hanyiArray = [];
let hanyiSingleArray = [];
let singleArrayMean = [], pinyinSingleArrayMean = [];
let moreArrayMean = [], pinyinMoreArrayMean = [];
let hanyiMoreMap = {},
    hanyiMoreMapYiArray = []
let hanyiMoreArray = [];

const historyLength = window.history.length;

class Word extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loading: true,
            defaultNum: 0,
            length: 0,
            lengthNum: 0,
            showImg: true,
            imgTime: ''
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

            console.log("this.state.data.word: ", that.state.data);

            //处理多音字
            pinyinArray = that.state.data.pinyin
            hanyiArray = that.state.data.hanyi



            const A = (that.state.data.pinyin || that.state.data.bushou || that.state.data.bihua || (that.state.data.simwords && that.state.data.simwords.length) || (that.state.data.diffwords && that.state.data.diffwords.length));
            const B = (that.state.data.hanyi);
            const C = (that.state.data.words);
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
                if (propname === "拼音" || propname === "部首" || propname === "笔画" || propname === "近义词" || propname === "反义词") {
                    defaultNum = 0;
                } else if (propname === "含义") {
                    defaultNum = 1;
                } else if (propname === "组词") {
                    defaultNum = 2;
                }
            } else if (length === 21) {
                if (propname === "拼音" || propname === "部首" || propname === "笔画" || propname === "近义词" || propname === "反义词") {
                    defaultNum = 0;
                } else {
                    defaultNum = 1;
                }
            } else if (length === 22) {
                if (propname === "拼音" || propname === "部首" || propname === "笔画" || propname === "近义词" || propname === "反义词") {
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
        this.forceUpdate();

        // window.CommonCmd.isHasHandwriting("已")


        // document.getElementById('matts').each(function (img_tag) {
        //     if (/.*\.gif/.test(img_tag.src)) {
        //         var rub = new SuperGif({ gif: img_tag });
        //         rub.load();
        //     }
        // });
    }

    goBack = () => {
        if (document.referrer) {
            window.history.back();
        }
    }

    renderMean = () => {
        console.log("in renderMean this.state.data.hanyi is", this.state.data.hanyi)
        console.log("hanyiArray is: ", hanyiArray);
        console.log("pinyinArray is: ", pinyinArray);
        console.log("pinyinArray.length == 1", pinyinArray.length == 1);
        // hanyiArray = this.state.data.hanyi;
        if (pinyinArray.length == 1) {
            console.log("执行这里")
            return (
                <div>
                    {hanyiArray.map((mean, meanK) => {
                        console.log("mean, meanK is: ", mean, meanK);
                        // if (hanyiArray.length == 1) {
                        //     return <p className="mean-detail">{mean}</p>
                        // } else {
                        //     return <p className="mean-detail"><span className="mean-num">{meanK + 1}</span>{mean}</p>
                        // }
                        return (
                            <div>
                                {mean.yin ? (<span style={{ color: '#E2BD97' }}>{`{${mean.yin}}`}</span>) :
                                    (<p className="mean-detail"><span className="mean-num">{meanK + 1}</span>{mean}</p>)}
                                {mean.yi && mean.yi.map((eachMean, eachMeanK) => {
                                    return <p className="mean-detail"><span className="mean-num">{eachMeanK + 1}</span>{eachMean}</p>
                                })}
                            </div>
                        )
                    })}
                </div>
            )
        } else if (pinyinArray.length > 1 && pinyinArray.length == hanyiArray.length) {
            console.log("pinyinArray 是这里", pinyinArray);
            return (
                <div>
                    {hanyiArray.map((means, meansK) => {
                        console.log("means, meansK", means, meansK);
                        return (
                            <div>
                                {means.yin ? (<span style={{ color: '#E2BD97' }}>{`{${means.yin}}`}</span>) :
                                    (<p className="mean-detail"><span className="mean-num">{meansK + 1}</span>{means}</p>)}
                                {means.yi && means.yi.map((eachMean, eachMeanK) => {
                                    return <p className="mean-detail"><span className="mean-num">{eachMeanK + 1}</span>{eachMean}</p>
                                })}
                            </div>
                        )
                    })}
                </div>
            )
        } else {
            return (
                <div>
                    {hanyiArray.map((mean, meanK) => {
                        if (hanyiArray.length == 1) {
                            return <p className="mean-detail">{mean}</p>
                        } else {
                            return <p className="mean-detail"><span className="mean-num">{meanK + 1}</span>{mean}</p>
                        }

                    })}
                </div>
            )
        }
    }

    // toMiaohong = (hanzi) => {
    //     if (window.CommonCmd.isHasHandwriting(hanzi)) {
    //         window.CommonCmd.JsHandwriting(hanzi)
    //     }
    // }

    replay = (e) => {
        // console.log("重新播放");
        // this.setState({
        //     showImg: false
        // }, () => {
        //     this.setState({
        //         showImg: true
        //     })
        // })
        e.stopPropagation();
        var currentTime;
        if (this.state.imgTime == currentTime) {
            currentTime = new Date().getTime();
        }

        this.setState({
            imgTime: currentTime
        })

    }

    render() {

        const wordData = this.state.data;
        const words = wordData.words;
        const wordsArray = words && words.split("、");


        // console.log(" this.state.data is: ", this.state.data);
        // console.log("pinyinArray  is: ", pinyinArray);
        console.log("this.state.imgTime is: ", this.state.imgTime);


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
                    {wordData.shuxie ? (
                        <div className='matts' id="matts"
                        // onClick={this.toMiaohong.bind(this, this.props.name)}
                        >
                            {/* <img src={this.state.showImg ? wordData.shuxie : ''} /> */}
                            <img src={`${wordData.shuxie}?t=${this.state.imgTime}`} />
                            {/* <img src='http://robot.yuanqutech.com/math/1.gif' /> */}
                            <div onClick={this.replay} className='replay'>
                                <img src={require('./../../images/replay.png')} />
                            </div>
                            {/* {window.CommonCmd.isHasHandwriting(this.props.name) ? (<div className="mhIcon">
                                <img src={require('./../../images/miaohong.png')} />
                            </div>) : null} */}

                        </div>
                    ) : (<div className='matts'
                    // onClick={this.toMiaohong.bind(this, this.props.name)}
                    >
                        <img src={require('./../../images/matts.png')} />
                        {/* {window.CommonCmd.isHasHandwriting(this.props.name) ? (<div className="mhIcon">
                            <img src={require('./../../images/miaohong.png')} />
                        </div>) : null} */}
                        <div className='word'>
                            <span className="word-hanzi" style={{ textAlign: 'center' }}>{this.props.name}</span>
                            <p className="word-pinyin">
                                <span>{pinyinArray && pinyinArray[0]}</span>
                            </p>
                        </div>
                    </div>)}

                </div>
                <div className="tab-wrap">
                    <TabsControl defaultNum={this.state.defaultNum} length={this.state.lengthNum}>
                        {wordData.pinyin || wordData.bushou || wordData.bihua || wordData.simwords || wordData.diffwords ? (
                            <div name="基本信息" className="display-flex-colomn-word">
                                {wordData.pinyin ? (<p className="basic-word">
                                    <span className="basic-word-pinyin">
                                        <span className="basic-content-span-left">拼音</span>
                                    </span>
                                    <span className="basic-content-pinyin">
                                        <span className="basic-content-span">
                                            {pinyinArray.map((pinyin, pinyinK) => {
                                                return (
                                                    <span style={{ marginRight: '3%' }} >{`{${pinyin}}`}</span>
                                                )
                                            })}
                                        </span>
                                    </span>
                                </p>) : null}
                                {wordData.pinyin ? (<p className="basic-word">
                                    <span className="basic-word-pinyin">
                                        <span className="basic-content-span-left">部首</span>
                                    </span>
                                    <span className="basic-content-pinyin">
                                        <span className="basic-content-span">
                                            {wordData.bushou}
                                        </span>
                                    </span>
                                </p>) : null}
                                {wordData.bihua ? (<p className="basic-word">
                                    <span className="basic-word-pinyin">
                                        <span className="basic-content-span-left">笔画</span>
                                    </span>
                                    <span className="basic-content-pinyin">
                                        <span className="basic-content-span">
                                            {wordData.bihua}
                                        </span>
                                    </span>
                                </p>) : null}
                                {wordData.simwords && wordData.simwords.length > 0 ? (
                                    <p className="basic-word">
                                        <span className="basic-word-pinyin">
                                            <span className="basic-content-span-left">近义字</span>
                                        </span>
                                        <span className="basic-content-pinyin">
                                            <span className="basic-content-span">
                                                {wordData.simwords.map((simList, k) => {
                                                    return (
                                                        <span style={{ marginRight: '3%' }} key={simList[0]} >{simList[0]}</span>
                                                    )
                                                })}
                                            </span>
                                        </span>
                                    </p>
                                ) : null}
                                {wordData.diffwords && wordData.diffwords.length > 0 ? (
                                    <p className="basic-word">
                                        <span className="basic-word-pinyin">
                                            <span className="basic-content-span-left">反义字</span>
                                        </span>
                                        <span className="basic-content-pinyin">
                                            <span className="basic-content-span">
                                                {wordData.diffwords.map((simList, k) => {
                                                    return (
                                                        <span style={{ marginRight: '3%' }} key={simList[0]} >{simList[0]}</span>
                                                    )
                                                })}
                                            </span>
                                        </span>
                                    </p>
                                ) : null}
                            </div>) : null}
                        {wordData.hanyi ? (<div name="基本释义" className="display-flex-colomn">
                            <div className="display-flex-colomn-content">
                                {this.renderMean()}
                            </div>
                        </div>) : null}
                        {wordData.words ? (<div name="词语" className="display-flex-colomn">
                            {wordData.words ? (<div className="words-wrap">
                                <div className="display-flex-colomn-content-cizu word-cizu-item">
                                    <div className="word-cizu-item-in">
                                        {wordsArray.map((item, i) => {
                                            return (
                                                <a className="word-cizu">{item}</a>
                                            )
                                        })}
                                    </div>
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