import { User } from '../../api/agent';

const login = async (userFormValues, dispatch) => {
  try {
    const user = User.Login(userFormValues);
    dispatch({type: 'LOGIN', payload: user});
  } catch (err) {
    console.log(err);
  }
}

export { login }