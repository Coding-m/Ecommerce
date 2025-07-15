import * as React from 'react';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import AdminProducts from './AdminProducts';
import AdminCategories from './AdminCategories';
import AdminAnalytics from './AdminAnalytics';

const NAVIGATION = [
  { kind: 'header', title: 'Main Menu' },
  { segment: 'dashboard', title: 'Admin Dashboard', icon: <DashboardIcon /> },
  { segment: 'products', title: 'Products', icon: <ShoppingCartIcon /> },
  { segment: 'categories', title: 'Categories', icon: <LayersIcon /> },
  { kind: 'divider' },
  { kind: 'header', title: 'Reports' },
  {
    segment: 'analytics',
    title: 'Analytics',
    icon: <BarChartIcon />,
    children: [
      { segment: 'sales', title: 'Sales Reports', icon: <DescriptionIcon /> },
      { segment: 'traffic', title: 'Website Traffic', icon: <DescriptionIcon /> },
    ],
  },
];

const demoTheme = createTheme({
  colorSchemes: { light: true, dark: true },
  cssVariables: { colorSchemeSelector: 'class' },
  breakpoints: {
    values: { xs: 0, sm: 600, md: 600, lg: 1200, xl: 1536 },
  },
});

export default function AdminDashboard(props) {
  const { window } = props;
  const [pathname, setPathname] = React.useState('/dashboard');

  const router = React.useMemo(
    () => ({
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(path),
    }),
    [pathname]
  );

  const [products, setProducts] = React.useState(null);
  const [categoriesCount, setCategoriesCount] = React.useState(null);
  const [loadingProducts, setLoadingProducts] = React.useState(true);
  const [loadingCategories, setLoadingCategories] = React.useState(true);

  React.useEffect(() => {
    // fetch product count
    fetch('/api/public/products?pageNumber=1&pageSize=10')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.content || []);
        setLoadingProducts(false);
      })
      .catch(() => {
        setProducts([]);
        setLoadingProducts(false);
      });

    // fetch category count
    fetch('/api/public/categories')
      .then((res) => res.json())
      .then((data) => {
        setCategoriesCount(Array.isArray(data) ? data.length : 0);
        setLoadingCategories(false);
      })
      .catch(() => {
        setCategoriesCount(0);
        setLoadingCategories(false);
      });
  }, []);

  const demoWindow = window ? window() : undefined;

  return (
    <AppProvider navigation={NAVIGATION} router={router} theme={demoTheme} window={demoWindow}>
      <DashboardLayout>
        <PageContainer>
          {pathname === '/dashboard' && (
            <div>
              <h2>Welcome to Admin Dashboard</h2>
              <p>Products loaded: {loadingProducts ? 'Loading...' : products?.length}</p>
              <p>Categories loaded: {loadingCategories ? 'Loading...' : categoriesCount}</p>
            </div>
          )}
          {pathname === '/products' && <AdminProducts />}
          {pathname === '/categories' && <AdminCategories />}
          {pathname.startsWith('/analytics') && <AdminAnalytics />}

          {/* fallback */}
          {!['/dashboard', '/products', '/categories', '/analytics'].includes(pathname) && (
            <div>Page Not Found</div>
          )}
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}
