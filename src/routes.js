import { Suspense } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Trips from "./pages/trips";
import PublicTicketBooking from "./pages/PublicTicketBooking"
import PublicTicketBookingQr from './pages/publicTicketBookingQr'
import CenterRegistration from "./pages/CenterRegistration"
import Technicians from './pages/Technicians';
import Tickets from './pages/Admin/Tickets';
import Login from "./pages/login"
import Centers from "./pages/Admin/Centers"

import AddTechnician from "./pages/AddTechnician";
import AddTicket from "./pages/AddTicket";
import AdminTechnician from './pages/Admin/technician'
import AdminLogin from './pages/Admin/adminLogin'
import PrivateRoute from './helper/privateRoute';
import PublicRoute from './helper/publicRoute';
import AdminPrivateRoute from './helper/privateRouteAdmin'
import AdminPublicRoute from './helper/adminPublicRoute'
import CenterOnboardRoute from './helper/privateRouteCenterOnboarding'

import TicketsCenter from './pages/ticketCenter'
import CenterDashboard from './pages/CenterDashboard'
import BroadCastedRequests from './pages/broadcastedRequests'
import TicketCreatedByYou from './pages/ticketCreatedByYou'

import NavBar from './components/NavBar/navbar'
import AdminNavBar from './components/NavBar/adminPannel'
import CenterOnboardNavBar from './components/NavBar/CenterOnboardNavbar'
import AdminDashboard from './pages/Admin/AdminDashboard'
import BroadcastTickets from './pages/Admin/BroadcastTickets'
import AdminClients from './pages/Admin/AdminClients'
import AdminRoles from './pages/Admin/Roles/AdminRoles'
import AddTicketAdmin from './pages/Admin/AddNewTicket'
import AdminBroadCastList from './pages/Admin/broadcastedList'
import AdminAddCenter from './pages/Admin/AddCenter'
import PaymentsList from './pages/payments'
import ViewTicketPage from './pages/Admin/veiwTicket'

import FeedBackComponent from './pages/feedBack'
import AdminFeedBack from './pages/Admin/FeedBack'
import AddRole from "./pages/Admin/Roles/AddRole";
import AdminUsers from './pages/Admin/Users/AdminUsers'
import AddUser from "./pages/Admin/Users/AddUser";
import AdminCenterOnboarders from './pages/Admin/AdminCenterOnboarders/AdminCenterOnboarders';
import AddCenterOnboarder from './pages/Admin/AdminCenterOnboarders/AddCenterOnboarder';

import CenterOnboardRegistration from './pages/CenterOnboarding/CenterOnboardRegistration'
import CenterOnboardLogin from './pages/CenterOnboarding/CenterOnboardLogin'
import CenterOnboardAddCenter from './pages/CenterOnboarding/components/CenterOnboardAddCenter'
import CenterOnboardViewCenters from './pages/CenterOnboarding/components/CentersList'

const stylesSheet = {
  styleForDiv: {
    marginTop: "8%",
    marginLeft: "20%",
    marginRight: "5%",

  }
}

