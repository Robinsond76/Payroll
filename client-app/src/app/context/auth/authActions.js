import { history } from '../../..';
import { User } from '../../api/agent';

const loginUser = async (userFormValues, dispatch) => {
  try {
    const user = await User.login(userFormValues);
    dispatch({ type: 'LOGIN', payload: user });
    history.push('/jobsites');
  } catch (err) {
    throw err;
  }
};

const loadUser = async (dispatch) => {
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

export { loginUser, logoutUser, loadUser };
