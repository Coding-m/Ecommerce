import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Step, StepLabel, Stepper, Skeleton, Button } from '@mui/material';
import { toast } from 'react-toastify';

// Custom components
import AddressInfo from './AddressInfo';
import PaymentMethod from './PaymentMethod';
console.log("PaymentMethod component:", PaymentMethod);


import OrderSummary from './OrderSummary';
import StripePayment from './StripePayment';
import PaypalPayment from './PaypalPayment';
import ErrorPage from './ErrorPage';

// Actions
import { getUserAddresses } from '../../store/actions';

const CheckOut = () => {
  const [activeStep, setActiveStep] = useState(0);
  const dispatch = useDispatch();

  const { isLoading, errorMessage } = useSelector((state) => state.errors);
  const { address, selectedUserCheckoutAddress } = useSelector((state) => state.auth);
  const { paymentMethod } = useSelector((state) => state.payment); // Ensure you have this in store
  //const { cart, totalPrice } = useSelector((state) => state.cart);
  const { cart, totalPrice } = useSelector((state) => state.carts);


  const steps = ['Enter Location', 'Payment Methods', 'Order Summary', 'Payments'];

  useEffect(() => {
    dispatch(getUserAddresses());
  }, [dispatch]);

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleNext = () => {
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

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>My Checkout</h2>

      <Stepper activeStep={activeStep} alternativeLabel style={styles.stepper}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel
              sx={{
                '& .MuiStepLabel-label': {
                  fontSize: '1rem',
                  color: activeStep === steps.indexOf(label) ? '#1976d2' : '#999',
                  fontWeight: activeStep === steps.indexOf(label) ? 'bold' : 'normal',
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
          {activeStep === 2 && (
            <OrderSummary
              totalPrice={totalPrice}
              cart={cart}
              address={selectedUserCheckoutAddress}
              paymentMethod={paymentMethod}
            />
          )}
          {activeStep === 3 && (
            <>
              {paymentMethod === 'Stripe' ? <StripePayment /> : <PaypalPayment />}
            </>
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

      {errorMessage && <ErrorPage message={errorMessage} />}
    </div>
  );
};

const styles = {
  container: {
    padding: '3rem',
    maxWidth: '1500px',
    margin: '50px auto',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
    fontFamily: 'Segoe UI, sans-serif',
  },
  heading: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '2rem',
    fontSize: '2rem',
    fontWeight: 600,
  },
  stepper: {
    backgroundColor: 'transparent',
  },
};

export default CheckOut;
