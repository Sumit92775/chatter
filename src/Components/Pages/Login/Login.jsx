import React, { Component } from 'react';
import {Link , Redirect} from 'react-router-dom';
import './Login.css';
import firebase from './../../../firebase.js';

class Login extends Component {
    state = { 
        email : "",
        password : "",
        user : "",
        phone : "",
        lottie_animation_style : "",
        loading : false,
        splash_screen : true,
     }

     componentDidMount(){

        let forstate = this;
        let countt = 0;
       let interval = setInterval(function(e){
           
           let createMessageDiv = document.createElement("div");
        
           switch (countt) {
               case 0:
               
                    createMessageDiv.classList.add("r_message");
                    createMessageDiv.innerHTML = `<div class="msg">${"Hey girl !! I want to talk to you"}</div>`

                   break;
           
               case 1:
               
                    createMessageDiv.classList.add("r_message");
                    createMessageDiv.innerHTML = `<div class="msg">${"Your are looking soo cute"}</div>`
                    
                   break;
           
               case 2:
               
                    createMessageDiv.classList.add("s_message");
                    createMessageDiv.innerHTML = `<div class="msg">${"ohh thanx!!"}</div>`


                   break;
           
               case 3:
               
                    createMessageDiv.classList.add("s_message");
                    createMessageDiv.innerHTML = `<div class="msg">${"i also want to talk to you"}</div>`


                   break;
           
               case 4:

                    createMessageDiv.classList.add("r_message");
                    createMessageDiv.innerHTML = `<div class="msg">${"come inside"}</div>`

                   
                   break;
           
               case 5:

                    createMessageDiv.classList.add("s_message");
                    createMessageDiv.innerHTML = `<div class="msg">${"okk!!"}</div>`
                   
                   break;
           
               default:
                   break;
           }

            document.querySelector(".chat").append(createMessageDiv);

            countt++;

            if(countt == 7){
                clearInterval(interval);
                forstate.setState({
                    splash_screen : false,
                })
            }


        },2500);

     }

     handleSubmit = () => {

        let forstate = this;

        this.setState({
            loading : true,
        })

         firebase.auth().signInWithEmailAndPassword(this.state.email,this.state.password).then(response => {
             this.setState({
                 user : response.user.uid,
                 loading : false,
             })


             firebase.firestore().collection("currentUsers").doc(`${this.state.phone}-${response.user.uid}`).update({
                onLineOffLine : "true",
                })
             
            firebase.firestore().collection("users").doc(`${this.state.phone}-${response.user.uid}`).update({
                onLineOffLine : "true",
                })
         }).catch(function(e){
            forstate.setState({
                loading : false,
            })
         })
     }

    render() { 
        return ( 

            this.state.splash_screen === true ? 
            
            <>

            <div className="splash_screen_container">
                <div className="splash_screen_container_2">
                    <div className="anim1">
                        <img src="https://cdn.dribbble.com/users/180609/screenshots/2265644/srac.gif" alt="" />
                    </div>
                    <div className="anim2">
                        <div className="chat">
                        </div>
                    </div>
                    <div className="anim3">
                        <img src="https://i.ibb.co/WxgLz1z/ezgif-6-37f95512ddfe-unscreen.gif" alt="" />
                    </div>
                </div>
            </div>
            
            </>
            : 

            this.state.user ? 
            <Redirect to={{pathname : "/chat" ,state : {user : this.state.user , mode : "login" , phone : this.state.phone , currentUserLogin : "true"}}}></Redirect>

            :

            <div class="container">
                <div class="back"  style={{position : "relative"}}>
                    <div style={{position : "absolute", padding : "20px",fontFamily: "PT Sans Caption , sans-serif", fontSize : "50px"}}>Login</div>
                        <div class="info">
                            <img src="https://cdn2.iconfinder.com/data/icons/avatars-99/62/avatar-370-456322-512.png" alt=""/>
                            <input type="text" className="enter_email" placeholder="Enter Email" onChange={(text) =>{this.setState({email : text.target.value})}}/>
                            <input type="password" className="enter_password" placeholder="Enter Password" onChange={(text) =>{this.setState({password : text.target.value})}}/>
                            <input type="text" className="enter_number" placeholder="Enter Number"  onChange={(text) =>{this.setState({phone : text.target.value})}}/>
                            <div class="submit" onClick={() => this.handleSubmit()}>
                                <i class="fas fa-chevron-right"></i>
                            </div>

                            {this.state.loading === true ? 
                                <div className="signup_loading">
                                    <lottie-player src="https://assets1.lottiefiles.com/packages/lf20_x62chJ.json"  background="transparent"  speed="1"  loop autoplay></lottie-player>
                                </div>
                                : 
                            <>
                            </>
                            } 

                            <div className="signup" style={{position : "relative" , top : "10px"}}>
                                <Link to="/signup">
                                    <div className="dex" style={{width : "100%",position : "absolute", top : "20px" , cursor : "pointer" , left : "0px"}}>New User</div>
                                </Link>                                    
                            </div>
                        </div>
                    
                    </div>
                <div class="temp">
                    <div class="front">
                        <lottie-player class="lottie_animation" src="https://assets7.lottiefiles.com/packages/lf20_cikma2xg.json"  background="transparent"  speed="0.8" style={{width: "78%", height: "90%", position: "absolute", left: "147px", borderRadius: "10px" ,display: "flex" ,justifyContent : "space-evenly", alignItems: "center"}}  loop autoplay></lottie-player>
                    </div>
                </div>

            </div>
        
        );
    }
}
 
export default Login;
