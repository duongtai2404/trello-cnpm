import '../styles/Main.css';
import '../styles/Card.css';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';
import ReactCircleModal from 'react-circle-modal';

import CardEditor from './CardEditor';
import DatePicker from 'react-date-picker';
import shortid from 'shortid';
import avatar from '../image/person.jpg';

class Card extends Component {
  state = {
    hover: false,
    editing: false,
    addMemberToCard: false,
    date: this.props.card.ttl ? new Date(this.props.card.ttl) : new Date(),
    openDangerDay: false,
    openWarningDay: false,
    commentContent: '',
    showTagSuggestion: false,
    addTask: false,
    taskContent: '',
  };

  // componentDidUpdate(){
  //   if(this.props.card.comments ){
  //     if(this.props.card.comments.length > 0){
  //       document.getElementsByClassName('content-comment');
  //     }
  //   }
  // }

  startHover = () => this.setState({ hover: true });
  endHover = () => this.setState({ hover: false });

  startEditing = () =>
    this.setState({
      hover: false,
      editing: true,
      text: this.props.card.text,
    });

  endEditing = () => this.setState({ hover: false, editing: false });

  editCard = async (text, date) => {
    const { card, dispatch } = this.props;

    this.endEditing();

    dispatch({
      type: 'CHANGE_CARD_TEXT',
      payload: { cardId: card._id, cardText: text, ttl: date },
    });
  };

  deleteCard = async () => {
    const { listId, card, dispatch } = this.props;

    if (window.confirm('Are you sure to delete this card?')) {
      dispatch({
        type: 'DELETE_CARD',
        payload: { cardId: card._id, listId },
      });
    }
  };

  addMemberToCard = async (name) => {
    const { card, dispatch, currentBoard } = this.props;
    const showNotification = `You are tagged in card ${card.text}`;
    const id = shortid.generate();
    dispatch({
      type: 'ADD_MEMBER_CARD',
      payload: {
        id,
        boardId: currentBoard,
        cardId: card._id,
        nameMember: name,
        notification: showNotification,
      },
    });
  };

  onChangeExpireDate = async (date) => {
    const { card, dispatch } = this.props;
    this.setState({
      date: date,
    });
    dispatch({
      type: 'CHANGE_CARD_TTL',
      payload: { cardId: card._id, ttl: date.getTime() },
    });
  };

  checkExpire = (ttl) => {
    const expireDate = new Date(ttl);
    const currentDate = new Date();
    const dayLeft = parseInt(
      Math.floor((expireDate.getTime() - currentDate.getTime()) / 86400000)
    );
    return dayLeft;
  };

  listMemberNeedToAdd = (listMember, listMemberCard) => {
    const newList = [];
    listMember.forEach((element) => {
      if (!listMemberCard.includes(element)) {
        newList.push(element);
      }
    });
    return newList;
  };

  createDangerDayToChoose(maxDay) {
    const days = [];
    for (let index = 1; index < maxDay; index++) {
      days.push(index);
    }
    return days;
  }

  changeInfoDeadline(day, type) {
    const { card, dispatch } = this.props;
    dispatch({
      type: 'CHANGE_DEADLINE',
      payload: { cardId: card._id, day: parseInt(day), type },
    });
  }

  onChangeComment(e) {
    e.persist();
    this.setState({
      commentContent: e.target.value,
    });
  }

  handleComment(e) {
    e.preventDefault();
    const key = e.keyCode;
    console.log(key);
    const { dispatch, card, currentUserName, currentBoard, listTitle } =
      this.props;
    if (key === 13) {
      const idComment = shortid.generate();
      dispatch({
        type: 'ADD_COMMENT',
        payload: {
          cardId: card._id,
          content: this.state.commentContent,
          nameUser: currentUserName,
          idComment,
        },
      });
      this.props.card.member.forEach((element) => {
        if (this.state.commentContent.includes(element)) {
          const id = shortid.generate();
          dispatch({
            type: 'ADD_NOTIFICATION',
            payload: {
              boardId: currentBoard,
              nameMember: element,
              notification: `You are tagged in ${card.text} in board ${listTitle} with message "${this.state.commentContent}"`,
              id,
            },
          });
          return;
        }
      });
      this.setState({
        commentContent: '',
      });
    }
    if (key === 17) {
      this.setState({
        showTagSuggestion: true,
      });
    }
  }

  listTagSuggestion(listMemberCard) {
    const { currentUserName } = this.props;
    const listTagSuggestion = listMemberCard.filter((member) => {
      return member !== currentUserName;
    });
    return listTagSuggestion;
  }

  chooseItemTag(name) {
    this.setState({
      commentContent: this.state.commentContent + ' ' + name,
      showTagSuggestion: false,
    });
  }

