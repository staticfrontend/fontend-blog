import React, { useState, useEffect } from 'react';

// 自定义表单hooks
function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue);
  return {
    value,
    onChange: event => setValue(event.target.value)
  }
}

function UseFormInputDemo() {
  const usernameInput = useFormInput('');
  const passwordInput = useFormInput('');
  const submitForm = event => {
    event.preventDefault();
    console.log(usernameInput.value, passwordInput.value);
  }

  return <form onSubmit={submitForm}>
    <input type="text" name="username" {...usernameInput} />
    <input type="password" name="password" {...passwordInput} />
    <input type="submit" />
  </form>
}

export default UseFormInputDemo;
