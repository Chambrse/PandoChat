import React, { Component } from "react";
import logo from '../images/Chatter_Logo_Transparent.png';
import '../css/chat.css';
import io from 'socket.io-client';
import Message from '../components/Message';
import axios from "axios";
import { withRouter } from "react-router";
import { Link } from 'react-router-dom';


class Home extends Component {
    constructor() {
        super();

        this.state = {
            messages: [],
            messageSizer: null,
            messageSizerBoolean: false,
            messagesInCarts: [{ messages: [], index: 0 }, { messages: [], index: 1 }, { messages: [], index: 2 }, { messages: [], index: 3 }],
            messageInput: '',
            currentCartIndex: 0,
            currentCartHeight: 0,
            sim: false,
            firstMessageId: null,
            latestMessageId: null,
            selectedMessageId: null,
            selectedMessage: null,
            numberOfCartsToShow: 10,
            frameWidth: null,
            left: 0,
            numberOfColumns: 4,
            transitionString: 'transform 2s ease-in-out',
            scrolledCartIndex: 0
        }

        this.handleChange = this.handleChange.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.addMessage2 = this.addMessage2.bind(this);
        this.handleKeydown = this.handleKeydown.bind(this);
        this.logOut = this.logOut.bind(this);
        this.chatSim = this.chatSim.bind(this);
        this.sendRandom = this.sendRandom.bind(this);
        this.messageClick = this.messageClick.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
    };

    componentWillMount() {
        // if (!this.props.loggedIn) {
        //     this.props.history.push("/login");
        // }
    }

    componentDidMount() {
        // If you're logged in, initialize the socket, and keydown event listener.
        // if (this.props.loggedIn) {
        // console.log('socket initialize');
        this.socket = io(window.location.host);
        document.addEventListener("keydown", this.handleKeydown, false);
        // this.socket.on("chat-message", this.addMessage);
        this.socket.on("chat-message", this.addMessage2);
        // }
    }

    componentWillUnmount() {
        // console.log("home unmount")
        // window.removeEventListener('scroll', this.onScroll.bind(this), false);
        document.removeEventListener("keydown", this.handleKeydown, false);
        if (this.socket) {
            this.socket.off(null);
        }
    }

    handleKeydown(event) {
        let { user } = this.props;
        // console.log(user);

        // On enter, emit the message.
        if (event.keyCode === 13 && this.props.loggedIn && this.state.messageInput.trim().length > 0) {
            this.socket.emit("chat-message", { msg: this.state.messageInput, username: user.user.username, user: { username: user.user.username, color: user.user.color }, replyTo: this.state.selectedMessage });
            this.setState({ messageInput: '', selectedMessageId: null, selectedMessage: null });
            this.scrollToBottom();
        }

        //on tab: select most recent message or next most recent message
        else if (event.keyCode === 9) {
            event.preventDefault();
            this.messageInputDiv.focus();
            // this.setState({ left: this.state.left + 50 })

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
            }
            this.scrollToBottom();
        }

        //left
        else if (event.keyCode === 37) {
            event.preventDefault();
            if (this.state.scrolledCartIndex > 0) {
                this.setState({
                    left: this.state.left + (this.chatFrame.clientWidth / this.state.numberOfColumns),
                    transitionString: 'transform 0.5s ease-in-out',
                    scrolledCartIndex: this.state.scrolledCartIndex - 1
                })
            }
        }