  changeAddTask() {
    this.setState({
      addTask: !this.state.addTask,
    });
  }

  addNewTask() {
    const { card, dispatch } = this.props;
    const idTask = shortid.generate();
    dispatch({
      type: 'ADD_TASK',
      payload: { cardId: card._id, idTask, content: this.state.taskContent },
    });
    this.setState({
      taskContent: '',
    });
  }

  finishTask(idTask, isFinished) {
    const { card, dispatch } = this.props;
    if (!isFinished) {
      dispatch({
        type: 'FINISH_TASK',
        payload: { cardId: card._id, idTask },
      });
    } else {
      dispatch({
        type: 'UNFINISHED_TASK',
        payload: { cardId: card._id, idTask },
      });
    }
  }

  getProgress(finishedTask, listTask) {
    if (listTask === 0) {
      return 0;
    }
    return Math.ceil((finishedTask / listTask) * 100);
  }

  checkPercentTask(finishTask, lengthTask) {
    if (finishTask === 0 || lengthTask === 0) {
      return 0;
    }
    return Math.ceil((finishTask / lengthTask) * 100);
  }

  render() {
    const { card, index, listMember } = this.props;
    const { hover, editing, addMemberToCard, date } = this.state;
    const listMemberCard = card.member ? card.member : [];
    const listMemberNeedToAdd = this.listMemberNeedToAdd(
      listMember,
      listMemberCard
    );
    const checkDateExpire = this.checkExpire(
      card.ttl ? card.ttl : new Date().getTime()
    );
    const checkPercentTask = this.checkPercentTask(
      card.finishTask ? card.finishTask : 0,
      card.tasks ? card.tasks.length : 0
    );
    const dayToChoose = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const dayDanger = this.createDangerDayToChoose(
      card.infoDeadline
        ? card.infoDeadline.warningDeadline
          ? card.infoDeadline.warningDeadline
          : 4
        : 4
    );
    const listTagSuggestion = this.listTagSuggestion(listMemberCard);
    const valueProgress = this.getProgress(
      card.finishTask ? card.finishTask : 0,
      card.tasks ? card.tasks.length : 0
    );
    if (!editing) {
      return (
        <ReactCircleModal
          backgroundColor='#97349a'
          toogleComponent={(onClick) => (
            <Draggable draggableId={card._id} index={index}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className='Card'
                  title='Drag to move'
                  onMouseEnter={this.startHover}
                  onMouseLeave={this.endHover}
                  onClick={onClick}
                >
                  {checkPercentTask === 100 ? (
                    <React.Fragment />
                  ) : (
                    <div>
                      {checkDateExpire >
                      (card.infoDeadline
                        ? card.infoDeadline.warningDeadline
                        : 4) ? (
                        <React.Fragment />
                      ) : (
                        <div
                          className='container-information-expire'
                          style={{
                            backgroundColor:
                              checkDateExpire <=
                              (card.infoDeadline
                                ? card.infoDeadline.dangerDeadline
                                : 2)
                                ? 'red'
                                : '#dede21',
                          }}
                        >
                          <p className='information-expire'>
                            Expire in {checkDateExpire} day left
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className='list-label-card'>
                    <div
                      className='progress mb-3'
                      style={{ width: '100%', height: '8px' }}
                    >
                      <div
                        className='progress-bar'
                        role='progressbar'
                        style={{
                          width: `${valueProgress}%`,
                          background: 'rgb(79, 190, 35)',
                        }}
                        aria-valuenow={valueProgress}
                        aria-valuemin='0'
                        aria-valuemax='100'
                      ></div>
                    </div>
                  </div>
                  <div
                    style={{
                      background:
                        card.status === 2
                          ? 'red'
                          : card.status === 1
                          ? 'yellow'
                          : 'white',
                    }}
                  >
                    {hover && (
                      // <div>
                      //   <div
                      //     title='Change Status'
                      //     className='Card-Icons'
                      //     style={{ marginRight: '30px' }}
                      //   >
                      //     <button
                      //       onClick={() => {
                      //         const { dispatch } = this.props;
                      //         console.log('here');
                      //         dispatch({
                      //           type: 'CHANGE_STATUS',
                      //           payload: { cardId: card._id },
                      //         });
                      //       }}
                      //       className='btn btn-primary'
                      //       style={{ padding: '2px' }}
                      //     >
                      //       {' '}
                      //       Status{' '}
                      //     </button>
                      //   </div>
                      <div title='Edit' className='Card-Icons'>
                        <div className='Card-Icon' onClick={this.startEditing}>
                          <ion-icon name='create' />
                        </div>
                      </div>
                      // </div>
                    )}

                    {card.text}
                  </div>
                  <div className='list-member-card'>
                    {listMemberCard.length > 0 &&
                      listMemberCard.map((name, index) => (
                        <span className='member-card' index={index}>
                          {name}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </Draggable>
          )}
          // Optional fields and their default values
          offsetX={0}
          offsetY={0}
        >
          {(onClick) => (
            <div className='container-modal'>
              <div
                className='main-modal'
                style={{
                  backgroundColor: '#fff',
                  padding: '1.3em',
                  borderRadius: '10px',
                  minWidth: '70%',
                }}
              >
                <div className='header-modal'>
                  <div className='name-card'>{card.text}</div>
                  <button
                    className='btn btn-outline-primary close-modal'
                    onClick={onClick}
                  >
                    Close
                  </button>
                </div>
                <div className='d-flex'>
                  <div className='flex-grow-1 main-container'>
                    <div className='container-member-card'>
                      <div className='member-card-modal'>
                        <p className='title-member-card'>MEMBERS</p>
                        <div className='list-member-card'>
                          {listMemberCard.length > 0 &&
                            listMemberCard.map((name, index) => (
                              <span className='member-card' index={index}>
                                {name}
                              </span>
                            ))}
                          <div>
                            <button
                              className='member-card-add btn'
                              style={{
                                padding: '2px 10px 0px 10px',
                                fontSize: '12px',
                                marginLeft: '7px',
                                border: '0.5px solid aliceblue',
                              }}
                              onClick={() => {
                                this.setState({ addMemberToCard: true });
                              }}
                            >
                              +
                            </button>
                            {addMemberToCard && (
                              <div className='information-member-to-add'>
                                <div className='d-flex header-information-member-to-add'>
                                  <p
                                    className=' flex-grow-1 m-0'
                                    style={{ textAlign: 'center' }}
                                  >
                                    Member
                                  </p>
                                  <button
                                    className='btn btn-outline-primary'
                                    style={{
                                      padding: '2px 10px 0px 10px',
                                      fontSize: '12px',
                                    }}
                                    onClick={() => {
                                      this.setState({ addMemberToCard: false });
                                    }}
                                  >
                                    x
                                  </button>
                                </div>
                                {/* listMemberNeedToAdd */}
                                <div className='contain-list-member-need-add'>
                                  {listMemberNeedToAdd.length > 0 &&
                                    listMemberNeedToAdd.map((name, index) => (
                                      <div
                                        className='member-need-to-add'
                                        key={index}
                                        onClick={() => {
                                          this.addMemberToCard(name);
                                        }}
                                      >
                                        {name}
                                      </div>
                                    ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className='expire-day'>
                        <p className='title-expire-day'>EXPIRE DATE</p>
                        <DatePicker
                          value={date}
                          onChange={(e) => {
                            this.onChangeExpireDate(e);
                          }}
                        />
                      </div>
                    </div>
                    <div className='container-tasks'>
                      <div className='title-container-tasks'>TASKS</div>
                      <div className='progress mb-3'>
                        <div
                          className='progress-bar bg-success'
                          role='progressbar'
                          style={{ width: `${valueProgress}%` }}
                          aria-valuenow={valueProgress}
                          aria-valuemin='0'
                          aria-valuemax='100'
                        >
                          {valueProgress}%
                        </div>
                      </div>
                      <div className='container-list-tasks'>
                        <div className='container-list-tasks'>
                          {card.tasks &&
                            card.tasks.map((task, index) => {
                              return (
                                <div className='item-list-tasks' key={index}>
                                  <div className='form-check'>
                                    <input
                                      className='form-check-input'
                                      type='checkbox'
                                      value=''
                                      id='flexCheckDefault'
                                      style={{ marginRight: '15px' }}
                                      checked={task.isFinished}
                                      onChange={() =>
                                        this.finishTask(
                                          task.id,
                                          task.isFinished
                                        )
                                      }
                                    />
                                    <label
                                      className='form-check-label'
                                      for='flexCheckDefault'
                                      style={{
                                        textDecoration: task.isFinished
                                          ? 'line-through'
                                          : 'none',
                                      }}
                                    >
                                      {task.content}
                                    </label>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                        <div className='container-add-task'>
                          {this.state.addTask ? (
                            <div>
                              <div className='form-floating form-add-task'>
                                <textarea
                                  className='form-control textarea-add-task'
                                  placeholder='Add new task'
                                  id='floatingTextarea'
                                  value={this.state.taskContent}
                                  onChange={(e) => {
                                    e.persist();
                                    this.setState({
                                      taskContent: e.target.value,
                                    });
                                  }}
                                ></textarea>
                                <label for='floatingTextarea'>
                                  Add new task
                                </label>
                              </div>
                              <div className='container-btn-add-task'>
                                <button
                                  className='btn btn-primary'
                                  style={{
                                    fontSize: '15px',
                                    marginRight: '15px',
                                    padding: '3px 20px',
                                  }}
                                  onClick={() => this.addNewTask()}
                                >
                                  Add
                                </button>
                                <button
                                  className='btn btn-outline-secondary'
                                  style={{
                                    fontSize: '15px',
                                    marginRight: '15px',
                                    padding: '3px 20px',
                                  }}
                                  onClick={(e) => this.changeAddTask()}
                                >
                                  X
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              className='btn btn-add-task'
                              style={{
                                fontSize: '15px',
                                backgroundColor: '#ebecf0',
                              }}
                              onClick={(e) => this.changeAddTask()}
                            >
                              Add new task
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='additional-container'>
                    <div
                      className='dangerDeadline d-flex'
                      onClick={() => {
                        this.setState({
                          openDangerDay: !this.state.openDangerDay,
                        });
                      }}
                    >
                      <div className='flex-grow-1'>Danger for deadline</div>
                      {card.infoDeadline ? (
                        <div>
                          {card.infoDeadline.dangerDeadline
                            ? card.infoDeadline.dangerDeadline
                            : 2}
                        </div>
                      ) : (
                        <div>2</div>
                      )}
                      {this.state.openDangerDay && (
                        <div
                          className='container-day-to-choose'
                          onMouseLeave={() => {
                            this.setState({ openDangerDay: false });
                          }}
                        >
                          {dayDanger.map((day, index) => {
                            return (
                              <div
                                key={index}
                                className='item-day-to-choose'
                                onClick={() => {
                                  this.changeInfoDeadline(day, 'danger');
                                }}
                              >
                                {day} days
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    <div
                      className='warningDeadline d-flex'
                      onClick={() => {
                        this.setState({
                          openWarningDay: !this.state.openWarningDay,
                        });
                      }}
                    >
                      <div className='flex-grow-1'>Warning for deadline</div>
                      {card.infoDeadline ? (
                        <div>
                          {card.infoDeadline.warningDeadline
                            ? card.infoDeadline.warningDeadline
                            : 4}
                        </div>
                      ) : (
                        <div>4</div>
                      )}
                      {this.state.openWarningDay && (
                        <div
                          className='container-day-to-choose'
                          onMouseLeave={() => {
                            this.setState({ openWarningDay: false });
                          }}
                        >
                          {dayToChoose.map((day, index) => {
                            return (
                              <div
                                key={index}
                                className='item-day-to-choose'
                                onClick={() => {
                                  this.changeInfoDeadline(day, 'warning');
                                }}
                              >
                                {day} days
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className='comment-card'>
                  <div className='title-comment-card'>NOTES</div>
                  <div class='mb-3 ml-3'>
                    <input
                      style={{ fontSize: '14px' }}
                      type='text'
                      class='form-control'
                      id='exampleFormControlInput1'
                      placeholder='Write note ...'
                      value={this.state.commentContent}
                      onChange={(e) => this.onChangeComment(e)}
                      onKeyDown={(e) => this.handleComment(e)}
                    />
                  </div>
                  {this.state.showTagSuggestion && (
                    <div className='tag-suggestion'>
                      {listTagSuggestion.map((member) => {
                        return (
                          <div
                            onClick={() => this.chooseItemTag(member)}
                            onMouseLeave={() =>
                              this.setState({ showTagSuggestion: false })
                            }
                            className='member-tag-suggestion'
                          >
                            {member}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className='d-flex container-list-comment'>
                    {card.comments &&
                      card.comments.map((comment, index) => {
                        return (
                          <div className='d-flex item-comment' key={index}>
                            <div className='avatar-user'>
                              <img
                                src={avatar}
                                style={{
                                  maxWidth: '40px',
                                  borderRadius: '50%',
                                }}
                                alt='person'
                              />
                            </div>
                            <div className='item-comment-content flex-grow-1'>
                              <div className='name-user-comment'>
                                {comment.nameUser}
                              </div>
                              <p className='m-0 content-comment'>
                                {comment.content}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </ReactCircleModal>
      );
    } else {
      return (
        <CardEditor
          text={card.text}
          ttl={card.ttl ? card.ttl : new Date().getTime()}
          onSave={this.editCard}
          onDelete={this.deleteCard}
          onCancel={this.endEditing}
        />
      );
    }
  }
}

const getMemberBoard = (userById, currentBoard) => {
  const listMember = [];
  for (const key in userById) {
    const listBoard = userById[key].listBoard;
    if (listBoard.includes(currentBoard)) {
      listMember.push(key);
    }
  }
  return listMember;
};

const mapStateToProps = (state, ownProps) => ({
  card: state.cardsById[ownProps.cardId],
  listMember: getMemberBoard(state.usersById, ownProps.currentBoard),
});

export default connect(mapStateToProps)(Card);
