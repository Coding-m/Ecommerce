import * as React from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  IconButton,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Spinners from '../components/spinners';

export default function AdminCategories() {
  const [categories, setCategories] = React.useState([]);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [newCategory, setNewCategory] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [loadingCategories, setLoadingCategories] = React.useState(true);
  const [addingCategory, setAddingCategory] = React.useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = React.useState(null);

  const token = localStorage.getItem('token'); // Replace with your actual auth logic

  React.useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await axios.get('http://localhost:8080/api/public/categories');
      const content = response.data?.content;
      if (Array.isArray(content)) {
        setCategories(content);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setCategories([]);
      setSnackbarSeverity('error');
      setSnackbarMessage('Failed to load categories.');
      setSnackbarOpen(true);
    }
    setLoadingCategories(false);
  };

  const handleAddCategory = async () => {
    setErrorMessage('');
    if (!newCategory.trim()) {
      setErrorMessage('Category name cannot be empty.');
      return;
    }
    setAddingCategory(true);
    try {
      await axios.post(
        'http://localhost:8080/api/public/categories',
        { categoryName: newCategory },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOpenDialog(false);
      setNewCategory('');
      fetchCategories();
      setSnackbarSeverity('success');
      setSnackbarMessage('Category added successfully!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Failed to add category:', error);
      setErrorMessage(
        error.response?.data?.message || 'Failed to add category. Please try again.'
      );
    }
    setAddingCategory(false);
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    setDeletingCategoryId(categoryId);
    try {
      await axios.delete(
        `http://localhost:8080/api/admin/categories/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSnackbarSeverity('success');
      setSnackbarMessage('Category deleted successfully!');
      setSnackbarOpen(true);
      fetchCategories();
    } catch (error) {
      console.error('Failed to delete category:', error);
      let message = 'Failed to delete category. Please try again.';
      if (error.response) {
        if (error.response.status === 409) {
          message = 'Cannot delete category with products. Please delete products first.';
        } else if (error.response.data?.message) {
          message = error.response.data.message;
        }
      }
      setSnackbarSeverity('error');
      setSnackbarMessage(message);
      setSnackbarOpen(true);
    }
    setDeletingCategoryId(null);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !addingCategory && newCategory.trim()) {
      handleAddCategory();
    }
  };

  return (
    // Removed margin: 'auto' here so content aligns top-left
    <Box sx={{ p: 3, maxWidth: 900 /* you can remove maxWidth if you want full width */, marginLeft: 0 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: '600', textAlign: 'center', mb: 3, color: '#333' }}
      >
       
      </Typography>

      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Button
          variant="contained"
          onClick={() => setOpenDialog(true)}
          sx={{ textTransform: 'none', fontWeight: '600' }}
          disabled={loadingCategories}
        >
          Add Category
        </Button>
      </Box>

      {loadingCategories ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <Spinners />
        </Box>
      ) : categories.length === 0 ? (
        <Typography sx={{ width: '100%', textAlign: 'center', mt: 6, color: '#666' }}>
          No categories available.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category.categoryId}>
              <Card variant="outlined" sx={{ p: 2, position: 'relative' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: '500', color: '#1976d2' }}>
                    {category.categoryName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    ID: {category.categoryId}
                  </Typography>
                </CardContent>
                <IconButton
                  aria-label="delete"
                  color="error"
                  size="small"
                  sx={{ position: 'absolute', top: 8, right: 8 }}
                  onClick={() => handleDeleteCategory(category.categoryId)}
                  disabled={deletingCategoryId === category.categoryId}
                >
                  {deletingCategoryId === category.categoryId ? (
                    <CircularProgress size={24} color="error" />
                  ) : (
                    <DeleteIcon />
                  )}
                </IconButton>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: '600' }}>Add New Category</DialogTitle>
        <DialogContent>
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}
          <TextField
            name="categoryName"
            autoFocus
            margin="dense"
            label="Category Name"
            fullWidth
            variant="outlined"
            value={newCategory}
            onChange={(e) => {
              setNewCategory(e.target.value);
              if (errorMessage) setErrorMessage('');
            }}
            disabled={addingCategory}
            onKeyDown={handleKeyDown}
          />
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button onClick={() => setOpenDialog(false)} disabled={addingCategory}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAddCategory}
            disabled={addingCategory || !newCategory.trim()}
          >
            {addingCategory ? <Spinners size={20} /> : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={snackbarSeverity === 'error' ? null : 4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ whiteSpace: 'pre-line' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
