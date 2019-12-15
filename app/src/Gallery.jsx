import React from 'react';

import sample1 from './static/img/sample1.jpg';
import sample2 from './static/img/sample2.jpg';
import sample3 from './static/img/sample3.jpg';

export default class Gallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
    };
  }

  componentDidMount() {
    if (this.props.shared) {

    }
    else {
      this.setState({
        images: [sample1, sample2, sample3, sample1, sample2, sample3, sample1, sample2, sample3],
      });
    }
  }

  render() {
    const { images } = this.state;
    return (
      <div style={{ padding: "2%" }}>
        {images && images.length > 0
          ? images.map((img, i) => {
            return (<div className="grow m-2 float-left"><img className=" gallery-img" src={img} alt={`img${i}`} /></div>);
          })
          : "No images available"
        }
      </div>
    );
  }
}

