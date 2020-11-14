// import logo from "./tree.png";
import "./App.css";
import Header from "components/Header";
import LandingPage from "components/LandingPage";

function App() {
  return (
    <div className="App">
      <LandingPage />
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p className="message">
          This website is currently under development, please come back a little
          while later
        </p>
        <p className="copyright">&copy; URWA 2020</p>
      </header> */}
    </div>
  );
}

export default App;
