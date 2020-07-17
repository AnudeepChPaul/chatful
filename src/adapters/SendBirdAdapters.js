import * as SendBird from "sendbird";

class Adapter {
  static create = () => new Adapter();

  constructor() {
    this.app = new SendBird({
      appId: "53614CEE-751D-424F-99C7-13600B14E68D",
    });
    this.channelUrl =
      "sendbird_open_channel_8320_cbacd7a790867f0d276a47209dc10bb355dee4d1";
    this.channel = null;
    this.messagesQuery = null;
  }

  initChannel() {
    return new Promise((res, rej) => {
      this.app.OpenChannel.getChannel(this.channelUrl, (channel, error) => {
        if (error) {
          return rej(error);
        }
        channel.enter((response, error) => {
          if (error) {
            return rej(error);
          }
          this.channel = channel;
          return res(channel);
        });
      });
    });
  }

  connect(userId, nickname, action) {
    return new Promise((res, rej) => {
      this.app.connect(userId.trim(), (user, error) => {
        if (error) {
          return rej(error);
        }
        this.app.updateCurrentUserInfo(
          nickname.trim(),
          "",
          (response, error) => {
            if (error) {
              return rej(error);
            }
            res(user);
          }
        );
      });
    });
  }

  loadMessages(firstLoad) {
    return new Promise((res, rej) => {
      this.messagesQuery =
        this.messagesQuery || this.channel.createPreviousMessageListQuery();

      if (this.messagesQuery.hasMore && !this.messagesQuery.isLoading) {
        this.messagesQuery.load(20, firstLoad, (messageList, error) => {
          if (error) {
            console.error(error);
            return;
          }
          return res(messageList.reverse());
        });
      }
    });
  }

  sendMessage(text) {
    return new Promise((res, rej) => {
      this.channel.sendUserMessage(text, (message, error) => {
        if (error) {
          console.error(error);
          return;
        }
        res(message);
      });
    });
  }
}

export default Adapter;
