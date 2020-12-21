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

export { loginUser };
