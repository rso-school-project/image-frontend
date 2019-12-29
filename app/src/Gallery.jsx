import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTimes, faChevronLeft, faChevronRight, faShare, faTrash, faComments, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Fab } from 'react-tiny-fab';
import 'react-tiny-fab/dist/styles.css';
import { Modal, Button, Spinner } from 'react-bootstrap';

import sample1 from './static/img/sample1.jpg';
import sample2 from './static/img/sample2.jpg';
import sample3 from './static/img/sample3.jpg';

library.add(faTimes, faChevronLeft, faChevronRight, faShare, faTrash, faComments, faPlus);

export default class Gallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      isImageShown: false,
      selectedImage: null,
      showUploadModal: false,
      isUploading: false,
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

  handleCloseUploadModal = () => {
    if (!this.state.isUploading) {
      this.setState({
        showUploadModal: false,
        uploadError: "",
      });
    }
  }

  handleOpenUploadModal = () => {
    this.setState({
      showUploadModal: true,
    });
  }



  uploadImage = () => {
    let imageInput = document.getElementById('imageFile');
    if (!imageInput.files || imageInput.files.length <= 0) {
      this.setState({ uploadError: "Please select a file." });
      return;
    }
    if (imageInput.files.length > 1) {
      this.setState({ uploadError: "Please select one file." });
      return;
    }
    if (!imageInput.files[0].type.startsWith("image/")) {
      this.setState({ uploadError: "The selected file must be an image." });
      return;
    }

    this.setState({ isUploading: true, uploadError: "" });

    // TODO: API call.
    setTimeout(() => {
      // TODO: Get the new list of images.
      this.setState({ isUploading: false, showUploadModal: false });
    }, 1000);
  }

  render() {
    const { images, isImageShown, selectedImage, showUploadModal, uploadError, isUploading } = this.state;
    const { shared } = this.props;
    return (
        <React.Fragment>
          {!isImageShown && !shared && !showUploadModal && <Fab
            icon={<FontAwesomeIcon icon="plus" />}
            onClick={this.handleOpenUploadModal}
          />}

          <Modal show={showUploadModal} onHide={this.handleCloseUploadModal}>
            <Modal.Header>
              <Modal.Title>Upload an image</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Please select an image.</p>
              <input disabled={isUploading} type="file" id="imageFile" accept="image/*" />
              <p style={{ color: "red" }}>{uploadError}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" disabled={isUploading} onClick={this.handleCloseUploadModal}>
                Close
              </Button>
              <Button variant="primary" disabled={isUploading} onClick={this.uploadImage}>
                {isUploading? <span><Spinner size="sm" animation="grow" />Uploading...</span> : <span>Upload</span>}
              </Button>
            </Modal.Footer>
          </Modal>

          <div style={{ padding: "2%" }}>
            {images && images.length > 0
              ? images.map((img, i) => {
                return (<div key={i} className="grow m-2 float-left"><img onClick={() => this.showImage(i)} className=" gallery-img" src={img} alt={`img${i}`} /></div>);
              })
              : <p>No images available.</p>
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
            <div className="fullscreen-img-description">
              <b>{images[selectedImage].split("/").slice(-1)[0]}</b>
              <br/>
              Description
            </div>
           </React.Fragment>}
        </React.Fragment>
    );
  }
}

