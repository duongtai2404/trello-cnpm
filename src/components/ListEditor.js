import '../styles/ListEditor.css';

import React, { Component } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

class ListEditor extends Component {
  ref = React.createRef();

  onEnter = (e) => {
    e.preventDefault();
    this.props.saveList();
  };

  handleClick = (e) => {
    const node = this.ref.current;

    if (node.contains(e.target)) {
      return;
    }

    this.props.onClickOutside();
  };

  componentDidMount() {
    document.addEventListener('click', this.handleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick, false);
  }

  render() {
    const {
      title,
      handleChangeTitle,
      deleteList,
      minPercentTask,
      handleChangeMinPercentTask,
    } = this.props;

    return (
      <div className='List-Title-Edit' ref={this.ref}>
        <TextareaAutosize
          autoFocus
          className='List-Title-Textarea'
          placeholder='Title ...'
          value={title}
          onChange={handleChangeTitle}
          style={{ width: deleteList ? 90 : 125 }}
        />
        <TextareaAutosize
          type='number'
          className='List-Title-Textarea'
          placeholder='Percent...'
          value={minPercentTask}
          onChange={handleChangeMinPercentTask}
          style={{ width: deleteList ? 90 : 125 }}
        />
        {deleteList && (
          <div>
            <ion-icon name='trash' onClick={deleteList} />
            <ion-icon name='save' onClick={this.onEnter} />
          </div>
        )}
      </div>
    );
  }
}

export default ListEditor;
