import React, { Component } from 'react';
import AWS from 'aws-sdk';

import TheDateTimePicker from './TheDateTimePicker';


class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      uploading: false,
      uploadError: null,
      selectedDate: new Date()
    };

    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  dateToCron = (date) => {
    const minutes = date.getMinutes();
    const hours = date.getHours();
    const days = date.getDate();
    const months = date.getMonth() + 1;
    const dayOfWeek = date.getDay();
    const year = date.getYear();
    return `cron(${minutes} ${hours} ${days} ${months} ? 2023)`;
  };
  handleDateChange = (date) => {
    this.setState({ selectedDate: date });
    
  };
  handleFileChange(event) {
    this.setState({ file: event.target.files[0] });
  }
  handleSchedule() {
    
    const cloudwatchevents = new AWS.CloudWatchEvents();
    const cronExpression = this.dateToCron(this.state.selectedDate);
    console.log(cronExpression);
    cloudwatchevents.putRule({
      Name: 'uploadFile',
      ScheduleExpression: cronExpression,
    }, (err, data) => {
      if (err) {
          console.error('Error creating CloudWatch Events rule:', err);
      } else {
          console.log('CloudWatch Events rule created:', data.RuleArn);
      }
  });
  }
  handleUpload() {
    AWS.config.update({
      region: process.env.REACT_APP_REGION,
      credentials: new AWS.Credentials({
        accessKeyId: process.env.REACT_APP_ACCESSKEYID,
        secretAccessKey: process.env.REACT_APP_SECRETACCESSKEY,
      }),
    });
    if (!this.state.file) {
      return;
    }

    this.setState({ uploading: true, uploadError: null });

    const s3 = new AWS.S3();

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

    this.handleSchedule();
  }
  
  render() {
    return (
      
      <div>
        <input type="file" onChange={this.handleFileChange} />
        <button onClick={this.handleUpload} disabled={this.state.uploading}>
          {this.state.uploading ? 'Uploading...' : 'Upload'}
        </button>
        {this.state.uploadError && <p>Error: {this.state.uploadError}</p>}
        <TheDateTimePicker selectedDate = {this.state.selectedDate} onDateChange= {this.handleDateChange} ></TheDateTimePicker>
        
      </div>
     
        
      
      
    );
  }
}

export default App;

