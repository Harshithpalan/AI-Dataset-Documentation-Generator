import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { User } from '../types';

interface AuthProps {
  user: User | null;
  onLoginSuccess: (user: User) => void;
  onLogout: () => void;
}

export function Auth({ user, onLoginSuccess, onLogout }: AuthProps) {
  const handleLoginSuccess = (credentialResponse: any) => {
    const credential = credentialResponse.credential;
    const payload = JSON.parse(atob(credential.split('.')[1]));

    onLoginSuccess({
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
    });
  };

  const handleLoginError = () => {
    console.error('Login Failed');
  };

  const handleLogout = () => {
    googleLogout();
    onLogout();
  };

  if (user) {
    return (
      <div className="auth-container">
        <div className="user-info">
          {user.picture && (
            <img src={user.picture} alt={user.name} className="user-avatar" />
          )}
          <span className="user-name">{user.name}</span>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={handleLoginError}
        text="signin_with"
        shape="pill"
      />
    </div>
  );
}
