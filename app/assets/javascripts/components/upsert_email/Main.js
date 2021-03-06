import React, { Component, PropTypes } from 'react';
import * as Service from '../shared/service';
import Dropzone from 'react-dropzone';
import Select from 'react-select';
import DynamicInputField from './DynamicInputField';
import ImageContainer from './ImageContainer';

export default class UpsertEmail extends Component {
  constructor(props) {
    super(props)
    this.state = this.initState()
    this.templateSelectChange = this.templateSelectChange.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleEmailTypeChange = this.handleEmailTypeChange.bind(this)
    this.submit = this.submit.bind(this)
    this.renderEmailTypeBody = this.renderEmailTypeBody.bind(this)
    this.renderClientHtml = this.renderClientHtml.bind(this)
    this.renderCssContent = this.renderCssContent.bind(this)
    this.renderEmailType = this.renderEmailType.bind(this)
    this.successfulCallback = this.successfulCallback.bind(this)
  }

  initState() {
    return {
      email_data: this.props.initial_data || {
        name: '',
        tracking_pixels: [''],
        js_links: [''],
        css_links: [''],
        css_content: '',
        template_id: '',
        html: '',
        images_attributes: [],
        email_type: 'client_html'
      },
      name_class: '',
      template_select_class: '',
      html_area_class: '',
      is_valid: true
    }
  }

  templateSelectChange(template) {
    let new_email_data = Object.assign({}, this.state.email_data);
    new_email_data.template_id = template.value;
    this.setState({ email_data: new_email_data, template_select_class: '' });
  }

  updateDynamicInputValue(type, index, value) {
    let new_email_data = Object.assign({}, this.state.email_data);
    new_email_data[type][index] = value
    this.setState({ email_data: new_email_data})
  }

  deleteDynamicInputField(type, index) {
    let new_email_data = Object.assign({}, this.state.email_data);
    new_email_data[type].splice(index, 1)
    this.setState({ email_data: new_email_data})
  }

  submit(e) {
    e.preventDefault()
    let is_valid = true
    let name_class = ''
    let template_select_class = ''
    let html_area_class = ''
    let image_drop_zone_class = ''

    if (this.state.email_data.name == ''){
      name_class = 'valid-failed'
      is_valid = false
    }

    if (this.state.email_data.template_id == '') {
      template_select_class = 'valid-failed'
      is_valid = false
    }

    switch(this.state.email_data.email_type){
      case 'client_html':
        if(this.state.email_data.html == '') {
          html_area_class = 'valid-failed'
          is_valid = false
        }
        break
      case 'image':
        if(this.state.email_data.images_attributes.length == 0) {
          image_drop_zone_class = 'valid-failed'
          is_valid = false
        }
    }

    this.setState({
      name_class: name_class, 
      template_select_class: template_select_class,
      html_area_class: html_area_class,
      image_drop_zone_class: image_drop_zone_class,
      is_valid: is_valid
    })

    if(is_valid) {
      let id = this.state.email_data.id
      this.update_position()
      if(id) {
        Service.put(`/emails/${id}`, this.state.email_data, this.updateSuccessfulCallback)
      } else {
        Service.post('/emails', this.state.email_data, this.successfulCallback)
      }
    }
  }

  update_position = () => {
    let new_email_data = Object.assign({}, this.state.email_data)
    this.state.email_data.images_attributes.forEach((image, index) => {
      image.position = index + 1
    })
    this.setState({ email_data: new_email_data });
  }

  updateSuccessfulCallback() {
    alert('The email is updating successfully!')
  }

  successfulCallback(result) {
    this.setState(this.initState())
    alert(result.message)
  }

  template_select() {
    let options = this.props.template_options
    return (
      <Select className={this.state.template_select_class} name="form-field-name"
        value={this.state.email_data.template_id} options={options} onChange={this.templateSelectChange}
        placeholder="Please Select a Template"/>
    )
  }

  handleNameChange(name) {
    var new_email_data = Object.assign({}, this.state.email_data);
    new_email_data.name = name.target.value;
    this.setState({ email_data: new_email_data, name_class: '' });
  }

  handleClientHtmlChange(htmlEl) {
    this.setClientHtmlState(htmlEl.target.value)
  }

  setClientHtmlState = (html) => {
    let new_email_data = Object.assign({}, this.state.email_data);
    new_email_data.html = html;
    this.setState({ email_data: new_email_data, html_area_class: '' });
  }

   handleCssContentChange(css_content) {
    let new_email_data = Object.assign({}, this.state.email_data);
    new_email_data.css_content = css_content.target.value;
    this.setState({ email_data: new_email_data });
  }

  setClientHtml = (e) => {
    let file = e.target.files[0]
    this.getFileContent(file)
  }

