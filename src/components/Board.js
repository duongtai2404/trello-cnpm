import '../styles/Board.css';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import List from './List';
import AddList from './AddList';

class Board extends Component {
  state = {
    addingList: false,
    errorFromBoard: this.props.board[this.props.currentBoard].errorMessage
      ? this.props.board[this.props.currentBoard].errorMessage
      : '',
    showError: false,
  };

  toggleAddingList = () =>
    this.setState({ addingList: !this.state.addingList });

  calculatePercentFinishedCard(finishTask, lengthTask) {
    if (finishTask === 0 || lengthTask === 0) {
      return 0;
    }
    return Math.ceil((finishTask / lengthTask) * 100);
  }

  handleDragEnd = ({ source, destination, type }) => {
    // dropped outside the allowed zones
    if (!destination) return;

    const { dispatch, listsById, currentBoard, cardsById } = this.props;

    // Move list
    if (type === 'COLUMN') {
      // Prevent update if nothing has changed
      if (source.index !== destination.index) {
        dispatch({
          type: 'MOVE_LIST',
          payload: {
            boardId: currentBoard,
            oldListIndex: source.index,
            newListIndex: destination.index,
          },
        });
      }
      return;
    }

    // Move card
    if (
      source.index !== destination.index ||
      source.droppableId !== destination.droppableId
    ) {
      if (source.droppableId !== destination.droppableId) {
        console.log(listsById[source.droppableId]);
        const idCurrentCard = listsById[source.droppableId].cards[source.index];
        console.log(idCurrentCard);

        const currentCard = cardsById[idCurrentCard];
        console.log(currentCard);

        const percentTaskFinished = this.calculatePercentFinishedCard(
          currentCard.finishTask ? currentCard.finishTask : 0,
          currentCard.tasks ? currentCard.tasks.length : 0
        );
        const destMinPercentTask = listsById[destination.droppableId]
          .minPercentTask
          ? +listsById[destination.droppableId].minPercentTask
          : 0;
        console.log(percentTaskFinished, destMinPercentTask);
        if (+percentTaskFinished < +destMinPercentTask) {
          dispatch({
            type: 'ADD_ERROR',
            payload: {
              boardId: currentBoard,
              errorMessage: `Can't move this card to this list, need >= ${destMinPercentTask}%`,
            },
          });
          return;
        }
      }
      dispatch({
        type: 'MOVE_CARD',
        payload: {
          sourceListId: source.droppableId,
          destListId: destination.droppableId,
          oldCardIndex: source.index,
          newCardIndex: destination.index,
        },
      });
    }
  };

  showErrorMessage(board, currentBoard) {
    const { dispatch } = this.props;
    if (
      board[currentBoard].errorMessage &&
      board[currentBoard].errorMessage !== ''
    ) {
      setTimeout(() => {
        dispatch({
          type: 'ADD_ERROR',
          payload: {
            boardId: currentBoard,
            errorMessage: '',
          },
        });
      }, 3000);
      return true;
    }
    return false;
  }

  render() {
    const { board, currentBoard, currentUserName } = this.props;
    const { addingList, errorFromBoard } = this.state;
    const showErrorMessage = this.showErrorMessage(board, currentBoard);
    return (
      <DragDropContext onDragEnd={this.handleDragEnd}>
        <Droppable droppableId='board' direction='horizontal' type='COLUMN'>
          {(provided, _snapshot) => (
            <div className='Board' ref={provided.innerRef}>
              {board[currentBoard].lists.map((listId, index) => {
                return (
                  <List
                    currentUserName={currentUserName}
                    currentBoard={currentBoard}
                    listId={listId}
                    key={listId}
                    index={index}
                  />
                );
              })}

              {provided.placeholder}

              <div className='Add-List'>
                {addingList ? (
                  <AddList
                    currentBoard={currentBoard}
                    toggleAddingList={this.toggleAddingList}
                  />
                ) : (
                  <div
                    onClick={this.toggleAddingList}
                    className='Add-List-Button'
                  >
                    <ion-icon name='add' /> Add a list
                  </div>
                )}
              </div>
            </div>
          )}
        </Droppable>
        {showErrorMessage && (
          <div
            className='position-fixed bottom-0 end-0 p-3'
            style={{ zIndex: '11' }}
          >
            <div
              className='toast align-items-center bg-danger text-white show'
              role='alert'
              aria-live='assertive'
              aria-atomic='true'
            >
              <div className='d-flex'>
                <div className='toast-body'>
                  {board[currentBoard].errorMessage}
                </div>
              </div>
            </div>
          </div>
        )}
      </DragDropContext>
    );
  }
}

const mapStateToProps = (state) => ({
  board: state.boardsById,
  listsById: state.listsById,
  cardsById: state.cardsById,
});

export default connect(mapStateToProps)(Board);
