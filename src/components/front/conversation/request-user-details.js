const tree = [
  {
    identity: "name",
    prompt: `Hi, I am Carol. May I know your name ?`,
    response: {
      buttons: [],
    },
  },
  {
    identity: "email",
    prompt:
      "Thank you Chris. I will also be requiring your email in case anything goes wrong. Please enter your email below",
    response: {
      buttons: [],
      text: "96ca1020-0de8-11ea-ad77-e78eca50f5f3",
      type: "entity",
    },
  },
  {
    identity: "onError",
    prompt: "Uhmm... seems like your email is wrong. Please cross-check",
    response: {
      buttons: [],
    },
  },
];

export default tree;
