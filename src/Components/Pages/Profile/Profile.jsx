import React, { Component } from 'react';
import firebase from './../../../firebase';

class Profile extends Component {
    constructor(props){
        super(props);
        this.state = {
            name : "",
            image : "",
            photoUploaded : null,
            uid : "",
            detailedFetched : false,
        }
        this.next = this.next.bind(this)
    }

    componentDidMount(){
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                  console.log(user.uid);
                  this.setState({uid : user.uid});
                  // ...
                } else {
                }
              });

            

    }

       setImageOnDiv(evt){
                
                let forstate = this;
                var imageFlag = false;
                var imageUrl;
                var tgt = evt.target || window.event.srcElement,
                files = tgt.files;
                // console.log(files);
                // FileReader support
                if (FileReader && files && files.length) {
                    var fr = new FileReader();
                    fr.onload = function () {
                        // console.log(fr.result);
                        document.getElementById('profile_dp').src = fr.result;
                        imageUrl = fr.result;
                        forstate.setState({
                            image : fr.result
                        });
                        window.localStorage.setItem("imageUrl",fr.result);
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

    //    setImageOnDatabase = () =>{

        //     }
        


     async next(){
        console.log("Name : "+this.state.name);

        if(this.state.photoUploaded == false){
            alert('Please Upload Profile Pic');
            return;
        }

        // get currentUser from currentUsers Array from firestore
        
        var mobileNumber;
        var ID = this.state.uid;
        var NAME = this.state.name;
        var IMAGE = this.state.image;
        console.log(IMAGE);
        await firebase.firestore().collection("currentUsers").where("authId","==",`${this.state.uid}`).get()
        .then(function(querySnapshot) {
            console.log(querySnapshot);
            querySnapshot.forEach(function(doc){
                const currentData = doc.data();
                mobileNumber = currentData.phone;
            })
        }).then(function(e){
            // update name and image fields of currentUser in firabase firestore database

            let path = mobileNumber + "-"+ ID;
            firebase.firestore().collection("currentUsers").doc(path).update({
                name : NAME,
                image : IMAGE
            }).then(function(e){

                firebase.firestore().collection("users").doc(path).update({
                     name : NAME,
                     image : IMAGE
                 }).then(function(e){
                     window.location.assign("./chat")
                     console.log("32");
                 })
            })


        })
}

    

        render(){

            return(
    
                <div className="profile">
                <div className="dp_and_user_name">
                    <img id="profile_dp"/>
                    <input type="file" id="img" name="img" accept="image/*" hidden={true} onChange={this.setImageOnDiv}/>
                        <label htmlFor="img">Choose Profile Pic</label>
                    <input className="user_name" placeholder="Enter Name" onChange={(text) =>this.setState({name : text.target.value})}></input>
                </div>
                <div className="next" onClick={() =>this.next} style={{display : 'flex', justifyContent :"space-evenly",alignItems : "center",backgroundColor : "red"}}>Next</div>
                {/* <div className="continue" onClick={() =>this.continue} style={{display : 'flex', justifyContent :"space-evenly",alignItems : "center"}}>Continue</div> */}
            
            </div>
        
            );
        }
        
}
 
export default Profile;
