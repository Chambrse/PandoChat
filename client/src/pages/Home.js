import React, { Component } from "react";
import logo from '../images/Chatter_Logo_Transparent.png';
import '../css/chat.css';
import { Link, Redirect } from 'react-router-dom';
import io from 'socket.io-client';
import Message from '../components/Message';
import axios from "axios";
import { TransitionGroup, CSSTransition, Transition } from "react-transition-group";

class Home extends Component {
    constructor() {
        super();

        this.state = {
            messages: [],
            messagesInCarts: [],
            messageInput: '',
        }

        this.handleChange = this.handleChange.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.addMessage = this.addMessage.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
        this.logOut = this.logOut.bind(this);
    };

    componentDidMount() {
        // If you're logged in, initialize the socket, and keydown event listener.
        if (this.props.loggedIn) {
            console.log('socket initialize');
            this.socket = io(window.location.host);
            document.addEventListener("keydown", this.handleKeydown, false);
            this.socket.on("chat-message", this.addMessage);
        }
    }

    handleKeydown(event) {
        let { user } = this.props;
        // On enter, emit the message.
        if (event.keyCode === 13 && this.props.loggedIn) {
            console.log(user);
            this.socket.emit("chat-message", { msg: this.state.messageInput, username: user.username });
            this.setState({ messageInput: '' });
        }
    }

    // Add a message to the state ( And format it for the carts.)
    addMessage(message) {
        this.setState({ messages: [...this.state.messages, { id: message.id, username: message.username, msg: message.msg }] });

        
        if (this.state.messagesInCarts.length > 0) {
            let lastCart = this.state.messagesInCarts[this.state.messagesInCarts.length - 1];
            if (lastCart.length === 5) {
                console.log('new cart')
                this.setState({ messagesInCarts: [...this.state.messagesInCarts, [{ id: message.id, username: message.username, msg: message.msg }]] })
            } else {
                console.log('add message to last cart')
                lastCart.push({ id: message.id, username: message.username, msg: message.msg })
                let newCarts = this.state.messagesInCarts;
                newCarts.pop();
                newCarts.push(lastCart);
                console.log(newCarts);
                this.setState({ messagesInCarts: newCarts })
            }
            console.log(lastCart);
        } else {
            console.log('start of structure');
            this.setState({ messagesInCarts: [[{ id: message.id, username: message.username, msg: message.msg }]] })
        }

    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    // Log out
    logOut() {
        console.log('logout running')
        axios.get('/logout').then(response => {
            this.props.updateAppState(response.data);
        });
    }

    render() {
        if (!this.props.loggedIn) { return <Redirect to='/login'></Redirect> }

        return (
            <div id='chatWindow' style={{ position: 'absolute' }}>
                <div className='row p-1'>
                    <div className='col'>
                        <img alt='Chatter logo' src={logo} ></img>
                    </div>
                    <div className='col text-center'><button type='button' className='btn btn-secondary' onClick={this.logOut}>Log Out</button></div>
                </div>
                <div className='row'>
                    <input type='text' className='form-control' name='messageInput' value={this.state.messageInput} onChange={this.handleChange} ></input>
                </div>
                <div className='row p-2 d-flex flex-nowrap' id='chatSled'>
                    {this.state.messagesInCarts.length > 0 ? (
                        this.state.messagesInCarts.map(n => (
                            <div className='col-3 chatCart'>
                                <TransitionGroup>
                                    {n.map((m, index) => (
                                        <CSSTransition
                                            in={true}
                                            enter={true}
                                            timeout={1000}
                                            classNames="message"
                                            unmountOnExit
                                        >
                                            <Message key={m.id} id={m.id} username={m.username} msg={m.msg} />
                                        </CSSTransition>
                                    ))}
                                </TransitionGroup>
                            </div>
                        ))
                    ) : null}
                </div>
            </div>
        )
    }
}

export default Home;
