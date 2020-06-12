import React, { Component } from 'react';
import { Flex, FlexChild, MinimalisticButton, Tooltip, CloseButton } from '../../';
import { joinClasses } from './../../../util';
import './DatePicker.scss';

const DAYS_IN_MONTHS = [
  31,
  28,
  31,
  30,
  31,
  30,
  31,
  31,
  30,
  31,
  30,
  31
]

class DatePicker extends Component {
  constructor (props) {
    super(props);
    this.CURRENT_MONTH = new Date().getMonth();
    this.CURRENT_DAY = new Date().getDay();
    this.CURRENT_YEAR = new Date().getFullYear();
    this.CURRENT_HOUR = new Date().getHours();
    this.DAYS_IN_MONTHS = DAYS_IN_MONTHS;
    this.DAYS_IN_MONTHS_LEAP_YEAR = [
      31,
      29,
      31,
      30,
      31,
      30,
      31,
      31,
      30,
      31,
      30,
      31
    ]
    if (this.isLeapYear(this.CURRENT_YEAR)) {
      this.DAYS_IN_MONTHS = this.DAYS_IN_MONTHS_LEAP_YEAR;
    }
    this.MONTHS_FRIENDLY = {
      JAN: 'January',
      FEB: 'Feburary',
      MAR: 'March',
      APR: 'April',
      MAY: 'May',
      JUN: 'June',
      JUL: 'July',
      AUG: 'August',
      SEP: 'September',
      OCT: 'October',
      NOV: 'November',
      DEC: 'December'
    }
    this.MONTHS = [
      { name: 'January', position: 0 },
      { name: 'Feburary', position: 1 },
      { name: 'March', position: 2 },
      { name: 'April', position: 3 },
      { name: 'May', position: 4 },
      { name: 'June', position: 5 },
      { name: 'July', position: 6 },
      { name: 'August', position: 7 },
      { name: 'September', position: 8 },
      { name: 'October', position: 9 },
      { name: 'November', position: 10 },
      { name: 'December', position: 11 },
    ]
    this.DAYS = [
      { name: 'Sunday', position: 0 },
      { name: 'Monday', position: 1 },
      { name: 'Tuesday', position: 2 },
      { name: 'Wednesday', position: 3 },
      { name: 'Thursday', position: 4 },
      { name: 'Friday', position: 5 },
      { name: 'Saturday', position: 6 },
    ]
    this.CALENDAR = Object.entries(this.DAYS_IN_MONTHS).map((month) => {
      const [ name, days ] = month;
      return { name: this.MONTHS_FRIENDLY[name], days: new Array(days).fill().map((_, i) => i) }
    })

    let { initial = new Date() } = this.props;
    const now = new Date(Date.now() + 3.6e6);
    if (!initial) {
      initial = now;
    }
    if (typeof initial.getMonth !== 'function') {
      initial = now;
    }
    const isPM = initial.getHours() > 12 ? true : false;
    this.state = {
      selectedMonth: initial.getMonth(),
      shownMonth: this.CURRENT_MONTH,
      selectedDay: initial.getDay(),
      selectedYear: initial.getFullYear(),
      shownYear: this.CURRENT_YEAR,
      selectedPM: isPM,
      selectedHour: initial.getHours(),
      shownHour: isPM ? initial.getHours() - 12 : initial.getHours(),
      selectedMinutes: initial.getMinutes()
    }
  }

  isLeapYear (year) {
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
  }

  daySelected (day = this.state.selectedDay) {
    const { onChange = () => void 0 } = this.props;
    const { shownYear, shownMonth, selectedMinutes, shownHour, selectedPM } = this.state;
    this.checkHour(true);
    this.checkMins(true);
    this.setState({ selectedDay: day, selectedMonth: shownMonth, selectedYear: shownYear });
    const dateString = `${(shownMonth + 1).toString().padStart(2, '0')}/${(day + 1).toString()
      .padStart(2, '0')}/${shownYear} ${shownHour}:${selectedMinutes} ${selectedPM ? 'PM' : 'AM'}`
    const date = new Date(dateString);
    onChange(date || null);
  }

  selectionMade (elm) {
    const { onOptionSelected = () => void 0 } = this.props;
    onOptionSelected(elm);
    this.updateSelf();
  }

  adjustMonthLeft () {
    const { shownMonth, shownYear } = this.state;
    if (shownMonth <= 0) {
      this.setState({ shownMonth: 11, shownYear: shownYear - 1 });
    } else {
      this.setState({ shownMonth: shownMonth - 1 });
    }
  }

  adjustMonthRight () {
    const { shownMonth, shownYear } = this.state;
    if (shownMonth >= 11) {
      this.setState({ shownMonth: 0, shownYear: shownYear + 1 });
    } else {
      this.setState({ shownMonth: shownMonth + 1 });
    }
  }

