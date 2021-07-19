import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import Profile from '../Profile/Profile.jsx';
import firebase from './../../../firebase.js';
import './Signup.css';

class Signup extends Component {

    constructor(props){
        super(props);

        this.state = { 
            email : "",
            password : "",
            phone : "",
            user : "",
            name : "",
            image : "",
            photoUploaded : false,
            fine : false,
            loading : false,
         }

         this.handleSubmit = this.handleSubmit.bind(this);
         this.setImageOnDiv = this.setImageOnDiv.bind(this);
         this.next = this.next.bind(this);
    }


     handleSubmit = () => {

        this.setState({
            loading : true,
        })
         console.log(this.state.email + " : " +this.state.name);
         console.log("Signup");
         let forstate = this;
         if(this.state.email != null && this.state.email != undefined  &&  this.state.password != undefined &&  this.state.phone != null  &&  this.state.phone != undefined){
          

             console.log(this.state.email);
             firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then(async result => {
             
                 window.localStorage.setItem("phone",this.state.phone);
                 console.log("ok");

                // push user into users array in firebase firestore
                 firebase.firestore().collection("users").doc(`${this.state.phone}-${firebase.auth().currentUser.uid}`).set({
                     email :  this.state.email,
                     name : '',
                     phone :  this.state.phone,
                     image : '' , 
                     authId : firebase.auth().currentUser.uid,
                     friends : [],
                     mystatus : [],
                     onLineOffLine : "true",
                     live : "online",
                 }).catch(function(e){
                     console.log(e);
                 })

                 let forstate = this;
                 await firebase.firestore().collection("currentUsers").doc(`${this.state.phone}-${firebase.auth().currentUser.uid}`).set({
                     email :  this.state.email,
                     name : '',
                     phone :  this.state.phone,
                     image : '', 
                     authId : firebase.auth().currentUser.uid,
                     friends : [],
                     mystatus : [],
                     onLineOffLine : "true",
                     live : "online",
                 }).then(function(e){
                    //  window.location.assign("/profile");
                    forstate.setState({
                        user : firebase.auth().currentUser.uid,
                        loading : false,
                    })
                 }).catch(function(e){
                     console.log(e);

                  
                 })
      
             
                 // console.log(this.state.email);


            }).catch(function(e){
                console.log(e);
                forstate.setState({
                    loading : false,
                })
            })
     
         }else{
             console.log("Error in signing");
         }
     }

     //// profile component

     setImageOnDiv(evt){
               
        var imageFlag = false;
        var imageUrl;
        var tgt = evt.target || window.event.srcElement,
        files = tgt.files;
        // console.log(files);
        // FileReader support
        var forstate = this;
        if (FileReader && files && files.length) {
            var fr = new FileReader();
            fr.onload = function () {
                // console.log(fr.result);
                document.getElementById('profile_dp').src = fr.result;
                console.log(fr.result);
                imageUrl = fr.result;
                forstate.setState({
                    image : imageUrl,
                    photoUploaded : true,
                })
                imageFlag = true;
            }
            fr.readAsDataURL(files[0]);
            
        }
        
        // Not supported
        else {
            // fallback -- perhaps submit the input to an iframe and temporarily store
            // them on the server until the user's session ends.
        }


}

        
// continue = () =>{
            
//     if(window.localStorage.getItem("imageUrl") != null || window.localStorage.getItem("imageUrl") != undefined || window.localStorage.getItem("imageUrl").length != 0){
//         console.log(window.localStorage.getItem("imageUrl"));
//         let picUrl = window.localStorage.getItem("imageUrl");
//         this.setState({image : picUrl});
//         this.setState({photoUploaded : true});
//         window.localStorage.setItem("imageUrl","");
//     }
// }

async next(){

console.log("Name : "+this.state.name);
console.log("photoUploaded : "+this.state.photoUploaded);

if(this.state.photoUploaded == false){
alert('Please Upload Profile Pic');
return;
}

this.setState({
    loading : true,
})

// get currentUser from currentUsers Array from firestore

var mobileNumber;
var ID = this.state.user;
var NAME = this.state.name;
var IMAGE = this.state.image;
var forstate = this;
console.log(ID);
await firebase.firestore().collection("currentUsers").where("authId","==",`${this.state.user}`).get()
.then(function(querySnapshot) {
console.log(querySnapshot);
querySnapshot.forEach(function(doc){
const currentData = doc.data();
mobileNumber = currentData.phone;
})
}).then(function(e){
// update name and image fields of currentUser in firabase firestore database

let path = mobileNumber + "-"+ ID;
console.log(path);
firebase.firestore().collection("currentUsers").doc(path).update({
name : NAME,
image : IMAGE,
onLineOffLine : "true",
live : "online"
}).then(() =>{

firebase.firestore().collection("users").doc(path).update({
     name : NAME,
     image : IMAGE,
     onLineOffLine : "true",
     live : "online"
 }).then(() =>{

    forstate.setState({
        photoUploaded : true,
        fine : true,
        loading : false,
    })

     console.log("32");
 })
})


})
}


componentDidMount(){

}


