import React from 'react';
import axios from 'axios';

// ここからコンポーネント本体
export default function App() {

  const [csrf, set_csrf] = React.useState("");
  const [username, set_username] = React.useState("");
  const [email, set_email] = React.useState("");
  const [password, set_password] = React.useState("");
  const [error, set_error] = React.useState("");
  const [isAuthenticated, set_isAuthenticated] = React.useState(false);

  React.useEffect(() => {
  }, [])

  function getCSRF() {
    console.log("getCSRF");

    fetch("http://localhost:8000/api/csrf/", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        'X-CSRFToken': csrf,
        "Access-Control-Allow-Origin": "http://localhost:3000",
      },
      credentials: "include",
    })

      // ヘッダから csrf を取得する
      .then((res) => {
        console.log(...res.headers);
        let csrfToken = res.headers.get("X-Csrftoken");
        console.log("csrfToken=" + csrfToken);
        set_csrf(csrfToken);
      })

      // レスポンスデータから csrf を取得する
      // .then((res) => res.json())
      // .then((data) => {
      //   console.log(data);
      //   console.log("csrfToken=" + data.csrftoken);
      //   set_csrf(data.csrftoken);
      // })

      .catch((err) => {
        console.log(err);
      });
  }


  function register(event) {
    console.log("register");
    console.log("csrf=" + csrf);

    event.preventDefault();
    fetch("http://localhost:8000/api/register/", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        'X-CSRFToken': csrf,
        "Access-Control-Allow-Origin": "http://localhost:3000",
      },
      credentials: "include",
      body: JSON.stringify({ username: username, email: email, password: password }),
    })
      .then((response) => {
        console.log(response);
      })
      .then((data) => {
        console.log(data);
        set_isAuthenticated(true);
        set_username("");
        set_password("");
        set_error("");
      })
      .catch((err) => {
        console.log(err);
        set_error("Wrong username or password.");
      });
  }

  function APICALL_login(event) {
    event.preventDefault();
    URL = "http://localhost:8000/api/login/";
    const params = { email: email, password: password };
    axios.defaults.headers = {
      "Content-Type": "application/json",
      'X-CSRFToken': csrf,
      "Access-Control-Allow-Origin": "http://localhost:3000",
    }
    axios.defaults.withCredentials = true

    axios.post(URL, params)
      .then(response => {
        console.log(response);
        console.log(...response.headers);

        const data = response.data;
        console.log("csrfToken=" + data.csrftoken);
        set_csrf(data.csrftoken);

        set_isAuthenticated(true);
        set_username("");
        set_password("");
        set_error("");

      })
      .catch(error => {
        console.log(error);
      });
  }

  function login(event) {
    console.log("login");
    console.log("csrf=" + csrf);

    event.preventDefault();
    fetch("http://localhost:8000/api/login/", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        'X-CSRFToken': csrf,
        "Access-Control-Allow-Origin": "http://localhost:3000",
      },
      credentials: "include",
      body: JSON.stringify({ email: email, password: password }),
    })
      // .then(isResponseOk)
      .then((response) => {
        console.log(...response.headers);
        console.log(response.headers.get('set-cookie'));
        // login 時にcsrfTokenを取得し直す必要があるのは関数ビューのときだけ ここから //
        // let csrfToken = response.headers.get("X-Csrftoken");
        // console.log("csrfToken=" + csrfToken);
        // set_csrf(csrfToken);
        // login 時にcsrfTokenを取得し直す必要があるのは関数ビューのときだけ ここまで //
        return response.json();
      })
      .then((data) => {
        console.log(data);

        console.log("csrfToken=" + data.csrftoken);
        set_csrf(data.csrftoken);

        set_isAuthenticated(true);
        set_username("");
        set_password("");
        set_error("");
      })
      .catch((err) => {
        console.log(err);
        set_error("Wrong username or password.");
      });
  }

  function logout() {
    console.log("logout:csrf=" + csrf);
    fetch("http://localhost:8000/api/logout/", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        'X-CSRFToken': csrf,
        "Access-Control-Allow-Origin": "http://localhost:3000",
      },
      credentials: "include",
    })
      .then(isResponseOk)
      .then((data) => {
        console.log(data);
        set_isAuthenticated(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };


  function whoami() {
    console.log("whoami:csrf=" + csrf);

    fetch("http://localhost:8000/api/whoami/", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        'X-CSRFToken': csrf,
        "Access-Control-Allow-Origin": "http://localhost:3000",
      },
      credentials: "include",
    })
      .then(isResponseOk)
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function todo() {
    console.log("todo:csrf=" + csrf);

    fetch("http://localhost:8000/todos/", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        'X-CSRFToken': csrf,
        "Access-Control-Allow-Origin": "http://localhost:3000",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUserNameChange(event) {
    set_username(event.target.value);
  }

  function handleEmailChange(event) {
    set_email(event.target.value);
  }

  function handlePasswordChange(event) {
    set_password(event.target.value);
  }


  function isResponseOk(response) {
    if (response.status >= 200 && response.status <= 299) {
      return response.json();
    } else {
      throw Error(response.statusText);
    }
  }

  return (
    <div className="container mt-3">
      <h1>React Cookie Auth</h1>

      <br />
      <h2>Register</h2>
      <form onSubmit={register}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input type="text" className="form-control" id="username" name="username" value={username}
            onChange={handleUserNameChange} />
        </div>
        <div className="form-group">
          <label htmlFor="email1">email</label>
          <input type="text" className="form-control" id="email1" name="email" value={email}
            onChange={handleEmailChange} />
        </div>
        <div className="form-group">
          <label htmlFor="password1">Password  user1pass</label>
          <input type="password" className="form-control" id="password1" name="password" value={password}
            onChange={handlePasswordChange} />
          <div>
            {error &&
              <small className="text-danger">{error}</small>
            }
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Register</button>
      </form>

      <br />
      <h2>Login</h2>
      <form onSubmit={APICALL_login}>
        <div className="form-group">
          <label htmlFor="email2">email</label>
          <input type="text" className="form-control" id="email2" name="email" value={email}
            onChange={handleEmailChange} />
        </div>
        <div className="form-group">
          <label htmlFor="password2">Password user1pass</label>
          <input type="password" className="form-control" id="password2" name="password" value={password}
            onChange={handlePasswordChange} />
          <div>
            {error &&
              <small className="text-danger">{error}</small>
            }
          </div>
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>

      <button className="btn btn-primary mr-2 mt-5" onClick={logout}>logout</button>
      <button className="btn btn-primary mr-2 mt-5" onClick={whoami}>WhoAmI</button>
      <button className="btn btn-primary mr-2 mt-5" onClick={todo}>todo</button>
      <button className="btn btn-primary mr-2 mt-5" onClick={getCSRF}>getCSRF</button>
    </div>
  )
}


/*

  function getSession() {
    console.log("getSession");
    console.log("csrf=" + csrf);

    fetch("http://localhost:8000/api/session/", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        'X-CSRFToken': csrf,
        "Access-Control-Allow-Origin": "http://localhost:3000",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.isAuthenticated) {
          set_isAuthenticated(true);
        } else {
          set_isAuthenticated(false);
          // getCSRF();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  */

