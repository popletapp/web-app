import React, { useState } from 'react';
import DatePickerComponent from 'react-datepicker';
import './DatePicker.scss';
import 'react-datepicker/dist/react-datepicker.css';

function DatePicker ({ initial, onChange = (() => void 0) }) {
  const [startDate, setStartDate] = useState(initial);
  return (
    <DatePickerComponent
      className='datepicker'
      selected={startDate}
      onChange={(date) => { onChange(date); setStartDate(date); }}
      showTimeSelect
      timeFormat='HH:mm'
      timeIntervals={30}
      timeCaption='time'
      dateFormat='MMMM d, yyyy h:mm aa'
      placeholderText='Click to select a date'
      withPortal
    />
  );
}

export default DatePicker;