        //right
        else if (event.keyCode === 39) {
            event.preventDefault();
            if (this.state.scrolledCartIndex < this.state.messagesInCarts.length - this.state.numberOfColumns) {
                this.setState({
                    left: this.state.left - (this.chatFrame.clientWidth / this.state.numberOfColumns),
                    transitionString: 'transform 0.5s ease-in-out',
                    scrolledCartIndex: this.state.scrolledCartIndex + 1
                })
            }
        }
    }

    scrollToBottom() {
        this.setState({
            left: (this.chatFrame.clientWidth / this.state.numberOfColumns) * (this.state.messagesInCarts.length - this.state.numberOfColumns) * -1,
            transitionString: 'transform 2s ease-in-out',
            scrolledCartIndex: this.state.messagesInCarts.length - this.state.numberOfColumns
        })
    }

    addMessage2(message) {
        this.setState({
            messages: [...this.state.messages, { id: message.id, username: message.username, msg: message.msg, user: message.user, objectId: message.objectId, thread: message.thread }],
            messageSizer: { id: message.id, username: message.username, user: message.user, msg: message.msg, color: message.color, thread: message.thread }
        }, () => {
            let updateStateObj = {};

            // Define this message as the first message if one was not already specified.
            if (this.state.firstMessageId === null) {
                updateStateObj.firstMessageId = message.id;
            };

            // update the latest message state variable to this message (for the tab select functionality)
            updateStateObj.latestMessageId = message.id;

            let messageHeight = this['message_Sizer_' + message.id].clientHeight;

            let chatFrameHeight = this.chatFrame.clientHeight;

            // console.log(this.state.messagesInCarts.slice(this.state.messagesInCarts.length - this.state.numberOfCartsToShow >= 0 ? this.state.messagesInCarts.length - this.state.numberOfCartsToShow : 0, this.state.messagesInCarts.length));
            // console.log(this.state.messagesInCarts);
            // console.log(this.state.currentCartIndex);
            // console.log(this.state.messagesInCarts.length - this.state.numberOfCartsToShow)
            let chatCartHeight = this['chatCart_' + this.state.currentCartIndex].clientHeight;

            // console.log("messageHeight", messageHeight);
            // console.log("chat frame height", chatFrameHeight);
            // console.log("chat cart height", chatCartHeight);

            let messageTooBig = (chatCartHeight + messageHeight) >= (chatFrameHeight);
            let pastHalf = (chatCartHeight + messageHeight) >= (chatFrameHeight / 2);
            let nextCartExists = this.state.messagesInCarts[this.state.currentCartIndex + 1] !== undefined;

            // // if The next cart does not exist
            // if (!this.state.messagesInCarts[currentCartIndex]) {
            //     // add 3 more carts
            //     updateStateObj.messagesInCarts = [...this.state.messagesInCarts, [], [], []];
            //     moreCarts = true;

            // } else {
            //     updateStateObj.messagesInCarts = this.state.messagesInCarts;
            // }

            let currentCartIndex;

            if (messageTooBig) {
                // console.log("iterating cart")
                // iterate the cart that messages are being added to
                currentCartIndex = this.state.currentCartIndex + 1
                updateStateObj.currentCartIndex = currentCartIndex;
                updateStateObj.messagesInCarts = this.state.messagesInCarts;


            } else {
                currentCartIndex = this.state.currentCartIndex;
                updateStateObj.messagesInCarts = this.state.messagesInCarts;
            }

            let arrayToSplice = updateStateObj.messagesInCarts;
            let currentCartObject = arrayToSplice[currentCartIndex];
            let currentCart = arrayToSplice[currentCartIndex].messages;
            currentCart.push({ id: message.id, username: message.username, msg: message.msg, user: message.user, thread: message.thread });
            arrayToSplice.splice(currentCartIndex, 1, { messages: currentCart, index: currentCartObject.index });


            if (message.newThread) {
                let arrayWithReplyToIndex = arrayToSplice.findIndex((cart) => {
                    let thisMessageToUpdateIndex = cart.messages.findIndex((messageInCart) => {
                        // console.log(messageInCart.id, message.replyToId);
                        return messageInCart.id === message.replyToId;
                    });
                    if (thisMessageToUpdateIndex !== -1) {
                        return true
                    } else {
                        return false
                    }
                });

                // console.log("incoming thread", message.thread);
                // console.log("messagetoupdate", arrayToSplice[arrayWithReplyToIndex].messages[arrayToSplice[arrayWithReplyToIndex].messages.findIndex((messageInCart) => { return messageInCart.id === message.replyToId; })]);

                arrayToSplice[arrayWithReplyToIndex].messages[arrayToSplice[arrayWithReplyToIndex].messages.findIndex((messageInCart) => { return messageInCart.id === message.replyToId; })].thread = message.thread;

                //update messages array
                let updatedMessagesArray = this.state.messages;
                let messageToUpdateIndex = updatedMessagesArray.findIndex((messageFromArray) => {
                    return messageFromArray.id === message.replyToId
                });
                updatedMessagesArray[messageToUpdateIndex].thread = message.thread;

                updateStateObj.messages = updatedMessagesArray;


            }

            updateStateObj.messagesInCarts = arrayToSplice;

            let moreCarts;

            if (pastHalf && !nextCartExists) {
                let indexOfLastExistingCart = updateStateObj.messagesInCarts[updateStateObj.messagesInCarts.length - 1].index
                updateStateObj.messagesInCarts = [...updateStateObj.messagesInCarts,
                { messages: [], index: indexOfLastExistingCart + 1 },
                { messages: [], index: indexOfLastExistingCart + 2 },
                { messages: [], index: indexOfLastExistingCart + 3 }];
                moreCarts = true;
            }

            // updateStateObj.messages = [];

            // Make all of the required state changes at once.
            this.setState(updateStateObj, () => {
                let isNotScrolled = (this.state.scrolledCartIndex === this.state.messagesInCarts.length - (this.state.numberOfColumns + (this.state.numberOfColumns - 1)));
                if (this.state.selectedMessage == null && moreCarts && isNotScrolled) {
                    this.scrollToBottom();
                }
            });

        });
    }


    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    // Log out
    logOut() {
        // console.log('logout running')
        axios.get('/logout').then(response => {
            this.props.updateAppState(response.data);
            // this.props.history.push("/login");
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


    // componentWillReceiveProps(nextProps) {
    //     console.log(nextProps.location);
    //     console.log(this.props.location);
    // }

    render() {
        // console.log("home render");
        // console.log("messagesizerboolean", this.state.messageSizerBoolean);
        return (
            <div id='chatWindow' style={{ position: 'absolute' }}>
                <div className='row p-1'>
                    <div className='col'>
                        <img alt='Chatter logo' src={logo} id="chatterLogo"></img>
                        <p style={{ position: 'absolute', top: '0px' }}>Alpha v0.1</p>
                    </div>
                    <div className='col text-center'>
                        {this.props.loggedIn ? (
                            <div>
                                <button type='button' className='btn btn-secondary' onClick={this.logOut}>Log Out</button> <br></br> <br></br>
                            </div>
                        ) : null}
                        {this.props.loggedIn && this.props.user.user.type == "admin" ? (
                            <div>
                                <button type='button' className='btn btn-secondary' onClick={this.chatSim}>Toggle Chat Sim</button><br></br><br></br>
                                <button type='button' className='btn btn-secondary' onClick={this.sendRandom}>send one random</button>
                            </div>
                        ) : null}
                    </div>
                </div>
                <div className='row'>
                    {this.props.loggedIn ? (
                        <input ref={(div) => this.messageInputDiv = div} type='text' placeholder={this.state.selectedMessageId ? "Reply to " + this.state.selectedMessage.username : 'Send a message'} autoComplete="off" className='form-control' name='messageInput' value={this.state.messageInput} onChange={this.handleChange} ></input>
                    ) :
                        (
                            <p><Link to='/login'>Login</Link> or <Link to='/register'>register</Link> to join the conversation.</p>
                        )}
                </div>
                <div className='p-1 row' id='holder'>
                    <div ref={(div) => this.chatFrame2 = div} className='chatFrame' style={{ position: 'absolute' }}>
                        {this.state.messageSizer ? (
                            <div id='messageSizer'>
                                <div ref={(div) => { this['message_Sizer_' + this.state.messageSizer.id] = div }} style={{ width: `${((1 / this.state.numberOfColumns) * 100)}%` }} >
                                    <Message onClick={this.messageClick}
                                        classNames={this.state.messageSizer.id === this.state.selectedMessageId ? 'selectedMessage' : 'test'}
                                        key={this.state.messageSizer.id}
                                        id={this.state.messageSizer.id}
                                        username={this.state.messageSizer.username}
                                        user={this.state.messageSizer.user}
                                        msg={this.state.messageSizer.msg}
                                        color={this.state.messageSizer.color}
                                    />
                                </div>
                            </div>
                        ) : null}
                    </div>
                    <div ref={(div) => this.chatFrame = div} className='chatFrame' style={{ transform: `translate3d(${this.state.left}px,0,0)`, transition: this.state.transitionString }}>
                        {this.state.messagesInCarts.length > 0 ? (
                            this.state.messagesInCarts.slice(this.state.messagesInCarts.length - this.state.numberOfCartsToShow >= 0 ? this.state.messagesInCarts.length - this.state.numberOfCartsToShow : 0, this.state.messagesInCarts.length).map((n, index) => (
                                <div key={n.index} cartid={n.index} ref={(div) => { this['chatCart_' + n.index] = div }} style={{ position: 'absolute', width: `${((1 / this.state.numberOfColumns) * 100)}%`, left: `${((1 / this.state.numberOfColumns) * 100) * n.index}%` }} className='chatCart'>
                                    {n.messages.map((m, index2) => (
                                        <Message onClick={this.messageClick}
                                            classNames={m.id === this.state.selectedMessageId ? 'selectedMessage' : 'test'}
                                            thread={m.thread}
                                            selected={m.id === this.state.selectedMessageId ? true : false}
                                            key={m.id}
                                            id={m.id}
                                            username={m.username}
                                            user={m.user}
                                            msg={m.msg}
                                            animation={'slidein .25s ease'}
                                            display={n.index >= this.state.messagesInCarts.length - this.state.numberOfCartsToShow ? "" : "none"} />
                                    ))}
                                </div>
                            ))
                        ) : null}
                    </div>
                </div>
            </div >
        )

    }
}

export default withRouter(Home);