import React, { Component } from 'react';
import TabsControl from './../tabsControl/tabsControl';

//style
import "../common.css";
import './poem.css';

class Poem extends Component {
    constructor() {
        super();
        this.state = {
            poemList: []
        }
    }

    render() {
        return (
            <div className='main-wrap'>
                <div className='bg'>
                    <img src={require('../../images/bg.png')} />
                </div>
                <div className="teach-img">
                    <img src={require('../../images/teacher.png')} />
                </div>
                <div className="tab-wrap">
                    <TabsControl>
                        <div name="释义" className="display-flex-colomn">
                            <span className="display-flex-colomn-title">释义</span>
                            <div className="hr"></div>
                            <div className="display-flex-colomn-content">天空无云或云很少云很少天空很晴朗</div>
                        </div>
                        <div name="正文" className="display-flex-colomn">
                            <span className="ask">静夜思的作者是谁</span>
                            <span className="answer">李白</span>
                            <div className="poem-content display-flex-colomn">
                                <span className="poem-title">静夜思</span>
                                <p className="poem-author">李白<span className="poem-author-dynasty">(唐)</span></p>
                                <span className="poem-item">窗前明月光，</span>
                                <span className="poem-item">疑是地上霜。</span>
                                <span className="poem-item">举头望明月，</span>
                                <span className="poem-item">低头思故乡。</span>
                            </div>
                        </div>
                    </TabsControl>
                </div>

            </div>
        )
    }
}

export default Poem