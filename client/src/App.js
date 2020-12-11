import LoginPage from "components/LoginPage";
import NotFound from "components/NotFound";
import TestPage from "components/TestPage";
import { Route, Switch } from "react-router-dom";
import ProtectedRoute from "components/ProtectedRoute";
import { permissions } from "utils/Authz";
import AdminHome from "components/Admin/AdminHome";
import AddMember from "components/Admin/AddMember";
import Home from "components/Member/MemberHome";
import ViewMembers from "components/Admin/ViewMembers";
import PaymentPage from "components/Member/MemberPayment";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path={["/", "/test"]}>
          <TestPage />
        </Route>
        <Route path="/login">
          <LoginPage />
        </Route>
        <ProtectedRoute
          adminOnly={false}
          permission={permissions.READ}
          path="/member/home"
          component={Home}
        />
        <ProtectedRoute
          adminOnly={false}
          permission={permissions.READ}
          path="/member/payment"
          component={PaymentPage}
        />

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
