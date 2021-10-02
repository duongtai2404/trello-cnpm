import '../styles/CardEditor.css';

import React, { Component } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import EditButtons from './EditButtons';
import DatePicker from 'react-date-picker';

class CardEditor extends Component {
  state = {
    text: this.props.text || '',
    date: this.props.ttl ? new Date(this.props.ttl) : new Date(),
  };

  handleChangeText = (event) => this.setState({ text: event.target.value });

  onEnter = (e) => {
    const { text } = this.state;

    if (e.keyCode === 13) {
      e.preventDefault();
      this.props.onSave(text);
    }
  };

  render() {
    const { text, date } = this.state;
    const { onSave, onCancel, onDelete, adding } = this.props;

    return (
      <div className='Edit-Card'>
        <div className='Card'>
          <TextareaAutosize
            autoFocus
            className='Edit-Card-Textarea'
            placeholder='Enter the text for this card...'
            value={text}
            onChange={this.handleChangeText}
            onKeyDown={this.onEnter}
          />
        </div>
        <div className='input-group mb-3'>
          <span className='input-group-text' id='dateExpire'>
            Expire
          </span>
          <DatePicker
            className='form-control'
            value={date}
            onChange={(e) => {
              this.setState({ date: e });
            }}
          />
        </div>

        <EditButtons
          handleSave={() => onSave(text, date)}
          saveLabel={adding ? 'Add card' : 'Save'}
          handleDelete={onDelete}
          handleCancel={onCancel}
        />
      </div>
    );
  }
}

export default CardEditor;
