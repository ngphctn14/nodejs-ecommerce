import React from "react";
import Select from "react-select";

const ProvinceSelect = ({ value, options, onChange, styles }) => (
  <div>
    <label className="block text-gray-700 font-medium">Tỉnh/Thành phố</label>
    <Select
      name="province"
      value={value ? { value, label: value } : null}
      onChange={onChange}
      options={options.map((p) => ({ value: p, label: p }))}
      isSearchable
      placeholder="-- Chọn tỉnh/thành phố --"
      styles={styles}
      required
    />
  </div>
);

export default ProvinceSelect;
