import { Button, Typography } from "antd";
import { Link } from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";
import Hero from "../../home/Hero";
import CategorySection from "../../home/categorySection";
import FeaturedProducts from "../../home/FeaturedProducts";
import LatestProducts from "../../home/LatestProducts";
import WhyRewear from "../../home/WhyRewear";

import "./Home.css";


const { Title, Paragraph } = Typography;


const Home = () => {

  return (
    <MainLayout>

      {/* ================ HERO ================= */}
      <Hero/>

      {/* ============ CATEGORIES =============== */}
      <CategorySection/>

      {/* =========== FEATURED PRODUCTS ========= */}
      <FeaturedProducts/>

      {/* ========== RECENTLY ADDED ============= */}
      <LatestProducts/>

      {/* ========== WHY REWEAR ================= */}
      <WhyRewear/>

      {/* ================= CTA ================= */}
      <section className="home-cta"
        style={{
          
        }}
      >
        <Title level={2}>
          Have something you don't use anymore?
        </Title>

        <Paragraph className="home-cta-text"
          // style={{
          //   fontSize: 17,
          //   color: "#666",
          // }}
        >
          Turn unused products into money and give them
          a new home.
        </Paragraph>

        <Link to="/sell">
          <Button type="primary" size="large">
            Start Selling
          </Button>
        </Link>
      </section>

    </MainLayout>
  );
};

export default Home;