  adjustHour (hour) {
    this.setState({ selectedHour: hour, shownHour: hour >= 12 ? 12 : hour });
    this.state.selectedHour = hour;
    this.state.shownHour = hour >= 12 ? 12 : hour;
    this.daySelected();
  }

  adjustMinutes (mins) {
    this.setState({ selectedMinutes: mins });
    this.state.selectedMinutes = mins;
    this.daySelected();
  }

  checkHour (autoReset = false) {
    const { selectedHour, selectedDay } = this.state;
    const stringed = selectedHour.toString();
    if (stringed.startsWith('0')) {
      if (stringed.length > 2) {
        const int = parseInt(stringed.slice(1));
        if (autoReset) this.setState({ selectedHour: int, shownHour: int >= 12 ? 12 : int });
        return false;
      }
    }

    if (selectedDay === this.CURRENT_DAY && selectedHour <= this.CURRENT_HOUR) {
      if (autoReset) this.setState({ selectedHour: this.CURRENT_HOUR + 1, shownHour: (this.CURRENT_HOUR + 1) >= 12 ? 12 : this.CURRENT_HOUR + 1 })
      return false;
    }

    if (selectedHour >= 24) {
      if (autoReset) this.setState({ selectedHour: 24, shownHour: 12 })
      return false;
    } else if (selectedHour < 12) {
      if (autoReset) this.setState({ shownHour: selectedHour });
    } else if (selectedHour > 12) {
      if (autoReset) this.setState({ shownHour: selectedHour - 12 });
    } else if (selectedHour <= 1) {
      if (autoReset) this.setState({ selectedHour: 1, shownHour: 1 })
      return false;
    } else {
      return true;
    }
  }

  checkMins (autoReset = false) {
    const { selectedMinutes } = this.state;
    const stringed = selectedMinutes.toString();
    if (stringed.startsWith('0')) {
      if (stringed.length > 2) {
        if (autoReset) this.setState({ selectedMinutes: parseInt(stringed.slice(1)) });
        return false;
      }
    }
    if (selectedMinutes >= 59) {
      if (autoReset) this.setState({ selectedMinutes: 59 })
      return false;
    } else if (selectedMinutes <= 1) {
      if (autoReset) this.setState({ selectedMinutes: 1 })
      return false;
    } else {
      return true;
    }
  }

  adjustHourUp () {
    const { selectedHour } = this.state;
    if (this.checkHour()) {
      this.setState({ selectedHour: selectedHour + 1, shownHour: selectedHour > 12 ? selectedHour - 12 : selectedHour });
    }
  }

  adjustHourDown () {
    const { selectedHour } = this.state;
    if (this.checkHour()) {
      this.setState({ selectedHour: selectedHour - 1, shownHour: selectedHour <= 1 ? 1 : selectedHour });
    }
  }

  adjustMinutesUp () {
    const { selectedMinutes } = this.state;
    if (this.checkMins()) {
      this.setState({ selectedMinutes: selectedMinutes + 1 });
    }
  }

  adjustMinutesDown () {
    const { selectedMinutes } = this.state;
    if (this.checkMins()) {
      this.setState({ selectedMinutes: selectedMinutes - 1 });
    }
  }

  setAMPM (pm) {
    this.setState({ selectedPM: pm });
    this.state.selectedPM = pm;
    this.daySelected();
  }

  removeDueDate () {
    const { onChange = () => void 0 } = this.props;
    onChange(null);
  }

