import '../styles/Board.css';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Board from './Board';
import Signin from './Signin';
import Home from './Home';
import Signup from './Signup';
import bell from '../image/bell-regular.svg';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 'signin',
      currentUserName: '',
      currentBoard: '',
      member: '',
      members: false,
      listMember: [],
      showNotification: false,
    };
    this.changePage = this.changePage.bind(this);
    this.changeCurrentName = this.changeCurrentName.bind(this);
    this.changeCurrentBoard = this.changeCurrentBoard.bind(this);
    this.addMember = this.addMember.bind(this);
    this.deleteMember = this.deleteMember.bind(this);
    this.changeListMember = this.changeListMember.bind(this);
    this.readNotification = this.readNotification.bind(this);
  }

  componentDidMount() {
    const currentUserName = localStorage.getItem('currentUserName');
    if (currentUserName !== null) {
      this.setState({
        page: 'home',
        currentUserName: currentUserName,
      });
    }
  }

  changePage(page) {
    this.setState({
      page: page,
    });
  }
  changeCurrentName(name) {
    this.setState({
      currentUserName: name,
    });
  }
  changeCurrentBoard(boardId) {
    this.setState({
      currentBoard: boardId,
    });
  }

  addMember() {
    if (this.state.member === '') {
      alert('Enter the name of member');
      return;
    }
    const { user } = this.props;
    const userWantToInvite = user.lists.find(
      (user) => user === this.state.member
    );
    if (userWantToInvite === undefined) {
      alert('Account is not exist');
    } else {
      const { dispatch } = this.props;
      dispatch({
        type: 'SET_NEWBOARD',
        payload: {
          userName: this.state.member,
          boardId: this.state.currentBoard,
        },
      });
      alert('Added this accout, wait accept');
      this.setState({
        member: '',
      });
    }
  }
  deleteMember(member) {
    const { dispatch } = this.props;

    if (window.confirm('Are you sure to delete this person out board?')) {
      dispatch({
        type: 'DELETE_MEMBER',
        payload: {
          boardId: this.state.currentBoard,
          userName: member,
        },
      });
      const indexOf = this.state.listMember.indexOf(member);
      const list = this.state.listMember.slice();
      if (indexOf > -1) {
        list.splice(indexOf, 1);
        this.setState({
          listMember: list,
          member: '',
        });
      }
    }
    // if (this.state.member === '') {
    //   alert('Enter the name of member');
    //   return;
    // }
    // const { user } = this.props;
    // const userWantToInvite = user.lists.find(
    //   (user) => user === this.state.member
    // );
    // if (userWantToInvite === undefined) {
    //   alert('Person is not exist');
    // } else {
    //   const { usersById, dispatch } = this.props;
    //   const isExitBoard = usersById[this.state.member].listBoard.find(
    //     (board) => board === this.state.currentBoard
    //   );
    //   if (isExitBoard === undefined) {
    //     alert('This person is not in board');
    //   } else {

    //   }
    // }
  }
  changeListMember(listMember) {
    this.setState({
      listMember: listMember,
    });
  }
  getListNotificationByUser(currentBoard) {
    if (currentBoard === '') {
      return [];
    } else {
      const listNotification = this.props.boardsById[currentBoard].notifications
        ? this.props.boardsById[currentBoard].notifications
        : [];
      const listNotificationByUser = listNotification.filter((notification) =>
        Object.keys(notification).includes(this.state.currentUserName)
      );
      return listNotificationByUser;
    }
  }
  readNotification(id) {
    const { dispatch } = this.props;
    dispatch({
      type: 'READ_NOTIFICATION',
      payload: {
        board: this.state.currentBoard,
        id,
      },
    });
  }
  checkNewNotification(listNotificationByUser) {
    var isNew = false;
    listNotificationByUser.forEach((element) => {
      if (element.new === true) {
        isNew = true;
        return isNew;
      }
    });
    return isNew;
  }
  render() {
    const { page, showNotification, currentUserName } = this.state;
    const listNotificationByUser = this.getListNotificationByUser(
      this.state.currentBoard
    );
    const checkNewNotification = this.checkNewNotification(
      listNotificationByUser
    );
    return page === 'board' ? (
      <div>
        <div
          className='Header'
          style={{ display: 'flex', justifyContent: 'space-around' }}
        >
          <div>
            <button
              onClick={() => {
                this.setState({
                  page: 'home',
                  currentBoard: '',
                });
              }}
              className='btn btn-outline-primary'
            >
              &lt; Back
            </button>
          </div>
          <div>{this.props.boardsById[this.state.currentBoard].boardTitle}</div>
          <div className='input-group' style={{ width: '500px' }}>
            <input
              value={this.state.member}
              onChange={(event) => {
                this.setState({
                  member: event.target.value,
                });
              }}
              style={{
                height: '38px',
                borderRadius: '5px',
                marginTop: '14px',
                marginRight: '15px',
              }}
              type='text'
              className='form-control'
              placeholder='Member..'
              aria-label="Recipient's username"
              aria-describedby='basic-addon2'
            />
            <div className='input-group-append'>
              <button
                onClick={this.addMember}
                className='btn btn-success'
                type='button'
              >
                Add member
              </button>
            </div>

            <div className='dropdown' style={{ marginLeft: '7px' }}>
              <button
                className='btn btn-secondary dropdown-toggle'
                type='button'
                id='dropdownMenuButton1'
                data-bs-toggle='dropdown'
                aria-expanded='false'
                onClick={() => {
                  this.setState({ members: !this.state.members });
                }}
              >
                Members
              </button>
              <ul
                style={{
                  display: this.state.members === true ? 'block' : 'none',
                }}
                class='dropdown-menu'
                aria-labelledby='dropdownMenuButton1'
              >
                {this.state.listMember.map((member, index) => {
                  return (
                    <li className='listMember' index={index}>
                      <a
                        style={{ display: 'inline' }}
                        className='dropdown-item'
                        href='#'
                      >
                        {member}
                      </a>
                      <div
                        style={{
                          marginLeft: '40px',
                          cursor: 'pointer',
                          display: 'inline',
                        }}
                      >
                        <ion-icon
                          name='trash'
                          onClick={() => {
                            this.deleteMember(member);
                          }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className='notification-board-contain'>
            <div
              onClick={() => {
                this.setState({ showNotification: !showNotification });
              }}
            >
              <img
                src={bell}
                alt='notification'
                className='notification-board'
              ></img>
              {checkNewNotification && (
                <div className='red-dot-information'></div>
              )}
            </div>
            {showNotification && (
              <div
                onMouseLeave={() => {
                  this.setState({ showNotification: false });
                }}
                className='notification-toast'
              >
                <div className='d-flex title-notification-container'>
                  <p className='flex-grow-1 m-0 title-notification'>
                    Notifications
                  </p>
                  <button
                    className='close-notification btn btn-outline-secondary'
                    style={{ padding: '2px 10px' }}
                    onClick={() => {
                      this.setState({ showNotification: false });
                    }}
                  >
                    x
                  </button>
                </div>
                <div className='list-notification'>
                  {listNotificationByUser.length > 0 &&
                    listNotificationByUser.map((notification, index) => {
                      return (
                        <div key={index} className='d-flex notification-item'>
                          <div className='flex-grow-1 notification-item-title'>
                            {notification[currentUserName]}
                          </div>
                          {notification.new && (
                            <div className='form-check'>
                              <input
                                onClick={() =>
                                  this.readNotification(notification.id)
                                }
                                style={{
                                  border: '2px solid rgb(85, 218, 218)',
                                  cursor: 'pointer',
                                }}
                                className='form-check-input'
                                type='checkbox'
                                value=''
                                id='flexCheckDefault'
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </div>
        <Board
          currentBoard={this.state.currentBoard}
          currentUserName={this.state.currentUserName}
        />
      </div>
    ) : page === 'signin' ? (
      <Signin
        changePage={this.changePage}
        changeCurrentName={this.changeCurrentName}
      />
    ) : page === 'home' ? (
      <Home
        changeListNotification={this.changeListNotification}
        changeListMember={this.changeListMember}
        currentUserName={this.state.currentUserName}
        changeCurrentBoard={this.changeCurrentBoard}
        changePage={this.changePage}
        changeCurrentName={this.changeCurrentName}
      />
    ) : page === 'signup' ? (
      <Signup changePage={this.changePage} />
    ) : (
      ''
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  usersById: state.usersById,
  boardsById: state.boardsById,
});

export default connect(mapStateToProps)(Main);
