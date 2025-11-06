import React from "react";
import Select from "react-select";

const WardSelect = ({ value, options, onChange, disabled, styles }) => (
  <div>
    <label className="block text-gray-700 font-medium">Phường/Xã</label>
    <Select
      name="ward"
      value={value ? { value, label: value } : null}
      onChange={onChange}
      options={options.map((w) => ({ value: w, label: w }))}
      isSearchable
      placeholder="-- Chọn phường/xã --"
      isDisabled={disabled}
      styles={styles}
      required
    />
  </div>
);

export default WardSelect;
