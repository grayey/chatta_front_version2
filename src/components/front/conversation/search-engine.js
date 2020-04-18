export default class SearchEngine {
  constructor(chat_body) {
    this.chat_body = chat_body;
  }

  search = async (sentence) => {
    const relatedResult = [];
    let exactResult = { matchedTag: "" };
    const duplicateResults = [];
    let exactButtonMatch = { buttonValue: "" };
    const duplicateExactButtonMatch = [];
    const relatedButtonMatch = [];
    const input = sentence.toLowerCase();
    this.chat_body.filter((convo) => {
      let buttons = convo.response.buttons;

      if (buttons && buttons.length) {
        let exatctTag = "";

        for (let index = 0; index < buttons.length; index += 1) {
          if (buttons[index].tags) {
            buttons[index].tags.filter((tag) => {
              if (input.includes(tag)) {
                if (
                  !relatedResult.filter(
                    (result) => result.identity === convo.identity
                  ).length
                ) {
                  relatedResult.push(convo);
                }
                if (
                  tag.length > exactResult.matchedTag.length &&
                  exactResult.parentButtonKey !== convo.identity
                ) {
                  exactResult = {
                    parentButtonKey: convo.identity,
                    buttonValue: buttons[index].val,
                    buttonKey: buttons[index].key,
                    matchedTag: tag,
                    tags: buttons[index].tags,
                  };
                }
                if (
                  tag === exactResult.matchedTag &&
                  convo.identity !== exactResult.parentButtonKey
                ) {
                  duplicateResults.push({
                    parentButtonKey: convo.identity,
                    buttonValue: buttons[index].val,
                    buttonKey: buttons[index].key,
                    matchedTag: tag,
                    tags: buttons[index].tags,
                  });
                }
              }
            });
          }
          if (input.includes(buttons[index].val.toLowerCase())) {
            if (exactButtonMatch.buttonValue !== buttons[index].val)
              if (
                exactButtonMatch.buttonValue.length < buttons[index].val.length
              ) {
                exactButtonMatch = {
                  parentButtonKey: convo.identity,
                  buttonValue: buttons[index].val,
                  buttonKey: buttons[index].key,
                  matchedTag: "",
                  tags: [],
                };
              }

            if (
              exactButtonMatch.buttonValue === buttons[index].val &&
              exactButtonMatch.buttonKey !== buttons[index].key &&
              convo.identity !== "empty" &&
              convo.identity !== "delay_prompt"
            ) {
              const exists = duplicateExactButtonMatch.filter(
                (match) => match.buttonKey !== buttons[index].key
              );
              if (!exists.length) {
                duplicateExactButtonMatch.push({
                  parentButtonKey: convo.identity,
                  buttonValue: buttons[index].val,
                  buttonKey: buttons[index].key,
                  matchedTag: "",
                  tags: [],
                });
              }
            }
            if (
              !relatedButtonMatch.filter(
                (match) => match.parentButtonKey === convo.identity
              ).length
            ) {
              relatedButtonMatch.push({
                parentButtonKey: convo.identity,
                buttonValue: buttons[index].val,
                buttonKey: buttons[index].key,
                matchedTag: "",
                tags: [],
              });
            }
          }
        }
      }
    });
    let result = await this.buildResult({
      exactKeywordResult: exactResult,
      duplicateKeywordResult: duplicateResults,
      relatedKeyWordResult: relatedResult,
      exactButtonMatch,
      duplicateExactButtonMatch,
      relatedButtonMatch,
    });
    if (!result) {
      const output = await this.findByPrompts(sentence);
      if (output.keywordMatch >= 1) result = output.convo;
      else result = await this.findById("empty");
    }
    return result;
  };
  findById = (id, tree) => {
    const chatBody = tree || this.chat_body;
    return chatBody.filter((convo) => convo.identity === id)[0];
  };
  findByPrompts = (sentence) => {
    const input = sentence.toLowerCase().split(" ");
    let convo;
    let keywordMatch = 0;

    for (let index = 0; index < this.chat_body.length; index += 1) {
      const convoBody = this.chat_body[index];
      const prompt = convoBody.prompt.toLowerCase();
      let count = 0;
      input.forEach((word) => {
        if (prompt.includes(word)) {
          count += 1;
        }
      });
      if (count >= keywordMatch) {
        convo = convoBody;
        keywordMatch = count;
      }
    }
    return { convo, keywordMatch };
  };
  buildResult = async (rawResult) => {
    const options = [];
    let buttonVal;
    let matchedTag;
    if (rawResult.duplicateExactButtonMatch.length > 1) {
      rawResult.duplicateExactButtonMatch.push(rawResult.exactButtonMatch);
      for (
        let index = 0;
        index < rawResult.duplicateExactButtonMatch.length;
        index += 1
      ) {
        const result = rawResult.duplicateExactButtonMatch[index];
        const button = await this.getParent(result.parentButtonKey);
        const buttonText = button.val;
        buttonVal = result.buttonValue;
        const newButton = {
          key: result.buttonKey,
          val: `${result.buttonValue} (${buttonText})`,
        };
        options.push(newButton);
      }
      return {
        identity: "random-string",
        prompt: `Here are some of the options we have for ${buttonVal}`,
        response: {
          buttons: options,
        },
      };
    } else if (
      rawResult.exactButtonMatch.parentButtonKey &&
      rawResult.exactButtonMatch.parentButtonKey !== "delay_prompt" &&
      rawResult.exactButtonMatch.parentButtonKey !== "empty" &&
      !rawResult.duplicateExactButtonMatch.length
    ) {
      let result;
      if (
        rawResult.exactKeywordResult.matchedTag.length >
        rawResult.exactButtonMatch.buttonValue.length
      ) {
        result = rawResult.exactKeywordResult;
      } else if (
        rawResult.exactButtonMatch.buttonValue.length >=
        rawResult.exactKeywordResult.matchedTag.length
      ) {
        result = rawResult.exactButtonMatch;
      }
      const output = await this.findById(result.buttonKey);
      const fallback = await this.findById("empty");

      if (!output && (result.buttonValue.length || result.matchedTag)) {
        const prompt = `Sorry, we currently do not have the option "${
          result.buttonValue || result.matchedTag
        }" available. We are working to make sure we include this option in the list of our services. Meanwhile you might want to checkout the services below`;
        const convo = {
          identity: "not-available",
          prompt,
          response: {
            buttons: fallback.response.buttons,
          },
        };
        return convo;
      }
      return await this.findById(result.buttonKey);
    } else if (rawResult.duplicateKeywordResult.length) {
      rawResult.duplicateKeywordResult.push(rawResult.exactKeywordResult);
      for (
        let index = 0;
        index < rawResult.duplicateKeywordResult.length;
        index += 1
      ) {
        const result = rawResult.duplicateKeywordResult[index];
        const button = await this.getParent(result.parentButtonKey);
        matchedTag = result.matchedTag;

        buttonVal = result.buttonValue;
        const newButton = {
          key: result.buttonKey,
          val: `${result.buttonValue} (${button.val})`,
        };
        options.push(newButton);
      }
      return {
        identity: "random-string",
        prompt: `Here are some of the options we have for ${matchedTag}`,
        response: {
          buttons: options,
        },
      };
    } else if (
      rawResult.exactKeywordResult.parentButtonKey &&
      rawResult.exactKeywordResult.parentButtonKey !== "delay_prompt" &&
      rawResult.exactKeywordResult.parentButtonKey !== "empty" &&
      !rawResult.duplicateExactButtonMatch.length
    ) {
      return await this.findById(rawResult.exactKeywordResult.buttonKey);
    }
  };
  getParent = (buttonKey) => {
    const matchedButton = [];
    this.chat_body.filter((convo) => {
      const { buttons } = convo.response;
      for (let index = 0; index < buttons.length; index += 1) {
        if (buttons[index].key === buttonKey) {
          matchedButton.push(buttons[index]);
          break;
        }
      }
    });
    return matchedButton[0];
  };
  getParentButtonValue = (buttonKey) => {
    let buttonValue;
    this.chat_body.filter((convo) => {
      const { buttons } = convo.response;
      if (buttons && buttons.length) {
        for (let index = 0; index < buttons.length; index += 1) {
          if (buttons[index].key === buttonKey) {
            const { identity } = convo;
            if (identity) {
              const parentButton = this.getParent(identity);
              buttonValue = parentButton.val;
              break;
            }
          }
        }
      }
    });
    return buttonValue;
  };
}
