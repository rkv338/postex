import React from 'react';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';

function TheDateTimePicker({ selectedDate, onDateChange }) {
  

  const handleDateChange = (date) => {
    onDateChange(date);
  };

  return (
    <div>
      <h1>Date and Time Picker</h1>
      <DateTimePicker
        onChange={handleDateChange}
        value={selectedDate}
      />
      <p>Selected date: {selectedDate.toString()}</p>
    </div>
  );
}

export default TheDateTimePicker;
