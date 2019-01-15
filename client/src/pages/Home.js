import React, { Component } from "react";
import logo from '../images/Chatter_Logo_Transparent.png';
import '../css/chat.css';
import { Redirect } from 'react-router-dom';
import io from 'socket.io-client';
import Message from '../components/Message';
import axios from "axios";
import { TransitionGroup, CSSTransition } from "react-transition-group";

class Home extends Component {
    constructor() {
        super();

        this.state = {
            messages: [],
            messageSizer: '',
            messageSizerBoolean: false,
            messagesInCarts: [[], [], [], []],
            messageInput: '',
            currentCartIndex: 0,
            currentCartHeight: 0,
            sim: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.addMessage = this.addMessage.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
        this.logOut = this.logOut.bind(this);
        this.chatSim = this.chatSim.bind(this);

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
            this.socket.emit("chat-message", { msg: this.state.messageInput, username: user.username });
            this.setState({ messageInput: '' });
        }
    }

    // Add a message to the state ( And format it  for the carts.)
    addMessage(message) {
        // add the message to the messages state array
        this.setState({ messages: [...this.state.messages, { id: message.id, username: message.username, msg: message.msg }] });
        // put the message into the messageSizer, which will be used to measure the height of this message.
        this.setState({ messageSizer: { id: message.id, username: message.username, msg: message.msg }, messageSizerBoolean: true });
        // Get the height of the current message from the messageSizer
        let messageHeight = this.messageSizerDiv.clientHeight;
        // Get the height to the chatSled
        let chatSledHeight = this.chatSled.clientHeight;
        // update the currentCartHeight to include the current message
        this.setState({ currentCartHeight: this.state.currentCartHeight + messageHeight });
        let currentCartHeight = this.state.currentCartHeight;
        // If adding the message to the current cart would cause it to overflow the vertical div,
        if ((currentCartHeight + messageHeight) >= (chatSledHeight - 15)) {
            // iterate the cart that messages are being added to
            this.setState({
                currentCartIndex: this.state.currentCartIndex + 1,
                currentCartHeight: 0
            });
            // if The next cart does not exist
            if (!this.state.messagesInCarts[this.state.currentCartIndex]) {
                // add 3 more carts
                this.setState({ messagesInCarts: [...this.state.messagesInCarts, [], [], []] })
                // scroll to the end for visibility
                this.scrollToBottomOfChatSled();
            }
        }

        // Add the message to the appropriate cart.
        let arrayToSplice = this.state.messagesInCarts;
        let currentCart = this.state.messagesInCarts[this.state.currentCartIndex];
        currentCart.push({ id: message.id, username: message.username, msg: message.msg });
        arrayToSplice.splice(this.state.currentCartIndex, 1, currentCart);
        this.setState({
            messagesInCarts: arrayToSplice
        })
    }

    scrollToBottomOfChatSled() {
        // console.log("scroll function running");
        const scrollWidth = this.chatSled.scrollWidth;
        // console.log(scrollWidth);
        const Width = this.chatSled.clientWidth;
        // console.log(Width);
        const maxScrollLeft = scrollWidth - Width;
        // console.log(maxScrollLeft);
        this.chatSled.scrollLeft = maxScrollLeft > 0 ? maxScrollLeft : 0;
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

    // Toggle the chat simulator on the server by sending an admin command
    chatSim() {
        if (!this.state.sim) {
            this.setState({ sim: true });
            this.socket.emit("chat-message", { msg: "admin chatsim", username: "don't matter" });
        } else {
            this.setState({ sim: false});
            this.socket.emit("chat-message", { msg: "admin simOff", username: "don't matter" });
        }
    }

    render() {
        if (!this.props.loggedIn) { return <Redirect to='/login'></Redirect> }

        return (
            <div id='chatWindow' style={{ position: 'absolute' }}>
                <div className="col-3" id="messageSizeTester" ref={(div) => this.messageSizerDiv = div} style={{ position: 'fixed', zIndex: '-100', backgroundColor: 'blue' }}>
                    {this.state.messageSizerBoolean ? (
                        <Message key={this.state.messageSizer.id} id={this.state.messageSizer.id} username={this.state.messageSizer.username} msg={this.state.messageSizer.msg} />
                    ) : null}
                </div>
                <div className='row p-1'>
                    <div className='col'>
                        <img alt='Chatter logo' src={logo} ></img>
                        <p style={{ position: 'absolute', top: '0px' }}>Alpha v0.1</p>
                    </div>
                    <div className='col text-center'>
                        <button type='button' className='btn btn-secondary' onClick={this.logOut}>Log Out</button><br></br><br></br>
                        <button type='button' className='btn btn-secondary' onClick={this.chatSim}>Toggle Chat Sim</button>
                    </div>
                </div>
                <div className='row'>
                    <input type='text' placeholder='Send a message' autoComplete="off" className='form-control' name='messageInput' value={this.state.messageInput} onChange={this.handleChange} ></input>
                </div>
                <div className='row p-2 d-flex flex-nowrap' ref={(div) => this.chatSled = div} id='chatSled'>
                    {this.state.messagesInCarts.length > 0 ? (
                        this.state.messagesInCarts.map((n, index) => (
                            <div key={index} id={index} ref={(div) => { this['chatCart_' + index] = div }} style={{ position: 'relative' }} className='col-3 chatCart'>
                                <TransitionGroup>
                                    {n.map((m, index) => (
                                        <CSSTransition
                                            in={true}
                                            enter={true}
                                            timeout={1000}
                                            key={m.id}
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
