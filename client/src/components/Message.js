
import React from 'react';

class Message extends React.Component {
    constructor(props) { //<----Method
        super(props);
        this.state = { //<----Initialize state
            shadow: '2px 2px 1px',
            hovered: false
        };
        //   this.handleChange = this.handleChange.bind(this);
          this.onMouseLeave = this.onMouseLeave.bind(this);
          this.onMouseEnter = this.onMouseEnter.bind(this);
    }

    // componentWillMount() {
    //     console.log("message being re rendered");
    // }

    shouldComponentUpdate(nextProps, nextState) {
        return (this.props !== nextProps || this.state.hovered !== nextState.hovered);
    }

    componentWillReceiveProps(props) {
        // console.log(props.selected, this.state.hovered);
        if (!props.selected && !this.state.hovered) {
            this.setState({shadow: '2px 2px 1px', hovered: false});
        } else if (props.selected || this.state.hovered) {
            this.setState({shadow: '4px 4px 2px'});
        }
    }

    onMouseLeave() {
        if (!this.props.selected) {
            this.setState({shadow: '2px 2px 1px', hovered: false});
        } else {
            this.setState({ hovered: false })
        };
    };

    onMouseEnter() {
        this.setState({shadow: '4px 4px 2px', hovered: true});
    };

    render() {  //<-----Method/Return JSX/HTML
        const { id, msg, animation, username, user, classNames, onClick, display, thread } = this.props;

        // let thisColor = color === undefined ? "#999999" : color;
        return (
                <div className={`messages p-1 ${classNames}`}
                    onClick={() => onClick(id)}
                    onMouseLeave={this.onMouseLeave}
                    onMouseEnter={this.onMouseEnter}
                    style={{
                        zIndex: id,
                        backgroundColor: thread ? `hsl(${thread.color.hsl.h},${thread.color.hsl.s * 100}%,50%)` : null,
                        position: 'relative',
                        display: display,
                        animation: animation,
                        // borderWidth: thread ? '3px' : '1px',
                        // borderBlockWidth: thread ? '3px' : '1px',
                        borderColor: user.color.hex || null,
                        boxShadow: this.state.shadow + ` rgba(${user.color.rgb.r},${user.color.rgb.g},${user.color.rgb.b})`
                    }}>{`[${username}]: ${msg}`}</div>
        );
    }
}

export default Message; 