import React, { useState } from "react";
import { FormControl, FilledInput } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { markAsRead, postMessage } from "../../store/utils/thunkCreators";

const useStyles = makeStyles(() => ({
  root: {
    justifySelf: "flex-end",
    marginTop: 15
  },
  input: {
    height: 70,
    backgroundColor: "#F4F6FA",
    borderRadius: 8,
    marginBottom: 20
  }
}));

const Input = (props) => {
  const classes = useStyles();
  const [text, setText] = useState("");
  const { markAsRead, postMessage, otherUser, conversationId, user } = props;

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // add sender user info if posting to a brand new convo, so that the other user will have access to username, profile pic, etc.
    const reqBody = {
      text: event.target.text.value,
      recipientId: otherUser.id,
      conversationId,
      sender: conversationId ? null : user
    };
    await postMessage(reqBody);
    const readBody = {
      id: conversationId,
      otherUser: {
        id: otherUser.id
      }
    }
    await markAsRead(readBody);
    setText("");
  };

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <FormControl fullWidth hiddenLabel>
        <FilledInput
          classes={{ root: classes.input }}
          disableUnderline
          placeholder="Type something..."
          value={text}
          name="text"
          onChange={handleChange}
        />
      </FormControl>
    </form>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    postMessage: (message) => {
      dispatch(postMessage(message));
    },
    markAsRead: (message) => {
      dispatch(markAsRead(message))
    }
  };
};

export default connect(null, mapDispatchToProps)(Input);
