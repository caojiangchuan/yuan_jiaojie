import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
// import { withRouter } from "react-router-dom";
import PropTypes from 'prop-types';
import Word from './component/word/word';
// import Poem from './component/poem/poem';
import Terms from './component/terms/terms';
import Chengyu from './component/chengyu/chengyu';



class App extends React.Component {
  constructor() {
    super();
    this.state = {

    }
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

  stringReplace = (str) => {
    //去掉" "号
    str = str.replace(/\"/g, "");
    return str;
  }

  componentDidMount() {
    // console.log("in APP this props is ", this.state);

  }

  render() {
    // console.log("window.location.href is :", window.location.href)
    var entityTypeString = this.getQueryString("entitytype");
    var entityType = this.stringReplace(entityTypeString);

    var entityNameString = this.getQueryString("entityname");
    var entityName = this.stringReplace(entityNameString);

    var propNameString = this.getQueryString("propname");
    var propName = this.stringReplace(propNameString);

    var sKeyString = this.getQueryString("skey");
    var sKey = this.stringReplace(sKeyString);

    var tidString = this.getQueryString("tid");
    var tid = this.stringReplace(tidString);

    switch (entityType) {
      case "汉字":
        return <Word name={entityName} type={entityType} propname={propName} tid={tid} skey={sKey} num={0} />
        break;
      case "成语":
        return <Chengyu name={entityName} type={entityType} propname={propName} tid={tid} skey={sKey} />
        break;
      case "词语":
        return <Terms name={entityName} type={entityType} propname={propName} tid={tid} skey={sKey} />
        break;
      default:
        return <Terms name={entityName} type={entityType} propname={propName} tid={tid} skey={sKey} />
    }
  }
}

export default App;
