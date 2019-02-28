import React, { Component } from 'react';
import config from './../../config';

//style
import "../common.css";
import './index.css';


class Poem extends Component {
    constructor() {
        super();
        this.state = {
            nav: "原文",
            on: true,
            navData: ['原文', '译文', '赏析'],
            word: '碧玉',
            left: 0,
            top: 0,
            width: 0,
            wordMeanWidth: 0,
            showMean: false,
            meanTop: 0,
            wordMean: "",
            data: ''
        }
    }

    toggleBtn = () => {
        if (this.state.on) {
            this.setState({
                on: false
            })
        } else {
            this.setState({
                on: true
            })
        }
    }

    chooseNav = (nav) => {
        this.setState({
            nav: nav
        })
    }

    fetch = (params = {}) => {
        var that = this;
        console.log("this.props.uq is: ", this.props.uq);
        fetch(`${config.host}:${config.port}/shici/search?tid=${this.props.tid}&uq=${this.props.uq}`).then(function (res) {
            // 请求成功，得到 response 对象，调用 response 对象的 json 方法并返回
            if (res.ok) {
                return res.json();
            } else {
                return res.statusText
            }
        }).then(function (data) {
            // response 对象的 json 方法执行成功，得到结果
            console.log("data is: ", data);
            that.setState({
                data: data
            });
        });
    }

    componentDidMount() {
        this.fetch();
        console.log("this.props.propname", this.props.propname)
        if (this.props.propname == "翻译") {
            this.setState({
                nav: "译文"
            })
        } else if (this.props.propname == "赏析") {
            this.setState({
                nav: "赏析"
            })
        } else {
            this.setState({
                nav: "原文"
            })
        }
    }


    showMean = (mean, e) => {
        console.log(e);
        console.log(".innerHTML", e.target.innerHTML);
        console.log("clientWidth", e.target.clientWidth);
        console.log("clientHeight", e.target.clientHeight);
        console.log("offsetTop", e.target.offsetTop);
        console.log("offsetLeft", e.target.offsetLeft);
        console.log("document.getElementById('poem-content').clientWidth", document.getElementById("poem-content").clientWidth);
        console.log("document.getElementById('poem-verse').clientWidth", document.getElementById("poem-verse").clientWidth);
        console.log(document.getElementById("poem-content").clientHeight);

        var poemContentHeight = document.getElementById("poem-content").clientHeight;

        if (this.state.showMean) {
            this.setState({
                showMean: false,
                word: e.target.innerHTML,
                left: e.target.offsetLeft,
                top: e.target.offsetTop,
                width: e.target.clientWidth,
                wordMean: "",
                wordMeanWidth: document.getElementById("poem-verse") && document.getElementById("poem-verse").clientWidth
            }, () => {
                if (document.getElementById("poem-verse-word-mean")) {
                    if (Number(this.state.top) / Number(poemContentHeight) > 1) {
                        this.setState({
                            meanTop: (Number(this.state.top) % Number(poemContentHeight)) - document.getElementById("poem-verse-word-mean").offsetHeight - 20 + 30
                        }, () => {
                            console.log("Number(this.state.top) % Number(poemContentHeight)", Number(this.state.top) % Number(poemContentHeight))
                            console.log("this.state.meanTop", this.state.meanTop);
                            console.log("document.getElementById('poem-verse-word-mean').offsetHeight", document.getElementById("poem-verse-word-mean").offsetHeight)
                        })
                    } else {
                        this.setState({
                            meanTop: this.state.top - document.getElementById("poem-verse-word-mean").offsetHeight - 20
                        }, () => {
                            console.log("Number(this.state.top) % Number(poemContentHeight)", Number(this.state.top) % Number(poemContentHeight))
                            console.log("this.state.meanTop", this.state.meanTop);
                            console.log("document.getElementById('poem-verse-word-mean').offsetHeight", document.getElementById("poem-verse-word-mean").offsetHeight)
                        })
                    }


                }
            })
        } else {
            this.setState({
                showMean: true,
                word: e.target.innerHTML,
                left: e.target.offsetLeft,
                top: e.target.offsetTop % poemContentHeight,
                width: e.target.clientWidth,
                wordMean: mean,
                wordMeanWidth: document.getElementById("poem-verse") && document.getElementById("poem-verse").clientWidth
            }, () => {
                if (document.getElementById("poem-verse-word-mean")) {
                    this.setState({
                        meanTop: (Number(this.state.top) % Number(poemContentHeight)) - document.getElementById("poem-verse-word-mean").offsetHeight - 20
                    }, () => {
                        console.log("this.state.meanTop", this.state.meanTop);
                        console.log("document.getElementById('poem-verse-word-mean').offsetHeight", document.getElementById("poem-verse-word-mean").offsetHeight)
                    })
                }
            })
        }
        // console.log(document.getElementById("poem-verse-word-mean"))

    }

