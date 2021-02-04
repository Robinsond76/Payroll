import { history } from '../../..';
import { User } from '../../api/agent';

const loginUser = async (userFormValues, dispatch) => {
  dispatch({ type: 'LOADING' });
  try {
    const user = await User.login(userFormValues);
    dispatch({ type: 'LOGIN', payload: user });
    if (user.manager) history.push('/dashboard');
  } catch (err) {
    throw err;
  }
};

const registerUser = async (userFormValues) => {
  try {
    const newUser = await User.register(userFormValues);
    console.log(`New user ${newUser.username} registered successfully.`);
    history.push(`/employees/${newUser.username}`);
  } catch (err) {
    throw err;
  }
};

const loadUser = async (dispatch) => {
  dispatch({ type: 'LOADING' });
  try {
    const user = await User.current();
    if (user.clockedInTimestamp) {
      user.clockedInTimestamp.clockedIn = new Date(
        user.clockedInTimestamp.clockedIn
      );
    }
    dispatch({ type: 'LOAD_USER', payload: user });
  } catch (err) {
    throw err;
  }
};

const logoutUser = async (dispatch) => {
  try {
    dispatch({ type: 'LOGOUT' });
    history.push('/');
  } catch (err) {
    throw err;
  }
};

const clockInUser = async (moniker, dispatch) => {
  try {
    await User.clockIn(moniker);
    loadUser(dispatch);
  } catch (err) {
    throw Error;
  }
};

const clockOutUser = async (moniker, dispatch) => {
  try {
    await User.clockOut(moniker);
    loadUser(dispatch);
  } catch (err) {
    throw Error;
  }
};

export {
  loginUser,
  logoutUser,
  loadUser,
  registerUser,
  clockInUser,
  clockOutUser,
};
