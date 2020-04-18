import axios from "axios";
import { APP_ENVIRONMENT } from "../../../environments/environment";
const BASE_URL = APP_ENVIRONMENT.base_url;

const getCallToActionConvo = async (
  identifyer,
  userDetails,
  conversation,
  parentValue,
  actionSelection
) => {
  console.log("parent", parentValue, actionSelection);
  const firstConvo = conversation[0];
  firstConvo.prompt = `Meanwhile, you might want to check out other services below`;
  const actions = {
    "request-demo": [
      {
        identity: identifyer.callToAction.type,
        prompt: `Thank you ${userDetails.name} for your interest in ${parentValue}. `,
        response: {
          buttons: [],
        },
      },
      {
        identity: identifyer.callToAction.type,
        prompt: `One of your agents will contact you via the email address you provided with instructions on how to access the demo.`,
        response: {
          buttons: [],
        },
      },
      firstConvo,
    ],
    "schedule-meeting": [
      {
        identity: identifyer.callToAction.type,
        prompt: `Thank you ${userDetails.name}`,
        response: {
          buttons: [],
        },
      },
      {
        identity: identifyer.callToAction.type,
        prompt: `Please pick a suitable date between monday to friday and 9 am to 5pm`,
        response: {
          buttons: [{ scheduleMeeting: true, type: "schedule-meeting" }],
        },
      },
    ],
    "meeting-scheduled": [
      {
        identity: identifyer.callToAction.type,
        prompt: `Thank you ${userDetails.name}`,
        response: {
          buttons: [],
        },
      },
      {
        identity: identifyer.callToAction.type,
        prompt: `Your meeting has been scheduled successfully. One of our agents will contact you on the scheduled date`,
        response: {
          buttons: [],
        },
      },
      firstConvo,
    ],
  };

  if (
    identifyer.callToAction.type === "meeting-scheduled" ||
    identifyer.callToAction.type === "request-demo"
  ) {
    const emailSent = await axios.post(
      `${BASE_URL}/email/${identifyer.callToAction.type}`,
      {
        ...userDetails,
        parentValue,
        date: actionSelection,
      }
    );
    console.log("email sent", emailSent);
  }
  return actions[identifyer.callToAction.type];
};

export default getCallToActionConvo;
