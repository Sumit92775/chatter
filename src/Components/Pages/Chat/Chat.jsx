import React, { Component } from 'react';
import firebase from './../../../firebase.js';
import {Link , Redirect} from 'react-router-dom';
import './Chat.css';
// import { thisExpression } from 'babel-types';
class Chat extends Component {
    
    constructor(props){
        super(props);
        
        this.state = { 
            loading : false,
            user : null,
            findFriend : "",
            profileDp :  "",
            name : "",
            phone : this.props.location.state.mode === "signup" ? this.props.location.state.phone : this.props.location.state.phone,
            mode : null,
            live : "online",
            fphone : "",
            fname : "",
            fprofileDp : "",
            fstatus : [],
            fuser : "",
            fonLineOffLine : "", 
            flive : "",
            currentUserCompleteFirebaseObject : [],
            userAllFriendsNumber : [],
            fMessageArray : [],
            selectedFriendNumber : null,
            selectedFriendNumberMessageArray : [],
            statusButtonClicked : false,
            mystatus : null,
            selectedStatusImagesArray : [],
            sucessfullyStatusImageUploaded : false,
            statusImageUrls : [],
            viewClicked : false,
            viewClickedAgain : false,
            mystatusFromFirebase : [],
            specialAllfriendsStatusObjectArray : [],
            noOfDotsDiv : "",
            COUNT : 0,
            userDetailsClicked : false,
            currentUserOnline : false,
            createGroupClicked : false,
            completeUserFriendsList : [],
            selectedFriendsForGroup : [],
            groupName : "",
            GroupImage : "",
            selectedGroup : null,
            selectedGroupMembersCount : null,
            groupMembers : [],
         }
         
          this.findFriend = this.findFriend.bind(this);
          this.seeWhatt = this.seeWhatt.bind(this);
          this.handleMessageInput = this.handleMessageInput.bind(this);
          this.addStatus = this.addStatus.bind(this);
          this.viewStatus = this.viewStatus.bind(this);
          this.handleStatusSlideShow = this.handleStatusSlideShow.bind(this);
          this.setImage = this.setImage.bind(this);
          this.userDetails = this.userDetails.bind(this);
          this.signOut = this.signOut.bind(this);
         
        }
        
