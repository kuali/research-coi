export function authView(req, res) {
  res.sendFile('auth.html', {
    root: 'views'
  });
}

function hashCode(toHash){
  var hash = 0;
  if (toHash.length === 0) { return hash; }
  for (let i = 0; i < toHash.length; i++) {
    let char = toHash.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

export function getUserInfo(token) {
  let lowercaseToken = token.toLowerCase();
  if (lowercaseToken.startsWith('a')) {
    return {
      id: hashCode(token),
      name: token + 'user',
      username: token,
      email: token + '@email.com',
      createdAt: 1259218800,
      updatedAt: 1259218800,
      role: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      phone: '801-322-3323'
    };
  }
  else if (lowercaseToken.startsWith('su')) {
    return {
      id: hashCode(token),
      name: token + 'user',
      username: token,
      email: token + '@email.com',
      createdAt: 1259218800,
      updatedAt: 1259218800,
      role: 'admin',
      firstName: 'Super',
      lastName: 'User',
      phone: '801-322-3323'
    };
  }
  else {
    return {
      id: hashCode(token),
      name: token + 'user',
      username: token,
      email: token + '@email.com',
      createdAt: 1259218800,
      updatedAt: 1259218800,
      role: 'user',
      firstName: 'Normal',
      lastName: 'User',
      phone: '801-322-3323'
    };
  }
}
