import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary.js";
import { useState } from "react";
import { UserContext , LanguageEnum , UserContextType,Event} from "./util/types.js";
import { lazy , Suspense} from "react";
import Container from "react-bootstrap/Container";
import NavigationBar from "./components/NavigationBar.js";
import AgendaPage from "./pages/AgendaPage.js";


const LoginPage = lazy(() => import("./pages/LoginPage.js"));
const AddPage = lazy(() => import("./pages/AddPage.js"));

 
const App = () => {
  const [userContextData, setUserContextData] = useState<UserContextType>({language : LanguageEnum.SPANISH, userData : null});
  const [events, setEvents] = useState<Event[]>();
  const pageIsLoading = (<h3>page is loading</h3>);

  return (
    <ErrorBoundary>
      <UserContext.Provider value={userContextData}>
          <BrowserRouter>
            <Container fluid>
              <NavigationBar setUserContextData={setUserContextData}/>
              <Routes>
                <Route path="/" element={<AgendaPage setUserContextData={setUserContextData} events={events} setEvents={setEvents}/>} />
                <Route path="/login"  element={<Suspense fallback={pageIsLoading}> <LoginPage /></Suspense>} />
                <Route path="/add"  element={<Suspense fallback={pageIsLoading}> <AddPage setUserContextData={setUserContextData} events={events} setEvents={setEvents}/></Suspense>} />
              </Routes>
            </Container>
          </BrowserRouter>
      </UserContext.Provider>
    </ErrorBoundary>
  );
};
export default App;
