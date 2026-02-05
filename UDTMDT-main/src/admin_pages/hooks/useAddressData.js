import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

import DATA_JSON from '../assets/js/data-location.json';

let cache = null;

const useAddressData = () => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(false);

  // Tải dữ liệu chính
  useEffect(() => {
    const fetchData = () => {
      if (cache) {
        setProvinces(cache);
        return;
      }
      try {
        setLoading(true);
        cache = DATA_JSON; 
        setProvinces(DATA_JSON);
      } catch (error) {
        console.error('Failed to load address data', error);
        toast.error('Không thể tải dữ liệu địa chỉ.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Cập nhật Huyện khi Tỉnh thay đổi
  const handleProvinceChange = (provinceCode) => {
    if (!provinceCode) {
      setDistricts([]);
      setWards([]);
      return;
    }
    const selectedProvince = cache.find(p => p.Id === provinceCode);
    setDistricts(selectedProvince?.Districts || []);
    setWards([]); // Reset Phường/Xã
  };

  // Cập nhật Phường/Xã khi Huyện thay đổi
  const handleDistrictChange = (districtCode) => {
    if (!districtCode) {
      setWards([]);
      return;
    }
    const selectedDistrict = districts.find(d => d.Id === districtCode);
    setWards(selectedDistrict?.Wards || []);
  };

  return {
    provinces,
    districts,
    wards,
    handleProvinceChange,
    handleDistrictChange,
    loading,
    // Hàm để tải district/ward khi edit
    setInitialDistricts: (provinceCode) => {
       if (!cache) return;
       const selectedProvince = cache.find(p => p.Id === provinceCode);
       setDistricts(selectedProvince?.Districts || []);
    },
    setInitialWards: (provinceCode, districtCode) => {
        if (!cache) return;
        const selectedProvince = cache.find(p => p.Id === provinceCode);
        const selectedDistrict = selectedProvince?.Districts.find(d => d.Id === districtCode);
        setWards(selectedDistrict?.Wards || []);
    }
  };
};

export default useAddressData;