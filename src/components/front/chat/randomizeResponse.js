const randomizeResponse = (key, type, userDetails) => {
  console.log("this is key", key);
  const index = Math.floor(Math.random() * 4);
  const name = userDetails.name;
  const responses = {
    delay_prompt: {
      name: [
        "Hello ? Could you type your name below ?",
        "I haven't got your name yet. Could you leave your name below ?",
        "I am yet to get your name. Kindly enter your name below",
        "Are you there ? Please tell me your name",
        "Hello there. What's your name ?",
      ],
      email: [
        `Hello ${name ? name : "there"}. What's your email address ?`,
        ` ${name ? name : ""} Are you there ? Your email address please ?`,
        `I haven't got your email ${name ? name : ""}. Kindly type it below`,
        `Hi ${
          name ? name : ""
        }...You haven't been responsive. I will need your email address so we can proceed`,
        `Hi ${name ? name : "there"}. Kindly respond with your email`,
      ],
      random: [
        `Hello ${name ? name : "there"}. Are you there ?`,
        ` ${name ? name : ""} Are you still online ?`,
        `I haven't got any response ${name ? name : ""}. Are you there ?`,
        `Hi ${name ? name : ""}. Are you with me ?`,
        `Hi ${name ? name : "there"}. You there ?`,
      ],
      offline: {
        withEmail: [
          `Hello ${
            name ? name : "there"
          }. We noticed you've been away for a while.
          One of our agents will contact you shortly via the email address you provided. Kindly leave us a feedback below`,
          `Hi ${
            name ? name : "there"
          }. We have sent you an email via the address you provided us. If you have further questions, kindly reply to the email we sent you`,
          `Hi ${
            name ? name : "there"
          }. It seems you've been offline for a while. Kindly check your inbox for a follow-up mail we just sent you. Have a nice day`,
          `Hello ${
            name ? name : "there"
          }. You've been away for a while. Your concerns mean a lot to us and we just sent you a mail just in case you'd want to contact one of our agents at your convenience. Thank you !`,
        ],
        withoutEmail: [
          `Hello ${
            name ? name : "there"
          }. We noticed you've been away for a while. Since you didn't provide your email address, we'd like you to contact us via admin@ith.com for further enquiries. Have a nice day`,
          `Hello ${
            name ? name : "there"
          }. It seems you've been away. If you have further enquiries, kindly reach us via admin@ith.com. Have a good day!`,
          `Hi ${
            name ? name : "there"
          }. You've not been responding. Your concerns mean a lot to us. In case you'd like to reach us via mail, kindly send us a mail via amin@ith.com`,
          `Hi ${
            name ? name : "there"
          }. I haven't gotten any response from you. Feel free to reach us at admin@ith.com if you have more enquiries. Thanks and enjoy the rest of your day`,
        ],
      },
    },
    invalidEmailResponse: [
      "Uhmmm.. it seems there is a typo in your email. Kindly cross-check",
      `Kindly check your email format for errors. A good example is ${
        name ? name.toLowerCase().split(" ").slice(0, 2).join("_") : null
      }${index}@gmail.com`,
      `Sorry ${
        name || ""
      }, it looks like you didn't quite provide a valid email. kindly cross-check`,
      `We will need a valid email address... something like ${
        name ? name.toLowerCase().split(" ").slice(0, 2).join("_") : null
      }${index}@gmail.com`,
    ],
  };
  if (type === "offline") {
    if (userDetails.email) {
      return responses[key][type].withEmail[index];
    } else {
      return responses[key][type].withoutEmail[index];
    }
  } else if (!type) {
    return responses[key][index];
  }
  return responses[key][type][index];
};

export default randomizeResponse;
