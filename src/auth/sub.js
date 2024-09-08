import React, { useState } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const SubscribePage = () => {
  const [packages, setPackages] = useState([
    {
      id: 3,
      name: 'باقة أساسية',
      price: '1000السنة/ دج',
      selected: false,
      features: [
        { label: 'قيمة الاشتراك  ', ok: true },
        { label: 'خاصية الاستعمال بدون انترنت', ok: true },
        { label: 'خاصية كشف تطابق الاعمال', ok: true },
        { label: 'اسبوع تجربة مجانية مع خصم 10%', ok: true },
        { label: 'ظهور الاعلانات', ok: true },
        { label: 'ارسال اشعارات للطلبة', ok: false },
        { label: 'اضافة عدد غير محدود للوثائق', ok: false },
      ],
    },
    {
      id: 2,
      name: 'باقة معيارية',
      price: '2000السنة/ دج',
      selected: false,
      features: [
        { label: 'قيمة الاشتراك  ', ok: true },
        { label: 'خاصية الاستعمال بدون انترنت', ok: true },
        { label: 'خاصية كشف تطابق الاعمال', ok: true },
        { label: 'اسبوع تجربة مجانية مع خصم 5%', ok: true },
        { label: 'عدم ظهور الاعلانات ', ok: true },
        { label: 'ارسال اشعارات للطلبة', ok: true },
        { label: 'اضافة عدد غير محدود للوثائق', ok: false },
      ],
    },
    {
      id: 1,
      name: 'باقة ممتازة',
      price: '3000السنة/ دج',
      selected: false,
      features: [
        { label: 'قيمة الاشتراك  ', ok: true },
        { label: 'خاصية الاستعمال بدون انترنت', ok: true },
        { label: 'خاصية كشف تطابق الاعمال', ok: true },
        { label: 'اسبوع تجربة مجانية مع خصم 0%', ok: true },
        { label: 'عدم ظهور الاعلانات', ok: true },
        { label: 'ارسال اشعارات للطلبة', ok: true },
        { label: 'اضافة عدد غير محدود للوثائق', ok: true },
      ],
    },
  ]);

  const [showSignInPopup, setShowSignInPopup] = useState(false);

  const openSignInPopup = () => {
    setShowSignInPopup(true);
  };

  const closeSignInPopup = () => {
    setShowSignInPopup(false);
  };

  const handlePackageSelection = (id) => {
    const updatedPackages = packages.map((packageItem) => ({
      ...packageItem,
      selected: packageItem.id === id,
    }));
    setPackages(updatedPackages);
  };

  const selectedPackage = packages.find((packageItem) => packageItem.selected);

  return (
    <div className="bg-gray-100 flex flex-col justify-center rtl font-DM"> 
      {/* Apply the 'font-DM' class */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold mb-4 font-DM text-center">اختر خطة</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {packages.map((packageItem) => (
            <div
              key={packageItem.id}
              className={`border rounded-lg p-6 hover:shadow-md transition duration-300 ${
                packageItem.selected ? 'border-blue-500' : 'border-gray-200'
              }`}
            >
              <h2 className="text-xl font-semibold">{packageItem.name}</h2>
              <p className="text-3xl mt-4">{packageItem.price}</p>
              <ul className="mt-6 text-gray-700 font-DM">
                {packageItem.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    {feature.ok ? (
                      <FaCheckCircle className="text-green-500" />
                    ) : (
                      <FaTimesCircle className="text-red-500" />
                    )}
                    <span>{feature.label}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center">
                <input
                  type="radio"
                  name="package"
                  id={`package-${packageItem.id}`}
                  checked={packageItem.selected}
                  onChange={() => handlePackageSelection(packageItem.id)}
                  className="mr-2"
                />
                <label htmlFor={`package-${packageItem.id}`} className="text-gray-700 font-DM">
                  اختر هذا العرض
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscribePage;
