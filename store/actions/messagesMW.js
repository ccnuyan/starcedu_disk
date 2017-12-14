/* eslint-disable no-param-reassign */
import config from '../../config';

const messageDict = {
  USER_REGISTER_ERROR: () => {
    return {
      status: 'error',
      inline: '注册失败',
      details: '这可能是因为网络问题造成的',
    };
  },
  USER_REGISTER_END: (payload) => {
    if (payload.success) {
      return {
        status: 'success',
        header: '注册成功',
        details: '还等什么，可以开始尽情玩耍了',
      };
    }
    return {
      status: 'error',
      inline: '注册失败',
    };
  },
  USER_LOCAL_AUTHENTICATE_ERROR: () => {
    return {
      status: 'error',
      inline: '登入失败',
      details: '这可能是因为网络问题造成的',
    };
  },
  USER_LOCAL_AUTHENTICATE_END: (payload) => {
    if (payload.success) {
      return {
        status: 'success',
        header: '登入成功',
        details: 'Prepare to fight!',
      };
    }
    return {
      status: 'error',
      inline: '登入失败',
      details: '请确保你已注册，并重新核对你的用户名和密码',
    };
  },
  USER_BIND_AUTHENTICATE_ERROR: () => {
    return {
      status: 'error',
      inline: '绑定失败',
      details: '这可能是因为网络问题造成的',
    };
  },
  USER_BIND_AUTHENTICATE_END: (payload) => {
    if (payload.success) {
      return {
        status: 'success',
        inline: '绑定成功',
        details: 'Prepare to fight!',
      };
    }
    return {
      status: 'error',
      inline: '绑定失败',
      details: [
        '请确保你已注册，并重新核对你的用户名和密码',
        '请确保没有重复绑定',
      ],
    };
  },
  USER_LOGOUT: () => {
    return {
      status: 'success',
      header: '成功登出',
    };
  },
  USER_USERNAME_CHECK_ERROR: () => {
    return {
      status: 'error',
      inline: '用户名检查失败',
      details: '这可能是网络原因造成的，你可以尝试继续注册',
    };
  },
  USER_USERNAME_CHECK_END: (payload) => {
    if (payload.valid) {
      return {
        // status: 'success',
        // inline: '该用户名可以使用',
      };
    }
    return {
      status: 'error',
      inline: '你不能使用该用户名',
      details: `这可能是因为已经有人使用该用户名注册了 ${config.title}`,
    };
  },
  USER_GET_OAUTH_INFO_END: () => {
    return {
      status: 'success',
      inline: '获取第三方登录信息完成',
    };
  },
  USER_GET_OAUTH_INFO_ERROR: () => {
    return {
      status: 'error',
      inline: '获取第三方登录信息失败',
      details: '这可能是网络原因造成的',
    };
  },
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

