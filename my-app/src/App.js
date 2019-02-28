import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
// import { withRouter } from "react-router-dom";
// import PropTypes from 'prop-types';
// import Word from './component/word/word';
import Poem from './component/poem/index';
import Author from './component/author/index';
import TagPoem from './component/tagsPoem/index';



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
    if (str) {
      str = str.replace(/\"/g, "");
    }

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

    var poemTitleString = this.getQueryString("poemtitle");
    var poemTitle = this.stringReplace(poemTitleString);

    var poemAuthorString = this.getQueryString("poemauthor");
    var poemAuthor = this.stringReplace(poemAuthorString);

    var firstsentString = this.getQueryString("firstsent");
    var firstsent = this.stringReplace(firstsentString);

    var tagString = this.getQueryString("tag");
    var tag = this.stringReplace(tagString);

    var tidString = this.getQueryString("tid");
    var tid = this.stringReplace(tidString);

    var sKeyString = this.getQueryString("skey");
    var sKey = this.stringReplace(sKeyString);

    var authorString = this.getQueryString("author");
    var author = this.stringReplace(authorString);

    var mdString = this.getQueryString("md");
    var md = this.stringReplace(mdString);

    var typeflgString = this.getQueryString("typeflg");
    var typeflg = this.stringReplace(typeflgString);


    if (typeflg) {
      return <TagPoem type={entityType} tid={tid} entityName={entityName} tag={tag} />
    } else {
      if (entityType == "诗名") {
        return <Poem type={entityType} tid={tid} uq={md} propname={propName} />
      } else if (entityType == "诗句") {
        return <Poem type={entityType} tid={tid} uq={md} propname={propName} />
      } else if (entityType == "诗人") {
        return <Author type={entityType} tid={tid} entityName={entityName} author={author} propname={propName} />
      } else {
        return null
      }
    }
    // switch (entityType) {
    //   case "诗名":
    //     return <Poem type={entityType} tid={tid} uq={`${poemTitle}_${poemAuthor}_${firstsent}`} />
    //   case "诗句":
    //     return <Poem type={entityType} tid={tid} uq={`${poemTitle}_${poemAuthor}_${firstsent}`} />
    //   case "诗人":
    //     return <Author type={entityType} tid={tid} entityName={entityName} author={author} />
    //   case "诗词列表":
    //     return <TagPoem type={entityType} tid={tid} entityName={entityName} tag={tag} />
    // }

  }
}

export default App;
