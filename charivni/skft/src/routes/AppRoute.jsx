
import { Routes, Route } from 'react-router-dom'
import Layout from "../components/Layout/Layout";
import HelpPage from "../pages/HelpPage/HelpPAge";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import QuestionnairePage from "../pages/QuestionnairePage/QuestionnairePage";
import ShopPage from "../pages/ShopPage/ShopPage";
import AboutPage from "../pages/AboutPage/AboutPage";
import AuthPage from "../pages/AuthPage/AuthPage";
import CabinetPage from "../pages/CabinetPage/CabinetPage";
import BlogPage from "../pages/BlogPage/BlogPage";
import ArticlePage from "../pages/ArticlePage/ArticlePage";



const AppRouter = () => {
  return (
    <Routes>
      <Route path="/cabinet" element={<CabinetPage />} />
      <Route path="/" element={<AuthPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/" element={<Layout />}>
        
        <Route path="/help" element={<HelpPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<ArticlePage />} />
        <Route path="/questionnaire" element={<QuestionnairePage />} />
        <Route path="/shop" element={<ShopPage />} />
        

        <Route path="/about/:id" element={<AboutPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
