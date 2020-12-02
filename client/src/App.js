import LoginPage from "components/LoginPage";
import NotFound from "components/NotFound";
import Home from "components/Home";
import { Route, Switch } from "react-router-dom";
import ProtectedRoute from "components/ProtectedRoute";
import AddMember from "components/Member/AddMember";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path={["/", "/home"]}>
          <Home />
        </Route>
        <Route path="/login">
          <LoginPage />
        </Route>
        <ProtectedRoute path="/admin/addMember" component={AddMember} />
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
