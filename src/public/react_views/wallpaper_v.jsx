'use strict';

const React = require('react');
const ReactDOM = require('react-dom');

const wallpapers = [
  '1.jpg',
  '2.jpg',
  '3.jpg',
  '4.jpg',
  '5.jpg',
  '6.jpg',
  '7.jpg',
  '8.png',
  '9.jpg',
  '10.jpg',
];

// css
require('../sass/wallpapers.sass');

// shuffle function
function shuffle(arr) {
  let i = arr.length;
  while (i) {
    let j = parseInt(Math.random() * i);
    let x = arr[--i];
    arr[i] = arr[j];
    arr[j] = x;
  }
  return arr;
}

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
      let realSrc = '/images/' + src;
      let style = {
        backgroundImage: `url(${realSrc})`,
        animationDelay: key * 6 + 's',
        opacity: 0
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
  let wps = shuffle(wallpapers);
  ReactDOM.render(<WallPaper srcs={ wps }/>, $("#wallpaper-slider")[0], null);
});