    componentDidMount(){
            
        console.log("hi : 1");
        console.log(this.state.mystatus);
        console.log(this.state.mystatusFromFirebase);

        if(this.state.userDetailsClicked === "true"){

        }else{

            if(this.state.mystatus === "clicked"){
                console.log("hi : 2");
    
                if(this.state.mystatusFromFirebase.length >= 1){
    
                    if(this.state.statusImageUrls.length == 0){
                        this.setState({
                            statusImageUrls : this.state.mystatusFromFirebase,
                            selectedStatusImagesArray : this.state.mystatusFromFirebase,
                            sucessfullyStatusImageUploaded : true
                        })
                    }
    
                }
    
    
            }else{
    
                let mode = this.props.location.state.mode;
                let forstate = this;
                
            if(this.state.mode == null){
                this.setState({
                    mode : mode
                });
            }
    
    
            if(mode === "login"){
    
                if(this.state.user == null){
                    this.setState({
                        user  : this.props.location.state.user,
                    })
                }
    
    
                console.log(this.props.location.state.user);
    
                let d = this;
                firebase.firestore().collection("currentUsers").where("authId","==",`${this.props.location.state.user}`).get()
                .then(function(querySnapshot) {
                    console.log(querySnapshot);
                    querySnapshot.forEach(function(doc){
                        const currentData = doc.data();
                        console.log(currentData);
                        // mobileNumber = currentData.phone;
                        d.setState({
                            phone : currentData.phone,
                            name : currentData.name,
                            profileDp : currentData.image,
                            mystatusFromFirebase : currentData.mystatus,
                            currentUserOnline : true,
                            live : "online",
                            // fonLineOffLine : "online",
                        })


                         // set user to online

                        firebase.firestore().collection("users").doc(`${currentData.phone}-${forstate.props.location.state.user}`).update({
                            onLineOffLine  : "true",
                        })

                        // set user to online
            
                        // window.localStorage.setItem("uPhone",currentData.phone);
                    })
                })
    
    
                //// set status image url of all current users friends;
    
    
            }else if(mode === "signup"){
    
                if(this.state.user == null){
                    
                    this.setState({
                        user : this.props.location.state.user,
                        phone : this.props.location.state.phone,
                        name : this.props.location.state.name,
                        mystatusFromFirebase : [],
                        currentUserOnline : this.props.location.state.currentUserLogin,
                        live : "online",
                    }) 

                }
    
            }
    
            let s = this;
            

            // Append friends list in UI.
          
            console.log(this.state.phone);
            
    
            firebase.firestore().collection("users").where("phone" , "==" , this.state.phone).get().then(function(querySnapshot) {
                console.log(querySnapshot);
                querySnapshot.forEach(function(doc){
                    const currentData = doc.data();
                    

                    if(forstate.state.currentUserCompleteFirebaseObject){
                        forstate.setState({
                            currentUserCompleteFirebaseObject : currentData,
                        })
                    }

                    var allFriendsList = [];
                    allFriendsList = currentData.friends;
                    let newArray = [];
                    
                    //// set current user is online to all current user friends

                    for(let i = 0 ; i < allFriendsList.length ; i++){
                        let eachFriendPhone = allFriendsList[i].phone;
                        let eachFriendAuthId = allFriendsList[i].authId;

                        firebase.firestore().collection("users").doc(`${eachFriendPhone}-${eachFriendAuthId}`).get().then(function(querySnapShot){
                            querySnapshot.forEach((doc)=>{
                                const data = doc.data();
                                let checkOnlineOffline = data.onLineOffLine;
                                allFriendsList[i].fonLineOffLine = checkOnlineOffline;
                            })
                        })

                    }

                    console.log(allFriendsList);


                    firebase.firestore().collection("users").doc(`${forstate.state.phone}-${forstate.state.user}`).update({
                        friends : allFriendsList
                    })

                    console.log(newArray);


                    //// set current user is online to all current user friends

                    console.log(allFriendsList);
                    
                    // append this allfriendslist in UI.
                    
                    var userAllFriendsNumber = [];
                    var completeFriendsArray = [];

    
                    for(let i = 0 ; i < allFriendsList.length ; i++){


                        var name = "";
                        var phone = "";
                        var image = "";
                        var authId = "";
                        var check_group_or_normal_friend = false;

                        if(allFriendsList[i].md === "group"){

                            console.log(allFriendsList[i].md);
                            console.log("hi");
                            name = allFriendsList[i].groupName;
                            phone = allFriendsList[i].friendPhone;
                            image = allFriendsList[i].groupImage;
                            authId = allFriendsList[i].friendAuthId;
                            check_group_or_normal_friend = true;
                        }else{

                            console.log("hello");
                            console.log(allFriendsList[i].md);
                            name = allFriendsList[i].friendsName;
                            phone = allFriendsList[i].friendPhone;
                            image = allFriendsList[i].friendsImage;
                            authId = allFriendsList[i].friendAuthId;
                        }
    
                        console.log(name);
                        console.log(phone);
                        // console.log(image);
                        console.log(authId);


                        userAllFriendsNumber[i] = allFriendsList[i].friendPhone;
                        
                        completeFriendsArray.push({name : name , phone : phone , authId : authId, image : image});
                        // console.log(image);
    
    
                        let friendDiv = document.createElement("div");
                        // let d = this;
                        console.log(s);
                        friendDiv.innerHTML = `<div class="friend_chat_container">
                    
                            <div class="friend_dp_div">
                            
                            <img class="friend_dp_image" src = "${image}">
                                
                            </img>
                            
                            </div>
                            
                            <div class="friend_name">${check_group_or_normal_friend === true ? name : phone}</div>
                            
                
                            </div>`;
                      
                      console.log("99 : "+forstate);

                      var group = "";
                      if(check_group_or_normal_friend === true){
                          group = name;
                      }else{
                          group = null;
                      }

                      console.log(group);

    
                      friendDiv.addEventListener("click",(e) =>s.seeWhatt(e,friendDiv,group));
              
    
                      if(document.querySelector(".friends_chat_list")){
    
                          document.querySelector(".friends_chat_list").append(friendDiv);
                      }
    
                    }
    
                    forstate.setState({
                        userAllFriendsNumber : userAllFriendsNumber,
                        completeUserFriendsList : completeFriendsArray
                    })
                
                })
              })
    
            // Append friends list in UI.
              
              console.log(this.state.phone);
              firebase.firestore().collection("users").where("phone","==",`${this.state.phone}`)
                .onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        console.log("added");
                    }
                    if (change.type === "modified") {
    
                        console.log("Modified city: ", change.doc.data());
    
                        let arr = change.doc.data().friends;
                        if(document.querySelector(".friends_chat_list")){
    
                            document.querySelector(".friends_chat_list").innerHTML = "";
                        }
    
                        for(let i = 0 ; i < arr.length ; i++){

                            var name = "";
                            var phone = "";
                            var image = "";
                            var check_group_or_normal_friend = false;
                            if(arr[i].md === "group"){

                                name = arr[i].groupName;
                                phone = arr[i].friendPhone;
                                image = arr[i].groupImage;
                                check_group_or_normal_friend = true;

                            }else{
                                name = arr[i].friendsName;
                                phone = arr[i].friendPhone;
                                image = arr[i].friendsImage;
                            }
                
                    
                                        // console.log(image);
                                        
                                        let friendDiv = document.createElement("div");
                                        let d = this;
                                        friendDiv.innerHTML = `<div class="friend_chat_container">
                                    
                                      <div class="friend_dp_div">
                                      
                                      <img class="friend_dp_image" src="${image}">
                                        
                                      </img>
                                      
                                      </div>
                                      
                                      <div class="friend_name">${check_group_or_normal_friend === true ? name : phone}</div>
                                      
                          
                                      </div>`;
                                      
                                      console.log("99 : "+forstate);
    
                                      var group = "";
                                      if(check_group_or_normal_friend === true){
                                          group = name;
                                      }else{
                                          group = null;
                                      }

                                      console.log(group);
                                      friendDiv.addEventListener("click",(e) =>s.seeWhatt(e,friendDiv,group));
              
                                      if(document.querySelector(".friends_chat_list")){
    
                                          document.querySelector(".friends_chat_list").append(friendDiv);
                                      }
                                  
                        }  
    
                        
                    }
                    if (change.type === "removed") {
                        console.log("Removed city: ", change.doc.data());
                    }
                });
            });
    
    
    
            
            //// Listener
           
                firebase.firestore().collection("users").where("phone","==",`${this.state.phone}`)
                .onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        console.log("added");
                        console.log(change.doc.data());
                        
        
                        
                        if(forstate.state.selectedFriendNumber){
                            // Sender
                            
                            console.log("In Friend");
                            firebase.firestore().collection("users").where("phone" , "==" , this.state.phone).get().then(function(querySnapshot) {
                                console.log(querySnapshot);
                                querySnapshot.forEach(function(doc){
                                    const currentData = doc.data();
                                    console.log(currentData);
                                    // set friend name and phone
                                    let withFriendMessageArray = currentData.friends;
                                    
                                    // document.querySelector(".chat_messages").innerHTML = "";
                                    
                                    // console.log(event.target.innerText);
                                    // console.log(withFriendMessageArray[0].Messages);
                    
                                    for(let i = 0 ; i < withFriendMessageArray.length ; i++){
    
                                        // if(forstate.state.selectedFriendNumber){
                                            
                                            if(withFriendMessageArray[i].friendPhone === forstate.state.selectedFriendNumber){
                        
                                                forstate.setState({
                                                    selectedFriendNumberMessageArray : withFriendMessageArray[i].Messages,
                                                })
                        
                                                for(let j = 0 ; j < (withFriendMessageArray[i].Messages).length ; j++){
                        
                                                    let msg = withFriendMessageArray[i].Messages[j];
                        
                                                    msg = msg.split("_");
                                                    let messageDiv = document.createElement("div");
                        
                                                    if(msg[0] === "s"){
                                                        
                                                        messageDiv.innerHTML = `
                                                        <div class="sender_message">
                                                            <div class="msg">${msg[1]}</div>
                                                            <img  class="ticks" src="${forstate.state.fonLineOffLine === "true" ? "https://i.ibb.co/LvkvDnm/ticks-component-2-removebg-preview.png" : ""} alt="">
                                                        <div/>
                                                        `;
                                                    }else if(msg[0] === "r"){
                        
                                                        messageDiv.innerHTML = `
                                                        <div class="receiver_message">
                                                        ${msg[1]}
                                                        <div/>
                                                        `;
                        
                                                    }
                        
                                        
                                                    document.querySelector(".chat_messages").append(messageDiv);
                        
                        
                        
                                                }
                        
                                                console.log(withFriendMessageArray[i].Messages);
                                                break;
                                            }
                                        // }else{
                                            
                                        //     ////
    
                                        //     if(withFriendMessageArray[i].groupName === forstate.state.selectedGroup){
                        
                                        //         forstate.setState({
                                        //             selectedFriendNumberMessageArray : withFriendMessageArray[i].Messages,
                                        //         })
                        
                                        //         for(let j = 0 ; j < (withFriendMessageArray[i].Messages).length ; j++){
                        
                                        //             let msg = withFriendMessageArray[i].Messages[j];
                        
                                        //             msg = msg.split("_");
                                        //             let messageDiv = document.createElement("div");
                        
                                        //             if(msg[0] === "s"){
                                                        
                                        //                 messageDiv.innerHTML = `
                                        //                 <div class="sender_message">
                                        //                     <div class="msg">${msg[1]}</div>
                                        //                     <img  class="ticks" src="${forstate.state.fonLineOffLine === "true" ? "https://i.ibb.co/LvkvDnm/ticks-component-2-removebg-preview.png" : ""} alt="">
                                        //                 <div/>
                                        //                 `;
                                        //             }else if(msg[0] === "r"){
                        
                                        //                 messageDiv.innerHTML = `
                                        //                 <div class="receiver_message">
                                        //                 ${msg[1]}
                                        //                 <div/>
                                        //                 `;
                        
                                        //             }
                        
                                        
                                        //             document.querySelector(".chat_messages").append(messageDiv);
                        
                        
                        
                                        //         }
                        
                                        //         console.log(withFriendMessageArray[i].Messages);
                                        //         break;
                                        //     }
    
                                        //     ///////
    
                                        // }
    
                                    }
                                    
                                   })
                                 })

                            
                             // Receiver
    
                            console.log("In Friend");

                            firebase.firestore().collection("users").where("phone" , "==" , this.state.selectedFriendNumber).get().then(function(querySnapshot) {
                                console.log(querySnapshot);
                                querySnapshot.forEach(function(doc){
                                    const currentData = doc.data();
                                    console.log(currentData);
                                    // set friend name and phone
                                    let withFriendMessageArray = currentData.friends;
                    
                                    
                                    // console.log(event.target.innerText);
                                    console.log(withFriendMessageArray[0].Messages);
                    
                                    for(let i = 0 ; i < withFriendMessageArray.length ; i++){
                                        if(withFriendMessageArray[i].friendPhone === forstate.state.phone){
                    
                                            forstate.setState({
                                                selectedFriendNumberMessageArray : withFriendMessageArray[i].Messages,
                                            })
                    
                                            for(let j = 0 ; j < (withFriendMessageArray[i].Messages).length ; j++){
                    
                                                let msg = withFriendMessageArray[i].Messages[j];
                    
                                                msg = msg.split("_");
                                                let messageDiv = document.createElement("div");
                    
                                                if(msg[0] === "s"){
                                                    
                                                    messageDiv.innerHTML = `
                                                    <div class="sender_message">
                                                        <div class="msg">${msg[1]}</div>
                                                        <img  class="ticks" src="https://i.ibb.co/LvkvDnm/ticks-component-2-removebg-preview.png" alt="">
                                                    <div/>
                                                    `;
                                                }else if(msg[0] === "r"){
                    
                                                    messageDiv.innerHTML = `
                                                    <div class="receiver_message">
                                                    ${msg[1]}
                                                    <div/>
                                                    `;
                    
                                                }
                    
                                                document.querySelector(".chat_messages").innerHTML = "";
                                    
                                                document.querySelector(".chat_messages").append(messageDiv);
                    
                    
                    
                                            }
                    
                                            console.log(withFriendMessageArray[i].Messages);
                                            break;
                                        }
                                    }
                                    
                                })
                                })

            
                        }else{
                            
                            // sender


                            
                            console.log("In Group");
                            
                            firebase.firestore().collection("users").where("phone" , "==" , this.state.phone).get().then(function(querySnapshot) {
                                console.log(querySnapshot);
                                querySnapshot.forEach(function(doc){
                                    const currentData = doc.data();
                                    console.log(currentData);
                                    // set friend name and phone
                                    let withFriendMessageArray = currentData.friends;
                                    
                                    // document.querySelector(".chat_messages").innerHTML = "";
                                    
                                    // console.log(event.target.innerText);
                                    // console.log(withFriendMessageArray[0].Messages);
                    
                                    for(let i = 0 ; i < withFriendMessageArray.length ; i++){
    
                                        // if(forstate.state.selectedFriendNumber){
                                            
                                            if(withFriendMessageArray[i].groupName === forstate.state.selectedGroup){
                        
                                                forstate.setState({
                                                    selectedFriendNumberMessageArray : withFriendMessageArray[i].Messages,
                                                })
                        
                                                for(let j = 0 ; j < (withFriendMessageArray[i].Messages).length ; j++){
                        
                                                    let msg = withFriendMessageArray[i].Messages[j];
                        
                                                    msg = msg.split("_");
                                                    let messageDiv = document.createElement("div");
                        
                                                    if(msg[0] === "s"){
                                                        
                                                        messageDiv.innerHTML = `
                                                        <div class="sender_message">
                                                            <div class="msg">${msg[1]}</div>
                                                            <img  class="ticks" src="${forstate.state.fonLineOffLine === "true" ? "https://i.ibb.co/LvkvDnm/ticks-component-2-removebg-preview.png" : ""} alt="">
                                                        <div/>
                                                        `;
                                                    }else if(msg[0] === "r"){
                        
                                                        messageDiv.innerHTML = `
                                                        <div class="receiver_message">
                                                        ${msg[1]}
                                                        <div/>
                                                        `;
                        
                                                    }
                        
                                        
                                                    document.querySelector(".chat_messages").append(messageDiv);
                        
                        
                        
                                                }
                        
                                                console.log(withFriendMessageArray[i].Messages);
                                                break;
                                            }
                                        // }else{
                                            
                                        //     ////
    
                                        //     if(withFriendMessageArray[i].groupName === forstate.state.selectedGroup){
                        
                                        //         forstate.setState({
                                        //             selectedFriendNumberMessageArray : withFriendMessageArray[i].Messages,
                                        //         })
                        
                                        //         for(let j = 0 ; j < (withFriendMessageArray[i].Messages).length ; j++){
                        
                                        //             let msg = withFriendMessageArray[i].Messages[j];
                        
                                        //             msg = msg.split("_");
                                        //             let messageDiv = document.createElement("div");
                        
                                        //             if(msg[0] === "s"){
                                                        
                                        //                 messageDiv.innerHTML = `
                                        //                 <div class="sender_message">
                                        //                     <div class="msg">${msg[1]}</div>
                                        //                     <img  class="ticks" src="${forstate.state.fonLineOffLine === "true" ? "https://i.ibb.co/LvkvDnm/ticks-component-2-removebg-preview.png" : ""} alt="">
                                        //                 <div/>
                                        //                 `;
                                        //             }else if(msg[0] === "r"){
                        
                                        //                 messageDiv.innerHTML = `
                                        //                 <div class="receiver_message">
                                        //                 ${msg[1]}
                                        //                 <div/>
                                        //                 `;
                        
                                        //             }
                        
                                        
                                        //             document.querySelector(".chat_messages").append(messageDiv);
                        
                        
                        
                                        //         }
                        
                                        //         console.log(withFriendMessageArray[i].Messages);
                                        //         break;
                                        //     }
    
                                        //     ///////
    
                                        // }
    
                                    }
                                    
                                   })
                                 })

                            
                            // Receiver

                            console.log("In Group");

        
                            firebase.firestore().collection("users").where("phone" , "==" , this.state.selectedFriendNumber).get().then(function(querySnapshot) {
                                console.log(querySnapshot);
                                querySnapshot.forEach(function(doc){
                                    const currentData = doc.data();
                                    console.log(currentData);
                                    // set friend name and phone
                                    let withFriendMessageArray = currentData.friends;
                    
                                    
                                    // console.log(event.target.innerText);
                                    console.log(withFriendMessageArray[0].Messages);
                    
                                    for(let i = 0 ; i < withFriendMessageArray.length ; i++){
                                        if(withFriendMessageArray[i].groupName === forstate.state.selectedGroup){
                    
                                            forstate.setState({
                                                selectedFriendNumberMessageArray : withFriendMessageArray[i].Messages,
                                            })
                    
                                            for(let j = 0 ; j < (withFriendMessageArray[i].Messages).length ; j++){
                    
                                                let msg = withFriendMessageArray[i].Messages[j];
                    
                                                msg = msg.split("_");
                                                let messageDiv = document.createElement("div");
                    
                                                if(msg[0] === "s"){
                                                    
                                                    messageDiv.innerHTML = `
                                                    <div class="sender_message">
                                                        <div class="msg">${msg[1]}</div>
                                                        <img  class="ticks" src="https://i.ibb.co/LvkvDnm/ticks-component-2-removebg-preview.png" alt="">
                                                    <div/>
                                                    `;
                                                }else if(msg[0] === "r"){
                    
                                                    messageDiv.innerHTML = `
                                                    <div class="receiver_message">
                                                    ${msg[1]}
                                                    <div/>
                                                    `;
                    
                                                }
                    
                                                // document.querySelector(".chat_messages").innerHTML = "";
                                    
                                                document.querySelector(".chat_messages").append(messageDiv);
                    
                    
                    
                                            }
                    
                                            console.log(withFriendMessageArray[i].Messages);
                                            break;
                                        }
                                    }
                                    
                                })
                                })


                        }

        
        
                    }
                    if (change.type === "modified") {
        
                        console.log("Modified city: ", change.doc.data());
                        
                        if(document.querySelector(".chat_messages")){
                            
                            document.querySelector(".chat_messages").innerHTML = "";
                        }
        
                        let data = change.doc.data();
    
                        let friendsArray = data.friends;
    
                        
                        if(this.state.selectedFriendNumber){

                            for(let i = 0 ; i < friendsArray.length ; i++){
                                if(friendsArray[i].friendPhone === this.state.selectedFriendNumber){
        
                                    for(let j = 0 ; j < (friendsArray[i].Messages).length ; j++){
                    
                                        let msg = friendsArray[i].Messages[j];
            
                                        msg = msg.split("_");
                                        let messageDiv = document.createElement("div");
            
                                        if(msg[0] === "s"){
                                            
                                            messageDiv.innerHTML = `
                                            <div class="sender_message">
                                                    <div class="msg">${msg[1]}</div>
                                                    <img  class="ticks" src="${this.state.fonLineOffLine === "online" ? "https://i.ibb.co/LvkvDnm/ticks-component-2-removebg-preview.png" : "https://i.ibb.co/4fxsNKV/ticks-component-4.png"}"}" alt="">
                                            <div/>
                                            `;
                                        }else if(msg[0] === "r"){
            
                                            messageDiv.innerHTML = `
                                            <div class="receiver_message">
                                            ${msg[1]}
                                            <div/>
                                            `;
            
                                        }
    
                                        if(document.querySelector(".chat_messages")){
                                            document.querySelector(".chat_messages").append(messageDiv);
                                        }
            
            
            
                                    }
            
        
                                    break;
                                }
                            }

                        }else{
                            for(let i = 0 ; i < friendsArray.length ; i++){
                                if(friendsArray[i].groupName === this.state.selectedGroup){
        
                                    for(let j = 0 ; j < (friendsArray[i].Messages).length ; j++){
                    
                                        let msg = friendsArray[i].Messages[j];
            
                                        msg = msg.split("_");
                                        let messageDiv = document.createElement("div");
            
                                        if(msg[0] === "s"){
                                            
                                            messageDiv.innerHTML = `
                                            <div class="sender_message">
                                                    <div class="msg">${msg[1]}</div>
                                                    <img  class="ticks" src="${this.state.fonLineOffLine === "online" ? "https://i.ibb.co/LvkvDnm/ticks-component-2-removebg-preview.png" : "https://i.ibb.co/4fxsNKV/ticks-component-4.png"}"}" alt="">
                                            <div/>
                                            `;
                                        }else if(msg[0] === "r"){
            
                                            messageDiv.innerHTML = `
                                            <div class="receiver_message">
                                            ${msg[1]}
                                            <div/>
                                            `;
            
                                        }
    
                                        if(document.querySelector(".chat_messages")){
                                            document.querySelector(".chat_messages").append(messageDiv);
                                        }
            
            
            
                                    }
            
        
                                    break;
                                }
                            }


                        }
    
                    }
                    if (change.type === "removed") {
                        console.log("Removed city: ", change.doc.data());
                    }
                });
            });
    

                //// Listener when the friend will online or offline


                firebase.firestore().collection("users").where("phone","==",`${this.state.selectedFriendNumber}`)
                .onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        console.log("added");
                    }
                    if (change.type === "modified") {
    
                        console.log("Modified city: ", change.doc.data());
    
                        
                    }
                    if (change.type === "removed") {
                        console.log("Removed city: ", change.doc.data());
                    }
                });
            });
            

            
            firebase.firestore().collection("users").where("phone","==",`${this.state.phone}`)
            .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    console.log("added");
                }
                if (change.type === "modified") {

                    console.log("Modified city: ", change.doc.data());

                    //// set loader

                    forstate.setState({
                        loading : false,
                    })
                    
                    //// set loader


                }
                if (change.type === "removed") {
                    console.log("Removed city: ", change.doc.data());
                }
            });
        });




                //// Listener when the friend will online or offline
        
    
    
            //// Listener
    
    
            }
        }


          
      
    }

    componentDidUpdate(){
        console.log("h2");
        if(this.state.mystatus === "clicked"){
            console.log("hi : 2");

            if(this.state.mystatusFromFirebase.length >= 1){

                if(this.state.statusImageUrls.length == 0){
                    this.setState({
                        statusImageUrls : this.state.mystatusFromFirebase,
                        sucessfullyStatusImageUploaded : true
                    })
                }

            }


        }
    }

    findFriend(event){

        // Search user from allUsers array if found then create div and place on UI.
        if(event.key == "Enter" && (this.state.findFriend).length > 0){
          console.log(this.state.findFriend);
        //   this.setState({fphone : this.state.findFriend});
          var fMobileNumber = this.state.findFriend; //fmobileNumber = 9818140563 
          var cPhone = this.state.phone;
          var cName = this.state.name;
          console.log(cPhone);

          //// set loader

          this.setState({
              loading : true,
          })


          var forstate = this;
          firebase.firestore().collection("users").where("phone" , "==" , fMobileNumber).get().then(function(querySnapshot) {
            console.log(querySnapshot);
            querySnapshot.forEach(function(doc){
                const currentData = doc.data();
                const fcurrentData = doc.data();
                console.log(currentData);
                // set friend name and phone
                forstate.setState({
                    fname : currentData.name,
                    fphone : currentData.phone,
                    fprofileDp : currentData.image,
                    fstatus : currentData.mystatus,
                    fonLineOffLine : currentData.onLineOffLine,
                    fuser : currentData.authId,
                    flive : currentData.live,
                })
                // Make a div and place on Ui.
      
                console.log(currentData.image);
      
                // place this searched user into searched friends friends array into firebase firestore database
                console.log("cPhone :"+cPhone);
                firebase.firestore().collection("users").where("phone" , "==" , cPhone).get().then(function(querySnapshot) {
                  console.log(querySnapshot);
                  querySnapshot.forEach(function(doc){
                      const currentData = doc.data();
                      const CcurrentData = doc.data();
                      const FID = currentData.authId;
                      console.log(currentData.authId);

                      let friendsArray = [];
                      friendsArray = currentData.friends;
                      forstate.setState({
                        fMessageArray : friendsArray.Messages,
                        live : currentData.live, 
                      })

                    //// set current user is online to all current user friends


                  

                    //// set current user is online to all current user friends

                      
                      friendsArray.push({friendsName : forstate.state.fname,friendPhone : forstate.state.fphone , friendsImage : forstate.state.fprofileDp ,Messages : [] , friendStatus : forstate.state.fstatus , fonLineOffLine : fcurrentData.onLineOffLine , friendAuthId : fcurrentData.authId, md : "friend", flive : forstate.state.flive})
                      let path = cPhone + "-"+ FID;
                      console.log(path);
                                firebase.firestore().collection("currentUsers").doc(path).update({
                                    friends : friendsArray
                                }).then(function(e){
                    
                                    firebase.firestore().collection("users").doc(path).update({
                                      friends : friendsArray
                                     }).then(function(e){
                                        //  window.location.assign("./letstalk")
                                         console.log("32");
                                     })
                                }).catch(function(e){
                                  console.log(e);
                                })
              
                  })
                })
              
                // place this searched user into currentUser friends friends array into firebase firestore database
      
      
                firebase.firestore().collection("users").where("phone","==",fMobileNumber).get().then(function(querySnapshot) {
                  console.log(querySnapshot);
                  querySnapshot.forEach(function(doc){
                      const currentData = doc.data();
                      const FID = currentData.authId;
                      console.log(currentData.authId);
                      let friendsArray = [];
                      friendsArray = currentData.friends;


                      friendsArray.push({friendsName : forstate.state.name , friendPhone : forstate.state.phone , friendsImage : forstate.props.location.state.mode === "signup" ? forstate.props.location.state.image : forstate.state.profileDp , Messages : [] , friendStatus : forstate.state.mystatusFromFirebase , fonLineOffLine : forstate.state.currentUserOnline, friendAuthId : forstate.state.user, md : "friend", flive : forstate.state.live});
                      let path = fMobileNumber + "-"+ FID;
                      console.log(path);
                                firebase.firestore().collection("currentUsers").doc(path).update({
                                    friends : friendsArray
                                }).then(function(e){
                                    firebase.firestore().collection("users").doc(path).update({
                                      friends : friendsArray
                                     }).then(function(e){
                         
      
                                        //// setUi************************************************************************
      
      
      
                                         console.log("32");
                                     })
                                }).catch(function(e){
                                  console.log(e);
                                })
              
                            
                  });
      
                });
                // to be continue......
      
                /// ******************************************
      
      
      
      
                /// ******************************************
      
      
              
      
                // set onClick event on all UserFiendsList by calling a function.
                let allUserFriendList = document.querySelectorAll(".friend_chat_container");
                for(let i = 0 ; i < allUserFriendList.length ; i++){
                  allUserFriendList[i].addEventListener("click",function(e){
                    // console.log(e);
                  })
                }
               
               })
             })



             // update listener

             console.log(this.props.location.state.user);

            


        firebase.firestore().collection("currentUsers").where("phone","==",`${fMobileNumber}`)
            .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    console.log("added");
                }
                if (change.type === "modified") {
                    // alert(change.doc.data())
                    console.log("Modified city: ", change.doc.data());

                    let forstate = this;
                    firebase.firestore().collection("users").where("phone" , "==" , this.state.phone).get().then(function(querySnapshot) {
                        console.log(querySnapshot);
                        querySnapshot.forEach(function(doc){
                            const currentData = doc.data();
                            var allFriendsList = [];
                            allFriendsList = currentData.friends;
                            
                        })
                      })
                }
                if (change.type === "removed") {
                    console.log("Removed city: ", change.doc.data());
                }
            });
        });

        
       event.target.value = "";
        
        // update listener
        
    }else{
        // alert("User Not Found!!")
    }
    
    // event.target.value = "";
     
    
    }
          
    seeWhatt = async (event, div, group) =>{

        console.log(group);
        let forstate = this;
        if(document.querySelector(".chat_messages")){
            document.querySelector(".chat_messages").innerHTML = "";
        }



        let parseValue = event.target.innerText;
        let parsedValue = parseInt(parseValue);

         if(isNaN(parsedValue)){

             //// selected friend from friend list is group

            forstate.setState({
                selectedGroup : parseValue,
                selectedFriendNumber : null,
            })

                // Sender

                firebase.firestore().collection("users").where("phone" , "==" , this.state.phone).get().then(function(querySnapshot) {
                    console.log(querySnapshot);
                    querySnapshot.forEach(function(doc){
                        const currentData = doc.data();

                        console.log(currentData);
                        // set friend name and phone
                        var withFriendMessageArray = currentData.friends;
                        var onLineOffLine = currentData.onLineOffLine;

                        
                        console.log(event.target.innerText);
                        console.log(withFriendMessageArray[0].Messages);

                        for(let i = 0 ; i < withFriendMessageArray.length ; i++){
                            if(withFriendMessageArray[i].groupName === event.target.innerText){

                                console.log("phone");

                                let checkOnlineOffline = withFriendMessageArray[i].fonLineOffLine

                                        forstate.setState({
                                            selectedFriendNumberMessageArray : withFriendMessageArray[i].Messages,
                                            fonLineOffLine : checkOnlineOffline,
                                            groupMembers : withFriendMessageArray[i],
                                            fprofileDp : withFriendMessageArray[i].groupImage,

                                })

                                console.log(withFriendMessageArray[i].Messages);
                                console.log(withFriendMessageArray[0].Messages +" : "+i);
                                console.log(withFriendMessageArray);
                                for(let j = 0 ; j < (withFriendMessageArray[i].Messages).length ; j++){

                                    let msg = withFriendMessageArray[i].Messages[j];

                                    msg = msg.split("_");
                                    let messageDiv = document.createElement("div");

                                    if(msg[0] === "s"){
                                        
                                        messageDiv.innerHTML = `
                                        <div class="sender_message">
                                            <div class="msg">${msg[1]}</div>
                                            <img  class="ticks" src={"https://i.ibb.co/LvkvDnm/ticks-component-2-removebg-preview.png" alt="">
                                        <div/>
                                        `;
                                    }else if(msg[0] === "r"){

                                        messageDiv.innerHTML = `
                                        <div class="receiver_message">
                                        ${msg[1]}
                                        <div/>
                                        `;

                                    }

                        
                                    document.querySelector(".chat_messages").append(messageDiv);

                                }

                                console.log(withFriendMessageArray[i].Messages);
                                break;
                            }

                        }
                        
                    })
                    })


                    
            }else if(isNaN(parsedValue) === false){

                //// selected friend from friend list is friend
                
                forstate.setState({
                    selectedFriendNumber : ""+parseValue,
                    selectedGroup : null,
                })

                firebase.firestore().collection("users").where("phone" , "==" , this.state.phone).get().then(function(querySnapshot) {
                console.log(querySnapshot);
                querySnapshot.forEach(function(doc){
                    const currentData = doc.data();
                    console.log(currentData);
                    // set friend name and phone
                    let withFriendMessageArray = currentData.friends;
                    var onLineOffLine = currentData.onLineOffLine;

                    
                    console.log(event.target.innerText);
                    console.log(withFriendMessageArray[0].Messages);

                    for(let i = 0 ; i < withFriendMessageArray.length ; i++){
                        if(withFriendMessageArray[i].friendPhone === event.target.innerText){

                            console.log("phone");

                            let checkOnlineOffline = withFriendMessageArray[i].fonLineOffLine

                                    forstate.setState({
                                        selectedFriendNumberMessageArray : withFriendMessageArray[i].Messages,
                                        fonLineOffLine : checkOnlineOffline,
                                        fprofileDp : withFriendMessageArray[i].friendsImage,
                                        flive : withFriendMessageArray[i].flive,

                            })

                            for(let j = 0 ; j < (withFriendMessageArray[i].Messages).length ; j++){

                                let msg = withFriendMessageArray[i].Messages[j];

                                msg = msg.split("_");
                                let messageDiv = document.createElement("div");

                                if(msg[0] === "s"){
                                    
                                    messageDiv.innerHTML = `
                                    <div class="sender_message">
                                        <div class="msg">${msg[1]}</div>
                                        <img  class="ticks" src={"https://i.ibb.co/LvkvDnm/ticks-component-2-removebg-preview.png" alt="">
                                    <div/>
                                    `;
                                }else if(msg[0] === "r"){

                                    messageDiv.innerHTML = `
                                    <div class="receiver_message">
                                    ${msg[1]}
                                    <div/>
                                    `;

                                }

                    
                                document.querySelector(".chat_messages").append(messageDiv);

                            }

                            console.log(withFriendMessageArray[i].Messages);
                            break;
                        }

                    }
                    
                })
                
                })

            }

///////////////////////////////////////////////////////////////////////////////////////////

         
        

     
     }

     handleMessageInput(event){
         
        var messageTyped = "";
        if(event.key === "Enter" && (event.target.value).length > 0){
            messageTyped = event.target.value;

            let messageDiv = document.createElement("div");
            messageDiv.innerHTML = `
            <div class="sender_message">
                <div class="msg">${messageTyped} </div>
                <img  class="ticks" src={${this.state.fonLineOffLine} === "online" ? "" : ""}"" alt="">
            <div/>
            `;

            document.querySelector(".chat_messages").append(messageDiv);
            console.log(messageTyped);

            // push message on currentUser

            let forstate = this;

            if(this.state.selectedFriendNumber){
                console.log("friend");

                ///// sender

                firebase.firestore().collection("users").where("phone" , "==" , this.state.phone).get().then(function(querySnapshot) {
                console.log(querySnapshot);
                querySnapshot.forEach(function(doc){
                    const currentData = doc.data();
                    console.log(currentData);
                    // set friend name and phone
                    let withFriendMessageArray = currentData.friends;
                    var dummyArray = withFriendMessageArray;
    
    
                    ////
    
                    // let friendArray = currentData.friends;
    
                    // var count = 0;
                    // for(let i = 0 ; i < friendArray.length ; i++){
                    //     if(friendArray[i].groupName === forstate.state.selectedGroup){
                    //         forstate.setState({
                    //             selectedGroupMembersCount : friendArray[i].friendPhone.length,
                    //             groupMembers : friendArray[i],
                    //         })
        
                    //         console.log(friendArray[i]);
                    //         count = friendArray[i].friendPhone.length;
                    //         break;
                    //     }
                    // }
    
    
                    ////
                    
                    // console.log(forstate.state.selectedFriendNumber);
                    // console.log(withFriendMessageArray[0].Messages);
    
                    for(let i = 0 ; i < withFriendMessageArray.length ; i++){
                        // if(forstate.state.selectedFriendNumber.length > 2){
                            
                        //     console.log(forstate.state.selectedFriendNumber);
                            
                            if(withFriendMessageArray[i].friendPhone === forstate.state.selectedFriendNumber){
        
                                let friendMessageArray = [];
                                // let checkOnlineOffline =  withFriendMessageArray[i].onLineOffLine; 
                                friendMessageArray = withFriendMessageArray[i].Messages;
        
                                // friends/0/Messages
                                forstate.setState({
                                    selectedFriendNumberMessageArray : withFriendMessageArray[i].Messages,
                                    // onLineOffLine : checkOnlineOffline,
                                })
        
                                console.log(withFriendMessageArray[i].Messages);
        
                                friendMessageArray.push(`s_${messageTyped}`);
        
                                dummyArray[i] = withFriendMessageArray[i];
        
                                console.log(friendMessageArray);
                                console.log(dummyArray);
        
                                
                                // firebase.firestore().collection("users").doc(forstate.state.phone+"-"+forstate.state.user).collection("friends").
        
                                // console.log(forstate.state.phone+"-"+forstate.state.user+`/friends/${i}`);
        
                                firebase.firestore().collection("users").doc(forstate.state.phone+"-"+forstate.state.user).update({
                                    friends : dummyArray
                                }).then(function(e){
                                    console.log("Yes");
                                })
        
                                break;
                            }
                        // }else{
    
                        //     console.log(forstate.state.selectedFriendNumber);
                        //     console.log(withFriendMessageArray);
    
                        //     console.log(withFriendMessageArray[i].groupName +" : "+forstate.state.selectedGroup+" : "+i);
    
                        //     if(withFriendMessageArray[i].groupName === forstate.state.selectedGroup){
        
                        //         let friendMessageArray = [];
                        //         // let checkOnlineOffline =  withFriendMessageArray[i].onLineOffLine; 
                        //         friendMessageArray = withFriendMessageArray[i].Messages;
        
                        //         // friends/0/Messages
                        //         forstate.setState({
                        //             selectedFriendNumberMessageArray : withFriendMessageArray[i].Messages,
                        //             // onLineOffLine : checkOnlineOffline,
                        //         })
        
                        //         console.log(withFriendMessageArray[i].Messages);
        
                        //         friendMessageArray.push(`s_${messageTyped}`);
        
                        //         dummyArray[i] = withFriendMessageArray[i];
        
                        //         console.log(friendMessageArray);
                        //         console.log(dummyArray);
        
                                
                        //         // firebase.firestore().collection("users").doc(forstate.state.phone+"-"+forstate.state.user).collection("friends").
        
                        //         // console.log(forstate.state.phone+"-"+forstate.state.user+`/friends/${i}`);
        
                        //         firebase.firestore().collection("users").doc(forstate.state.phone+"-"+forstate.state.user).update({
                        //             friends : dummyArray
                        //         }).then(function(e){
                        //             console.log("Yes");
                        //         })
        
                        //         break;
                        //     }
    
                        // }
    
                    }
     
                   })
                 });


                 ///// receiver

                 firebase.firestore().collection("users").where("phone" , "==" , this.state.selectedFriendNumber).get().then(function(querySnapshot) {
                    console.log(querySnapshot);
                    querySnapshot.forEach(function(doc){
                        const currentData = doc.data();
                        console.log(currentData);
                        // set friend name and phone
                        let withFriendMessageArray = currentData.friends;
                        var dummyArray = withFriendMessageArray;
                        var fUser = currentData.authId;
                        
                        
                        console.log(forstate.state.selectedFriendNumber);
                        // console.log(withFriendMessageArray[0].Messages);
        
                        for(let i = 0 ; i < withFriendMessageArray.length ; i++){
                            if(withFriendMessageArray[i].friendPhone === forstate.state.phone){
        
                                let friendMessageArray = [];
                                friendMessageArray = withFriendMessageArray[i].Messages;
        
                                // friends/0/Messages
                                forstate.setState({
                                    selectedFriendNumberMessageArray : withFriendMessageArray[i].Messages,
                                    
                                })
        
                                console.log(withFriendMessageArray[i].Messages);
        
                                friendMessageArray.push(`r_${messageTyped}`); 
        
                                dummyArray[i] = withFriendMessageArray[i];
        
                                console.log(friendMessageArray);
                                console.log(dummyArray);
     
    
                                firebase.firestore().collection("users").doc(forstate.state.selectedFriendNumber+"-"+fUser).update({
                                    friends : dummyArray
                                }).then(function(e){
                                    console.log("Yes");
                                })
        
                                break;
                            }
                        }
        
        
        
                        
                       })
                     })

            //// scroll upto the bottom of the chat_messages container;

                let height = document.querySelector(".chat_messages").scrollHeight;
                window.document.querySelector(".chat_messages").scroll({
                    top : height
                })
                event.target.value = "";

            //// scroll upto the bottom of the chat_messages container;
    
                
            }else if(this.state.selectedGroup){
                console.log("group");

               

                    ///// check selected group members count


                    firebase.firestore().collection("users").where("phone" , "==" , forstate.state.phone).get().then(function(querySnapshot) {
                        console.log(querySnapshot);
                        querySnapshot.forEach(function(doc){
                            const currentData = doc.data();
                            console.log(currentData);
                            // set friend name and phone
                            let withFriendMessageArray = currentData.friends;
                            var dummyArray = withFriendMessageArray;
            
            
                            ////
            
                            let friendArray = currentData.friends;
            
                            var count = 0;
                            for(let i = 0 ; i < friendArray.length ; i++){
                                if(friendArray[i].groupName === forstate.state.selectedGroup){
                                    forstate.setState({
                                        selectedGroupMembersCount : friendArray[i].friendPhone.length,
                                        groupMembers : friendArray[i],
                                    })
                
                                    console.log(friendArray[i]);
                                    count = friendArray[i].friendPhone.length;
                                    break;
                                }
                            }
    
                            
                        })

                    })

                    ///// check selected group members count


                      ///// sender

                firebase.firestore().collection("users").where("phone" , "==" , forstate.state.phone).get().then(function(querySnapshot) {
                    console.log(querySnapshot);
                    querySnapshot.forEach(function(doc){
                        const currentData = doc.data();
                        console.log(currentData);
                        // set friend name and phone
                        let withFriendMessageArray = currentData.friends;
                        var dummyArray = withFriendMessageArray;
        
        
                        for(let i = 0 ; i < withFriendMessageArray.length ; i++){
                            // if(forstate.state.selectedFriendNumber.length > 2){
                                
                            //     console.log(forstate.state.selectedFriendNumber);
                                
                                if(withFriendMessageArray[i].groupName === forstate.state.selectedGroup){
            
                                    let friendMessageArray = [];
                                    // let checkOnlineOffline =  withFriendMessageArray[i].onLineOffLine; 
                                    friendMessageArray = withFriendMessageArray[i].Messages;
            
                                    // friends/0/Messages
                                    forstate.setState({
                                        selectedFriendNumberMessageArray : withFriendMessageArray[i].Messages,
                                        // onLineOffLine : checkOnlineOffline,
                                    })
            
                                    console.log(withFriendMessageArray[i].Messages);
            
                                    friendMessageArray.push(`s_${messageTyped}`);
            
                                    dummyArray[i] = withFriendMessageArray[i];
            
                                    console.log(friendMessageArray);
                                    console.log(dummyArray);
            
                                    
                                    // firebase.firestore().collection("users").doc(forstate.state.phone+"-"+forstate.state.user).collection("friends").
            
                                    // console.log(forstate.state.phone+"-"+forstate.state.user+`/friends/${i}`);
            
                                    firebase.firestore().collection("users").doc(forstate.state.phone+"-"+forstate.state.user).update({
                                        friends : dummyArray
                                    }).then(function(e){
                                        console.log("Yes");
                                    })
            
                                    break;
                                }
                            // }else{
        
                            //     console.log(forstate.state.selectedFriendNumber);
                            //     console.log(withFriendMessageArray);
        
                            //     console.log(withFriendMessageArray[i].groupName +" : "+forstate.state.selectedGroup+" : "+i);
        
                            //     if(withFriendMessageArray[i].groupName === forstate.state.selectedGroup){
            
                            //         let friendMessageArray = [];
                            //         // let checkOnlineOffline =  withFriendMessageArray[i].onLineOffLine; 
                            //         friendMessageArray = withFriendMessageArray[i].Messages;
            
                            //         // friends/0/Messages
                            //         forstate.setState({
                            //             selectedFriendNumberMessageArray : withFriendMessageArray[i].Messages,
                            //             // onLineOffLine : checkOnlineOffline,
                            //         })
            
                            //         console.log(withFriendMessageArray[i].Messages);
            
                            //         friendMessageArray.push(`s_${messageTyped}`);
            
                            //         dummyArray[i] = withFriendMessageArray[i];
            
                            //         console.log(friendMessageArray);
                            //         console.log(dummyArray);
            
                                    
                            //         // firebase.firestore().collection("users").doc(forstate.state.phone+"-"+forstate.state.user).collection("friends").
            
                            //         // console.log(forstate.state.phone+"-"+forstate.state.user+`/friends/${i}`);
            
                            //         firebase.firestore().collection("users").doc(forstate.state.phone+"-"+forstate.state.user).update({
                            //             friends : dummyArray
                            //         }).then(function(e){
                            //             console.log("Yes");
                            //         })
            
                            //         break;
                            //     }
        
                            // }
        
                        }
         
                       })
                     });





                     var insideCount = 0;

                     let interval = setInterval(function(e){
     

                    //// check the message received only to friends not to current user...........................................

                    var friendNumber = forstate.state.groupMembers.friendPhone[insideCount];
                    var friendAuthId = forstate.state.groupMembers.friendAuthId[insideCount];

                    
                    ////////////////////////////////////////////////////////////////////
                    
                    if(friendNumber === forstate.state.phone){

                    }else{

                        console.log(friendNumber);
                        console.log(friendAuthId);
    
                        firebase.firestore().collection("users").where("phone" , "==" , friendNumber).get().then(function(querySnapshot) {
                            console.log(querySnapshot);
                            querySnapshot.forEach(function(doc){
                                const currentData = doc.data();
                                console.log(currentData);
                                // set friend name and phone
                                let withFriendMessageArray = currentData.friends;
                                var dummyArray = withFriendMessageArray;
                                var fUser = currentData.authId;
                                
                                
                                console.log(forstate.state.selectedFriendNumber);
                                // console.log(withFriendMessageArray[0].Messages);
                
                                for(let i = 0 ; i < withFriendMessageArray.length ; i++){
                                    if(withFriendMessageArray[i].groupName === forstate.state.selectedGroup){
                
                                        let friendMessageArray = [];
                                        friendMessageArray = withFriendMessageArray[i].Messages;
                
                                        // // friends/0/Messages
                                        // forstate.setState({
                                        //     selectedFriendNumberMessageArray : withFriendMessageArray[i].Messages,
                                            
                                        // })
                
                                        console.log(withFriendMessageArray[i].Messages);
                
                                        friendMessageArray.push(`r_${messageTyped}`); 
                
                                        dummyArray[i] = withFriendMessageArray[i];
                
                                        console.log(friendMessageArray);
                                        console.log(dummyArray);
             
            
                                        firebase.firestore().collection("users").doc(friendNumber+"-"+friendAuthId).update({
                                            friends : dummyArray
                                        }).then(function(e){
                                            console.log("Yes");
                                        })
                
                                        break;
                                    }
                                }
                
                
                
                                
                               })
                             })
                    }
                    


                    console.log();
                    
                    
                    console.log(insideCount);
                    insideCount++;

                    if(insideCount == forstate.state.selectedGroupMembersCount){
                        clearInterval(interval);
                    }

                },4000);
                

                ////////////////////////////////////////////////////////////////////////

                // }

            }

            
            // push message on friends
            

            //// scroll upto the bottom of the chat_messages container;

            let height = document.querySelector(".chat_messages").scrollHeight;
            window.document.querySelector(".chat_messages").scroll({
                top : height
            })
            event.target.value = "";

            //// scroll upto the bottom of the chat_messages container;
            












            //// fetch no of members in group

            console.log(this.state.selectedFriendNumber);

            // if(this.state.selectedFriendNumber.length > 2){

                // firebase.firestore().collection("users").where("phone" , "==" , this.state.selectedFriendNumber).get().then(function(querySnapshot) {
                //     console.log(querySnapshot);
                //     querySnapshot.forEach(function(doc){
                //         const currentData = doc.data();
                //         console.log(currentData);
                //         // set friend name and phone
                //         let withFriendMessageArray = currentData.friends;
                //         var dummyArray = withFriendMessageArray;
                //         var fUser = currentData.authId;
                        
                        
                //         console.log(forstate.state.selectedFriendNumber);
                //         // console.log(withFriendMessageArray[0].Messages);
        
                //         for(let i = 0 ; i < withFriendMessageArray.length ; i++){
                //             if(withFriendMessageArray[i].friendPhone === forstate.state.phone){
        
                //                 let friendMessageArray = [];
                //                 friendMessageArray = withFriendMessageArray[i].Messages;
        
                //                 // friends/0/Messages
                //                 forstate.setState({
                //                     selectedFriendNumberMessageArray : withFriendMessageArray[i].Messages,
                                    
                //                 })
        
                //                 console.log(withFriendMessageArray[i].Messages);
        
                //                 friendMessageArray.push(`r_${messageTyped}`); 
        
                //                 dummyArray[i] = withFriendMessageArray[i];
        
                //                 console.log(friendMessageArray);
                //                 console.log(dummyArray);
     
    
                //                 firebase.firestore().collection("users").doc(forstate.state.selectedFriendNumber+"-"+fUser).update({
                //                     friends : dummyArray
                //                 }).then(function(e){
                //                     console.log("Yes");
                //                 })
        
                //                 break;
                //             }
                //         }
        
        
        
                        
                //        })
                //      })
            // }else{

            //     
        }else{
            console.log("Enter message");
        }

     }

     myStatus(){
        

        this.setState({
            statusButtonClicked : true,
            mystatus : "clicked",
        })

        var forstate = this;
        var allFriendsNumber = [];
        var specialObject = [];
        firebase.firestore().collection("users").where("phone" , "==" , this.state.phone).get().then(function(querySnapshot) {
            console.log(querySnapshot);
            querySnapshot.forEach(function(doc){
                const currentData = doc.data();
                var allFriendsList = [];
                var allFriendsAuthId = [];
                var allFriendsProfileDp = [];

                allFriendsList = currentData.friends;

                for(let i = 0 ; i < allFriendsList.length ; i++){
                    allFriendsNumber[i] = allFriendsList[i].friendPhone;
                    allFriendsAuthId[i] = allFriendsList[i].friendAuthId;
                    allFriendsProfileDp[i] = allFriendsList[i].friendsImage;
                }

                for(let j = 0 ; j < allFriendsList.length ; j++){
                    firebase.firestore().collection("users").where("phone" , "==" ,  allFriendsNumber[j]).get().then(function(querySnapshot) {
                        console.log(querySnapshot);
                        querySnapshot.forEach(function(doc){
                            const currentData = doc.data();
                            console.log(currentData);
                            // set friend name and phone
                            let postStatus = currentData.mystatus;
                            let number = currentData.phone;
                            let image = currentData.image;

                            if(postStatus.length >= 1){
                                specialObject.push({number : number,postStatus : postStatus,image : image});
                            }

                            console.log(postStatus+" "+number);
            
                })

                forstate.setState({
                    specialAllfriendsStatusObjectArray : specialObject,
                })

            })

        }


    

        });

    });


       
     } 

     addStatus(e){

            const reader = new FileReader();

            console.log(e.target.files);
            
            let file = e.target.files; // get the supplied file

            this.setState({
                selectedStatusImagesArray : file,
                
            })
            // if there is a file, set image to that file
            if (file) {
              reader.onload = () => {
                if (reader.readyState === 2) {
                  console.log(file);
                }
              };
              reader.readAsDataURL(e.target.files[0]);
            // if there is no file, set image back to null
            } else {

            }
          };

     uploadToFirebase = (event) => {
        //1.


        let imageArray = this.state.selectedStatusImagesArray;
        for(let i = 0 ; i < imageArray.length ; i++){

            if (imageArray[i]) {
                //2.
                const storageRef = firebase.storage().ref();
                //3.
                const imageRef = storageRef.child(`${this.state.phone}/${imageArray[i].name}`);
                //4.
                imageRef.put(imageArray[i]);
                //5.
            //     .then(() => {
            //     alert("Image uploaded successfully to Firebase.");
            // });
            } else {
                alert("Please upload an image first.");
            }
        }

        
        event.target.classList.add("hidden");
        this.setState({
            selectedStatusImagesArray : [],
            sucessfullyStatusImageUploaded : true,

        })
        // alert("Image uploaded successfully to Firebase.");

        };


     viewStatus = async (userStatus_friendsStatus,event,statusUrls) =>{

        console.log("I'm in viewStatus function");

        var viewer = "";
        let forstate = this;
        var imagesUrlArray = [];
        console.log(statusUrls);
        if(userStatus_friendsStatus == "userStatus"){
            viewer = this.state.phone;
            console.log(viewer);
            //1.
            var arr = [];
            var count = 0;
            var dotsDiv = ``;
            let storageRef = firebase.storage().ref().child(`${viewer}/`).listAll().then(function(res){
    
                res.items.forEach(async (imageRef) =>{
                     await imageRef.getDownloadURL().then((url) =>{
    
                        console.log(count);
                        // window.localStorage.setItem(`imageUrl_${count}`,url);
                            // console.log(url);
                            arr.push(url);
                            count++;
                            dotsDiv = dotsDiv +`<div className="dot"></div>`;
                            return url;
                        })
                        
                        if(count == res.items.length){
                            
                            console.log(dotsDiv);
                            forstate.setState({
                                statusImageUrls : arr,
                                viewClickedAgain : true,
                                noOfDotsDiv : dotsDiv
                                
                            })
    
                            forstate.setImage("user");
                        }
                      console.log("hello");
                })
            })
    
            
        }else{
            // viewer = event.target.value;

            let dotDiv = ``;

            for(let i = 0 ; i < statusUrls.length ; i++){
                dotDiv+= <div className="dot"></div>
            }

            console.log(dotDiv);
            this.setState({
                statusImageUrls : statusUrls,
                viewClickedAgain : true,
                noOfDotsDiv : dotDiv,
            })


            forstate.setImage("friend" , statusUrls);
        }
        

     }

     setImage(user_friend,urlList){

        let forstate = this;

        if(user_friend === "user"){
            firebase.firestore().collection("users").doc(`${forstate.state.phone}-${forstate.state.user}`).update({
                mystatus : this.state.statusImageUrls
            })
    
            firebase.firestore().collection("currentUsers").doc(`${forstate.state.phone}-${forstate.state.user}`).update({
                mystatus : this.state.statusImageUrls
            })
            
            var count = 0;
            console.log(forstate.state.statusImageUrls);
             let interval = setInterval(function(e){
                 if(document.querySelector(".status_image_container")){
                     let statusDotArray = document.querySelectorAll(`.dot`);
                    for(let i = 0 ; i < statusDotArray.length ; i++){
                        statusDotArray[i].classList.remove("active");
                        statusDotArray[i].setAttribute("style" , "");
                    }

                     if(count != forstate.state.statusImageUrls.length){
                         document.querySelector(".status_image_container").src = (forstate.state.statusImageUrls)[count];
                        //  document.querySelector(`.dot.t${count}t`).classList.add("active");
                        //  document.querySelector(`.dot.active`).style.backgroundColor = "white";

                     }
                     if(count == forstate.state.statusImageUrls.length){
                        forstate.setState({
                            viewClickedAgain : false,
                            COUNT : 0,
                         })
                         console.log("entered");
                         clearInterval(interval);
                     }
                    }

                 console.log(count);
                 count = count + 1;
             },4000);
        }else{

            var count = 0;
            console.log(urlList);
             let interval = setInterval(function(e){

                if(document.querySelector(".status_image_container")){
                    let statusDotArray = document.querySelectorAll(`.dot`);
                   for(let i = 0 ; i < statusDotArray.length ; i++){
                       statusDotArray[i].classList.remove("active");
                       statusDotArray[i].setAttribute("style" , "");
                   }

                    if(count != urlList.length){
                        document.querySelector(".status_image_container").src = urlList[count];
                        document.querySelector(`.dot.t${count}t`).classList.add("active");
                        document.querySelector(`.dot.active`).style.backgroundColor = "white";

                    }
                    if(count == urlList.length){
                       forstate.setState({
                           viewClickedAgain : false,
                           COUNT : 0,
                        })
                        console.log("entered");
                        clearInterval(interval);
                    }
                   }
                 console.log(count);
                 count = count + 1;
             },4000);

        }



         console.log("Hello setImage");
     }

     handleStatusSlideShow = () =>{
         let db = window.localStorage.getItem("statusImageUrl");
        console.log(db);

     }

     backToChatFromStatusContainer = () => {
        this.setState({
            mystatus : null,
            statusButtonClicked : false,
        })  
     }

     userDetails = () => {

        this.setState({
            userDetailsClicked : true
        })
     }


     createGroupClick = () =>{
        console.log("clicked");
        this.setState({
            createGroupClicked : true,
        })
     }

    signOut = () =>{

        console.log("signout");
        let forstate = this;
        console.log(forstate.state.fonLineOffLine);
        forstate.setState({
            fonLineOffLine : "offline",
            flive : "offline",
        })

        firebase.auth().signOut().then(function(e){
            firebase.firestore().collection("users").doc(`${forstate.state.phone}-${forstate.state.user}`).update({
                onLineOffLine : "offline",
            }).then(function(e){
                /// update current live status in current firebase firestore

                firebase.firestore().collection("users").doc(`${forstate.state.phone}-${forstate.state.user}`).update({
                    onLineOffLine : "offline",
                    live : "offline",
                });

                  /// update current live status in friends firebase firestore

                  firebase.firestore().collection("users").where("phone","==",`${forstate.state.phone}`).get().then(function(querySnapshot){
                    querySnapshot.forEach((doc)=>{
                        const currentData = doc.data();
                        var allFriendsData = [];
                        allFriendsData = currentData.friends;
                        var newAllFriendsData = allFriendsData;
                        
                        for(let i = 0 ; i < allFriendsData.length ; i++){
                            // if(allFriendsData[i].friendNumber === forstate.state.selectedFriendNumber){
                            //     // newAllFriendsData = allFriendsData[i];
                                newAllFriendsData[i].live = "offline";
                                // break;
                            }
                        // }

                        allFriendsData.friends = newAllFriendsData;
                        firebase.firestore().collection("users").doc(`${forstate.state.phone}-${forstate.state.user}`).update({
                            friends : newAllFriendsData,
                        }).then(function(e){
                            console.log("Live set to offline");
                        })

                        
                    })
                  })


                  setInterval(function(e){

                  })

                  firebase.firestore().collection("users").where("phone","==",`${forstate.state.fphone}`).get().then(function(querySnapshot){
                    querySnapshot.forEach((doc)=>{
                        const currentData = doc.data();
                        var allFriendsData = [];
                        allFriendsData = currentData.friends;
                        var newAllFriendsData = allFriendsData;
                        
                        for(let i = 0 ; i < allFriendsData.length ; i++){
                            if(allFriendsData[i].friendNumber === forstate.state.phone){
                                // newAllFriendsData = allFriendsData[i];
                                newAllFriendsData[i].live = "offline";
                                break;
                            }
                        }

                        allFriendsData.friends = newAllFriendsData;
                        firebase.firestore().collection("users").doc(`${forstate.state.fphone}-${forstate.state.fuser}`).update({
                            friends : newAllFriendsData,
                        }).then(function(e){
                            console.log("Live set to offline");
                        })

                        
                    })
                  })

               
            }).catch(function(e){
                console.log(e.message);
            })


    })

}

