import * as React from 'react';

import ROUTES from '../../platform/constants/routes';
import { byRoute } from '../../platform/decorators/routes';
import LoaderContent from '../../components/loader-content';
import AccountController, { ILoginRequestModel } from '../../platform/api/account';
import SignInImg from '../../assets/images/bg-home-page.png'
import alertify from 'alertifyjs';
import Logo from '../../assets/images/ic_logoarab.png'


interface IState {
  form: ILoginRequestModel;
  loading: boolean;
  isValidation: boolean;
};

@byRoute(ROUTES.SIGNIN)
class Signin extends React.Component<{}, IState> {

  public state: IState = {
    form: {
      verificationTerm: '',
      password: '',
    },
    loading: false,
    isValidation: false,
  }

  private changeForm = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const { form } = this.state;
    form[e.currentTarget.name] = e.currentTarget.value;
    this.setState({ form });
  }

  private onSigninClick = (e: React.SyntheticEvent<HTMLElement>) => {
    e.preventDefault();
    if (this.state.form.verificationTerm === 'admin@gmail.com') {
      this.setState({loading: true}, async () => {
        const ress = await AccountController.Signin(this.state.form)
        if (!ress.success) {
          this.setState({loading: false});
        }
      })
    } else {
      alertify.error('Incorrect username or password')
      this.setState({isValidation: true, loading: false})
    }
  };

  private isSigninDisabled = () => !this.state.form.verificationTerm || !this.state.form.password;

  public render() {
    const {form, loading, isValidation} = this.state;

    return (
      <section className="B-page B-signin-page">
        <div className="B-sign-in-left">
          <div className="B-signin-content">
            <div className='B-signin-logo'>
              <img src={Logo} alt="logo" />
            </div>
            <div className='B-sigin-form-block'>
              <form>
                <div className="B-signin-form-content btn">
                  <div className={`B-form-input ${isValidation ? 'P-error' : ''}`}>
                    <h4>Email</h4>
                    <input
                      type="email"
                      name="verificationTerm"
                      value={form.verificationTerm}
                      placeholder="Email"
                      onChange={this.changeForm}
                    />
                  </div>
                  <div className={`B-form-input ${isValidation ? 'P-error' : ''}`}>
                    <h4>Password</h4>
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      autoComplete='off'
                      onChange={this.changeForm}
                    />
                  </div>
                  <LoaderContent
                    className="B-form-submit-button"
                    loading={loading}
                    disabled={this.isSigninDisabled()}
                    onClick={this.onSigninClick}
                  >Sign in</LoaderContent>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className='B-sign-in-right'>
          <div className='B-sign-in-bg' style={{ backgroundImage: 'url(' + SignInImg + ')' }} />
        </div>
      </section>
    );
  }
}

export default Signin;
