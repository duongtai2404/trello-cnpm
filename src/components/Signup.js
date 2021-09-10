/* eslint-disable jsx-a11y/anchor-is-valid */
import "../styles/Main.css";

import React, { Component } from "react";
import { connect } from "react-redux";


class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
        username: "",
          email: "",
          password: "",
          retypePassword: ""
        };
        this.signup = this.signup.bind(this);
    }

    signup() {
        if (
          this.state.username=== "" ||
          this.state.email === "" ||
          this.state.password === "" ||
          this.state.retypePassword === ""
        ) {
          alert("Không được để trống");
          return;
        }
        if (this.state.password !== this.state.retypePassword) {
          alert("Mật khẩu nhập không trùng nhau");
          return;
        }
    
        const {userData, dispatch} = this.props;
        const user = userData.lists.find(
          (user) => user === this.state.email
        );

        if (user !== undefined) {
          alert("Tài khoản đã có người sử dụng");
          this.setState({
            userNameSignup: "",
            emailSignup: "",
          });
        } else {
            dispatch({
                type: "ADD_USER",
                payload: { userName: this.state.username, password: this.state.password }
            });
            this.props.changePage('signin');
        }
      }

  onChange(event, key) {
    const value = event.target.value;
    switch (key) {
      case "username":
        this.setState({
          username: value,
        });
        break;

      case "email":
        this.setState({
          email: value,
        });
        break;
      case "password":
        this.setState({
          password: value,
        });
        break;
      case "retypePassword":
        this.setState({
          retypePassword: value,
        });
        break;
      default:
        break;
    }
  }


  render() {
    const { username, email, password, retypePassword } = this.state;
    return (
      <div className="auth-wrapper">
        <div className="auth-inner">
          <form>
            <h3>Sign Up</h3>

            <div className="form-group">
              <label>User Name</label>
              <input
                value={username}
                onChange={(event) => this.onChange(event, "username")}
                type="text"
                className="form-control"
                placeholder="User name"
              />
            </div>

            <div className="form-group">
              <label>Email address</label>
              <input
                value={email}
                onChange={(event) => this.onChange(event, "email")}
                type="text"
                className="form-control"
                placeholder="Enter email"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                value={password}
                onChange={(event) => this.onChange(event, "password")}
                type="password"
                className="form-control"
                placeholder="Enter password"
              />
            </div>

            <div className="form-group">
              <label>Retype Password</label>
              <input
                value={retypePassword}
                onChange={(event) => this.onChange(event, "retypePassword")}
                type="password"
                className="form-control"
                placeholder="Enter password"
              />
            </div>

            <button
              type="button"
              onClick={this.signup}
              className="btn btn-primary btn-block"
            >
              Sign Up
            </button>

            <p className="forgot-password text-right">
              Already registered{" "}
              <a href="#" onClick={() => {this.props.changePage('signin')}}>sign in?</a>
            </p>
          </form>
        </div>
      </div>
    );
  }
}


const mapStateToProps = state => ({ userData: state.user, usersByIdData: state.usersById });

export default connect(mapStateToProps)(Signup);
