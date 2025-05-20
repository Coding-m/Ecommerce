import React from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import LoginIcon from "@mui/icons-material/Login";

export default function NavBar() {
  const cartItemCount = 1; // Static count

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
        >
          E-Shop
        </Typography>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/products">
            Products
          </Button>

          {/* Static Cart Icon with Always-Visible Badge */}
          <IconButton color="inherit" component={Link} to="/cart">
            <Badge
              badgeContent={cartItemCount}
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: "#003366", // match login button
                  color: "#fff",               // white number
                },
              }}
            >
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          <Button color="inherit" component={Link} to="/contact">
            Contact
          </Button>
          <Button color="inherit" component={Link} to="/about">
            About
          </Button>

          {/* Login Button */}
          <Button
            variant="contained"
            component={Link}
            to="/login"
            startIcon={<LoginIcon />}
            sx={{
              backgroundColor: "#003366",  // dark blue
              color: "#fff",
              borderRadius: "20px",
              paddingX: 3,
              textTransform: "none",
              fontWeight: "bold",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#002244",  // darker on hover
                boxShadow: "none",
              },
            }}
          >
            Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
