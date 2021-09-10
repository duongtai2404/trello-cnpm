/* eslint-disable jsx-a11y/anchor-is-valid */
import "../styles/Main.css";

import React, { Component } from "react";
import { connect } from "react-redux";


class Signin extends Component {
    constructor(props) {
        super(props);
        this.state = {
          email: "",
          password: ""
        };
        this.onSubmit = this.onSubmit.bind(this);


    }

  onSubmit(){
      if(this.state.email === '' || this.state.password === ''){
        alert('Not emty');
        return;
      }
      if(this.state.email !== '' || this.state.password !== ''){
          const {usersById} = this.props;
          const user = usersById[this.state.email];
          if(user === undefined){
            alert('Wrong user name');
            this.setState({
                email: ''
            });
          }else{
              if(user.password === this.state.password){
                this.props.changeCurrentName(this.state.email);
                  this.props.changePage('home');
              }else{
                alert('Wrong password');
                this.setState({
                    password: ''
                });
              }
          }
      }
  }


  render() {
    const {email, password} = this.state;
    return (
      <div className="auth-wrapper">
        <div className="auth-inner">
          <form>
            <h3>Sign In</h3>

            <div className="form-group">
              <label>User name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter user name"
                value={email}
                onChange={(event) => {this.setState({
                    email: event.target.value
                })}}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(event) => {this.setState({
                    password: event.target.value
                })}}
              />
            </div>

            <div className="form-group">
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="customCheck1"
                />
                <label className="custom-control-label" htmlFor="customCheck1">
                  Remember me
                </label>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={this.onSubmit}
            >
              Submit
            </button>
            <p className="forgot-password text-right">
              <a href="#" onClick={() => {this.props.changePage('signup')}}
                className="mr-2"
              >
                {" "}
                Sign Up ?
              </a>
              {/* Forgot <a href="#">password?</a> */}
            </p>
          </form>
        </div>
      </div>
    );
  }
}


const mapStateToProps = state => ({ usersById: state.usersById });

export default connect(mapStateToProps)(Signin);
