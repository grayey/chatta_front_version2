import React from "react";
import "./App.css";
import Chat from "./components/front/chat/chat.component";
import Error from "./pages/error";
import { Route, Switch } from "react-router-dom";
import { ManageBot } from "./pages/manageBot";
import { UserSettings } from "./pages/userSettings";
import { Dashboard } from "./pages/dashboard";
import { Bot } from "./components/admin/adminDashboard/Bot/admin-bots";
import { UserList } from "./pages/users";
import Register from "./components/admin/adminDashboard/Authentication/Register";
import Login from "./components/admin/adminDashboard/Authentication/Login";
import ResetPassword from "./components/admin/adminDashboard/Authentication/reset-password";
import VerifyNewPassword from "./components/admin/adminDashboard/Authentication/verify-new-password";

import VerifyEmail from "./components/admin/adminDashboard/Authentication/emailVerification";
import CompaniesComponent from "./components/admin/adminDashboard/companies/listCompanies";
import BotUITemplate from "./components/admin/adminDashboard/Bot/bot-UI-template-design";
import Triangle from "./components/admin/adminDashboard/Bot/triangle2";
import InternetCheck from "./components/admin/adminDashboard/Bot/internet-check";
// import CompaniesComponent from "./components/admin/adminDashboard/companies/listCompanies";
import { CompanySettings } from "./components/admin/adminDashboard/Bot/companySettings";
import { IthAdmin } from "./components/ithAdmin/ithAdmin";
import { ProtectedRoute } from "./components/protectedRoutes";
import FrontPage from "./components/front/landing-page/frontPage";
import Charts from "./components/admin/adminDashboard/analytics/chart";
import Visits from "./components/admin/adminDashboard/analytics/visits";
import Convo from "./components/front/conversation/convo2";
import CallToAction from "./components/admin/adminDashboard/Bot/call-to-action-accordion";
import COnversationOverlay from "./components/admin/adminDashboard/analytics/visit-conversation-leads-overlay";
import DatePicker from "../src/components/admin/adminDashboard/analytics/dates";
import BotBody from "./components/admin/adminDashboard/Bot/bot-body";
import PaymentPage from "./pages/checkout/cardForm";
import Tags from "./components/admin/adminDashboard/Bot/tag-overlay";

function App() {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={FrontPage}></Route>
        <Route exact path="/chatbot" component={Chat}></Route>
        <Route exact path="/payment" component={PaymentPage}></Route>
        <Route exact path="/ithadmin" component={IthAdmin}></Route>
        <Route exact path="/convo" component={Convo}></Route>
        <Route exact path="/action" component={CallToAction}></Route>
        <ProtectedRoute
          exact
          path="/dashboard/admin/bot"
          component={Bot}
        ></ProtectedRoute>
        <ProtectedRoute
          exact
          path="/dashboard/admin"
          component={Visits}
        ></ProtectedRoute>
        <ProtectedRoute
          exact
          path="/dashboard/admin/user/:id"
          component={UserSettings}
        ></ProtectedRoute>
        <ProtectedRoute
          exact
          path="/dashboard/admin/company/:id"
          component={CompanySettings}
        ></ProtectedRoute>
        <Route exact path="/" component={Chat}></Route>
        <ProtectedRoute
          exact
          path="/dashboard/admin"
          component={Dashboard}
        ></ProtectedRoute>
        <ProtectedRoute
          exact
          path="/dashboard/admin/bot"
          component={Bot}
        ></ProtectedRoute>
        <ProtectedRoute
          exact
          path="/dashboard/admin/user/:id"
          component={UserSettings}
        ></ProtectedRoute>
        <ProtectedRoute
          exact
          path="/dashboard/admin/bot/:id"
          component={ManageBot}
        ></ProtectedRoute>
        <ProtectedRoute
          exact
          path="/dashboard/admin/user"
          component={UserList}
        ></ProtectedRoute>
        <ProtectedRoute
          exact
          path="/dashboard/admin/company/us"
          component={CompanySettings}
        ></ProtectedRoute>
        <ProtectedRoute
          exact
          path="/dashboard/admin/company"
          component={CompaniesComponent}
        ></ProtectedRoute>
        <Route exact path="/auth/register" component={Register}></Route>
        <Route exact path="/auth/login" component={Login}></Route>
        <Route
          exact
          path="/auth/password-reset"
          component={VerifyNewPassword}
        ></Route>
        <Route
          exact
          path="/auth/recover-password"
          component={ResetPassword}
        ></Route>

        <Route exact path="/auth/verify_email" component={VerifyEmail}></Route>
        <Route exact path="/preview" component={BotUITemplate}></Route>
        <Route exact path="/date" component={DatePicker}></Route>
        <Route exact path="/visits" component={Visits}></Route>
        <Route
          exact
          path="/conversation"
          component={COnversationOverlay}
        ></Route>
        <Route exact path="/tags" component={Tags}></Route>

        <Route component={Error}></Route>
      </Switch>
    </div>
  );
}

export default App;
