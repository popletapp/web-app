import React from 'react';
import Popout from './Popout';
import { Flex, FlexChild, DatePicker } from '../..';
import './Popout.scss';
import './ListPopout.scss';

class DatePickerPopout extends Popout {
  constructor (props) {
    super(props);
    this.state = {
      date: props.initial
    }
  }

  selectionMade (elm) {
    const { onOptionSelected = () => void 0 } = this.props;
    onOptionSelected(elm);
    this.updateSelf();
  }

  dateSelected (date) {
    this.setState({ date });
    this.selectionMade(date);
  }

  content () {
    let { title, initial } = this.props;
    return (
      <Flex className='popout popout-nopadding' style={{ width: '275px' }}>
        <FlexChild className='popout-content'>
          <div className='popout-list-header'>
            {title}
          </div>
          <DatePicker initial={initial} onChange={(date) => this.dateSelected(date)} />
        </FlexChild>
      </Flex>
    );
  }
}

export default DatePickerPopout;
