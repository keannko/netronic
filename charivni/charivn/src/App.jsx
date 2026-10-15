import AppRouter from "./routes/AppRoute";
import './App.scss'
import ScrollToTop from "./components/ScrollToTop";
import { useEffect } from "react";
import $api from "./http";
import { useDispatch } from "react-redux";
import { isAuth } from "./redux/slices/userSlice";

function App() {
  const dispatch = useDispatch()
  
  useEffect(() => {
    try {
      $api.get("users/refresh")
      .then(response => {
        localStorage.setItem('token', response.data.accessToken)
        dispatch(isAuth(true))
      })
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }, [dispatch])
  
  return (
    <>
    <ScrollToTop />
      <div>
        <AppRouter />
      </div>
    </>
  );
}

export default App;
