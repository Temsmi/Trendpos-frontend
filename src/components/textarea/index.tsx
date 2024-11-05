import React from 'react';

interface TextareaProps {
  label?: string;
  placeholder?: string;
  name: string;
  value: string;
  id?: string;
  ref?: React.Ref<HTMLTextAreaElement>;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const Textarea: React.FC<TextareaProps> = ({ label, placeholder, name, value,id,onChange }) => {
  return (
    <div className='textarea-wrapper'>
      {label && <label htmlFor={name}>{label}</label>}
      <textarea rows={4} cols={40}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500'

        // className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 
        // dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
      />
    </div>
  );
};

export default Textarea;
