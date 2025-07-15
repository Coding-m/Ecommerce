import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Step, StepLabel, Stepper, Skeleton, Button } from '@mui/material';
import { toast } from 'react-toastify';

// ✅ Custom components (adjust paths if needed)
import AddressInfo from '../../components/checkout/AddressInfo';
import PaymentMethod from '../../components/checkout/PaymentMethod';
import OrderSummary from '../../components/checkout/OrderSummary';
import StripePayment from '../../components/checkout/StripePayment';
import PaypalPayment from '../../components/checkout/PaypalPayment';
import ErrorPage from '../../components/checkout/ErrorPage';

// ✅ Redux action
import { getUserAddresses } from '../../store/actions';

const CheckOut = () => {
  const [activeStep, setActiveStep] = useState(0);
  const dispatch = useDispatch();

  // ✅ selectors
  const { isLoading, errorMessage } = useSelector((state) => state.errors);
  const { address, selectedUserCheckoutAddress } = useSelector((state) => state.auth);
  const { paymentMethod } = useSelector((state) => state.payment);
  const { cart, totalPrice } = useSelector((state) => state.carts);

  const steps = ['Enter Location', 'Payment Methods', 'Order Summary', 'Payments'];

  // ✅ Fetch addresses on mount
  useEffect(() => {
    dispatch(getUserAddresses());
  }, [dispatch]);

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleNext = () => {
    // Validation checks before proceeding
    if (activeStep === 0 && !selectedUserCheckoutAddress) {
      return toast.error('Please select checkout address before proceeding.');
    }
    if (activeStep === 1 && !paymentMethod) {
      return toast.error('Please select payment method before proceeding.');
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const isProceedDisabled =
    errorMessage ||
    (activeStep === 0 && !selectedUserCheckoutAddress) ||
    (activeStep === 1 && !paymentMethod);

  // ✅ styles
  const styles = {
    container: {
      padding: '20px',
    },
    heading: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '20px',
    },
    stepper: {
      marginBottom: '30px',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>My Checkout</h2>

      <Stepper activeStep={activeStep} alternativeLabel style={styles.stepper}>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel
              sx={{
                '& .MuiStepLabel-label': {
                  fontSize: '1rem',
                  color: activeStep === index ? '#1976d2' : '#999',
                  fontWeight: activeStep === index ? 'bold' : 'normal',
                },
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {isLoading ? (
        <div className="lg:w-[80%] mx-auto py-5">
          <Skeleton />
        </div>
      ) : (
        <div className="mt-5">
          {activeStep === 0 && <AddressInfo address={address} />}
          {activeStep === 1 && <PaymentMethod />}
          {activeStep === 2 && 
          <OrderSummary cart={cart}
           totalPrice={totalPrice}
           address={selectedUserCheckoutAddress} 
           paymentMethod={paymentMethod}   
            
           />}
          {activeStep === 3 && (
            <div>
              {paymentMethod === 'stripe' && <StripePayment />}
              {paymentMethod === 'paypal' && <PaypalPayment />}
            </div>
          )}
        </div>
      )}

      {/* Footer Controls */}
      <div
        className="flex justify-between items-center px-4 fixed z-50 h-24 bottom-0 bg-white left-0 w-full py-4 border-slate-200"
        style={{ boxShadow: '0 -2px 4px rgba(100, 100, 100, 0.15)' }}
      >
        <Button variant="outlined" disabled={activeStep === 0} onClick={handleBack}>
          Back
        </Button>

        {activeStep !== steps.length - 1 && (
          <button
            disabled={isProceedDisabled}
            className={`bg-customBlue font-semibold px-6 h-10 rounded-md text-white ${
              isProceedDisabled ? 'opacity-60' : ''
            }`}
            onClick={handleNext}
          >
            Proceed
          </button>
        )}
      </div>

      {/* Optional error page */}
      {errorMessage && <ErrorPage message={errorMessage} />}
    </div>
  );
};

export default CheckOut;
