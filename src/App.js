import React, { Component } from 'react';
import AWS from 'aws-sdk';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      uploading: false,
      uploadError: null,
    };

    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  handleFileChange(event) {
    this.setState({ file: event.target.files[0] });
  }

  handleUpload() {
    if (!this.state.file) {
      return;
    }

    this.setState({ uploading: true, uploadError: null });

    const s3 = new AWS.S3({
      accessKeyId: process.env.REACT_APP_ACCESSKEYID,
      secretAccessKey: process.env.REACT_APP_SECRETACCESSKEY,
      region: process.env.REACT_APP_REGION,
    });

    const params = {
      Bucket: process.env.REACT_APP_BUCKETNAME,
      Key: this.state.file.name,
      Body: this.state.file,
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.error('Error uploading file:', err);
        this.setState({ uploading: false, uploadError: err.message });
      } else {
        console.log('File uploaded successfully:', data);
        this.setState({ uploading: false });
      }
    });
  }

  render() {
    return (
      <div>
        <input type="file" onChange={this.handleFileChange} />
        <button onClick={this.handleUpload} disabled={this.state.uploading}>
          {this.state.uploading ? 'Uploading...' : 'Upload'}
        </button>
        {this.state.uploadError && <p>Error: {this.state.uploadError}</p>}
      </div>
    );
  }
}

export default App;

