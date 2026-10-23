import AppRouter from "./routes/AppRoute";
import './App.scss'
import ScrollToTop from "./components/ScrollToTop";

function App() {
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