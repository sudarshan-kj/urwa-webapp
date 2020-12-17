import LoginPage from "components/LoginPage";
import NotFound from "components/NotFound";
import LandingPage from "components/LandingPage";
import { Route, Switch } from "react-router-dom";
import ProtectedRoute from "components/ProtectedRoute";
import { permissions } from "utils/Authz";
import AdminHome from "components/Admin/AdminHome";
import AddMember from "components/Admin/AddMember";
import MemberHome from "components/Member/MemberHome";
import MemberTable from "components/Admin/ViewMembers/MemberTable";
import PaymentPage from "components/Member/Payment/MemberPayment";
import PaymentStatus from "components/Member/Payment/PaymentStatus";
import UpdateMember from "components/Member/UpdateMember";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path={["/", "/test"]}>
          <LandingPage />
        </Route>
        <Route path="/login">
          <LoginPage />
        </Route>
        <ProtectedRoute
          adminOnly={false}
          permission={permissions.READ}
          path="/member/home"
          component={MemberHome}
        />
        <ProtectedRoute
          adminOnly={false}
          permission={permissions.UPDATE}
          path="/member/payment"
          component={PaymentPage}
        />
        <ProtectedRoute
          adminOnly={false}
          permission={permissions.READ}
          path="/member/status/success"
          component={PaymentStatus}
        />
        <ProtectedRoute
          adminOnly={false}
          permission={permissions.UPDATE}
          path="/member/profile/:memberId"
          component={UpdateMember}
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
          component={MemberTable}
        />
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
