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
    wallPapers: [],
    completed: 0
  }

  getWallpapers = () => {
    let items = [];
    if (this.state.wallPapers.length == this.state.completed) {
      this.state.wallPapers.forEach((paper, key) => {
        let style = {
          backgroundImage: `url(${paper.src})`,
          animationDelay: key * 6 + 's',
          opacity: 0
        };
        items.push(<li key={ key }><span style={ style }></span></li>);
      });
    } else {
      let style = {
        backgroundColor: 'white'
      };
      items = [(<li key="0"><span style={ style }></span></li>)]
    }
    return items;
  }

  componentDidMount() {
    let images = [];
    this.props.srcs.forEach((src) => {
      let image = new Image();
      image.src = `/images/${src}`;
      image.onload = () => {
        this.setState({
          completed: this.state.completed + 1
        });
      };
      images.push(image);
    });
    this.setState({
      wallPapers: images
    });
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
