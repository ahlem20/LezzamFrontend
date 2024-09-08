import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QrScanner from 'react-qr-scanner'; // Import from react-qr-scanner
import { API_URL } from '../config/constants';

const QrScanners = () => {
  const [qrnumber, setQrnumber] = useState('');
  const [status, setStatus] = useState(''); // Track the status (OK, Error)
  const [scanned, setScanned] = useState(false); // Track whether the QR has been scanned
  const navigate = useNavigate();

  const previewStyle = {
    height: 240,
    width: 320,
  };

  const handleScan = async (result) => {
    if (result && result.text && !scanned) {
      const qrValue = result.text; // Extract the 'text' field from the result object
      setQrnumber(qrValue);
      setScanned(true); // Disable further scans

      try {
        const response = await fetch(`${API_URL}project/projects/activate`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ qrnumber: qrValue }),
        });

        const result = await response.json();
        if (response.ok) {
          setStatus('OK');
          alert('تم تفعيل المشروع بنجاح');
          navigate('/teacher'); 
        } else {
          setStatus('Error');
          alert(result.message || 'حدث خطأ أثناء تفعيل المشروع');
          setScanned(false); // Re-enable scanning if activation fails
        }
      } catch (err) {
        setStatus('Error');
        alert('فشل الاتصال بالخادم');
        setScanned(false); // Re-enable scanning if there is a network error
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
    setStatus('Error');
    alert('حدث خطأ أثناء قراءة الرمز');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-right" dir="rtl">
        <h2 className="text-xl font-bold mb-4 text-center">مسح رمز الاستجابة السريعة</h2>
        {/* Render the QrScanner component only if the QR code hasn't been scanned yet */}
        {!scanned && (
          <QrScanner
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={previewStyle}
          />
        )}
        {qrnumber && (
          <p className="mt-4 text-green-600">الرقم: {qrnumber}</p>
        )}
        {status && (
          <p className={`mt-4 ${status === 'OK' ? 'text-green-600' : 'text-red-600'}`}>
            {status === 'OK' ? 'تم بنجاح' : 'خطأ'}
          </p>
        )}
      </div>
    </div>
  );
};

export default QrScanners;
