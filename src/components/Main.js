import "../styles/Board.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import Board from "./Board";
import Signin from "./Signin";
import Home from "./Home";
import Signup from "./Signup";

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: "signin",
            currentUserName: "",
            currentBoard: "",
            member: ""
          };
        this.changePage = this.changePage.bind(this);
        this.changeCurrentName = this.changeCurrentName.bind(this);
        this.changeCurrentBoard = this.changeCurrentBoard.bind(this);
        this.addMember = this.addMember.bind(this);
        this.deleteMember = this.deleteMember.bind(this);
    }
  

  changePage(page){
    this.setState({
        page: page
    });
  }
  changeCurrentName(name){
    this.setState({
        currentUserName: name
    });
  }
  changeCurrentBoard(boardId){
      this.setState({
          currentBoard: boardId
      });
  }
  addMember(){
      if(this.state.member === ''){
        alert("Nhập tên người bạn muốn mời");
        return;
      }
      const {user} = this.props;
      const userWantToInvite = user.lists.find(user => user === this.state.member);
      if(userWantToInvite === undefined){
        alert("Người này không tồn tại");
      }else{
        const { dispatch } = this.props;
        dispatch({
            type: "ADD_MEMBER",
            payload: { userName: this.state.member, boardId: this.state.currentBoard }
        });
        alert("Đã thêm tài khoản này");
        this.setState({
            member: ""
        });
      }
  }
  deleteMember(){
    if(this.state.member === ''){
        alert("Nhập tên người bạn muốn xóa");
        return;
    }
    const {user} = this.props;
    const userWantToInvite = user.lists.find(user => user === this.state.member);
    if(userWantToInvite === undefined){
        alert("Người này không tồn tại");
    }else{
        const {usersById, dispatch} = this.props;
        const isExitBoard = usersById[this.state.member].listBoard.find(board => board === this.state.currentBoard);
        if(isExitBoard === undefined){
            alert("Người này không trong bảng của bạn");
        }else{
            if (window.confirm("Are you sure to delete this perpson out board?")) {
                dispatch({
                  type: "DELETE_MEMBER",
                  payload: {boardId: this.state.currentBoard, userName: this.state.member}
                });
              }
        }
    }
  }

  render() {
    const {page} = this.state;
    return (
        page === "board" ? 
        (
        <div>
            <div className="Header" style={{display: "flex", justifyContent: "space-around"}}>
                <div>
                <button onClick={() => { this.setState({
                    page: "home",
                    currentBoard: ""
                })}} className="btn btn-outline-primary">&lt; Back</button>
                </div>
                <div>The FLASH</div>
                <div className="input-group" style={{width: "400px"}}>
                    <input value={this.state.member} onChange={(event) => {this.setState({
                        member: event.target.value
                        })}} 
                    style={{height: "38px", borderRadius: "5px", marginTop: "14px", marginRight: "15px"}} type="text" className="form-control" placeholder="Member.." aria-label="Recipient's username" aria-describedby="basic-addon2" />
                    <div className="input-group-append">
                        <button onClick={this.addMember} className="btn btn-success" type="button">Add member</button>
                    </div>
                    <div className="input-group-append" style={{marginLeft: "10px"}}>
                        <button onClick={this.deleteMember} className="btn btn-danger" type="button">Delete</button>
                    </div>
                </div>
            </div>
            <Board currentBoard={this.state.currentBoard}/>
        </div>
        ) : page === "signin" ? 
        (
        <Signin changePage={this.changePage} changeCurrentName={this.changeCurrentName} />
        ) : page === 'home' ? 
        (
            <Home currentUserName={this.state.currentUserName} changeCurrentBoard={this.changeCurrentBoard} changePage={this.changePage} changeCurrentName={this.changeCurrentName}/>
        ) : page === 'signup' ? 
        (
            <Signup changePage={this.changePage} />
        ) : ''
    );
  }
}


const mapStateToProps = state => ({ user: state.user, usersById: state.usersById });

export default connect(mapStateToProps)(Main);
