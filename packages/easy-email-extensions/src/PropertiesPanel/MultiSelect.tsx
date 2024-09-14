import React, { useState } from 'react';
import Select from 'react-select';
import { components } from 'react-select';

const emailOptions = [
  { value: 'john@example.com', label: 'john@example.com' },
  { value: 'jane@example.com', label: 'jane@example.com' },
  { value: 'doe@example.com', label: 'doe@example.com' },
];

const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export function MultiAutocomplete({ isMulti, selectedEmailList, handleChange, name }) {
  const [selectedEmails, setSelectedEmails] = useState([selectedEmailList]);

  const handleEmailChange = (selectedOptions) => {
    setSelectedEmails(selectedOptions || []);
    handleChange(name, selectedOptions);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      const inputValue = event.target.value.trim();
      if (isValidEmail(inputValue)) {
        const newEmail = { value: inputValue, label: inputValue };
        setSelectedEmails([...selectedEmails, newEmail]);
        event.target.value = ''; // Clear input
      }
    }
  };

  return (
    <div>
      <Select
        isMulti={isMulti}
        options={emailOptions}
        value={selectedEmails}
        onChange={handleEmailChange}
        placeholder="Add email recipients..."
        noOptionsMessage={() => "No email found"}
        components={{ Input: (props) => <components.Input {...props} onKeyDown={handleKeyDown} /> }}
      />
    </div>
  );
};