  render () {
    const { canSelectPreviousDate, initial } = this.props;
    const { selectedMonth, selectedDay, selectedYear, shownMonth, 
      shownYear, selectedPM, shownHour, selectedMinutes } = this.state;

    return (
      <Flex grow={0} className='calendar' direction='column' align='flex-start'>
        <FlexChild grow={0} className='calendar-month-header' align='center' direction='row'>
          <Flex grow={0} className='calendar-nav-btn calendar-nav-btn-left'>
            {canSelectPreviousDate && <MinimalisticButton onClick={() => this.adjustMonthLeft()} icon='chevron_left' className='calendar-nav-btn-left-btn'></MinimalisticButton>}
            {!canSelectPreviousDate && 
              <Tooltip content={'Can\'t select a date before today'}>
                <MinimalisticButton icon='chevron_left' className='calendar-nav-btn-left-btn'></MinimalisticButton>
              </Tooltip>}
          </Flex>
          <Flex className='calendar-month-header-text' align='center'>
            {this.MONTHS[shownMonth].name} {shownYear}
          </Flex>
          <Flex grow={0} className='calendar-nav-btn calendar-nav-btn-right'>
            <MinimalisticButton onClick={() => this.adjustMonthRight()} icon='chevron_right' className='calendar-nav-btn-left-btn'></MinimalisticButton>
          </Flex>
        </FlexChild>

        <Flex align='center' className='calendar-selected-date'>
          {(selectedMonth + 1).toString().padStart(2, '0')}/{(selectedDay + 1).toString().padStart(2, '0')}/{selectedYear}
          <FlexChild className='calendar-time-container' align='center' direction='row'>
            <Flex align='center' direction='row'>
              <FlexChild direction='row'>
                <Flex className='calendar-time-adjust-arrows'>
                  <MinimalisticButton onClick={() => this.adjustHourUp()}
                  size='14px' icon='keyboard_arrow_up' className='calender-time-adjust-up'></MinimalisticButton>
                  <MinimalisticButton onClick={() => this.adjustHourDown()}
                  size='14px' icon='keyboard_arrow_down' className='calender-time-adjust-down'></MinimalisticButton>
                </Flex>
                <input onBlur={() => this.checkHour(true)} onClick={(e) => e.target.select()}
                  onChange={(e) => this.adjustHour(e.target.value)} className='calendar-time' type='number' min='1' max='12' value={shownHour.toString().padStart(2, '0')}></input>
              </FlexChild>
              <span>:</span>
              <FlexChild direction='row'>
                <input onBlur={() => this.checkMins(true)} onClick={(e) => e.target.select()}
                  onChange={(e) => this.adjustMinutes(e.target.value)} className='calendar-time' type='number' min='1' max='59' value={selectedMinutes.toString().padStart(2, '0')}></input>
                <Flex className='calendar-time-adjust-arrows'>
                  <MinimalisticButton onClick={() => this.adjustMinutesUp()}
                  size='14px' icon='keyboard_arrow_up' className='calender-time-adjust-up'></MinimalisticButton>
                  <MinimalisticButton onClick={() => this.adjustMinutesDown()}
                  size='14px' icon='keyboard_arrow_down' className='calender-time-adjust-down'></MinimalisticButton>
                </Flex>
              </FlexChild>
            </Flex>
            <Flex className='calendar-time-am-pm' direction='row'>
              <div 
                onClick={() => this.setAMPM(false)} 
                className={joinClasses('calendar-time-period', !selectedPM ? 'calendar-time-period-selected' : '')}>AM</div>
              <div 
                onClick={() => this.setAMPM(true)}
                className={joinClasses('calendar-time-period', selectedPM ? 'calendar-time-period-selected' : '')}>PM</div>
            </Flex>
          </FlexChild>
        </Flex>

        <FlexChild grow={0} className='calendar-day-header' justify='space-between' align='space-between' direction='row'>
          {this.DAYS.map((day) => <header className='calendar-day-header-text'>{day.name.slice(0, 3)}</header>)}
        </FlexChild>
        <FlexChild>
          <CalendarDays 
            {...this.props}
            selectedDay={selectedDay}
            onChange={(day) => this.daySelected(day)}
            {...this.state} />
        </FlexChild>

        {initial && <FlexChild direction='row' align='center' className='calendar-remove' onClick={() => this.removeDueDate()}>
          <CloseButton className='calendar-remove-close' size='16px' />
          Remove Due Date
        </FlexChild>}
      </Flex>
    );
  }
}

class CalendarDays extends Component {
  constructor (props) {
    super(props);
    this.state = {
      selectedDay: props.selectedDay || this.CURRENT_DAY
    }
  }

  clicked (day) {
    const { onChange = () => void 0 } = this.props;
    if (typeof onChange === 'function') {
      onChange(day);
    }
    this.setState({ selectedDay: day });
  }

  shouldBeDisabled (day) {
    const { shownMonth, shownYear, selectedMonth, selectedYear } = this.props;

    if ((shownMonth < selectedMonth) && selectedYear === shownYear) {
      return true;
    }
    if (shownYear < selectedYear) {
      return true;
    }
    if (day < this.CURRENT_DAY) {
      return true;
    }
    return false;
  }

  shouldBeSelected (day) {
    const { shownMonth, shownYear, selectedMonth, selectedYear } = this.props;
    const { selectedDay } = this.state;

    if (shownYear !== selectedYear) {
      return false;
    }
    if (shownMonth !== selectedMonth) {
      return false;
    }
    if (day !== selectedDay) {
      return false;
    }
    return true;
  }

  render () {
    const { name, shownMonth } = this.props;
    const daysInMonth = DAYS_IN_MONTHS[shownMonth];
    const days = new Array(daysInMonth).fill().map((_, i) => i); 

    return (<Flex className='calendar-days' wrap direction='row'>
      {name}
      {days.map((day) => (
        <Flex 
        onClick={() => this.shouldBeDisabled(day) ? void 0 : this.clicked(day)} 
        className={`calendar-day${this.shouldBeSelected(day) ? ' calendar-day-selected' : ''}${this.shouldBeDisabled(day) ? ' calendar-day-disabled' : ''}`} 
        justify='center' 
        align='center'>
          {day + 1}
        </Flex>
      ))}
    </Flex>);
  }
}

export default DatePicker;
