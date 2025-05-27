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
} from '@mui/material';
import Spinners from '../components/spinners';

export default function AdminCategories() {
  const [categories, setCategories] = React.useState([]);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [newCategory, setNewCategory] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState('');
  
  // Loading states
  const [loadingCategories, setLoadingCategories] = React.useState(true);
  const [addingCategory, setAddingCategory] = React.useState(false);

  React.useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await axios.get('http://localhost:8080/api/public/categories');
      setCategories(response.data.content || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
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
        { headers: { 'Content-Type': 'application/json' } }
      );
      setOpenDialog(false);
      setNewCategory('');
      fetchCategories();
      setSuccessMessage('Category added successfully!');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Failed to add category:', error);
      setErrorMessage(
        error.response?.data?.message || 'Failed to add category. Please try again.'
      );
    }
    setAddingCategory(false);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 900, margin: 'auto' }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        sx={{ fontWeight: '600', textAlign: 'center', mb: 3, color: '#333' }}
      >
        Category Management
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
          {categories.map(category => (
            <Grid item xs={12} sm={6} md={4} key={category.categoryId}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: '500', color: '#1976d2' }}>
                    {category.categoryName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    ID: {category.categoryId}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: '600' }}>Add New Category</DialogTitle>
        <DialogContent>
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            fullWidth
            variant="outlined"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            disabled={addingCategory}
          />
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ textTransform: 'none' }} disabled={addingCategory}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleAddCategory} 
            sx={{ textTransform: 'none' }}
            disabled={addingCategory}
          >
            {addingCategory ? <Spinners size={20} /> : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity="success" 
          variant="filled"
          sx={{ fontWeight: '600' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
