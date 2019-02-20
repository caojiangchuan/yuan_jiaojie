import React, { Component } from 'react';
import config from './../../config';

//style
import "../common.css";
import './index.css';

const data = {
    "name": "春天",
    "zuopin": [
        {
            "biaoti": "《春日》",
            "chaodai": "宋",
            "zuozhe": "朱熹"
        },
        {
            "biaoti": "《咏柳》",
            "chaodai": "唐",
            "zuozhe": "贺知章"
        },
        {
            "biaoti": "《泊船瓜洲》",
            "chaodai": "宋",
            "zuozhe": "王安石"
        },
        {
            "biaoti": "《春夜喜雨》",
            "chaodai": "唐",
            "zuozhe": "杜甫"
        },
    ]
}

class Poem extends Component {
    constructor() {
        super();
        this.state = {

        }
    }

    fetch = (params = {}) => {
        var that = this;
        fetch(`${config.host}:${config.port}/shici/tag?tid=${this.props.tid}&name=${this.props.entityName}`).then(function (res) {
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
    }

    render() {
        return (
            <div className='tag-poem-wrap'>
                <div className='main-bg'>
                    <img src={require('./../../images/main-bg.png')} />
                </div>
                <div className='bg'>
                    <img src={require('./../../images/bg-no.png')} />
                    <div className='tag-poem-info'>
                        <div className='tag-poem-title'>关于<span className='tag-name'>“{this.props.entityName}”</span>的诗句</div>
                        <div className='tag-poem-content'>
                            {this.state.data && this.state.data['zuopin'].map((zuopinV, zuipinK) => {
                                return (
                                    <div className='tag-poem-content-item'>
                                        <a style={{ display: 'inline-block', width: '100%' }} href={`${document.location.toString().split("?")[0]}?tid=${this.props.tid}&skey=undefined&entityname=${zuopinV.uq.split("_")[0]}&entitytype=诗名&propname=作者&poemtitle=${zuopinV.uq.split("_")[0]}&poemauthor=${zuopinV.uq.split("_")[1]}&firstsent=${zuopinV.uq.split("_")[2]}`}>
                                            <span>《{zuopinV.biaoti}》</span>
                                            <span>{zuopinV.chaodai}</span>
                                            <span>/</span>
                                            <span>{zuopinV.zuozhe}</span>
                                        </a>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Poem