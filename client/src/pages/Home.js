import React, { Component } from "react";
import logo from '../images/Chatter_Logo_Transparent.png';
import '../css/chat.css';
import { Redirect } from 'react-router-dom';
import io from 'socket.io-client';
import Message from '../components/Message';
import axios from "axios";
import ReactDOM from 'react-dom';
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
            sim: false,
            firstMessageId: null,
            latestMessageId: null,
            selectedMessageId: null,
            selectedMessage: null,
            numberOfCartsToShow: 4
        }

        this.handleChange = this.handleChange.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.addMessage = this.addMessage.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
        this.logOut = this.logOut.bind(this);
        this.chatSim = this.chatSim.bind(this);
        this.sendRandom = this.sendRandom.bind(this);
        this.messageClick = this.messageClick.bind(this);
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
            this.socket.emit("chat-message", { msg: this.state.messageInput, username: user.username, id: this.state.latestMessageId, replyTo: this.state.selectedMessageId });
            this.setState({ messageInput: '', selectedMessageId: null });
        }

        //on tab: select most recent message or next most recent message
        else if (event.keyCode === 9) {
            event.preventDefault();
            this.messageInputDiv.focus();

            if (this.state.selectedMessageId === null || this.state.selectedMessageId === this.state.firstMessageId) {
                let messageToSelect = this.state.messages.filter(messageObj => messageObj.id === this.state.latestMessageId)[0];
                this.setState({
                    selectedMessageId: this.state.latestMessageId,
                    selectedMessage: messageToSelect
                });
            } else {
                let messageToSelect = this.state.messages.filter(messageObj => messageObj.id === (this.state.selectedMessageId - 1))[0];
                this.setState({
                    selectedMessageId: this.state.selectedMessageId - 1,
                    selectedMessage: messageToSelect
                });
            };
        }

        // escape, reset the selected message
        else if (event.keyCode === 27) {
            event.preventDefault();
            if (this.state.selectedMessageId != null) {
                this.setState({
                    selectedMessageId: null,
                    selectedMessage: null
                });
                this.scrollToBottomOfChatSled();
            }
        }
    }

    // Add a message to the state ( And format it  for the carts.) (This is a friggin mess!!!!)
    addMessage(message) {

        // put the message into the messageSizer, which will be used to measure the height of this message.
        this.setState({ messageSizer: { id: message.id, username: message.username, msg: message.msg }, messageSizerBoolean: true });

        // This object will collect the state variables that need to be changed, so that they can all be changed with one setstate at the end and avoid multiple renders for each message. This is important, because before, there was a huge performance hit with 4-5 renders per message. unfortunately, we are unable to avoid at least 2 renders because we need to measure the message in the messageSizerDiv before doing the rest of the logic.
        let updateStateObj = {};

        // Define this message as the first message if one was not already specified.
        if (this.state.firstMessageId === null) {
            updateStateObj.firstMessageId = message.id;
        };

        // update the latest message state variable to this message (for the tab select functionality)
        updateStateObj.latestMessageId = message.id;

        // seperate each message in the client side logs
        // console.log("----------------------------------");

        // add the message to the messages state array (this is not currently used for anything I don't think)
        updateStateObj.messages = [...this.state.messages, { id: message.id, username: message.username, msg: message.msg }];

        // Get the height of the current message from the messageSizer
        // console.log("boolean inside addmessage", this.state.messageSizerBoolean);
        let messageHeight = this.messageSizerDiv.clientHeight;
        // console.log("messageHeight", messageHeight);

        // Get the height of the chatSled (I do this with each message in case the view size has changed at any point. currently, there is no functionality for re-rendering all of the messages to fit on a view size change.)
        let chatSledHeight = this.chatSled.clientHeight;
        // console.log("chatsledhieght - 10", chatSledHeight - 10);

        // evaluate if adding the current message to the current cart would cause it to overflow.
        let messageTooBig = (this.state.currentCartHeight + messageHeight) >= (chatSledHeight - 10);
        // console.log("height boolean", messageTooBig);

        // Define what the current cart height should be updated to in the state assuming that there is not overflow.
        let currentCartHeight = this.state.currentCartHeight + messageHeight;
        updateStateObj.currentCartHeight = currentCartHeight;
        // console.log("currentCartHeight", currentCartHeight);

        // initialize variables
        let currentCartIndex;
        let moreCarts = false;

        // If adding the message to the current cart would cause it to overflow the vertical div,
        if (messageTooBig) {
            console.log("iterating cart")
            // iterate the cart that messages are being added to
            currentCartIndex = this.state.currentCartIndex + 1
            updateStateObj.currentCartIndex = currentCartIndex;
            updateStateObj.currentCartHeight = messageHeight;

            // if The next cart does not exist
            if (!this.state.messagesInCarts[currentCartIndex]) {
                // add 3 more carts
                updateStateObj.messagesInCarts = [...this.state.messagesInCarts, [], [], []];
                moreCarts = true;

                // updateStateObj.numberOfCartsToShow = this.state.numberOfCartsToShow + 3;

                // setTimeout(() => {
                //     console.log("timeout");
                //     this.setState({
                //         numberOfCartsToShow: this.state.numberOfCartsToShow - 3
                //     })
                // }, 3000);

            } else {
                updateStateObj.messagesInCarts = this.state.messagesInCarts;
            }
        } else {
            currentCartIndex = this.state.currentCartIndex;
            updateStateObj.messagesInCarts = this.state.messagesInCarts;
        }

        // Add the message to the appropriate cart.
        let arrayToSplice = updateStateObj.messagesInCarts;
        let currentCart = arrayToSplice[currentCartIndex];
        currentCart.push({ id: message.id, username: message.username, msg: message.msg });
        arrayToSplice.splice(currentCartIndex, 1, currentCart);
        updateStateObj.messagesInCarts = arrayToSplice;

        // Make all of the required state changes at once.
        this.setState(updateStateObj);

        // If we've added some new carts, we have to scroll them into view.
        if (moreCarts) {
            this.scrollToBottomOfChatSled();
        };
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
            this.setState({ sim: false });
            this.socket.emit("chat-message", { msg: "admin simOff", username: "don't matter" });
        }
    }

    sendRandom() {
        this.socket.emit("chat-message", { msg: "admin sendOneRandom", username: "don't matter" });
    }

    messageClick(messageId) {
        let messageToSelect = this.state.messages.filter(messageObj => messageObj.id === messageId)[0];
        this.setState({
            selectedMessageId: messageId,
            selectedMessage: messageToSelect
        });
        this.messageInputDiv.focus();
    }

    render() {
        // console.log("home render");
        // console.log("messagesizerboolean", this.state.messageSizerBoolean);
        if (!this.props.loggedIn) { return <Redirect to='/login'></Redirect> }

        return (
            <div id='chatWindow' style={{ position: 'absolute' }}>
                <div className='row p-1'>
                    <div className='col'>
                        <img alt='Chatter logo' src={logo} id="chatterLogo"></img>
                        <p style={{ position: 'absolute', top: '0px' }}>Alpha v0.1</p>
                    </div>
                    <div className='col text-center'>
                        <button type='button' className='btn btn-secondary' onClick={this.logOut}>Log Out</button><br></br><br></br>
                        <button type='button' className='btn btn-secondary' onClick={this.chatSim}>Toggle Chat Sim</button><br></br><br></br>
                        <button type='button' className='btn btn-secondary' onClick={this.sendRandom}>send one random</button>
                    </div>
                </div>
                <div className='row'>
                    <input ref={(div) => this.messageInputDiv = div} type='text' placeholder={this.state.selectedMessageId ? "Reply to " + this.state.selectedMessage.username:'Send a message'} autoComplete="off" className='form-control' name='messageInput' value={this.state.messageInput} onChange={this.handleChange} ></input>
                </div>
                <div className='row p-2 d-flex flex-nowrap' ref={(div) => this.chatSled = div} id='chatSled'>
                    <div className="col-3" id="messageSizeTester" ref={(div) => this.messageSizerDiv = div} style={{ position: 'fixed', zIndex: '-500', backgroundColor: 'blue' }}>
                        {this.state.messageSizerBoolean ? (
                            <Message key={this.state.messageSizer.id} id={this.state.messageSizer.id} username={this.state.messageSizer.username} msg={this.state.messageSizer.msg} />
                        ) : null}
                    </div>
                    {this.state.messagesInCarts.length > 0 ? (
                        this.state.messagesInCarts.map((n, index) => (
                            // <div id="scrollbarHider">
                            <div key={index} cartId={index} ref={(div) => { this['chatCart_' + index] = div }} style={{ position: 'relative', display: index < this.state.currentCartIndex - this.state.numberOfCartsToShow ? "none": "" }} className='col-3 chatCart'>
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
                                            <Message onClick={this.messageClick} classNames={m.id === this.state.selectedMessageId ? 'selectedMessage' : 'test'} key={m.id} id={m.id} username={m.username} msg={m.msg} />
                                        </CSSTransition>
                                    ))}
                                </TransitionGroup>
                            </div>
                            // </div>
                        ))
                    ) : null}
                </div>
            </div>
        )
    }
}

export default Home;
