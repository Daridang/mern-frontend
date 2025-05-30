// src/utils/authNavigate.js
export function authNavigate(
  navigate,
  isAuth,
  targetPath,
  loginPath = "/login"
) {
  if (!isAuth) {
    navigate(loginPath, { state: { from: { pathname: targetPath } } });
  } else {
    navigate(targetPath);
  }
}
