import Pagination from '@mui/material/Pagination';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const Paginations = ({ numberOfPage }) => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const params = new URLSearchParams(searchParams);
  const navigate = useNavigate();

  const currentPage = searchParams.get("page")
    ? Number(searchParams.get("page"))
    : 1;

  const handlePageChange = (event, value) => {
    params.set("page", value.toString());
    navigate(`${location.pathname}?${params.toString()}`);
  };

  return (
    <div>
      <Pagination
        count={numberOfPage}
        page={currentPage}
        shape="rounded"
        onChange={handlePageChange}
      />
    </div>
  );
};

export default Paginations;