const Routes = () => (
  <Suspense >
    <Switch>
      {/* <PublicRoute exact path="/" component={Login} /> */}
      <PublicRoute exact path="/">
        <Redirect to="/booking" />
      </PublicRoute>

      {/* <PrivateRoute path="/trips" component={Trips} /> */}
      <Route path="/registration/:centerOnboarderId?" component={CenterRegistration} />

      <Route path="/feedback/:id" component={FeedBackComponent} />
      <Route path="/booking/:id" exact component={PublicTicketBookingQr} />

      <Route path="/booking" exact component={PublicTicketBooking} />


      <PublicRoute path="/login" component={Login} />

      {/* Center Pages Routes Only */}
      <PrivateRoute path="/center-dashboard" component={() => {
        return <>
          <NavBar />
          <div style={stylesSheet.styleForDiv}>

            <CenterDashboard />
          </div>
        </>
      }} />

      <PrivateRoute path="/Technicians" component={() => {
        return <>
          <NavBar />
          <div style={stylesSheet.styleForDiv}>

            <Technicians />
          </div>
        </>
      }} />


      <PrivateRoute path="/brodcast-requests" component={() => {
        return <>
          <NavBar />
          <div style={stylesSheet.styleForDiv}>

            <BroadCastedRequests />
          </div>
        </>
      }} />


      <PrivateRoute path="/payments" component={() => {
        return <>
          <NavBar />
          <div style={stylesSheet.styleForDiv}>

            <PaymentsList />
          </div>
        </>
      }} />

      <PrivateRoute path="/AddTechnician" component={() => {
        return <>
          <NavBar />
          <div style={stylesSheet.styleForDiv}>
            <AddTechnician />

          </div>
        </>
      }} />

      <PrivateRoute path="/AddTicket" component={() => {
        return <>
          <NavBar />
          <div style={stylesSheet.styleForDiv}>

            <AddTicket />
          </div>
        </>
      }} />

      <PrivateRoute path="/ticket-created-by-you" component={() => {
        return <>
          <NavBar />
          <div style={stylesSheet.styleForDiv}>
            <TicketCreatedByYou />
          </div>
        </>
      }} />

      <PrivateRoute component={() => {
        return <>
          <NavBar />
          <div style={stylesSheet.styleForDiv}>

            <TicketsCenter />
          </div>
        </>

      }} path="/tickets-center" />


      <AdminPublicRoute path="/admin-login" component={AdminLogin} />

      {/* Admin Pages Routes Only */}
      <AdminPrivateRoute path="/admin-dashboard" component={() => {
        return <>
          <AdminNavBar />
          <div style={stylesSheet.styleForDiv}>
            <AdminDashboard />
          </div>

        </>
      }} />



      <AdminPrivateRoute path="/broad-casted-list" component={() => {
        return <>
          <AdminNavBar />
          <div style={stylesSheet.styleForDiv}>
            <AdminBroadCastList />
          </div>

        </>
      }} />
      <AdminPrivateRoute path="/add-center" component={() => {
        return <>
          <AdminNavBar />
          <div style={stylesSheet.styleForDiv}>
            <AdminAddCenter />
          </div>

        </>
      }} />

      <AdminPrivateRoute path="/view-ticket" component={() => {
        return <>
          <AdminNavBar />
          <div style={stylesSheet.styleForDiv}>
            <ViewTicketPage />
          </div>

        </>
      }} />
      <AdminPrivateRoute path="/admin-centers" component={() => {
        return <>
          <AdminNavBar />
          <div style={stylesSheet.styleForDiv}>

            <Centers />
          </div>
        </>

      }} />

      <AdminPrivateRoute path="/admin-ticket" component={() => {
        return <>
          <AdminNavBar />
          <div style={stylesSheet.styleForDiv}>

            <AddTicketAdmin />
          </div>
        </>

      }} />


      <AdminPrivateRoute path="/admin-feedBack" component={() => {
        return <>
          <AdminNavBar />
          <div style={stylesSheet.styleForDiv}>

            <AdminFeedBack />
          </div>
        </>

      }} />

      <AdminPrivateRoute path="/Tickets" component={() => {
        return <>
          <AdminNavBar />
          <div style={stylesSheet.styleForDiv}>
            <Tickets />
          </div>

        </>
      }} />

      <AdminPrivateRoute component={() => {
        return <>
          <AdminNavBar />
          <div style={stylesSheet.styleForDiv}>

            <AdminTechnician />
          </div>
        </>

      }} path="/admin-technician" />

      <AdminPrivateRoute path="/admin-broadcast-tickets" component={() => {
        return <>
          <AdminNavBar />
          <div style={stylesSheet.styleForDiv}>
            <BroadcastTickets />
          </div>

        </>
      }} />

      <AdminPrivateRoute path="/admin-clients" component={() => {
        return <>
          <AdminNavBar />
          <div style={stylesSheet.styleForDiv}>
            <AdminClients />
          </div>

        </>
      }} />

      <AdminPrivateRoute path="/roles" component={() => {
        return <>
          <AdminNavBar />
          <div style={stylesSheet.styleForDiv}>
            <AdminRoles />
          </div>

        </>
      }} />

      <AdminPrivateRoute path="/add-role" component={() => {
        return <>
          <AdminNavBar />
          <div style={stylesSheet.styleForDiv}>

            <AddRole />
          </div>
        </>

      }} />

      <AdminPrivateRoute path="/users" component={() => {
        return <>
          <AdminNavBar />
          <div style={stylesSheet.styleForDiv}>
            <AdminUsers />
          </div>

        </>
      }} />

      <AdminPrivateRoute path="/add-user" component={() => {
        return <>
          <AdminNavBar />
          <div style={stylesSheet.styleForDiv}>

            <AddUser />
          </div>
        </>

      }} />

      <AdminPrivateRoute path="/admin-center-onboarders" component={() => {
        return <>
          <AdminNavBar />
          <div style={stylesSheet.styleForDiv}>
            <AdminCenterOnboarders />
          </div>

        </>
      }} />

      <AdminPrivateRoute path="/admin-add-center-onboarder" component={() => {
        return <>
          <AdminNavBar />
          <div style={stylesSheet.styleForDiv}>

            <AddCenterOnboarder />
          </div>
        </>

      }} />

      <Route path="/center-onboard-registration" component={CenterOnboardRegistration} />
      <Route path="/center-onboard-login" component={CenterOnboardLogin} />

      <CenterOnboardRoute path="/center-onboard-add-center" component={() => {
        return <>
          <CenterOnboardNavBar />
          <div style={stylesSheet.styleForDiv}>

            <CenterOnboardAddCenter />
          </div>
        </>

      }} />
      <CenterOnboardRoute path="/center-onboard-view-centers" component={() => {
        return <>
          <CenterOnboardNavBar />
          <div style={stylesSheet.styleForDiv}>

            <CenterOnboardViewCenters />
          </div>
        </>

      }} />

    </Switch>
  </Suspense>
);

export default Routes;
