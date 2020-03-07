import React from 'react';
import Popout from './Popout';
import { Flex, FlexChild } from '../..';
import './Popout.scss';
import './ListPopout.scss';
import { withTranslation } from 'react-i18next';

class ListPopout extends Popout {
  constructor () {
    super();
    this.exclude = [];
  }

  selectionMade (elm) {
    const { onOptionSelected = () => void 0 } = this.props;
    onOptionSelected(elm);
    // Solution to remove the item from the list immediately -
    // this is fine because we never need to add it back and the popout will just die
    this.exclude.push(elm);
    this.updateSelf();
  }

  content () {
    let { title, elements, exclude, noElementsText, t } = this.props;
    if (this.exclude) {
      exclude = exclude.concat(this.exclude);
    }

    return (
      <Flex className='popout'>
        <FlexChild className='popout-content'>
          <div className='popout-list-header'>
            {title}
          </div>

          <Flex className='popout-list-elements' direction='column' align='flex-start'>
            {elements.length && elements.filter(elm => !exclude.includes(elm)).map(elm => elm.custom ? elm.custom : (
              <Flex className='popout-list-option' onClick={() => this.selectionMade(elm)} direction='row' align='center'>
                <div className='popout-list-option-name'>{elm.name}</div>
              </Flex>
            ))}
            {!elements.length && <div>{noElementsText || t("POPOUT_LIST_NO_ITEMS")}</div>}
          </Flex>
        </FlexChild>
      </Flex>
    );
  }
}

export default withTranslation()(ListPopout);