addFriendInGroup = (object) =>{

    console.log(object);
    for(let i = 0 ; i < this.state.selectedFriendsForGroup.length ; i++){
        let check = this.state.selectedFriendsForGroup;
        console.log(check[i].phone+" : "+object.phone);
        if(object.phone === check[i].phone){
            return;
        }
    }

    this.setState({
        selectedFriendsForGroup : [...this.state.selectedFriendsForGroup,object],
    })

}


makeFriendsGroup = () =>{
    console.log(this.state.selectedFriendsForGroup);
    let forstate = this;

    forstate.setState({
        loading : true,
    })

    
    var firbaseUserObject = forstate.state.currentUserCompleteFirebaseObject;
    var friendsArray = [];
    friendsArray = firbaseUserObject.friends;

    var authIds = [];
    var phones = [];
    var names = [];
    var images = [];
    for(let i = 0 ; i < this.state.selectedFriendsForGroup.length ; i++){
        authIds.push(this.state.selectedFriendsForGroup[i].authId);
        phones.push(this.state.selectedFriendsForGroup[i].phone);
        names.push(this.state.selectedFriendsForGroup[i].name);
        images.push(this.state.selectedFriendsForGroup[i].image);
    }

    authIds.push(this.state.user)
    phones.push(this.state.phone)
    names.push(this.state.name)
    images.push(this.state.profileDp)

    console.log(authIds);
    console.log(phones);
    console.log(names);
    console.log(images);

    friendsArray.push({Messages : [],fonLineOffLine : "",friendAuthId : authIds,friendPhone : phones,friendStatus : [],friendsImage : images, friendsName : names, md : "group"})

    firbaseUserObject.friends = friendsArray;

    console.log(friendsArray);
    console.log(firbaseUserObject);


    //// push group details into current user firabase database

    firebase.firestore().collection("users").where("phone", "==", forstate.state.phone).get().then(function(querySnapshot){
        querySnapshot.forEach((doc)=>{
            const currentData = doc.data();
            var completeObj = currentData;
            var fArray = [];
            fArray = currentData.friends;
            fArray.push({Messages : [],fonLineOffLine : "",friendAuthId : authIds,friendPhone : phones,friendStatus : [],friendsImage : images, friendsName : names, groupImage : forstate.state.GroupImage, groupName : forstate.state.groupName, md : "group"})

            completeObj.friends = fArray;
            console.log(fArray);

            firebase.firestore().collection("users").doc(`${forstate.state.phone}-${forstate.state.user}`).update({
                friends : fArray,
            })

        })
    })
 


    //// push group details into group members firabase database
    var length = this.state.selectedFriendsForGroup.length;
    var count = 0;
    let interval = setInterval(function(e){


        var friend = forstate.state.selectedFriendsForGroup[count];
        console.log(friend.phone+"-"+friend.authId);
        var friendPhone = friend.phone;
        var friendAuthId = friend.authId;


        /////

        firebase.firestore().collection("users").where("phone", "==", friendPhone).get().then(function(querySnapshot){
            querySnapshot.forEach((doc)=>{
                const currentData = doc.data();
                var completeObj = currentData;
                var fArray = [];
                fArray = currentData.friends;
                fArray.push({Messages : [],fonLineOffLine : "",friendAuthId : authIds,friendPhone : phones,friendStatus : [],friendsImage : images, friendsName : names, groupImage : forstate.state.GroupImage, groupName : forstate.state.groupName, md : "group"})

                completeObj.friends = fArray;
                console.log(fArray);

                console.log(friendPhone);
                console.log(friendAuthId);

                firebase.firestore().collection("users").doc(`${friendPhone}-${friendAuthId}`).update({
                    friends : fArray,
                })

            })
        })

        if(count == length-1){
            clearInterval(interval);
            console.log("back to chat window");
            forstate.setState({
                loading : false,
                createGroupClicked : false,
            })
        }


        count++;

        


    },4000);

}

