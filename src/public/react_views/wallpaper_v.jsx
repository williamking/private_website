'use strict';

const React = require('react');
const ReactDOM = require('react-dom');

const wallpapers = [
  'http://article.joyme.com/article/uploads/allimg/141208/1U505A26-14.jpg',
  'http://h.hiphotos.baidu.com/zhidao/wh%3D450%2C600/sign=21e436def0246b607b5bba70dec8367a/8326cffc1e178a8226ec172df003738da877e86f.jpg'
];

// css
require('../sass/wallpapers.sass');

class WallPaper extends React.Component {
  constructor(props) {
    super(props);
    this.displayName = 'WallPaper';
  }

  state = {
    wallPapers: this.props.srcs
  }

  getWallpapers = () => {
    let items = [];
    this.props.srcs.forEach((src, key) => {
      let style = {
        backgroundImage: `url(${src})`,
        animationDelay: key * 6 + 's'
      };
      items.push(<li key={ key }><span style={ style }></span></li>);
    });
    return items;
  }

  render() {
    let wallPapers = this.getWallpapers();
    return (
      <section className="wallpaper-wrapper">
        <ul className="slides-show">
          { wallPapers }
        </ul>
    </section>);
  }
}

$(function() {
  ReactDOM.render(<WallPaper srcs={ wallpapers }/>, $("#wallpaper-slider")[0], null);
});