  getFileContent = (file) => {
    let reader = new FileReader();
    reader.readAsText(file, "UTF-8")
    reader.onload = () => {
      this.setClientHtmlState(reader.result);
    };
    reader.onerror = (error) => {
      console.log('Error: ', error);
    }
  }

  renderCssContent() {
    return (
      <div className="form-group">
        <label className="control-label"> CSS Content </label>
        <textarea className="form-control css-content-area"
          onChange={this.handleCssContentChange.bind(this)} value={this.state.email_data.css_content || ''} ></textarea>
      </div>
    )
  }

  renderClientHtml() {
    return (
      <div>
        <label className="control-label">Client Html</label>
        <textarea className={`form-control client-html-area ${this.state.html_area_class}`}
          onChange={this.handleClientHtmlChange.bind(this)} value={this.state.email_data.html || ''} ></textarea>
        <input type="file" className="form-control" onChange={this.setClientHtml} accept="text/html"></input>
      </div>
    )
  }

  renderEmailWithImage() {
    return (
      <ImageContainer setImagesState={this.setImagesState} images={this.state.email_data.images_attributes}
        swapImage={this.swapImage} removeImage={this.removeImage} setImageInfo={this.setImageInfo}
        image_drop_zone_class={this.state.image_drop_zone_class}/>
    )
  }

  setImagesState = (image_data) => {
    var new_email_data = Object.assign({}, this.state.email_data);
    new_email_data.images_attributes.push(image_data);
    this.setState({ email_data: new_email_data, image_drop_zone_class: '' });
  }

  swapImage = (index, action) => {
    let offset = action == 'up' ? -1 : 1
    let new_email_data = Object.assign({}, this.state.email_data);
    let origin = new_email_data.images_attributes[index]
    new_email_data.images_attributes[index] = new_email_data.images_attributes[index + offset]
    new_email_data.images_attributes[index + offset] = origin
    this.setState({ email_data: new_email_data});
  }

  removeImage = (index) => {
    let new_email_data = Object.assign({}, this.state.email_data);
    new_email_data.images_attributes[index]['_destroy'] = true
    this.setState({ email_data: new_email_data});
  }

  setImageInfo = (key, index, e) => {
    let value = e.target.value
    let new_email_data = Object.assign({}, this.state.email_data);
    new_email_data.images_attributes[index][key] = value;
    new_email_data.images_attributes[index]['link_class'] = ''
    this.setState({ email_data: new_email_data});
  }

  renderEmailTypeBody() {
    switch(this.state.email_data.email_type){
      case 'client_html':
        return this.renderClientHtml()
      case 'image':
        return this.renderEmailWithImage()
    }
  }

  renderEmailType() {
    let type_btn_class = []
    switch(this.state.email_data.email_type){
      case 'client_html':
        type_btn_class = ['active']
        break
      case 'image':
        type_btn_class = ['','active']
        break
    }

    return(
      <div className="email-types">
        <a className={type_btn_class[0]} href="javascript:void(0)"
          onClick={this.handleEmailTypeChange} data-type="client_html">
          Client Html
        </a>
        |
        <a className={type_btn_class[1]} href="javascript:void(0)"
          onClick={this.handleEmailTypeChange} data-type="image">
          Image
        </a>
      </div>
    )
  }

  handleEmailTypeChange(e) {
    let initState = this.initState()
    initState.email_data.email_type = e.target.getAttribute('data-type')
    this.setState(initState)
  }

  renderDynamicAttribute() {
    var attributes = [
      ['js_links', 'JS Link'],
      ['css_links', 'CSS Link'],
      ['tracking_pixels', 'Tracking Pixel']
    ]

    return attributes.map((attribute, index) => {
      return(
        <DynamicInputField
          key={index}
          values={this.state.email_data[attribute[0]]}
          updateDynamicInputValue={this.updateDynamicInputValue.bind(this)}
          deleteDynamicInputField={this.deleteDynamicInputField.bind(this)}
          label={attribute[1]}
          type={attribute[0]}
        />
      )
    })
  }

  render() {
    return (
      <form>
        {this.renderEmailType()}
        <div className="form-group">
          <label className="control-label">Name</label>
          <input type="text" className={`form-control ${this.state.name_class}`} id="inputName"
            placeholder="Email Name" onChange={this.handleNameChange}
            value={this.state.email_data.name}></input>
        </div>

        <div className="form-group">
          <label className="control-label">Template</label>
          {this.template_select()}
        </div>

        {this.renderDynamicAttribute()}
        {this.renderCssContent()}

        <div className="form-group">
          {this.renderEmailTypeBody()}
        </div>

        <div className="form-group">
          <button type="submit" className="btn btn-primary" onClick={this.submit} >Submit</button>
        </div>
      </form>
    )
  }
}
