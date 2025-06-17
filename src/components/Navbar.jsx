import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import LoginIcon from "@mui/icons-material/Login";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import UserMenu from "./UserMenu";

export default function NavBar() {
  const cart = useSelector((state) => state.carts.cart || []);
  const user = useSelector((state) => state.auth.user);

  const cartItemCount = cart.reduce(
    (acc, item) => acc + Number(item.quantity || 0),
    0
  );

  const isAdmin = user?.roles?.includes("ROLE_ADMIN");

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

          {/* 👇 Show cart only if user is NOT an admin */}
          {!isAdmin && (
            <IconButton color="inherit" component={Link} to="/cart">
              <Badge
                badgeContent={cartItemCount}
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "#003366",
                    color: "#fff",
                  },
                }}
              >
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          )}

          <Button color="inherit" component={Link} to="/contact">
            Contact
          </Button>
          <Button color="inherit" component={Link} to="/about">
            About
          </Button>

          {user && user.id ? (
            <UserMenu />
          ) : (
            <Button
              variant="contained"
              component={Link}
              to="/login"
              startIcon={<LoginIcon />}
              sx={{
                backgroundColor: "#003366",
                color: "#fff",
                borderRadius: "20px",
                paddingX: 3,
                textTransform: "none",
                fontWeight: "bold",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#002244",
                  boxShadow: "none",
                },
              }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
