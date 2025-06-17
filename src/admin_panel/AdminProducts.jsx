import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const API_BASE = '/api';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const [form, setForm] = useState({
    productId: null,
    productName: '',
    description: '',
    quantity: '',
    price: '',
    discount: '',
    specialPrice: '',
    image: '',
    categoryId: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [editing, setEditing] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    fetchProducts();
  }, []);

  function fetchProducts() {
    setLoading(true);
    fetch(`${API_BASE}/public/products?pageNumber=1&pageSize=100`)
      .then(res => res.json())
      .then(data => {
        setProducts(data.content || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load products');
        setLoading(false);
      });
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleFileChange(e) {
    setImageFile(e.target.files[0]);
  }

  function resetForm() {
    setForm({
      productId: null,
      productName: '',
      description: '',
      quantity: '',
      price: '',
      discount: '',
      specialPrice: '',
      image: '',
      categoryId: '',
    });
    setImageFile(null);
    setEditing(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      productName: form.productName,
      description: form.description,
      quantity: parseInt(form.quantity) || 0,
      price: parseFloat(form.price),
      discount: parseFloat(form.discount) || 0,
      specialPrice: parseFloat(form.specialPrice) || 0,
      image: form.image || 'default.png',
    };

    try {
      let savedProduct;

      if (editing) {
        const res = await fetch(`${API_BASE}/admin/products/${form.productId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || 'Failed to update product');
        }

        savedProduct = await res.json();
      } else {
        const res = await fetch(`${API_BASE}/admin/categories/${form.categoryId}/product`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || 'Failed to add product');
        }

        savedProduct = await res.json();
      }

      // ✅ Step 2: Upload Image if selected
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        const imgRes = await fetch(`${API_BASE}/products/${savedProduct.productId}/image`, {
          method: 'PUT',
          body: formData,
        });

        if (!imgRes.ok) {
          const text = await imgRes.text();
          console.error("Image upload failed:", text);
          throw new Error('Image upload failed: ' + text);
        }
      }

      alert(editing ? 'Product updated successfully!' : 'Product added successfully!');
      fetchProducts();
      handleCloseDialog();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Something went wrong');
    }
  }

  function handleEdit(product) {
    setForm({
      ...product,
      categoryId: '', // Not needed while editing
    });
    setImageFile(null);
    setEditing(true);
    setOpenDialog(true);
  }

  function handleDelete(id) {
    if (!window.confirm('Are you sure to delete this product?')) return;

    fetch(`${API_BASE}/admin/products/${id}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete');
        return res.json();
      })
      .then(() => fetchProducts())
      .catch(() => alert('Failed to delete product'));
  }

  const handleOpenDialog = () => {
    resetForm();
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    resetForm();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Manage Products</h1>
      <Button variant="contained" onClick={handleOpenDialog}>Add Product</Button>

      <Dialog fullScreen={fullScreen} open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editing ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} sm={6}>
                <TextField label="Product Name" name="productName" fullWidth required value={form.productName} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Description" name="description" fullWidth value={form.description} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Quantity" name="quantity" type="number" fullWidth value={form.quantity} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Price" name="price" type="number" fullWidth required value={form.price} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Discount (%)" name="discount" type="number" fullWidth value={form.discount} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Special Price" name="specialPrice" type="number" fullWidth value={form.specialPrice} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Image Filename" name="image" fullWidth value={form.image} onChange={handleInputChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button variant="outlined" component="label" fullWidth>
                  Upload Image
                  <input hidden type="file" onChange={handleFileChange} />
                </Button>
                {imageFile && (
                  <img src={URL.createObjectURL(imageFile)} alt="Preview" className="mt-2 rounded w-24 h-24 object-cover" />
                )}
              </Grid>
              {!editing && (
                <Grid item xs={12} sm={6}>
                  <TextField label="Category ID" name="categoryId" type="number" fullWidth required value={form.categoryId} onChange={handleInputChange} />
                </Grid>
              )}
            </Grid>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit" variant="contained">{editing ? 'Update' : 'Add'}</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {products.map(product => (
          <div key={product.productId} className="border rounded p-4 shadow-sm bg-white">
            <h3 className="font-semibold text-lg">{product.productName}</h3>
            <p className="text-sm">{product.description}</p>
            <p className="text-sm text-gray-600">Price: ${product.price}</p>
            <div className="flex justify-end space-x-2 mt-3">
              <Button onClick={() => handleEdit(product)} variant="contained" size="small" color="primary">Edit</Button>
              <Button onClick={() => handleDelete(product.productId)} variant="contained" size="small" color="error">Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
