import Adapter from "../adapters/SendBirdAdapters";
import React from "react";

export default class Component extends React.Component {
  adapter = Adapter.create();

  constructor(props) {
    super(props);

    this.state = {
      user: null,
      channel: null,
      messageList: null,
      conversation: null,
    };
  }

  fetchMessages(firstLoad) {
    return this.adapter.loadMessages(firstLoad).then((messageList) => {
      this.setState(() => ({
        messageList,
      }));
    });
  }

  componentDidMount() {
    this.adapter
      .connect(this.props.username, this.props.username)
      .then((user) => {
        this.setState(() => ({
          user,
        }));
      })
      .then(() => this.adapter.initChannel())
      .then((channel) => {
        this.setState(() => ({ channel }));
      })
      .then(() => this.fetchMessages(true));
  }

  onKeyDown(evt) {
    if (evt.key.toLowerCase() !== "enter" || evt.shiftKey) return;
    const target = evt.target;
    this.adapter.sendMessage(evt.target.value).then((msg) => {
      const messages = [...this.state.messageList.concat(msg)];

      this.setState(() => ({
        messageList: [...messages],
      }));
      target.value = "";
    });
  }

  render() {
    return !this.state.channel ? (
      <div>Creating connection</div>
    ) : (
      <div>
        <div>{"User Details"}</div>
        <div>{this.state.user.nickname}</div>
        <div>{this.state.user.isActive}</div>
        <div>{this.state.user.connectionStatus}</div>
        <div>{"Channel Details"}</div>
        <div>{this.state.channel.name}</div>
        <div>{this.state.channel.channelType}</div>
        <div>{this.state.channel.coverUrl}</div>
        <div>{this.state.channel.url}</div>
        <div>{this.state.channel.url}</div>
        <div>
          {this.state.messageList &&
            this.state.messageList.map((msg) => (
              <div key={msg.messageId}>
                <legend>
                  {" "}
                  Message Details
                  <div>
                    <span>message: </span>
                    {msg.message}
                  </div>
                  <div>
                    <span>messageId: </span>
                    {msg.messageId}
                  </div>
                  <div>
                    <span>createdAt: </span>
                    {new Date(msg.createdAt).getTime()}
                  </div>
                  <div>
                    <span>sendingStatus: </span>
                    {msg.sendingStatus}
                  </div>
                </legend>
                <legend>
                  <div>
                    <span>user: </span>
                    {msg._sender.nickname}
                  </div>
                  <div>
                    <span>user_id: </span>
                    {msg._sender.userId}
                  </div>
                </legend>
                <hr />
              </div>
            ))}
        </div>

        <input
          type="text"
          name="messageText"
          onKeyDown={(evt) => this.onKeyDown(evt)}
        />
      </div>
    );
  }
}
