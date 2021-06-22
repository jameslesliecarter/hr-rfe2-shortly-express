const parseCookies = (req, res, next) => {
  let cookieString = req.get('Cookie') || '';
  let cookies = {};
  // split string up and turn it into
  cookieArray = cookieString.split('; ');
  for (let i = 0; i < cookieArray.length; i ++) {
    let index = cookieArray[i].indexOf('=');
    let key = cookieArray[i].substring(0, index);
    let value = cookieArray[i].substring(index + 1, cookieArray[i].length);
    cookies[key] = value;
  }
  req.cookies = cookies;
  next();
};

module.exports = parseCookies;