setGroupImage = (evt) =>{

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
            document.getElementById('group_image_div').src = fr.result;
            console.log(fr.result);
            imageUrl = fr.result;
            forstate.setState({
                GroupImage : imageUrl,
            })

        }
        fr.readAsDataURL(files[0]);
        
    }
    
    // Not supported
    else {
        // fallback -- perhaps submit the input to an iframe and temporarily store
        // them on the server until the user's session ends.
    }


}

GoBackToChatWindow = () => {
    window.location.reload();
    this.setState({
        createGroupClicked : false,
    });
}

GoBackToChatWindowFromUserDetails = () =>{
    window.location.reload();
    this.setState({
        userDetailsClicked : false,
    })
}

    render() { 
        // console.log(this);
        return ( 
            <div className="chat_container">

                
                    {this.state.createGroupClicked === true ? 

                        <>
                        <div className="create_group_container">
                            <div className="backToChat" onClick={()=>this.GoBackToChatWindow()}>
                                <i class="fas fa-arrow-circle-left"></i>
                            </div>
                            <div class="group_container">
                                <div class="main_container">
                                    <div class="choose_friend_for_group">
                                        <div class="list">

                                            { this.state.completeUserFriendsList.map((object)=>{
                                                    return <div class="friend_div" onClick={()=>this.addFriendInGroup(object)}>
                                                                <img src={object.image} alt="" />
                                                                <i class="fas fa-plus-circle"></i>
                                                            </div>
                                                }) }

                                        </div>
                                    </div>

                                    <div class="selected_friends_for_group">
                                        <h2 className="selected_members_for_group_headline">SELECTED MEMBERS FOR GROUP</h2>
                                        <div className="selected_friends">

                                            {this.state.selectedFriendsForGroup.length == 0 ?
                                            <h4>Empty</h4>
                                            :
                                            <>
                                            { this.state.selectedFriendsForGroup.map((object)=>{
                                                    return  <div class="friend_div">
                                                                    <img src={object.image} alt="" />
                                                                    <i class="fas fa-plus-circle"></i>
                                                            </div>
                                            
                                                }) }
                                            </>
                                            }
                                            

                                        

                                        </div>
                        
                        </div>
                        
                                </div>
                                <div class="animation_container">
                                    <div className="group_image">
                                    <img id="group_image_div" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEUVcV5Ycg4jo9O08xbSU2RdIL1wvfaArz_nEfIvOhDTOEeE6p_a5KF-wneOQPXLLs8A0&usqp=CAU" alt="" />
                                    <input type="file" id="img" name="img" accept="image/*" hidden={true} onChange={(event)=>this.setGroupImage(event)}/>
                                    <label htmlFor="img" style={{backgroundColor : "purple" , padding : "10px" , borderRadius : "20px" , color : "white", fontWeight : "bold"}}>CHOOSE GROUP IMAGE</label>
                                </div>
                                    <div className="group_name_div">
                                        <input type="text" className="group_name" placeholder="Enter Group Name"  onChange={(text) =>{this.setState({groupName : text.target.value})}}/>
                                    </div>
                                    <div className="create_group_and_move_to_chat_window">
                                        <div className="next" onClick={() => this.makeFriendsGroup()}>
                                            <i class="fas fa-arrow-circle-right"></i>
                                        </div>
                                    </div>

                                    {/* //// set loader */}
                                    {this.state.loading === true ? 
                                        <div className="chat_lr_loading">
                                            <lottie-player src="https://assets1.lottiefiles.com/packages/lf20_x62chJ.json"  background="transparent"  speed="1"  loop autoplay></lottie-player>
                                        </div>
                                        : 
                                    <>
                                    </>
                                    } 
                                </div>
                            </div>
                        </div>

                        </>

                    :
                        <>      

                        {this.state.userDetailsClicked === true ? 

                            <>
                            <div className="userDetails_container">
                                <div className="userDetails_container_2">
                                    <div className="userDetails">
                                            <lottie-player class="lottie_animation" src="https://assets6.lottiefiles.com/packages/lf20_9r7uzclr.json"  background="transparent"  speed="0.8"  loop autoplay></lottie-player>
                                        <div className="user_information">
                                            <div className="user_information_name">{this.state.name}</div>
                                            <div className="user_information_number">{this.state.phone}</div>
                                            <div className="user_information_logout" onClick={()=>{this.signOut()}}>
                                                <Link to="/signup" style={{color : "white"}}>
                                                        LOGOUT
                                                </Link>
                                                </div>
                                        </div>
                                    </div>
                                    <div className="userImage">
                                        <div className="user_image_container">
                                            <div className="user_image_user_change_image" style={{position : "relative"}}>
                                                    <div className="img_div">
                                                        <img src={this.props.location.state.mode === "signup" ? this.props.location.state.image : this.state.profileDp} className="profile_image" alt="" />
                                                    </div>
                                                    <div className="change_dp">
                                                        <span className="change_dp text">CHANGE PROFILE</span>
                                                        <img  src="https://i.ibb.co/WcznV8T/pngtree-colorful-feather-illustration-image-1180797-removebg-preview.png" className="change_profile_div"></img>
                                                    </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="reload" style={{paddingTop :"8px"}} onClick={()=>this.GoBackToChatWindowFromUserDetails()}>
                                            <i class="fas fa-arrow-circle-left"></i>
                                        </div>
                            </div>
                            </>
                        :
                        <>
                        
                            {!this.state.mystatus? 
            
                                <div className="chat_lr">
                                            
                                    <div className="chat_left">
            
                                            <div className="current_user_info">
            
                                                    <div className="current_user_info_container">
                                        
                                                        <div className="current_user_dp">
                                                            <img className="current_user_image" onClick={()=>this.userDetails()} src={ this.props.location.state.mode === "signup" ? this.props.location.state.image : this.state.profileDp}/>
                                                        </div>
            
                                                    <div className="chat_list_item_name_last_msg">
                                                        <div className="current_user_name">{this.props.location.state.mode === "signup" ? this.props.location.state.name : this.state.name}</div>   
                                                        <div className="current_user_mobile_number">{this.props.location.state.mode === "signup" ? this.props.location.state.phone : this.state.phone}</div>
                                                    </div>
            
                                                    <div className="statusDiv">
                                                        <span className="my_posts"  onClick={()=>this.myStatus()}>{"MyPost"}</span>
                                                        <div className="create_group" style={{display : "flex", justifyContent : "space-evenly", alignItems : "center" , padding : "6px"}}>
                                                            <i class="create_group fas fa-users"  onClick={()=>this.createGroupClick()}><h5 style={{fontFamily : "Baloo Tammudu 2, cursive"}}></h5></i>
                                                            <h5 style={{fontFamily : "PT Sans Caption, sans-serif",paddingLeft : "2px"}}>Group</h5>
                                                        </div>
                                                    </div>
            
                                            </div>
            
                                        </div>
                                        <input className="find_user" type="text" placeholder="Add Friend" onChange={(text) => this.setState({findFriend : text.target.value,fphone : text.target.value})} onKeyPress={(text)=>this.findFriend(text)}></input>
                                        <div className="friends_chat_list">
            
                                        </div>
            
            
                                    </div>
                                    <div className="chat_right">
                                    {(this.state.selectedFriendNumber != null || this.state.selectedGroup != null )  ? 
                                        
                                        <>
                                            <div className="chat_start_app" style={{backgroundImage : "none"}}>
                                                <div className="selected_friend">
                                                    <div className="info_container">
                                                        <div className="img_name_online_container">
                                                            <div className="img_container">
                                                                <img src={this.state.fprofileDp} alt="" />
                                                            </div>
                                                            <div className="name_online_container">
                                                                <div className="name">{this.state.selectedFriendNumber ? this.state.selectedFriendNumber : this.state.selectedGroup}</div>
                                                                <div className="online">{this.state.flive}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="chat_messages"></div>
                                                <div className="send_message">
                                                    <input className="send_message_input_tag" onKeyPress={(text)=>this.handleMessageInput(text)} placeholder={"Enter message"}></input>
                                                </div>
                                            </div>
            
                                        </>
                                    
                                    :
                                    
                                    // https://assets2.lottiefiles.com/packages/lf20_cxqyzhsq.json
                                    <div className="start_app">
                                            <lottie-player class="lottie_animation" src="https://assets2.lottiefiles.com/packages/lf20_cxqyzhsq.json"  background="transparent"  speed="0.8"  loop autoplay></lottie-player>
                                    </div>
            
                                    }
                                </div>

                                {this.state.loading === true ? 
                                    <div className="chat_lr_loading">
                                        <lottie-player src="https://assets1.lottiefiles.com/packages/lf20_x62chJ.json"  background="transparent"  speed="1"  loop autoplay></lottie-player>
                                    </div>
                                    : 
                                <>
                                </>
                                } 

                                </div>
                            :
                                <div className="mystatus_container">
                                    <div className="mystatus_container_2">
                                        <div className="mystatus_left">
                                            <input id="file" type="file" name="files" hidden="true" multiple onChange={(event)=>this.addStatus(event)}/>
                                            <div className="add_status">
                                                <img src="https://www.logolynx.com/images/logolynx/69/691eca7da08ed4d76f338dcb058f4242.png" alt="" onClick={()=>this.backToChatFromStatusContainer()} style={{position : "absolute", width : "40px" , height : "40px" , top : "10px",left : "10px"}} />
                                                <img className="addstatus_image" htmlFor="file" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANIAAADwCAMAAABCI8pNAAAAbFBMVEX///8VfcMAdcAAd8EAc78AecHj7vfn8vnE2ey+0+mZv+C81eoIesIAcL6fw+I7jcptptV3qtZTl86pyeXu9fr2+v0cgMRhn9FKk8zS4/Ha6PSwzeePud1+r9mHtNsviMg0isgAbLzL3u9bnNAuSdPtAAAIXUlEQVR4nO2d24KiOBCGhSTqSAAPgKgojr7/Oy602o0th5wqFWb5LvbOaf4lqdQpxWw2MTExMTHRTprUpNiPYYT0cCruZeZxRhj3snJ73h2wn0mHWxGHfi3lh0qaH14vN+xHUyEN9sR/U9PU5bN1gP2EkszP3G+X84JR7zzHfkxxDveQ9ep5qgq3I9lXhy3tf0GNFUjHICpdCwt6iFq7btp3VGTJvS0/esJ+6D4WuS8pqMbPE+wH7+Q0YOW64L6rFv1MlQTVhBfsh28lJ8qKqsW3xX78T5JS1i68w2LXLF+SqW2jhqbSLU2Jp6uo1oStokmq/Y6+NMXYOhpc9fbRtyZ3bMTWjCLPIxtsKU8KFZehHUeco6X6Cdui6YgtpyI1KKjyja7Yeir2pjbSA7/AFjQLQqOKKncPPXzPDCvyeI6sqNDxVdtBjjQWJq3diwxV0sasbXjg7xAVJaZtwxNESWeIl4TqQ6QwijyO55KfzDl37/hoZ1NuIkpqg2FlV0As+AMsOx6ZP2ZfUKRUeQy17qqVh+O8pkCHUg1SjLGEsnc1IUoGrAA6lb7wlxiSwEx4DVlhSAIUVG2mPYKiOdypVINxMt1gJXEE+3CCO2hr6MK+pBWsJB/BfwCKlb4lIVjxNawkghAGQktCSEBAS4omSQYANg8YC+/y70kCSB2/SUKweDtg7wGhVzSAjAArSQh5ryOs28oQur8SWPOAkvYyXixrwlFaILaQgTpOvhU0usApBYKGtSFObyhgahIrKQ64mbBKF4D+A4bvUANYjEGr1oKtPLSSGZybh9jvBaQIs+cGKGbCbLmBqprhKQJKQKA23MwSiJWH2xY1uwA0r2G37BpXhN5iOAtMuxD4jaDm+t4fONCuO0uNekWITV4NjLa+E4TiXwuFOU0hSrtDC8a2kwsb6cnVzH4ia2whP+hfm6th6CdSk0XHGAQpRU4Yux8W2pcBiVPvqGaR6dkI4s6luW/SWMeDpQ5ZhgYb5fOJ+wjFZiFOUqMefmCeu4Ms5rFKzih0c9G92PmyVoJwV5ygLhZ7qdXH6Nmtq+mtHPJQVBQL9/gBnxCHrcgEFU7I2Y1QQojjhg2OViojd0emtJIGe0q7BmARys7u2u0+lpeY03pO2UsZr6eU+dk+cuHatirpPIg29zjzCCVeGW/XUTCK/TNfCvgz6aCxnkc3B+xfslyts5BWi0l/Ke0ooTQs19EN7aRKgvO13imPXaLteO6fTi+rhMXnpX1Ziyj/NdHPv+s8xfEt3OKMsu3OpqokikPyYZ8ZVy+DR58OByfh3Vbp7LCmn3q+CBVv6KT79kiL06ywcBwv8x5nx89VFsuhJ8Yn/gbYCi6v/X42V7hXsOqvjlauLeBJdhQYuUglWxbS+2DUyOgFylKchSIhEsss/4MnEjISDlIZvGWCGSBOxQ1VIVqSpwCTDoX/eP33BYc+JRJzHDkxbNFTuSGSpBQxUzculaegZ5OK5nJ/vF58w70LF9k+EJMp5mXH0drHUPpUZtG9YKWpDaVWNGe9znmgVOrgnplzV3UeFA+7nfOz6r9ppJar0djQ5Zwv1CsC3NNfe1qt0+3J7kBxYu1DU6brSej2r4afBeWNXsebdrGw1C3u/R5wPC91G6k0pzcaGH7H3tL4J4Xz4DcCZ143OyNNGuHPsb828g9qdPOamn9A4ofpPWovugdcfWitsRE2/Ouy4k6xSPgJUe1iMbPsHoSbrgSDEoo3Bc32rTLp8mAfipfQQMb5mUIizPxhDnk9SR+VNuU75FU/fRSayYGvzeoj/5ocf0kKrwl4ypAJZF8T8DQHE1DJxK77L0n2bAKefGCGUCpoBxxQaA6p6WzOW/AHMg456DQ/c8gM2dQOz+0gcVd1JOtO5mgCHqpmDvGIfRT2rkZ4pBTkQFazCF+yAx3IapZQUBLwaKt+/GEa20J0iIKhqztKlMtgiGUj7hFMFQEPGOpF6CpgIykiuJluiFtJVpLgdXbAMeGDSEvyhU4m4PGEZiWJzZzDtA7SkoTcvBTzVHpKWuTbNvLbhyR+F5CE6rM+Jc1D3sYz2/BmHkRiJuBRfv28JLX/b/VbJPkCpVtUN1xekogzjprdV3hLf4Ylgc6nH0Jekkh8gRoryUtiAv1fqMGSvCQBKw45e2wYBUnXQUlH1PhPXpJHBiXhhrQKkoYDW9xsuIIkOtj6hRlaqEka7BfAzR0rSBr+1AJua4CKpMHK2X5kR63AMD3QMcCDqBjxwTI0qounJGnQycMM09UkDdYCSyuP3oWCpOEvuYFOCX89OOnCvwpIWtPmT4bvrFiQxPfRqotIQFLw/pPBtJcFScMbul+SLJOkSdL/V1JHaO28pOOfTjqCNlZ0/6SnHGihi+MpqQg7S5ddMRvr/EXY82lECw0CT0lG07qs556ehQZQ25IshIC2JQF/KarGtiTg70zW2JZkITVpW5KFnLh1SfBW3Lok+ESedUkH8NKFdUnwXp59SeAnk31JIB96aGJfEsSHHt5AkARdgcaQdIM9bjEkzSJtQ845Y4T4lPr15dOsoizL6r/1nMm/KwRJQ0OpupVUOiilvMz3m2J3Cm7HRZI0u3zSNFnMFxiSZCc0869XEnr5pjjdjmJDJmxLmiUC87seWnxKvHhdnA6SY02sS6qMRN41B+9bC83yTRQc1caZIEiazeZFHDbHrlab/rHCaJhtN6s/B60xJsVf2kVXzEY6f9GXIfrNYXfZx7Wtqrnm+8tqt1R8Lb9IF5109HWTU9L5E9eHD5tNIDvBJGkMTJLGwCRpDEySxsAkaQxMksbAJGkMTJLGwCRpDEySxsAkaQxMksbA/G9rY7wzX4ZWII12bUQOfERrYmLiH+A/QgyvaH9k1xEAAAAASUVORK5CYII=" alt="" />
                                                <label className="addstatus_text"  htmlFor="file" >Add Status</label>
                                                {this.state.selectedStatusImagesArray.length >= 1 ? 
                                                    <label className="addstatus_apply" onClick={(event) => this.uploadToFirebase(event)} style={{right : "30px",backgroundColor : "green",color : "white", padding : "7px" , fontSize : "14px" , display : "flex", justifyContent : "space-evenly" , alignItems : "center" , marginLeft : "50px" , borderRadius : "15px"}}>{"Apply"}</label>
                                                : 
                                                <>
                                                
                                                {this.state.sucessfullyStatusImageUploaded == true ?
                                                    <>
                                                        <label className="addstatus_apply" onClick={(event) => this.viewStatus("userStatus",event,"")} style={{right : "30px",backgroundColor : "green",color : "white", padding : "7px" , fontSize : "12px" , display : "flex", justifyContent : "space-evenly" , alignItems : "center", borderRadius : "15px", marginLeft : "50px" ,    fontFamily: "Baloo Tammudu 2, cursive",
                                                            fontFamily: "PT Sans Caption, sans-serif"}}>{"View"}</label>
                                                    </>
            
                                                    : 
                                                    <div> 
            
                                                    </div>
                                                }
                                                </>
                                                
                                            }
                                            </div>
                                            <div className="friends_status">
            
                                            {this.state.specialAllfriendsStatusObjectArray.length > 0 ? 
            
                                                this.state.specialAllfriendsStatusObjectArray.map((statusObject) =>{
                                                    return <div>
                                                                <div className="friends_status_list" onClick={()=>this.viewStatus("","",statusObject.postStatus)}>
                                                                        <img className="friends_status_list_image" src={statusObject.image} alt="" />
                                                                        <div className="friends_list_status_name">{statusObject.number}</div>
                                                                </div>
                                                            </div>
                                                })
                                                : 
                                                <span>{"No Status Available"}</span>
                                                }
            
            
                                            </div>
                                        
                                        </div>
            
                                        {this.state.viewClickedAgain == true ? 
                                            
                                            <div className="mystatus_right">
                                                <img className="status_image_container" style={{ width : "100%", height : "90%",borderRadius : "20px"}}></img>
                                                <div className="status_dot_container">
                                                    {this.state.statusImageUrls.map((object) =>{
                                                        return <div className={`dot t${(this.state.COUNT)++}t`}></div>
                                                    })}
                                                </div>
                                            </div>
                                        //  this.handleStatusSlideShow()
                                        
                                            :
                                            <>
                                            <lottie-player class="mystatus_right" src="https://assets4.lottiefiles.com/packages/lf20_6aYlBl.json"  background="transparent" style={{ width : "81%", height : "100%",borderRadius : "20px"}} speed="1"  loop autoplay>
                                            </lottie-player>
                                            </>
                                        }
                                    </div>
                                </div>
            
                                }

                        </>
                        }
                        </>

                    }



                   </div>
      
         );
    }
}
 
export default Chat;


