import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTimes, faChevronLeft, faChevronRight, faShare, faTrash, faComments } from "@fortawesome/free-solid-svg-icons";

import sample1 from './static/img/sample1.jpg';
import sample2 from './static/img/sample2.jpg';
import sample3 from './static/img/sample3.jpg';

library.add(faTimes, faChevronLeft, faChevronRight, faShare, faTrash, faComments);

export default class Gallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      isImageShown: false,
      selectedImage: null,
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

  showImage = (i) => {
    this.setState({
        selectedImage: i,
        isImageShown: true,
    });
  }

  hideImage = (e) => {
    e.preventDefault();
    this.setState({
        isImageShown: false,
    });
  }

  setImage = (e, i) => {
    e.preventDefault();
    if (i >= 0 && i < this.state.images.length) {
        this.setState({
            selectedImage: i,
        });
    }
  }

  render() {
    const { images, isImageShown, selectedImage } = this.state;
    return (
        <React.Fragment>
          <div style={{ padding: "2%" }}>
            {images && images.length > 0
              ? images.map((img, i) => {
                return (<div className="grow m-2 float-left"><img onClick={() => this.showImage(i)} className=" gallery-img" src={img} alt={`img${i}`} /></div>);
              })
              : "No images available."
            }
          </div>

          {isImageShown && <React.Fragment>
            <div className="fullscreen-img-bg"></div>
            <img className="fullscreen-img" src={images[selectedImage]} alt={`img${selectedImage}`} />
            <div className="fullscreen-img-controls">
                <FontAwesomeIcon icon="comments" className="clickable mr-4" />
                <FontAwesomeIcon icon="share" className="clickable mr-4" />
                <span style={{ border: "1px solid white" }} />
                <FontAwesomeIcon onClick={(e) => this.setImage(e, selectedImage-1)} icon="chevron-left" className={selectedImage > 0 ? "clickable ml-4" : "text-muted ml-4"} />
                <FontAwesomeIcon onClick={(e) => this.setImage(e, selectedImage+1)} icon="chevron-right" className={selectedImage < images.length - 1 ? "clickable" : "text-muted"} />
                <FontAwesomeIcon onClick={(e) => this.hideImage(e)} icon="times" className="clickable ml-4 mr-4" />
                <span style={{ border: "1px solid white" }} />
                <FontAwesomeIcon style={{ color: "red"}} onClick={null} icon="trash" className="clickable ml-4" />
            </div>
           </React.Fragment>}
        </React.Fragment>
    );
  }
}

