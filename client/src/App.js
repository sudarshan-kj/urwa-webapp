import LoginPage from "components/LoginPage";
import NotFound from "components/NotFound";
import TestPage from "components/TestPage";
import { Route, Switch } from "react-router-dom";
import ProtectedRoute from "components/ProtectedRoute";
import AddMember from "components/Member/AddMember";
import { permissions } from "utils/Authz";
import Home from "components/Home";
import AdminHome from "components/Member/AdminHome";
import ViewMembers from "components/Member/ViewMembers";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path={["/", "/test"]}>
          <TestPage />
        </Route>
        <Route path="/home">
          <Home />
        </Route>
        <Route path="/login">
          <LoginPage />
        </Route>
        <ProtectedRoute
          adminOnly={true}
          permission={permissions.READ}
          path="/admin/home"
          component={AdminHome}
        />
        <ProtectedRoute
          adminOnly={true}
          permission={permissions.CREATE}
          path="/admin/addMember"
          component={AddMember}
        />
        <ProtectedRoute
          adminOnly={true}
          permission={permissions.READ}
          path="/admin/viewMembers"
          component={ViewMembers}
        />
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
