import { Layout } from "antd";

import Navbar from "../components/layout/Navbar";
import AppFooter from "../components/layout/Footer";

import "./MainLayout.css";

const { Content } = Layout;

const MainLayout = ({ children }) => {
  return (
    <Layout className="main-layout">
      <Navbar />

      <Content className="main-content">
        {children}
      </Content>

      <AppFooter />
    </Layout>
  );
};

export default MainLayout;