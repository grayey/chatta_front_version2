const cssGenerator = (settings) => {
  const { templateSettings } = settings;

  return `.chat_box.chat_box_colors_a .chat_message_wrapper.chat_message_right ul.chat_message > li {
            background: ${templateSettings.userMessageFillColor} none repeat scroll 0 0;
            color: ${templateSettings.userMessageTextTextColor};
            font-size: ${templateSettings.userMessageFontSize}
            }
            .chat_box.chat_box_colors_a .chat_message_wrapper.chat_message_right ul.chat_message > li:first-child::before {
             border-left-color: ${templateSettings.userMessageFillColor};
            }
            .chat_box.chat_box_colors_a .chat_message_wrapper ul.chat_message > li .chat_message_time {
            color: ${templateSettings.userOnlineTimeTextColor};
            }
          .conversation-header {
            background-color: ${templateSettings.headerFillColor};
          }
          .bot-name {
            color: ${templateSettings.botNameTextColor} !important;
          }
          .close-button {
            border: 3px solid ${templateSettings.closeButtonTextColor};
          }
          .close-button i {
            color :${templateSettings.closeButtonTextColor}
          }
          .bot-avatar {
          border-radius: ${templateSettings.optionBorderRadius} !important;
    
        }
        .chat_box .chat_message_wrapper ul.chat_message > li {
        background-color: red none repeat scroll 0 0 !important;
        border-radius:  ${templateSettings.botMessageBorderRadius} !important;;
        color: ${templateSettings.botMessageTextColor} !important;
        font-size: ${templateSettings.botMessageFontSize}
      }
      .chat_box.chat_box_colors_a .chat_message_wrapper ul.chat_message > li {
    background: ${templateSettings.botMessageFillColor} none repeat scroll 0 0;
    color: #000000;
    }
    .chat_box.chat_box_colors_a .chat_message_wrapper ul.chat_message > li:first-child::before {
    border-right-color: ${templateSettings.botMessageFillColor} !important;
    }
    .conversation-body .conversations{
      background-color: ${templateSettings.botBodyFillColor} !important;
    }
    .chat-inputs {
    background-color: ${templateSettings.inputFillColor};
    }
    .chat-inputs input-box {
      color ${templateSettings.inputTextColor}
    }
    .message-sent i {
      color: ${templateSettings.userMessageFillColor};
    }
    .buttons button {
      border-radius: ${templateSettings.optionBorderRadius} !important;
    }
    #chat-opener {
      background: ${templateSettings.headerFillColor};
    }
    .chat_user_avatar .md-user-image {
      height: 28px;
      width:25px;
      border-radius: 50%
    }
    .bot-avatar img{
      height: 33px;
      width: 33px;
      border-radius: ${templateSettings.botImageBorderRadius}
    }
    .bot-image-holder {
     margin-top: 6px
    }
    .bot-image-holder img{
      height:27px;
      width: 27px;
      border-radius: 50%;
    }`;
};
export default cssGenerator;
