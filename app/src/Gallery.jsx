import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTimes, faChevronLeft, faChevronRight, faShare, faTrash, faComments, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Fab } from 'react-tiny-fab';
import { Modal, Button, Spinner, Toast } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';

import { config } from "./config";

library.add(faTimes, faChevronLeft, faChevronRight, faShare, faTrash, faComments, faPlus);


function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = (performance && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : ((r & 0x3) | 0x8)).toString(16);
    });
}


export default class Gallery extends React.Component {
  constructor(props) {
    super(props);

    this.abortController = new AbortController();

    this.state = {
      images: [],
      isImageShown: false,
      selectedImage: null,
      showUploadModal: false,
      showSharingModal: false,
      isUploading: false,
      showComments: false,
      allUsers: null,
      usersSharing: [],
      commentInput: "",
    };
  }

  componentDidMount() {
    fetch(config.host + "user-handler/api/v1/users", {
    //fetch("http://localhost:8003/api/v1/users", {
      method: "GET",
      headers: {
        "unique_log_id": generateUUID()
      },
      signal: this.abortController.signal
    })
    .then(response => {
      if (response.status === 200) {
        return response.json();
      }
    })
    .then(data => {
      if (data) {
        this.setState({
          allUsers: data.filter(x => x.username !== this.props.user.username),
          userMapper: data.reduce((acc, x) => { return {...acc, [x.id]: x.username}; }, {})
        });
      }
    })
    .catch(error => {
      console.log(error);
    });

    if (this.props.shared) {
      fetch(config.host + `image-handler/api/v1/shared-images/user/${this.props.user.id}`, {
      //fetch(`http://localhost:8002/api/v1/shared-images/user/${this.props.user.id}`, {
        method: "GET",
        headers: {
          "unique_log_id": generateUUID()
        },
        signal: this.abortController.signal
      })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        }
      })
      .then(data => {
        if (data) {
          this.setState({ ...data });
        }
      })
      .catch(error => {
        console.log(error);
        this.setState({ imageLoadingError: "Service not available." });
      });
    }
    else {
      fetch(config.host + `image-handler/api/v1/images/user/${this.props.user.id}`, {
      //fetch(`http://localhost:8002/api/v1/images/user/${this.props.user.id}`, {
        method: "GET",
        headers: {
          "unique_log_id": generateUUID()
        },
        signal: this.abortController.signal
      })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        }
      })
      .then(data => {
        if (data) {
          this.setState({ ...data });
        }
      })
      .catch(error => {
        console.log(error);
        this.setState({ imageLoadingError: "Service not available." });
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

  deleteImage = (e) => {
    e.preventDefault();
    const { images, selectedImage } = this.state;

    if (this.props.shared) {
      fetch(config.host + `image-sharing/api/v1/share/image/${images[selectedImage].id}/user/${this.props.user.id}`, {
      //fetch(`http://localhost:8001/api/v1/share/image/${images[selectedImage].id}/user/${this.props.user.id}`, {
        method: "DELETE",
        headers: {
          "unique_log_id": generateUUID()
        },
        signal: this.abortController.signal
      })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        }
      })
      .then(data => {
        if (data) {
          this.setState((prev) => {
            let newComments = null;
            if (prev.comments) {
              newComments = [...prev.comments];
              newComments = newComments.filter((x, i) => i !== selectedImage);
            }
            return { images: prev.images.filter((x, i) => i !== selectedImage), isImageShown: false, comments: newComments }
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
    }
    else {
      fetch(config.host + `image-upload/api/v1/images/${images[selectedImage].id}`, {
        method: "DELETE",
        headers: {
          "unique_log_id": generateUUID()
        },
        signal: this.abortController.signal
      })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        }
      })
      .then(data => {
        if (data) {
          this.setState((prev) => {
            let newComments = null;
            if (prev.comments) {
              newComments = [...prev.comments];
              newComments = newComments.filter((x, i) => i !== selectedImage);
            }
            return { images: prev.images.filter((x, i) => i !== selectedImage), isImageShown: false, comments: newComments }
          });
        }
      })
      .catch(error => {
        console.log(error);
      });
    }
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
      uploadError: ""
    });
  }

  handleOpenSharingModal = () => {
    this.setState({
      showSharingModal: true,
      usersSharing: [],
      sharingError: ""
    });
  }

  handleCloseSharingModal = () => {
    this.setState({
      showSharingModal: false,
      usersSharing: [],
      sharingError: ""
    });
  }

  handleOpenComments = () => {
    this.setState({
      showComments: true,
      commentInput: "",
      commentError: "",
    });
  }

  handleCloseComments = () => {
    this.setState({
      showComments: false,
      commentInput: "",
      commentError: "",
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

    //const data = { user_id: this.props.user.id, file: imageInput.files[0] };

    let data = new FormData();
    data.append("file", imageInput.files[0]);
    data.append("user_id", this.props.user.id);

    fetch(config.host + "image-upload/api/v1/images", {
      method: "POST",
      body: data,
      headers: {
        "unique_log_id": generateUUID()
      },
      signal: this.abortController.signal
    })
    .then(response => {
      if (response.status === 200) {
        return response.json();
      } else {
        if (response.status === 400)
          this.setState({ uploadError: "The provided file is not an image.", isUploading: false })
        else
          this.setState({ uploadError: "Service currently unavailable.", isUploading: false })
      }
    })
    .then(data => {
      if (data) {
        this.setState((prev) => {
          let newComments = null;
          if (prev.comments) {
            newComments = [...prev.comments];
            newComments.push([]);
          }
          return { uploadError: "", isUploading: false, showUploadModal: false, images: prev.images.concat([data]), comments: newComments }
        });
      }
    })
    .catch(error => {
      console.log(error);
      this.setState({ uploadError: "Service currently unavailable.", isUploading: false })
    });
  }

  share = () => {
    const { usersSharing, images, selectedImage } = this.state;
    
    const data = { shared_to_list: usersSharing.map((x) => x.id) };

    fetch(config.host + `image-sharing/api/v1/share/image/${images[selectedImage].id}`, {
    //fetch(`http://localhost:8001/api/v1/share/image/${images[selectedImage].id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "unique_log_id": generateUUID()
      },
      body: JSON.stringify(data),
      signal: this.abortController.signal
    })
    .then(response => {
      if (response.status === 200) {
        return response.json();
      } else {
        this.setState({ sharingError: "Service currently unavailable.", })
      }
    })
    .then(data => {
      if (data) {
        this.setState((prev) => {
          return { showSharingModal: false, usersSharing: [], sharingError: "" };
        });
      }
    })
    .catch(error => {
      console.log(error);
      this.setState({ sharingError: "Service currently unavailable.", })
    });
  }

  handleUsersSharingChange = (selectedOptions) => {
    this.setState({
      usersSharing: selectedOptions
    });
  }

  getImgSrc = (img) => {
    return `https://storage.googleapis.com/super_skrivni_bozickov_zaklad/${img.id}${img.file_hash}`;
  }

  setCommentInput = (e) => {
    this.setState({
      commentInput: e.target.value,
    });
  }

  postComment = () => {
    const { commentInput, images, selectedImage } = this.state;
    
    const data = { text: commentInput, user_id: this.props.user.id, image_id: images[selectedImage].id };

    fetch(config.host + `image-comments/api/v1/comments`, {
    //fetch(`http://localhost:8000/api/v1/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "unique_log_id": generateUUID()
      },
      body: JSON.stringify(data),
      signal: this.abortController.signal
    })
    .then(response => {
      if (response.status === 200) {
        return response.json();
      } else {
        this.setState({ commentError: "Service currently unavailable.", })
      }
    })
    .then(data => {
      if (data) {
        this.setState((prev) => {
          let newComments = null;
          if (prev.comments) {
            newComments = [...prev.comments];
            newComments[selectedImage].push(data);
          }
          return { commentError: "", commentInput: "", comments: newComments };
        });
      }
    })
    .catch(error => {
      console.log(error);
      this.setState({ commentError: "Service currently unavailable.", })
    });
  }

  render() {
    const {
      images,
      isImageShown,
      selectedImage,
      showUploadModal,
      uploadError,
      isUploading,
      showSharingModal,
      sharingError,
      showComments,
      allUsers,
      imageLoadingError,
      comments,
      userMapper,
      commentError,
      commentInput
    } = this.state;
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
              <input autoFocus disabled={isUploading} type="file" id="imageFile" accept="image/*" />
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

          <Modal style={{ zIndex: 1503 }} show={showSharingModal} onHide={this.handleCloseSharingModal}>
            <Modal.Header>
              <Modal.Title>Sharing options</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Please select the users.</p>
              <Typeahead
                autoFocus
                clearButton
                multiple
                labelKey={"username"}
                options={allUsers || []}
                placeholder="Select users..."
                id="usersSharing"
                onChange={this.handleUsersSharingChange}
              />
              <p style={{ color: "red" }}>{sharingError}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" disabled={isUploading} onClick={this.handleCloseSharingModal}>
                Close
              </Button>
              <Button variant="primary" disabled={isUploading} onClick={this.share}>
                Save
              </Button>
            </Modal.Footer>
          </Modal>

          <div style={{ padding: "2%" }}>
            {images && images.length > 0
              ? images.map((img, i) => {
                return (<div key={i} className="grow m-2 float-left"><img onClick={() => this.showImage(i)} className=" gallery-img" src={this.getImgSrc(img)} alt={img.file_name} /></div>);
              })
              : <p>{imageLoadingError || "No images available."}</p>
            }
          </div>

          {isImageShown && <React.Fragment>
            <div className="fullscreen-img-bg"></div>
            <img className="fullscreen-img" src={this.getImgSrc(images[selectedImage])} alt={"N/A"} />
            <div className="fullscreen-img-controls">
                <FontAwesomeIcon onClick={this.handleOpenComments} icon="comments" className="clickable mr-4" />
                {!shared && <FontAwesomeIcon onClick={allUsers ? this.handleOpenSharingModal : null} icon="share" className={allUsers ? "clickable mr-4" : "text-muted mr-4"} />}
                <span style={{ border: "1px solid white" }} />
                <FontAwesomeIcon onClick={(e) => this.setImage(e, selectedImage-1)} icon="chevron-left" className={selectedImage > 0 ? "clickable ml-4" : "text-muted ml-4"} />
                <FontAwesomeIcon onClick={(e) => this.setImage(e, selectedImage+1)} icon="chevron-right" className={selectedImage < images.length - 1 ? "clickable" : "text-muted"} />
                <FontAwesomeIcon onClick={(e) => this.hideImage(e)} icon="times" className="clickable ml-4 mr-4" />
                <span style={{ border: "1px solid white" }} />
                <FontAwesomeIcon style={{ color: "red"}} onClick={(e) => this.deleteImage(e)} icon="trash" className="clickable ml-4" />
            </div>
            <div className="fullscreen-img-description">
              <b>{images[selectedImage].file_name || ""}</b>
              <br/>
              Description.
            </div>

            {showComments && <div className="comments-container">

              {comments && comments.length && comments.length > selectedImage
                ? <React.Fragment>
                  {comments[selectedImage].map((comment, i) => {
                    return (<Toast key={i} style={{ maxWidth: "100%"}}>
                    <Toast.Header closeButton={false}>
                      <strong className="mr-auto">{(userMapper && userMapper[comment.user_id]) || "N/A"}</strong>
                      <small>today</small>
                    </Toast.Header>
                    <Toast.Body>{comment.text}</Toast.Body>
                  </Toast>)})}
                </React.Fragment>
                :
                <p>
                  Couldn't load comments.
                </p>
              }

              <br/><br/>

              <p style={{ color: "red" }}>{commentError}</p>

              <input style={{ width: "100%" }} autoFocus onChange={this.setCommentInput} value={commentInput} type="text" id="comment" placeholder="Enter a comment" />

              <br/><br/>

              <Button variant="primary" className="float-right mb-3" onClick={this.postComment}>
                Post
              </Button>
              <Button variant="secondary" className="float-right mb-3 mr-2" onClick={this.handleCloseComments}>
                Close
              </Button>
            </div>}
           </React.Fragment>}
        </React.Fragment>
    );
  }
}

