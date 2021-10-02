import '../styles/List.css';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Droppable, Draggable } from 'react-beautiful-dnd';

import Card from './Card';
import CardEditor from './CardEditor';
import ListEditor from './ListEditor';

import shortid from 'shortid';

class List extends Component {
  state = {
    editingTitle: false,
    title: this.props.list.title,
    minPercentTask: this.props.list.minPercentTask
      ? this.props.list.minPercentTask
      : 0,
    addingCard: false,
  };

  toggleAddingCard = () =>
    this.setState({ addingCard: !this.state.addingCard });

  addCard = async (cardText, date) => {
    const { listId, dispatch } = this.props;

    this.toggleAddingCard();

    const cardId = shortid.generate();

    dispatch({
      type: 'ADD_CARD',
      payload: { cardText, cardId, listId, ttl: date },
    });
  };

  toggleEditingTitle = () =>
    this.setState({ editingTitle: !this.state.editingTitle });

  handleChangeTitle = (e) => this.setState({ title: e.target.value });

  handleChangeMinPercentTask = (e) =>
    this.setState({ minPercentTask: e.target.value });
  editListTitle = async () => {
    const { listId, dispatch } = this.props;
    const { title, minPercentTask } = this.state;
    if (parseInt(minPercentTask) <= 100) {
      this.toggleEditingTitle();
      dispatch({
        type: 'CHANGE_LIST_TITLE',
        payload: { listId, listTitle: title, minPercentTask },
      });
    }
  };

  deleteList = async () => {
    const { currentBoard, listId, list, dispatch } = this.props;

    if (window.confirm('Are you sure to delete this list?')) {
      dispatch({
        type: 'DELETE_LIST',
        payload: { boardId: currentBoard, listId, cards: list.cards },
      });
    }
  };

  render() {
    const { list, index, currentBoard, currentUserName } = this.props;
    const { editingTitle, addingCard, title, minPercentTask } = this.state;

    return (
      <Draggable draggableId={list._id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className='List'
          >
            {editingTitle ? (
              <ListEditor
                list={list}
                title={title}
                minPercentTask={minPercentTask}
                handleChangeTitle={this.handleChangeTitle}
                handleChangeMinPercentTask={this.handleChangeMinPercentTask}
                saveList={this.editListTitle}
                onClickOutside={this.editListTitle}
                deleteList={this.deleteList}
              />
            ) : (
              <div className='List-header'>
                <div
                  className='List-Title flex-grow-1'
                  onClick={this.toggleEditingTitle}
                >
                  {list.title}
                </div>
                {/* <div className='icon-container'>
                  <ion-icon className='icon-header' name='more' />
                </div> */}
                <div style={{ minWidth: '65px' }}>
                  <span
                    className='badge rounded-pill bg-success'
                    style={{ fontSize: '15px' }}
                  >
                    {list.minPercentTask ? list.minPercentTask : 0}%
                  </span>
                </div>
              </div>
            )}

            <Droppable droppableId={list._id}>
              {(provided, _snapshot) => (
                <div ref={provided.innerRef} className='Lists-Cards'>
                  {list.cards &&
                    list.cards.map((cardId, index) => (
                      <Card
                        currentUserName={currentUserName}
                        currentBoard={currentBoard}
                        key={cardId}
                        cardId={cardId}
                        index={index}
                        listId={list._id}
                        listTitle={list.title}
                      />
                    ))}

                  {provided.placeholder}

                  {addingCard ? (
                    <CardEditor
                      onSave={this.addCard}
                      onCancel={this.toggleAddingCard}
                      adding
                    />
                  ) : (
                    <div
                      className='Toggle-Add-Card'
                      onClick={this.toggleAddingCard}
                    >
                      <ion-icon name='add' /> Add a card
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </div>
        )}
      </Draggable>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  list: state.listsById[ownProps.listId],
});

export default connect(mapStateToProps)(List);