    renderPoemVerse = () => {
        if (this.state.data['type'] == "诗") {
            return (
                <div id="poem-verse" className='poem-verse'>
                    {this.state.data && this.state.data['shiwen'].map((shiwenV, shiwenK) => {
                        console.log("shiwenV is:", shiwenV);
                        return (
                            <p className='poem-verse-item'>
                                {shiwenV.map((wordV, wordK) => {
                                    if (wordV.yi) {
                                        return <span className='poem-verse-word' onClick={this.showMean.bind(this, wordV.yi)}>
                                            {wordV.ci}
                                            {this.state.showMean && this.state.wordMean && this.state.word == wordV.ci ? (<div id='poem-verse-word-mean' className='poem-verse-word-mean' style={{ width: this.state.wordMeanWidth * 0.92 + 'px', height: '12vw', top: ' -15vw', left: -(this.state.left - 25) + 'px' }}>
                                                <span>{this.state.word}：</span>{this.state.wordMean}
                                            </div>) : null}
                                            {this.state.showMean && this.state.wordMean && this.state.word == wordV.ci ? (<div className='triangle-icon' style={{ left: (this.state.width / 2 - 10) + 'px', top: '-2vw' }}></div>) : null}
                                        </span>
                                    } else {
                                        return <span>{wordV.ci}</span>
                                    }
                                })}
                            </p>
                        )
                    })}
                </div>
            )
        } else {
            return (
                <div id="poem-verse" className='poem-verse'>
                    {this.state.data && this.state.data['shiwen'].map((shiwenV, shiwenK) => {
                        console.log("shiwenV is:", shiwenV);
                        return (
                            <p className='poem-verse-item poem-verse-item-ci'>
                                {shiwenV.map((wordV, wordK) => {
                                    if (wordV.yi) {
                                        return <span className='poem-verse-word poem-verse-word-ci' onClick={this.showMean.bind(this, wordV.yi)}>
                                            {wordV.ci}
                                            {this.state.showMean && this.state.wordMean && this.state.word == wordV.ci ? (<div id='poem-verse-word-mean' className='poem-verse-word-mean' style={{ width: this.state.wordMeanWidth * 0.92 + 'px', height: '12vw', top: ' -14vw', left: -(this.state.left - 25) + 'px' }}>
                                                <span>{this.state.word}：</span>{this.state.wordMean}
                                            </div>) : null}
                                            {this.state.showMean && this.state.wordMean && this.state.word == wordV.ci ? (<div className='triangle-icon' style={{ left: (this.state.width / 2 - 10) + 'px', top: '-1vw' }}></div>) : null}
                                        </span>
                                    } else {
                                        return <span>{wordV.ci}</span>
                                    }
                                })}
                            </p>
                        )
                    })}
                </div>
            )
        }
    }

    renderPoemTitle = () => {
        if (this.state.data && this.state.data['name'].length <= 4) {
            return (
                <div className='poem-content-name-bg'>
                    <img src={require('./../../images/poem-name-bg.png')} />
                    <div className='poem-content-name'><span>{this.state.data['name']}</span></div>
                </div>
            )
        } else if (this.state.data && this.state.data['name'].length > 4 && this.state.data['name'].length <= 8) {
            return (
                <div className='poem-content-name-bg' style={{ width: '100%', }}>
                    <img src={require('./../../images/poem-name-bg.png')} />
                    <div className='poem-content-name'><span>{this.state.data['name']}</span></div>
                </div>
            )
        } else if (this.state.data && this.state.data['name'].length > 8 && this.state.data['name'].length <= 16) {
            return (
                <div className='poem-content-name-bg' style={{ width: '100%', height: '30%', }}>
                    <img src={require('./../../images/poem-name-bg.png')} />
                    <div className='poem-content-name'><span style={{ fontSize: '4vw', lineHeight: '4.2vw' }}>{this.state.data['name']}</span></div>
                </div>
            )
        } else if (this.state.data && this.state.data['name'].length > 16 && this.state.data['name'].length <= 33) {
            return (
                <div className='poem-content-name-bg' style={{ width: '100%', height: '30%', }}>
                    <img src={require('./../../images/poem-name-bg.png')} />
                    <div className='poem-content-name'><span style={{ fontSize: '4vw', lineHeight: '4.1vw' }}>{this.state.data['name']}</span></div>
                </div>
            )
        } else {
            return (
                <div className='poem-content-name-bg' style={{ width: '100%', height: '30%', }}>
                    <img src={require('./../../images/poem-name-bg.png')} />
                    <div className='poem-content-name'><span style={{ fontSize: '3vw', lineHeight: '3.1vw' }}>{this.state.data['name']}</span></div>
                </div>
            )
        }

    }

