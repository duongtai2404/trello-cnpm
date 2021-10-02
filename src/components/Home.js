/* eslint-disable jsx-a11y/alt-text */
import '../styles/Board.css';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import logo from '../image/f4-oyl.png';
import shortid from 'shortid';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: '',
    };
    this.addBoard = this.addBoard.bind(this);
    this.logOut = this.logOut.bind(this);
    this.deleteBoard = this.deleteBoard.bind(this);
  }

  addBoard() {
    if (this.state.content === '') {
      alert('Nhập tên của bảng');
      return;
    }
    const boardId = shortid.generate();
    const boardTitle = this.state.content;
    const userName = this.props.currentUserName;
    const { dispatch } = this.props;

    dispatch({
      type: 'ADD_BOARD',
      payload: { userName: userName, boardId: boardId, boardTitle: boardTitle },
    });
    this.setState({
      content: '',
    });
  }

  deleteBoard(boardId) {
    const { dispatch } = this.props;
    if (window.confirm('Do you want to delete this board?')) {
      dispatch({
        type: 'DELETE_MEMBER',
        payload: { boardId: boardId, userName: this.props.currentUserName },
      });
    }
  }

  logOut() {
    localStorage.removeItem('currentUserName');
    this.props.changePage('signin');
    this.props.changeCurrentName('');
  }

  render() {
    const { currentUserName } = this.props;
    const { boardsById, usersById } = this.props;
    return (
      <div className='home'>
        <div
          className='clearfix top-header1'
          style={{
            display: 'flex',
            padding: '20px',
            margin: '0 3rem',
            borderBottom: '2px solid black',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <h5
              className='slogan1'
              style={{ display: 'inline-block', marginLeft: '5rem' }}
            >
              Welcome, {currentUserName}
            </h5>
            <button
              className='btn btn-primary'
              style={{ padding: '2px 5px', marginLeft: '70px' }}
              onClick={() => {
                this.logOut();
              }}
            >
              Log out
            </button>
          </div>
          <img
            className='logo1'
            src={logo}
            style={{ marginLeft: '10rem', width: '300px', height: '100px' }}
          ></img>
          <div
            className='float-right invite-box1 pt-5'
            style={{
              display: 'inline-block',
              marginLeft: '100px',
            }}
          >
            <input
              style={{
                display: 'inline-block',
                width: '70%',
                marginRight: '5px',
              }}
              className='form-control'
              placeholder='Title board ...'
              value={this.state.content}
              onChange={(event) => {
                this.setState({
                  content: event.target.value,
                });
              }}
              type='text'
            />
            <button className='btn btn-success' onClick={this.addBoard}>
              Add
            </button>
          </div>
        </div>
        {usersById[currentUserName].listBoard.length === 0 ? (
          <span></span>
        ) : (
          <div
            className='container-fluid d-flex justify-content-center'
            style={{
              marginTop: '50px',
            }}
          >
            <div
              className='row'
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {usersById[currentUserName].listBoard.map((card) => (
                <div className='col-2' key={card}>
                  <div className='card text-center'>
                    <div className='overflow'>
                      <img
                        src={`https://www.computerhope.com/jargon/t/task.png`}
                        alt='image'
                        className='card-img-top'
                      />
                    </div>
                    <div
                      className='card-body text-dark'
                      style={{ padding: '1rem 5px' }}
                    >
                      <h4 className='card-title'>
                        {boardsById[card].boardTitle}
                      </h4>
                      {usersById[currentUserName].newBoard !== undefined &&
                      usersById[currentUserName].newBoard === card ? (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-around',
                            backgroundColor: 'greenyellow',
                          }}
                        >
                          <button
                            style={{ padding: '2px 8px' }}
                            onClick={() => {
                              //   const listMember = [];
                              //   for (const property in this.props.usersById) {
                              //     if (property !== currentUserName) {
                              //       const isExit = this.props.usersById[
                              //         property
                              //       ].listBoard.find((board) => board === card);
                              //       console.log(isExit);
                              //       if (isExit !== undefined) {
                              //         listMember.push(property);
                              //       }
                              //     }
                              //   }
                              const { dispatch } = this.props;
                              if (
                                window.confirm(
                                  'Are you sure to accept this board?'
                                )
                              ) {
                                dispatch({
                                  type: 'ACCEPT_NEWBOARD',
                                  payload: {
                                    userName: currentUserName,
                                    boardId: card,
                                  },
                                });
                              }
                              //   this.props.changeListMember(listMember);
                              //   this.props.changeCurrentBoard(card);
                              //   this.props.changePage('board');
                            }}
                            className='btn btn-outline-primary'
                          >
                            Add
                          </button>
                          <button
                            style={{ padding: '2px 8px' }}
                            onClick={() => {
                              this.deleteBoard(card);
                            }}
                            className='btn btn-outline-danger'
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-around',
                          }}
                        >
                          <button
                            style={{ padding: '2px 8px' }}
                            onClick={() => {
                              const listMember = [];
                              for (const property in this.props.usersById) {
                                if (property !== currentUserName) {
                                  const isExit = this.props.usersById[
                                    property
                                  ].listBoard.find((board) => board === card);
                                  if (isExit !== undefined) {
                                    listMember.push(property);
                                  }
                                }
                              }
                              this.props.changeCurrentBoard(card);
                              this.props.changeListMember(listMember);
                              this.props.changePage('board');
                            }}
                            className='btn btn-outline-primary'
                          >
                            Go To
                          </button>
                          <button
                            style={{ padding: '2px 8px' }}
                            onClick={() => {
                              this.deleteBoard(card);
                            }}
                            className='btn btn-outline-danger'
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  boardsById: state.boardsById,
  usersById: state.usersById,
});

export default connect(mapStateToProps)(Home);
