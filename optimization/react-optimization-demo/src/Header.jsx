import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import {Link} from 'react-router-dom';

const styles = {
    root: {
        flexGrow: 1,
        backgroundColor: "#317EFB"
    },
    brand: {
        flex: 1,
    },
    about: {
        flex: 1,
        textAlign: 'right'
    },
    aboutLink: {
        color: '#f68743',
        textDecoration: 'none',
        border: '1px solid #f68743',
        padding: 6,
        borderTopRightRadius: 10,
        '&:hover': {
            color: '#f3a279',
            border: '1px solid #f3a279',
        },
        '&:active': {
            color: '#fa6a21',
            border: '1px solid #fa6a21',
        }
    }
};

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
        this.openDrawer = this.openDrawer.bind(this);
    }
    openDrawer() {
        this.setState({open: true});
    }
    render() {
        return (
            <div className={this.props.classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h5" color="inherit" className={this.props.classes.brand}>
                            Dereck's Backyard Sales!
                        </Typography>
                        <Typography variant="h6" color="inherit" className={this.props.classes.about}>
                            <Link className={this.props.classes.aboutLink} to="/about">About</Link>
                        </Typography>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default withStyles(styles)(Header);
