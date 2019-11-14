
import React from 'react';

class Message extends React.Component {
    constructor(props) { //<----Method
        super(props);
        this.state = { //<----Initialize state
            shadow: '2px 2px 1px'
        };
        //   this.handleChange = this.handleChange.bind(this);
          this.onMouseLeave = this.onMouseLeave.bind(this);
          this.onMouseEnter = this.onMouseEnter.bind(this);
    }

    onMouseLeave() {
        this.setState({shadow: '2px 2px 1px'});
    };

    onMouseEnter() {
        this.setState({shadow: '4px 4px 2px'});
    };

    render() {  //<-----Method/Return JSX/HTML
        const { id, msg, animation, width, username, classNames, onClick, display, color, shadow } = this.props;
        return (
            <div className={`messages p-1 ${classNames}`}
                onClick={() => onClick(id)}
                onMouseLeave={this.onMouseLeave}
                onMouseEnter={this.onMouseEnter}
                style={{
                    zIndex: id,
                    position: 'relative',
                    display: display,
                    animation: animation,
                    borderColor: color,
                    boxShadow: this.state.shadow + color
                }}>{`[${username}]: ${msg}`}</div>
        );
    }
}

// const Message = ({ id, msg, animation, width, username, classNames, onClick, display, color, shadow }) => (
//     <div className={`messages p-1 ${classNames}`}
//         onClick={() => onClick(id)}
//         onMouseLeave={() => {
//             shadow = '2px 2px 1px';
//         }}
//         onMouseEnter={() => {
//             shadow = '4px 4px 2px';
//         }}
//         style={{
//             zIndex: id,
//             position: 'relative',
//             display: display,
//             animation: animation,
//             borderColor: color,
//             boxShadow: shadow + color
//         }}>{`[${username}]: ${msg}`}</div>
// );

export default Message; 