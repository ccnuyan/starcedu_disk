/* eslint-disable no-param-reassign */
const messageDict = {
};

// this is a function to generate the action parameter
export default ({ type, payload }) => {
  const handler = messageDict[type];
  if (handler) {
    return {
      type,
      payload: {
        ...payload,
        ui_message: handler(payload),
      },
    };
  }
  console.log(`no message handler found for type: ${type}`); // eslint-disable-line no-console
  return { type, payload };
};

