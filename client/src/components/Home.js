import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Grid, CssBaseline, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { SidebarContainer } from "./Sidebar";
import { ActiveChat } from "./ActiveChat";
import { logout, fetchConversations } from "../store/utils/thunkCreators";
import { clearOnLogout } from "../store/index";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh"
  }
}));

const Home = (props) => {
  const classes = useStyles();
  const { user, messagesLength, logout, fetchConversations } = props;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messageLengthState, setMessageLengthState] = useState(-1);

  useEffect(() => {
    if (user.id) {
      setIsLoggedIn(true);
    }
  }, [user.id]);

  useEffect(() => {
    fetchConversations();
    setMessageLengthState(-1);
  }, [messageLengthState, fetchConversations]);

  useEffect(() => {
    // If it is not greater than 0, that means that it is a new conversation and we do not want to change our message length state. This is so that we do not trigger a fetch conversation.
    if (messagesLength > 0) {
      setMessageLengthState(messagesLength)
    }
  }, [messagesLength])

  if (!user.id) {
    // If we were previously logged in, redirect to login instead of register
    if (isLoggedIn) return <Redirect to="/login" />;
    return <Redirect to="/register" />;
  }

  const handleLogout = async () => {
    await logout(user.id);
  };

  return (
    <>
      {/* logout button will eventually be in a dropdown next to username */}
      <Button className={classes.logout} onClick={handleLogout}>
        Logout
      </Button>
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <SidebarContainer />
        <ActiveChat />
      </Grid>
    </>
  );
};

const mapStateToProps = (state) => {
  // Every time a user sends a message, the messages length goes up. When this happens, we update the prop so that we know that there is a new message and we can sync them up across clients.
  let messagesLength = 0;
  for (let i = 0; i < state.conversations.length; i++) {
    if (state.conversations[i].otherUser.username === state.activeConversation) {
      messagesLength = state.conversations[i].messages.length;
    }
  }
  return {
    user: state.user,
    conversations: state.conversations,
    messagesLength: messagesLength
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: (id) => {
      dispatch(logout(id));
      dispatch(clearOnLogout());
    },
    fetchConversations: () => {
      dispatch(fetchConversations());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