    renderStar = () => {
        console.log("this.state.data['star']", this.state.data['star'])
        console.log("this.state.data['star'] != undefined", this.state.data['star'] != undefined);
        if (this.state.data['star'] != undefined) {
            if (this.state.data['star'] == 0) {
                return (
                    <div className='poem-other'>
                        <div className='poem-mastery-degree'>
                            <span className=''>掌握度：</span>
                            <div className='stars'>
                                <span className='star'><img src={require('./../../images/star-gray.png')} /></span>
                                <span className='star'><img src={require('./../../images/star-gray.png')} /></span>
                                <span className='star'><img src={require('./../../images/star-gray.png')} /></span>
                            </div>
                        </div>
                        <div className='study-poem'>
                            <span>学习诗词</span>
                            <i className='study-poem-icon'><img src={require('./../../images/next.png')} /></i>
                        </div>
                    </div>
                )
            } else if (this.state.data['star'] == 1) {
                return (
                    <div className='poem-other'>
                        <div className='poem-mastery-degree'>
                            <span className=''>掌握度：</span>
                            <div className='stars'>
                                <span className='star'><img src={require('./../../images/star-yellow.png')} /></span>
                                <span className='star'><img src={require('./../../images/star-gray.png')} /></span>
                                <span className='star'><img src={require('./../../images/star-gray.png')} /></span>
                            </div>
                        </div>
                        <div className='study-poem'>
                            <span>学习诗词</span>
                            <i className='study-poem-icon'><img src={require('./../../images/next.png')} /></i>
                        </div>
                    </div>
                )
            } else if (this.state.data['star'] == 2) {
                return (
                    <div className='poem-other'>
                        <div className='poem-mastery-degree'>
                            <span className=''>掌握度：</span>
                            <div className='stars'>
                                <span className='star'><img src={require('./../../images/star-yellow.png')} /></span>
                                <span className='star'><img src={require('./../../images/star-yellow.png')} /></span>
                                <span className='star'><img src={require('./../../images/star-gray.png')} /></span>
                            </div>
                        </div>
                        <div className='study-poem'>
                            <span>学习诗词</span>
                            <i className='study-poem-icon'><img src={require('./../../images/next.png')} /></i>
                        </div>
                    </div>
                )
            } else if (this.state.data['star'] == 3) {
                return (
                    <div className='poem-other'>
                        <div className='poem-mastery-degree'>
                            <span className=''>掌握度：</span>
                            <div className='stars'>
                                <span className='star'><img src={require('./../../images/star-yellow.png')} /></span>
                                <span className='star'><img src={require('./../../images/star-yellow.png')} /></span>
                                <span className='star'><img src={require('./../../images/star-yellow.png')} /></span>
                            </div>
                        </div>
                        <div className='study-poem'>
                            <span>学习诗词</span>
                            <i className='study-poem-icon'><img src={require('./../../images/next.png')} /></i>
                        </div>
                    </div>
                )
            }
        } else {
            return null;
        }

    }
    renderPoemRight = (nav) => {
        if (nav === "原文") {
            return (
                <div className='poem-right' style={{ opacity: nav === "原文" ? "1" : "0" }}>
                    <div className='poem-type'>
                        <span className='poem-type-item'>{this.state.data['genre']}</span>
                        {this.state.data['subject'] && this.state.data['genre'] ? <p className='poem-type-dot'>·</p> : null}
                        <span className='poem-type-item'>{this.state.data['subject']}</span>
                    </div>
                    <div id='poem-content' className='poem-content'>
                        {this.renderPoemTitle()}
                        <div className='poem-content-info'>
                            <span className='poem-dynasty'>{this.state.data['chaodai']}</span>
                            <span>/</span>
                            {console.log(this.state.data['zuozhe'])}
                            {console.log(this.state.data['zuozhe'] && this.state.data['zuozhe'][0])}
                            {
                                this.state.data['zuozhe'] && this.state.data['zuozhe'][1] == "1" ? (<a className='poem-poet' href={`${document.location.toString().split("?")[0]}?tid=${this.props.tid}&skey=undefined&entityname=${this.state.data['zuozhe'][0]}&entitytype=诗人&propname=作品`}>{this.state.data['zuozhe'] && this.state.data['zuozhe'][0]}</a>) : (<span>{this.state.data['zuozhe'] && this.state.data['zuozhe'][0]}</span>)
                            }
                        </div>
                        {this.renderPoemVerse()}
                    </div>
                    {this.renderStar()}
                </div>
            )
        } else if (nav === "译文") {
            return (
                <div className='poem-right' style={{ opacity: nav === "译文" ? "1" : "0" }}>
                    <div className='on-off-btn' onClick={this.toggleBtn}>
                        <div className={`on-off-btns ${this.state.on ? '' : 'on-off-btns-active'}`}>
                            <div className='off-btn'>
                                <span className='off-btn-txt'>逐句翻译</span>
                                <span className='off-circle-btn'>关</span>
                            </div>
                            <div className='on-btn'>
                                <span className='on-circle-btn'>开</span>
                                <span className='on-btn-txt'>逐句翻译</span>
                            </div>
                        </div>
                    </div>
                    <div className='poem-translate-wrap'>
                        <div className={`poem-translate ${this.state.on ? '' : 'poem-translate-active'}`}>
                            <div className='poem-translate-each'>
                                {this.state.data && this.state.data['fanyi'].map((fanyiV, fanyiK) => {

                                    return fanyiV.yuanwen ? (<div className='poem-translate-each-item'>
                                        <p className='poem-translate-each-item-original'>{fanyiV.yuanwen}</p>
                                        <p className='poem-translate-each-item-translation'>{fanyiV.yiwen}</p>
                                    </div>) : null
                                })}
                            </div>
                            <div className='poem-translate-all'>
                                {this.state.data && this.state.data['fanyi'].map((fanyiV, fanyiK) => {
                                    return <p className='poem-translate-all-item-translation'>{fanyiV.yiwen}</p>
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else if (nav === "赏析") {
            return (
                <div className='poem-right' style={{ opacity: nav === "赏析" ? "1" : "0" }}>
                    <div className='poem-appreciation'>
                        {this.state.data && this.state.data['shangxi'].map((shangxiV, shangxiK) => {
                            return <p className='poem-appreciation-item'>{shangxiV}</p>
                        })}
                    </div>
                </div>
            )
        }
    }

    renderNav = () => {
        return (
            <div className='poem-nav'>
                {this.state.navData.map((navV, navK) => {
                    return (
                        <div className='poem-nav-item' onClick={this.chooseNav.bind(this, navV)}>
                            {navV === this.state.nav ? (
                                <img src={require('./../../images/blue.png')} />)
                                : (<img src={require('./../../images/white.png')} />)}
                            <span className='poem-nav-item-title' style={{ color: navV === this.state.nav ? '#fff' : '' }}>{navV}</span>
                        </div>
                    )
                })}
            </div>
        )
    }

    goBack = () => {
        if (document.referrer) {
            window.history.back();
        }
    }

    render() {
        return (
            <div className='poem-wrap'>
                <div className='main-bg'>
                    <img src={require('./../../images/main-bg.png')} />
                </div>
                <div className='bg'>
                    {document.referrer ? (<div className='poem-back-btn' onClick={this.goBack}>
                        <img src={require('./../../images/back.png')} />
                    </div>) : null}

                    <img src={require('./../../images/bg.png')} />
                    <div className='poem-left'>
                        {this.renderNav()}
                        {this.state.data && this.state.data['biaoqian'].length ? (<div className='poem-tags-wrap'>
                            <div className='poem-tag-title'>
                                <img src={require('./../../images/tag.png')} />
                            </div>
                            <div className='poem-tags'>
                                {this.state.data && this.state.data['biaoqian'].map((tagV, tagK) => {
                                    return <a className='poem-tag-item' href={`${document.location.toString().split("?")[0]}?tid=${this.props.tid}&skey=undefined&entityname=${tagV}&entitytype=诗名&propname=作者&typeflg=诗名列表`}>{tagV}</a>
                                })}
                            </div>
                        </div>) : null}

                    </div>
                    {this.renderPoemRight(this.state.nav)}
                </div>
            </div>
        )
    }
}

export default Poem