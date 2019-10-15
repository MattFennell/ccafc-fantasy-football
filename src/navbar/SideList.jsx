import React from 'react';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import { noop } from 'lodash';
import classNames from 'classnames';
import * as routes from '../routes';
import defaultStyles from './SideList.module.scss';

const SideList = props => {
    const linksToRender = props.isSignedIn ? routes.signedInLinks : routes.signedOutLinks;
    return (
        <div
            role="presentation"
            onClick={props.closeNavbar}
            onKeyDown={props.closeNavbar}
        >
            <List>
                {linksToRender.map(item => (
                    <ListItem
                        button
                        key={item.title}
                        onClick={() => props.redirect(item.path(props))}
                        className={classNames({
                            [props.styles.activeRoute]: props.currentPath.includes(item.urlIncludes)
                        })}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.title} />
                    </ListItem>
                ))}
            </List>
            {props.isAdmin && (
            <>
                <Divider />
                <List>
                    {routes.adminLinks.map(item => (
                        <ListItem
                            button
                            key={item.title}
                            onClick={() => props.redirect(item.path(props))}
                            className={props.styles.test}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.title} />
                        </ListItem>
                    ))}
                </List>
            </>
            )}
        </div>
    );
};

SideList.defaultProps = {
    closeNavbar: noop,
    currentPath: '',
    isAdmin: false,
    isSignedIn: false,
    redirect: noop,
    styles: defaultStyles
};

SideList.propTypes = {
    closeNavbar: PropTypes.func,
    currentPath: PropTypes.string,
    isAdmin: PropTypes.bool,
    isSignedIn: PropTypes.bool,
    redirect: PropTypes.func,
    styles: PropTypes.objectOf(PropTypes.string)
};


export default SideList;
