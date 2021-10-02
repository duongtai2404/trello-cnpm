import '../styles/AddList.css';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import ListEditor from './ListEditor';
import shortid from 'shortid';
import EditButtons from './EditButtons';

class AddList extends Component {
  state = {
    title: '',
    minPercentTask: 0,
  };

  handleChangeTitle = (e) => this.setState({ title: e.target.value });

  handleChangeMinPercentTask = (e) =>
    this.setState({ minPercentTask: e.target.value });

  createList = async () => {
    const { title, minPercentTask } = this.state;
    const { dispatch } = this.props;
    const { currentBoard } = this.props;
    if (parseInt(minPercentTask) <= 100) {
      this.props.toggleAddingList();
      dispatch({
        type: 'ADD_LIST',
        payload: {
          boardId: currentBoard,
          listId: shortid.generate(),
          listTitle: title,
          minPercentTask,
        },
      });
    }
  };

  render() {
    const { toggleAddingList } = this.props;
    const { title, minPercentTask } = this.state;

    return (
      <div className='Add-List-Editor'>
        <ListEditor
          title={title}
          minPercentTask={minPercentTask}
          handleChangeTitle={this.handleChangeTitle}
          handleChangeMinPercentTask={this.handleChangeMinPercentTask}
          onClickOutside={toggleAddingList}
          saveList={this.createList}
        />

        <EditButtons
          handleSave={this.createList}
          saveLabel={'Add list'}
          handleCancel={toggleAddingList}
        />
      </div>
    );
  }
}

export default connect()(AddList);
