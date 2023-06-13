import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./App.css";

function App() {
  const [logged, setLogged] = useState(false);
  const [register, setRegister] = useState(false);
  const [view, setView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const input = {
    username: useRef(),
    password: useRef(),
    confirmPassword: useRef(),
    age: useRef(),
  };

  ///functions
  const clickRegister = () => setRegister(!register);
  const submitForm = async (e) => {
    setLoading(true);
    try {
      if (!register) {
        e.preventDefault();
        const { data } = await axios.post("http://localhost:3000/login", {
          username: input.username.current.value,
          password: input.password.current.value,
        });
        console.log(data);
        Swal.fire({
          width: 200,
          icon: "success",
          text: `Login Success`,
          showConfirmButton: false,
          timer: 1500,
        });
        setLogged(true);
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("username", data.data.username);
      } //if submit login
      else {
        e.preventDefault();

        if (
          input.password.current.value !== input.currentPassword.current.value
        ) {
          throw { response: { data: { message: "Passwords do not match" } } };
        }

        const { data } = await axios.post("http://localhost:3000/register", {
          username: input.username.current.value,
          password: input.password.current.value,
          age: input.age.current.value,
        });
        console.log(data);
        Swal.fire({
          width: 200,
          icon: "success",
          text: `Register Success`,
          showConfirmButton: false,
          timer: 1500,
        });
        setRegister(false);
      } //else submit register
    } catch (err) {
      console.log(err);
      const error = err.response.data.message;

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error}`,
      });
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  const clickLogout = async () => {
    const { data } = await axios.post(
      "http://localhost:3000/logout",
      {},
      {
        headers: {
          access_token: localStorage.getItem("access_token"),
        },
      }
    );

    localStorage.removeItem("access_token");
    localStorage.removeItem("username");
    setLogged(false);
    Swal.fire({
      width: 200,
      icon: "success",
      text: `Logout Success`,
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const clickView = async () => {
    if (!logged) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Please login first`,
      });
      return;
    }
    try {
      setView(!view);
      const { data } = await axios.get("http://localhost:3000/view-data", {
        headers: {
          access_token: localStorage.getItem("access_token"),
        },
      });
      setData(data);
    } catch (err) {
      console.log(err);
      const error = err.response.data.message;

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error}`,
      });
    }
  };

  const backLogin = () => {
    setRegister(false);
    setView(false);
  };

  //end of functions

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      setLogged(true);
    }
  }, []);

  if (loading) {
    return (
      <div className="App">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <>
      <div style={{ flex: 1, marginBottom: 20 }}>
        {logged ? (
          view ? (
            <>
              <div style={{ margin: 10 }}>
                <p>
                  <b>Average Score</b>: {data?.FinalResults?.average_score}
                </p>
                <p>
                  <b>Modus</b>: {data?.FinalResults?.name},{" "}
                  {data?.FinalResults?.emotion} - {data?.FinalResults?.count}{" "}
                  times
                </p>
              </div>
              <div>
                <table border={1} style={{ padding: 5 }}>
                  <thead>
                    <th>id</th>
                    <th>name</th>
                    <th>score</th>
                    <th>emotion</th>
                    <th>created</th>
                  </thead>
                  <tbody style={{ padding: 5 }}>
                    {data?.data?.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.score}</td>
                        <td>{item.emotion}</td>
                        <td>{item.createdAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div>
              <h1>Welcome {localStorage.getItem("username")}</h1>
              <button onClick={clickLogout}>Logout</button>
            </div>
          )
        ) : !logged ? (
          <form onSubmit={(e) => submitForm(e)}>
            <div
              style={{
                flex: 1,
                flexDirection: "row",
                alignContent: "space-around",
                alignItems: "center",
              }}
            >
              <div style={{ flex: 1, marginBottom: 10 }}>
                <input
                  type="email"
                  name="username"
                  placeholder="username"
                  ref={input.username}
                />
              </div>
              <div style={{ flex: 1, marginBottom: 10 }}>
                <input
                  type="password"
                  name="password"
                  placeholder="password"
                  ref={input.password}
                />
              </div>
              {register ? (
                <>
                  <div style={{ flex: 1, marginBottom: 10 }}>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="confirm password"
                      ref={input.confirmPassword}
                    />
                  </div>
                  <div style={{ flex: 1, marginBottom: 10 }}>
                    <input
                      type="number"
                      name="age"
                      placeholder="age"
                      ref={input.age}
                    />
                  </div>
                </>
              ) : (
                <></>
              )}
              <div
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignContent: "center",
                  justifyContent: "space-between",
                }}
              >
                <button type="submit" style={{ flex: 1 }}>
                  {register ? <>Register</> : <>Login</>}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <></>
        )}
      </div>
      <div
        style={{
          flex: 1,
          flexDirection: "row",
          alignContent: "center",
          justifyContent: "space-between",
        }}
      >
        {register || logged ? (
          <></>
        ) : (
          <button style={{ flex: 1, margin: 10 }} onClick={clickRegister}>
            Register
          </button>
        )}
        {view || register ? (
          <button style={{ flex: 1, margin: 10 }} onClick={backLogin}>
            Back To Login
          </button>
        ) : (
          <button style={{ flex: 1, margin: 10 }} onClick={clickView}>
            View Data
          </button>
        )}
      </div>
    </>
  );
}

export default App;
