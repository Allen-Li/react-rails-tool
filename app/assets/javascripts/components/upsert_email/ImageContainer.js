import React, { Component, PropTypes } from 'react';
import Dropzone from 'react-dropzone';
import * as Service from '../shared/service';

export default class ImageContainer extends Component {
  constructor(props) {
    super(props)
  }

  onDrop(acceptedFiles) {
    acceptedFiles.forEach((file, key) => {
      this.getBase64(file)
    }, this)
  }

  getBase64 = (file) => {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    var _this = this
    reader.onload = function () {
      let images_data = {asset: reader.result, asset_file_name: file.name}
      _this.props.setImagesState(images_data)
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  renderUploadResult() {
    var total_index = this.props.images.length - 1
    return this.props.images.map((image, index) => {
      return(
        <div className="image-preview" key={index}>
          <div className="image-container">
            <img className="image-thum" src={image.asset} />
          </div>
          <div className="image-info">
            <p><b>Image Name : </b>{image.asset_file_name}</p>
            <p><b>Sort : </b> {index + 1}</p>
            <div className="form-group row">
              <label className="control-label col-sm-1">Link:</label>
              <div className="col-sm-11">
                <input type="text" className={"form-control"} id="inputName" placeholder="Image Link"
                  onChange={this.props.setImageInfo.bind(this, 'link', index)}></input>
              </div>
            </div>
            <div className="form-group row">
              <label className="control-label col-sm-1">Alt:</label>
              <div className="col-sm-11">
                <input type="text" className={"form-control"} id="inputName" placeholder="Image Alt"
                  onChange={this.props.setImageInfo.bind(this, 'alt', index)}></input>
              </div>
            </div>
            <div className="image-action">
              <button type="button" className="btn btn-info" onClick={this.props.swapImage.bind(this, index, 'up')} 
                disabled={index == 0} >Up</button>
              <button type="button" className="btn btn-info" onClick={this.props.swapImage.bind(this, index, 'down')}
                disabled={index == total_index} >Down</button>
              <button type="button" className="btn btn-danger delete-email" 
                onClick={this.props.removeImage.bind(this, index)}>Delete</button>
            </div>
          </div>
        </div>
      )
    })
  }

  render() {
    return(
      <div>
        <div className={`drop-zone ${this.props.image_drop_zone_class}`}>
          <Dropzone onDrop={this.onDrop.bind(this)} multiple disablePreview accept="image/*">
            <p className="prompt">Dropping some Images here, or click to select images to upload.</p>
          </Dropzone>
        </div>
        {this.renderUploadResult()}
      </div>
    )
  }
}