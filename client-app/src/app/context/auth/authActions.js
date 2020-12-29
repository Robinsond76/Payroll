import { history } from '../../..';
import { User } from '../../api/agent';

const loginUser = async (userFormValues, dispatch) => {
  dispatch({ type: 'LOADING' });
  try {
    const user = await User.login(userFormValues);
    dispatch({ type: 'LOGIN', payload: user });
    history.push('/jobsites');
  } catch (err) {
    throw err;
  }
};

const loadUser = async (dispatch) => {
  dispatch({ type: 'LOADING' });
  try {
    const user = await User.current();
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

const registerUser = async (userFormValues) => {
  try {
    const newUser = await User.register(userFormValues);
    console.log(`New user ${newUser.username} registered successfully.`);
    history.push('/jobsites');
  } catch (err) {
    console.log('Error registering new user. Try again.');
    throw err;
  }
};

export { loginUser, logoutUser, loadUser, registerUser };
