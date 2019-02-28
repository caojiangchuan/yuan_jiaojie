import React, { Component } from 'react';
import config from './../../config';

//style
import "../common.css";
import './index.css';

class Author extends Component {
    constructor() {
        super();
        this.state = {
            nav: "简介",
            on: true,
            navData: ['简介', '作品']
        }
    }



    chooseNav = (nav) => {
        this.setState({
            nav: nav
        })
    }

    fetch = (params = {}) => {
        var that = this;
        fetch(`${config.host}:${config.port}/shici/poet?tid=${this.props.tid}&name=${this.props.entityName}`).then(function (res) {
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
        console.log("window.location.href", window.location.href)
        console.log("window.location.host;", window.location.host)
        console.log(document.location.toString().split("?")[0]);
        if (this.props.propname == "作品") {
            this.setState({
                nav: "作品"
            })
        } else if (this.props.propname == "简介") {
            this.setState({
                nav: "简介"
            })
        } else {
            this.setState({
                nav: "简介"
            })
        }
    }

    goBack = () => {
        if (document.referrer) {
            window.history.back();
        }
    }

    renderNav = () => {
        return (
            <div className='author-nav-wrap'>
                {this.state.navData.map((navV, navK) => {
                    return (
                        <div className='author-nav-item' onClick={this.chooseNav.bind(this, navV)}>
                            {navV === this.state.nav ? (
                                <img src={require('./../../images/blue.png')} />)
                                : (<img src={require('./../../images/white.png')} />)}
                            <span className='author-nav-item-title' style={{ color: navV === this.state.nav ? '#fff' : '' }}>{navV}</span>
                        </div>
                    )
                })}
            </div>
        )
    }

    renderAuthorRight = (nav) => {
        if (this.state.data) {
            if (nav === "简介") {
                return (
                    <div className='author-right'>
                        <div className='author-info'>
                            {this.state.data['jianjie'].map((jianjieV, jianjieK) => {
                                return <p className='author-info-item'>{jianjieV}</p>
                            })}
                        </div>
                    </div>
                )
            } else if (nav === "作品") {
                return (
                    <div className='author-right'>
                        <div className='author-works'>
                            {this.state.data['zuopin'].map((zuopinV, zuopinK) => {
                                return (
                                    <div className='author-works-item'>
                                        <a style={{ display: 'inline-block' }} href={`${document.location.toString().split("?")[0]}?tid=${this.props.tid}&skey=undefined&entityname=${zuopinV.biaoti}&entitytype=诗名&propname=作者&md=${zuopinV.uq}`}>
                                            {console.log("this.state.data", zuopinV.uq.split("_"))}
                                            <h3 className='author-works-item-title'>{zuopinV.biaoti}</h3>
                                            <p className='author-works-item-content'>{zuopinV.shiwen}</p>
                                        </a>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
            }
        }

    }


    render() {
        return (
            <div className='author-wrap'>
                <div className='main-bg'>
                    <img src={require('./../../images/main-bg.png')} />
                </div>
                <div className='bg'>
                    {document.referrer ? (<div className='poem-back-btn' onClick={this.goBack}>
                        <img src={require('./../../images/back.png')} />
                    </div>) : null}
                    <img src={require('./../../images/bg.png')} />
                    <div className='author-left'>
                        <div className='author-name-wrap'>
                            <img src={require('./../../images/poem-name-bg.png')} />
                            <span className='author-name'>{this.props.entityName}</span>
                        </div>
                        {this.renderNav(this.state.nav)}
                    </div>
                    {this.renderAuthorRight(this.state.nav)}
                </div>
            </div>
        )
    }
}

export default Author