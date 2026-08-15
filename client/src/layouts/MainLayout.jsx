import { Layout } from "antd";

import Navbar from "../components/layout/Navbar";
import AppFooter from "../components/layout/Footer";

const { Content } = Layout;

const MainLayout = ({ children }) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Navbar />

      <Content
        style={{
          padding: "30px",
          background: "#f5f5f5",
        }}
      >
        {children}
      </Content>

      <AppFooter />
    </Layout>
  );
};

export default MainLayout;