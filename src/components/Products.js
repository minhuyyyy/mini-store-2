import { SearchOutlined } from "@mui/icons-material";
import {
  Card,
  CardMedia,
  Grid,
  Icon,
  IconButton,
  Input,
  InputAdornment,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ProductsPresentation = ({ filteredProducts, category }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    const filtered = filteredProducts.filter((product) => {
      return product.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setProducts(filtered);
  };

  useEffect(() => {
    if (filteredProducts) {
      handleSearch();
    }
  }, [filteredProducts]);

  const onInputChange = (event) => {
    setSearchTerm(event.target.value);
    handleSearch(); // Call handleSearch whenever input changes
  };

  return (
    <>
      <Input
        id="search"
        placeholder="Search products:"
        style={{
          border: "1px solid black",
          height: "60px",
          textDecoration: "none",
          width: "60%",
          marginBottom: 20,
        }}
        className="center"
        value={searchTerm}
        disableUnderline={true}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
        onChange={onInputChange}
        endAdornment={
          <InputAdornment position="end">
            <IconButton onClick={handleSearch}>
              <SearchOutlined />
            </IconButton>
          </InputAdornment>
        }
      ></Input>
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Card
              style={{
                border: "1px solid black",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CardMedia
                component="img"
                image={product.imageUrl}
                style={{ flex: "1 0 auto", objectFit: "contain" }}
              />
              <Typography
                style={{
                  marginTop: "auto",
                  fontWeight: "bold",
                  fontSize: "24px",
                }}
              >
                {product.name}
              </Typography>
              <Link
                to={`/detail/${product.id}`}
                style={{ marginTop: "auto", marginBottom: "10px" }}
              >
                <button
                  className="btn btn-success"
                  style={{ display: "inline-block", alignSelf: "flex-start" }}
                  onClick={() => {
                    // Handle button click here
                  }}
                >
                  <Icon left>info</Icon>Detail
                </button>
              </Link>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default ProductsPresentation;