    render() { 
        return ( 

            this.state.user ?

            this.state.fine ? 
            
            <Redirect to={{pathname : "/chat" , state : {name : this.state.name , user : this.state.user , image : this.state.image , phone : this.state.phone , mode : "signup" , currentUserLogin : "true"}}}></Redirect>

            :


        <div>
            <div class="Scontainer">
                <div class="Sback"  style={{position : "relative"}}>
                    <div style={{position : "absolute", padding : "20px",fontFamily: "PT Sans Caption , sans-serif", fontSize : "50px"}}>Profile</div>
                        <div class="Pinfo">
                            <img id="profile_dp" src="https://cdn2.iconfinder.com/data/icons/avatars-99/62/avatar-370-456322-512.png"/>
                            <input type="file" id="img" name="img" accept="image/*" hidden={true} onChange={this.setImageOnDiv}/>
                            <label htmlFor="img" style={{fontFamily : "PT Sans Caption , sans-serif" , backgroundColor: "beige" , padding : "10px", borderRadius : "30px"}}>CHOOSE PROFILE PIC</label>
                            <div class="Sssubmit" onClick={() => this.next()}>
                                <i class="fas fa-chevron-right"></i>
                            </div>
                        </div>

                       {this.state.loading === true ? 
                                <div className="signup_loading">
                                    <lottie-player src="https://assets1.lottiefiles.com/packages/lf20_x62chJ.json"  background="transparent"  speed="1"  loop autoplay></lottie-player>
                                </div>
                                : 
                            <>
                            </>
                            } 
                    
                    </div>
                <div class="Stemp">
                    <div class="Sfront">  
                        <lottie-player class="Slottie_animation" src="https://assets1.lottiefiles.com/packages/lf20_2oranrew.json"  background="transparent"  speed="0.8" style={{width: "78%", height: "90%", position: "absolute", left: "147px", borderRadius: "10px" ,display: "flex" ,justifyContent : "space-evenly", alignItems: "center"}}  loop autoplay></lottie-player>
                    </div>
                </div>

            </div>
</div>

              :

              <div class="Scontainer">
                <div class="Sback"  style={{position : "relative"}}>
                    <div style={{position : "absolute", padding : "20px",fontFamily: "PT Sans Caption , sans-serif", fontSize : "50px"}}>Signup</div>
                        <div class="Sinfo">
                            <img src="https://cdn2.iconfinder.com/data/icons/avatars-99/62/avatar-370-456322-512.png" alt=""/>
                            <input type="text" className="Senter_name" placeholder="Enter Name"  onChange={(text) =>{this.setState({name : text.target.value})}}/>
                            <input type="text" className="Senter_email" placeholder="Enter Email"  onChange={(text) =>{this.setState({email : text.target.value})}}/>
                            <input type="password" className="Senter_password" placeholder="Enter Password"  onChange={(text) =>{this.setState({password : text.target.value})}}/>
                            <input type="text" className="Senter_number" placeholder="Enter Number"  onChange={(text) =>{this.setState({phone : text.target.value})}}/>
                            <div class="Ssubmit" onClick={() => this.handleSubmit()}>
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
                             

                            <div className="Ssignup" style={{position : "relative" , top : "10px"}}>
                                <Link to="/">
                                    <div className="Sdex" style={{width : "100%",position : "absolute", top : "20px" , cursor : "pointer", padding : "10px" , left : "0px"}}>Already Have an Account</div>
                                </Link>                                    
                            </div>
                        </div>
                    
                    </div>
                <div class="Stemp">
                    <div class="Sfront">
                        <lottie-player class="Slottie_animation" src="https://assets7.lottiefiles.com/packages/lf20_cikma2xg.json"  background="transparent"  speed="0.8" style={{width: "78%", height: "90%", position: "absolute", left: "147px", borderRadius: "10px" ,display: "flex" ,justifyContent : "space-evenly", alignItems: "center"}}  loop autoplay></lottie-player>
                    </div>
                </div>

            </div>
        


);
    }
}
 
export default Signup;
