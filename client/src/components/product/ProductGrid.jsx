import { Row, Col } from "antd";
import ProductCard from "./ProductCard";

import "./ProductGrid.css";


const ProductGrid = ({ products }) => {

    return (
        <div className="product-grid">
            <Row gutter={[24,24]}>

                {products.map(product=>(

                    <Col
                        xs={24}
                        sm={12}
                        md={8}
                        lg={8}
                        key={product._id}
                    >

                        <ProductCard product={product}/>

                    </Col>

                ))}

            </Row>
        </div>
    );

};

export default ProductGrid;