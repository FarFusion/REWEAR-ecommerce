import { Button, Card, Col, Row, Typography } from "antd";
import { Link } from "react-router-dom";


const { Title, Paragraph } = Typography;

const WhyRewear = () => {
  return (
    <section
        style={{
          padding: "50px 20px",
          background: "#fafafa",
          borderRadius: 16,
          marginBottom: 60,
        }}
    >
        <Title
          level={2}
          style={{
            textAlign: "center",
            marginBottom: 40,
          }}
        >
          Why ReWear?
        </Title>

        <Row gutter={[30, 30]}>
          <Col xs={24} md={8}>
            <Card
              bordered={false}
              style={{ textAlign: "center" }}
            >
              <div style={{ fontSize: 40 }}>💰</div>

              <Title level={4}>
                Affordable Prices
              </Title>

              <Paragraph>
                Find quality products at prices that fit
                your budget.
              </Paragraph>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card
              bordered={false}
              style={{ textAlign: "center" }}
            >
              <div style={{ fontSize: 40 }}>♻️</div>

              <Title level={4}>
                Reduce Waste
              </Title>

              <Paragraph>
                Give products another life instead of
                sending them to waste.
              </Paragraph>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card
              bordered={false}
              style={{ textAlign: "center" }}
            >
              <div style={{ fontSize: 40 }}>🤝</div>

              <Title level={4}>
                Trusted Community
              </Title>

              <Paragraph>
                Buy and sell products with other members
                of the ReWear community.
              </Paragraph>
            </Card>
          </Col>
        </Row>
    </section>
  )
}

export default WhyRewear