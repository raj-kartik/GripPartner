import React, { useState, useCallback, useEffect } from 'react';
import CustomToastUI from './CustomToastUI';

let toastFn: any = null;

const ToastManager = () => {
  const [toastOptions, setToastOptions] = useState<any>(null);

  const show = useCallback((options:any) => {
    setToastOptions({ ...options, key: Date.now() });
  }, []);

  useEffect(() => {
    toastFn = show;
    return () => {
      toastFn = null;
    };
  }, [show]);

  const handleHide = () => {
    setToastOptions(null);
  };

  return toastOptions ? (
    <CustomToastUI {...toastOptions} onHide={handleHide} />
  ) : null;
};

// The function you call
const CustomToast = (options: any) => {
  if (toastFn) {
    toastFn(options);
  } else {
    console.warn('Toast system not initialized yet.');
  }
};

// Export both
CustomToast.ToastManager = ToastManager;

export default CustomToast;
