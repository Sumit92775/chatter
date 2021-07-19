import React , {Component} from 'react';
import BrowserHistory from 'react-router-dom'
// const BrowserHistory = require('react-router/lib/BrowserHistory').default;
import './createGroup.css';


class CreateGroup extends Component {

    constructor(props){
        super(props);
        this.state = {  };
    }

    GoBackToChatWindow = () =>{
        this.props.history.goBack();
    }

   
    render() { 
        return ( 
          
            <div class="create_group_container">
                <div className="back" onClick={()=>this.GoBackToChatWindow()}></div>
            <div class="group_container">
                <div class="main_container">
                    <div class="choose_friend_for_group">
                        <div class="list">

                            <div class="friend_div">
                                <img alt="" />
                                <i class="fas fa-plus-circle"></i>
                            </div>
                            
                            <div class="friend_div">
                                <img alt="" />
                                <i class="fas fa-plus-circle"></i>
                            </div>
                            
                            <div class="friend_div">
                                <img alt="" />
                                <i class="fas fa-plus-circle"></i>
                            </div>
                            
                            <div class="friend_div">
                                <img alt="" />
                                <i class="fas fa-plus-circle"></i>
                            </div>
                            
                            <div class="friend_div">
                                <img alt="" />
                                <i class="fas fa-plus-circle"></i>
                            </div>
                            
                            <div class="friend_div">
                                <img alt="" />
                                <i class="fas fa-plus-circle"></i>
                            </div>
                            
                            <div class="friend_div">
                                <img alt="" />
                                <i class="fas fa-plus-circle"></i>
                            </div>
                            
                            <div class="friend_div">
                                <img alt="" />
                                <i class="fas fa-plus-circle"></i>
                            </div>
                            
                            <div class="friend_div">
                                <img alt="" />
                                <i class="fas fa-plus-circle"></i>
                            </div>
                            
                        </div>
                    </div>
                    <div class="selected_friends_for_group">
                        <div className="selected_friends">

                        <div class="friend_div">
                                <img alt="" />
                                <i class="fas fa-plus-circle"></i>
                            </div>
                            
                        <div class="friend_div">
                                <img alt="" />
                                <i class="fas fa-plus-circle"></i>
                            </div>
                            
                        <div class="friend_div">
                                <img alt="" />
                                <i class="fas fa-plus-circle"></i>
                            </div>
                            
                        <div class="friend_div">
                                <img alt="" />
                                <i class="fas fa-plus-circle"></i>
                            </div>
                            
                        <div class="friend_div">
                                <img alt="" />
                                <i class="fas fa-plus-circle"></i>
                            </div>
                            
                        <div class="friend_div">
                                <img alt="" />
                                <i class="fas fa-plus-circle"></i>
                            </div>
                            
                        <div class="friend_div">
                                <img alt="" />
                                <i class="fas fa-plus-circle"></i>
                            </div>
                            
                        <div class="friend_div">
                                <img alt="" />
                                <i class="fas fa-plus-circle"></i>
                            </div>
                            
                        <div class="friend_div">
                                <img alt="" />
                                <i class="fas fa-plus-circle"></i>
                            </div>
                            
                        <div class="friend_div">
                                <img alt="" />
                                <i class="fas fa-plus-circle"></i>
                            </div>
                            
                        <div class="friend_div">
                                <img alt="" />
                                <i class="fas fa-plus-circle"></i>
                            </div>
                            
                        <div class="friend_div">
                                <img alt="" />
                                <i class="fas fa-plus-circle"></i>
                            </div>
                            

                        </div>
                        <div className="group_image">
                            <img alt="" />
                            <span>Choose Group Image</span>
                        </div>
                        <div className="group_name"></div>
                    </div>
                </div>
                <div className="next"></div>
                <div class="animation_container"></div>
            </div>
        </div>

         );
    }
}
 
export default CreateGroup;
